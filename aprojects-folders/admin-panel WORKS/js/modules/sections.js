// Sections management module
const SectionsModule = {
  sections: [],
  pages: [],
  
  // Initialize module
  init() {
    document.addEventListener('viewload', (e) => {
      if (e.detail.view === 'sections') {
        this.load();
      }
    });
    
    // Add section button
    const addBtn = document.querySelector('#add-section');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddForm());
    }
  },
  
  // Load sections
  async load() {
    const container = document.querySelector('#sections-list');
    UI.showLoading(container);
    
    try {
      // Load pages first for dropdown
      this.pages = await SupabaseService.getPages();
      this.sections = await SupabaseService.getSections();
      this.render();
    } catch (error) {
      UI.showError('Ошибка загрузки секций: ' + error.message, container);
    }
  },
  
  // Render sections table
  render() {
    const container = document.querySelector('#sections-list');
    
    if (this.sections.length === 0) {
      container.innerHTML = '<div class="empty-state">Секций пока нет. Создайте первую секцию.</div>';
      return;
    }
    
    // Enrich sections with page names
    const enrichedSections = this.sections.map(section => {
      const page = this.pages.find(p => p.id === section.page_id);
      return {
        ...section,
        page_name: page ? page.title : 'Неизвестная страница'
      };
    });
    
    Table.render(container, enrichedSections, [
      { key: 'type', label: 'Тип секции' },
      { key: 'page_name', label: 'Страница' },
      { key: 'order_index', label: 'Порядок' }
    ], [
      { name: 'edit', label: '✏️ Редактировать', type: 'secondary', handler: (id) => this.showEditForm(id) },
      { name: 'content', label: '📝 Контент', type: 'primary', handler: (id) => this.showContentEditor(id) },
      { name: 'delete', label: '🗑️ Удалить', type: 'danger', handler: (id) => this.deleteSection(id) }
    ]);
  },
  
  // Show add form
  showAddForm() {
    if (this.pages.length === 0) {
      UI.showError('Сначала создайте хотя бы одну страницу');
      return;
    }
    
    const pageOptions = this.pages.map(p => ({ value: p.id, label: p.title }));
    
    Form.showModal('Добавить секцию', [
      { name: 'page_id', label: 'Страница', type: 'select', required: true, options: pageOptions },
      { name: 'type', label: 'Тип секции', type: 'text', required: true, placeholder: 'hero, features, about' },
      { name: 'order_index', label: 'Порядок', type: 'number', value: this.sections.length }
    ], async (data) => {
      await this.createSection(data);
    });
  },
  
  // Show edit form
  showEditForm(id) {
    const section = this.sections.find(s => s.id === id);
    if (!section) return;
    
    const pageOptions = this.pages.map(p => ({ value: p.id, label: p.title }));
    
    Form.showModal('Редактировать секцию', [
      { name: 'page_id', label: 'Страница', type: 'select', required: true, options: pageOptions, value: section.page_id },
      { name: 'type', label: 'Тип секции', type: 'text', required: true, value: section.type },
      { name: 'order_index', label: 'Порядок', type: 'number', value: section.order_index }
    ], async (data) => {
      await this.updateSection(id, data);
    });
  },
  
  // Show content editor
  showContentEditor(id) {
    const section = this.sections.find(s => s.id === id);
    if (!section) return;
    
    // Simple content editor
    Form.showModal('Редактировать контент секции', [
      { name: 'content_json', label: 'Содержимое (JSON)', type: 'textarea', 
        placeholder: '{"title": "Hello", "subtitle": "World"}',
        value: '' }
    ], async (data) => {
      try {
        const content = JSON.parse(data.content_json || '{}');
        
        // Save content as array of key-value pairs
        const contentArray = Object.entries(content).map(([key, value]) => ({
          key: key,
          value: { text: value }
        }));
        
        await SupabaseService.saveSectionContent(id, contentArray);
        UI.showSuccess('Контент обновлен');
      } catch (error) {
        UI.showError('Ошибка сохранения контента: ' + error.message);
      }
    });
  },
  
  // Create section
  async createSection(data) {
    try {
      await SupabaseService.createSection(data);
      UI.showSuccess('Секция создана');
      await this.load();
    } catch (error) {
      UI.showError('Ошибка создания: ' + error.message);
    }
  },
  
  // Update section
  async updateSection(id, data) {
    try {
      await SupabaseService.updateSection(id, data);
      UI.showSuccess('Секция обновлена');
      await this.load();
    } catch (error) {
      UI.showError('Ошибка обновления: ' + error.message);
    }
  },
  
  // Delete section
  async deleteSection(id) {
    if (!UI.confirm('Удалить эту секцию и весь её контент?')) return;
    
    try {
      await SupabaseService.deleteSection(id);
      UI.showSuccess('Секция удалена');
      await this.load();
    } catch (error) {
      UI.showError('Ошибка удаления: ' + error.message);
    }
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  SectionsModule.init();
});
