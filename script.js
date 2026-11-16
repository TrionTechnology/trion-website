// Modern JavaScript for Trion Creation Website - Tab-Based Design

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTabNavigation();
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

    function isPanel(el) { return !!(el && el.classList.contains('tab-content')); }

    function scrollToEl(el) {
        var top = el.getBoundingClientRect().top + window.scrollY - 72;
        if (window.TrionLenis) window.TrionLenis.scrollTo(top, { duration: 1.1 });
        else window.scrollTo({ top: top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }

    function switchTab(tabId) {
        var target = document.getElementById(tabId);
        if (!target) return false;
        // A hash that names something inside a panel (e.g. #work on the
        // home tab) shows that panel, then scrolls to the element.
        if (!isPanel(target)) {
            var panel = target.closest('.tab-content');
            if (panel && !panel.classList.contains('active')) applyTab(panel.id, panel);
            requestAnimationFrame(function () { scrollToEl(target); });
            return true;
        }
        var targetContent = target;
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
        if (window.TrionLenis) window.TrionLenis.scrollTo(0, { immediate: true, force: true });
        else window.scrollTo(0, 0);
        if (window.TrionMotion) window.TrionMotion.activate(targetContent);
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

    // Other same-page links (hero buttons, footer, "see our work").
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href^="#"]');
        if (!a || a.classList.contains('nav-link') || a.classList.contains('skip-link')) return;
        var id = a.getAttribute('href').slice(1);
        if (!id || !document.getElementById(id)) return;
        if (switchTab(id)) {
            e.preventDefault();
            history.replaceState(null, '', '#' + id);
        }
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
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Contact form. There is no mail backend on this static site, so the
// form used to pretend: it showed "Message sent successfully" and sent
// nothing. It now hands the enquiry to WhatsApp (the studio's real
// channel) with every field filled in, so nothing is lost.
const TRION_WHATSAPP = '60166380495';

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        if (!validateForm(data)) return;
        const sel = this.querySelector('#service');
        const service = sel && sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].text : data.service;
        const lines = [
            'Hi Trion Creation,',
            '',
            'Name: ' + data.firstName.trim() + ' ' + data.lastName.trim(),
            'Email: ' + data.email.trim(),
            data.company ? 'Company: ' + data.company.trim() : '',
            'Interested in: ' + service,
            '',
            data.message.trim()
        ].filter((l, i) => l !== '' || i === 1 || i === 6);
        const url = 'https://wa.me/' + TRION_WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
        const win = window.open(url, '_blank', 'noopener');
        if (!win) window.location.href = url;
        const lang = (document.documentElement.lang || 'en').slice(0, 2);
        showNotification({
            zh: '正在打开 WhatsApp，消息已填好，按发送即可。',
            ms: 'WhatsApp sedang dibuka dengan mesej anda. Tekan hantar di sana.'
        }[lang] || 'Opening WhatsApp with your message. Press send there and we will reply.', 'success');
    });
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
        background: ${type === 'error' ? '#B3261E' : '#EDEAE3'};
        color: ${type === 'error' ? '#fff' : '#141412'};
        padding: 16px 20px;
        border-radius: 6px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-family: inherit;
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

// Mobile menu: a full-screen sheet. body.menu-open drives the styles.
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    if (!toggle || !navList) return;
    toggle.setAttribute('aria-expanded', 'false');
    if (!toggle.hasAttribute('aria-label')) toggle.setAttribute('aria-label', 'Menu');

    function setOpen(open) {
        navList.classList.toggle('active', open);
        document.body.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (window.TrionLenis) open ? window.TrionLenis.stop() : window.TrionLenis.start();
    }

    toggle.addEventListener('click', () => setOpen(!navList.classList.contains('active')));
    navList.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', (e) => {
        if (navList.classList.contains('active') && !toggle.contains(e.target) && !navList.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    matchMedia('(min-width: 1025px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
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
