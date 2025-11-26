// ===== Navigation модуль =====

import { selectData, insertData, updateData, deleteData } from '../core/supabase.js';
import { TABLES } from '../core/config.js';
import { createTable, createForm, createModal, showModal, closeModal, showNotification, confirmAction } from '../core/ui.js';

let navigationData = [];

/**
 * Рендер Navigation
 */
export async function renderNavigation() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="table-container">
            <div class="table-header">
                <h3 class="table-title">Навигационное меню</h3>
                <button id="addNavBtn" class="btn btn-success">+ Добавить пункт</button>
            </div>
            <div id="navigationTable">
                <div class="loading">
                    <div class="loading-spinner"></div>
                </div>
            </div>
        </div>
    `;
    
    // Add button handler
    document.getElementById('addNavBtn').addEventListener('click', () => openNavModal());
    
    // Load data
    await loadNavigationData();
}

/**
 * Загрузка данных навигации
 */
async function loadNavigationData() {
    const tableContainer = document.getElementById('navigationTable');
    
    try {
        const result = await selectData(TABLES.navigation, {
            order: { column: 'order_index', ascending: true }
        });
        
        if (result.error) {
            throw result.error;
        }
        
        navigationData = result.data || [];
        
        // Separate parent and child items
        const parentItems = navigationData.filter(item => !item.parent_id);
        const childItems = navigationData.filter(item => item.parent_id);
        
        // Build hierarchical structure
        const hierarchicalData = parentItems.map(parent => {
            const children = childItems.filter(child => child.parent_id === parent.id);
            return { ...parent, children };
        });
        
        renderNavigationTable(hierarchicalData);
        
    } catch (error) {
        console.error('Error loading navigation:', error);
        tableContainer.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #e53e3e;">
                <p>Ошибка загрузки данных. Проверьте подключение к Supabase.</p>
                <p style="font-size: 12px; margin-top: 8px;">${error.message}</p>
            </div>
        `;
    }
}

/**
 * Рендер таблицы навигации
 */
function renderNavigationTable(data) {
    const tableContainer = document.getElementById('navigationTable');
    
    if (data.length === 0) {
        tableContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🧭</div>
                <div class="empty-state-text">Нет пунктов меню</div>
                <button class="btn btn-primary mt-4" onclick="document.getElementById('addNavBtn').click()">
                    Создать первый пункт
                </button>
            </div>
        `;
        return;
    }
    
    let html = '<table class="table"><thead><tr><th>Название</th><th>URL</th><th>Порядок</th><th>Действия</th></tr></thead><tbody>';
    
    data.forEach(item => {
        const hasChildren = item.children && item.children.length > 0;
        const urlDisplay = hasChildren ? '<span class="text-muted">—</span>' : (item.url || '—');
        
        html += `
            <tr data-id="${item.id}">
                <td><strong>${item.label}</strong></td>
                <td>${urlDisplay}</td>
                <td>${item.order_index}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-secondary" onclick="window.editNavItem('${item.id}')">Изменить</button>
                        <button class="btn btn-sm btn-success" onclick="window.addSubNavItem('${item.id}')">+ Подпункт</button>
                        <button class="btn btn-sm btn-danger" onclick="window.deleteNavItem('${item.id}')">Удалить</button>
                    </div>
                </td>
            </tr>
        `;
        
        // Render children
        if (hasChildren) {
            item.children.forEach(child => {
                html += `
                    <tr class="nested-item" data-id="${child.id}">
                        <td>${child.label}</td>
                        <td>${child.url || '—'}</td>
                        <td>${child.order_index}</td>
                        <td>
                            <div class="table-actions">
                                <button class="btn btn-sm btn-secondary" onclick="window.editNavItem('${child.id}')">Изменить</button>
                                <button class="btn btn-sm btn-danger" onclick="window.deleteNavItem('${child.id}')">Удалить</button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
    });
    
    html += '</tbody></table>';
    tableContainer.innerHTML = html;
}

/**
 * Открыть модальное окно для добавления/редактирования
 */
function openNavModal(itemId = null, parentId = null) {
    const item = itemId ? navigationData.find(i => i.id === itemId) : null;
    const isEdit = !!item;
    
    const fields = [
        {
            name: 'label',
            label: 'Название пункта',
            type: 'text',
            required: true,
            value: item?.label || ''
        },
        {
            name: 'url',
            label: 'URL',
            type: 'text',
            placeholder: '/about',
            value: item?.url || ''
        },
        {
            name: 'order_index',
            label: 'Порядок',
            type: 'number',
            required: true,
            value: item?.order_index || 0
        }
    ];
    
    const form = createForm(fields, async (data) => {
        const navData = {
            label: data.label,
            url: data.url,
            order_index: parseInt(data.order_index),
            parent_id: parentId || item?.parent_id || null
        };
        
        let result;
        if (isEdit) {
            result = await updateData(TABLES.navigation, itemId, navData);
        } else {
            result = await insertData(TABLES.navigation, navData);
        }
        
        if (result.error) {
            showNotification('Ошибка сохранения: ' + result.error.message, 'error');
        } else {
            showNotification('Сохранено успешно', 'success');
            closeModal(modal);
            await loadNavigationData();
        }
    });
    
    const modal = createModal(
        isEdit ? 'Редактировать пункт' : (parentId ? 'Добавить подпункт' : 'Добавить пункт'),
        form.outerHTML
    );
    
    showModal(modal);
    
    // Re-attach form handlers
    const modalForm = modal.querySelector('form');
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(modalForm);
        const data = Object.fromEntries(formData);
        
        const navData = {
            label: data.label,
            url: data.url,
            order_index: parseInt(data.order_index),
            parent_id: parentId || item?.parent_id || null
        };
        
        let result;
        if (isEdit) {
            result = await updateData(TABLES.navigation, itemId, navData);
        } else {
            result = await insertData(TABLES.navigation, navData);
        }
        
        if (result.error) {
            showNotification('Ошибка сохранения: ' + result.error.message, 'error');
        } else {
            showNotification('Сохранено успешно', 'success');
            closeModal(modal);
            await loadNavigationData();
        }
    });
    
    modal.querySelector('.cancel-btn').addEventListener('click', () => closeModal(modal));
}

/**
 * Удалить пункт навигации
 */
async function deleteNavItem(itemId) {
    if (!confirmAction('Вы уверены, что хотите удалить этот пункт?')) {
        return;
    }
    
    const result = await deleteData(TABLES.navigation, itemId);
    
    if (result.error) {
        showNotification('Ошибка удаления: ' + result.error.message, 'error');
    } else {
        showNotification('Удалено успешно', 'success');
        await loadNavigationData();
    }
}

// Expose functions to window for onclick handlers
window.editNavItem = (id) => openNavModal(id);
window.addSubNavItem = (parentId) => openNavModal(null, parentId);
window.deleteNavItem = deleteNavItem;
