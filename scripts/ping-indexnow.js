#!/usr/bin/env node
/**
 * Notify IndexNow (Bing / Yandex / and by extension ChatGPT search) that the
 * site's URLs have changed, so they re-crawl quickly instead of in weeks.
 *
 * Reads every <loc> from sitemap.xml and submits them in one batch.
 * Run AFTER deploying:  node scripts/ping-indexnow.js   |   npm run indexnow
 *
 * The key file (<KEY>.txt) must be live at the site root first.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const HOST = 'trioncreation.com';
const KEY = '56b493e6485c38f693672868f5cd1e6b';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const sitemap = fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => !u.includes('#')); // skip in-page anchors

if (!urlList.length) { console.error('No URLs found in sitemap.xml'); process.exit(1); }

const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

(async () => {
    console.log(`Submitting ${urlList.length} URLs to IndexNow…`);
    const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
    });
    console.log(`IndexNow responded: ${res.status} ${res.statusText}`);
    if (res.status === 200 || res.status === 202) {
        console.log('✓ Accepted. Bing/Yandex will re-crawl shortly.');
    } else {
        console.log('Response body:', await res.text());
        console.log('Note: 403 usually means the key file is not yet live at', KEY_LOCATION);
    }
})().catch((e) => { console.error('IndexNow request failed:', e.message); process.exit(1); });
