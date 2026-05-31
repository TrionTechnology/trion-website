/* ════════════════════════════════════════════════════════════
   TRION HOLOGRAPHIC ENGINE — v2 (silk · curl-flow · ambient)
   Curl-noise flow field, persistent trails, soft cursor,
   intro sequence, parallax tilt, magnetic buttons.
   ════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    /* ─────────── tiny seeded noise (smooth, cheap) ─────────── */
    // 2D value noise via hashed lattice + smoothstep — enough for fluid feel
    const NSIZE = 256;
    const perm = new Uint8Array(NSIZE * 2);
    (function seed() {
        const arr = new Uint8Array(NSIZE);
        for (let i = 0; i < NSIZE; i++) arr[i] = i;
        for (let i = NSIZE - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        for (let i = 0; i < NSIZE * 2; i++) perm[i] = arr[i & (NSIZE - 1)];
    })();
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    function noise2(x, y) {
        const xi = Math.floor(x) & (NSIZE - 1);
        const yi = Math.floor(y) & (NSIZE - 1);
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const u = fade(xf), v = fade(yf);
        const aa = perm[perm[xi] + yi];
        const ab = perm[perm[xi] + ((yi + 1) & (NSIZE - 1))];
        const ba = perm[perm[(xi + 1) & (NSIZE - 1)] + yi];
        const bb = perm[perm[(xi + 1) & (NSIZE - 1)] + ((yi + 1) & (NSIZE - 1))];
        const x1 = lerp(aa, ba, u);
        const x2 = lerp(ab, bb, u);
        return (lerp(x1, x2, v) / NSIZE) * 2 - 1; // [-1,1]
    }
    // Curl of scalar field → divergence-free flow (silk-like)
    function curl(x, y, t) {
        const e = 0.6;
        const n1 = noise2(x, y + e + t) - noise2(x, y - e + t);
        const n2 = noise2(x + e + t, y) - noise2(x - e + t, y);
        return { x: n1, y: -n2 };
    }

    /* ─────────── 1. PARTICLE CANVAS ─────────── */
    function initHoloCanvas() {
        const canvas = document.getElementById('trion-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let DPR = Math.min(window.devicePixelRatio || 1, 2);
        let W = 0, H = 0;
        const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };
        const mouseSm = { x: -9999, y: -9999, lx: 0, ly: 0 };

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * DPR;
            canvas.height = H * DPR;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            buildParticles();
        }

        const palette = [
            { r: 123, g: 91,  b: 255 }, // violet
            { r: 47,  g: 102, b: 255 }, // blue
            { r: 0,   g: 240, b: 255 }, // cyan
            { r: 107, g: 255, b: 227 }, // mint
            { r: 255, g: 107, b: 230 }, // pink (rare)
        ];

        let particles = [];
        let orbs = [];

        function buildParticles() {
            const density = Math.min(1, (W * H) / (1920 * 1080));
            const count = Math.floor(reducedMotion ? 30 : 110 * density);
            particles = new Array(count).fill(0).map(() => {
                const z = Math.random();
                const colorIdx = Math.random() < 0.04 ? 4 : Math.floor(Math.random() * 4);
                return {
                    x: Math.random() * W,
                    y: Math.random() * H,
                    px: 0, py: 0,
                    z,
                    r: 0.5 + z * 1.8,
                    vx: 0, vy: 0,
                    a: 0.12 + z * 0.55,
                    color: palette[colorIdx],
                    twinkle: Math.random() * Math.PI * 2,
                    seed: Math.random() * 1000,
                    life: Math.random() * 400 + 200,
                };
            });
            particles.forEach((p) => { p.px = p.x; p.py = p.y; });

            orbs = [
                { x: W * 0.18, y: H * 0.22, r: Math.max(W, H) * 0.55, color: palette[0], drift: 0 },
                { x: W * 0.82, y: H * 0.32, r: Math.max(W, H) * 0.48, color: palette[2], drift: 1.7 },
                { x: W * 0.30, y: H * 0.82, r: Math.max(W, H) * 0.46, color: palette[1], drift: 3.1 },
                { x: W * 0.78, y: H * 0.78, r: Math.max(W, H) * 0.38, color: palette[3], drift: 4.6 },
            ];
        }

        let t = 0;
        let scrollY = 0;
        let targetScrollY = 0;
        let lastFrame = performance.now();

        function frame(now) {
            const dt = Math.min((now - lastFrame) / 16.67, 2);
            lastFrame = now;
            t += 0.0025 * dt;

            scrollY = lerp(scrollY, targetScrollY, 0.06);
            mouseSm.x = lerp(mouseSm.x, mouse.x, 0.12);
            mouseSm.y = lerp(mouseSm.y, mouse.y, 0.12);
            mouse.vx = mouseSm.x - mouseSm.lx;
            mouse.vy = mouseSm.y - mouseSm.ly;
            mouseSm.lx = mouseSm.x;
            mouseSm.ly = mouseSm.y;

            // Full clear — no trail ghosting
            ctx.clearRect(0, 0, W, H);

            // ── Nebula layer (soft, slow drift)
            ctx.globalCompositeOperation = 'lighter';
            for (const o of orbs) {
                const wob = Math.sin(t * 0.6 + o.drift) * 40;
                const cx = o.x + Math.cos(t * 0.3 + o.drift) * 50;
                const cy = o.y + wob - scrollY * 0.18;
                const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
                const c = o.color;
                g.addColorStop(0,    `rgba(${c.r},${c.g},${c.b},0.18)`);
                g.addColorStop(0.35, `rgba(${c.r},${c.g},${c.b},0.06)`);
                g.addColorStop(1,    `rgba(${c.r},${c.g},${c.b},0)`);
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            }

            // ── Particles — slow curl flow, no trail streaks
            const scale = 0.0018;
            // Clamp dt so frame hitches don't manifest as visible spikes
            const sdt = Math.min(dt, 1.2);
            for (const p of particles) {
                const f = curl((p.x + p.seed) * scale, (p.y + p.seed) * scale, t * 0.4);
                const speed = (0.18 + p.z * 0.3) * sdt;
                p.vx = lerp(p.vx, f.x * speed, 0.06);
                p.vy = lerp(p.vy, f.y * speed, 0.06);

                // soft cursor pull
                const dx = mouseSm.x - p.x;
                const dy = mouseSm.y - p.y;
                const d2 = dx * dx + dy * dy;
                const R = 260;
                if (d2 < R * R && mouseSm.x > -9000) {
                    const d = Math.sqrt(d2) || 0.001;
                    const w = (1 - d / R) * 0.025 * (0.5 + p.z);
                    p.vx += (dx / d) * w;
                    p.vy += (dy / d) * w;
                }

                p.x += p.vx;
                p.y += p.vy - scrollY * 0.0002 * p.z;
                p.twinkle += 0.02 * sdt;

                if (p.x < -10) p.x = W + 10;
                if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10;
                if (p.y > H + 10) p.y = -10;

                const tw = (Math.sin(p.twinkle) * 0.5 + 0.5) * 0.5 + 0.5;
                const a = p.a * tw;
                const c = p.color;

                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a * 0.14})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a * 0.85})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Cursor sparkle burst removed — was a per-frame spike on fast moves.

            ctx.globalCompositeOperation = 'source-over';
            requestAnimationFrame(frame);
        }

        function onMove(e) {
            if (e.touches && e.touches[0]) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            } else {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }
        }

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('scroll', () => { targetScrollY = window.scrollY; }, { passive: true });

        resize();
        requestAnimationFrame(frame);
    }

    /* ─────────── 2. HOLOGRAPHIC CURSOR SYSTEM ───────────
       — snappy core dot
       — lazy ring with velocity-driven stretch + rotation
       — 4 trail dots with increasing lag
       — contextual mode label per element type
       — click-ping ripple
       All transform-only. No backdrop-filter / blend-mode. */
    function initHoloCursor() {
        if (window.matchMedia('(hover: none)').matches) return;

        const ring = document.createElement('div');
        ring.className = 'holo-cursor';
        // AI-feel reticle: hexagonal outline + center core + cardinal ticks
        // + slowly rotating scan ring. Everything inherits currentColor so
        // .active can swap the whole thing to violet in one rule.
        ring.innerHTML = `
            <svg class="hc-svg" viewBox="-20 -20 40 40" aria-hidden="true">
                <polygon class="hc-hex" points="0,-15 13,-7.5 13,7.5 0,15 -13,7.5 -13,-7.5"
                         fill="none" stroke="currentColor" stroke-width="1"/>
                <circle class="hc-core-ring" cx="0" cy="0" r="4"
                         fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.55"/>
                <circle class="hc-core" cx="0" cy="0" r="1.2" fill="currentColor"/>
                <g class="hc-ticks" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                    <line x1="0"   y1="-18" x2="0"   y2="-16"/>
                    <line x1="0"   y1="16"  x2="0"   y2="18"/>
                    <line x1="-18" y1="0"   x2="-16" y2="0"/>
                    <line x1="16"  y1="0"   x2="18"  y2="0"/>
                </g>
            </svg>
            <div class="hc-scan" aria-hidden="true"></div>
        `;
        const dot   = document.createElement('div'); dot.className   = 'holo-cursor-dot';
        const label = document.createElement('div'); label.className = 'cursor-label';

        const trails = [];
        for (let i = 0; i < 3; i++) {
            const t = document.createElement('div');
            t.className = 'cursor-trail-dot';
            const size = 6 - i * 1.3;
            t.style.width  = size + 'px';
            t.style.height = size + 'px';
            t.style.opacity = (0.7 - i * 0.18).toFixed(2);
            document.body.appendChild(t);
            // Lower rates = more inertia = smoother trailing
            trails.push({ el: t, x: window.innerWidth / 2, y: window.innerHeight / 2, rate: 0.26 - i * 0.07 });
        }

        document.body.appendChild(ring);
        document.body.appendChild(dot);
        document.body.appendChild(label);

        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;
        let dx = mx, dy = my;
        let prevX = dx, prevY = dy;
        let vx = 0, vy = 0;
        let smoothAngle = 0;

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
        }, { passive: true });

        // Click ping ripple — one DOM node per click, auto-cleaned
        window.addEventListener('mousedown', (e) => {
            const ping = document.createElement('div');
            ping.className = 'cursor-ping';
            ping.style.left = e.clientX + 'px';
            ping.style.top  = e.clientY + 'px';
            document.body.appendChild(ping);
            // Force reflow before adding the animation class
            void ping.offsetWidth;
            ping.classList.add('go');
            setTimeout(() => ping.remove(), 700);
        });

        let lastWriteX = -9999, lastWriteY = -9999;
        function tickCursor() {
            // Smoother lerp — was 0.42, now 0.28 for more inertia
            dx = lerp(dx, mx, 0.28);
            dy = lerp(dy, my, 0.28);

            // Sub-pixel skip threshold — smaller (0.08 vs 0.3) so we
            // keep writing while the lerp is still settling, avoiding
            // the "two-step settle" perception users read as jitter.
            const moved = Math.abs(dx - lastWriteX) + Math.abs(dy - lastWriteY);
            if (moved < 0.08) {
                requestAnimationFrame(tickCursor);
                return;
            }
            lastWriteX = dx; lastWriteY = dy;

            // Velocity from smoothed positions
            const newVx = dx - prevX;
            const newVy = dy - prevY;
            vx = lerp(vx, newVx, 0.18);
            vy = lerp(vy, newVy, 0.18);
            prevX = dx; prevY = dy;

            const speed = Math.hypot(vx, vy);

            // Lazy ring — was 0.13, now 0.09 for noticeably softer follow
            rx = lerp(rx, mx, 0.09);
            ry = lerp(ry, my, 0.09);
            if (speed > 1.5) {
                // Smaller stretch + slower angle settle for a less twitchy comet
                const stretch = clamp(1 + speed * 0.035, 1, 1.6);
                const inv = 1 / Math.sqrt(stretch);
                const angle = Math.atan2(vy, vx) * 180 / Math.PI;
                smoothAngle = lerp(smoothAngle, angle, 0.25);
                ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) rotate(${smoothAngle}deg) scaleX(${stretch}) scaleY(${inv})`;
            } else {
                ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
            }

            dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;

            // Trail dots
            for (let i = 0; i < trails.length; i++) {
                const t = trails[i];
                t.x = lerp(t.x, mx, t.rate);
                t.y = lerp(t.y, my, t.rate);
                t.el.style.transform = `translate3d(${t.x}px, ${t.y}px, 0) translate(-50%, -50%)`;
            }

            // Only update label position if it's visible
            if (label.classList.contains('show')) {
                label.style.transform = `translate3d(${dx + 22}px, ${dy + 18}px, 0)`;
            }

            requestAnimationFrame(tickCursor);
        }
        tickCursor();

        // ── Contextual mode labels ──
        // First match wins, so order matters (more specific selectors first)
        const modes = [
            { sel: 'a[href*="wa.me"], a[href*="api.whatsapp"]',    text: 'WHATSAPP' },
            { sel: 'a[href^="mailto:"]',                             text: 'EMAIL' },
            { sel: 'a[href^="tel:"]',                                text: 'CALL' },
            { sel: 'a[target="_blank"]',                             text: 'OPEN ↗' },
            { sel: '.faq-item summary',                              text: 'EXPAND' },
            { sel: 'input, textarea, select',                        text: 'TYPE' },
            { sel: '.filter-btn',                                    text: 'FILTER' },
            { sel: '.btn-primary',                                   text: 'CLICK' },
            { sel: '.btn, button, [role=button]',                    text: 'CLICK' },
            { sel: '.nav-link',                                      text: 'NAVIGATE' },
            { sel: '.feature-card, .service-card, .partnership-card, .achievement-card, .tech-category, .testimonial-card', text: 'EXPLORE' },
            { sel: '.portfolio-item',                                text: 'VIEW' },
            { sel: '.contact-method',                                text: 'OPEN ↗' },
            { sel: '.social-link',                                   text: 'OPEN ↗' },
            { sel: '.whatsapp-button',                               text: 'WHATSAPP' },
            { sel: 'a',                                              text: 'GO' },
        ];
        const allHoverableSelector = modes.map((m) => m.sel).join(',');

        function modeFor(target) {
            for (const m of modes) {
                if (target.closest && target.closest(m.sel)) return m;
            }
            return null;
        }

        document.addEventListener('mouseover', (e) => {
            const m = modeFor(e.target);
            if (m) {
                ring.classList.add('active');
                label.textContent = m.text;
                label.classList.add('show');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (!e.target.closest) return;
            if (e.target.closest(allHoverableSelector)) {
                // only hide if we're truly leaving (relatedTarget not also hoverable)
                const rt = e.relatedTarget;
                if (!rt || !rt.closest || !rt.closest(allHoverableSelector)) {
                    ring.classList.remove('active');
                    label.classList.remove('show');
                }
            }
        });
    }

    /* ─────────── 3. INTRO SEQUENCE ─────────── */
    function initIntroSequence() {
        if (reducedMotion) return;
        if (sessionStorage.getItem('trion-intro-shown')) return;

        const intro = document.createElement('div');
        intro.className = 'holo-intro';
        intro.innerHTML = `
            <div class="holo-intro-ring"></div>
            <div class="holo-intro-text">Initializing • Trion Holographic Interface</div>
        `;
        document.body.appendChild(intro);
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            intro.classList.add('done');
            document.body.style.overflow = '';
            sessionStorage.setItem('trion-intro-shown', '1');
            setTimeout(() => intro.remove(), 1200);
        }, 1600);
    }

    /* ─────────── 4. PARALLAX TILT — gentler, smoothed ─────────── */
    function initParallaxTilt() {
        if (window.matchMedia('(hover: none)').matches || reducedMotion) return;
        const cards = document.querySelectorAll('.feature-card, .service-card, .partnership-card, .achievement-card, .tech-category, .testimonial-card, .hero-image, .about-image, .contact-form-section');
        cards.forEach((card) => {
            let tx = 0, ty = 0, tgX = 0, tgY = 0, raf = null, active = false;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                tgX = (e.clientX - rect.left) / rect.width - 0.5;
                tgY = (e.clientY - rect.top) / rect.height - 0.5;
                if (!active) {
                    active = true;
                    loop();
                }
            });
            card.addEventListener('mouseleave', () => {
                tgX = 0; tgY = 0;
                setTimeout(() => { active = false; if (raf) cancelAnimationFrame(raf); card.style.transform = ''; }, 600);
            });
            function loop() {
                tx = lerp(tx, tgX, 0.07);
                ty = lerp(ty, tgY, 0.07);
                card.style.transform = `perspective(1600px) rotateY(${tx * 2.5}deg) rotateX(${-ty * 2.5}deg) translate3d(0, -2px, 0)`;
                if (active) raf = requestAnimationFrame(loop);
            }
        });
    }

    /* ─────────── 5. MAGNETIC BUTTONS — gentle return ─────────── */
    function initMagneticButtons() {
        if (window.matchMedia('(hover: none)').matches || reducedMotion) return;
        const buttons = document.querySelectorAll('.btn, .social-link, .whatsapp-button');
        buttons.forEach((btn) => {
            let tx = 0, ty = 0, tgX = 0, tgY = 0, raf = null, active = false;
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                tgX = (e.clientX - rect.left - rect.width / 2) * 0.10;
                tgY = (e.clientY - rect.top - rect.height / 2) * 0.10;
                if (!active) { active = true; loop(); }
            });
            btn.addEventListener('mouseleave', () => {
                tgX = 0; tgY = 0;
                // keep looping briefly to spring back
                setTimeout(() => { active = false; if (raf) cancelAnimationFrame(raf); btn.style.transform = ''; }, 500);
            });
            function loop() {
                tx = lerp(tx, tgX, 0.12);
                ty = lerp(ty, tgY, 0.12);
                btn.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
                if (active) raf = requestAnimationFrame(loop);
            }
        });
    }

    /* ─────────── 6. 3D TORUS KNOT (hero centerpiece) ───────────
       A trefoil torus knot (p=2, q=3) rendered in canvas. Rotates on its
       own + tilts with mouse + spins with scroll velocity. Two-pass glow
       (thick low-alpha for halo + thin high-alpha for core). Animated dot
       travels along the curve to show "data flow". No 3D library needed. */
    function init3DTorusKnot() {
        const wrap = document.querySelector('.hero-3d');
        if (!wrap) return;
        const canvas = wrap.querySelector('canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let W = 0, H = 0, DPR = 1;
        function resize() {
            DPR = Math.min(window.devicePixelRatio || 1, 2);
            const rect = wrap.getBoundingClientRect();
            W = rect.width;
            H = rect.height;
            if (W < 10 || H < 10) return;
            canvas.width = W * DPR;
            canvas.height = H * DPR;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        }
        resize();
        window.addEventListener('resize', resize);
        new ResizeObserver(resize).observe(wrap);

        // Trefoil torus knot points: (cos(2t)(2+cos(3t)), sin(2t)(2+cos(3t)), sin(3t))
        // p=2 q=3 -> trefoil. We slightly squeeze Y so it sits well in 4:5.
        const N = 280;
        const pts = new Array(N);
        for (let i = 0; i < N; i++) {
            const t = (i / N) * Math.PI * 2;
            const a = 2.2 + Math.cos(3 * t);
            pts[i] = {
                x: a * Math.cos(2 * t),
                y: a * Math.sin(2 * t) * 0.75,
                z: Math.sin(3 * t)
            };
        }

        // Mouse + scroll state, smoothed
        let tgMx = 0, tgMy = 0;
        let mx = 0, my = 0;
        let scroll = 0, tgScroll = window.scrollY;
        let scrollVel = 0, lastScroll = tgScroll;

        wrap.addEventListener('mousemove', (e) => {
            const r = wrap.getBoundingClientRect();
            tgMx = (e.clientX - r.left) / r.width - 0.5;
            tgMy = (e.clientY - r.top) / r.height - 0.5;
        });
        wrap.addEventListener('mouseleave', () => { tgMx = 0; tgMy = 0; });
        window.addEventListener('scroll', () => { tgScroll = window.scrollY; }, { passive: true });

        // Only run when the about tab is the active one OR the wrap is in
        // viewport, to save CPU when the user is on other tabs.
        let active = true;
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) active = e.isIntersecting;
        }, { threshold: 0.05 });
        io.observe(wrap);

        const projected = new Array(N);

        function frame() {
            if (!active) { requestAnimationFrame(frame); return; }

            mx = lerp(mx, tgMx, 0.06);
            my = lerp(my, tgMy, 0.06);
            scroll = lerp(scroll, tgScroll, 0.10);
            scrollVel = lerp(scrollVel, scroll - lastScroll, 0.15);
            lastScroll = scroll;

            const now = performance.now() * 0.001;
            // Continuous auto-rotation + mouse tilt + scroll-driven extra spin
            const angX = my * 0.9 + now * 0.18 + scroll * 0.0008;
            const angY = mx * 1.4 + now * 0.25 + scroll * 0.0014;
            const cosX = Math.cos(angX), sinX = Math.sin(angX);
            const cosY = Math.cos(angY), sinY = Math.sin(angY);

            const scale = Math.min(W, H) * 0.20;
            const cx = W / 2;
            const cy = H / 2;

            // Project all points to 2D
            for (let i = 0; i < N; i++) {
                const p = pts[i];
                // Rotate around Y axis
                let x = p.x * cosY + p.z * sinY;
                let z = -p.x * sinY + p.z * cosY;
                // Rotate around X axis
                let y = p.y * cosX - z * sinX;
                z = p.y * sinX + z * cosX;
                const persp = 5 / (5 - z);
                projected[i] = {
                    sx: cx + x * scale * persp,
                    sy: cy + y * scale * persp,
                    z: z,
                    persp: persp
                };
            }

            ctx.clearRect(0, 0, W, H);
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // PASS 1: wide soft halo
            ctx.lineWidth = 4;
            for (let i = 0; i < N; i++) {
                const a = projected[i];
                const b = projected[(i + 1) % N];
                if (!a || !b) continue;
                const depth = (a.z + 1.2) / 2.4; // 0..1
                const t = i / N;
                // Holographic gradient along curve: violet -> blue -> cyan -> violet
                const phase = (t * 2 + now * 0.05) % 1;
                const col = sampleHolo(phase);
                ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.08 + depth * 0.10})`;
                ctx.beginPath();
                ctx.moveTo(a.sx, a.sy);
                ctx.lineTo(b.sx, b.sy);
                ctx.stroke();
            }

            // PASS 2: bright thin core
            ctx.lineWidth = 1.2;
            for (let i = 0; i < N; i++) {
                const a = projected[i];
                const b = projected[(i + 1) % N];
                if (!a || !b) continue;
                const depth = (a.z + 1.2) / 2.4;
                const t = i / N;
                const phase = (t * 2 + now * 0.05) % 1;
                const col = sampleHolo(phase);
                ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.45 + depth * 0.55})`;
                ctx.beginPath();
                ctx.moveTo(a.sx, a.sy);
                ctx.lineTo(b.sx, b.sy);
                ctx.stroke();
            }

            // PASS 3: data-flow particle traveling along the curve
            const travelers = 3;
            for (let k = 0; k < travelers; k++) {
                const phase = ((now * 0.18 + k / travelers) % 1);
                const idx = Math.floor(phase * N);
                const p = projected[idx];
                if (!p) continue;
                const col = sampleHolo((idx / N * 2) % 1);
                const r = 3 * p.persp;
                // glow
                ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},0.25)`;
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, r * 3, 0, Math.PI * 2);
                ctx.fill();
                // core
                ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},1)`;
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalCompositeOperation = 'source-over';
            requestAnimationFrame(frame);
        }

        function sampleHolo(t) {
            // 3-stop gradient: violet (123,91,255) -> blue (47,102,255) -> cyan (0,240,255) -> back
            const stops = [
                [123, 91,  255],
                [47,  102, 255],
                [0,   240, 255],
                [123, 91,  255]
            ];
            const seg = t * (stops.length - 1);
            const i = Math.floor(seg);
            const f = seg - i;
            const a = stops[i];
            const b = stops[i + 1] || stops[0];
            return [
                Math.round(a[0] + (b[0] - a[0]) * f),
                Math.round(a[1] + (b[1] - a[1]) * f),
                Math.round(a[2] + (b[2] - a[2]) * f),
            ];
        }

        requestAnimationFrame(frame);
    }

    /* ─────────── INIT ─────────── */
    function start() {
        initIntroSequence();
        initHoloCanvas();
        initHoloCursor();
        initParallaxTilt();
        initMagneticButtons();
        init3DTorusKnot();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
