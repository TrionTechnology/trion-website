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
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.className = 'h3d-canvas';
    host.appendChild(renderer.domElement);
    host.classList.add('is-live');

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.85;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rimMint = new THREE.DirectionalLight(0x71EECE, 2.4);
    rimMint.position.set(-5, -1, -3);
    scene.add(rimMint);
    const rimWarm = new THREE.DirectionalLight(0xFFB38A, 1.8);
    rimWarm.position.set(5, -2, -2);
    scene.add(rimWarm);

    /* Everything sits a little right of centre so nothing drifts over the
       headline on the left edge of the canvas. */
    const world = new THREE.Group();
    world.position.x = 0.45;
    scene.add(world);

    /* ── Soft halo behind the mark ──────────────────────────── */
    const halo = (() => {
        const c = document.createElement('canvas'); c.width = c.height = 256;
        const g = c.getContext('2d');
        const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        grd.addColorStop(0, 'rgba(113,238,206,0.55)');
        grd.addColorStop(0.45, 'rgba(113,238,206,0.18)');
        grd.addColorStop(1, 'rgba(113,238,206,0)');
        g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
        const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
        sp.scale.set(6.4, 6.4, 1); sp.position.z = -1.2;
        return sp;
    })();
    world.add(halo);

    /* ── The mark ─────────────────────────────────────────────
       Same construction as the logo: an inverted triangle of mint
       crystal facets converging on the tip, two thin gold wings down the
       outer edges, and the lightning bolt through the middle. */
    const A = [-1.0, 0.62], B = [1.0, 0.62], C = [0.0, -1.08];
    const mir = (p) => [-p[0], p[1]];
    const I1 = [-0.80, 0.50], I2 = [-0.52, -0.05], E1 = [-0.606, -0.05];
    const M = [0, 0.62], K = [0, -0.02];

    const crystal = (hex) => new THREE.MeshPhysicalMaterial({
        color: hex, metalness: 0.05, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.06,
        iridescence: 0.35, iridescenceIOR: 1.4, sheen: 0.5, sheenColor: 0xd9fff4, envMapIntensity: 1.2,
    });
    const gold = (hex) => new THREE.MeshPhysicalMaterial({ color: hex, metalness: 1, roughness: 0.22, clearcoat: 0.5, envMapIntensity: 1.4 });
    const INK = new THREE.MeshPhysicalMaterial({ color: 0x0B1412, metalness: 0.4, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.04 });
    const GLOW = new THREE.MeshBasicMaterial({ color: 0x71EECE, transparent: true, opacity: 0.9, depthWrite: false });

    const facets = [
        { pts: [A, M, K, I1], mat: crystal(0x5FEBCB) },
        { pts: [M, B, mir(I1), K], mat: crystal(0x2FD6B0) },
        { pts: [I1, K, I2], mat: crystal(0x8AF3DC) },
        { pts: [K, mir(I1), mir(I2)], mat: crystal(0x3EDDB9) },
        { pts: [I2, K, C], mat: crystal(0x26C7A3) },
        { pts: [K, mir(I2), C], mat: crystal(0x6FEFD2) },
        { pts: [A, I1, I2, E1], mat: gold(0xF2C661), z: 0.06 },
        { pts: [E1, I2, C], mat: gold(0xD9A23D), z: 0.06 },
        { pts: [B, mir(E1), mir(I2), mir(I1)], mat: gold(0xE9B44E), z: 0.06 },
        { pts: [mir(E1), C, mir(I2)], mat: gold(0xC99232), z: 0.06 },
    ];
    const BOLT = [[-0.10, 0.44], [0.17, 0.40], [0.03, 0.10], [0.13, 0.10], [-0.09, -0.56], [-0.03, -0.12], [-0.13, -0.12]];

    const mark = new THREE.Group();
    world.add(mark);
    const parts = [];
    function addPart(pts, mat, z, depth, shrink, keep, extraRot) {
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
        const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
        const shape = new THREE.Shape();
        pts.forEach((p, j) => {
            const x = (p[0] - cx) * shrink, y = (p[1] - cy) * shrink;
            j ? shape.lineTo(x, y) : shape.moveTo(x, y);
        });
        const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.04, bevelSegments: 5, curveSegments: 1 });
        geo.translate(0, 0, -depth / 2);
        const mesh = new THREE.Mesh(geo, mat);
        const home = new THREE.Vector3(cx, cy, z);
        mesh.position.copy(home);
        /* tiny per-facet tilt so each face catches the light differently */
        const tilt = extraRot || new THREE.Euler((Math.random() - 0.5) * 0.14, (Math.random() - 0.5) * 0.14, 0);
        mesh.rotation.copy(tilt);
        const dir = keep ? new THREE.Vector3(0, 0, 1.3)
            : new THREE.Vector3(cx * 1.7 + (Math.random() - 0.5) * 0.6, cy * 1.7 + (Math.random() - 0.5) * 0.6, 0.6 + Math.random() * 1.4);
        const spin = new THREE.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2);
        mark.add(mesh);
        parts.push({ mesh, home, dir, spin, tilt });
        return mesh;
    }
    facets.forEach((f) => addPart(f.pts, f.mat, f.z || 0, 0.34, 0.95, false));
    /* bolt: a glowing outline under a glossy ink core */
    const zero = new THREE.Euler(0, 0, 0);
    addPart(BOLT, GLOW, 0.2, 0.36, 1.18, true, zero);
    addPart(BOLT, INK, 0.27, 0.42, 1.0, true, zero);
    mark.scale.setScalar(1.5);

    /* ── Tech rings: thin orbits with a travelling node ───────── */
    const rings = [];
    [[2.0, 0x0B7F62, 1.15, 0.2], [2.32, 0xD9A23D, 1.35, -0.5]].forEach(([r, col, rx, ry]) => {
        const g = new THREE.Group();
        g.rotation.set(rx, ry, 0);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 6, 220), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55 }));
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), new THREE.MeshBasicMaterial({ color: col }));
        g.add(ring, node);
        world.add(g);
        rings.push({ g, node, r, a: Math.random() * 6.28, speed: 0.35 + Math.random() * 0.2 });
    });

    /* ── Particles ─────────────────────────────────────────── */
    const NP = 170;
    const pPos = new Float32Array(NP * 3), pCol = new Float32Array(NP * 3);
    const pc = [new THREE.Color(0x12B886), new THREE.Color(0xE9B44E), new THREE.Color(0xFF7A59), new THREE.Color(0x2EC4B6)];
    for (let i = 0; i < NP; i++) {
        const r = 1.7 + Math.random() * 1.6, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
        pPos.set([r * Math.sin(ph) * Math.cos(th) * 0.85, r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
        const c = pc[i % pc.length]; pCol.set([c.r, c.g, c.b], i * 3);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const dust = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.045, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false }));
    world.add(dust);

    /* ── Orbiters: one per kind of work ─────────────────────── */
    const PALETTE = [0x71EECE, 0xFFC24B, 0xC6F45B, 0xFF7A59, 0x2EC4B6, 0xFF9F1C, 0xFF8FAB, 0xFFE45C, 0x12B886, 0xFFB38A];
    const shapes = [
        () => new THREE.BoxGeometry(0.26, 0.26, 0.26, 2, 2, 2),
        () => new THREE.SphereGeometry(0.15, 32, 16),
        () => new THREE.TorusGeometry(0.13, 0.05, 16, 40),
        () => new THREE.CapsuleGeometry(0.075, 0.2, 6, 16),
        () => new THREE.OctahedronGeometry(0.18),
        () => new THREE.CylinderGeometry(0.13, 0.13, 0.09, 32),
    ];
    const orbiters = [];
    const ring = new THREE.Group();
    world.add(ring);
    PALETTE.forEach((c, i) => {
        const mat = new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12 });
        const m = new THREE.Mesh(shapes[i % shapes.length](), mat);
        const o = {
            m,
            r: 2.0 + (i % 3) * 0.28,
            a: (i / PALETTE.length) * Math.PI * 2,
            speed: 0.12 + (i % 4) * 0.025,
            tilt: 0.45 + (i % 5) * 0.08,
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
            p.mesh.rotation.set(p.tilt.x + p.spin.x * apart, p.tilt.y + p.spin.y * apart, p.spin.z * apart);
        });
        mark.rotation.y = Math.sin(t * 0.45) * 0.28 + px * 0.55 + explode * 1.6;
        mark.rotation.x = Math.sin(t * 0.33) * 0.1 + py * 0.35;
        mark.position.y = Math.sin(t * 0.8) * 0.06;

        GLOW.opacity = 0.55 + 0.4 * (0.5 + 0.5 * Math.sin(t * 2.4));
        halo.material.opacity = 0.75 + 0.25 * Math.sin(t * 1.1);
        rings.forEach((rg, i) => {
            rg.a += dt * rg.speed;
            rg.node.position.set(Math.cos(rg.a) * rg.r, Math.sin(rg.a) * rg.r, 0);
            rg.g.rotation.z += dt * (i ? -0.05 : 0.04);
            rg.g.scale.setScalar((0.6 + 0.4 * ease(intro)) * (1 + explode * 0.5));
        });
        dust.rotation.y = t * 0.04 + px * 0.2;
        dust.rotation.x = py * 0.1;
        dust.material.opacity = 0.85 * ease(intro);
        ring.rotation.x = 0.25 + py * 0.15;
        ring.rotation.y = px * 0.25;
        orbiters.forEach((o, i) => {
            o.a += dt * o.speed;
            const r = o.r * (1 + explode * 0.9) * (0.4 + 0.6 * ease(intro));
            o.m.position.set(Math.cos(o.a) * r * 0.82, Math.sin(o.a) * r * o.tilt + Math.sin(t * 1.3 + o.bob) * 0.08, Math.sin(o.a) * r * 0.9);
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
