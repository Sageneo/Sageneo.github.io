// ========================================
// CONFIGURATION & VARIABLES
// ========================================

const CONFIG = {
    navbarHeight: 70,
    scrollRevealOffset: 100,
    notificationDuration: 4000,
    backToTopThreshold: 500
};

// ========================================
// NAVIGATION
// ========================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.lastScroll = 0;
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollEffect();
        this.setupActiveLinks();
    }

    setupMobileMenu() {
        // Toggle mobile menu
        this.navToggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupScrollEffect() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add scrolled class
            if (currentScroll > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            this.lastScroll = currentScroll;
        });
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - CONFIG.navbarHeight - 50;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

                if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            });
        });
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }

                const target = document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - CONFIG.navbarHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-reveal');
        this.init();
    }

    init() {
        this.reveal();
        window.addEventListener('scroll', () => this.reveal());
    }

    reveal() {
        const windowHeight = window.innerHeight;

        this.elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - CONFIG.scrollRevealOffset) {
                element.classList.add('revealed');
            }
        });
    }
}

// ========================================
// CONTACT FORM
// ========================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Validation
        if (!this.validateForm(formData)) {
            return;
        }

        // Create mailto link
        const mailtoLink = this.createMailtoLink(formData);
        
        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        NotificationSystem.show('Votre client email va s\'ouvrir. Merci de votre message !', 'success');
        
        // Reset form
        this.form.reset();
    }

    validateForm(data) {
        if (!data.name || !data.email || !data.subject) {
            NotificationSystem.show('Veuillez remplir tous les champs obligatoires (*)', 'error');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            NotificationSystem.show('Veuillez entrer une adresse email valide', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    createMailtoLink(data) {
        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(
            `Nom: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Téléphone: ${data.phone || 'Non renseigné'}\n\n` +
            `Message:\n${data.message || 'Aucun message'}`
        );

        return `mailto:ldn@les-lanceurs-du-nord.ch?subject=${subject}&body=${body}`;
    }
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

class NotificationSystem {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '1rem 1.5rem',
            background: colors[type] || colors.info,
            color: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease',
            maxWidth: '90%',
            width: '300px',
            fontSize: '0.95rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        });

        // Add icon
        const icon = document.createElement('span');
        icon.textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        icon.style.fontSize = '1.2rem';
        notification.insertBefore(icon, notification.firstChild);

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, CONFIG.notificationDuration);
    }

    static init() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// BACK TO TOP BUTTON
// ========================================

class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (!this.button) return;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > CONFIG.backToTopThreshold) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// GALLERY LIGHTBOX
// ========================================

class GalleryLightbox {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.currentLightbox = null;
        this.init();
    }

    init() {
        this.galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                this.open(img.src, img.alt);
            });
        });

        this.addStyles();
    }

    open(src, alt) {
        // Create lightbox container
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        Object.assign(lightbox.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10000',
            cursor: 'pointer',
            animation: 'fadeIn 0.3s ease',
            padding: '20px'
        });

        // Create image
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        
        Object.assign(img.style, {
            maxWidth: '90%',
            maxHeight: '90%',
            borderRadius: '10px',
            boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
            animation: 'zoomIn 0.3s ease',
            cursor: 'default'
        });

        // Prevent image click from closing lightbox
        img.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Create close button
        const closeBtn = this.createCloseButton();

        // Append elements
        lightbox.appendChild(img);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        this.currentLightbox = lightbox;

        // Setup close handlers
        this.setupCloseHandlers(lightbox, closeBtn);
    }

    createCloseButton() {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.setAttribute('aria-label', 'Fermer');
        
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'white',
            border: 'none',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            fontSize: '1.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            color: '#333',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        });

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.transform = 'rotate(90deg) scale(1.1)';
            closeBtn.style.background = '#f44336';
            closeBtn.style.color = 'white';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.transform = 'rotate(0) scale(1)';
            closeBtn.style.background = 'white';
            closeBtn.style.color = '#333';
        });

        return closeBtn;
    }

    setupCloseHandlers(lightbox, closeBtn) {
        const closeLightbox = () => {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(lightbox)) {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                }
                this.currentLightbox = null;
            }, 300);
        };

        // Close on lightbox background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on button click
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        // Close on ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes zoomIn {
                from {
                    transform: scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

class PerformanceOptimizer {
    static lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    static debounce(func, wait) {
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
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new Navigation();
    new SmoothScroll();
    new ScrollReveal();
    new ContactForm();
    new BackToTop();
    new GalleryLightbox();
    
    NotificationSystem.init();
    PerformanceOptimizer.lazyLoadImages();

    // Log initialization
    console.log('%c🪓 Les Lanceurs du Nord', 'color: #8B4513; font-size: 20px; font-weight: bold;');
    console.log('%cSite web chargé avec succès!', 'color: #4CAF50; font-size: 14px;');
});

// ========================================
// WINDOW LOAD EVENT
// ========================================

window.addEventListener('load', () => {
    // Hide loading screen if exists
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
});

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('Erreur détectée:', e.error);
});

// ========================================
// EXPORT FOR TESTING
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        SmoothScroll,
        ScrollReveal,
        ContactForm,
        NotificationSystem,
        BackToTop,
        GalleryLightbox
    };
}
