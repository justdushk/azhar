import { supabase, fetchMenu, fetchSections } from './site-supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const overlay = document.getElementById('overlay');

    // ===========================
    // Мобильное меню
    // ===========================
    if (mobileToggle && mainNav && overlay) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // ===========================
    // Плавный скролл
    // ===========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    const header = document.querySelector('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });

                    // Закрываем мобильное меню при клике
                    mobileToggle?.classList.remove('active');
                    mainNav?.classList.remove('active');
                    overlay?.classList.remove('active');
                }
            }
        });
    });

    // ===========================
    // Скролл хедера
    // ===========================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            header.classList.toggle('scrolled', currentScroll > 50);
        });
    }

    // ===========================
    // Intersection Observer для анимаций
    // ===========================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .value-item, .feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===========================
    // Динамическое меню из Supabase с подменю
    // ===========================
    const menuContainer = document.getElementById('mainNav');
    const menuItems = await fetchMenu();

    if (menuContainer && menuItems.length > 0) {
        menuContainer.innerHTML = '';

        const createMenuItem = (item, items) => {
            const li = document.createElement('div'); // контейнер для пункта
            li.className = 'menu-item';

            const a = document.createElement('a');
            a.textContent = item.label;

            const children = items.filter(sub => sub.parent_id === item.id);
            if (children.length > 0) {
                a.href = '#';
                a.classList.add('has-children');

                const subMenu = document.createElement('div');
                subMenu.className = 'submenu';
                children.forEach(child => {
                    const subLink = document.createElement('a');
                    subLink.textContent = child.label;
                    subLink.href = child.url || '#';
                    subMenu.appendChild(subLink);
                });
                li.appendChild(a);
                li.appendChild(subMenu);

                // Мобильное раскрытие подменю
                a.addEventListener('click', (e) => {
                    if (window.innerWidth < 992) { // только на мобильных
                        e.preventDefault();
                        subMenu.classList.toggle('active');
                    }
                });
            } else {
                a.href = item.url || '#';
                li.appendChild(a);
            }

            return li;
        };

        const buildMenu = (items, parentId = null) => {
            const fragment = document.createDocumentFragment();
            items.filter(i => i.parent_id === parentId).forEach(item => {
                fragment.appendChild(createMenuItem(item, items));
            });
            return fragment;
        };

        menuContainer.appendChild(buildMenu(menuItems));
    }

    // ===========================
    // Динамические секции (страница home)
    // ===========================
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
        const sections = await fetchSections('home');
        pageContent.innerHTML = '';

        sections.forEach(sec => {
            const sectionEl = document.createElement('section');
            sectionEl.className = 'section';

            sec.section_content.forEach(c => {
                if (c.key === 'title') {
                    const h2 = document.createElement('h2');
                    h2.textContent = c.value.text;
                    sectionEl.appendChild(h2);
                }
                if (c.key === 'text') {
                    const p = document.createElement('p');
                    p.textContent = c.value.text;
                    sectionEl.appendChild(p);
                }
                if (c.key === 'image') {
                    const img = document.createElement('img');
                    img.src = c.value.url;
                    img.alt = c.value.alt || '';
                    if (c.value.width) img.style.width = c.value.width;
                    sectionEl.appendChild(img);
                }
            });

            pageContent.appendChild(sectionEl);
        });
    }
});
