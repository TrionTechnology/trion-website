/* ════════════════════════════════════════════════════════════
   TRION HOLOGRAPHIC ENGINE
   Vanilla canvas particle field + nebula + mouse flow + scroll depth
   ════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ─────────── 1. PARTICLE / NEBULA CANVAS ─────────── */
    function initHoloCanvas() {
        const canvas = document.getElementById('trion-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let DPR = Math.min(window.devicePixelRatio || 1, 2);
        let W = 0, H = 0;
        const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: 0, lastY: 0 };

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
            const count = Math.floor(reducedMotion ? 50 : 220 * density);
            particles = new Array(count).fill(0).map(() => {
                const z = Math.random();
                const colorIdx = Math.random() < 0.04 ? 4 : Math.floor(Math.random() * 4);
                return {
                    x: Math.random() * W,
                    y: Math.random() * H,
                    z,
                    r: 0.6 + z * 2.2,
                    vx: (Math.random() - 0.5) * 0.25 * (0.3 + z),
                    vy: (Math.random() - 0.5) * 0.25 * (0.3 + z),
                    a: 0.18 + z * 0.65,
                    color: palette[colorIdx],
                    twinkle: Math.random() * Math.PI * 2,
                };
            });

            // 4 large soft nebula orbs
            orbs = [
                { x: W * 0.18, y: H * 0.22, r: Math.max(W, H) * 0.45, color: palette[0], drift: 0 },
                { x: W * 0.82, y: H * 0.32, r: Math.max(W, H) * 0.40, color: palette[2], drift: 1.7 },
                { x: W * 0.30, y: H * 0.85, r: Math.max(W, H) * 0.38, color: palette[1], drift: 3.1 },
                { x: W * 0.78, y: H * 0.78, r: Math.max(W, H) * 0.30, color: palette[3], drift: 4.6 },
            ];
        }

        let t = 0;
        let scrollY = 0;
        let targetScrollY = 0;

        function frame() {
            t += 0.005;
            scrollY += (targetScrollY - scrollY) * 0.06;

            ctx.clearRect(0, 0, W, H);

            // ── Nebula layer
            ctx.globalCompositeOperation = 'lighter';
            for (const o of orbs) {
                const wob = Math.sin(t + o.drift) * 40;
                const cx = o.x + Math.cos(t * 0.4 + o.drift) * 30;
                const cy = o.y + wob - scrollY * 0.15;
                const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
                const c = o.color;
                g.addColorStop(0,   `rgba(${c.r},${c.g},${c.b},0.22)`);
                g.addColorStop(0.4, `rgba(${c.r},${c.g},${c.b},0.07)`);
                g.addColorStop(1,   `rgba(${c.r},${c.g},${c.b},0)`);
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, W, H);
            }

            // ── Particle layer with mouse flow field
            mouse.vx = mouse.x - mouse.lastX;
            mouse.vy = mouse.y - mouse.lastY;
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;

            for (const p of particles) {
                // mouse repulsion
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist2 = dx * dx + dy * dy;
                const radius = 180;
                if (dist2 < radius * radius) {
                    const d = Math.sqrt(dist2) || 0.001;
                    const force = (1 - d / radius) * 0.6 * (0.4 + p.z);
                    p.vx += (dx / d) * force;
                    p.vy += (dy / d) * force;
                }

                // gentle return-to-flow
                p.vx *= 0.96;
                p.vy *= 0.96;
                const flowX = Math.cos(p.y * 0.003 + t) * 0.15 * p.z;
                const flowY = Math.sin(p.x * 0.003 + t) * 0.15 * p.z;
                p.vx += flowX * 0.02;
                p.vy += flowY * 0.02;

                p.x += p.vx;
                p.y += p.vy - scrollY * 0.0005 * p.z;
                p.twinkle += 0.04;

                // wrap
                if (p.x < -10) p.x = W + 10;
                if (p.x > W + 10) p.x = -10;
                if (p.y < -10) p.y = H + 10;
                if (p.y > H + 10) p.y = -10;

                const tw = (Math.sin(p.twinkle) * 0.5 + 0.5) * 0.5 + 0.5;
                const a = p.a * tw;
                const c = p.color;

                // halo
                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a * 0.18})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                ctx.fill();

                // core
                ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Constellation lines between close particles
            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 14000 && a.z + b.z > 0.6) {
                        const d = Math.sqrt(d2);
                        const alpha = (1 - d / 120) * 0.18 * Math.min(a.z, b.z);
                        const c = a.color;
                        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
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

    /* ─────────── 2. CUSTOM HOLOGRAPHIC CURSOR ─────────── */
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
            dx = e.clientX; dy = e.clientY;
            dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
        }, { passive: true });

        function tick() {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
            requestAnimationFrame(tick);
        }
        tick();

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

    /* ─────────── 4. SCROLL REVEAL ─────────── */
    function initScrollReveal() {
        const selector = '.feature-card, .service-card, .portfolio-item, .partnership-card, .testimonial-card, .achievement-card, .tech-category, .value-item, .contact-method, .faq-item, .hero-stats, .about-text, .about-image, .contact-form-section, .features-section h2, .achievements-section h2, .testimonials-section h2';
        const els = document.querySelectorAll(selector);
        els.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${Math.min(i * 60, 480)}ms`;
        });
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    io.unobserve(e.target);
                }
            }
        }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
        els.forEach((el) => io.observe(el));
    }

    /* ─────────── 5. PARALLAX TILT ON CARDS ─────────── */
    function initParallaxTilt() {
        if (window.matchMedia('(hover: none)').matches || reducedMotion) return;
        const cards = document.querySelectorAll('.feature-card, .service-card, .partnership-card, .achievement-card, .tech-category, .testimonial-card, .hero-image, .about-image, .contact-form-section');
        cards.forEach((card) => {
            card.style.transformStyle = 'preserve-3d';
            let raf = null;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
                });
            });
            card.addEventListener('mouseleave', () => {
                if (raf) cancelAnimationFrame(raf);
                card.style.transform = '';
            });
        });
    }

    /* ─────────── 6. MAGNETIC BUTTONS ─────────── */
    function initMagneticButtons() {
        if (window.matchMedia('(hover: none)').matches || reducedMotion) return;
        const buttons = document.querySelectorAll('.btn, .social-link, .whatsapp-button');
        buttons.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ─────────── INIT ─────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    function start() {
        initIntroSequence();
        initHoloCanvas();
        initHoloCursor();
        initScrollReveal();
        initParallaxTilt();
        initMagneticButtons();
    }
})();
