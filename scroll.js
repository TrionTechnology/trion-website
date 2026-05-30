/* ════════════════════════════════════════════════════════════
   TRION SCROLL CINEMA — v3 (Lenis-lite virtual scroll)
   ────────────────────────────────────────────────────────────
   The page content is translated by a single transform on a
   wrapper. Body height matches the content so the native
   scrollbar still works, anchor links still scroll, keyboard
   nav still works — but every visible pixel is interpolated
   toward the native scrollY value with a critically-damped
   lerp. All scroll-driven effects subscribe to the same
   `currentY` (the *displayed* position), so the scrub matches
   what the eye sees exactly.
   ════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;

    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const smoothstep = (e0, e1, x) => {
        const t = clamp((x - e0) / (e1 - e0), 0, 1);
        return t * t * (3 - 2 * t);
    };
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    /* ──────────── shared smooth scroll bus ──────────── */
    let displayY = window.scrollY;   // what the wrapper transform shows
    let targetY = displayY;          // native scrollY
    let velocityY = 0;
    let lastDisplayY = displayY;
    let mouseSmoothX = window.innerWidth / 2;
    let mouseSmoothY = window.innerHeight / 2;
    let mouseTargetX = mouseSmoothX;
    let mouseTargetY = mouseSmoothY;
    let isScrolling = false;
    let scrollIdleTimer = null;

    const subs = [];
    const onTick = (fn) => subs.push(fn);

    // Lottie players are the dominant cost on the home page (6 of them in
    // the features grid, each a 200x200 SVG animation on the main thread).
    // We do TWO things:
    //   1. IntersectionObserver: only play Lotties currently in viewport.
    //      On a long scroll, only 2-3 are visible at any time, not all 6/9.
    //   2. Pause every Lottie during active scroll, resume at idle.
    let lotties = [];
    const visibleLotties = new WeakSet();
    let lottieIO = null;
    function refreshLotties() {
        lotties = Array.from(document.querySelectorAll('lottie-player'));
        if (!lottieIO) {
            lottieIO = new IntersectionObserver((entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        visibleLotties.add(e.target);
                        if (!isScrolling) { try { e.target.play(); } catch (_) {} }
                    } else {
                        visibleLotties.delete(e.target);
                        try { e.target.pause(); } catch (_) {}
                    }
                }
            }, { rootMargin: '100px' });
        }
        lotties.forEach((p) => lottieIO.observe(p));
    }

    // Hero video — also expensive (mix-blend + filter recomposite per frame)
    let heroVideo = null;
    function refreshHeroVideo() {
        heroVideo = document.querySelector('.hero-video-wrapper video');
    }

    window.addEventListener('scroll', () => {
        targetY = window.scrollY;
        if (!isScrolling) {
            isScrolling = true;
            document.body.classList.add('is-scrolling');
            for (const p of lotties) { try { p.pause(); } catch (_) {} }
            if (heroVideo) { try { heroVideo.pause(); } catch (_) {} }
        }
        clearTimeout(scrollIdleTimer);
        scrollIdleTimer = setTimeout(() => {
            isScrolling = false;
            document.body.classList.remove('is-scrolling');
            for (const p of lotties) {
                if (visibleLotties.has(p)) { try { p.play(); } catch (_) {} }
            }
            if (heroVideo) { try { heroVideo.play(); } catch (_) {} }
        }, 180);
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        mouseTargetX = e.clientX;
        mouseTargetY = e.clientY;
    }, { passive: true });

    /* ──────────── Lenis-lite wrapper ──────────── */
    let wrapper = null;
    function initSmoothWrapper() {
        if (isTouch || reducedMotion) return false;
        const main = document.querySelector('.main-content');
        const footer = document.querySelector('.footer');
        if (!main) return false;

        wrapper = document.createElement('div');
        wrapper.className = 'smooth-wrapper';
        main.parentNode.insertBefore(wrapper, main);
        wrapper.appendChild(main);
        if (footer) wrapper.appendChild(footer);

        // Make body tall enough that native scroll works
        function syncHeight() {
            const h = wrapper.offsetHeight;
            document.body.style.height = h + 'px';
        }
        syncHeight();

        // Re-sync on resize and on content mutations (Lottie loads, image decode, etc.)
        const ro = new ResizeObserver(syncHeight);
        ro.observe(wrapper);
        window.addEventListener('load', syncHeight);

        // Tab switches change content height dramatically
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => requestAnimationFrame(syncHeight));
        });

        return true;
    }

    /* ──────────── master rAF ──────────── */
    function tick() {
        // Tuned for responsiveness over butter — light smoothing only.
        // Earlier rates (0.10) made the page lag ~130ms behind input.
        const lerpRate = isScrolling ? 0.30 : 0.45;
        displayY = lerp(displayY, targetY, lerpRate);
        if (Math.abs(displayY - targetY) < 0.08) displayY = targetY;

        if (wrapper) {
            wrapper.style.transform = `translate3d(0, ${-displayY}px, 0)`;
        }

        const instVel = displayY - lastDisplayY;
        velocityY = lerp(velocityY, instVel, 0.10);
        lastDisplayY = displayY;

        mouseSmoothX = lerp(mouseSmoothX, mouseTargetX, 0.08);
        mouseSmoothY = lerp(mouseSmoothY, mouseTargetY, 0.08);

        for (const fn of subs) fn(displayY, velocityY, mouseSmoothX, mouseSmoothY);

        requestAnimationFrame(tick);
    }

    /* ──────────── 1. Scroll-progress halo ──────────── */
    function initProgressBar() {
        const bar = document.createElement('div');
        bar.className = 'holo-progress';
        bar.innerHTML = '<div class="holo-progress-fill"></div>';
        document.body.appendChild(bar);
        const fill = bar.querySelector('.holo-progress-fill');
        onTick((y) => {
            const max = (wrapper ? wrapper.offsetHeight : document.documentElement.scrollHeight) - window.innerHeight;
            const p = max > 0 ? clamp(y / max, 0, 1) : 0;
            fill.style.transform = `scaleX(${p})`;
        });
    }

    /* ──────────── 2. Hero pin — reads cached rect ──────────── */
    function initHeroPin() {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;
        const text = hero.querySelector('.hero-text');
        const image = hero.querySelector('.hero-image');
        const stats = hero.querySelector('.hero-stats');
        const subtitle = hero.querySelector('.hero-subtitle');

        // Cache hero offset so we don't call getBoundingClientRect per frame
        let heroTop = 0;
        let heroHeight = 0;
        function measure() {
            const r = hero.getBoundingClientRect();
            heroTop = r.top + (wrapper ? displayY : window.scrollY);
            heroHeight = r.height;
        }
        measure();
        window.addEventListener('resize', measure);
        window.addEventListener('load', measure);

        let progress = 0;
        onTick((y) => {
            const vh = window.innerHeight;
            // Pin range: top of hero -> 1.8 viewports below
            const target = clamp((y - heroTop) / (vh * 1.8), 0, 1);
            progress = lerp(progress, target, 0.12);

            const p = smoothstep(0, 1, progress);
            const fade = 1 - smoothstep(0.30, 1, progress);

            if (text) {
                text.style.transform = `translate3d(0, ${p * -18}px, 0)`;
                text.style.opacity = fade;
            }
            if (image) {
                image.style.transform = `perspective(1400px) rotateY(${-3 + p * 3}deg) translate3d(0, ${p * 12}px, 0)`;
                image.style.opacity = lerp(1, 0.85, p);
            }
            if (subtitle) {
                subtitle.style.transform = `translate3d(${p * -12}px, 0, 0)`;
                subtitle.style.opacity = fade;
            }
            if (stats) {
                stats.style.transform = `translate3d(0, ${p * 12}px, 0)`;
                stats.style.opacity = fade;
            }
        });
    }

    /* ──────────── 3. Word reveal ──────────── */
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
                        w.style.transitionDelay = `${i * 110}ms`;
                        requestAnimationFrame(() => w.classList.add('in'));
                    });
                    io.unobserve(e.target);
                }
            }
        }, { threshold: 0.18 });
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
            const t = parseFloat(m[1].replace(/,/g, ''));
            if (isNaN(t)) return;
            el.dataset.target = t;
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

    /* ──────────── 5. Card entrance ────────────
       Excludes .portfolio-grid intentionally: the portfolio cards are
       hero content and should be visible immediately. The reveal-3d
       opacity:0 starting state combined with IntersectionObserver math
       inside the Lenis wrapper sometimes left side cards stuck blank. */
    function initCardEntrance() {
        const grids = document.querySelectorAll('.features-grid, .services-grid, .partnerships-grid, .testimonials-grid, .achievements-grid, .tech-stack-grid, .values-grid');
        grids.forEach((grid) => {
            Array.from(grid.children).forEach((card, i) => {
                if (!card.classList.contains('reveal-3d')) {
                    card.classList.add('reveal-3d');
                    card.style.transitionDelay = `${(i % 6) * 140}ms`;
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

    /* ──────────── 6. Ambient halo (idle only) ──────────── */
    function initAmbientHalo() {
        if (isTouch || reducedMotion) return;
        const halo = document.createElement('div');
        halo.className = 'ambient-halo';
        document.body.appendChild(halo);
        onTick((_y, _v, mx, my) => {
            halo.style.transform = `translate3d(${mx - 250}px, ${my - 250}px, 0)`;
        });
    }

    /* ──────────── 7. Tab hooks ──────────── */
    function initTabHooks() {
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    document.querySelectorAll('.word-rev').forEach((w) => w.classList.remove('in'));
                    document.querySelectorAll('.reveal-3d').forEach((c) => c.classList.remove('reveal-3d-in'));
                    initWordReveal();
                    initCardEntrance();
                    // Snap virtual scroll to top on tab change (scripted scroll did this natively)
                    requestAnimationFrame(() => { displayY = window.scrollY; });
                }, 80);
            });
        });
    }

    /* ──────────── INIT ──────────── */
    function start() {
        // Disable browser scroll restoration jump so we control the start position
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

        // Initial lottie scan + re-scan after window load (they upgrade async)
        refreshLotties();
        refreshHeroVideo();
        window.addEventListener('load', () => { refreshLotties(); refreshHeroVideo(); });

        initSmoothWrapper();
        // Sync to current native scroll position so reload doesn't animate from 0
        displayY = window.scrollY;
        targetY = window.scrollY;
        lastDisplayY = displayY;

        initProgressBar();
        if (!reducedMotion) initHeroPin();
        initWordReveal();
        initCounters();
        initCardEntrance();
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
