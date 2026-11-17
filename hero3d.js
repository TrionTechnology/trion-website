/* ════════════════════════════════════════════════════════════════════
   TRION — 3D HERO
   ────────────────────────────────────────────────────────────────────
   The Trion mark as a real object: the inverted triangle is cut into
   facets (mint crown, gold wings, graphite bolt), each extruded with a
   bevel and lit by a studio environment. Around it, twelve small
   objects orbit, one per kind of work we do.

     • Load: the facets fly in from scattered positions and lock
       together.
     • Pointer: the mark turns to face the cursor; orbiters lean.
     • Scroll: the mark breaks apart into its facets and spins, then
       re-forms when you scroll back up.

   Loaded as a module after first paint. Pauses when off-screen. With
   reduced motion it renders one still frame. Without WebGL it leaves
   the static logo fallback in place.
   ════════════════════════════════════════════════════════════════════ */
import * as THREE from './vendor/three/three.module.min.js';
import { RoomEnvironment } from './vendor/three/RoomEnvironment.js';

const host = document.querySelector('[data-hero3d]');
if (host) init(host);

function init(host) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = 'h3d-canvas';
    host.appendChild(renderer.domElement);
    host.classList.add('is-live');

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xfff1d6, 1.2);
    rim.position.set(4, -2, -3);
    scene.add(rim);

    /* ── The mark ───────────────────────────────────────────── */
    const A = [-1.0, 0.62], B = [1.0, 0.62], C = [0.0, -1.08];
    const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    const M = [0, 0.62];
    const L1 = lerp(A, C, 0.22), L2 = lerp(A, C, 0.58);
    const R1 = lerp(B, C, 0.22), R2 = lerp(B, C, 0.58);
    const P = [-0.16, 0.24], Q = [0.16, 0.24], K = [0.0, -0.36];

    const MINT = new THREE.MeshPhysicalMaterial({ color: 0x71EECE, metalness: 0.15, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08, sheen: 0.4, sheenColor: 0xd9fff4 });
    const MINT2 = MINT.clone(); MINT2.color = new THREE.Color(0x4FE0BA);
    const GOLD = new THREE.MeshPhysicalMaterial({ color: 0xF4C25B, metalness: 0.9, roughness: 0.22, clearcoat: 0.6 });
    const GOLD2 = GOLD.clone(); GOLD2.color = new THREE.Color(0xE7A93A);
    const INK = new THREE.MeshPhysicalMaterial({ color: 0x15201C, metalness: 0.6, roughness: 0.28, clearcoat: 1 });

    const facets = [
        { pts: [A, M, P, L1], mat: MINT, z: 0.0 },
        { pts: [M, B, R1, Q], mat: MINT2, z: 0.0 },
        { pts: [M, Q, P], mat: MINT, z: 0.02 },
        { pts: [L1, P, K, L2], mat: GOLD, z: 0.0 },
        { pts: [R1, R2, K, Q], mat: GOLD2, z: 0.0 },
        { pts: [L2, K, C], mat: GOLD2, z: 0.0 },
        { pts: [R2, C, K], mat: GOLD, z: 0.0 },
        /* the bolt */
        { pts: [[-0.06, 0.40], [0.14, 0.36], [0.02, 0.06], [0.11, 0.06], [-0.07, -0.52], [-0.02, -0.10], [-0.11, -0.10]], mat: INK, z: 0.16, depth: 0.42, keep: true },
    ];

    const mark = new THREE.Group();
    scene.add(mark);
    const parts = [];
    facets.forEach((f, i) => {
        const cx = f.pts.reduce((s, p) => s + p[0], 0) / f.pts.length;
        const cy = f.pts.reduce((s, p) => s + p[1], 0) / f.pts.length;
        const shrink = f.keep ? 1 : 0.94; // gaps read as the logo's facet lines
        const shape = new THREE.Shape();
        f.pts.forEach((p, j) => {
            const x = (p[0] - cx) * shrink, y = (p[1] - cy) * shrink;
            j ? shape.lineTo(x, y) : shape.moveTo(x, y);
        });
        const depth = f.depth || 0.3;
        const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.035, bevelSegments: 4, curveSegments: 1 });
        geo.translate(0, 0, -depth / 2);
        const mesh = new THREE.Mesh(geo, f.mat);
        const home = new THREE.Vector3(cx, cy, f.z);
        mesh.position.copy(home);
        /* each facet flies out along its own direction, slightly forward */
        const dir = new THREE.Vector3(cx * 1.6 + (Math.random() - 0.5) * 0.6, cy * 1.6 + (Math.random() - 0.5) * 0.6, 0.6 + Math.random() * 1.4);
        if (f.keep) dir.set(0, 0, 1.2);
        const spin = new THREE.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
        mark.add(mesh);
        parts.push({ mesh, home, dir, spin, i });
    });
    mark.scale.setScalar(1.55);

    /* ── Orbiters: one per kind of work ─────────────────────── */
    const PALETTE = [0x71EECE, 0xFFC24B, 0xC6F45B, 0xFF7A59, 0x2EC4B6, 0xFF9F1C, 0xFF8FAB, 0xFFE45C, 0xF7B2A0, 0x12B886, 0xFFB38A, 0xE9D985];
    const shapes = [
        () => new THREE.BoxGeometry(0.34, 0.34, 0.34, 2, 2, 2),
        () => new THREE.SphereGeometry(0.2, 32, 16),
        () => new THREE.TorusGeometry(0.17, 0.07, 16, 40),
        () => new THREE.CapsuleGeometry(0.1, 0.26, 6, 16),
        () => new THREE.OctahedronGeometry(0.24),
        () => new THREE.CylinderGeometry(0.17, 0.17, 0.12, 32),
    ];
    const orbiters = [];
    const ring = new THREE.Group();
    scene.add(ring);
    PALETTE.forEach((c, i) => {
        const mat = new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.25, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15 });
        const m = new THREE.Mesh(shapes[i % shapes.length](), mat);
        const o = {
            m,
            r: 2.35 + (i % 3) * 0.42,
            a: (i / PALETTE.length) * Math.PI * 2,
            speed: 0.12 + (i % 4) * 0.025,
            tilt: 0.35 + (i % 5) * 0.08,
            bob: Math.random() * Math.PI * 2,
            rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.8),
        };
        ring.add(m);
        orbiters.push(o);
    });

    /* ── Sizing ─────────────────────────────────────────────── */
    function size() {
        const w = host.clientWidth, h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        /* keep the mark a constant share of the shorter side */
        camera.position.z = w < h ? 11.5 : 9;
        camera.updateProjectionMatrix();
    }
    size();
    new ResizeObserver(size).observe(host);

    /* ── Input ──────────────────────────────────────────────── */
    let px = 0, py = 0, tpx = 0, tpy = 0;
    if (fine) {
        addEventListener('pointermove', (e) => {
            tpx = (e.clientX / innerWidth) * 2 - 1;
            tpy = (e.clientY / innerHeight) * 2 - 1;
        }, { passive: true });
    }
    let scrollP = 0;
    const section = host.closest('.hero-section') || host;
    function readScroll() {
        const r = section.getBoundingClientRect();
        scrollP = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * 0.85)));
    }
    addEventListener('scroll', readScroll, { passive: true });
    readScroll();

    /* ── Loop ───────────────────────────────────────────────── */
    const clock = new THREE.Clock();
    let intro = reduced ? 1 : 0, explode = 0, visible = true, raf = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 4);

    function frame() {
        raf = 0;
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;
        if (intro < 1) intro = Math.min(1, intro + dt / 1.8);
        px += (tpx - px) * 0.06; py += (tpy - py) * 0.06;
        explode += (scrollP - explode) * 0.1;

        /* assembled = 0, apart = 1; the intro runs the same path backwards */
        const apart = Math.max(1 - ease(intro), explode * 1.25);
        parts.forEach((p) => {
            p.mesh.position.set(
                p.home.x + p.dir.x * apart * 1.4,
                p.home.y + p.dir.y * apart * 1.4,
                p.home.z + p.dir.z * apart * 1.4,
            );
            p.mesh.rotation.set(p.spin.x * apart, p.spin.y * apart, p.spin.z * apart);
        });
        mark.rotation.y = Math.sin(t * 0.45) * 0.28 + px * 0.55 + explode * 1.6;
        mark.rotation.x = Math.sin(t * 0.33) * 0.1 + py * 0.35;
        mark.position.y = Math.sin(t * 0.8) * 0.06;

        ring.rotation.x = 0.25 + py * 0.15;
        ring.rotation.y = px * 0.25;
        orbiters.forEach((o, i) => {
            o.a += dt * o.speed;
            const r = o.r * (1 + explode * 0.9) * (0.4 + 0.6 * ease(intro));
            o.m.position.set(Math.cos(o.a) * r, Math.sin(o.a) * r * o.tilt + Math.sin(t * 1.3 + o.bob) * 0.08, Math.sin(o.a) * r * 0.55);
            o.m.rotation.x += dt * o.rot.x; o.m.rotation.y += dt * o.rot.y;
            o.m.scale.setScalar(ease(Math.min(1, Math.max(0, intro * 1.6 - i * 0.04))));
        });

        renderer.render(scene, camera);
        if (!reduced && visible) raf = requestAnimationFrame(frame);
    }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible && !raf && !reduced) { clock.getDelta(); raf = requestAnimationFrame(frame); }
        }).observe(host);
    }
    raf = requestAnimationFrame(frame);
}
