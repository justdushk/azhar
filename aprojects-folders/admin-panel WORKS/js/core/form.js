// Form utilities
const Form = {
  // Create a modal form
  showModal(title, fields, onSubmit) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="modal-form">
            ${this.renderFields(fields)}
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary modal-cancel">Отмена</button>
          <button type="submit" form="modal-form" class="btn btn-primary">Сохранить</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close handlers
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    // Form submit handler
    const form = modal.querySelector('#modal-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = this.getFormData(form, fields);
      
      try {
        await onSubmit(formData);
        closeModal();
      } catch (error) {
        UI.showError(error.message);
      }
    });
    
    // Focus first input
    const firstInput = form.querySelector('input, textarea, select');
    if (firstInput) firstInput.focus();
  },
  
  // Render form fields
  renderFields(fields) {
    return fields.map(field => {
      let input = '';
      
      switch (field.type) {
        case 'textarea':
          input = `<textarea name="${field.name}" 
                    ${field.required ? 'required' : ''}
                    placeholder="${field.placeholder || ''}">${field.value || ''}</textarea>`;
          break;
        
        case 'select':
          input = `<select name="${field.name}" ${field.required ? 'required' : ''}>
                    ${field.options.map(opt => 
                      `<option value="${opt.value}" ${opt.value === field.value ? 'selected' : ''}>
                        ${opt.label}
                      </option>`
                    ).join('')}
                  </select>`;
          break;
        
        case 'number':
          input = `<input type="number" name="${field.name}" 
                    value="${field.value || ''}"
                    ${field.required ? 'required' : ''}
                    placeholder="${field.placeholder || ''}">`;
          break;
        
        default:
          input = `<input type="${field.type || 'text'}" name="${field.name}" 
                    value="${field.value || ''}"
                    ${field.required ? 'required' : ''}
                    placeholder="${field.placeholder || ''}">`;
      }
      
      return `
        <div class="form-group">
          <label>${field.label}${field.required ? ' *' : ''}</label>
          ${input}
        </div>
      `;
    }).join('');
  },
  
  // Get form data
  getFormData(form, fields) {
    const formData = new FormData(form);
    const data = {};
    
    fields.forEach(field => {
      let value = formData.get(field.name);
      
      // Convert empty strings to null for optional fields
      if (value === '' && !field.required) {
        value = null;
      }
      
      // Type conversion
      if (field.type === 'number' && value !== null && value !== '') {
        value = parseInt(value, 10);
      }
      
      data[field.name] = value;
    });
    
    return data;
  }
};

// Make Form globally available
window.Form = Form;
