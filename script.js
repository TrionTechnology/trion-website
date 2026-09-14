// Modern JavaScript for Trion Creation Website - Tab-Based Design

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTabNavigation();
    initHeader();
    initPortfolioFilter();
    initContactForm();
    initMobileMenu();
    initFooterYear();
});

// Auto-update the copyright year — fills any <span class="year-now">
// and also rewrites any hardcoded 20XX year inside .footer-bottom p
// as a safety net for older static pages.
function initFooterYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll('.year-now').forEach((el) => {
        el.textContent = year;
    });
    document.querySelectorAll('.footer-bottom p').forEach((el) => {
        if (!/\b20\d{2}\b/.test(el.textContent)) return;
        el.innerHTML = el.innerHTML.replace(/\b20\d{2}\b/, String(year));
    });
}

// Tab Navigation System
function initTabNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(tabId) {
        const targetContent = document.getElementById(tabId);
        if (!targetContent) return false;
        // Let the browser crossfade the panel swap where it can. It snapshots
        // before and after, so the whole mutation must happen in the callback.
        if (document.startViewTransition &&
            !matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.startViewTransition(() => applyTab(tabId, targetContent));
            return true;
        }
        return applyTab(tabId, targetContent);
    }

    function applyTab(tabId, targetContent) {
        navLinks.forEach((l) => l.classList.toggle('active',
            (l.getAttribute('href') || '').replace(/^#/, '') === tabId));
        tabContents.forEach((c) => c.classList.remove('active'));
        targetContent.classList.add('active');
        navLinks.forEach((l) => l.setAttribute('aria-selected',
            l.classList.contains('active') ? 'true' : 'false'));
        tabContents.forEach((c) => c.toggleAttribute('hidden', !c.classList.contains('active')));
        // Jump, don't animate: switching tab replaces the whole view, so
        // easing it just delays the content. Lenis (when active) needs to
        // be told directly or it keeps its own target position.
        if (window.TrionLenis) window.TrionLenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
        return true;
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href') || '';
            // Only intercept same-page hash links (e.g. "#about").
            // Cross-page links like "../index.html#about" must navigate
            // normally so they actually leave the page.
            if (!href.startsWith('#')) return;
            const tabId = href.slice(1);
            if (switchTab(tabId)) {
                e.preventDefault();
                history.replaceState(null, '', '#' + tabId);
            }
        });
    });

    // On load, honour the URL hash so visitors landing on
    // /index.html#services actually see the services tab.
    if (location.hash) {
        const tabId = location.hash.slice(1);
        switchTab(tabId);
    }
    // Also handle back/forward hash changes
    window.addEventListener('hashchange', () => {
        if (location.hash) switchTab(location.hash.slice(1));
    });
}

// Header functionality
function initHeader() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    // rAF-throttled: the raw listener fired on every scroll event and
    // wrote a class each time. switchTab already owns the .nav-link
    // active state, so the duplicate click handler here is gone.
    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            ticking = false;
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// Portfolio filtering
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
}

// Form validation
function validateForm(data) {
    const { firstName, lastName, email, service, message } = data;
    
    if (!firstName || firstName.trim().length < 2) {
        showNotification('Please enter a valid first name', 'error');
        return false;
    }
    
    if (!lastName || lastName.trim().length < 2) {
        showNotification('Please enter a valid last name', 'error');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!service) {
        showNotification('Please select a service', 'error');
        return false;
    }
    
    if (!message || message.trim().length < 10) {
        showNotification('Please enter a message (at least 10 characters)', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#30D158' : type === 'error' ? '#FF3B30' : '#007AFF'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (mobileToggle && navList) {
        mobileToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = this.querySelectorAll('span');
            bars.forEach((bar, index) => {
                if (navList.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                const bars = mobileToggle.querySelectorAll('span');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
                const bars = mobileToggle.querySelectorAll('span');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            }
        });
    }
}

// Utility functions
function debounce(func, wait) {
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



/* The runtime-injected stylesheet was removed. It duplicated and
   overrode rules in styles.css, and its img[loading="lazy"]{opacity:0}
   rule made lazy images invisible whenever its observer didn't run. */


// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Service Worker registration — auto-reload once when a new SW takes over
// so cached old code doesn't keep running after a deploy.
// Skip the service worker on localhost. Registering it during local
// development means every edit is served from the previous build's cache,
// which silently hides your changes. Production is unaffected.
var SW_DISABLED = ['localhost', '127.0.0.1', '[::1]'].indexOf(location.hostname) >= 0;

if (SW_DISABLED && 'serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (rs) {
        rs.forEach(function (r) { r.unregister(); });
    }).catch(function () {});
    if (window.caches) {
        caches.keys().then(function (ks) { ks.forEach(function (k) { caches.delete(k); }); }).catch(function () {});
    }
}

if (!SW_DISABLED && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
    let reloaded = false;
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SW_UPDATED' && !reloaded) {
            reloaded = true;
            window.location.reload();
        }
    });
    // Also reload when the controlling SW changes (e.g. on first install)
    let firstControl = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (firstControl && !reloaded) {
            reloaded = true;
            window.location.reload();
        }
    });
}
/* ─── Language switcher (🌐 globe dropdown) — click to toggle, outside/Esc to close ─── */
(function () {
    function closeAll(except) {
        document.querySelectorAll('.lang-dropdown.open').forEach(function (d) {
            if (d === except) return;
            d.classList.remove('open');
            var t = d.querySelector('.lang-dropdown-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        });
    }
    document.addEventListener('click', function (e) {
        var toggle = e.target.closest('.lang-dropdown-toggle');
        if (toggle) {
            e.preventDefault();
            var dd = toggle.closest('.lang-dropdown');
            var willOpen = !dd.classList.contains('open');
            closeAll(dd);
            dd.classList.toggle('open', willOpen);
            toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            return;
        }
        if (!e.target.closest('.lang-dropdown-menu')) closeAll(null);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAll(null);
    });
})();
