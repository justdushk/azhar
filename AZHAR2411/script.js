const SUPABASE_URL = 'https://pjxnokhkqchjillaoopi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqeG5va2hrcWNoamlsbGFvb3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NjkwMjMsImV4cCI6MjA3OTU0NTAyM30.CuwUr1TPOjZBO8CB9n8QMImhJH9-Q8Qn0y0bafezj3o';

// Initialize Supabase only if library is loaded
let supabase = null;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase initialized');
    } else {
        console.warn('⚠️ Supabase library not loaded');
    }
} catch (e) {
    console.error('❌ Failed to initialize Supabase:', e);
}

// ==================================================
// LOAD CONTENT FROM SUPABASE
// ==================================================
async function loadContentFromSupabase() {
    if (!supabase) {
        console.warn('⚠️ Supabase not initialized, skipping content load');
        return;
    }
    
    try {
        console.log('📥 Loading content from Supabase...');
        
        // Load navigation
        const { data: navItems, error: navError } = await supabase
            .from('navigation')
            .select('*')
            .order('position');
        
        if (navError) {
            console.error('❌ Error loading navigation:', navError);
        } else if (navItems && navItems.length > 0) {
            console.log(`✅ Loaded ${navItems.length} navigation items`);
            await updateNavigation(navItems);
        }
        
        // Load sections for home page
        const { data: homePage, error: pageError } = await supabase
            .from('pages')
            .select('*')
            .eq('slug', '/')
            .single();
        
        if (pageError) {
            console.error('❌ Error loading home page:', pageError);
        } else if (homePage) {
            const { data: sections, error: sectionsError } = await supabase
                .from('sections')
                .select('*')
                .eq('page_id', homePage.id)
                .eq('is_published', true)
                .order('position');
            
            if (sectionsError) {
                console.error('❌ Error loading sections:', sectionsError);
            } else if (sections && sections.length > 0) {
                console.log(`✅ Loaded ${sections.length} sections`);
                renderSections(sections);
            }
        }
    } catch (e) {
        console.error('❌ Error loading content from Supabase:', e);
    }
}

async function updateNavigation(navItems) {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    
    // Keep language switcher
    const langSwitcher = nav.querySelector('.lang-switcher');
    
    // Clear navigation but keep lang switcher
    const navLinks = Array.from(nav.children).filter(child => !child.classList.contains('lang-switcher'));
    navLinks.forEach(link => link.remove());
    
    // Separate parent items and load children for all in parallel
    const parentItems = navItems.filter(item => !item.parent_id);
    
    // Load all children in parallel for better performance
    const childrenPromises = parentItems
        .filter(item => item.has_children)
        .map(item => 
            supabase.from('navigation').select('*').eq('parent_id', item.id).order('position')
        );
    
    const childrenResults = await Promise.all(childrenPromises);
    const childrenMap = {};
    
    let childIndex = 0;
    parentItems.forEach(item => {
        if (item.has_children) {
            childrenMap[item.id] = childrenResults[childIndex]?.data || [];
            childIndex++;
        }
    });
    
    // Build navigation
    parentItems.forEach(item => {
        if (item.has_children) {
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'nav-item-with-dropdown';
            dropdownContainer.textContent = item.name;
            
            const children = childrenMap[item.id];
            if (children && children.length > 0) {
                const dropdown = document.createElement('div');
                dropdown.className = 'nav-dropdown';
                
                children.forEach(child => {
                    const childLink = document.createElement('a');
                    childLink.href = child.url;
                    childLink.textContent = child.name;
                    dropdown.appendChild(childLink);
                });
                
                dropdownContainer.appendChild(dropdown);
            }
            
            if (langSwitcher) {
                nav.insertBefore(dropdownContainer, langSwitcher);
            } else {
                nav.appendChild(dropdownContainer);
            }
        } else {
            const link = document.createElement('a');
            link.href = item.url;
            link.textContent = item.name;
            if (langSwitcher) {
                nav.insertBefore(link, langSwitcher);
            } else {
                nav.appendChild(link);
            }
        }
    });
}

function renderSections(sections) {
    // This would dynamically insert sections into the page
    // For now, we keep the static content
    console.log('Sections loaded:', sections);
}

// ==================================================
// ORIGINAL SCRIPT - MOBILE MENU & SMOOTH SCROLL
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
    // Load content from Supabase
    loadContentFromSupabase();
    
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const overlay = document.getElementById('overlay');

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
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    if (mobileToggle && mainNav && overlay) {
                        mobileToggle.classList.remove('active');
                        mainNav.classList.remove('active');
                        overlay.classList.remove('active');
                    }
                }
            }
        });
    });

    const header = document.getElementById('header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

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
});
