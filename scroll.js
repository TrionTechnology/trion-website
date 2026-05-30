/* ════════════════════════════════════════════════════════════
   TRION SCROLL CINEMA
   Pinned hero · scroll-scrubbed transforms · word reveal
   counter · 3D stagger · scroll-velocity canvas · progress bar
   ════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;

    /* ──────────── helpers ──────────── */
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const ease = (t) => 1 - Math.pow(1 - t, 3); // cubic out

    let scrollY = window.scrollY;
    let lastScrollY = scrollY;
    let scrollVelocity = 0;
    const subs = [];
    const onScroll = (fn) => subs.push(fn);

    function tick() {
        scrollY = window.scrollY;
        scrollVelocity = lerp(scrollVelocity, Math.abs(scrollY - lastScrollY), 0.18);
        lastScrollY = scrollY;
        for (const fn of subs) fn(scrollY, scrollVelocity);
        requestAnimationFrame(tick);
    }

    /* ──────────── 1. Holographic scroll progress bar ──────────── */
    function initProgressBar() {
        const bar = document.createElement('div');
        bar.className = 'holo-progress';
        bar.innerHTML = '<div class="holo-progress-fill"></div>';
        document.body.appendChild(bar);
        const fill = bar.querySelector('.holo-progress-fill');
        onScroll((y) => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? clamp(y / max, 0, 1) : 0;
            fill.style.transform = `scaleX(${p})`;
        });
    }

    /* ──────────── 2. Pinned hero scroll-scrub ──────────── */
    function initHeroPin() {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;
        const text = hero.querySelector('.hero-text');
        const image = hero.querySelector('.hero-image');
        const stats = hero.querySelector('.hero-stats');
        const subtitle = hero.querySelector('.hero-subtitle');

        onScroll((y) => {
            const rect = hero.getBoundingClientRect();
            const vh = window.innerHeight;
            const progress = clamp(-rect.top / vh, 0, 1);
            const fade = clamp(1 - progress * 1.3, 0, 1);

            if (text) {
                text.style.transform = `translateY(${progress * -60}px) scale(${1 - progress * 0.08})`;
                text.style.opacity = fade;
                text.style.filter = `blur(${progress * 12}px)`;
            }
            if (image) {
                const rx = -6 + progress * 6;
                const ry = -6 + progress * 6;
                image.style.transform = `perspective(1200px) rotateY(${ry}deg) rotateX(${rx}deg) translateY(${progress * 40}px) scale(${1 + progress * 0.08})`;
                image.style.opacity = fade;
            }
            if (subtitle) subtitle.style.transform = `translateX(${progress * -50}px)`;
            if (stats) {
                stats.style.transform = `translateY(${progress * 40}px)`;
                stats.style.opacity = fade;
            }
        });
    }

    /* ──────────── 3. Word-by-word reveal on headings ──────────── */
    function initWordReveal() {
        const selectors = [
            '.features-section h2',
            '.achievements-section h2',
            '.testimonials-section h2',
            '.page-header h1',
            '.about-text h2',
            '.contact-details h2'
        ];
        const els = document.querySelectorAll(selectors.join(','));
        els.forEach((el) => {
            if (el.dataset.wordSplit) return;
            const html = el.innerHTML;
            // Don't split inner HTML elements like .highlight — wrap their text content
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
            const texts = [];
            let n;
            while ((n = walker.nextNode())) texts.push(n);
            texts.forEach((node) => {
                const words = node.textContent.split(/(\s+)/);
                const frag = document.createDocumentFragment();
                words.forEach((w) => {
                    if (/^\s+$/.test(w)) {
                        frag.appendChild(document.createTextNode(w));
                    } else if (w.length) {
                        const span = document.createElement('span');
                        span.className = 'word-rev';
                        span.textContent = w;
                        frag.appendChild(span);
                    }
                });
                node.parentNode.replaceChild(frag, node);
            });
            el.dataset.wordSplit = '1';
        });

        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    const words = e.target.querySelectorAll('.word-rev');
                    words.forEach((w, i) => {
                        w.style.transitionDelay = `${i * 50}ms`;
                        requestAnimationFrame(() => w.classList.add('in'));
                    });
                    io.unobserve(e.target);
                }
            }
        }, { threshold: 0.2 });
        els.forEach((el) => io.observe(el));
    }

    /* ──────────── 4. Animated counters on stats ──────────── */
    function initCounters() {
        const nums = document.querySelectorAll('.stat-number, .achievement-number');
        nums.forEach((el) => {
            const raw = el.textContent.trim();
            const m = raw.match(/([\d,]+(?:\.\d+)?)/);
            if (!m) return;
            const targetNum = parseFloat(m[1].replace(/,/g, ''));
            if (isNaN(targetNum)) return;
            const suffix = raw.slice(m.index + m[0].length);
            const prefix = raw.slice(0, m.index);
            el.dataset.target = targetNum;
            el.dataset.prefix = prefix;
            el.dataset.suffix = suffix;
            el.textContent = `${prefix}0${suffix}`;
        });

        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseFloat(el.dataset.target);
                    const prefix = el.dataset.prefix || '';
                    const suffix = el.dataset.suffix || '';
                    const dur = 1600;
                    const t0 = performance.now();
                    function step(now) {
                        const p = clamp((now - t0) / dur, 0, 1);
                        const v = target * ease(p);
                        const out = target >= 10 ? Math.round(v) : v.toFixed(1);
                        el.textContent = `${prefix}${out}${suffix}`;
                        if (p < 1) requestAnimationFrame(step);
                    }
                    requestAnimationFrame(step);
                    io.unobserve(el);
                }
            }
        }, { threshold: 0.4 });
        nums.forEach((el) => el.dataset.target && io.observe(el));
    }

    /* ──────────── 5. 3D stagger entrance for card grids ──────────── */
    function initCardEntrance() {
        const grids = document.querySelectorAll('.features-grid, .services-grid, .portfolio-grid, .partnerships-grid, .testimonials-grid, .achievements-grid, .tech-stack-grid, .values-grid');
        grids.forEach((grid) => {
            const cards = grid.children;
            Array.from(cards).forEach((card, i) => {
                if (!card.classList.contains('reveal-3d')) {
                    card.classList.add('reveal-3d');
                    card.style.transitionDelay = `${(i % 6) * 90}ms`;
                }
            });
        });
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    e.target.classList.add('reveal-3d-in');
                    io.unobserve(e.target);
                }
            }
        }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });
        document.querySelectorAll('.reveal-3d').forEach((el) => io.observe(el));
    }

    /* ──────────── 6. Section parallax depth ──────────── */
    function initSectionParallax() {
        if (isTouch || reducedMotion) return;
        const sections = document.querySelectorAll('.page-header.with-banner, .hero-video-wrapper, .features-section, .achievements-section, .testimonials-section, .about-image, .hero-image, .contact-form-section');
        const layers = Array.from(sections).map((el) => ({
            el,
            speed: parseFloat(el.dataset.parallax || (el.classList.contains('page-header') ? 0.25 : el.classList.contains('hero-video-wrapper') ? 0.4 : 0.12))
        }));
        onScroll((y) => {
            for (const l of layers) {
                const rect = l.el.getBoundingClientRect();
                const center = rect.top + rect.height / 2 - window.innerHeight / 2;
                const offset = -center * l.speed;
                l.el.style.setProperty('--parallax-y', `${offset}px`);
                // Apply only if not already transformed by tilt
                if (!l.el.matches(':hover') && !l.el.classList.contains('hero-image') && !l.el.classList.contains('about-image')) {
                    l.el.style.backgroundPositionY = `calc(50% + ${offset}px)`;
                }
            }
        });
    }

    /* ──────────── 7. Scroll-velocity reactive canvas ──────────── */
    function initCanvasScrollFx() {
        const canvas = document.getElementById('trion-canvas');
        if (!canvas) return;
        onScroll((y, v) => {
            const intensity = clamp(v / 30, 0, 1);
            canvas.style.filter = `hue-rotate(${intensity * 30}deg) saturate(${1 + intensity * 0.4}) blur(${intensity * 1.2}px)`;
            canvas.style.transform = `scale(${1 + intensity * 0.03})`;
        });
    }

    /* ──────────── 8. Scroll-driven gradient sweep on section dividers ──────────── */
    function initSectionGlow() {
        const sections = document.querySelectorAll('.features-section, .achievements-section, .testimonials-section, .services-grid, .portfolio-grid, .tech-stack-grid');
        sections.forEach((s) => {
            const beam = document.createElement('div');
            beam.className = 'section-beam';
            s.style.position = s.style.position || 'relative';
            s.appendChild(beam);
        });
        onScroll(() => {
            document.querySelectorAll('.section-beam').forEach((beam) => {
                const parent = beam.parentElement;
                const rect = parent.getBoundingClientRect();
                const vh = window.innerHeight;
                const progress = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
                beam.style.opacity = Math.sin(progress * Math.PI) * 0.9;
                beam.style.transform = `translateX(${(progress - 0.5) * 100}%)`;
            });
        });
    }

    /* ──────────── 9. Tab-switch cinematic reset ──────────── */
    function initTabHooks() {
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    // re-trigger word reveal + card entrance on the newly active tab
                    document.querySelectorAll('.word-rev').forEach((w) => w.classList.remove('in'));
                    document.querySelectorAll('.reveal-3d').forEach((c) => c.classList.remove('reveal-3d-in'));
                    initWordReveal();
                    initCardEntrance();
                }, 50);
            });
        });
    }

    /* ──────────── INIT ──────────── */
    function start() {
        initProgressBar();
        if (!reducedMotion) initHeroPin();
        initWordReveal();
        initCounters();
        initCardEntrance();
        initSectionParallax();
        if (!reducedMotion) initCanvasScrollFx();
        initSectionGlow();
        initTabHooks();
        requestAnimationFrame(tick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
