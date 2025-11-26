// ===== UI вспомогательные функции =====

/**
 * Показать уведомление
 */
export function showNotification(message, type = 'info') {
    // Simple alert for now - can be enhanced later
    const styles = {
        info: '💡',
        success: '✅',
        error: '❌',
        warning: '⚠️'
    };
    
    const icon = styles[type] || styles.info;
    alert(`${icon} ${message}`);
}

/**
 * Подтверждение действия
 */
export function confirmAction(message) {
    return confirm(message);
}

/**
 * Создать модальное окно
 */
export function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    return modal;
}

/**
 * Показать модальное окно
 */
export function showModal(modal) {
    modal.classList.add('active');
}

/**
 * Закрыть модальное окно
 */
export function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

/**
 * Создать форму
 */
export function createForm(fields, onSubmit) {
    const formHTML = fields.map(field => {
        if (field.type === 'textarea') {
            return `
                <div class="form-row">
                    <label for="${field.name}">${field.label}</label>
                    <textarea 
                        id="${field.name}" 
                        name="${field.name}"
                        ${field.required ? 'required' : ''}
                        placeholder="${field.placeholder || ''}"
                    >${field.value || ''}</textarea>
                </div>
            `;
        } else if (field.type === 'select') {
            const options = field.options.map(opt => 
                `<option value="${opt.value}" ${opt.value === field.value ? 'selected' : ''}>${opt.label}</option>`
            ).join('');
            return `
                <div class="form-row">
                    <label for="${field.name}">${field.label}</label>
                    <select 
                        id="${field.name}" 
                        name="${field.name}"
                        ${field.required ? 'required' : ''}
                    >
                        ${options}
                    </select>
                </div>
            `;
        } else {
            return `
                <div class="form-row">
                    <label for="${field.name}">${field.label}</label>
                    <input 
                        type="${field.type || 'text'}" 
                        id="${field.name}" 
                        name="${field.name}"
                        value="${field.value || ''}"
                        ${field.required ? 'required' : ''}
                        placeholder="${field.placeholder || ''}"
                    />
                </div>
            `;
        }
    }).join('');
    
    const form = document.createElement('form');
    form.innerHTML = `
        ${formHTML}
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Сохранить</button>
            <button type="button" class="btn btn-secondary cancel-btn">Отмена</button>
        </div>
    `;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        onSubmit(data);
    });
    
    return form;
}

/**
 * Создать таблицу
 */
export function createTable(columns, data, actions = []) {
    const thead = `
        <thead>
            <tr>
                ${columns.map(col => `<th>${col.label}</th>`).join('')}
                ${actions.length > 0 ? '<th>Действия</th>' : ''}
            </tr>
        </thead>
    `;
    
    const tbody = `
        <tbody>
            ${data.length === 0 ? `
                <tr>
                    <td colspan="${columns.length + (actions.length > 0 ? 1 : 0)}" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">📋</div>
                            <div class="empty-state-text">Нет данных</div>
                        </div>
                    </td>
                </tr>
            ` : data.map(row => `
                <tr data-id="${row.id || ''}">
                    ${columns.map(col => {
                        let value = row[col.field];
                        if (col.render) {
                            value = col.render(value, row);
                        }
                        return `<td>${value !== null && value !== undefined ? value : ''}</td>`;
                    }).join('')}
                    ${actions.length > 0 ? `
                        <td>
                            <div class="table-actions">
                                ${actions.map(action => `
                                    <button 
                                        class="btn btn-sm btn-${action.variant || 'secondary'}" 
                                        data-action="${action.name}"
                                        data-id="${row.id}"
                                    >
                                        ${action.label}
                                    </button>
                                `).join('')}
                            </div>
                        </td>
                    ` : ''}
                </tr>
            `).join('')}
        </tbody>
    `;
    
    return `<table class="table">${thead}${tbody}</table>`;
}

/**
 * Форматирование даты
 */
export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Escaping HTML
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
