document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       Active Navigation Highlight
       ========================================================================== */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Handle links with hashes or query params by only comparing the base path
        if (linkHref && linkHref.split('?')[0].split('#')[0] === currentPath) {
            link.classList.add('active');
            if (link.classList.contains('dropdown-item')) {
                const parentNav = link.closest('.nav-item');
                if (parentNav) {
                    const parentLink = parentNav.querySelector('.nav-link');
                    if (parentLink) parentLink.classList.add('active');
                }
            }
        }
    });
    /* ==========================================================================
       Theme & Layout Toggles
       ========================================================================== */
    const themeToggle = document.getElementById('themeToggle');
    const rtlToggle = document.getElementById('rtlToggle');
    
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if(themeIcon) themeIcon.className = 'fa-solid fa-sun';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if(themeIcon) themeIcon.className = 'fa-solid fa-moon';
        }

        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                if(themeIcon) themeIcon.className = 'fa-solid fa-moon';
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                if(themeIcon) themeIcon.className = 'fa-solid fa-sun';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    if (rtlToggle) {
        const currentDir = localStorage.getItem('dir') || 'ltr';
        document.documentElement.setAttribute('dir', currentDir);
        rtlToggle.textContent = currentDir.toUpperCase();

        rtlToggle.addEventListener('click', () => {
            let dir = document.documentElement.getAttribute('dir');
            if (dir === 'rtl') {
                document.documentElement.setAttribute('dir', 'ltr');
                rtlToggle.textContent = 'LTR';
                localStorage.setItem('dir', 'ltr');
            } else {
                document.documentElement.setAttribute('dir', 'rtl');
                rtlToggle.textContent = 'RTL';
                localStorage.setItem('dir', 'rtl');
            }
        });
    }
    
    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });
    }

    // Move header tools into hamburger menu on mobile
    const headerTools = document.querySelector('.header-tools');
    function handleResponsiveTools() {
        if (!headerTools || !navMenu) return;
        
        if (window.innerWidth <= 1024) {
            let toolsContainer = navMenu.querySelector('.mobile-tools-container');
            if (!toolsContainer) {
                toolsContainer = document.createElement('li');
                toolsContainer.className = 'nav-item mobile-tools-container';
                toolsContainer.style.display = 'flex';
                toolsContainer.style.alignItems = 'center';
                toolsContainer.style.gap = '1rem';
                toolsContainer.style.justifyContent = 'center';
                toolsContainer.style.marginTop = '1rem';
                toolsContainer.style.paddingTop = '1rem';
                toolsContainer.style.borderTop = '1px solid var(--border-color)';
                navMenu.appendChild(toolsContainer);
            }
            
            Array.from(headerTools.children).forEach(child => {
                if (!child.classList.contains('mobile-menu-toggle')) {
                    toolsContainer.appendChild(child);
                }
            });
        } else {
            const toolsContainer = navMenu.querySelector('.mobile-tools-container');
            if (toolsContainer) {
                Array.from(toolsContainer.children).forEach(child => {
                    headerTools.appendChild(child);
                });
                toolsContainer.remove();
            }
        }
    }
    window.addEventListener('resize', handleResponsiveTools);
    handleResponsiveTools();

    /* ==========================================================================
       ScrollSpy & SaaS Dashboard Navigation
       ========================================================================== */
    const sections = document.querySelectorAll('.dashboard-section');
    const menuLinks = document.querySelectorAll('.menu-link');
    const breadcrumbActive = document.getElementById('breadcrumbActive');

    if (sections.length > 0 && menuLinks.length > 0) {
        // Smooth scrolling for sidebar links
        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // ScrollSpy logic
        window.addEventListener('scroll', () => {
            let current = '';
            
            // Adjust offset based on sticky header height + some padding
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            menuLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                    // Update breadcrumb
                    if(breadcrumbActive) {
                        breadcrumbActive.textContent = link.querySelector('span').textContent;
                    }
                }
            });
        });
    }

    /* ==========================================================================
       Micro-interactions (Scroll Reveal & Counters)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Counters
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const target = entry.target;
            const updateCount = () => {
                const targetVal = +target.getAttribute('data-target');
                const count = +target.innerText;
                const speed = 200; // lower is faster
                const inc = targetVal / speed;

                if (count < targetVal) {
                    target.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    target.innerText = targetVal;
                }
            };
            updateCount();
            observer.unobserve(target);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    /* ==========================================================================
       Back to Top Button
       ========================================================================== */
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       Sidebar Toggle (Mobile/Responsive)
       ========================================================================== */
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    const sidebarCloseBtns = document.querySelectorAll('.sidebar-close');
    sidebarCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(sidebar) sidebar.classList.remove('open');
        });
    });
});
