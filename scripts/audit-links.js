#!/usr/bin/env node
/**
 * Broken-path audit.
 *
 * Walks every .html file in the repo and resolves every LOCAL reference it
 * makes — href, src, srcset candidates, CSS url(...) in inline styles, and the
 * onerror="this.src='…'" fallbacks — against the filesystem. Remote URLs,
 * data:/mailto:/tel:/javascript: and bare fragments are skipped.
 *
 * Usage:  node scripts/audit-links.js   (exits 1 if anything is missing)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'vendor']);

function walk(dir, out = []) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (SKIP_DIRS.has(e.name)) continue;
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (e.name.endsWith('.html')) out.push(p);
    }
    return out;
}

const isRemote = (u) => /^(https?:)?\/\//i.test(u) || /^(data|mailto|tel|javascript|blob):/i.test(u);

function refsIn(html) {
    const refs = new Set();
    const add = (u) => {
        if (!u) return;
        u = u.trim();
        if (!u || isRemote(u) || u.startsWith('#')) return;
        refs.add(u.split('#')[0].split('?')[0]);
    };

    for (const m of html.matchAll(/\s(?:href|src|poster)\s*=\s*"([^"]*)"/g)) add(m[1]);
    for (const m of html.matchAll(/\ssrcset\s*=\s*"([^"]*)"/g)) {
        for (const cand of m[1].split(',')) add(cand.trim().split(/\s+/)[0]);
    }
    for (const m of html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) add(m[1]);
    for (const m of html.matchAll(/this\.src\s*=\s*'([^']*)'/g)) add(m[1]);
    return refs;
}

function resolve(ref, fileDir) {
    const raw = decodeURIComponent(ref);
    return raw.startsWith('/') ? path.join(ROOT, raw) : path.resolve(fileDir, raw);
}

const files = walk(ROOT).sort();
const broken = [];
let checked = 0;

for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    const dir = path.dirname(f);
    for (const ref of refsIn(html)) {
        if (!ref) continue;
        checked++;
        let target = resolve(ref, dir);
        if (ref.endsWith('/')) target = path.join(target, 'index.html');
        if (!fs.existsSync(target)) {
            broken.push(`${path.relative(ROOT, f)} → ${ref}`);
        }
    }
}

console.log(`Scanned ${files.length} HTML files, ${checked} local references.`);
if (broken.length) {
    console.log(`\n${broken.length} BROKEN:`);
    for (const b of broken) console.log('  ' + b);
    process.exit(1);
}
console.log('No broken local paths.');
