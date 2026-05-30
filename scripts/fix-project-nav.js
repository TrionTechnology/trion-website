#!/usr/bin/env node
/**
 * One-shot: replace the truncated <ul class="nav-list"> in
 * /projects/*.html with the full 8-item nav matching index.html.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const FILES = ['colorverse.html', 'dddrive.html', 'yippi.html']
    .map((f) => path.resolve(__dirname, '..', 'projects', f));

const FULL_NAV = `<ul class="nav-list">
                        <li><a href="../index.html#home" class="nav-link">Home</a></li>
                        <li><a href="../index.html#about" class="nav-link">About</a></li>
                        <li><a href="../index.html#services" class="nav-link">Services</a></li>
                        <li><a href="../index.html#portfolio" class="nav-link active">Portfolio</a></li>
                        <li><a href="../index.html#partnerships" class="nav-link">Partnerships</a></li>
                        <li><a href="../index.html#tech-stack" class="nav-link">Tech Stack</a></li>
                        <li><a href="../index.html#faq" class="nav-link">FAQ</a></li>
                        <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
                    </ul>`;

let total = 0;
for (const file of FILES) {
    let html = fs.readFileSync(file, 'utf8');
    const updated = html.replace(/<ul class="nav-list">[\s\S]*?<\/ul>/, FULL_NAV);
    if (updated !== html) {
        fs.writeFileSync(file, updated, 'utf8');
        console.log(`  ✓ ${path.relative(path.resolve(__dirname, '..'), file)}`);
        total += 1;
    }
}
console.log(`Updated ${total}/${FILES.length} project nav blocks.`);
