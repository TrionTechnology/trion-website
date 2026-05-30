#!/usr/bin/env node
/**
 * One-shot: convert each <div class="portfolio-item"> in index.html
 * to <a class="portfolio-item" href="portfolio/<slug>.html">, matched
 * by the h3 title to the portfolio.json slug.
 *
 * Idempotent — if a block is already an <a>, it's skipped.
 *
 * Run:  node scripts/link-portfolio-cards.js
 */

'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const portfolio = JSON.parse(fs.readFileSync(path.join(__dirname, 'portfolio.json'), 'utf8'));

const titleToSlug = Object.fromEntries(portfolio.map((p) => [p.title.toLowerCase(), p.slug]));

let html = fs.readFileSync(INDEX, 'utf8');

// Match each portfolio-item block: opening div, contents, closing div
// (lazy match to nearest </div> at the right indent level)
const re = /<div class="portfolio-item"([^>]*?)>([\s\S]*?<h3>([^<]+)<\/h3>[\s\S]*?)<\/div>\s*<\/div>/g;

let replaced = 0;
html = html.replace(re, (match, attrs, inner, title) => {
    const slug = titleToSlug[title.trim().toLowerCase()];
    if (!slug) {
        console.warn(`  ! no slug for h3="${title.trim()}" — leaving as div`);
        return match;
    }
    replaced += 1;
    return `<a class="portfolio-item"${attrs} href="portfolio/${slug}.html" aria-label="View ${title.trim()} details">${inner}</div>\n                    </a>`;
});

fs.writeFileSync(INDEX, html, 'utf8');
console.log(`Converted ${replaced} portfolio-item div(s) to anchor links.`);
