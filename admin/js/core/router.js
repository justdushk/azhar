// SPA Router for admin panel
const Router = {
  currentView: 'dashboard',
  
  // Initialize router
  init() {
    // Handle navigation clicks
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('[data-route]');
      if (navLink) {
        e.preventDefault();
        const route = navLink.dataset.route;
        this.navigate(route);
      }
    });
    
    // Load initial view
    const hash = window.location.hash.slice(1) || 'dashboard';
    this.navigate(hash);
  },
  
  // Navigate to a view
  navigate(viewName) {
    this.currentView = viewName;
    window.location.hash = viewName;
    
    // Update active nav item
    document.querySelectorAll('[data-route]').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.route === viewName) {
        link.classList.add('active');
      }
    });
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.style.display = 'none';
    });
    
    // Show current view
    const currentView = document.getElementById(`${viewName}-view`);
    if (currentView) {
      currentView.style.display = 'block';
      
      // Trigger view load event
      this.onViewLoad(viewName);
    }
  },
  
  // Called when view is loaded
  onViewLoad(viewName) {
    console.log(`Loading view: ${viewName}`);
    
    // Trigger module-specific load handlers
    const event = new CustomEvent('viewload', { detail: { view: viewName } });
    document.dispatchEvent(event);
  }
};

// Make Router globally available
window.Router = Router;
