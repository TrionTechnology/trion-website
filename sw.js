/* ════════════════════════════════════════════════════════════
   Trion Creation — Service Worker
   ────────────────────────────────────────────────────────────
   v4: network-first for HTML/JS/CSS/JSON so code updates take
   effect immediately. Cache-first for images/fonts/icons.
   Old caches (v1, v2, v3) are purged on activate.
   ════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'trion-creation-v4';

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

// File extensions that should always try the network first.
// Catches all .html, .js, .css, .json — code/content that changes.
const NETWORK_FIRST = /\.(?:html|js|css|json|xml|txt)$/;

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await Promise.allSettled(
            SHELL.map((url) => cache.add(url).catch((e) => {
                console.warn('[SW] skip cache:', url, e.message);
                throw e;
            }))
        );
        self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        );
        await self.clients.claim();
        // Tell any open page that a new SW has taken over
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
            client.postMessage({ type: 'SW_UPDATED' });
        }
    })());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;

    const isCodeOrContent =
        url.pathname === '/' ||
        url.pathname.endsWith('/') ||
        NETWORK_FIRST.test(url.pathname);

    if (isCodeOrContent) {
        // Network-first: fresh code wins, cache is fallback for offline
        event.respondWith((async () => {
            try {
                const fresh = await fetch(req);
                if (fresh && fresh.status === 200) {
                    const clone = fresh.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
                }
                return fresh;
            } catch (e) {
                const cached = await caches.match(req);
                return cached || Response.error();
            }
        })());
    } else {
        // Cache-first for images / fonts / static assets
        event.respondWith((async () => {
            const cached = await caches.match(req);
            if (cached) return cached;
            try {
                const fresh = await fetch(req);
                if (fresh && fresh.status === 200 && fresh.type === 'basic') {
                    const clone = fresh.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(req, clone)).catch(() => {});
                }
                return fresh;
            } catch (e) {
                return cached || Response.error();
            }
        })());
    }
});
