// ===== Sections модуль =====

import { selectData, insertData, updateData, deleteData, getSupabase } from '../core/supabase.js';
import { TABLES } from '../core/config.js';
import { createModal, showModal, closeModal, showNotification, confirmAction } from '../core/ui.js';

let sectionsData = [];
let pagesData = [];
let currentPageId = null;

/**
 * Рендер Sections
 */
export async function renderSections() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div style="margin-bottom: 24px;">
            <label for="pageSelect" style="font-weight: 500; margin-bottom: 8px; display: block;">Выберите страницу:</label>
            <select id="pageSelect" style="padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; min-width: 300px;">
                <option value="">Загрузка...</option>
            </select>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h3 class="table-title">Секции</h3>
                <button id="addSectionBtn" class="btn btn-success" disabled>+ Добавить секцию</button>
            </div>
            <div id="sectionsTable">
                <div class="empty-state">
                    <div class="empty-state-icon">🧩</div>
                    <div class="empty-state-text">Выберите страницу для управления секциями</div>
                </div>
            </div>
        </div>
    `;
    
    // Load pages for dropdown
    await loadPages();
    
    // Page select handler
    const pageSelect = document.getElementById('pageSelect');
    pageSelect.addEventListener('change', async (e) => {
        currentPageId = e.target.value;
        if (currentPageId) {
            document.getElementById('addSectionBtn').disabled = false;
            await loadSectionsData(currentPageId);
        } else {
            document.getElementById('addSectionBtn').disabled = true;
            document.getElementById('sectionsTable').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🧩</div>
                    <div class="empty-state-text">Выберите страницу</div>
                </div>
            `;
        }
    });
    
    // Add button handler
    document.getElementById('addSectionBtn').addEventListener('click', () => openSectionModal());
}

/**
 * Загрузка списка страниц
 */
async function loadPages() {
    try {
        const result = await selectData(TABLES.pages, {
            order: { column: 'order_index', ascending: true }
        });
        
        if (result.error) {
            throw result.error;
        }
        
        pagesData = result.data || [];
        
        const pageSelect = document.getElementById('pageSelect');
        if (pagesData.length === 0) {
            pageSelect.innerHTML = '<option value="">Нет страниц</option>';
        } else {
            pageSelect.innerHTML = `
                <option value="">-- Выберите страницу --</option>
                ${pagesData.map(page => `<option value="${page.id}">${page.title}</option>`).join('')}
            `;
        }
        
    } catch (error) {
        console.error('Error loading pages:', error);
        document.getElementById('pageSelect').innerHTML = '<option value="">Ошибка загрузки</option>';
    }
}

/**
 * Загрузка секций для страницы
 */
