/* ════════════════════════════════════════════════════════════════════
   TRION — MOTION
   ────────────────────────────────────────────────────────────────────
   GSAP 3 (ScrollTrigger + SplitText) and Lenis, loaded from
   vendor/motion.min.js on every page. Rules this file keeps:

     • Content is visible without JS. Nothing is hidden by CSS; every
       "from" state is set here, so if the vendor file fails to load
       the page simply renders statically.
     • Transforms, opacity and clip-path only. No layout properties are
       animated, so nothing shifts (CLS stays at zero).
     • prefers-reduced-motion: no smooth scroll, no reveals, no parallax.
     • Smooth scroll only on fine pointers. Touch devices keep native
       momentum scrolling, which is better than anything a library does.
     • Tabs (index.html) stay real anchors. A panel's animations are
       built the first time it is shown, never while it is hidden.

   Opt-in attributes used across the site's pages:
     [data-reveal]            fade + rise when scrolled into view
     [data-reveal-group]      parent: children with [data-reveal] stagger
     [data-split] [data-clip] heading: lines slide up out of a mask
     [data-parallax]          gentle vertical drift (value = strength)
     [data-img-reveal]        image frame wipes open, image settles
     [data-hero-intro]        page-load sequence for the first screen
   ════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var html = document.documentElement;
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    var Split = window.SplitText;
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    var cjk = /^(zh|ja|ko|th)/i.test(html.lang || '');

    /* Header: solid once the page has moved, hidden while reading down,
       back as soon as the reader scrolls up. Works with or without GSAP. */
    function initHeader() {
        var header = document.querySelector('.header');
        if (!header) return;
        var lastY = window.scrollY, ticking = false;
        function update() {
            ticking = false;
            var y = window.scrollY;
            var menuOpen = document.body.classList.contains('menu-open');
            header.classList.toggle('scrolled', y > 24);
            if (!menuOpen && !reduced) {
                if (y > 240 && y > lastY + 4) header.classList.add('is-tucked');
                else if (y < lastY - 4 || y < 240) header.classList.remove('is-tucked');
            }
            lastY = y;
        }
        addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
    }

    initHeader();

    if (reduced || !gsap || !ST) {
        html.classList.add('motion-off');
        window.TrionMotion = { activate: function () {} };
        return;
    }

    gsap.registerPlugin(ST);
    if (Split) gsap.registerPlugin(Split);
    html.classList.add('motion-on');

    var EASE = 'power3.out';

    /* ───────────── smooth scroll ───────────── */
    var lenis = null;
    if (fine && window.Lenis) {
        lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true, autoRaf: false });
        lenis.on('scroll', ST.update);
        gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        gsap.ticker.lagSmoothing(0);
        window.TrionLenis = lenis;
    }

    /* ───────────── helpers ───────────── */
    function inside(el, root) { return root === document || root.contains(el); }

    /* Is this element in a hidden tab panel? Then it waits for activate(). */
    function inHiddenPanel(el) {
        var p = el.closest('.tab-content');
        return !!(p && !p.classList.contains('active'));
    }

    function pick(root, sel) {
        return Array.prototype.filter.call(root.querySelectorAll(sel), function (el) {
            return !el.hasAttribute('data-motion-done') && !inHiddenPanel(el);
        });
    }

    /* Anything already scrolled past when its trigger is created must not
       be left hidden: show it immediately. */
    function alreadyPassed(el) {
        return el.getBoundingClientRect().bottom < 0;
    }

    /* ───────────── reveals ───────────── */
    function initReveals(root) {
        var els = pick(root, '[data-reveal]');
        if (!els.length) return;
        els.forEach(function (el) { el.setAttribute('data-motion-done', ''); });
        var show = [], hide = [];
        els.forEach(function (el) { (alreadyPassed(el) ? show : hide).push(el); });
        gsap.set(hide, { autoAlpha: 0, y: 28 });
        ST.batch(hide, {
            start: 'top 92%',
            once: true,
            onEnter: function (batch) {
                gsap.to(batch, {
                    autoAlpha: 1, y: 0, duration: 0.9, ease: EASE,
                    stagger: 0.08, overwrite: true, clearProps: 'transform'
                });
            }
        });
    }

    /* ───────────── headings: lines rise out of a mask ───────────── */
    function initHeadings(root) {
        var els = pick(root, '[data-split], [data-clip]');
        els.forEach(function (el) {
            el.setAttribute('data-motion-done', '');
            var start = 'top 88%';
            /* Latin text splits into lines. CJK and Thai have no spaces to
               break words on, so a split would stop the heading wrapping:
               those get a plain rise instead. */
            if (!Split || cjk || el.querySelector('br')) {
                if (alreadyPassed(el)) return;
                gsap.from(el, {
                    autoAlpha: 0, y: 24, duration: 0.9, ease: EASE,
                    scrollTrigger: { trigger: el, start: start, once: true }
                });
                return;
            }
            Split.create(el, {
                type: 'lines',
                mask: 'lines',
                autoSplit: true,
                linesClass: 'split-line',
                onSplit: function (self) {
                    if (alreadyPassed(el)) return;
                    return gsap.from(self.lines, {
                        yPercent: 110, duration: 1.05, ease: 'expo.out', stagger: 0.09,
                        scrollTrigger: { trigger: el, start: start, once: true }
                    });
                }
            });
        });
    }

    /* ───────────── image frames ───────────── */
    function initImages(root) {
        var els = pick(root, '[data-img-reveal]');
        els.forEach(function (frame) {
            frame.setAttribute('data-motion-done', '');
            if (alreadyPassed(frame)) return;
            var img = frame.querySelector('img');
            var tl = gsap.timeline({
                scrollTrigger: { trigger: frame, start: 'top 90%', once: true }
            });
            tl.fromTo(frame, { clipPath: 'inset(12% 6% 12% 6% round 6px)' },
                { clipPath: 'inset(0% 0% 0% 0% round 6px)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' });
            if (img) tl.from(img, { scale: 1.12, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0);
        });
    }

    /* ───────────── parallax (desktop only) ───────────── */
    function initParallax(root) {
        if (!fine) return;
        pick(root, '[data-parallax]').forEach(function (el) {
            el.setAttribute('data-motion-done', '');
            var amt = parseFloat(el.getAttribute('data-parallax')) || 0.05;
            gsap.fromTo(el, { yPercent: amt * 60 }, {
                yPercent: -amt * 60, ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
            });
        });
    }

    /* ───────────── first screen ───────────── */
    function initIntro(root) {
        var host = pick(root, '[data-hero-intro]')[0];
        if (!host) return;
        host.setAttribute('data-motion-done', '');
        var title = host.querySelector('h1');
        var lines = Array.prototype.filter.call(host.querySelectorAll('[data-intro]'), function (el) {
            return !(title && el === title && Split && !cjk);
        });
        var pics = host.querySelectorAll('[data-intro-pic]');
        var tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });
        /* The headline rises line by line out of a mask. SplitText
           re-splits on resize (autoSplit); the tween is rebuilt with it. */
        if (title && Split && !cjk) {
            Split.create(title, {
                type: 'lines', mask: 'lines', autoSplit: true, linesClass: 'split-line',
                onSplit: function (self) {
                    return gsap.from(self.lines, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.15 });
                }
            });
        }
        if (lines.length) tl.from(lines, { autoAlpha: 0, y: 22, duration: 0.9, stagger: 0.08 }, 0.35);
        if (pics.length) {
            tl.fromTo(pics, { clipPath: 'inset(100% 0% 0% 0%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', stagger: 0.12, clearProps: 'clipPath' }, 0.1);
            tl.from(host.querySelectorAll('[data-intro-pic] img'),
                { scale: 1.18, duration: 1.8, ease: 'expo.out', stagger: 0.12, clearProps: 'transform' }, 0.25);
        }
    }

    function build(root) {
        initIntro(root);
        initHeadings(root);
        initReveals(root);
        initImages(root);
        initParallax(root);
    }

    /* Called by script.js after a tab becomes visible. */
    function activate(panel) {
        build(panel || document);
        ST.refresh();
    }
    window.TrionMotion = { activate: activate };

    function start() {
        build(document);
        /* Fonts and late images change heights; settle positions after. */
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
        addEventListener('load', function () { ST.refresh(); });
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', start)
        : start();
})();
