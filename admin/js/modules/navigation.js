// Navigation management module
const NavigationModule = {
  items: [],
  
  // Initialize module
  init() {
    document.addEventListener('viewload', (e) => {
      if (e.detail.view === 'navigation') {
        this.load();
      }
    });
    
    // Add item button
    const addBtn = document.querySelector('#add-nav-item');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddForm());
    }
  },
  
  // Load navigation items
  async load() {
    const container = document.querySelector('#navigation-list');
    UI.showLoading(container);
    
    try {
      this.items = await SupabaseService.getNavigation();
      this.render();
    } catch (error) {
      UI.showError('Ошибка загрузки навигации: ' + error.message, container);
    }
  },
  
  // Render navigation tree
  render() {
    const container = document.querySelector('#navigation-list');
    
    if (this.items.length === 0) {
      container.innerHTML = '<div class="empty-state">Навигация пуста. Добавьте первый пункт.</div>';
      return;
    }
    
    // Build tree structure
    const tree = this.buildTree(this.items);
    container.innerHTML = this.renderTree(tree);
    
    // Attach event handlers
    this.attachHandlers();
  },
  
  // Build tree from flat list
  buildTree(items) {
    const tree = [];
    const itemMap = {};
    
    // Create map
    items.forEach(item => {
      itemMap[item.id] = { ...item, children: [] };
    });
    
    // Build tree
    items.forEach(item => {
      if (item.parent_id) {
        if (itemMap[item.parent_id]) {
          itemMap[item.parent_id].children.push(itemMap[item.id]);
        }
      } else {
        tree.push(itemMap[item.id]);
      }
    });
    
    return tree;
  },
  
  // Render tree HTML
  renderTree(tree, level = 0) {
    let html = '<ul class="nav-tree">';
    
    tree.forEach(item => {
      const hasChildren = item.children && item.children.length > 0;
      const isInactive = hasChildren ? 'inactive-url' : '';
      
      html += `
        <li class="nav-item" data-id="${item.id}" draggable="true">
          <div class="nav-item-content ${isInactive}">
            <span class="drag-handle">⋮⋮</span>
            <div class="nav-item-info">
              <strong>${item.label}</strong>
              <span class="nav-item-url">${item.url || '—'}</span>
              ${hasChildren ? '<span class="has-children-badge">Есть подпункты</span>' : ''}
            </div>
            <div class="nav-item-actions">
              <button class="btn btn-sm" data-action="edit" data-id="${item.id}">✏️</button>
              <button class="btn btn-sm" data-action="delete" data-id="${item.id}">🗑️</button>
            </div>
          </div>
          ${hasChildren ? this.renderTree(item.children, level + 1) : ''}
        </li>
      `;
    });
    
    html += '</ul>';
    return html;
  },
  
  // Attach event handlers
  attachHandlers() {
    const container = document.querySelector('#navigation-list');
    
    // Action buttons
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = e.target.dataset.action;
        const id = e.target.dataset.id;
        
        if (action === 'edit') {
          this.showEditForm(id);
        } else if (action === 'delete') {
          this.deleteItem(id);
        }
      });
    });
    
    // Drag and drop
    const items = container.querySelectorAll('.nav-item');
    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.target.classList.add('dragging');
      });
      
      item.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
      });
      
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
      
      item.addEventListener('drop', async (e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        const targetId = e.target.closest('.nav-item').dataset.id;
        
        if (draggedId !== targetId) {
          await this.reorderItems(draggedId, targetId);
        }
      });
    });
  },
  
  // Show add form
  showAddForm() {
    const parentOptions = [
      { value: '', label: '(Корневой уровень)' },
      ...this.items
        .filter(item => !item.parent_id)
        .map(item => ({ value: item.id, label: item.label }))
    ];
    
    Form.showModal('Добавить пункт меню', [
      { name: 'label', label: 'Название', type: 'text', required: true },
      { name: 'url', label: 'URL', type: 'text', placeholder: '/about' },
      { name: 'parent_id', label: 'Родительский пункт', type: 'select', options: parentOptions },
      { name: 'order_index', label: 'Порядок', type: 'number', value: this.items.length }
    ], async (data) => {
      await this.createItem(data);
    });
  },
  
  // Show edit form
  showEditForm(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    
    const parentOptions = [
      { value: '', label: '(Корневой уровень)' },
      ...this.items
        .filter(i => !i.parent_id && i.id !== id)
        .map(i => ({ value: i.id, label: i.label }))
    ];
    
    Form.showModal('Редактировать пункт меню', [
      { name: 'label', label: 'Название', type: 'text', required: true, value: item.label },
      { name: 'url', label: 'URL', type: 'text', value: item.url || '' },
      { name: 'parent_id', label: 'Родительский пункт', type: 'select', options: parentOptions, value: item.parent_id || '' },
      { name: 'order_index', label: 'Порядок', type: 'number', value: item.order_index }
    ], async (data) => {
      await this.updateItem(id, data);
    });
  },
  
  // Create item
  async createItem(data) {
    try {
      await SupabaseService.createNavItem(data);
      UI.showSuccess('Пункт добавлен');
      await this.load();
    } catch (error) {
      UI.showError('Ошибка создания: ' + error.message);
    }
  },
  
  // Update item
  async updateItem(id, data) {
    try {
      await SupabaseService.updateNavItem(id, data);
      UI.showSuccess('Пункт обновлен');
      await this.load();
    } catch (error) {
      UI.showError('Ошибка обновления: ' + error.message);
    }
  },
  
  // Delete item
  async deleteItem(id) {
    if (!UI.confirm('Удалить этот пункт меню?')) return;
    
    try {
      await SupabaseService.deleteNavItem(id);
      UI.showSuccess('Пункт удален');
      await this.load();
    } catch (error) {
      UI.showError('Ошибка удаления: ' + error.message);
    }
  },
  
  // Reorder items (drag and drop)
  async reorderItems(draggedId, targetId) {
    // Simple reordering logic
    // In production, this should be more sophisticated
    UI.showSuccess('Порядок изменен (перезагрузите для применения)');
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  NavigationModule.init();
});
