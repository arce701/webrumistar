/*!
 * RumiStar E.I.R.L. - iTrade 3.0 Landing Page Scripts
 * Custom JavaScript para interactividad
 */

// ===================================================================
// DOCUMENT READY - Inicialización
// ===================================================================
document.addEventListener('DOMContentLoaded', function() {

    // Inicializar AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }

    // Inicializar GLightbox (Gallery)
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            touchNavigation: true,
            loop: true,
            autoplayVideos: true,
            closeButton: true,
            closeOnOutsideClick: true
        });
    }

    // Inicializar funcionalidades
    initNavbar();
    initMobileMenu();
    initCounters();
    initModals();
    initOffcanvas();
    initSmoothScroll();
});

// ===================================================================
// NAVBAR - Scroll Effect
// ===================================================================
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===================================================================
// MOBILE MENU - Toggle
// ===================================================================
function initMobileMenu() {
    const navToggler = document.getElementById('navToggler');
    const navbarMenu = document.getElementById('navbarMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggler || !navbarMenu) return;

    // Toggle menu al hacer click en hamburger
    navToggler.addEventListener('click', function() {
        navbarMenu.classList.toggle('active');

        // Animar las líneas del hamburger
        const lines = navToggler.querySelectorAll('.toggler-line');
        if (navbarMenu.classList.contains('active')) {
            lines[0].style.transform = 'rotate(45deg) translateY(8px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    });

    // Cerrar menu al hacer click en un link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navbarMenu.classList.remove('active');
                const lines = navToggler.querySelectorAll('.toggler-line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    });

    // Cerrar menu al hacer click fuera
    document.addEventListener('click', function(event) {
        if (!navToggler.contains(event.target) && !navbarMenu.contains(event.target)) {
            navbarMenu.classList.remove('active');
            const lines = navToggler.querySelectorAll('.toggler-line');
            lines[0].style.transform = 'none';
            lines[1].style.opacity = '1';
            lines[2].style.transform = 'none';
        }
    });
}

// ===================================================================
// COUNTER ANIMATION - Hero Stats
// ===================================================================
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    const animateCounter = function(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = function() {
            current += increment;
            if (current < target) {
                counter.textContent = prefix + Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = prefix + target;
            }
        };

        updateCounter();
    };

    // Intersection Observer para animar cuando sea visible
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const prefix = entry.target.getAttribute('data-prefix') || '';
                const initialText = prefix + '0';
                // Solo animar si no ha sido animado antes
                if (entry.target.textContent === initialText) {
                    animateCounter(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
        const prefix = counter.getAttribute('data-prefix') || '';
        counter.textContent = prefix + '0'; // Inicializar en +0
        observer.observe(counter);
    });
}

// ===================================================================
// MODALS - Open/Close
// ===================================================================
function initModals() {
    // Abrir modales desde footer legal links
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId + 'Modal');
            if (modal) {
                openModal(modal);
            }
        });
    });

    // Cerrar modales
    const modalCloses = document.querySelectorAll('[data-modal-close]');
    modalCloses.forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Cerrar modal al hacer click fuera
    const modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(function(modal) {
                if (modal.classList.contains('active')) {
                    closeModal(modal);
                }
            });
        }
    });
}

function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===================================================================
// OFFCANVAS - Open/Close (Info Sidebar)
// ===================================================================
function initOffcanvas() {
    const offcanvas = document.getElementById('infoOffcanvas');
    if (!offcanvas) return;

    // Abrir offcanvas
    const offcanvasTriggers = document.querySelectorAll('[data-info-toggle]');
    offcanvasTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            openOffcanvas(offcanvas);
        });
    });

    // Cerrar offcanvas
    const offcanvasCloses = document.querySelectorAll('[data-offcanvas-close]');
    offcanvasCloses.forEach(function(closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeOffcanvas(offcanvas);
        });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function(e) {
        if (offcanvas.classList.contains('active') &&
            !offcanvas.contains(e.target) &&
            !e.target.closest('[data-info-toggle]')) {
            closeOffcanvas(offcanvas);
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && offcanvas.classList.contains('active')) {
            closeOffcanvas(offcanvas);
        }
    });
}

function openOffcanvas(offcanvas) {
    offcanvas.classList.add('active');

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.id = 'offcanvasOverlay';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(10, 14, 20, 0.8);
        z-index: 1999;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
    `;
    overlay.addEventListener('click', function() {
        closeOffcanvas(offcanvas);
    });
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

function closeOffcanvas(offcanvas) {
    offcanvas.classList.remove('active');
    const overlay = document.getElementById('offcanvasOverlay');
    if (overlay) {
        overlay.remove();
    }
    document.body.style.overflow = '';
}

// ===================================================================
// SMOOTH SCROLL - Anchor Links
// ===================================================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignorar links vacíos o solo "#"
            if (!href || href === '#' || href === '#top') {
                if (href === '#top') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                return;
            }

            // Scroll suave a la sección
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = document.getElementById('mainNav')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

// Función para detectar si un elemento está visible en viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Función para animar elementos al hacer scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(function(element) {
        if (isElementInViewport(element)) {
            element.classList.add('animated');
        }
    });
}

// Optimización de scroll events con throttle
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================================================
// PERFORMANCE OPTIMIZATIONS
// ===================================================================

// Lazy load images con Intersection Observer
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    // Observar todas las imágenes con data-src
    document.querySelectorAll('img[data-src]').forEach(function(img) {
        imageObserver.observe(img);
    });
}

// ===================================================================
// CONSOLE LOG - Development Info
// ===================================================================
console.log('%c RumiStar E.I.R.L. ', 'background: #10b981; color: white; font-size: 16px; font-weight: bold; padding: 4px 8px;');
console.log('%c iTrade 3.0 - Sistema Enterprise de Lotización ', 'background: #0a0e14; color: #10b981; font-size: 12px; padding: 4px 8px;');
console.log('%c 171 empresas activas | 30 módulos | 55+ reportes ', 'color: #94a3b8; font-size: 10px;');
