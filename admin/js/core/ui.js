// UI Helper utilities
const UI = {
  // Show loading indicator
  showLoading(container) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (container) {
      container.innerHTML = '<div class="loading">Загрузка...</div>';
    }
  },
  
  // Show error message
  showError(message, container = null) {
    const errorHtml = `<div class="error-message">${message}</div>`;
    
    if (container) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      container.innerHTML = errorHtml;
    } else {
      this.showToast(message, 'error');
    }
  },
  
  // Show success message
  showSuccess(message) {
    this.showToast(message, 'success');
  },
  
  // Show toast notification
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },
  
  // Confirm dialog
  confirm(message) {
    return window.confirm(message);
  },
  
  // Prompt dialog
  prompt(message, defaultValue = '') {
    return window.prompt(message, defaultValue);
  }
};

// Make UI globally available
window.UI = UI;
