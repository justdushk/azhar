// Dashboard module
const DashboardModule = {
  // Initialize module
  init() {
    document.addEventListener('viewload', (e) => {
      if (e.detail.view === 'dashboard') {
        this.load();
      }
    });
  },
  
  // Load dashboard stats
  async load() {
    const container = document.querySelector('#dashboard-stats');
    UI.showLoading(container);
    
    try {
      const stats = await SupabaseService.getStats();
      this.render(stats);
    } catch (error) {
      UI.showError('Ошибка загрузки статистики: ' + error.message, container);
    }
  },
  
  // Render dashboard
  render(stats) {
    const container = document.querySelector('#dashboard-stats');
    
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📄</div>
          <div class="stat-content">
            <div class="stat-value">${stats.pages}</div>
            <div class="stat-label">Страниц</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-value">${stats.sections}</div>
            <div class="stat-label">Секций</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🧭</div>
          <div class="stat-content">
            <div class="stat-value">${stats.navigation}</div>
            <div class="stat-label">Пунктов меню</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-info">
        <h3>Добро пожаловать в панель управления</h3>
        <p>Используйте левое меню для навигации между разделами.</p>
        <ul>
          <li><strong>Навигация</strong> — управление меню сайта</li>
          <li><strong>Страницы</strong> — создание и редактирование страниц</li>
          <li><strong>Секции</strong> — управление содержимым секций</li>
        </ul>
      </div>
    `;
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  DashboardModule.init();
});
