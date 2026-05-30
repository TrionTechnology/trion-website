/* ════════════════════════════════════════════════════════════
   TRION SCROLL CINEMA — v2 (smooth, ambient, cinematic)
   Inertial scroll · dampened scrub · gentle reveals · counters
   3D card entrance · scroll-velocity FX · scroll-progress halo
   ════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;

    /* ──────────── core helpers ──────────── */
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const smoothstep = (e0, e1, x) => {
        const t = clamp((x - e0) / (e1 - e0), 0, 1);
        return t * t * (3 - 2 * t);
    };
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    /* ──────────── inertial scroll bus ──────────── */
    // We don't hijack scroll (that breaks anchors, accessibility, mobile feel).
    // Instead we expose a *smoothed* scroll value that effects subscribe to,
    // so spikes from trackpads / wheels don't propagate as jitter.
    let rawY = window.scrollY;
    let smoothY = rawY;
    let smoothVel = 0;
    let lastSmoothY = smoothY;
    let mouseSmoothX = window.innerWidth / 2;
    let mouseSmoothY = window.innerHeight / 2;
    let mouseTargetX = mouseSmoothX;
    let mouseTargetY = mouseSmoothY;

    const subs = [];
    const onTick = (fn) => subs.push(fn);

    window.addEventListener('scroll', () => { rawY = window.scrollY; }, { passive: true });
    window.addEventListener('mousemove', (e) => {
        mouseTargetX = e.clientX;
        mouseTargetY = e.clientY;
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
        if (e.touches[0]) { mouseTargetX = e.touches[0].clientX; mouseTargetY = e.touches[0].clientY; }
    }, { passive: true });

    function tick() {
        // Soft critically-damped follow (smaller = smoother / more inertia)
        smoothY = lerp(smoothY, rawY, 0.12);
        if (Math.abs(smoothY - rawY) < 0.05) smoothY = rawY;
        const instVel = smoothY - lastSmoothY;
        smoothVel = lerp(smoothVel, instVel, 0.15);
        lastSmoothY = smoothY;

        mouseSmoothX = lerp(mouseSmoothX, mouseTargetX, 0.10);
        mouseSmoothY = lerp(mouseSmoothY, mouseTargetY, 0.10);

        for (const fn of subs) fn(smoothY, smoothVel, mouseSmoothX, mouseSmoothY);
        requestAnimationFrame(tick);
    }

    /* ──────────── 1. Holographic scroll progress halo ──────────── */
    function initProgressBar() {
        const bar = document.createElement('div');
        bar.className = 'holo-progress';
        bar.innerHTML = '<div class="holo-progress-fill"></div>';
        document.body.appendChild(bar);
        const fill = bar.querySelector('.holo-progress-fill');
        let p = 0, target = 0;
        onTick((y) => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            target = max > 0 ? clamp(y / max, 0, 1) : 0;
            p = lerp(p, target, 0.15);
            fill.style.transform = `scaleX(${p})`;
        });
    }

    /* ──────────── 2. Pinned hero — dampened scrub ──────────── */
    function initHeroPin() {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;
        const text = hero.querySelector('.hero-text');
        const image = hero.querySelector('.hero-image');
        const stats = hero.querySelector('.hero-stats');
        const subtitle = hero.querySelector('.hero-subtitle');

        // Smoothed progress — never spikes
        let progress = 0;
        onTick((y) => {
            const rect = hero.getBoundingClientRect();
            const vh = window.innerHeight;
            const target = clamp(-rect.top / (vh * 1.4), 0, 1); // longer scrub distance
            progress = lerp(progress, target, 0.12);

            // Easing — smoothstep takes the bite off both ends
            const p = smoothstep(0, 1, progress);
            const fade = 1 - smoothstep(0.15, 0.95, progress);

            if (text) {
                text.style.transform = `translate3d(0, ${p * -40}px, 0) scale(${1 - p * 0.04})`;
                text.style.opacity = fade;
                text.style.filter = `blur(${p * 6}px)`;
            }
            if (image) {
                image.style.transform = `perspective(1400px) rotateY(${-5 + p * 5}deg) rotateX(${2 - p * 2}deg) translate3d(0, ${p * 24}px, 0) scale(${1 + p * 0.05})`;
                image.style.opacity = lerp(1, 0.7, p);
            }
            if (subtitle) {
                subtitle.style.transform = `translate3d(${p * -28}px, 0, 0)`;
                subtitle.style.opacity = fade;
            }
            if (stats) {
                stats.style.transform = `translate3d(0, ${p * 24}px, 0)`;
                stats.style.opacity = fade;
            }
        });
    }

    /* ──────────── 3. Word-by-word reveal (gentle) ──────────── */
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
                        const wrap = document.createElement('span');
                        wrap.className = 'word-rev-wrap';
                        const inner = document.createElement('span');
                        inner.className = 'word-rev';
                        inner.textContent = w;
                        wrap.appendChild(inner);
                        frag.appendChild(wrap);
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
                        // Gentler stagger — 80ms per word instead of 50
                        w.style.transitionDelay = `${i * 80}ms`;
                        requestAnimationFrame(() => w.classList.add('in'));
                    });
                    io.unobserve(e.target);
                }
            }
        }, { threshold: 0.2 });
        els.forEach((el) => io.observe(el));
    }

    /* ──────────── 4. Counters ──────────── */
    function initCounters() {
        const nums = document.querySelectorAll('.stat-number, .achievement-number');
        nums.forEach((el) => {
            if (el.dataset.target) return;
            const raw = el.textContent.trim();
            const m = raw.match(/([\d,]+(?:\.\d+)?)/);
            if (!m) return;
            const targetNum = parseFloat(m[1].replace(/,/g, ''));
            if (isNaN(targetNum)) return;
            el.dataset.target = targetNum;
            el.dataset.prefix = raw.slice(0, m.index);
            el.dataset.suffix = raw.slice(m.index + m[0].length);
            el.textContent = `${el.dataset.prefix}0${el.dataset.suffix}`;
        });

        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseFloat(el.dataset.target);
                    const prefix = el.dataset.prefix || '';
                    const suffix = el.dataset.suffix || '';
                    const dur = 2000;
                    const t0 = performance.now();
                    function step(now) {
                        const p = clamp((now - t0) / dur, 0, 1);
                        const v = target * easeOutExpo(p);
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

    /* ──────────── 5. Card entrance — gentler 3D float-up ──────────── */
    function initCardEntrance() {
        const grids = document.querySelectorAll('.features-grid, .services-grid, .portfolio-grid, .partnerships-grid, .testimonials-grid, .achievements-grid, .tech-stack-grid, .values-grid');
        grids.forEach((grid) => {
            Array.from(grid.children).forEach((card, i) => {
                if (!card.classList.contains('reveal-3d')) {
                    card.classList.add('reveal-3d');
                    card.style.transitionDelay = `${(i % 6) * 120}ms`;
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
        }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });
        document.querySelectorAll('.reveal-3d').forEach((el) => io.observe(el));
    }

    /* ──────────── 6. Multi-layer parallax (smoothed) ──────────── */
    function initSectionParallax() {
        if (isTouch || reducedMotion) return;
        const sections = document.querySelectorAll('.page-header.with-banner');
        const layers = Array.from(sections).map((el) => ({
            el,
            speed: 0.18,
            pos: 0,
            target: 0,
        }));
        onTick(() => {
            for (const l of layers) {
                const rect = l.el.getBoundingClientRect();
                const center = rect.top + rect.height / 2 - window.innerHeight / 2;
                l.target = -center * l.speed;
                l.pos = lerp(l.pos, l.target, 0.12);
                l.el.style.backgroundPositionY = `calc(50% + ${l.pos}px)`;
            }
        });
    }

    /* ──────────── 7. Scroll-velocity reactive canvas (soft) ──────────── */
    function initCanvasScrollFx() {
        const canvas = document.getElementById('trion-canvas');
        if (!canvas) return;
        let smoothed = 0;
        onTick((_y, v) => {
            const target = clamp(Math.abs(v) / 60, 0, 1);
            smoothed = lerp(smoothed, target, 0.08);
            const hue = smoothed * 22;
            const sat = 1 + smoothed * 0.25;
            const blur = smoothed * 0.8;
            const scale = 1 + smoothed * 0.018;
            canvas.style.filter = `hue-rotate(${hue}deg) saturate(${sat}) blur(${blur}px)`;
            canvas.style.transform = `scale(${scale})`;
        });
    }

    /* ──────────── 8. Ambient mouse-follow halo ──────────── */
    function initAmbientHalo() {
        if (isTouch || reducedMotion) return;
        const halo = document.createElement('div');
        halo.className = 'ambient-halo';
        document.body.appendChild(halo);
        onTick((_y, _v, mx, my) => {
            halo.style.transform = `translate3d(${mx - 300}px, ${my - 300}px, 0)`;
        });
    }

    /* ──────────── 9. Tab-switch cinematic reset ──────────── */
    function initTabHooks() {
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    document.querySelectorAll('.word-rev').forEach((w) => w.classList.remove('in'));
                    document.querySelectorAll('.reveal-3d').forEach((c) => c.classList.remove('reveal-3d-in'));
                    initWordReveal();
                    initCardEntrance();
                }, 80);
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
        initAmbientHalo();
        initTabHooks();
        requestAnimationFrame(tick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
