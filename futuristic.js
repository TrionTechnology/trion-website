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
            const count = Math.floor(reducedMotion ? 40 : 180 * density);
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

            // Soft trail effect — instead of clearing fully, fade to deep void
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(5, 3, 20, 0.18)';
            ctx.fillRect(0, 0, W, H);

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

            // ── Particles — curl-noise flow + soft cursor influence
            const scale = 0.0018;
            for (const p of particles) {
                // curl flow field
                const f = curl((p.x + p.seed) * scale, (p.y + p.seed) * scale, t * 0.6);
                const speed = (0.35 + p.z * 0.6) * dt;
                p.vx = lerp(p.vx, f.x * speed, 0.10);
                p.vy = lerp(p.vy, f.y * speed, 0.10);

                // gentle cursor pull (not repulsion — feels nicer)
                const dx = mouseSm.x - p.x;
                const dy = mouseSm.y - p.y;
                const d2 = dx * dx + dy * dy;
                const R = 260;
                if (d2 < R * R && mouseSm.x > -9000) {
                    const d = Math.sqrt(d2) || 0.001;
                    const w = (1 - d / R) * 0.05 * (0.5 + p.z);
                    p.vx += (dx / d) * w;
                    p.vy += (dy / d) * w;
                }

                p.px = p.x;
                p.py = p.y;
                p.x += p.vx;
                p.y += p.vy - scrollY * 0.0003 * p.z;
                p.twinkle += 0.03 * dt;

                // wrap with continuity (skip line if wrapping)
                let wrapped = false;
                if (p.x < -10) { p.x = W + 10; wrapped = true; }
                if (p.x > W + 10) { p.x = -10; wrapped = true; }
                if (p.y < -10) { p.y = H + 10; wrapped = true; }
                if (p.y > H + 10) { p.y = -10; wrapped = true; }

                const tw = (Math.sin(p.twinkle) * 0.5 + 0.5) * 0.6 + 0.4;
                const a = p.a * tw;
                const c = p.color;

                // Trail streak — short line from prev → current
                if (!wrapped) {
                    ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${a * 0.55})`;
                    ctx.lineWidth = p.r * 0.8;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(p.px, p.py);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }

                // soft halo
                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a * 0.18})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
                ctx.fill();

                // bright core
                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Cursor aura particles (mouse-driven sparkle)
            if (mouseSm.x > -9000) {
                const mv = Math.min(Math.hypot(mouse.vx, mouse.vy), 30);
                if (mv > 0.3) {
                    const burst = Math.min(Math.floor(mv * 0.6), 4);
                    for (let i = 0; i < burst; i++) {
                        const ang = Math.random() * Math.PI * 2;
                        const d = Math.random() * 30 + 6;
                        const c = palette[Math.floor(Math.random() * 4)];
                        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.5 + Math.random() * 0.3})`;
                        ctx.beginPath();
                        ctx.arc(mouseSm.x + Math.cos(ang) * d, mouseSm.y + Math.sin(ang) * d, Math.random() * 1.4 + 0.4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

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

    /* ─────────── 2. SOFT HOLOGRAPHIC CURSOR ─────────── */
    function initHoloCursor() {
        if (window.matchMedia('(hover: none)').matches) return;
        const ring = document.createElement('div');
        ring.className = 'holo-cursor';
        const dot = document.createElement('div');
        dot.className = 'holo-cursor-dot';
        document.body.appendChild(ring);
        document.body.appendChild(dot);

        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;
        let dx = mx, dy = my;

        window.addEventListener('mousemove', (e) => {
            mx = e.clientX; my = e.clientY;
        }, { passive: true });

        function tickCursor() {
            // Two-stage follow — dot snappy, ring lazy
            dx = lerp(dx, mx, 0.42);
            dy = lerp(dy, my, 0.42);
            rx = lerp(rx, mx, 0.13);
            ry = lerp(ry, my, 0.13);
            dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
            ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(tickCursor);
        }
        tickCursor();

        const hoverable = 'a, button, .btn, .filter-btn, .nav-link, .feature-card, .service-card, .portfolio-item, .partnership-card, .achievement-card, .tech-category, .testimonial-card, .faq-item, .social-link, .whatsapp-button, input, select, textarea, .stat, .contact-method, .example-tag, .tech-tag, .tag';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverable)) ring.classList.add('active');
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverable)) ring.classList.remove('active');
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
                tx = lerp(tx, tgX, 0.10);
                ty = lerp(ty, tgY, 0.10);
                card.style.transform = `perspective(1400px) rotateY(${tx * 4}deg) rotateX(${-ty * 4}deg) translate3d(0, -4px, 0)`;
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
                tgX = (e.clientX - rect.left - rect.width / 2) * 0.18;
                tgY = (e.clientY - rect.top - rect.height / 2) * 0.18;
                if (!active) { active = true; loop(); }
            });
            btn.addEventListener('mouseleave', () => {
                tgX = 0; tgY = 0;
                // keep looping briefly to spring back
                setTimeout(() => { active = false; if (raf) cancelAnimationFrame(raf); btn.style.transform = ''; }, 500);
            });
            function loop() {
                tx = lerp(tx, tgX, 0.18);
                ty = lerp(ty, tgY, 0.18);
                btn.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
                if (active) raf = requestAnimationFrame(loop);
            }
        });
    }

    /* ─────────── INIT ─────────── */
    function start() {
        initIntroSequence();
        initHoloCanvas();
        initHoloCursor();
        initParallaxTilt();
        initMagneticButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
