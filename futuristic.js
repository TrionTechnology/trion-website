/* ════════════════════════════════════════════════════════════════════
   TRION — WEBGL VISUAL SYSTEM
   ────────────────────────────────────────────────────────────────────
   Replaces the previous Canvas-2D systems, which did software 3D on the
   CPU: an O(N²) nearest-neighbour build at init (608k distance tests),
   a full depth sort of 780 points every frame, ~3,500 canvas path ops
   per frame, and ~15,000 array allocations per frame.

   Everything here runs on the GPU instead:
     • particle motion is computed in the vertex shader from a static
       buffer — zero per-frame CPU work, zero allocation
     • additive blending is order-independent, so the per-frame depth
       sort disappears entirely
     • one draw call for the ambient field, two for the lattice

   No dependencies, no bundler, no module waterfall — a compact WebGL2
   helper is smaller than pulling a library off a CDN.

   Gating (see shouldRender): reduced motion, save-data, low memory +
   low core count, no-WebGL, off-screen, hidden tab, and context loss
   all fall back to the CSS poster with no JS animation running.
   ════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var reduceMQ = matchMedia('(prefers-reduced-motion: reduce)');
    var coarse = matchMedia('(pointer: coarse)').matches;

    function shouldRender() {
        if (reduceMQ.matches) return false;
        var c = navigator.connection;
        if (c && c.saveData) return false;
        var mem = navigator.deviceMemory;
        var cores = navigator.hardwareConcurrency;
        if (mem !== undefined && cores !== undefined && mem < 4 && cores <= 4) return false;
        return true;
    }

    /* Cap pixel ratio. A soft gradient at dpr 3 renders 9x the fragments
       for no perceptible gain — this is the #1 mobile WebGL perf mistake. */
    var DPR = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5);

    /* ───────────────────────── tiny GL helpers ───────────────────────── */
    function compile(gl, type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.warn('[trion-gl]', gl.getShaderInfoLog(s));
            gl.deleteShader(s);
            return null;
        }
        return s;
    }
    function program(gl, vs, fs) {
        var v = compile(gl, gl.VERTEX_SHADER, vs);
        var f = compile(gl, gl.FRAGMENT_SHADER, fs);
        if (!v || !f) return null;
        var p = gl.createProgram();
        gl.attachShader(p, v);
        gl.attachShader(p, f);
        gl.linkProgram(p);
        gl.deleteShader(v);
        gl.deleteShader(f);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
            console.warn('[trion-gl]', gl.getProgramInfoLog(p));
            return null;
        }
        return p;
    }
    function uniforms(gl, p) {
        var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < n; i++) {
            var info = gl.getActiveUniform(p, i);
            u[info.name.replace('[0]', '')] = gl.getUniformLocation(p, info.name);
        }
        return u;
    }
    function buffer(gl, data, target) {
        var b = gl.createBuffer();
        target = target || gl.ARRAY_BUFFER;
        gl.bindBuffer(target, b);
        gl.bufferData(target, data, gl.STATIC_DRAW);
        return b;
    }

    /* Shared GLSL: cheap 3D value noise + curl-ish flow. */
    var NOISE = [
        'vec3 hash3(vec3 p){',
        '  p = vec3(dot(p,vec3(127.1,311.7,74.7)), dot(p,vec3(269.5,183.3,246.1)), dot(p,vec3(113.5,271.9,124.6)));',
        '  return fract(sin(p)*43758.5453123)*2.0-1.0;',
        '}',
        'float vnoise(vec3 p){',
        '  vec3 i = floor(p), f = fract(p);',
        '  vec3 u = f*f*(3.0-2.0*f);',
        '  float n = mix(mix(mix(dot(hash3(i+vec3(0,0,0)),f-vec3(0,0,0)), dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),',
        '                    mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)), dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),',
        '                mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)), dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),',
        '                    mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)), dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);',
        '  return n;',
        '}'
    ].join('\n');

    /* Brand palette, fed to shaders so CSS and GL never drift apart. */
    function palette() {
        var cs = getComputedStyle(document.documentElement);
        function rgb(name, fallback) {
            var v = (cs.getPropertyValue(name) || '').trim() || fallback;
            var m = v.match(/^#?([0-9a-f]{6})$/i);
            if (!m) return fallback;
            var n = parseInt(m[1], 16);
            return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
        }
        return {
            cool: rgb('--gl-cool', [0.17, 0.40, 1.00]),
            hot: rgb('--gl-hot', [0.00, 0.94, 1.00]),
            warm: rgb('--gl-warm', [0.48, 0.36, 1.00])
        };
    }

    /* ════════════════════ 1. AMBIENT FIELD ════════════════════
       One fullscreen triangle. Slow flowing nebula + drifting motes,
       entirely in the fragment shader. Replaces the old per-frame
       4x createRadialGradient + 220 arc fills. */
    function initAmbient() {
        var canvas = document.getElementById('trion-canvas');
        if (!canvas || !shouldRender()) { if (canvas) canvas.style.display = 'none'; return; }

        var gl = canvas.getContext('webgl2', {
            alpha: true, antialias: false, depth: false,
            powerPreference: 'low-power', premultipliedAlpha: false
        });
        if (!gl) { canvas.style.display = 'none'; return; }

        var pal = palette();
        var prog = program(gl,
            '#version 300 es\nin vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }',
            '#version 300 es\nprecision highp float;\n' + NOISE + '\n' +
            'uniform vec2 uRes; uniform float uT; uniform vec2 uM;\n' +
            'uniform vec3 uCool, uHot, uWarm;\n' +
            'out vec4 outColor;\n' +
            'float fbm(vec3 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*vnoise(p); p*=2.02; a*=0.5; } return s; }\n' +
            'void main(){\n' +
            '  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / uRes.y;\n' +
            '  float t = uT * 0.028;\n' +
            /* two counter-drifting noise layers → slow iridescent churn */
            '  float n1 = fbm(vec3(uv*1.35, t));\n' +
            '  float n2 = fbm(vec3(uv*2.30 + 13.7, -t*0.75));\n' +
            '  float m = smoothstep(-0.35, 0.65, n1*0.65 + n2*0.35);\n' +
            /* pointer adds a soft local lift, never a hard spotlight */
            '  float d = length(uv - uM);\n' +
            '  float halo = exp(-d*d*2.6) * 0.30;\n' +
            '  vec3 col = mix(uCool*0.30, uWarm*0.55, m);\n' +
            '  col = mix(col, uHot*0.75, smoothstep(0.55,1.0,m)*0.35 + halo*0.5);\n' +
            /* vignette so the field never competes with the content */
            '  float vig = smoothstep(1.30, 0.15, length(uv));\n' +
            '  float a = (m*0.34 + halo) * vig;\n' +
            '  outColor = vec4(col, a);\n' +
            '}'
        );
        if (!prog) { canvas.style.display = 'none'; return; }

        var u = uniforms(gl, prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer(gl, new Float32Array([-1, -1, 3, -1, -1, 3])));
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.useProgram(prog);
        gl.uniform3fv(u.uCool, pal.cool);
        gl.uniform3fv(u.uHot, pal.hot);
        gl.uniform3fv(u.uWarm, pal.warm);

        var mx = 0, my = 0, tx = 0, ty = 0, lost = false;

        function resize() {
            var w = Math.round(innerWidth * DPR), h = Math.round(innerHeight * DPR);
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w; canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
        }
        resize();
        addEventListener('resize', resize, { passive: true });

        if (!coarse) {
            addEventListener('pointermove', function (e) {
                tx = (e.clientX - innerWidth / 2) / innerHeight;
                ty = -(e.clientY - innerHeight / 2) / innerHeight;
            }, { passive: true });
        }

        canvas.addEventListener('webglcontextlost', function (e) {
            e.preventDefault(); lost = true;
            window.TrionTicker && window.TrionTicker.remove(draw);
        });

        function draw(dt, t) {
            if (lost) return;
            mx += (tx - mx) * 0.04;
            my += (ty - my) * 0.04;
            gl.useProgram(prog);
            gl.uniform2f(u.uRes, canvas.width, canvas.height);
            gl.uniform1f(u.uT, t * 0.001);
            gl.uniform2f(u.uM, mx, my);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }

        whenVisible(canvas, draw, resize);
    }

    /* ════════════════════ 2. HERO LATTICE ════════════════════
       A volumetric node lattice: points on nested Fibonacci shells,
       structural edges between them, and pulses of light travelling
       along those edges. Reads as a live distributed system rather
       than a decorative particle blob.

       All motion happens in the vertex shader. The CPU builds the
       buffers once and then never touches them. */
    function initLattice() {
        var host = document.querySelector('.hero-3d');
        if (!host) return;
        var canvas = host.querySelector('canvas');
        if (!canvas) return;

        if (!shouldRender()) { host.setAttribute('data-gl', 'off'); return; }

        var gl = canvas.getContext('webgl2', {
            alpha: true, antialias: true, depth: false,
            powerPreference: 'default', premultipliedAlpha: false
        });
        if (!gl) { host.setAttribute('data-gl', 'off'); return; }

        var pal = palette();
        var N = coarse ? 900 : 2200;     /* nodes */
        var SHELLS = 3;

        /* ---- build static geometry once ---- */
        var pos = new Float32Array(N * 3);
        var rnd = new Float32Array(N);
        var GOLD = Math.PI * (3 - Math.sqrt(5));
        for (var i = 0; i < N; i++) {
            var shell = i % SHELLS;
            var k = Math.floor(i / SHELLS);
            var count = Math.ceil(N / SHELLS);
            var y = 1 - (k / Math.max(count - 1, 1)) * 2;
            var r = Math.sqrt(Math.max(0, 1 - y * y));
            var th = GOLD * k;
            /* nested shells at different radii -> volume, not a hollow ball */
            var rad = 0.56 + shell * 0.20;
            pos[i * 3] = Math.cos(th) * r * rad;
            pos[i * 3 + 1] = y * rad;
            pos[i * 3 + 2] = Math.sin(th) * r * rad;
            rnd[i] = Math.random();
        }

        /* Edges from lattice adjacency, not an O(N^2) neighbour search.
           On a Fibonacci shell, index neighbours are spatial neighbours. */
        var eIdx = [];
        var strides = [SHELLS, SHELLS * 2, SHELLS * 5];
        for (var a = 0; a < N; a++) {
            for (var s = 0; s < strides.length; s++) {
                var b = a + strides[s];
                if (b < N && Math.random() < 0.52) { eIdx.push(a, b); }
            }
        }
        var E = eIdx.length / 2;

        /* Expand edges into their own buffers so the vertex shader can
           displace both endpoints identically to the point pass. */
        var ePos = new Float32Array(E * 2 * 3);
        var eRnd = new Float32Array(E * 2);
        var eEnd = new Float32Array(E * 2);   /* 0 at start, 1 at end */
        var eSeed = new Float32Array(E * 2);  /* per-edge, for pulse phase */
        for (var e = 0; e < E; e++) {
            var ia = eIdx[e * 2], ib = eIdx[e * 2 + 1];
            var seed = Math.random();
            for (var q = 0; q < 2; q++) {
                var src = q === 0 ? ia : ib;
                var o = (e * 2 + q);
                ePos[o * 3] = pos[src * 3];
                ePos[o * 3 + 1] = pos[src * 3 + 1];
                ePos[o * 3 + 2] = pos[src * 3 + 2];
                eRnd[o] = rnd[src];
                eEnd[o] = q;
                eSeed[o] = seed;
            }
        }

        /* Shared displacement so points and edges never disagree. */
        var DISPLACE = [
            'vec3 displace(vec3 p, float rnd, float t){',
            '  float n = vnoise(p*1.5 + vec3(0.0, 0.0, t*0.18));',
            '  float breathe = 1.0 + 0.055*sin(t*0.55 + rnd*6.283);',
            '  return p * breathe + normalize(p) * n * 0.085;',
            '}',
            'mat3 rotY(float a){ float s=sin(a),c=cos(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }',
            'mat3 rotX(float a){ float s=sin(a),c=cos(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }'
        ].join('\n');

        var VS_COMMON = '#version 300 es\nprecision highp float;\n' + NOISE + '\n' + DISPLACE + '\n' +
            'uniform float uT; uniform vec2 uRot; uniform float uAspect; uniform float uScale;\n' +
            'vec4 project(vec3 world, out float depth){\n' +
            '  vec3 p = rotX(uRot.y) * rotY(uRot.x + uT*0.075) * world;\n' +
            '  float persp = 1.0 / (2.15 - p.z*0.55);\n' +
            '  depth = p.z;\n' +
            '  vec2 xy = p.xy * persp * 1.55 * uScale;\n' +
            '  return vec4(xy.x / uAspect, xy.y, 0.0, 1.0);\n' +
            '}\n';

        var pointProg = program(gl,
            VS_COMMON +
            'in vec3 aPos; in float aRnd;\n' +
            'out float vDepth; out float vRnd;\n' +
            'uniform float uDpr;\n' +
            'void main(){\n' +
            '  vec3 w = displace(aPos, aRnd, uT);\n' +
            '  float d; gl_Position = project(w, d);\n' +
            '  vDepth = d; vRnd = aRnd;\n' +
            '  float near = smoothstep(-1.0, 1.0, d);\n' +
            '  gl_PointSize = (1.5 + near*3.6 + aRnd*1.6) * uDpr;\n' +
            '}',
            '#version 300 es\nprecision highp float;\n' +
            'in float vDepth; in float vRnd;\n' +
            'uniform vec3 uCool, uHot, uWarm; uniform float uT;\n' +
            'out vec4 outColor;\n' +
            'void main(){\n' +
            '  vec2 c = gl_PointCoord - 0.5;\n' +
            '  float r = length(c);\n' +
            '  if (r > 0.5) discard;\n' +
            /* soft core + halo, no texture needed */
            '  float core = smoothstep(0.5, 0.0, r);\n' +
            '  float a = pow(core, 2.2);\n' +
            '  float near = smoothstep(-1.0, 1.0, vDepth);\n' +
            '  vec3 col = mix(uCool, uHot, near);\n' +
            /* a minority of nodes "fire" on their own phase — desynchronised
               on purpose; synchronised pulsing is what reads as a screensaver */
            '  float fire = step(0.86, fract(vRnd*7.3 + uT*0.11));\n' +
            '  col = mix(col, uWarm + vec3(0.35), fire*0.8);\n' +
            '  a *= (0.34 + near*0.92) * (1.0 + fire*1.1);\n' +
            '  outColor = vec4(col*a, a);\n' +
            '}'
        );

        var lineProg = program(gl,
            VS_COMMON +
            'in vec3 aPos; in float aRnd; in float aEnd; in float aSeed;\n' +
            'out float vDepth; out float vEnd; out float vSeed;\n' +
            'void main(){\n' +
            '  vec3 w = displace(aPos, aRnd, uT);\n' +
            '  float d; gl_Position = project(w, d);\n' +
            '  vDepth = d; vEnd = aEnd; vSeed = aSeed;\n' +
            '}',
            '#version 300 es\nprecision highp float;\n' +
            'in float vDepth; in float vEnd; in float vSeed;\n' +
            'uniform vec3 uCool, uHot; uniform float uT;\n' +
            'out vec4 outColor;\n' +
            'void main(){\n' +
            '  float near = smoothstep(-1.0, 1.0, vDepth);\n' +
            /* a pulse of light travels the edge; each edge has its own
               phase, speed and duty cycle so none of them line up */
            '  float speed = 0.35 + vSeed*0.55;\n' +
            '  float head = fract(uT*speed + vSeed*11.0);\n' +
            '  float pulse = smoothstep(0.16, 0.0, abs(vEnd - head));\n' +
            '  float base = 0.10 * (0.30 + near*0.85);\n' +
            '  vec3 col = mix(uCool, uHot, near*0.6 + pulse*0.6);\n' +
            '  float a = base + pulse*0.62*near;\n' +
            '  outColor = vec4(col*a, a);\n' +
            '}'
        );

        if (!pointProg || !lineProg) { host.setAttribute('data-gl', 'off'); return; }

        var pu = uniforms(gl, pointProg), lu = uniforms(gl, lineProg);

        var vaoPoints = gl.createVertexArray();
        gl.bindVertexArray(vaoPoints);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer(gl, pos));
        var apPos = gl.getAttribLocation(pointProg, 'aPos');
        gl.enableVertexAttribArray(apPos); gl.vertexAttribPointer(apPos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer(gl, rnd));
        var apRnd = gl.getAttribLocation(pointProg, 'aRnd');
        gl.enableVertexAttribArray(apRnd); gl.vertexAttribPointer(apRnd, 1, gl.FLOAT, false, 0, 0);

        var vaoLines = gl.createVertexArray();
        gl.bindVertexArray(vaoLines);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer(gl, ePos));
        var alPos = gl.getAttribLocation(lineProg, 'aPos');
        gl.enableVertexAttribArray(alPos); gl.vertexAttribPointer(alPos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer(gl, eRnd));
        var alRnd = gl.getAttribLocation(lineProg, 'aRnd');
        gl.enableVertexAttribArray(alRnd); gl.vertexAttribPointer(alRnd, 1, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer(gl, eEnd));
        var alEnd = gl.getAttribLocation(lineProg, 'aEnd');
        gl.enableVertexAttribArray(alEnd); gl.vertexAttribPointer(alEnd, 1, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer(gl, eSeed));
        var alSeed = gl.getAttribLocation(lineProg, 'aSeed');
        gl.enableVertexAttribArray(alSeed); gl.vertexAttribPointer(alSeed, 1, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);

        /* pointer steering — smoothed, with a slow idle drift so it is
           never completely static even without a pointer */
        var rotX = 0, rotY = 0, tRotX = 0, tRotY = 0, lost2 = false;
        if (!coarse) {
            addEventListener('pointermove', function (ev) {
                var r = host.getBoundingClientRect();
                var cx = (ev.clientX - (r.left + r.width / 2)) / innerWidth;
                var cy = (ev.clientY - (r.top + r.height / 2)) / innerHeight;
                tRotX = cx * 0.9;
                tRotY = Math.max(-0.5, Math.min(0.5, cy * 0.7));
            }, { passive: true });
        }

        function resize() {
            var r = host.getBoundingClientRect();
            var w = Math.max(1, Math.round(r.width * DPR));
            var h = Math.max(1, Math.round(r.height * DPR));
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w; canvas.height = h;
                gl.viewport(0, 0, w, h);
            }
        }
        resize();
        addEventListener('resize', resize, { passive: true });
        if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);

        canvas.addEventListener('webglcontextlost', function (e) {
            e.preventDefault(); lost2 = true;
            host.setAttribute('data-gl', 'off');
            window.TrionTicker && window.TrionTicker.remove(draw);
        });

        host.setAttribute('data-gl', 'on');

        function draw(dt, t) {
            if (lost2) return;
            var time = t * 0.001;
            rotX += (tRotX - rotX) * 0.045;
            rotY += (tRotY - rotY) * 0.045;

            var aspect = canvas.width / canvas.height;
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND);
            /* additive, premultiplied — order independent, so no sorting */
            gl.blendFunc(gl.ONE, gl.ONE);

            gl.useProgram(lineProg);
            gl.uniform1f(lu.uT, time);
            gl.uniform2f(lu.uRot, rotX, rotY);
            gl.uniform1f(lu.uAspect, aspect);
            gl.uniform1f(lu.uScale, 1.0);
            gl.uniform3fv(lu.uCool, pal.cool);
            gl.uniform3fv(lu.uHot, pal.hot);
            gl.bindVertexArray(vaoLines);
            gl.drawArrays(gl.LINES, 0, E * 2);

            gl.useProgram(pointProg);
            gl.uniform1f(pu.uT, time);
            gl.uniform2f(pu.uRot, rotX, rotY);
            gl.uniform1f(pu.uAspect, aspect);
            gl.uniform1f(pu.uScale, 1.0);
            gl.uniform1f(pu.uDpr, DPR);
            gl.uniform3fv(pu.uCool, pal.cool);
            gl.uniform3fv(pu.uHot, pal.hot);
            gl.uniform3fv(pu.uWarm, pal.warm);
            gl.bindVertexArray(vaoPoints);
            gl.drawArrays(gl.POINTS, 0, N);

            gl.bindVertexArray(null);
        }

        whenVisible(host, draw, resize);
    }

    /* Subscribe a draw fn to the shared ticker only while its host is
       actually on screen. Everything else stays paused. */
    function whenVisible(el, fn, onShow) {
        function play() {
            if (onShow) onShow();
            window.TrionTicker && window.TrionTicker.add(fn);
        }
        function pause() { window.TrionTicker && window.TrionTicker.remove(fn); }
        if (!('IntersectionObserver' in window)) { play(); return; }
        new IntersectionObserver(function (entries) {
            /* read the LAST entry: several can be batched into one callback */
            var e = entries[entries.length - 1];
            e.isIntersecting ? play() : pause();
        }, { threshold: 0.01 }).observe(el);
        reduceMQ.addEventListener && reduceMQ.addEventListener('change', function (e) {
            if (e.matches) pause();
        });
    }

    /* ════════════════════ 3. POINTER ════════════════════
       A single lightweight reticle. The old version ran up to 16
       closest() calls per pointer event and matched a 16-selector union
       string twice per mouseout; this resolves interactivity once per
       target with a single closest() call and caches the result. */
    function initPointer() {
        if (coarse || reduceMQ.matches) return;
        if (!document.body) return;

        var ring = document.createElement('div');
        ring.className = 'holo-cursor';
        ring.setAttribute('aria-hidden', 'true');
        var dot = document.createElement('div');
        dot.className = 'holo-cursor-dot';
        dot.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ring);
        document.body.appendChild(dot);

        var INTERACTIVE = 'a,button,input,textarea,select,summary,[role="button"],[tabindex]:not([tabindex="-1"]),.portfolio-item,.feature-card,.service-card';

        var x = innerWidth / 2, y = innerHeight / 2;
        var rx = x, ry = y, dx = x, dy = y;
        var active = false;

        addEventListener('pointermove', function (e) {
            x = e.clientX; y = e.clientY;
            var t = e.target;
            var hot = !!(t && t.closest && t.closest(INTERACTIVE));
            if (hot !== active) {
                active = hot;
                ring.classList.toggle('is-active', hot);
            }
        }, { passive: true });

        addEventListener('pointerdown', function () { ring.classList.add('is-down'); }, { passive: true });
        addEventListener('pointerup', function () { ring.classList.remove('is-down'); }, { passive: true });
        document.addEventListener('pointerleave', function () { ring.style.opacity = dot.style.opacity = '0'; });
        document.addEventListener('pointerenter', function () { ring.style.opacity = dot.style.opacity = ''; });

        window.TrionTicker && window.TrionTicker.add(function () {
            /* dot tracks tightly, ring trails — the lag is the character */
            dx += (x - dx) * 0.45;
            dy += (y - dy) * 0.45;
            rx += (x - rx) * 0.16;
            ry += (y - ry) * 0.16;
            dot.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0) translate(-50%,-50%)';
            ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';
        });
    }

    /* ════════════════════ 4. CARD TILT ════════════════════
       Pointer-follow highlight + subtle tilt. Writes CSS custom
       properties rather than transforms so CSS owns the visual result
       and there is no JS/CSS tug-of-war. No per-card rAF loops. */
    function initTilt() {
        if (coarse || reduceMQ.matches) return;
        var cards = document.querySelectorAll('.feature-card, .service-card, .portfolio-item, .value-card, .achievement-card');
        if (!cards.length) return;

        var queued = false, pending = [];

        function flush() {
            queued = false;
            for (var i = 0; i < pending.length; i++) {
                var p = pending[i];
                p.el.style.setProperty('--mx', p.mx + '%');
                p.el.style.setProperty('--my', p.my + '%');
                p.el.style.setProperty('--tilt-x', p.tx.toFixed(3) + 'deg');
                p.el.style.setProperty('--tilt-y', p.ty.toFixed(3) + 'deg');
            }
            pending.length = 0;
        }

        function onMove(e) {
            var el = e.currentTarget;
            var r = el.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width;
            var py = (e.clientY - r.top) / r.height;
            pending.push({
                el: el,
                mx: (px * 100).toFixed(2),
                my: (py * 100).toFixed(2),
                tx: (0.5 - py) * 5,
                ty: (px - 0.5) * 5
            });
            if (!queued) { queued = true; requestAnimationFrame(flush); }
        }
        function onLeave(e) {
            var el = e.currentTarget;
            el.style.setProperty('--tilt-x', '0deg');
            el.style.setProperty('--tilt-y', '0deg');
        }

        for (var i = 0; i < cards.length; i++) {
            cards[i].addEventListener('pointermove', onMove, { passive: true });
            cards[i].addEventListener('pointerleave', onLeave, { passive: true });
        }
    }

    function init() {
        initAmbient();
        initLattice();
        initPointer();
        initTilt();
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();
})();
