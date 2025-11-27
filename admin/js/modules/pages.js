// Pages management module
const PagesModule = {
  pages: [],
  
  // Initialize module
  init() {
    document.addEventListener('viewload', (e) => {
      if (e.detail.view === 'pages') {
        this.load();
      }
    });
    
    // Add page button
    const addBtn = document.querySelector('#add-page');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddForm());
    }
  },
  
  // Load pages
  async load() {
    const container = document.querySelector('#pages-list');
    UI.showLoading(container);
    
    try {
      this.pages = await SupabaseService.getPages();
      this.render();
    } catch (error) {
      UI.showError('Ошибка загрузки страниц: ' + error.message, container);
    }
  },
  
  // Render pages table
  render() {
    const container = document.querySelector('#pages-list');
    
    if (this.pages.length === 0) {
      container.innerHTML = '<div class="empty-state">Страниц пока нет. Создайте первую страницу.</div>';
      return;
    }
    
    Table.render(container, this.pages, [
      { key: 'title', label: 'Название' },
      { key: 'slug', label: 'URL', render: (val) => `<code>${val}</code>` },
      { key: 'order_index', label: 'Порядок' }
    ], [
      { name: 'edit', label: '✏️ Редактировать', type: 'secondary', handler: (id) => this.showEditForm(id) },
      { name: 'delete', label: '🗑️ Удалить', type: 'danger', handler: (id) => this.deletePage(id) }
    ]);
  },
  
  // Show add form
  showAddForm() {
    Form.showModal('Добавить страницу', [
      { name: 'title', label: 'Название', type: 'text', required: true, placeholder: 'О компании' },
      { name: 'slug', label: 'URL (slug)', type: 'text', required: true, placeholder: '/about' },
      { name: 'order_index', label: 'Порядок', type: 'number', value: this.pages.length }
    ], async (data) => {
      await this.createPage(data);
    });
  },
  
  // Show edit form
  showEditForm(id) {
    const page = this.pages.find(p => p.id === id);
    if (!page) return;
    
    Form.showModal('Редактировать страницу', [
      { name: 'title', label: 'Название', type: 'text', required: true, value: page.title },
      { name: 'slug', label: 'URL (slug)', type: 'text', required: true, value: page.slug },
      { name: 'order_index', label: 'Порядок', type: 'number', value: page.order_index }
    ], async (data) => {
      await this.updatePage(id, data);
    });
  },
  
  // Create page
  async createPage(data) {
    try {
      await SupabaseService.createPage(data);
      UI.showSuccess('Страница создана');
      await this.load();
    } catch (error) {
      UI.showError('Ошибка создания: ' + error.message);
    }
  },
  
  // Update page
  async updatePage(id, data) {
    try {
      await SupabaseService.updatePage(id, data);
      UI.showSuccess('Страница обновлена');
      await this.load();
    } catch (error) {
      UI.showError('Ошибка обновления: ' + error.message);
    }
  },
  
  // Delete page
  async deletePage(id) {
    if (!UI.confirm('Удалить эту страницу и все связанные секции?')) return;
    
    try {
      await SupabaseService.deletePage(id);
      UI.showSuccess('Страница удалена');
      await this.load();
    } catch (error) {
      UI.showError('Ошибка удаления: ' + error.message);
    }
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  PagesModule.init();
});
