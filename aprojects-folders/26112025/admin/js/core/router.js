// ===== Модуль роутинга =====

import { renderDashboard } from '../modules/dashboard.js';
import { renderNavigation } from '../modules/navigation.js';
import { renderPages } from '../modules/pages.js';
import { renderSections } from '../modules/sections.js';

const routes = {
    'dashboard': {
        title: 'Dashboard',
        render: renderDashboard
    },
    'navigation': {
        title: 'Навигация',
        render: renderNavigation
    },
    'pages': {
        title: 'Страницы',
        render: renderPages
    },
    'sections': {
        title: 'Секции',
        render: renderSections
    }
};

let currentRoute = 'dashboard';

/**
 * Инициализация роутера
 */
export function initRouter() {
    // Handle hash change
    window.addEventListener('hashchange', handleRouteChange);
    
    // Handle navigation clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const route = item.dataset.route;
            navigateTo(route);
        });
    });
    
    // Initial route
    const hash = window.location.hash.slice(1) || 'dashboard';
    navigateTo(hash);
}

/**
 * Навигация к маршруту
 */
export function navigateTo(route) {
    if (!routes[route]) {
        route = 'dashboard';
    }
    
    currentRoute = route;
    window.location.hash = route;
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.route === route) {
            item.classList.add('active');
        }
    });
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    pageTitle.textContent = routes[route].title;
    
    // Render content
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
    
    // Delay to show loading state
    setTimeout(() => {
        routes[route].render();
    }, 100);
}

/**
 * Обработка изменения хеша
 */
function handleRouteChange() {
    const route = window.location.hash.slice(1) || 'dashboard';
    navigateTo(route);
}

/**
 * Получить текущий маршрут
 */
export function getCurrentRoute() {
    return currentRoute;
}
