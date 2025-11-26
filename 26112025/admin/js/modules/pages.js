// ===== Pages модуль =====

import { selectData, insertData, updateData, deleteData } from '../core/supabase.js';
import { TABLES } from '../core/config.js';
import { createForm, createModal, showModal, closeModal, showNotification, confirmAction } from '../core/ui.js';

let pagesData = [];

/**
 * Рендер Pages
 */
export async function renderPages() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="table-container">
            <div class="table-header">
                <h3 class="table-title">Страницы</h3>
                <button id="addPageBtn" class="btn btn-success">+ Добавить страницу</button>
            </div>
            <div id="pagesTable">
                <div class="loading">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        </div>
    `;
    
    // Add button handler
    document.getElementById('addPageBtn').addEventListener('click', () => openPageModal());
    
    // Load data
    await loadPagesData();
}

/**
 * Загрузка данных страниц
 */
async function loadPagesData() {
    const tableContainer = document.getElementById('pagesTable');
    
    try {
        const result = await selectData(TABLES.pages, {
            order: { column: 'order_index', ascending: true }
        });
        
        if (result.error) {
            throw result.error;
        }
        
        pagesData = result.data || [];
        renderPagesTable(pagesData);
        
    } catch (error) {
        console.error('Error loading pages:', error);
        tableContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #e53e3e;">
                <p>Ошибка загрузки данных. Проверьте подключение к Supabase.</p>
                <p style="font-size: 12px; margin-top: 8px;">${error.message}</p>
            </div>
        `;
    }
}

/**
 * Рендер таблицы страниц
 */
function renderPagesTable(data) {
    const tableContainer = document.getElementById('pagesTable');
    
    if (data.length === 0) {
        tableContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <div class="empty-state-text">Нет страниц</div>
                <button class="btn btn-primary mt-4" onclick="document.getElementById('addPageBtn').click()">
                    Создать первую страницу
                </button>
            </div>
        `;
        return;
    }
    
    let html = '<table class="table"><thead><tr><th>Название</th><th>Slug</th><th>Порядок</th><th>Действия</th></tr></thead><tbody>';
    
    data.forEach(page => {
        html += `
            <tr data-id="${page.id}">
                <td><strong>${page.title}</strong></td>
                <td><code>${page.slug}</code></td>
                <td>${page.order_index}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.editPage('${page.id}')">Изменить</button>
                        <button class="btn btn-sm btn-danger" onclick="window.deletePage('${page.id}')">Удалить</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    tableContainer.innerHTML = html;
}

/**
 * Открыть модальное окно для добавления/редактирования
 */
function openPageModal(pageId = null) {
    const page = pageId ? pagesData.find(p => p.id === pageId) : null;
    const isEdit = !!page;
    
    const fields = [
        {
            name: 'title',
            label: 'Название страницы',
            type: 'text',
            required: true,
            value: page?.title || ''
        },
        {
            name: 'slug',
            label: 'URL slug',
            type: 'text',
            required: true,
            placeholder: 'about',
            value: page?.slug || ''
        },
        {
            name: 'order_index',
            label: 'Порядок отображения',
            type: 'number',
            required: true,
            value: page?.order_index || 0
        }
    ];
    
    const form = createForm(fields, async (data) => {
        const pageData = {
            title: data.title,
            slug: data.slug.startsWith('/') ? data.slug : '/' + data.slug,
            order_index: parseInt(data.order_index)
        };
        
        let result;
        if (isEdit) {
            result = await updateData(TABLES.pages, pageId, pageData);
        } else {
            result = await insertData(TABLES.pages, pageData);
        }
        
        if (result.error) {
            showNotification('Ошибка сохранения: ' + result.error.message, 'error');
        } else {
            showNotification('Сохранено успешно', 'success');
            closeModal(modal);
            await loadPagesData();
        }
    });
    
    const modal = createModal(
        isEdit ? 'Редактировать страницу' : 'Добавить страницу',
        form.outerHTML
    );
    
    showModal(modal);
    
    // Re-attach form handlers
    const modalForm = modal.querySelector('form');
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(modalForm);
        const data = Object.fromEntries(formData);
        
        const pageData = {
            title: data.title,
            slug: data.slug.startsWith('/') ? data.slug : '/' + data.slug,
            order_index: parseInt(data.order_index)
        };
        
        let result;
        if (isEdit) {
            result = await updateData(TABLES.pages, pageId, pageData);
        } else {
            result = await insertData(TABLES.pages, pageData);
        }
        
        if (result.error) {
            showNotification('Ошибка сохранения: ' + result.error.message, 'error');
        } else {
            showNotification('Сохранено успешно', 'success');
            closeModal(modal);
            await loadPagesData();
        }
    });
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => closeModal(modal));
}

/**
 * Удалить страницу и связанные секции
 */
async function deletePage(pageId) {
    if (!confirmAction('Вы уверены? Это также удалит все секции на этой странице.')) {
        return;
    }
    
    try {
        // First, get all sections for this page
        const sectionsResult = await selectData(TABLES.sections, {
            eq: { page_id: pageId }
        });
        
        if (sectionsResult.data && sectionsResult.data.length > 0) {
            // Delete section content for each section
            for (const section of sectionsResult.data) {
                await deleteData(TABLES.sectionContent, section.id);
            }
            
            // Delete sections
            for (const section of sectionsResult.data) {
                await deleteData(TABLES.sections, section.id);
            }
        }
        
        // Finally delete the page
        const result = await deleteData(TABLES.pages, pageId);
        
        if (result.error) {
            throw result.error;
        }
        
        showNotification('Страница и связанные секции удалены', 'success');
        await loadPagesData();
        
    } catch (error) {
        console.error('Error deleting page:', error);
        showNotification('Ошибка удаления: ' + error.message, 'error');
    }
}

// Expose functions to window for onclick handlers
window.editPage = (id) => openPageModal(id);
window.deletePage = deletePage;
