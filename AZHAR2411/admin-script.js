// ==================================================
// SUPABASE CONFIGURATION
// ==================================================
const SUPABASE_URL = 'https://pjxnokhkqchjillaoopi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqeG5va2hrcWNoamlsbGFvb3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjkwMjMsImV4cCI6MjA3OTU0NTAyM30.CuwUr1TPOjZBO8CB9n8QMImhJH9-Q8Qn0y0bafezj3o';

let supabase = null;
let supabaseConnected = false;

// Initialize Supabase with connection check
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase client initialized');
} catch (e) {
    console.error('❌ Failed to initialize Supabase:', e);
}

// ==================================================
// GLOBAL STATE
// ==================================================
let currentView = 'dashboard';
let currentPage = null;
let editingNavItem = null;
let editingSection = null;
let selectedTemplate = null;

// ==================================================
// DIAGNOSTIC FUNCTIONS
// ==================================================
async function testSupabaseConnection() {
    try {
        console.log('🔍 Testing Supabase connection...');
        
        // Test pages table
        const { data: pages, error: pagesError } = await supabase.from('pages').select('count');
        if (pagesError) {
            console.error('❌ Pages table error:', pagesError);
            return { success: false, error: 'Pages table not found. Execute SUPABASE_SETUP.sql' };
        }
        
        // Test navigation table
        const { data: nav, error: navError } = await supabase.from('navigation').select('count');
        if (navError) {
            console.error('❌ Navigation table error:', navError);
            return { success: false, error: 'Navigation table not found. Execute SUPABASE_SETUP.sql' };
        }
        
        // Test sections table
        const { data: sections, error: sectionsError } = await supabase.from('sections').select('count');
        if (sectionsError) {
            console.error('❌ Sections table error:', sectionsError);
            return { success: false, error: 'Sections table not found. Execute SUPABASE_SETUP.sql' };
        }
        
        console.log('✅ All tables accessible');
        supabaseConnected = true;
        return { success: true };
    } catch (e) {
        console.error('❌ Connection test failed:', e);
        return { success: false, error: e.message };
    }
}

// ==================================================
// AUTH & INITIALIZATION
// ==================================================
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === 'admin123') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').classList.add('active');
        await initializeApp();
        showNotification('👋 Добро пожаловать!');
    } else {
        showNotification('❌ Неверный логин или пароль!', 'error');
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Выйти?')) location.reload();
});

async function initializeApp() {
    const connectionTest = await testSupabaseConnection();
    if (!connectionTest.success) {
        showNotification(`❌ ${connectionTest.error}`, 'error');
    }
    await loadData();
    renderView('dashboard');
}

// ==================================================
// MENU NAVIGATION
// ==================================================
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentView = item.dataset.view;
        renderView(currentView);
    });
});

document.getElementById('syncBtn').addEventListener('click', async () => {
    await loadData();
    renderView(currentView);
    showNotification('🔄 Данные синхронизированы!');
});

document.getElementById('previewBtn').addEventListener('click', showPreview);
document.getElementById('publishBtn').addEventListener('click', publishChanges);

