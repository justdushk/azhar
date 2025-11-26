// ===== Dashboard модуль =====

import { countRecords } from '../core/supabase.js';
import { TABLES } from '../core/config.js';

/**
 * Рендер Dashboard
 */
export async function renderDashboard() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">📄</div>
                <div class="stat-label">Страницы</div>
                <div class="stat-value" id="pagesCount">-</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">🧩</div>
                <div class="stat-label">Секции</div>
                <div class="stat-value" id="sectionsCount">-</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">🧭</div>
                <div class="stat-label">Пункты меню</div>
                <div class="stat-value" id="menuItemsCount">-</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📑</div>
                <div class="stat-label">Подпункты меню</div>
                <div class="stat-value" id="subMenuItemsCount">-</div>
            </div>
        </div>
        
        <div class="table-container">
            <div class="table-header">
                <h3 class="table-title">Быстрый обзор</h3>
            </div>
            <div style="padding: 24px;">
                <p style="color: #718096; margin-bottom: 16px;">
                    Добро пожаловать в админ-панель! Используйте меню слева для управления контентом.
                </p>
                <ul style="color: #4a5568; line-height: 1.8;">
                    <li><strong>Навигация</strong> - управление меню сайта</li>
                    <li><strong>Страницы</strong> - создание и редактирование страниц</li>
                    <li><strong>Секции</strong> - управление секциями на страницах</li>
                </ul>
            </div>
        </div>
    `;
    
    // Load statistics
    await loadStats();
}

/**
 * Загрузка статистики
 */
async function loadStats() {
    try {
        // Count pages
        const pagesResult = await countRecords(TABLES.pages);
        document.getElementById('pagesCount').textContent = pagesResult.count || 0;
        
        // Count sections
        const sectionsResult = await countRecords(TABLES.sections);
        document.getElementById('sectionsCount').textContent = sectionsResult.count || 0;
        
        // Count navigation items (parent items)
        const menuResult = await countRecords(TABLES.navigation, {
            eq: { parent_id: null }
        });
        document.getElementById('menuItemsCount').textContent = menuResult.count || 0;
        
        // Count navigation sub-items
        const allNavResult = await countRecords(TABLES.navigation);
        const subMenuCount = (allNavResult.count || 0) - (menuResult.count || 0);
        document.getElementById('subMenuItemsCount').textContent = subMenuCount;
        
    } catch (error) {
        console.error('Error loading stats:', error);
        
        // Show error state
        document.getElementById('pagesCount').textContent = '✗';
        document.getElementById('sectionsCount').textContent = '✗';
        document.getElementById('menuItemsCount').textContent = '✗';
        document.getElementById('subMenuItemsCount').textContent = '✗';
    }
}