async function loadSectionsData(pageId) {
    const tableContainer = document.getElementById('sectionsTable');
    tableContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
    
    try {
        const result = await selectData(TABLES.sections, {
            eq: { page_id: pageId },
            order: { column: 'order_index', ascending: true }
        });
        
        if (result.error) {
            throw result.error;
        }
        
        sectionsData = result.data || [];
        
        // Load content for each section
        for (const section of sectionsData) {
            const contentResult = await selectData(TABLES.sectionContent, {
                eq: { section_id: section.id }
            });
            section.content = contentResult.data || [];
        }
        
        renderSectionsTable(sectionsData);
        
    } catch (error) {
        console.error('Error loading sections:', error);
        tableContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #e53e3e;">
                <p>Ошибка загрузки данных</p>
                <p style="font-size: 12px; margin-top: 8px;">${error.message}</p>
            </div>
        `;
    }
}

/**
 * Рендер таблицы секций
 */
function renderSectionsTable(data) {
    const tableContainer = document.getElementById('sectionsTable');
    
    if (data.length === 0) {
        tableContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🧩</div>
                <div class="empty-state-text">Нет секций на этой странице</div>
                <button class="btn btn-primary mt-4" onclick="document.getElementById('addSectionBtn').click()">
                    Создать первую секцию
                </button>
            </div>
        `;
        return;
    }
    
    let html = '<table class="table"><thead><tr><th>Тип</th><th>Порядок</th><th>Контент</th><th>Действия</th></tr></thead><tbody>';
    
    data.forEach(section => {
        const contentCount = section.content ? section.content.length : 0;
        html += `
            <tr data-id="${section.id}">
                <td><span class="badge badge-success">${section.type}</span></td>
                <td>${section.order_index}</td>
                <td>${contentCount} элемент(ов)</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.editSection('${section.id}')">Изменить</button>
                        <button class="btn btn-sm btn-danger" onclick="window.deleteSection('${section.id}')">Удалить</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    tableContainer.innerHTML = html;
}

/**
 * Открыть модальное окно для добавления/редактирования секции
 */
function openSectionModal(sectionId = null) {
    const section = sectionId ? sectionsData.find(s => s.id === sectionId) : null;
    const isEdit = !!section;
    
    const modalContent = `
        <form id="sectionForm">
            <div class="form-row">
                <label for="sectionType">Тип секции</label>
                <select id="sectionType" name="type" required>
                    <option value="hero" ${section?.type === 'hero' ? 'selected' : ''}>Hero</option>
                    <option value="text" ${section?.type === 'text' ? 'selected' : ''}>Текст</option>
                    <option value="features" ${section?.type === 'features' ? 'selected' : ''}>Возможности</option>
                    <option value="gallery" ${section?.type === 'gallery' ? 'selected' : ''}>Галерея</option>
                    <option value="cta" ${section?.type === 'cta' ? 'selected' : ''}>Call to Action</option>
                    <option value="custom" ${section?.type === 'custom' ? 'selected' : ''}>Пользовательская</option>
                </select>
            </div>
            
            <div class="form-row">
                <label for="orderIndex">Порядок</label>
                <input type="number" id="orderIndex" name="order_index" value="${section?.order_index || 0}" required />
            </div>
            
            <div style="margin: 24px 0; padding: 16px; background: #f7fafc; border-radius: 8px;">
                <h4 style="margin-bottom: 12px; font-size: 14px;">Контент секции</h4>
                <div id="contentFields"></div>
                <button type="button" id="addContentField" class="btn btn-sm btn-secondary mt-4">+ Добавить поле</button>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Сохранить</button>
                <button type="button" class="btn btn-secondary cancel-btn">Отмена</button>
            </div>
        </form>
    `;
    
    const modal = createModal(
        isEdit ? 'Редактировать секцию' : 'Добавить секцию',
        modalContent
    );
    
    showModal(modal);
    
    // Render existing content fields
    if (section && section.content) {
        section.content.forEach(item => {
            addContentField(item.key, JSON.stringify(item.value));
        });
    }
    
    // Add content field button
    modal.querySelector('#addContentField').addEventListener('click', () => {
        addContentField();
    });
    
    // Form submit
    modal.querySelector('#sectionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveSectionData(modal, sectionId, isEdit);
    });
    
    // Cancel button
    modal.querySelector('.cancel-btn').addEventListener('click', () => closeModal(modal));
}

/**
 * Добавить поле контента
 */
function addContentField(key = '', value = '') {
    const contentFields = document.getElementById('contentFields');
    const fieldId = 'field_' + Date.now();
    
    const fieldHTML = `
        <div class="content-field" style="display: flex; gap: 12px; margin-bottom: 12px;" data-field-id="${fieldId}">
            <input 
                type="text" 
                placeholder="Ключ (например: title)" 
                value="${key}"
                style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;"
                class="field-key"
            />
            <input 
                type="text" 
                placeholder="Значение (JSON)" 
                value="${value}"
                style="flex: 2; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;"
                class="field-value"
            />
            <button 
                type="button" 
                onclick="this.parentElement.remove()"
                style="padding: 8px 12px; background: #f56565; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;"
            >
                ✕
            </button>
        </div>
    `;
    
    contentFields.insertAdjacentHTML('beforeend', fieldHTML);
}

/**
 * Сохранить данные секции
 */
async function saveSectionData(modal, sectionId, isEdit) {
    const form = modal.querySelector('#sectionForm');
    const formData = new FormData(form);
    
    const sectionData = {
        type: formData.get('type'),
        order_index: parseInt(formData.get('order_index')),
        page_id: currentPageId
    };
    
    try {
        let savedSection;
        
        if (isEdit) {
            const result = await updateData(TABLES.sections, sectionId, sectionData);
            if (result.error) throw result.error;
            savedSection = result.data[0];
            
            // Delete old content
            const supabase = await getSupabase();
            await supabase.from(TABLES.sectionContent).delete().eq('section_id', sectionId);
        } else {
            const result = await insertData(TABLES.sections, sectionData);
            if (result.error) throw result.error;
            savedSection = result.data[0];
        }
        
        // Save content fields
        const contentFields = modal.querySelectorAll('.content-field');
        for (const field of contentFields) {
            const key = field.querySelector('.field-key').value;
            const valueStr = field.querySelector('.field-value').value;
            
            if (key && valueStr) {
                try {
                    const value = JSON.parse(valueStr);
                    const contentData = {
                        section_id: savedSection.id,
                        key: key,
                        value: value
                    };
                    await insertData(TABLES.sectionContent, contentData);
                } catch (e) {
                    // If not valid JSON, save as string
                    const contentData = {
                        section_id: savedSection.id,
                        key: key,
                        value: { text: valueStr }
                    };
                    await insertData(TABLES.sectionContent, contentData);
                }
            }
        }
        
        showNotification('Секция сохранена', 'success');
        closeModal(modal);
        await loadSectionsData(currentPageId);
        
    } catch (error) {
        console.error('Error saving section:', error);
        showNotification('Ошибка сохранения: ' + error.message, 'error');
    }
}

/**
 * Удалить секцию
 */
async function deleteSection(sectionId) {
    if (!confirmAction('Удалить эту секцию и весь её контент?')) {
        return;
    }
    
    try {
        // Delete content first
        const supabase = await getSupabase();
        await supabase.from(TABLES.sectionContent).delete().eq('section_id', sectionId);
        
        // Delete section
        const result = await deleteData(TABLES.sections, sectionId);
        if (result.error) throw result.error;
        
        showNotification('Секция удалена', 'success');
        await loadSectionsData(currentPageId);
        
    } catch (error) {
        console.error('Error deleting section:', error);
        showNotification('Ошибка удаления: ' + error.message, 'error');
    }
}

// Expose functions to window
window.editSection = (id) => openSectionModal(id);
window.deleteSection = deleteSection;
window.addContentField = addContentField;