// ==================================================
// DATA MANAGEMENT
// ==================================================
async function loadData() {
    try {
        console.log('📥 Loading data from Supabase...');
        if (!supabase) {
            console.error('Supabase not initialized');
            return;
        }
    } catch (e) {
        console.error('Error loading data:', e);
        showNotification('❌ Ошибка загрузки данных!', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification show' + (type === 'error' ? ' error' : type === 'warning' ? ' warning' : '');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// ==================================================
// VIEW RENDERING
// ==================================================
function renderView(view) {
    const content = document.getElementById('mainContent');
    switch(view) {
        case 'dashboard': renderDashboard(); break;
        case 'navigation': renderNavigation(); break;
        case 'pages': renderPages(); break;
        case 'sections': renderSections(); break;
        case 'settings': content.innerHTML = renderSettings(); break;
    }
}

async function renderDashboard() {
    const content = document.getElementById('mainContent');
    
    // Get stats
    let pagesCount = '-', navCount = '-', sectionsCount = '-';
    
    if (supabaseConnected) {
        try {
            const { data: pages } = await supabase.from('pages').select('id', { count: 'exact' });
            const { data: nav } = await supabase.from('navigation').select('id', { count: 'exact' });
            const { data: sections } = await supabase.from('sections').select('id', { count: 'exact' });
            
            pagesCount = pages?.length || 0;
            navCount = nav?.length || 0;
            sectionsCount = sections?.length || 0;
        } catch (e) {
            console.error('Error loading stats:', e);
        }
    }
    
    content.innerHTML = `
        <div class="content-header">
            <h2 class="content-title">Dashboard</h2>
            <p class="content-subtitle">Обзор системы управления контентом</p>
        </div>
        <div class="card">
            <h3 class="card-title">Статус подключения</h3>
            ${supabaseConnected ? 
                '<p style="color: #059669; font-weight: 600;">✅ Supabase подключен и таблицы доступны</p>' :
                '<p style="color: #ef4444; font-weight: 600;">❌ Ошибка подключения! Выполните SQL скрипт SUPABASE_SETUP.sql</p>'
            }
            <p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">
                Проект: pjxnokhkqchjillaoopi
            </p>
        </div>
        <div class="stat-grid" style="margin-top: 1.5rem;">
            <div class="stat-card">
                <div class="stat-value">${pagesCount}</div>
                <div class="stat-label">Страниц</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${navCount}</div>
                <div class="stat-label">Пунктов меню</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${sectionsCount}</div>
                <div class="stat-label">Секций</div>
            </div>
        </div>
    `;
}

// ==================================================
// NAVIGATION MANAGEMENT (WITH SUBMENU SUPPORT)
// ==================================================
async function renderNavigation() {
    const content = document.getElementById('mainContent');
    
    if (!supabaseConnected) {
        content.innerHTML = `<div class="card"><p style="color: #ef4444;">Ошибка подключения к Supabase. Выполните SQL скрипт.</p></div>`;
        return;
    }
    
    const { data: navItems, error } = await supabase
        .from('navigation')
        .select('*')
        .is('parent_id', null)
        .order('position');
    
    if (error) {
        console.error('Error loading navigation:', error);
        content.innerHTML = `<div class="card"><p style="color: #ef4444;">Ошибка: ${error.message}</p></div>`;
        return;
    }
    
    // Load children for all items in parallel for better performance
    if (navItems && navItems.length > 0) {
        const childrenPromises = navItems.map(item => 
            supabase.from('navigation').select('*').eq('parent_id', item.id).order('position')
        );
        const childrenResults = await Promise.all(childrenPromises);
        navItems.forEach((item, index) => {
            item.children = childrenResults[index]?.data || [];
        });
    }
    
    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h2 class="content-title">Навигационное меню</h2>
                <p class="content-subtitle">Управление пунктами меню с поддержкой подпунктов</p>
            </div>
            <button onclick="openNavModal()" class="btn-sm btn-save" style="border: none;">➕ Добавить пункт</button>
        </div>

        <div class="card">
            <h3 class="card-title">Текущее меню</h3>
            <div class="nav-list">
                ${navItems && navItems.length > 0 ? navItems.map(item => `
                    <div class="nav-item-card">
                        <div class="nav-item-header">
                            <div>
                                <strong style="font-size: 1.05rem;">${item.name}</strong>
                                ${!item.has_children ? 
                                    `<div style="color: #6b7280; font-size: 0.875rem;">URL: ${item.url || 'не указан'}</div>` :
                                    '<div style="color: #f59e0b; font-size: 0.875rem;">⚠️ Имеет подпункты</div>'
                                }
                            </div>
                            <div class="nav-item-actions">
                                <button onclick="moveNavItem('${item.id}', 'up')" class="btn-icon" title="Вверх">⬆️</button>
                                <button onclick="moveNavItem('${item.id}', 'down')" class="btn-icon" title="Вниз">⬇️</button>
                                <button onclick="editNavItem('${item.id}')" class="btn-icon" title="Редактировать">✏️</button>
                                <button onclick="addSubmenuItem('${item.id}')" class="btn-icon" title="Добавить подпункт">➕</button>
                                <button onclick="deleteNavItem('${item.id}')" class="btn-icon" style="color: #ef4444;" title="Удалить">🗑️</button>
                            </div>
                        </div>
                        ${item.children && item.children.length > 0 ? `
                            <div class="submenu-items">
                                ${item.children.map(child => `
                                    <div class="submenu-item-card">
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <div>
                                                <strong>${child.name}</strong>
                                                <div style="color: #6b7280; font-size: 0.875rem;">URL: ${child.url}</div>
                                            </div>
                                            <div style="display: flex; gap: 0.5rem;">
                                                <button onclick="editNavItem('${child.id}', '${item.id}')" class="btn-icon">✏️</button>
                                                <button onclick="deleteNavItem('${child.id}')" class="btn-icon" style="color: #ef4444;">🗑️</button>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('') : '<p style="text-align: center; color: #6b7280; padding: 2rem;">Нет пунктов меню</p>'}
            </div>
        </div>
    `;
}

let editingParentId = null;

function openNavModal(itemId = null, parentId = null) {
    editingNavItem = itemId;
    editingParentId = parentId;
    const modal = document.getElementById('navModal');
    
    if (itemId) {
        supabase.from('navigation').select('*').eq('id', itemId).single().then(({ data }) => {
            if (data) {
                document.getElementById('navName').value = data.name;
                document.getElementById('navUrl').value = data.url || '';
                document.getElementById('navPosition').value = data.position || 0;
            }
        });
    } else {
        document.getElementById('navName').value = '';
        document.getElementById('navUrl').value = '';
        document.getElementById('navPosition').value = '0';
    }
    
    document.getElementById('navModalTitle').textContent = parentId ? 'Добавить подпункт' : (itemId ? 'Редактировать пункт' : 'Добавить пункт');
    modal.classList.add('show');
}

function addSubmenuItem(parentId) {
    // Mark parent as having children
    supabase.from('navigation').update({ has_children: true, url: null }).eq('id', parentId).then(() => {
        openNavModal(null, parentId);
    });
}

function closeNavModal() {
    document.getElementById('navModal').classList.remove('show');
    editingNavItem = null;
    editingParentId = null;
}

async function saveNavItem() {
    const name = document.getElementById('navName').value.trim();
    const url = document.getElementById('navUrl').value.trim();
    const position = parseInt(document.getElementById('navPosition').value) || 0;
    
    if (!name) {
        showNotification('❌ Введите название пункта!', 'error');
        return;
    }
    
    if (!editingParentId && !url) {
        showNotification('❌ Введите URL или добавьте подпункты!', 'error');
        return;
    }
    
    try {
        const data = { 
            name, 
            url: editingParentId ? url : (url || null), 
            position,
            parent_id: editingParentId,
            has_children: false
        };
        
        if (editingNavItem) {
            const { error } = await supabase.from('navigation').update(data).eq('id', editingNavItem);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('navigation').insert([data]);
            if (error) throw error;
        }
        
        console.log('✅ Navigation item saved');
        closeNavModal();
        renderNavigation();
        showNotification('✅ Пункт меню сохранен!');
    } catch (e) {
        console.error('Error saving nav item:', e);
        showNotification('❌ Ошибка: ' + e.message, 'error');
    }
}

async function editNavItem(id, parentId = null) {
    openNavModal(id, parentId);
}

async function deleteNavItem(id) {
    if (!confirm('Удалить этот пункт меню?')) return;
    
    try {
        const { error } = await supabase.from('navigation').delete().eq('id', id);
        if (error) throw error;
        
        renderNavigation();
        showNotification('✅ Пункт удален!');
    } catch (e) {
        console.error('Error deleting nav item:', e);
        showNotification('❌ Ошибка удаления!', 'error');
    }
}

async function moveNavItem(id, direction) {
    try {
        const { data: item } = await supabase.from('navigation').select('*').eq('id', id).single();
        const { data: items } = await supabase
            .from('navigation')
            .select('*')
            .is('parent_id', item.parent_id)
            .order('position');
        
        const index = items.findIndex(i => i.id === id);
        
        if (direction === 'up' && index > 0) {
            items[index].position = index - 1;
            items[index - 1].position = index;
            await Promise.all([
                supabase.from('navigation').update({ position: items[index].position }).eq('id', items[index].id),
                supabase.from('navigation').update({ position: items[index - 1].position }).eq('id', items[index - 1].id)
            ]);
        } else if (direction === 'down' && index < items.length - 1) {
            items[index].position = index + 1;
            items[index + 1].position = index;
            await Promise.all([
                supabase.from('navigation').update({ position: items[index].position }).eq('id', items[index].id),
                supabase.from('navigation').update({ position: items[index + 1].position }).eq('id', items[index + 1].id)
            ]);
        }
        
        renderNavigation();
    } catch (e) {
        console.error('Error moving nav item:', e);
        showNotification('❌ Ошибка перемещения!', 'error');
    }
}

// ==================================================
// PAGES MANAGEMENT
// ==================================================
async function renderPages() {
    const content = document.getElementById('mainContent');
    
    if (!supabaseConnected) {
        content.innerHTML = `<div class="card"><p style="color: #ef4444;">Ошибка подключения к Supabase</p></div>`;
        return;
    }
    
    const { data: pages, error } = await supabase.from('pages').select('*');
    
    if (error) {
        console.error('Error loading pages:', error);
        content.innerHTML = `<div class="card"><p style="color: #ef4444;">Ошибка: ${error.message}</p></div>`;
        return;
    }
    
    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h2 class="content-title">Управление страницами</h2>
                <p class="content-subtitle">Создавайте и редактируйте страницы сайта</p>
            </div>
            <button onclick="openPageModal()" class="btn-sm btn-save" style="border: none;">➕ Создать страницу</button>
        </div>

        <div class="page-grid">
            ${pages && pages.length > 0 ? pages.map(page => `
                <div class="page-card ${currentPage && currentPage.id === page.id ? 'selected' : ''}" onclick="selectPage('${page.id}')">
                    <div class="page-header">
                        <div>
                            <div class="page-title">${page.name}</div>
                            <div class="page-url">${page.slug}</div>
                        </div>
                        <div>
                            ${page.is_published ? '<span class="badge badge-success">Опубликовано</span>' : '<span class="badge badge-draft">Черновик</span>'}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button onclick="event.stopPropagation(); editPage('${page.id}')" class="btn-sm btn-secondary">✏️ Редактировать</button>
                        ${page.slug !== '/' ? `<button onclick="event.stopPropagation(); deletePage('${page.id}')" class="btn-sm btn-danger">🗑️ Удалить</button>` : ''}
                    </div>
                </div>
            `).join('') : '<div class="card"><p style="text-align: center; color: #6b7280; padding: 2rem;">Нет страниц</p></div>'}
        </div>
        
        ${currentPage ? `
            <div class="card" style="margin-top: 2rem; background: #eff6ff;">
                <p style="color: #1e40af; font-weight: 600;">✓ Страница "${currentPage.name}" выбрана</p>
                <p style="color: #1e3a8a; font-size: 0.875rem; margin-top: 0.5rem;">Перейдите в "Редактор секций" для добавления контента</p>
            </div>
        ` : ''}
    `;
}

async function selectPage(id) {
    const { data } = await supabase.from('pages').select('*').eq('id', id).single();
    currentPage = data;
    renderPages();
}

function openPageModal(pageId = null) {
    document.getElementById('pageModal').classList.add('show');
    if (!pageId) {
        document.getElementById('pageName').value = '';
        document.getElementById('pageSlug').value = '';
        document.getElementById('pageTitle').value = '';
        document.getElementById('pageDesc').value = '';
    }
}

function closePageModal() {
    document.getElementById('pageModal').classList.remove('show');
}

async function savePage() {
    const name = document.getElementById('pageName').value.trim();
    const slug = document.getElementById('pageSlug').value.trim();
    const title = document.getElementById('pageTitle').value.trim();
    const description = document.getElementById('pageDesc').value.trim();
    
    if (!name || !slug) {
        showNotification('❌ Заполните обязательные поля!', 'error');
        return;
    }
    
    try {
        const { error } = await supabase.from('pages').insert([{
            name,
            slug,
            title: title || name,
            description,
            is_published: false
        }]);
        
        if (error) throw error;
        
        console.log('✅ Page saved');
        closePageModal();
        renderPages();
        showNotification('✅ Страница создана!');
    } catch (e) {
        console.error('Error saving page:', e);
        showNotification('❌ Ошибка: ' + e.message, 'error');
    }
}

async function editPage(id) {
    const { data } = await supabase.from('pages').select('*').eq('id', id).single();
    if (data) {
        document.getElementById('pageName').value = data.name;
        document.getElementById('pageSlug').value = data.slug;
        document.getElementById('pageTitle').value = data.title || '';
        document.getElementById('pageDesc').value = data.description || '';
        openPageModal(id);
    }
}

async function deletePage(id) {
    if (!confirm('Удалить эту страницу?')) return;
    
    try {
        const { error } = await supabase.from('pages').delete().eq('id', id);
        if (error) throw error;
        
        if (currentPage && currentPage.id === id) currentPage = null;
        renderPages();
        showNotification('✅ Страница удалена!');
    } catch (e) {
        console.error('Error deleting page:', e);
        showNotification('❌ Ошибка удаления!', 'error');
    }
}

// Continue with sections, versions, and other functions...
// (Same logic as before for sections editor, preview, publish, etc.)

// ==================================================
// SECTIONS EDITOR
// ==================================================
async function renderSections() {
    const content = document.getElementById('mainContent');
    
    if (!currentPage) {
        content.innerHTML = `
            <div class="card">
                <h3 class="card-title">Редактор секций</h3>
                <p style="text-align: center; color: #6b7280; padding: 2rem;">Сначала выберите страницу в разделе "Страницы"</p>
                <button onclick="renderView('pages')" class="btn btn-primary" style="width: auto; margin: 0 auto; display: block;">Перейти к страницам</button>
            </div>
        `;
        return;
    }
    
    const { data: sections, error } = await supabase
        .from('sections')
        .select('*')
        .eq('page_id', currentPage.id)
        .order('position');
    
    content.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <div>
                <h2 class="content-title">Редактор секций</h2>
                <p class="content-subtitle">Страница: ${currentPage.name}</p>
            </div>
            <button onclick="openSectionModal()" class="btn-sm btn-save" style="border: none;">➕ Добавить секцию</button>
        </div>

        <div class="section-list">
            ${sections && sections.length > 0 ? sections.map(section => `
                <div class="section-card">
                    <div class="section-header">
                        <div>
                            <span class="section-type">${getTemplateName(section.type)}</span>
                            ${section.is_published ? '<span class="badge badge-success">Опубликовано</span>' : '<span class="badge badge-draft">Черновик</span>'}
                        </div>
                        <div class="section-actions">
                            <button onclick="moveSection('${section.id}', 'up')" class="btn-icon">⬆️</button>
                            <button onclick="moveSection('${section.id}', 'down')" class="btn-icon">⬇️</button>
                            <button onclick="editSection('${section.id}')" class="btn-icon">✏️</button>
                            <button onclick="togglePublish('${section.id}')" class="btn-icon">${section.is_published ? '👁️' : '📝'}</button>
                            <button onclick="deleteSection('${section.id}')" class="btn-icon" style="color: #ef4444;">🗑️</button>
                        </div>
                    </div>
                    <div class="section-preview">
                        ${renderSectionPreview(section)}
                    </div>
                </div>
            `).join('') : '<div class="card"><p style="text-align: center; color: #6b7280; padding: 2rem;">Нет секций. Добавьте первую секцию!</p></div>'}
        </div>
    `;
}

function getTemplateName(type) {
    const names = {
        'text': '📝 Текст',
        'image': '🖼️ Изображение',
        'text-image': '📝🖼️ Текст + Картинка',
        'image-text': '🖼️📝 Картинка + Текст',
        'two-columns': '📊 Две колонки',
        'hero': '🎯 Hero секция'
    };
    return names[type] || type;
}

function renderSectionPreview(section) {
    const content = section.content;
    let html = '';
    
    if (content.text) {
        html += `<p style="margin-bottom: 1rem;">${content.text.substring(0, 150)}${content.text.length > 150 ? '...' : ''}</p>`;
    }
    if (content.imageUrl) {
        html += `<img src="${content.imageUrl}" style="max-width: 200px; border-radius: 8px;" alt="Preview">`;
    }
    
    return html || '<p style="color: #6b7280;">Контент не добавлен</p>';
}

function openSectionModal(sectionId = null) {
    editingSection = sectionId;
    selectedTemplate = null;
    
    document.getElementById('sectionModal').classList.add('show');
    document.getElementById('sectionEditor').style.display = 'none';
    
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
        card.onclick = () => selectTemplate(card.dataset.template);
    });
}

function closeSectionModal() {
    document.getElementById('sectionModal').classList.remove('show');
    editingSection = null;
    selectedTemplate = null;
}

function selectTemplate(template) {
    selectedTemplate = template;
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.template === template);
    });
    
    document.getElementById('sectionEditor').style.display = 'block';
    document.getElementById('textBlock').style.display = ['text', 'text-image', 'image-text', 'two-columns', 'hero'].includes(template) ? 'block' : 'none';
    document.getElementById('imageBlock').style.display = ['image', 'text-image', 'image-text', 'hero'].includes(template) ? 'block' : 'none';
    document.getElementById('linkBlock').style.display = ['hero'].includes(template) ? 'block' : 'none';
}

async function saveSection() {
    if (!selectedTemplate) {
        showNotification('❌ Выберите шаблон!', 'error');
        return;
    }
    
    const content = {
        text: document.getElementById('textContent').value,
        fontSize: document.getElementById('fontSize').value,
        fontWeight: document.getElementById('fontWeight').value,
        textColor: document.getElementById('textColor').value,
        imageUrl: document.getElementById('imageUrl').value,
        imageWidth: document.getElementById('imageWidth').value,
        imageHeight: document.getElementById('imageHeight').value,
        linkText: document.getElementById('linkText').value,
        linkUrl: document.getElementById('linkUrl').value,
        width: document.getElementById('sectionWidth').value,
        height: document.getElementById('sectionHeight').value
    };
    
    const position = parseInt(document.getElementById('sectionPosition').value) || 0;
    
    try {
        const data = {
            page_id: currentPage.id,
            type: selectedTemplate,
            content,
            position,
            is_published: false
        };
        
        let result;
        if (editingSection) {
            result = await supabase.from('sections').update(data).eq('id', editingSection);
        } else {
            result = await supabase.from('sections').insert([data]).select();
        }
        
        if (result.error) throw result.error;
        
        console.log('✅ Section saved');
        closeSectionModal();
        renderSections();
        showNotification('✅ Секция сохранена!');
        document.getElementById('publishBtn').style.display = 'block';
    } catch (e) {
        console.error('Error saving section:', e);
        showNotification('❌ Ошибка: ' + e.message, 'error');
    }
}

// Версии удалены - функция больше не используется

async function deleteSection(id) {
    if (!confirm('Удалить эту секцию?')) return;
    
    try {
        const { error } = await supabase.from('sections').delete().eq('id', id);
        if (error) throw error;
        
        renderSections();
        showNotification('✅ Секция удалена!');
    } catch (e) {
        console.error('Error deleting section:', e);
        showNotification('❌ Ошибка удаления!', 'error');
    }
}

async function togglePublish(id) {
    const { data: section } = await supabase.from('sections').select('*').eq('id', id).single();
    await supabase.from('sections').update({ is_published: !section.is_published }).eq('id', id);
    renderSections();
    showNotification(`✅ Секция ${!section.is_published ? 'опубликована' : 'снята с публикации'}!`);
}

async function moveSection(id, direction) {
    try {
        const { data: section } = await supabase.from('sections').select('*').eq('id', id).single();
        const { data: sections } = await supabase
            .from('sections')
            .select('*')
            .eq('page_id', currentPage.id)
            .order('position');
        
        const index = sections.findIndex(s => s.id === id);
        
        if (direction === 'up' && index > 0) {
            await Promise.all([
                supabase.from('sections').update({ position: index - 1 }).eq('id', sections[index].id),
                supabase.from('sections').update({ position: index }).eq('id', sections[index - 1].id)
            ]);
        } else if (direction === 'down' && index < sections.length - 1) {
            await Promise.all([
                supabase.from('sections').update({ position: index + 1 }).eq('id', sections[index].id),
                supabase.from('sections').update({ position: index }).eq('id', sections[index + 1].id)
            ]);
        }
        
        renderSections();
    } catch (e) {
        console.error('Error moving section:', e);
        showNotification('❌ Ошибка перемещения!', 'error');
    }
}



// ==================================================
// SETTINGS
// ==================================================
function renderSettings() {
    return `
        <div class="content-header">
            <h2 class="content-title">Настройки</h2>
            <p class="content-subtitle">Глобальные параметры сайта</p>
        </div>
        <div class="card">
            <h3 class="card-title">Общие настройки</h3>
            <div class="form-group">
                <label class="form-label">Название сайта</label>
                <input type="text" class="form-input" placeholder="Мой сайт">
            </div>
            <button class="btn btn-primary" style="width: auto;">Сохранить</button>
        </div>
    `;
}

// ==================================================
// PREVIEW & PUBLISH
// ==================================================
function showPreview() {
    document.getElementById('previewModal').classList.add('show');
    const iframe = document.getElementById('previewFrame');
    iframe.src = 'index.html?' + Date.now();
}

function closePreviewModal() {
    document.getElementById('previewModal').classList.remove('show');
}

async function publishChanges() {
    if (!confirm('Опубликовать все изменения на сайт?')) return;
    
    try {
        const { data: sections } = await supabase.from('sections').select('*').eq('is_published', false);
        
        for (const section of sections) {
            await supabase.from('sections').update({ is_published: true }).eq('id', section.id);
        }
        
        showNotification('✅ Изменения опубликованы!');
        document.getElementById('publishBtn').style.display = 'none';
        renderView(currentView);
    } catch (e) {
        console.error('Error publishing:', e);
        showNotification('❌ Ошибка публикации!', 'error');
    }
}

// Close modals on outside click
document.getElementById('navModal').addEventListener('click', (e) => {
    if (e.target.id === 'navModal') closeNavModal();
});
document.getElementById('pageModal').addEventListener('click', (e) => {
    if (e.target.id === 'pageModal') closePageModal();
});
document.getElementById('sectionModal').addEventListener('click', (e) => {
    if (e.target.id === 'sectionModal') closeSectionModal();
});
document.getElementById('previewModal').addEventListener('click', (e) => {
    if (e.target.id === 'previewModal') closePreviewModal();
});
