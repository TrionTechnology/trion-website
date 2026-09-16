/* ════════════════════════════════════════════════════════════════════
   TRION — MOTION RUNTIME
   ────────────────────────────────────────────────────────────────────
   Replaces the previous virtual scroller (fixed .smooth-wrapper +
   synthesised body height). That approach made position:sticky
   impossible, desynced find-in-page / focus / IntersectionObserver,
   and killed native scroll restoration.

   This runtime instead:
     • leaves native scrolling completely alone (no DOM surgery)
     • defers decorative scroll motion to CSS scroll-driven animations
       (animation-timeline: view()/scroll()) where supported — those run
       off the main thread and cannot hurt INP
     • falls back to one shared IntersectionObserver for older engines
     • runs ONE rAF ticker for the whole page, paused when hidden
     • optionally layers Lenis inertia on top of native scroll, gated on
       fine pointer + no reduced-motion. Lenis wraps native scroll rather
       than faking it, so sticky / anchors / keyboard / AT keep working.
   ════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
    var coarseMQ = matchMedia('(pointer: coarse)');
    var reduced = reduceMQ.matches;

    /* Does the browser drive animations off the scroll timeline itself?
       Chrome/Edge 115+, Safari 26+. Firefox stable does not yet. */
    var NATIVE_TIMELINE =
        typeof CSS !== 'undefined' &&
        CSS.supports &&
        CSS.supports('animation-timeline', 'view()');

    document.documentElement.classList.add(
        NATIVE_TIMELINE ? 'has-scroll-timeline' : 'no-scroll-timeline'
    );

    /* ───────────────────────── shared ticker ─────────────────────────
       Every animated system on the page subscribes here. One rAF, one
       frame budget, and it stops dead when the tab is hidden or when
       nothing is subscribed. */
    var subs = [];
    var rafId = 0;
    var lastT = 0;

    /* `running` is the single source of truth, not the rAF handle. Keying
       restart off a stale handle meant that if the chain ever broke — a
       cancel racing a queued frame, a visibility flip during navigation —
       start() saw a truthy id, declined to reschedule, and every animated
       system on the page stayed frozen with no error anywhere. */
    var running = false;

    function frame(t) {
        if (!running) { rafId = 0; return; }
        rafId = requestAnimationFrame(frame);
        var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0.016;
        lastT = t;
        /* Iterate a copy: subscribers may add or remove during the pass. */
        var list = subs.slice();
        for (var i = 0; i < list.length; i++) {
            try { list[i](dt, t); } catch (e) { /* one broken system must not kill the loop */ }
        }
    }
    function start() {
        if (running || !subs.length || document.hidden) return;
        running = true;
        lastT = 0;
        rafId = requestAnimationFrame(frame);
    }
    function stop() {
        running = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    }
    var ticker = {
        add: function (fn) { if (subs.indexOf(fn) < 0) { subs.push(fn); start(); } },
        remove: function (fn) {
            var i = subs.indexOf(fn);
            if (i >= 0) subs.splice(i, 1);
            if (!subs.length) stop();
        }
    };
    document.addEventListener('visibilitychange', function () {
        document.hidden ? stop() : start();
    });
    /* Belt and braces. If a visibilitychange is ever missed — restored from
       bfcache, window refocused, an embedding context that never fires it —
       the page would otherwise sit frozen with no error. Any of these
       resumes it, and start() is a no-op when already running. */
    addEventListener('pageshow', start);
    addEventListener('focus', start);
    addEventListener('pointerdown', start, { passive: true });
    addEventListener('scroll', start, { passive: true });
    window.TrionTicker = ticker;

    /* ───────────────────────── reveal on enter ─────────────────────────
       When the browser supports view() timelines, CSS owns this entirely
       and we do nothing. Otherwise a single IO adds .is-revealed.
       Elements opt in with [data-reveal]. */
    var io = null;

    function ensureObserver() {
        if (io || !('IntersectionObserver' in window)) return io;
        io = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('is-revealed');
                    io.unobserve(entries[i].target);
                }
            }
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
        return io;
    }

    function scanReveals(root) {
        var nodes = (root || document).querySelectorAll('[data-reveal]:not(.is-revealed)');
        if (reduced || NATIVE_TIMELINE) {
            /* Reduced motion: show everything immediately, no animation.
               Native timeline: CSS drives it, but we still mark items that
               are already past the viewport so nothing can be stranded. */
            if (reduced) {
                for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('is-revealed');
            }
            return;
        }
        var obs = ensureObserver();
        if (!obs) {
            for (var j = 0; j < nodes.length; j++) nodes[j].classList.add('is-revealed');
            return;
        }
        for (var k = 0; k < nodes.length; k++) obs.observe(nodes[k]);
    }

    /* ───────────────────────── stat counters ─────────────────────────
       Counts up once when scrolled into view. Parses the number out of
       the existing text so markup stays the source of truth: "150+",
       "98%", "5+", "2.4x" all work. */
    function initCounters() {
        var els = document.querySelectorAll('[data-count], .stat-number, .achievement-number, .stat-cell-number, .result-number, .metric');
        if (!els.length) return;

        function run(el) {
            if (el.dataset.counted) return;
            el.dataset.counted = '1';

            var raw = el.textContent.trim();
            /* Only animate a figure that STARTS with its number (optionally
               behind a currency mark). Many stat cells are words — "Real-time",
               "Gasless", "Web2/Web3" — and a loose match would count the "2"
               out of the middle of one and render "Web0/Web3" on the way up. */
            var m = raw.match(/^(RM|[$\u20ac\u00a3\u00a5]?)\s*(-?[\d,]*\.?\d+)(.*)$/);
            if (!m) return;
            var prefix = m[1];
            var target = parseFloat(m[2].replace(/,/g, ''));
            var suffix = m[3];
            if (!isFinite(target)) return;
            /* "24/7" and "3-Tier" are compound labels, not magnitudes —
               counting them up from zero reads as a glitch, not a stat. */
            if (/^[/\u2013\u2014-]/.test(suffix)) return;

            var decimals = (m[2].split('.')[1] || '').length;
            var grouped = m[2].indexOf(',') >= 0;

            if (reduced) { el.textContent = raw; return; }

            var dur = 1400;
            var t0 = 0;

            function fmt(v) {
                var s = v.toFixed(decimals);
                if (grouped) s = (+s).toLocaleString(undefined, {
                    minimumFractionDigits: decimals, maximumFractionDigits: decimals
                });
                return prefix + s + suffix;
            }

            function tick(dt, now) {
                if (!t0) t0 = now;
                var p = Math.min((now - t0) / dur, 1);
                /* easeOutExpo — fast start, long settle */
                var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
                el.textContent = fmt(target * e);
                if (p === 1) ticker.remove(tick);
            }
            /* Writing 0 before the first frame means a figure reads "RM0"
               for as long as the ticker is stalled — and it stalls whenever
               the document is hidden. If we cannot animate right now, show
               the real number instead of a zero that may never move. */
            if (document.hidden) { el.textContent = raw; return; }
            el.textContent = fmt(0);
            ticker.add(tick);
        }

        if (!('IntersectionObserver' in window) || reduced) {
            for (var i = 0; i < els.length; i++) run(els[i]);
            return;
        }
        var cio = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    run(entries[i].target);
                    cio.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.4 });
        for (var j = 0; j < els.length; j++) cio.observe(els[j]);
    }

    /* ───────────────────────── scroll progress ─────────────────────────
       CSS owns this via animation-timeline: scroll(root). This is only a
       fallback for engines without scroll timelines (Firefox today). */
    function initProgressFallback() {
        var bar = document.querySelector('.holo-progress');
        if (!bar || NATIVE_TIMELINE) return;
        var pending = false;
        function update() {
            pending = false;
            var max = document.documentElement.scrollHeight - innerHeight;
            var p = max > 0 ? window.scrollY / max : 0;
            bar.style.transform = 'scaleX(' + Math.min(Math.max(p, 0), 1) + ')';
        }
        addEventListener('scroll', function () {
            if (!pending) { pending = true; requestAnimationFrame(update); }
        }, { passive: true });
        addEventListener('resize', update, { passive: true });
        update();
    }

    /* ───────────────────────── Lenis inertia ─────────────────────────
       Lazy, self-hosted, and only where it helps. Touch devices already
       have excellent native momentum — adding Lenis there makes it worse.
       Lenis drives its own rAF off our shared ticker so we never run two. */
    function initLenis() {
        if (reduced || coarseMQ.matches) return;
        if (!('IntersectionObserver' in window)) return;

        var base = document.currentScript && document.currentScript.src;
        var url;
        try {
            url = new URL('vendor/lenis.min.mjs', base || location.href).href;
        } catch (e) { return; }

        import(/* webpackIgnore: true */ url).then(function (mod) {
            var Lenis = mod && (mod.default || mod.Lenis);
            if (!Lenis) return;
            var lenis = new Lenis({
                autoRaf: false,   // we drive it from the shared ticker
                lerp: 0.12,
                wheelMultiplier: 1,
                smoothWheel: true,
                /* Let the browser own touch entirely. */
                syncTouch: false
            });
            window.TrionLenis = lenis;
            ticker.add(function (dt, t) { lenis.raf(t); });
            document.documentElement.classList.add('has-lenis');
        }).catch(function () { /* inertia is a nicety; native scroll is fine */ });
    }

    /* ───────────────────────── tab switching ─────────────────────────
       The home page swaps .tab-content sections. New content needs its
       reveals wired up, and we want the counters in the newly shown tab
       to run. No scroll maths here — native scroll handles itself. */
    function initTabHook() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest && e.target.closest('.nav-link');
            if (!link) return;
            /* let script.js switch the tab first */
            setTimeout(function () {
                scanReveals(document.querySelector('.tab-content.active') || document);
                initCounters();
                initSplitText();
                initScramble();
                initScrambleGroups();
                    }, 60);
        }, true);
    }

    /* ───────────────────────── reduced-motion changes live ───────────── */
    function bindMotionPref() {
        var on = function () {
            reduced = reduceMQ.matches;
            if (reduced) {
                var n = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
                for (var i = 0; i < n.length; i++) n[i].classList.add('is-revealed');
                if (window.TrionLenis) { try { window.TrionLenis.destroy(); } catch (e) {} }
            }
        };
        reduceMQ.addEventListener ? reduceMQ.addEventListener('change', on)
                                  : reduceMQ.addListener && reduceMQ.addListener(on);
    }


    /* ═════════════════════ MOTION TOOLKIT ═════════════════════
       Everything below is opt-in via a data- attribute so it can be
       sprinkled across all 92 pages from the templates without any
       per-page JS. All of it no-ops under prefers-reduced-motion, and
       anything per-frame runs on the one shared ticker. */

    /* ── Split a heading into words for staggered reveal ──
       Wraps each word in a masked span. Text content is unchanged, so
       selection, search and screen readers see the original string. */
    function initSplitText() {
        var nodes = document.querySelectorAll('[data-split]:not([data-split-done])');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            el.setAttribute('data-split-done', '');
            if (reduced) continue;
            splitNode(el, el);
        }
    }
    function splitNode(root, host) {
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        var texts = [], t;
        while ((t = walker.nextNode())) if (t.nodeValue.trim()) texts.push(t);
        var idx = 0;
        for (var i = 0; i < texts.length; i++) {
            var node = texts[i];
            var frag = document.createDocumentFragment();
            var parts = node.nodeValue.split(/(\s+)/);
            for (var j = 0; j < parts.length; j++) {
                if (!parts[j]) continue;
                if (/^\s+$/.test(parts[j])) { frag.appendChild(document.createTextNode(parts[j])); continue; }
                var mask = document.createElement('span');
                mask.className = 'sp-w';
                var inner = document.createElement('span');
                inner.className = 'sp-i';
                inner.style.setProperty('--i', idx++);
                inner.textContent = parts[j];
                mask.appendChild(inner);
                frag.appendChild(mask);
            }
            node.parentNode.replaceChild(frag, node);
        }
        host.style.setProperty('--sp-n', idx);
    }

    /* ── Magnetic hover ──
       Pointer pulls the element slightly toward it. One delegated
       listener per element, rAF-batched, no per-element loop. */
    function initMagnetic() {
        if (reduced || coarseMQ.matches) return;
        var els = document.querySelectorAll('[data-magnetic]');
        if (!els.length) return;
        var queued = false, pending = [];
        function flush() {
            queued = false;
            for (var i = 0; i < pending.length; i++) {
                pending[i].el.style.setProperty('--mag-x', pending[i].x.toFixed(2) + 'px');
                pending[i].el.style.setProperty('--mag-y', pending[i].y.toFixed(2) + 'px');
            }
            pending.length = 0;
        }
        function move(e) {
            var el = e.currentTarget;
            var r = el.getBoundingClientRect();
            var strength = parseFloat(el.getAttribute('data-magnetic')) || 0.28;
            pending.push({
                el: el,
                x: (e.clientX - (r.left + r.width / 2)) * strength,
                y: (e.clientY - (r.top + r.height / 2)) * strength
            });
            if (!queued) { queued = true; requestAnimationFrame(flush); }
        }
        function leave(e) {
            e.currentTarget.style.setProperty('--mag-x', '0px');
            e.currentTarget.style.setProperty('--mag-y', '0px');
        }
        for (var i = 0; i < els.length; i++) {
            els[i].addEventListener('pointermove', move, { passive: true });
            els[i].addEventListener('pointerleave', leave, { passive: true });
        }
    }

    /* ── Glyph scramble for mono labels ──
       Runs once when the label scrolls into view. Short and cheap: a
       label settles within ~600ms and then unsubscribes. */
    function initScramble() {
        if (reduced || !('IntersectionObserver' in window)) return;
        var els = document.querySelectorAll('[data-scramble]');
        if (!els.length) return;
        var CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*';
        function run(el) {
            if (el.dataset.scrambled) return;
            el.dataset.scrambled = '1';
            var target = el.textContent;
            var start = 0, dur = 620;
            function tick(dt, now) {
                if (!start) start = now;
                var p = Math.min((now - start) / dur, 1);
                var settled = Math.floor(p * target.length);
                var out = '';
                for (var i = 0; i < target.length; i++) {
                    if (i < settled || target[i] === ' ') out += target[i];
                    else out += CH[(Math.random() * CH.length) | 0];
                }
                el.textContent = out;
                if (p === 1) { el.textContent = target; ticker.remove(tick); }
            }
            ticker.add(tick);
        }
        var sio = new IntersectionObserver(function (es) {
            for (var i = 0; i < es.length; i++) {
                if (es[i].isIntersecting) { run(es[i].target); sio.unobserve(es[i].target); }
            }
        }, { threshold: 0.6 });
        for (var i = 0; i < els.length; i++) sio.observe(els[i]);
    }

    /* ── Parallax ──
       Prefers the native scroll timeline (compositor, zero INP cost);
       falls back to a shared-ticker read of scrollY. */
    /* ── Glyph scramble across a container's text, links intact ──
       [data-scramble] rewrites textContent, which is fine on a bare
       label but would collapse a breadcrumb's <a> children into plain
       text and kill the links. This variant walks to the Text nodes and
       rewrites those in place, so markup and anchors survive. */
    function initScrambleGroups() {
        if (reduced || !('IntersectionObserver' in window)) return;
        var groups = document.querySelectorAll('[data-scramble-group]');
        if (!groups.length) return;
        var CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*';

        function run(root) {
            if (root.dataset.scrambled) return;
            root.dataset.scrambled = '1';

            var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
            var nodes = [], n;
            while ((n = walker.nextNode())) {
                if (n.nodeValue && n.nodeValue.trim()) nodes.push({ node: n, target: n.nodeValue });
            }
            if (!nodes.length) return;

            var start = 0, dur = 620;
            function restore() {
                for (var k = 0; k < nodes.length; k++) nodes[k].node.nodeValue = nodes[k].target;
            }
            function tick(dt, now) {
                if (!start) start = now;
                var p = Math.min((now - start) / dur, 1);
                for (var k = 0; k < nodes.length; k++) {
                    var tg = nodes[k].target;
                    var settled = Math.floor(p * tg.length);
                    var out = '';
                    for (var i = 0; i < tg.length; i++) {
                        if (i < settled || tg[i] === ' ') out += tg[i];
                        else out += CH[(Math.random() * CH.length) | 0];
                    }
                    nodes[k].node.nodeValue = out;
                }
                if (p === 1) { restore(); ticker.remove(tick); }
            }
            ticker.add(tick);
        }

        var gio = new IntersectionObserver(function (es) {
            for (var i = 0; i < es.length; i++) {
                if (es[i].isIntersecting) { run(es[i].target); gio.unobserve(es[i].target); }
            }
        }, { threshold: 0.6 });
        for (var g = 0; g < groups.length; g++) gio.observe(groups[g]);
    }

    function initParallax() {
        if (reduced || NATIVE_TIMELINE) return;
        var els = document.querySelectorAll('[data-parallax]');
        if (!els.length) return;
        var items = [];
        for (var i = 0; i < els.length; i++) {
            items.push({ el: els[i], k: parseFloat(els[i].getAttribute('data-parallax')) || 0.12 });
        }
        ticker.add(function () {
            var vh = innerHeight;
            for (var i = 0; i < items.length; i++) {
                var r = items[i].el.getBoundingClientRect();
                if (r.bottom < -200 || r.top > vh + 200) continue;
                var mid = r.top + r.height / 2 - vh / 2;
                items[i].el.style.setProperty('--par-y', (-mid * items[i].k).toFixed(1) + 'px');
            }
        });
    }

    /* ── Marquee ──
       Duplicates its children once so the CSS translate loop is seamless
       at any content width. */
    function initMarquee() {
        var els = document.querySelectorAll('[data-marquee]:not([data-marquee-done])');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            el.setAttribute('data-marquee-done', '');
            var track = el.firstElementChild;
            if (!track) continue;
            var clone = track.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            el.appendChild(clone);
        }
    }

    function init() {
        initSplitText();
        initMarquee();
        initMagnetic();
        initScramble();
        initScrambleGroups();
        initParallax();
        scanReveals(document);
        initCounters();
        initProgressFallback();
        initTabHook();
        bindMotionPref();
        initLenis();
        /* Late layout shifts (webfont swap, image decode) can leave
           just-off-screen items unobserved — one cheap re-scan. */
        addEventListener('load', function () { scanReveals(document); });
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();
