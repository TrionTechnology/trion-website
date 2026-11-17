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

    /* ═════════════ LIVE LAYER ═════════════
       The home page should feel like software that is running, not a
       brochure. Everything below is decorative (aria-hidden or purely
       visual), pauses off-screen, and never moves layout. */

    var rand = function (a, b) { return a + Math.random() * (b - a); };
    function onScreen(el, cb) {
        if (!('IntersectionObserver' in window)) { cb(true); return; }
        new IntersectionObserver(function (ents) { cb(ents[0].isIntersecting); }, { rootMargin: '80px' }).observe(el);
    }

    /* Interactive dot field behind the hero: dots swell and turn mint
       around the pointer; soft ripples run on their own so it is alive
       on touch screens too. */
    function initDotField(root) {
        var host = pick(root, '.hero-bg')[0];
        if (!host) return;
        host.setAttribute('data-motion-done', '');
        var cv = document.createElement('canvas');
        cv.className = 'hb-canvas';
        host.appendChild(cv);
        host.classList.add('has-canvas');
        var ctx = cv.getContext('2d');
        var hero = host.parentElement;
        var W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2), GAP = 26;
        var mx = -9999, my = -9999, tx = -9999, ty = -9999, ripples = [], running = false, last = 0;
        function size() {
            var r = hero.getBoundingClientRect();
            W = r.width; H = r.height;
            cv.width = W * dpr; cv.height = H * dpr;
            cv.style.width = W + 'px'; cv.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        size();
        addEventListener('resize', size);
        hero.addEventListener('pointermove', function (e) {
            var r = hero.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top;
        });
        hero.addEventListener('pointerleave', function () { tx = ty = -9999; });
        hero.addEventListener('pointerdown', function (e) {
            var r = hero.getBoundingClientRect();
            ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0, s: 1.4 });
        });
        function frame(now) {
            if (!running) return;
            var dt = Math.min(50, now - (last || now)); last = now;
            if (tx < -9000) { mx = tx; my = ty; } else { mx += (tx - mx) * 0.16; my += (ty - my) * 0.16; }
            if (Math.random() < dt / 2600) ripples.push({ x: rand(W * 0.45, W), y: rand(0, H * 0.7), t: 0, s: 1 });
            ctx.clearRect(0, 0, W, H);
            ripples = ripples.filter(function (r) { r.t += dt; return r.t < 2600; });
            var cx = W * 0.72, cy = H * 0.3, maxD = Math.max(W, H) * 0.62;
            for (var y = GAP / 2; y < H; y += GAP) {
                for (var x = GAP / 2; x < W; x += GAP) {
                    var fade = 1 - Math.min(1, Math.hypot((x - cx) * 0.8, y - cy) / maxD);
                    if (fade <= 0.02) continue;
                    var e = 0, d = Math.hypot(x - mx, y - my);
                    if (d < 150) e = Math.pow(1 - d / 150, 2);
                    for (var i = 0; i < ripples.length; i++) {
                        var R = ripples[i], rad = R.t * 0.32, rd = Math.abs(Math.hypot(x - R.x, y - R.y) - rad);
                        if (rd < 26) e = Math.max(e, (1 - rd / 26) * (1 - R.t / 2600) * 0.9 * R.s);
                    }
                    var rr = 1 + e * 2.4;
                    ctx.fillStyle = e > 0.04
                        ? 'rgba(' + Math.round(14 + 99 * e) + ',' + Math.round(16 + 222 * e) + ',' + Math.round(15 + 191 * e) + ',' + (0.18 + e * 0.8) * fade + ')'
                        : 'rgba(14,16,15,' + 0.16 * fade + ')';
                    ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.2832); ctx.fill();
                }
            }
            requestAnimationFrame(frame);
        }
        onScreen(hero, function (vis) {
            if (vis && !running) { running = true; last = 0; requestAnimationFrame(frame); }
            else if (!vis) running = false;
        });
    }

    /* Text that decodes into place, like a terminal resolving a value. */
    var GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+<>/';
    function scrambleTo(el, text, dur) {
        if (cjk || /[^\x00-ɏ]/.test(text)) { el.textContent = text; return; }
        var start = performance.now(), len = text.length;
        dur = dur || 700;
        (function tick(now) {
            var p = Math.min(1, (now - start) / dur), out = '';
            for (var i = 0; i < len; i++) {
                var ch = text[i];
                if (ch === ' ' || p * len * 1.15 > i + 1) out += ch;
                else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
            }
            el.textContent = out;
            if (p < 1) requestAnimationFrame(tick); else el.textContent = text;
        })(start);
    }
    function initScramble(root) {
        pick(root, '.block-kicker, .marquee-label, [data-scramble]').forEach(function (el) {
            el.setAttribute('data-motion-done', '');
            var node = Array.prototype.find.call(el.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); });
            if (!node) return;
            var span = document.createElement('span');
            span.textContent = node.textContent;
            el.replaceChild(span, node);
            var text = span.textContent;
            ST.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { scrambleTo(span, text, 900); } });
        });
    }

    /* "We design and build [ERP systems]" — cycles through what we build. */
    function initRotator(root) {
        pick(root, '[data-rotate]').forEach(function (el) {
            el.setAttribute('data-motion-done', '');
            var words = el.getAttribute('data-rotate').split('|'), i = 0;
            el.style.minWidth = Math.max.apply(null, words.map(function (w) { return w.length; })) * 0.55 + 'em';
            setInterval(function () {
                if (document.hidden) return;
                i = (i + 1) % words.length;
                if (cjk) {
                    gsap.fromTo(el, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: EASE, onStart: function () { el.textContent = words[i]; } });
                } else scrambleTo(el, words[i], 650);
            }, 2400);
        });
    }

    /* Numbers count up when they come into view. */
    function initCounters(root) {
        pick(root, '[data-count]').forEach(function (el) {
            el.setAttribute('data-motion-done', '');
            var end = parseFloat(el.getAttribute('data-count')), o = { v: 0 };
            el.textContent = '0';
            ST.create({
                trigger: el, start: 'top 92%', once: true,
                onEnter: function () {
                    gsap.to(o, { v: end, duration: 1.8, ease: 'expo.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
                }
            });
        });
    }

    /* The hero dashboard: assembles itself, then keeps working. */
    function initStage(root) {
        var stage = pick(root, '[data-intro-stage]')[0];
        if (!stage) return;
        stage.setAttribute('data-motion-done', '');
        var win = stage.querySelector('.hs-window');
        var floats = stage.querySelectorAll('.hs-phone, .hs-game');
        var chips = stage.querySelectorAll('.hs-chip');
        var stroke = stage.querySelector('.hs-stroke'), area = stage.querySelector('.hs-area');
        var bars = stage.querySelectorAll('.hs-bars i');
        var kpis = stage.querySelectorAll('.hs-kpis b');
        var table = stage.querySelector('.hs-table');

        /* The dashboard now lives below the fold: assemble when it arrives. */
        var tl = gsap.timeline({ paused: true });
        ST.create({ trigger: stage, start: 'top 80%', once: true, onEnter: function () { tl.play(); } });
        tl.from(win, { y: 60, rotateX: 14, autoAlpha: 0, duration: 1.4, ease: 'expo.out', transformOrigin: '50% 100%' })
          .from(stage.querySelectorAll('.hs-kpis > div, .hs-charts > *, .hs-row'), { y: 14, autoAlpha: 0, duration: 0.7, stagger: 0.05, ease: EASE }, 0.45)
          .fromTo(stroke, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.7)
          .from(area, { autoAlpha: 0, duration: 1.2 }, 1.2)
          .from(bars, { scaleY: 0, duration: 0.9, stagger: 0.04, ease: 'expo.out' }, 0.8)
          .from(floats, { y: 80, autoAlpha: 0, duration: 1.3, stagger: 0.15, ease: 'expo.out' }, 0.6)
          .from(chips, { scale: 0.6, autoAlpha: 0, duration: 0.8, stagger: 0.18, ease: 'back.out(2.2)' }, 1.2);

        /* KPIs count up, then keep ticking. */
        var vals = [482190, 1284, 98.2];
        kpis.forEach(function (b, i) {
            var o = { v: vals[i] * 0.6 };
            var fmt = function (v) {
                return i === 0 ? 'RM ' + Math.round(v).toLocaleString('en-US') : i === 1 ? Math.round(v).toLocaleString('en-US') : v.toFixed(1) + '%';
            };
            tl.to(o, { v: vals[i], duration: 2, ease: 'expo.out', onUpdate: function () { b.textContent = fmt(o.v); } }, 0.6);
            b._o = o; b._fmt = fmt;
        });

        /* The line chart re-plots itself every few seconds. */
        function curve() {
            var pts = [], n = 7;
            for (var i = 0; i <= n; i++) pts.push([i * (320 / n), Math.max(8, Math.min(100, 96 - i * 11 + rand(-16, 16)))]);
            var d = 'M' + pts[0][0] + ' ' + pts[0][1].toFixed(1);
            for (var j = 1; j < pts.length; j++) {
                var p0 = pts[j - 1], p1 = pts[j], cx = (p0[0] + p1[0]) / 2;
                d += ' C' + cx.toFixed(1) + ' ' + p0[1].toFixed(1) + ' ' + cx.toFixed(1) + ' ' + p1[1].toFixed(1) + ' ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1);
            }
            return d;
        }
        /* Normalise the starting path to the same command shape so GSAP can tween it. */
        var first = curve();
        stroke.setAttribute('d', first);
        area.setAttribute('d', first + ' L320 120 L0 120Z');

        var NAMES = ['Kopi & Co. Bangsar', 'Harmoni Dental', 'Seri Mutiara Motors', 'Petaling Fresh Mart', 'Nusa Learning Hub', 'Kedai Runcit Ali', 'Mutiara Logistics', 'Bloom Clinic', 'Urban Fit KL', 'Lim Hardware'];
        var tags = table ? Array.prototype.map.call(table.querySelectorAll('.hs-tag'), function (t) { return [t.className, t.textContent]; }) : [];
        var running = false, timer = null, beat = 0;
        function tickLive() {
            if (!running || document.hidden) return;
            beat++;
            var d = curve();
            gsap.to(stroke, { attr: { d: d }, duration: 1.4, ease: 'power3.inOut' });
            gsap.to(area, { attr: { d: d + ' L320 120 L0 120Z' }, duration: 1.4, ease: 'power3.inOut' });
            bars.forEach(function (b, i) {
                gsap.to(b, { height: Math.round(Math.min(92, 28 + i * 5.2 + rand(-12, 10))) + '%', duration: 1, ease: 'expo.out', delay: i * 0.03 });
            });
            kpis.forEach(function (b, i) {
                if (!b._o) return;
                var inc = i === 0 ? rand(800, 4200) : i === 1 ? Math.round(rand(1, 6)) : rand(-0.1, 0.1);
                var target = i === 2 ? Math.max(97.4, Math.min(99.6, b._o.v + inc)) : b._o.v + inc;
                gsap.to(b._o, { v: target, duration: 1.2, ease: 'power2.out', onUpdate: function () { b.textContent = b._fmt(b._o.v); } });
                if (i < 2) gsap.fromTo(b, { color: '#0B7F62' }, { color: 'inherit', duration: 1.4 });
            });
            /* A new order arrives at the top of the table. */
            if (table && beat % 2 === 1 && tags.length) {
                var rows = table.querySelectorAll('.hs-row');
                var row = rows[rows.length - 1].cloneNode(true);
                var tg = tags[(Math.random() * tags.length) | 0];
                row.children[1].textContent = NAMES[(Math.random() * NAMES.length) | 0];
                row.children[2].className = tg[0]; row.children[2].textContent = tg[1];
                row.children[3].textContent = 'RM ' + Math.round(rand(300, 15000)).toLocaleString('en-US');
                row.children[0].style.setProperty('--hue', Math.round(rand(0, 360)));
                var old = rows[rows.length - 1];
                gsap.to(old, { autoAlpha: 0, duration: 0.3, onComplete: function () { old.remove(); } });
                table.insertBefore(row, rows[0]);
                gsap.fromTo(row, { autoAlpha: 0, x: -16, backgroundColor: 'rgba(113,238,206,.35)' },
                    { autoAlpha: 1, x: 0, backgroundColor: 'rgba(113,238,206,0)', duration: 1.2, ease: EASE });
            }
            /* API chip: a fresh request every beat. */
            var api = stage.querySelector('.hs-chip-api');
            if (api) {
                var routes = [['POST', '/api/orders', '201'], ['GET', '/api/stock', '200'], ['PUT', '/api/invoices', '200'], ['POST', '/api/bookings', '201'], ['GET', '/api/reports', '200']];
                var r = routes[beat % routes.length];
                api.innerHTML = '<span class="m">' + r[0] + '</span>' + r[1] + ' <span class="ok">' + r[2] + '</span><span class="ms">' + Math.round(rand(18, 64)) + 'ms</span>';
                gsap.fromTo(api, { scale: 0.92 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
            }
            if (beat % 3 === 0) {
                var dep = stage.querySelector('.hs-chip-deploy');
                if (dep) gsap.fromTo(dep, { scale: 0.85, y: 10 }, { scale: 1, y: 0, duration: 0.7, ease: 'back.out(2.5)' });
            }
        }
        onScreen(stage, function (vis) {
            running = vis;
            if (vis && !timer) timer = setInterval(tickLive, 3000);
            else if (!vis && timer) { clearInterval(timer); timer = null; }
        });

        /* Chips bob gently, each on its own rhythm. */
        chips.forEach(function (c, i) {
            gsap.to(c, { y: '+=' + (6 + i * 2), duration: 2.4 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 + i * 0.3 });
        });

        /* Depth parallax: layers drift with the pointer, the window tilts. */
        if (fine) {
            var hero = stage.closest('.hero-section') || stage;
            var layers = Array.prototype.map.call(stage.querySelectorAll('[data-depth]'), function (el) {
                var k = parseFloat(el.getAttribute('data-depth')) || 1;
                var tgt = el.classList.contains('hs-chip') ? el.parentNode && el : el;
                return { k: k, x: gsap.quickTo(tgt, 'x', { duration: 0.9, ease: 'power3' }), y: gsap.quickTo(tgt, 'y', { duration: 0.9, ease: 'power3' }), chip: el.classList.contains('hs-chip') };
            }).filter(function (l) { return !l.chip; });
            var rx = gsap.quickTo(win, 'rotationX', { duration: 1, ease: 'power3' });
            var ry = gsap.quickTo(win, 'rotationY', { duration: 1, ease: 'power3' });
            hero.addEventListener('pointermove', function (e) {
                var r = stage.getBoundingClientRect();
                var nx = (e.clientX - (r.left + r.width / 2)) / innerWidth, ny = (e.clientY - (r.top + r.height / 2)) / innerHeight;
                layers.forEach(function (l) { l.x(nx * 28 * l.k); l.y(ny * 22 * l.k); });
                rx(-ny * 6); ry(nx * 8);
            });
            hero.addEventListener('pointerleave', function () {
                layers.forEach(function (l) { l.x(0); l.y(0); }); rx(0); ry(0);
            });
        }
    }

    /* Cards lean toward the pointer and carry a spotlight. */
    function initTilt(root) {
        if (!fine) return;
        pick(root, '.cap > a, .client-list li a, .stack-row, .work-card').forEach(function (el) {
            el.setAttribute('data-motion-done', '');
            var strong = el.matches('.cap > a');
            var rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
            var ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
            gsap.set(el, { transformPerspective: 900 });
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
                el.style.setProperty('--mx', px * 100 + '%');
                el.style.setProperty('--my', py * 100 + '%');
                var amt = strong ? 5 : 2.5;
                rx((0.5 - py) * amt); ry((px - 0.5) * amt);
            });
            el.addEventListener('pointerleave', function () { rx(0); ry(0); });
        });
    }

    /* Primary buttons pull toward the pointer a little. */
    function initMagnetic(root) {
        if (!fine) return;
        pick(root, '.btn-lg, .header-cta').forEach(function (el) {
            el.setAttribute('data-motion-done', '');
            var x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
            var y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                x((e.clientX - r.left - r.width / 2) * 0.25); y((e.clientY - r.top - r.height / 2) * 0.35);
            });
            el.addEventListener('pointerleave', function () {
                gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    /* Process: a line fills as you read; each step lights up as it passes. */
    function initProcess(root) {
        pick(root, '[data-progress-line]').forEach(function (line) {
            line.setAttribute('data-motion-done', '');
            var sec = line.closest('.home-block') || line.parentNode;
            gsap.fromTo(line, { scaleX: 0 }, {
                scaleX: 1, ease: 'none',
                scrollTrigger: { trigger: sec, start: 'top 70%', end: 'bottom 75%', scrub: 0.6 }
            });
            sec.querySelectorAll('.how-item').forEach(function (it) {
                ST.create({ trigger: it, start: 'top 72%', onToggle: function (s) { it.classList.toggle('is-lit', s.isActive || s.progress > 0); }, end: 'max' });
            });
        });
    }

    /* Tech chips pop in; the marquee runs faster while you scroll. */
    function initStack(root) {
        pick(root, '.stack-row').forEach(function (row) {
            var lis = row.querySelectorAll('li');
            if (alreadyPassed(row)) return;
            gsap.from(lis, { scale: 0.7, autoAlpha: 0, duration: 0.6, stagger: 0.035, ease: 'back.out(2)', scrollTrigger: { trigger: row, start: 'top 88%', once: true } });
        });
        var tracks = pick(root, '.marquee-track ul');
        if (!tracks.length || !tracks[0].getAnimations) return;
        var rate = 1;
        ST.create({
            trigger: tracks[0], start: 'top bottom', end: 'bottom top',
            onUpdate: function (s) {
                var target = 1 + Math.min(5, Math.abs(s.getVelocity()) / 400);
                rate = target > rate ? target : rate;
            }
        });
        gsap.ticker.add(function () {
            rate += (1 - rate) * 0.05;
            tracks.forEach(function (t) { t.getAnimations().forEach(function (a) { a.playbackRate = rate; }); });
        });
    }


    /* Services: the section pins and twelve coloured panels slide past
       sideways as you scroll down. Phones keep a native swipe row. */
    function initServicesX(root) {
        var sec = pick(root, '.svc-x')[0];
        if (!sec) return;
        sec.setAttribute('data-motion-done', '');
        var pin = sec.querySelector('.svc-x-pin');
        var track = sec.querySelector('[data-svc-track]');
        var count = sec.querySelector('[data-svc-count]');
        var bar = sec.querySelector('[data-svc-bar]');
        var panels = track.querySelectorAll('.svp');
        var mm = gsap.matchMedia();
        mm.add('(min-width: 900px)', function () {
            sec.classList.remove('is-static');
            var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
            var tw = gsap.to(track, {
                x: function () { return -dist(); }, ease: 'none',
                scrollTrigger: {
                    trigger: sec, start: 'top top', end: function () { return '+=' + dist(); },
                    pin: pin, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
                    onUpdate: function (st) {
                        var n = Math.min(panels.length, 1 + Math.round(st.progress * (panels.length - 1)));
                        if (count) count.textContent = (n < 10 ? '0' : '') + n;
                        if (bar) bar.style.transform = 'scaleX(' + Math.max(1 / panels.length, st.progress) + ')';
                    }
                }
            });
            /* each panel tilts in as it enters from the right */
            panels.forEach(function (p) {
                gsap.fromTo(p, { rotate: 4, y: 40 }, {
                    rotate: 0, y: 0, ease: 'none',
                    scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left right', end: 'left 55%', scrub: true }
                });
            });
            return function () { gsap.set(track, { clearProps: 'transform' }); };
        });
        mm.add('(max-width: 899px)', function () {
            sec.classList.add('is-static');
            track.addEventListener('scroll', function () {
                var p = track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth);
                var n = Math.min(panels.length, 1 + Math.round(p * (panels.length - 1)));
                if (count) count.textContent = (n < 10 ? '0' : '') + n;
                if (bar) bar.style.transform = 'scaleX(' + Math.max(1 / panels.length, p) + ')';
            }, { passive: true });
        });
    }

    /* Case studies stack like cards: each one shrinks back and dims as
       the next slides over it. */
    function initStackCards(root) {
        var cards = pick(root, '.stack-cards .sc');
        cards.forEach(function (card, i) {
            card.setAttribute('data-motion-done', '');
            var next = cards[i + 1];
            if (!next) return;
            gsap.to(card, {
                /* only once the next card is actually sliding over this one,
                   and only a little: the card stays readable until covered */
                scale: 0.95, filter: 'brightness(0.85)', ease: 'power1.in',
                scrollTrigger: { trigger: next, start: 'top 45%', end: 'top 15%', scrub: true }
            });
        });
        cards.forEach(function (card) {
            var media = card.querySelector('.sc-media');
            if (media && !alreadyPassed(card)) gsap.from(media, { clipPath: 'inset(20% 20% 20% 20% round 22px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 80%', once: true } });
        });
    }

    /* Big type that moves sideways with the scroll, rows in opposite directions. */
    function initKinetic(root) {
        pick(root, '.kinetic').forEach(function (k) {
            k.setAttribute('data-motion-done', '');
            var a = k.querySelector('.kr-a .kin-inner'), b = k.querySelector('.kr-b .kin-inner');
            var st = { trigger: k, start: 'top bottom', end: 'bottom top', scrub: 0.5 };
            if (a) gsap.fromTo(a, { xPercent: 0 }, { xPercent: -28, ease: 'none', scrollTrigger: st });
            if (b) gsap.fromTo(b, { xPercent: -30 }, { xPercent: -4, ease: 'none', scrollTrigger: Object.assign({}, st) });
            gsap.from(k.querySelectorAll('.kw.is-pill'), { scale: 0.6, rotate: -8, duration: 0.9, ease: 'back.out(2)', stagger: 0.05, scrollTrigger: { trigger: k, start: 'top 85%', once: true } });
        });
    }

    /* Custom cursor: a dot plus a ring that grows on links and shows a
       label (Open / View) on cards that carry data-cursor. */
    function initCursor() {
        if (!fine || document.querySelector('.cur-dot')) return;
        var dot = document.createElement('div'), ring = document.createElement('div'), label = document.createElement('span');
        dot.className = 'cur-dot'; ring.className = 'cur-ring'; ring.appendChild(label);
        document.body.appendChild(dot); document.body.appendChild(ring);
        var dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
        var rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
        gsap.set([dot, ring], { x: -100, y: -100 });
        addEventListener('pointermove', function (e) { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
        document.addEventListener('pointerover', function (e) {
            var t = e.target.closest && e.target.closest('a, button, label, summary, [data-cursor]');
            var lab = t && t.closest('[data-cursor]');
            html.classList.toggle('cur-label', !!lab);
            html.classList.toggle('cur-hover', !!t && !lab);
            label.textContent = lab ? lab.getAttribute('data-cursor') : '';
            html.classList.toggle('cur-dark', !!(e.target.closest && e.target.closest('.is-dark, .svc-x-pin, .footer, .est-out')));
        });
        document.addEventListener('pointerleave', function () { gsap.set([dot, ring], { x: -100, y: -100 }); });
    }

    function build(root) {
        initIntro(root);
        /* pinned + scrubbed sections first, so triggers below them measure the pin spacing */
        initKinetic(root);
        initServicesX(root);
        initStackCards(root);
        initHeadings(root);
        initReveals(root);
        initImages(root);
        initParallax(root);
        initDotField(root);
        initStage(root);
        initScramble(root);
        initRotator(root);
        initCounters(root);
        initTilt(root);
        initMagnetic(root);
        initProcess(root);
        initStack(root);
        initCursor();
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
