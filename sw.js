/* ════════════════════════════════════════════════════════════
   Trion Creation — Service Worker
   ────────────────────────────────────────────────────────────
   v3: cache only files that actually exist; use Promise.allSettled
   so one missing asset never kills the whole install. v1/v2 are
   purged on activate.
   ════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'trion-creation-v3';

// Core shell: small set that actually exists. Runtime caching picks
// up the rest as the user navigates.
const SHELL = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/futuristic.js',
    '/scroll.js',
    '/manifest.json',
    '/trion-favicon.png',
    '/logo%20master%20-%20Trion-07%203.png',
];

// Install — cache the shell, but never fail install on a single miss
self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        const results = await Promise.allSettled(
            SHELL.map((url) => cache.add(url).catch((e) => {
                console.warn('[SW] skip cache:', url, e.message);
                throw e;
            }))
        );
        const failed = results.filter((r) => r.status === 'rejected').length;
        if (failed) console.warn(`[SW] ${failed}/${SHELL.length} shell items missed cache (non-fatal)`);
        self.skipWaiting();
    })());
});

// Activate — purge any caches that aren't the current version
self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        );
        await self.clients.claim();
    })());
});

// Fetch — cache-first for same-origin GETs, network-first otherwise.
// Avoid intercepting cross-origin / non-GET / chrome-extension etc.
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith((async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
            const fresh = await fetch(req);
            // Opportunistic runtime cache for same-origin HTML / CSS / JS / images
            if (fresh && fresh.status === 200 && fresh.type === 'basic') {
                const clone = fresh.clone();
                caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
            }
            return fresh;
        } catch (e) {
            return cached || Response.error();
        }
    })());
});
