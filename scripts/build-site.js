#!/usr/bin/env node
/**
 * Trion Creation — site builder (multilingual: en / zh / ms)
 * ─────────────────────────────────────────────────────────────────────
 * • Generates service + portfolio pages for every locale:
 *      en → /services/<slug>.html        /portfolio/<slug>.html
 *      zh → /zh/services/<slug>.html      /zh/portfolio/<slug>.html
 *      ms → /ms/services/<slug>.html      /ms/portfolio/<slug>.html
 *   Content for zh/ms comes from scripts/i18n/<base>.<lang>.json
 *   (falls back to English data when a translation file is absent).
 * • Every page carries hreflang alternates + a language switcher.
 * • Rebuilds sitemap.xml with per-language URLs + hreflang annotations.
 * • Refreshes <lastmod> dates and llms.txt / llms-full.txt stamps.
 *
 * Usage:  node scripts/build-site.js   |   npm run build
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { LOCALES, META, UI, fmtRM } = require('./i18n/ui');

const ROOT = path.resolve(__dirname, '..');
const I18N_DIR = path.join(__dirname, 'i18n');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const LLMS = path.join(ROOT, 'llms.txt');
const LLMS_FULL = path.join(ROOT, 'llms-full.txt');
const ORIGIN = 'https://trioncreation.com';

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// ─── data loading (per locale, with English fallback) ───
function loadData(base, locale) {
    if (locale === 'en') return JSON.parse(fs.readFileSync(path.join(__dirname, `${base}.json`), 'utf8'));
    const f = path.join(I18N_DIR, `${base}.${locale}.json`);
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
    console.warn(`  ! ${base}.${locale}.json not found — falling back to English content`);
    return JSON.parse(fs.readFileSync(path.join(__dirname, `${base}.json`), 'utf8'));
}

// ─── helpers ───
const esc = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');

const seg = (loc) => (META[loc].dir ? `/${META[loc].dir}` : '');           // '' | '/zh' | '/ms'
const assetPrefix = (loc) => (META[loc].dir ? '../../' : '../');           // pages live one dir deep

// ─── shared <head> fragments (kept in one place so every template agrees) ───
const FONT_LINK =
    `<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300..800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">`;

// A = relative path from the page back to the site root ('', '../', '../../')
const faviconLinks = (A) =>
    `<link rel="icon" href="${A}images/icons/favicon-32.png" sizes="32x32" type="image/png">\n` +
    `    <link rel="icon" href="${A}images/icons/favicon-16.png" sizes="16x16" type="image/png">\n` +
    `    <link rel="apple-touch-icon" href="${A}images/icons/favicon-180.png">`;

// <picture> is an inline box by default, which would insert itself between an
// image and its styled parent (grids, fixed-height crops, baseline gaps).
// display:contents removes that box while leaving source selection intact.
// PICTURE_RESET removed: `picture { display: contents; }` now lives in
// styles.css, which every generated page already loads.

const SKIP_LINK = `<a class="skip-link" href="#main">Skip to content</a>`;

// ─── responsive images ───
const IMG_MANIFEST = (() => {
    const f = path.join(__dirname, 'image-manifest.json');
    if (!fs.existsSync(f)) {
        console.warn('  ! scripts/image-manifest.json not found — emitting plain <img> tags');
        return {};
    }
    return JSON.parse(fs.readFileSync(f, 'utf8'));
})();

// Originals whose AVIF derivative came out LARGER than the WebP — ship WebP only.
const AVIF_SKIP = new Set(['images/hero/hero-main.jpg']);

const encPath = (p) => p.split('/').map(encodeURIComponent).join('/');

/**
 * Render a <picture> with AVIF + WebP sources and the original as the <img>
 * fallback, carrying intrinsic width/height so the box is reserved before the
 * bytes land (no CLS).
 *
 * @param key    manifest key = original path relative to the site root
 * @param A      relative path from the page back to the site root
 * @param o      { alt, sizes, cls, style, loading, decoding, fetchpriority }
 */
function picture(key, A, o = {}) {
    const m = IMG_MANIFEST[key];
    const attrs = [
        `alt="${escAttr(o.alt || '')}"`,
        o.cls ? `class="${escAttr(o.cls)}"` : '',
        o.style ? `style="${escAttr(o.style)}"` : '',
        o.loading ? `loading="${o.loading}"` : '',
        o.decoding ? `decoding="${o.decoding}"` : '',
        o.fetchpriority ? `fetchpriority="${o.fetchpriority}"` : '',
    ].filter(Boolean).join(' ');

    if (!m) return `<img src="${A}${encPath(key)}" ${attrs}>`;

    const srcset = (fmt) => Object.entries(m.variants[fmt] || {})
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([w, p]) => `${A}${encPath(p)} ${w}w`)
        .join(', ');
    const sizes = o.sizes ? ` sizes="${escAttr(o.sizes)}"` : '';

    const sources = [];
    if (!AVIF_SKIP.has(key) && m.variants.avif) sources.push(`<source type="image/avif" srcset="${srcset('avif')}"${sizes}>`);
    if (m.variants.webp) sources.push(`<source type="image/webp" srcset="${srcset('webp')}"${sizes}>`);

    return `<picture>${sources.join('')}<img src="${A}${encPath(key)}" width="${m.w}" height="${m.h}" ${attrs}></picture>`;
}

/* ────────────────────────────────────────────────────────────
   TECH ICONS
   images/tech-icons/ holds 47 monochrome brand marks that nothing
   referenced. They are Simple Icons: no fill attribute, so they paint
   black and would be invisible on the dark theme. Rendering them as a
   CSS mask over currentColor lets each mark take the colour of the chip
   it sits in — including the gold hover — while staying a separate
   cacheable file rather than inline markup on every page.
   A stack entry with no matching mark simply renders as text.
   ──────────────────────────────────────────────────────────── */
const TECH_ICONS = (() => {
    try {
        return new Set(
            fs.readdirSync(path.join(ROOT, 'images', 'tech-icons'))
              .filter((f) => f.endsWith('.svg'))
              .map((f) => f.replace(/\.svg$/, ''))
        );
    } catch (e) { return new Set(); }
})();

/* Spellings in the data files do not match icon filenames one to one:
   "Node.js" -> nodejs, "PostgreSQL + PostGIS" -> postgresql, and a few
   entries name two vendors ("Stripe / iPay88") or an extension
   ("PostgreSQL + PostGIS"), so the label is also tried split on / and +,
   with the first part that has a mark winning. */
const TECH_ALIAS = {
    nodejs: 'nodejs', node: 'nodejs', reactnative: 'react', react: 'react',
    vuejs: 'vuejs', vue: 'vuejs', nextjs: 'nextjs', typescript: 'typescript',
    tailwindcss: 'tailwindcss', html5: 'html5', php: 'php', laravel: 'laravel',
    express: 'express', graphql: 'graphql', apollo: 'apollo', prisma: 'prisma',
    postgresql: 'postgresql', postgres: 'postgresql', mysql: 'mysql',
    mongodb: 'mongodb', redis: 'redis', firebase: 'firebase',
    aws: 'aws', awss3: 'aws', amazonaws: 'aws',
    alibabacloud: 'alibaba-cloud', alibabacloudcdn: 'alibaba-cloud',
    docker: 'docker', kubernetes: 'kubernetes', nginx: 'nginx',
    githubactions: 'github-actions', airflow: 'airflow',
    flutter: 'flutter', swift: 'swift', kotlin: 'kotlin', xamarin: 'xamarin',
    odoo: 'odoo', sap: 'sap', powerbi: 'powerbi',
    openai: 'openai', tensorflow: 'tensorflow', pytorch: 'pytorch',
    spacy: 'spacy', dialogflow: 'dialogflow',
    solidity: 'solidity', ethereum: 'ethereum', web3js: 'web3js',
    hardhat: 'hardhat', opensea: 'opensea',
    stripe: 'stripe', paypal: 'paypal', square: 'square',
    zapier: 'zapier', rapidapi: 'rapidapi',
};

const normTech = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

function techIconSlug(label) {
    /* try the whole label, then each "/"-separated vendor in order */
    const candidates = [label].concat(String(label).split(/[/+]/));
    for (const c of candidates) {
        const key = normTech(c);
        if (!key) continue;
        const slug = TECH_ALIAS[key];
        if (slug && TECH_ICONS.has(slug)) return slug;
        if (TECH_ICONS.has(key)) return key;
    }
    return null;
}

function techChip(label, A, cls) {
    const slug = techIconSlug(label);
    const ico = slug
        ? `<i class="tech-ico" aria-hidden="true" style="--ico:url('${A}images/tech-icons/${slug}.svg')"></i>`
        : '';
    return `<span class="${cls}${slug ? ' has-ico' : ''}">${ico}${esc(label)}</span>`;
}

const LOGO = 'logo master - Trion-07 3.png';
// The logo renders at 51px tall in the header, 55px in the footer — a 400w
// derivative covers every realistic DPR, so one candidate and a flat size.
const logoPicture = (A, o = {}) => picture(LOGO, A, { alt: 'Trion Creation', sizes: '160px', ...o });

// Cross-language switcher: 🌐 globe dropdown (root-absolute links so depth never matters).
const LANG_FULL = { en: 'English', zh: '中文', ms: 'Bahasa Malaysia' };
function langSwitcher(currentLoc, pathFor) {
    const items = LOCALES.map((loc) => {
        const cls = loc === currentLoc ? 'lang-option active' : 'lang-option';
        const cur = loc === currentLoc ? ' aria-current="true"' : '';
        return `<li role="none"><a role="menuitem" href="${pathFor(loc)}" hreflang="${META[loc].hreflang}" lang="${META[loc].htmlLang}" class="${cls}"${cur}>${LANG_FULL[loc]}</a></li>`;
    }).join('');
    return `<div class="lang-dropdown" data-lang-dropdown>` +
        `<button type="button" class="lang-dropdown-toggle" aria-haspopup="true" aria-expanded="false" aria-label="Select language">` +
        `<svg class="lang-globe" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><line x1="3" y1="12" x2="21" y2="12"></line><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"></path></svg>` +
        `<span class="lang-current">${UI[currentLoc].langLabel}</span>` +
        `<svg class="lang-caret" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg>` +
        `</button>` +
        `<ul class="lang-dropdown-menu" role="menu">${items}</ul>` +
        `</div>`;
}

// hreflang <link> block for <head>. urlFor(loc) → absolute URL.
function hreflangBlock(urlFor) {
    const lines = LOCALES.map((loc) =>
        `    <link rel="alternate" hreflang="${META[loc].hreflang}" href="${urlFor(loc)}">`);
    lines.push(`    <link rel="alternate" hreflang="x-default" href="${urlFor('en')}">`);
    return lines.join('\n');
}

// ────────────────────────────────────────────────────────────
//  SERVICE PAGE RENDERER
// ────────────────────────────────────────────────────────────
function renderService(s, locale) {
    const t = UI[locale];
    const A = assetPrefix(locale);                         // → site root (shared assets)
    const N = '../';                                       // → language home
    const urlFor = (loc) => `${ORIGIN}${seg(loc)}/services/${s.slug}.html`;
    const url = urlFor(locale);

    /* Service features are bare strings, so the card carries the numeric
       mark and the feature name — the same component the case studies
       use, just without a description line. */
    const features = s.features.map((f, i) => `
                    <div class="pf-feature-card" data-reveal>
                        <div class="pf-feature-mark">${String(i + 1).padStart(2, '0')}</div>
                        <h3>${esc(f)}</h3>
                    </div>`).join('');

    const overview = s.overview.map((p) =>
        `                    <p>${esc(p)}</p>`).join('\n');

    const expertise = s.expertise.map((e) => `
                    <div class="svc-expertise-card" data-reveal>
                        <h3>${esc(e.title)}</h3>
                        <p>${esc(e.desc)}</p>
                    </div>`).join('');

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: s.schemaServiceType,
        name: locale === 'en' ? `${s.title} Malaysia` : s.title,
        description: s.schemaDescription,
        provider: {
            '@type': 'Organization',
            name: 'Trion Creation Sdn Bhd',
            url: ORIGIN,
            logo: `${ORIGIN}/logo%20master%20-%20Trion-07%203.png`
        },
        areaServed: [
            { '@type': 'Country', name: 'Malaysia' },
            { '@type': 'Country', name: 'Singapore' },
            { '@type': 'Country', name: 'Thailand' },
            { '@type': 'Country', name: 'Indonesia' }
        ],
        url,
        inLanguage: META[locale].hreflang,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'MYR',
            priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'MYR',
                minPrice: String(s.priceMin),
                maxPrice: String(s.priceMax)
            }
        }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: t.svc.home, item: `${ORIGIN}${seg(locale)}/` },
            { '@type': 'ListItem', position: 2, name: t.svc.services, item: `${ORIGIN}${seg(locale)}/#services` },
            { '@type': 'ListItem', position: 3, name: s.title, item: url }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: META[locale].hreflang,
        mainEntity: t.faqSvc(s).map((qa) => ({
            '@type': 'Question',
            name: qa.q,
            acceptedAnswer: { '@type': 'Answer', text: qa.a }
        }))
    };

    return `<!DOCTYPE html>
<html lang="${META[locale].htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escAttr(s.metaTitle)}</title>
    <meta name="description" content="${escAttr(s.metaDescription)}">
    <meta name="keywords" content="${escAttr(s.keywords)}">
    <meta name="author" content="Trion Creation Sdn Bhd">
    <link rel="canonical" href="${url}">
${hreflangBlock(urlFor)}
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escAttr(s.metaTitle)}">
    <meta property="og:description" content="${escAttr(s.ogShort)}">
    <meta property="og:image" content="${ORIGIN}/logo%20master%20-%20Trion-07%203.png">
    <meta property="og:locale" content="${META[locale].htmlLang.replace('-', '_')}">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">
${JSON.stringify(serviceSchema, null, 4)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 4)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(faqSchema, null, 4)}
    </script>
    <link rel="stylesheet" href="${A}styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${FONT_LINK}
    ${faviconLinks(A)}
    <link rel="manifest" href="${A}manifest.json">
        <meta name="theme-color" content="#07051A">
</head>
<body>
    ${SKIP_LINK}
    <canvas id="trion-canvas" aria-hidden="true"></canvas>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="${N}index.html#home" class="logo">
                    ${logoPicture(A, { fetchpriority: 'high', decoding: 'async' })}
                </a>
                <nav class="main-nav">
                    <ul class="nav-list">
                        <li><a href="${N}index.html#home" class="nav-link">${t.nav.home}</a></li>
                        <li><a href="${N}index.html#about" class="nav-link">${t.nav.about}</a></li>
                        <li><a href="${N}index.html#services" class="nav-link active">${t.nav.services}</a></li>
                        <li><a href="${N}index.html#portfolio" class="nav-link">${t.nav.portfolio}</a></li>
                        <li><a href="${N}index.html#partnerships" class="nav-link">${t.nav.partnerships}</a></li>
                        <li><a href="${N}products.html" class="nav-link">${t.nav.products}</a></li>
                        <li><a href="${N}index.html#faq" class="nav-link">${t.nav.faq}</a></li>
                        <li><a href="${N}index.html#contact" class="nav-link">${t.nav.contact}</a></li>
                    </ul>
                </nav>
                <div class="header-actions">
                    ${langSwitcher(locale, urlFor)}
                    <a href="${N}index.html#contact" class="btn btn-primary">${t.getStarted}</a>
                </div>
                <button class="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <main class="main-content" id="main">
        <!-- ─── SERVICE HERO — same grid floor + scanline as the case studies ─── -->
        <section class="pf-hero svc-hero" style="--pf-gradient: linear-gradient(150deg, rgba(20,169,141,0.30) 0%, rgba(7,5,26,0.92) 58%, rgba(232,196,95,0.18) 100%);">
            <div class="pf-grid-floor" aria-hidden="true"></div>
            <div class="pf-scanline" aria-hidden="true"></div>
            <div class="container">
                <div class="pf-hero-grid">
                    <div class="pf-hero-copy">
                        <div class="pf-breadcrumb" data-scramble-group>
                            <a href="${N}index.html">${t.svc.home}</a>
                            <span class="pf-breadcrumb-sep">›</span>
                            <a href="${N}index.html#services">${t.svc.services}</a>
                            <span class="pf-breadcrumb-sep">›</span>
                            <span>${esc(s.title)}</span>
                        </div>
                        <div class="pf-eyebrow" data-scramble>${t.svc.service} · ${escAttr(s.schemaServiceType.toUpperCase())}</div>
                        <h1 class="pf-title" data-split>${esc(s.title)}</h1>
                        <p class="pf-tagline">${esc(s.tagline)}</p>
                        <div class="pf-stats">
                            <div class="stat-cell">
                                <span class="stat-cell-number">${fmtRM(s.priceMin)}</span>
                                <span class="stat-cell-label">${t.svc.fromPrice}</span>
                            </div>
                            <div class="stat-cell">
                                <span class="stat-cell-number">${esc(t.svc.weeks)}</span>
                                <span class="stat-cell-label">${t.svc.typicalTimeline}</span>
                            </div>
                            <div class="stat-cell">
                                <span class="stat-cell-number">${t.svc.deliveredVal}</span>
                                <span class="stat-cell-label">${t.svc.delivered}</span>
                            </div>
                        </div>
                    </div>
                    ${svcWire(s.slug)}
                </div>
            </div>
        </section>

        <!-- ─── 01 · OVERVIEW ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">01</span>
                    <h2 data-clip>${t.svc.overview}</h2>
                </div>
                <div class="pf-prose">
${overview}
                </div>
            </div>
        </section>

        <!-- ─── 02 · KEY FEATURES ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">02</span>
                    <h2 data-clip>${t.svc.keyFeatures}</h2>
                </div>
                <div class="pf-features-grid" data-reveal-group>
${features}
                </div>
            </div>
        </section>

        <!-- ─── 03 · EXPERTISE ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">03</span>
                    <h2 data-clip>${t.svc.expertise}</h2>
                </div>
                <div class="svc-expertise-grid" data-reveal-group>${expertise}
                </div>
            </div>
        </section>

        <!-- ─── CTA — the same card the case studies close on ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-cta-card">
                    <div class="pf-cta-grid" aria-hidden="true"></div>
                    <div class="pf-cta-content">
                        <div class="pf-eyebrow" style="color: var(--void-0);">${t.pf.readyToBuild}</div>
                        <h2 data-clip>${esc(t.svc.ctaTitle(s.title))}</h2>
                        <p>${esc(t.svc.ctaBody)}</p>
                        <div class="pf-cta-row" style="margin-top: 2rem;">
                            <a href="${N}index.html#contact" class="btn btn-secondary" data-magnetic="0.2" style="background: var(--void-0); color: var(--text-100); border-color: rgba(255,255,255,0.3);">${t.bookCall}</a>
                            <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(s.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" data-magnetic="0.2" style="background: transparent; color: var(--void-0); border-color: var(--void-0);">${t.whatsapp}</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
${faqSection(t.faqSvc(s), t, { eyebrow: 'COMMON QUESTIONS' })}
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="logo">${logoPicture(A, { loading: 'lazy', decoding: 'async' })}</div>
                    <p>${t.footer.tagline}</p>
                </div>
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>${t.footer.servicesH}</h4>
                        <ul>
                            <li><a href="${N}index.html#services">${t.footer.allServices}</a></li>
                            <li><a href="mobile-web-app-development.html">${t.footer.mobileWeb}</a></li>
                            <li><a href="erp-crm-development.html">${t.footer.erpCrm}</a></li>
                            <li><a href="ai-automation-chatbot.html">${t.footer.aiChatbot}</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>${t.footer.companyH}</h4>
                        <ul>
                            <li><a href="${N}index.html#about">${t.footer.about}</a></li>
                            <li><a href="${N}index.html#portfolio">${t.footer.portfolio}</a></li>
                            <li><a href="${N}index.html#contact">${t.footer.contact}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <span class="year-now">${new Date().getFullYear()}</span> Trion Creation Sdn Bhd. ${t.footer.rights}</p>
            </div>
        </div>
    </footer>

    <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(s.title)}" class="whatsapp-button" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    </a>

    <script src="${A}script.js"></script>
    <script src="${A}futuristic.js"></script>
    <script src="${A}scroll.js"></script>
</body>
</html>
`;
}

/* Per-service wireframes — the same stroke language as PF_WIRE, so a
   service page and a case-study page read as one family. Each is drawn
   on a 300x148 canvas; `.w-live` marks the one stroke that takes the
   bright signal colour, which keeps a focal point in every illustration.
   Authored here rather than photographed: a stock photo of "an API"
   says nothing, and these stay sharp at any size for ~1KB of markup. */
const SVC_WIRE = {
  'mobile-web-app-development': `<rect x="16" y="22" width="150" height="104" rx="7"/><path d="M16 40h150" opacity=".45"/><circle cx="28" cy="31" r="2.5" opacity=".6"/><circle cx="38" cy="31" r="2.5" opacity=".6"/><path d="M32 56h64M32 70h96M32 84h78" opacity=".45"/><rect x="32" y="98" width="52" height="14" rx="4" class="w-live"/><rect x="196" y="14" width="76" height="120" rx="11"/><path d="M224 22h20" opacity=".6"/><rect x="206" y="36" width="56" height="34" rx="4" opacity=".5"/><path d="M206 80h56M206 92h36M206 104h48" opacity=".4"/><path d="M166 74h30" opacity=".5"/>`,
  'erp-crm-development': `<rect x="112" y="12" width="76" height="34" rx="5" class="w-live"/><path d="M150 46v18M150 64H44v14M150 64h106v14M150 64v14" opacity=".5"/><rect x="14" y="78" width="60" height="30" rx="5"/><rect x="120" y="78" width="60" height="30" rx="5"/><rect x="226" y="78" width="60" height="30" rx="5"/><path d="M26 90h36M132 90h36M238 90h36" opacity=".4"/><path d="M26 100h22M132 100h26M238 100h18" opacity=".3"/><path d="M124 24h52" opacity=".55"/><path d="M44 108v12h212v-12" opacity=".25"/>`,
  'ai-automation-chatbot': `<rect x="16" y="26" width="120" height="40" rx="12"/><path d="M28 40h74M28 52h50" opacity=".45"/><rect x="60" y="84" width="120" height="40" rx="12" class="w-live"/><path d="M74 98h86M74 110h58" opacity=".5"/><circle cx="238" cy="46" r="9"/><circle cx="212" cy="86" r="7" opacity=".7"/><circle cx="262" cy="90" r="7" opacity=".7"/><circle cx="238" cy="120" r="6" opacity=".55"/><path d="M238 55v56M232 52l-14 28M244 52l14 30M219 92h36" opacity=".45"/>`,
  'odoo-customisation': `<rect x="18" y="18" width="80" height="52" rx="6"/><rect x="110" y="18" width="80" height="52" rx="6"/><rect x="202" y="18" width="80" height="52" rx="6" class="w-live"/><rect x="18" y="82" width="80" height="48" rx="6" opacity=".55"/><rect x="110" y="82" width="80" height="48" rx="6" opacity=".55"/><rect x="202" y="82" width="80" height="48" rx="6" opacity=".55"/><path d="M30 34h44M30 46h30M122 34h44M122 46h36M214 34h44M214 46h26" opacity=".4"/><path d="M98 44h12M190 44h12M98 106h12M190 106h12" opacity=".5"/>`,
  'pos-inventory-management': `<rect x="20" y="30" width="104" height="72" rx="6"/><rect x="32" y="42" width="80" height="30" rx="3" class="w-live"/><path d="M32 82h34M74 82h38" opacity=".45"/><path d="M20 108h104" opacity=".35"/><rect x="156" y="24" width="52" height="42" rx="4"/><rect x="216" y="24" width="52" height="42" rx="4" opacity=".6"/><rect x="156" y="78" width="52" height="42" rx="4" opacity=".6"/><rect x="216" y="78" width="52" height="42" rx="4" opacity=".4"/><path d="M166 40h32M226 40h32M166 94h32M226 94h32" opacity=".35"/>`,
  'booking-system-development': `<rect x="40" y="20" width="220" height="112" rx="7"/><path d="M40 44h220" opacity=".5"/><path d="M78 14v14M222 14v14" opacity=".7"/><rect x="58" y="56" width="38" height="24" rx="3" opacity=".45"/><rect x="108" y="56" width="38" height="24" rx="3" opacity=".45"/><rect x="158" y="56" width="38" height="24" rx="3" class="w-live"/><rect x="208" y="56" width="38" height="24" rx="3" opacity=".45"/><rect x="58" y="90" width="38" height="24" rx="3" opacity=".3"/><rect x="108" y="90" width="38" height="24" rx="3" opacity=".3"/><rect x="158" y="90" width="38" height="24" rx="3" opacity=".3"/><rect x="208" y="90" width="38" height="24" rx="3" opacity=".3"/>`,
  'loan-management-system': `<rect x="24" y="16" width="86" height="116" rx="6"/><path d="M38 40h58M38 54h58M38 68h40" opacity=".45"/><rect x="38" y="88" width="58" height="26" rx="4" opacity=".4"/><path d="M110 74h34" opacity=".5"/><circle cx="168" cy="74" r="24"/><path d="M158 74l7 8 14-16" class="w-live"/><path d="M192 74h30" opacity=".5"/><rect x="222" y="44" width="60" height="60" rx="8" opacity=".6"/><path d="M234 66h36M234 78h24" opacity=".4"/>`,
  'api-integration-development': `<circle cx="150" cy="74" r="26" class="w-live"/><path d="M140 68h20M140 80h20" opacity=".7"/><circle cx="40" cy="30" r="14" opacity=".7"/><circle cx="40" cy="118" r="14" opacity=".7"/><circle cx="260" cy="30" r="14" opacity=".7"/><circle cx="260" cy="118" r="14" opacity=".7"/><path d="M54 36l72 26M54 112l72-26M246 36l-72 26M246 112l-72-26" opacity=".45"/><path d="M150 12v36M150 100v36" opacity=".3"/>`,
  'blockchain-web3-solutions': `<rect x="18" y="52" width="56" height="44" rx="5"/><rect x="94" y="52" width="56" height="44" rx="5"/><rect x="170" y="52" width="56" height="44" rx="5" class="w-live"/><rect x="246" y="52" width="40" height="44" rx="5" opacity=".5"/><path d="M74 74h20M150 74h20M226 74h20" opacity=".7"/><path d="M30 66h32M30 78h20M106 66h32M106 78h24M182 66h32M182 78h18" opacity=".4"/><path d="M46 52V28h194v24" opacity=".3"/><circle cx="143" cy="24" r="6" opacity=".6"/>`,
  'ar-vr-metaverse-development': `<path d="M52 56h196a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14h-52l-22 16-22-16H52a14 14 0 0 1-14-14V70a14 14 0 0 1 14-14z" opacity=".55"/><circle cx="104" cy="82" r="17" class="w-live"/><circle cx="196" cy="82" r="17"/><path d="M121 82h58" opacity=".5"/><path d="M150 24l40 22-40 22-40-22z" opacity=".45"/><path d="M110 46v20M190 46v20" opacity=".3"/>`,
  'cloud-infrastructure-devops': `<path d="M96 56a30 30 0 0 1 58-10 22 22 0 0 1 32 18 20 20 0 0 1-4 40H100a26 26 0 0 1-4-48z" class="w-live"/><rect x="34" y="104" width="64" height="26" rx="4"/><rect x="118" y="104" width="64" height="26" rx="4"/><rect x="202" y="104" width="64" height="26" rx="4"/><path d="M46 117h26M130 117h26M214 117h26" opacity=".4"/><circle cx="88" cy="117" r="3" opacity=".7"/><circle cx="172" cy="117" r="3" opacity=".7"/><circle cx="256" cy="117" r="3" opacity=".7"/><path d="M66 104V92h168v12" opacity=".3"/>`,
  'product-design-ux': `<rect x="20" y="20" width="110" height="108" rx="6"/><rect x="34" y="34" width="82" height="30" rx="3" class="w-live"/><path d="M34 76h82M34 88h58M34 100h70" opacity=".4"/><rect x="156" y="20" width="124" height="60" rx="6" opacity=".6"/><path d="M170 34h40M170 46h72M170 58h52" opacity=".35"/><rect x="156" y="92" width="58" height="36" rx="5" opacity=".5"/><rect x="222" y="92" width="58" height="36" rx="5" opacity=".5"/><path d="M130 74h26" opacity=".5"/><circle cx="264" cy="36" r="7" opacity=".65"/>`,
};
const svcWire = (slug) =>
  `<div class="pf-hero-visual" aria-hidden="true" data-parallax="0.05" style="--par-amt:22px"><svg viewBox="0 0 300 148" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" preserveAspectRatio="xMidYMid meet">${SVC_WIRE[slug] || SVC_WIRE['mobile-web-app-development']}</svg></div>`;

/* ────────────────────────────────────────────────────────────
   VISIBLE FAQ SECTION
   Every page that emits FAQPage JSON-LD must also show the same
   Q&A to a human — Google requires the content to be visible, and
   an answer engine can only quote what is actually in the DOM.
   Native <details> keeps it keyboard-accessible with no JS.
   ──────────────────────────────────────────────────────────── */
function faqSection(items, t, opts = {}) {
    if (!items || !items.length) return '';
    const rows = items.map((qa, i) => `
                    <details class="faq-item" data-reveal${i === 0 ? ' open' : ''}>
                        <summary class="faq-q">
                            <span>${esc(qa.q)}</span>
                            <svg class="faq-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
                        </summary>
                        <div class="faq-a"><p>${esc(qa.a)}</p></div>
                    </details>`).join('');
    return `
        <!-- ─── FAQ (visible twin of the FAQPage schema) ─── -->
        <section class="faq-section" aria-labelledby="faq-heading">
            <div class="container">
                <div class="faq-head" data-reveal>
                    <span class="faq-eyebrow">${escAttr(opts.eyebrow || 'FAQ')}</span>
                    <h2 id="faq-heading" data-clip>${esc(t.faqH)}</h2>
                    <p>${esc(t.faqIntro)}</p>
                </div>
                <div class="faq-list" data-reveal-group>${rows}
                </div>
            </div>
        </section>
`;
}

// ────────────────────────────────────────────────────────────
//  PORTFOLIO PAGE RENDERER
// ────────────────────────────────────────────────────────────

/* Category wireframes — identical to the ones on the home-page portfolio
   cards, so clicking a card leads to a page carrying the same mark. Gives
   13 case-study pages a hero visual without a single stock photo. */
const PF_WIRE = {
  mobileweb: `<rect x="118" y="16" width="64" height="112" rx="8"/><path d="M136 24h28" class="w-live"/><rect x="126" y="40" width="48" height="26" rx="3" opacity=".5"/><path d="M126 76h48M126 88h34M126 100h42" opacity=".45"/><rect x="20" y="34" width="76" height="76" rx="6" opacity=".35"/><path d="M30 48h44M30 60h56M30 72h38" opacity=".3"/><rect x="204" y="34" width="76" height="76" rx="6" opacity=".35"/><path d="M214 48h44M214 60h56M214 72h38" opacity=".3"/>`,
  fintech: `<rect x="20" y="20" width="104" height="60" rx="7"/><path d="M32 62h34" class="w-live"/><path d="M32 36h22" opacity=".5"/><path d="M150 116V78M176 116V58M202 116V88M228 116V46M254 116V66" opacity=".5"/><path d="M150 78l26-20 26 30 26-42 26 20" class="w-live" fill="none"/><path d="M20 116h260" opacity=".35"/><rect x="20" y="94" width="104" height="8" rx="4" opacity=".3"/>`,
  enterprise: `<rect x="20" y="20" width="260" height="108" rx="8" opacity=".45"/><path d="M20 44h260" opacity=".45"/><path d="M74 44v84" opacity=".45"/><path d="M32 58h30M32 72h30M32 86h30" opacity=".4"/><path d="M32 100h30" class="w-live"/><rect x="88" y="58" width="86" height="26" rx="4" opacity=".4"/><rect x="184" y="58" width="82" height="26" rx="4" class="w-live"/><rect x="88" y="94" width="178" height="22" rx="4" opacity=".4"/><circle cx="266" cy="32" r="4" opacity=".5"/>`,
  operations: `<rect x="18" y="20" width="82" height="108" rx="6" opacity=".4"/><rect x="109" y="20" width="82" height="108" rx="6" opacity=".4"/><rect x="200" y="20" width="82" height="108" rx="6" opacity=".4"/><rect x="28" y="34" width="62" height="20" rx="3" opacity=".55"/><rect x="28" y="60" width="62" height="20" rx="3" opacity=".35"/><rect x="119" y="34" width="62" height="20" rx="3" class="w-live"/><rect x="119" y="60" width="62" height="20" rx="3" opacity=".35"/><rect x="119" y="86" width="62" height="20" rx="3" opacity=".25"/><rect x="210" y="34" width="62" height="20" rx="3" opacity=".35"/><path d="M220 44l6 6 12-12" class="w-live"/>`,
  retail: `<rect x="18" y="20" width="170" height="108" rx="7" opacity=".45"/><rect x="30" y="32" width="46" height="34" rx="4" opacity=".45"/><rect x="84" y="32" width="46" height="34" rx="4" class="w-live"/><rect x="138" y="32" width="38" height="34" rx="4" opacity=".45"/><rect x="30" y="76" width="46" height="34" rx="4" opacity=".35"/><rect x="84" y="76" width="46" height="34" rx="4" opacity=".35"/><rect x="138" y="76" width="38" height="34" rx="4" opacity=".35"/><path d="M204 20h62v108l-10-8-10 8-10-8-10 8-11-8-11 8z" opacity=".45"/><path d="M216 40h38M216 54h38M216 68h24" opacity=".4"/><path d="M216 88h38" class="w-live"/>`,
};
function pfWire(cat){
  return `<div class="pf-hero-visual" aria-hidden="true" data-parallax="0.05" style="--par-amt:22px"><svg viewBox="0 0 300 148" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" preserveAspectRatio="xMidYMid meet">${PF_WIRE[cat]||PF_WIRE.enterprise}</svg></div>`;
}

function renderPortfolio(p, locale) {
    const t = UI[locale];
    const A = assetPrefix(locale);
    const N = '../';
    const urlFor = (loc) => `${ORIGIN}${seg(loc)}/portfolio/${p.slug}.html`;
    const url = urlFor(locale);
    const accent = p.accent || '#14A98D';
    const ogShort = p.tagline.length > 160 ? p.tagline.slice(0, 157) + '...' : p.tagline;

    const stats = p.stats.map((s) => `
                        <div class="stat-cell">
                            <div class="stat-cell-number">${esc(s.number)}</div>
                            <div class="stat-cell-label">${esc(s.label)}</div>
                        </div>`).join('');

    const features = p.features.map((f, i) => `
                        <div class="pf-feature-card">
                            <div class="pf-feature-mark">${String(i + 1).padStart(2, '0')}</div>
                            <h3>${esc(f.title)}</h3>
                            <p>${esc(f.desc)}</p>
                        </div>`).join('');

    const techChips = p.techStack.map((tch) => techChip(tch, A, 'pf-tech-chip')).join('');

    const useCases = p.useCases.map((u) =>
        `<li><svg class="pf-bullet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg><span>${esc(u)}</span></li>`).join('');

    const industries = p.industries.map((i) =>
        `<span class="pf-industry-chip">${esc(i)}</span>`).join('');

    const tags = p.tags.map((tg) =>
        `<span class="pf-tag">${esc(tg)}</span>`).join('');

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': ['Service', 'CreativeWork'],
        name: p.title,
        description: p.longDescription,
        inLanguage: META[locale].hreflang,
        provider: { '@type': 'Organization', name: 'Trion Creation Sdn Bhd', url: ORIGIN },
        areaServed: [{ '@type': 'Country', name: 'Malaysia' }, { '@type': 'Country', name: 'Singapore' }],
        url,
        keywords: [p.title, ...p.industries, ...p.useCases, ...p.tags, ...p.techStack].join(', ')
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: t.pf.home, item: `${ORIGIN}${seg(locale)}/` },
            { '@type': 'ListItem', position: 2, name: t.pf.portfolio, item: `${ORIGIN}${seg(locale)}/#portfolio` },
            { '@type': 'ListItem', position: 3, name: p.title, item: url }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: META[locale].hreflang,
        mainEntity: t.faqPf(p).map((qa) => ({
            '@type': 'Question',
            name: qa.q,
            acceptedAnswer: { '@type': 'Answer', text: qa.a }
        }))
    };

    const metaTitle = p.metaTitle || `${p.title} Development Malaysia | Trion Creation`;
    const metaDescription = p.metaDescription || `${p.longDescription.slice(0, 158)}${p.longDescription.length > 158 ? '...' : ''}`;
    const keywords = p.keywords || [
        p.title.toLowerCase() + ' malaysia',
        p.title.toLowerCase() + ' development malaysia',
        'custom ' + p.title.toLowerCase(),
        ...p.industries.map(i => i.toLowerCase() + ' software malaysia'),
        ...p.techStack.map(tc => tc.toLowerCase() + ' developer malaysia')
    ].join(', ');

    return `<!DOCTYPE html>
<html lang="${META[locale].htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escAttr(metaTitle)}</title>
    <meta name="description" content="${escAttr(metaDescription)}">
    <meta name="keywords" content="${escAttr(keywords)}">
    <meta name="author" content="Trion Creation Sdn Bhd">
    <link rel="canonical" href="${url}">
${hreflangBlock(urlFor)}
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escAttr(metaTitle)}">
    <meta property="og:description" content="${escAttr(ogShort)}">
    <meta property="og:image" content="${ORIGIN}/logo%20master%20-%20Trion-07%203.png">
    <meta property="og:locale" content="${META[locale].htmlLang.replace('-', '_')}">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">
${JSON.stringify(serviceSchema, null, 4)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 4)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(faqSchema, null, 4)}
    </script>
    <link rel="stylesheet" href="${A}styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${FONT_LINK}
    ${faviconLinks(A)}
    <link rel="manifest" href="${A}manifest.json">
        <meta name="theme-color" content="#07051A">
    <style>
        /* Page-specific accent color override */
        .pf-hero { --pf-accent: ${accent}; }
        .pf-section { --pf-accent: ${accent}; }
    </style>
</head>
<body>
    ${SKIP_LINK}
    <canvas id="trion-canvas" aria-hidden="true"></canvas>

    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="${N}index.html#home" class="logo">
                    ${logoPicture(A, { fetchpriority: 'high', decoding: 'async' })}
                </a>
                <nav class="main-nav">
                    <ul class="nav-list">
                        <li><a href="${N}index.html#home" class="nav-link">${t.nav.home}</a></li>
                        <li><a href="${N}index.html#about" class="nav-link">${t.nav.about}</a></li>
                        <li><a href="${N}index.html#services" class="nav-link">${t.nav.services}</a></li>
                        <li><a href="${N}index.html#portfolio" class="nav-link active">${t.nav.portfolio}</a></li>
                        <li><a href="${N}index.html#partnerships" class="nav-link">${t.nav.partnerships}</a></li>
                        <li><a href="${N}products.html" class="nav-link">${t.nav.products}</a></li>
                        <li><a href="${N}index.html#faq" class="nav-link">${t.nav.faq}</a></li>
                        <li><a href="${N}index.html#contact" class="nav-link">${t.nav.contact}</a></li>
                    </ul>
                </nav>
                <div class="header-actions">
                    ${langSwitcher(locale, urlFor)}
                    <a href="${N}index.html#contact" class="btn btn-primary">${t.getStarted}</a>
                </div>
                <button class="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <main class="main-content" id="main">
        <!-- ─── PORTFOLIO HERO with tech grid floor + scanline ─── -->
        <section class="pf-hero" style="--pf-gradient: ${p.gradient};">
            <div class="pf-grid-floor" aria-hidden="true"></div>
            <div class="pf-scanline" aria-hidden="true"></div>
            <div class="container">
                <div class="pf-hero-grid">
                <div class="pf-hero-copy">
                <div class="pf-breadcrumb">
                    <a href="${N}index.html">${t.pf.home}</a>
                    <span class="pf-breadcrumb-sep">›</span>
                    <a href="${N}index.html#portfolio">${t.pf.portfolio}</a>
                    <span class="pf-breadcrumb-sep">›</span>
                    <span>${esc(p.title)}</span>
                </div>
                <div class="pf-eyebrow" data-scramble>${t.pf.solution} · ${esc(p.categoryLabel.toUpperCase())}</div>
                <h1 class="pf-title" data-split>${esc(p.title)}</h1>
                <p class="pf-tagline">${esc(p.tagline)}</p>
                <div class="pf-tag-row">${tags}</div>
                <div class="pf-stats">${stats}
                </div>
                <div class="pf-cta-row">
                    <a href="${N}index.html#contact" class="btn btn-primary" data-magnetic="0.2">${t.pf.discuss}</a>
                    <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20a%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">${t.whatsapp}</a>
                </div>
                </div>
                ${pfWire(p.category)}
                </div>
            </div>
        </section>

        <!-- ─── OVERVIEW ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">01</span>
                    <h2 data-clip>${t.pf.overview}</h2>
                </div>
                <p class="pf-prose">${esc(p.longDescription)}</p>
            </div>
        </section>

        <!-- ─── KEY FEATURES ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">02</span>
                    <h2 data-clip>${t.pf.keyFeatures}</h2>
                </div>
                <div class="pf-features-grid">${features}
                </div>
            </div>
        </section>

        <!-- ─── TECH STACK ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">03</span>
                    <h2 data-clip>${t.pf.builtWith}</h2>
                </div>
                <p class="pf-prose-muted">${t.pf.builtWithProse}</p>
                <div class="pf-tech-chips">${techChips}</div>
            </div>
        </section>

        <!-- ─── USE CASES ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">04</span>
                    <h2 data-clip>${t.pf.useCases}</h2>
                </div>
                <div class="pf-usecase-cols">
                    <div>
                        <h4 class="pf-sub-head">${t.pf.perfectFor}</h4>
                        <ul class="pf-usecase-list">${useCases}</ul>
                    </div>
                    <div>
                        <h4 class="pf-sub-head">${t.pf.industries}</h4>
                        <div class="pf-industry-chips">${industries}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ─── CTA ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-cta-card">
                    <div class="pf-cta-grid" aria-hidden="true"></div>
                    <div class="pf-cta-content">
                        <div class="pf-eyebrow" style="color: var(--void-0);">${t.pf.readyToBuild}</div>
                        <h2 data-clip>${esc(t.pf.ctaTitle(p.title))}</h2>
                        <p>${esc(t.pf.ctaBody)}</p>
                        <div class="pf-cta-row" style="margin-top: 2rem;">
                            <a href="${N}index.html#contact" class="btn btn-secondary" style="background: var(--void-0); color: var(--text-100); border-color: rgba(255,255,255,0.3);">${t.bookCall}</a>
                            <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20a%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="background: transparent; color: var(--void-0); border-color: var(--void-0);">${t.whatsapp}</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
${faqSection(t.faqPf(p), t, { eyebrow: 'COMMON QUESTIONS' })}
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="logo">${logoPicture(A, { loading: 'lazy', decoding: 'async' })}</div>
                    <p>${t.footer.tagline}</p>
                </div>
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>${t.footer.portfolioH}</h4>
                        <ul>
                            <li><a href="${N}index.html#portfolio">${t.footer.allSolutions}</a></li>
                            <li><a href="${N}projects/yippi.html">${t.footer.yippi}</a></li>
                            <li><a href="${N}projects/colorverse.html">Colorverse</a></li>
                            <li><a href="${N}projects/dddrive.html">DDDrive</a></li>
                            <li><a href="${N}products.html">${t.nav.products}</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>${t.footer.companyH}</h4>
                        <ul>
                            <li><a href="${N}index.html#about">${t.footer.about}</a></li>
                            <li><a href="${N}index.html#services">${t.footer.servicesH}</a></li>
                            <li><a href="${N}index.html#contact">${t.footer.contact}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <span class="year-now">${new Date().getFullYear()}</span> Trion Creation Sdn Bhd. ${t.footer.rights}</p>
            </div>
        </div>
    </footer>

    <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20a%20${encodeURIComponent(p.title)}" class="whatsapp-button" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    </a>

    <script src="${A}script.js"></script>
    <script src="${A}futuristic.js"></script>
    <script src="${A}scroll.js"></script>
</body>
</html>
`;
}

// ────────────────────────────────────────────────────────────
//  PRODUCTS HUB — apps Trion builds, owns and publishes itself,
//  as opposed to the client case studies above. Lives at the SAME
//  directory depth as index.html for its locale (site root, /zh,
//  or /ms) — NOT one level deep like services/portfolio pages —
//  so same-locale links need no "../" prefix, only shared assets
//  (images/, styles.css, logo) reach one level up on zh/ms.
// ────────────────────────────────────────────────────────────
function renderProductsHub(products, locale) {
    const t = UI[locale];
    const A = META[locale].dir ? '../' : '';
    const urlFor = (loc) => `${ORIGIN}${seg(loc)}/products.html`;
    const url = urlFor(locale);

    const cards = products.map((p) => {
        // A product may have no detail page and no store listing yet. In that
        // case the card is not a link — an anchor to nowhere is worse than
        // plain content, for both pointer and keyboard users.
        const hasLink = Boolean(p.url || p.storeUrl);
        const productUrl = p.url ? `${ORIGIN}/${p.url}` : (p.storeUrl || '');
        const statusTag = p.status === 'live' ? t.prod.live : t.prod.comingSoon;
        const tags = [statusTag, ...(p.tags || [])].map((tg) => `<span class="tag">${esc(tg)}</span>`).join('');
        return `
                    <${hasLink ? 'a' : 'div'} class="portfolio-item prod-card${hasLink ? '' : ' is-static'}"${hasLink ? ` href="${productUrl}" aria-label="${escAttr(t.prod.view)}: ${escAttr(p.name)}"` : ''} style="--card-accent: ${p.accent || 'var(--holo-cyan)'};">
                        <div class="pi-visual prod-visual">
${p.icon ? `                            <div class="prod-icon">${picture(p.icon, A, { alt: `${p.name} icon`, sizes: '72px', loading: 'lazy', decoding: 'async' })}</div>` : ''}
${(p.shots && p.shots.length) ? `                            <div class="prod-shots" aria-hidden="true">${p.shots.slice(0,3).map((sh) => picture(sh, A, { alt: '', sizes: '120px', loading: 'lazy', decoding: 'async' })).join('')}</div>` : ''}
                        </div>
                        <div class="pi-body">
                                <h3>${esc(p.name)}</h3>
                                <p>${esc(p.tagline)}</p>
                                <div class="portfolio-tags">${tags}</div>
${hasLink
                                    ? `                                <span class="pi-cta">${esc(t.prod.view)}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>`
                                    : ''}
                            </div>
                    </${hasLink ? 'a' : 'div'}>`;
    }).join('');

    const collectionSchema = {
        '@context': 'https://schema.org', '@type': 'CollectionPage',
        name: t.prod.title, description: t.prod.subtitle, url, inLanguage: META[locale].hreflang,
        isPartOf: { '@type': 'WebSite', url: ORIGIN, name: 'Trion Creation Sdn Bhd' },
    };
    const itemListSchema = {
        '@context': 'https://schema.org', '@type': 'ItemList',
        itemListElement: products.map((p, i) => ({
            '@type': 'ListItem', position: i + 1,
            item: {
                '@type': 'SoftwareApplication', name: p.name,
                url: p.url ? `${ORIGIN}/${p.url}` : (p.storeUrl || `${ORIGIN}/products.html`),
                description: p.description, applicationCategory: p.category,
                operatingSystem: p.platforms.join(', '), image: `${ORIGIN}/${p.icon || (p.shots && p.shots[0]) || 'images/icons/favicon-512.png'}`,
            },
        })),
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: t.prod.home, item: `${ORIGIN}${seg(locale)}/` },
            { '@type': 'ListItem', position: 2, name: t.prod.title, item: url },
        ],
    };

    const faqSchemaProd = {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        inLanguage: META[locale].hreflang,
        mainEntity: t.faqProd(products).map((qa) => ({
            '@type': 'Question', name: qa.q,
            acceptedAnswer: { '@type': 'Answer', text: qa.a },
        })),
    };

    const metaTitle = `${t.prod.title} | Trion Creation`;

    return `<!DOCTYPE html>
<html lang="${META[locale].htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escAttr(metaTitle)}</title>
    <meta name="description" content="${escAttr(t.prod.subtitle)}">
    <meta name="author" content="Trion Creation Sdn Bhd">
    <link rel="canonical" href="${url}">
${hreflangBlock(urlFor)}
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escAttr(metaTitle)}">
    <meta property="og:description" content="${escAttr(t.prod.subtitle)}">
    <meta property="og:image" content="${ORIGIN}/images/banners/banner-products.jpg">
    <meta property="og:locale" content="${META[locale].htmlLang.replace('-', '_')}">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">
${JSON.stringify(collectionSchema, null, 4)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(itemListSchema, null, 4)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(breadcrumbSchema, null, 4)}
    </script>
    <script type="application/ld+json">
${JSON.stringify(faqSchemaProd, null, 4)}
    </script>
    <link rel="stylesheet" href="${A}styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    ${FONT_LINK}
    ${faviconLinks(A)}
    <link rel="manifest" href="${A}manifest.json">
        <meta name="theme-color" content="#07051A">
</head>
<body>
    ${SKIP_LINK}
    <canvas id="trion-canvas" aria-hidden="true"></canvas>

    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="index.html#home" class="logo">
                    ${logoPicture(A, { fetchpriority: 'high', decoding: 'async' })}
                </a>
                <nav class="main-nav">
                    <ul class="nav-list">
                        <li><a href="index.html#home" class="nav-link">${t.nav.home}</a></li>
                        <li><a href="index.html#about" class="nav-link">${t.nav.about}</a></li>
                        <li><a href="index.html#services" class="nav-link">${t.nav.services}</a></li>
                        <li><a href="index.html#portfolio" class="nav-link">${t.nav.portfolio}</a></li>
                        <li><a href="index.html#partnerships" class="nav-link">${t.nav.partnerships}</a></li>
                        <li><a href="products.html" class="nav-link active">${t.nav.products}</a></li>
                        <li><a href="index.html#faq" class="nav-link">${t.nav.faq}</a></li>
                        <li><a href="index.html#contact" class="nav-link">${t.nav.contact}</a></li>
                    </ul>
                </nav>
                <div class="header-actions">
                    ${langSwitcher(locale, urlFor)}
                    <a href="index.html#contact" class="btn btn-primary">${t.getStarted}</a>
                </div>
                <button class="mobile-menu-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </header>

    <main class="main-content" id="main">
        <!-- ─── PRODUCTS HERO — same system as the service and case-study pages ─── -->
        <section class="pf-hero prod-hero" style="--pf-gradient: linear-gradient(150deg, rgba(232,196,95,0.24) 0%, rgba(7,5,26,0.92) 58%, rgba(20,169,141,0.26) 100%);">
            <div class="pf-grid-floor" aria-hidden="true"></div>
            <div class="pf-scanline" aria-hidden="true"></div>
            <div class="container">
                <div class="pf-hero-copy prod-hero-copy">
                    <div class="pf-breadcrumb" data-scramble-group>
                        <a href="${A}index.html">${t.prod.home}</a>
                        <span class="pf-breadcrumb-sep">›</span>
                        <span>${esc(t.prod.title)}</span>
                    </div>
                    <div class="pf-eyebrow" data-scramble>${escAttr(t.prod.eyebrow)}</div>
                    <h1 class="pf-title" data-split>${esc(t.prod.title)}</h1>
                    <p class="pf-tagline">${esc(t.prod.subtitle)}</p>
                </div>
            </div>
        </section>

        <section class="pf-section">
            <div class="container">
                <div class="portfolio-grid prod-grid" data-reveal-group>${cards}
                </div>
            </div>
        </section>
${faqSection(t.faqProd(products), t, { eyebrow: 'ABOUT OUR PRODUCTS' })}
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="logo">${logoPicture(A, { loading: 'lazy', decoding: 'async' })}</div>
                    <p>${t.footer.tagline}</p>
                </div>
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>${t.footer.portfolioH}</h4>
                        <ul>
                            <li><a href="index.html#portfolio">${t.footer.allSolutions}</a></li>
                            <li><a href="projects/yippi.html">${t.footer.yippi}</a></li>
                            <li><a href="projects/colorverse.html">Colorverse</a></li>
                            <li><a href="projects/dddrive.html">DDDrive</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>${t.footer.companyH}</h4>
                        <ul>
                            <li><a href="index.html#about">${t.footer.about}</a></li>
                            <li><a href="index.html#services">${t.footer.servicesH}</a></li>
                            <li><a href="index.html#contact">${t.footer.contact}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <span class="year-now">${new Date().getFullYear()}</span> Trion Creation Sdn Bhd. ${t.footer.rights}</p>
            </div>
        </div>
    </footer>

    <script src="${A}script.js"></script>
    <script src="${A}futuristic.js"></script>
    <script src="${A}scroll.js"></script>
</body>
</html>
`;
}

// ────────────────────────────────────────────────────────────
//  BUILD: generate pages for every locale
// ────────────────────────────────────────────────────────────
let totalSvc = 0, totalPf = 0;
const slugs = { services: null, portfolio: null };

for (const locale of LOCALES) {
    const services = loadData('services', locale);
    const portfolio = loadData('portfolio', locale);
    if (locale === 'en') {
        slugs.services = services.map((s) => s.slug);
        slugs.portfolio = portfolio.map((p) => p.slug);
    }

    const baseDir = META[locale].dir ? path.join(ROOT, META[locale].dir) : ROOT;
    const svcDir = path.join(baseDir, 'services');
    const pfDir = path.join(baseDir, 'portfolio');
    fs.mkdirSync(svcDir, { recursive: true });
    fs.mkdirSync(pfDir, { recursive: true });

    for (const s of services) {
        fs.writeFileSync(path.join(svcDir, `${s.slug}.html`), renderService(s, locale), 'utf8');
        totalSvc += 1;
    }
    for (const p of portfolio) {
        fs.writeFileSync(path.join(pfDir, `${p.slug}.html`), renderPortfolio(p, locale), 'utf8');
        totalPf += 1;
    }

    const products = loadData('products', locale);
    fs.writeFileSync(path.join(baseDir, 'products.html'), renderProductsHub(products, locale), 'utf8');

    console.log(`  ✓ [${locale}] ${services.length} services, ${portfolio.length} portfolio, ${products.length} products`);
}
console.log(`Generated ${totalSvc} service + ${totalPf} portfolio pages across ${LOCALES.length} locales.`);

// ────────────────────────────────────────────────────────────
//  Rebuild sitemap.xml with per-language URLs + hreflang alternates
// ────────────────────────────────────────────────────────────
{
    const projectSlugs = fs.existsSync(path.join(ROOT, 'projects'))
        ? fs.readdirSync(path.join(ROOT, 'projects')).filter((f) => f.endsWith('.html')).map((f) => f.replace(/\.html$/, ''))
        : [];

    // Each "group" is one logical page that exists in all 3 languages.
    const groups = [];
    groups.push({ pathFor: (loc) => `${seg(loc)}/`, changefreq: 'weekly', priority: '1.0' });
    groups.push({ pathFor: (loc) => `${seg(loc)}/products.html`, changefreq: 'weekly', priority: '0.9' });
    for (const slug of slugs.services) groups.push({ pathFor: (loc) => `${seg(loc)}/services/${slug}.html`, changefreq: 'monthly', priority: '0.8' });
    for (const slug of slugs.portfolio) groups.push({ pathFor: (loc) => `${seg(loc)}/portfolio/${slug}.html`, changefreq: 'monthly', priority: '0.7' });
    // A project page only gets a locale's entry (and hreflang alternate) if that
    // locale's file actually exists. Emitting zh/ms URLs for a page that was never
    // translated puts 404s straight into the sitemap and a broken hreflang cluster
    // in Search Console — which is exactly what happened to projects/cadence.html.
    for (const slug of projectSlugs) {
        const locales = LOCALES.filter((loc) => {
            const dir = META[loc].dir ? path.join(ROOT, META[loc].dir) : ROOT;
            return fs.existsSync(path.join(dir, 'projects', `${slug}.html`));
        });
        groups.push({ pathFor: (loc) => `${seg(loc)}/projects/${slug}.html`, changefreq: 'monthly', priority: '0.7', locales });
    }

    // English-only homepage section anchors (deep-link hints for search).
    const anchors = [
        ['#about', '0.8'], ['#services', '0.9'], ['#portfolio', '0.8'],
        ['#partnerships', '0.7'], ['#faq', '0.7'], ['#contact', '0.8'],
    ];

    const urlBlock = (group) => {
        const locs = group.locales || LOCALES;
        const alts = locs.map((loc) =>
            `        <xhtml:link rel="alternate" hreflang="${META[loc].hreflang}" href="${ORIGIN}${group.pathFor(loc)}"/>`).join('\n')
            + `\n        <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${group.pathFor('en')}"/>`;
        return locs.map((loc) => `    <url>
        <loc>${ORIGIN}${group.pathFor(loc)}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${group.changefreq}</changefreq>
        <priority>${group.priority}</priority>
${alts}
    </url>`).join('\n');
    };

    const anchorBlock = ([hash, priority]) => `    <url>
        <loc>${ORIGIN}/${hash}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${priority}</priority>
    </url>`;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

${groups.map(urlBlock).join('\n\n')}

${anchors.map(anchorBlock).join('\n')}
</urlset>
`;
    fs.writeFileSync(SITEMAP, sitemap, 'utf8');
    console.log(`Rebuilt sitemap.xml (${groups.length * LOCALES.length + anchors.length} URLs, lastmod → ${today}).`);
}

// ─── Refresh llms.txt + llms-full.txt date stamps ───
function bumpDate(file) {
    if (!fs.existsSync(file)) return;
    let txt = fs.readFileSync(file, 'utf8');
    txt = txt.replace(/last updated:\s*\d{4}-\d{2}-\d{2}/gi, `last updated: ${today}`);
    txt = txt.replace(/This file last updated:\s*\d{4}-\d{2}-\d{2}/gi, `This file last updated: ${today}`);
    fs.writeFileSync(file, txt, 'utf8');
    console.log(`Refreshed ${path.basename(file)}.`);
}
bumpDate(LLMS);
bumpDate(LLMS_FULL);

// ─── Update llms.txt service list (regenerate the "## Services" section) ───
{
    if (fs.existsSync(LLMS)) {
        const services = loadData('services', 'en');
        let txt = fs.readFileSync(LLMS, 'utf8');
        const lines = services.map((s) => {
            const url = `${ORIGIN}/services/${s.slug}.html`;
            return `- [${s.title}](${url}): ${s.tagline}`;
        }).join('\n');
        const block = `## Services\n\n${lines}\n`;
        txt = txt.replace(/## Services[\s\S]*?(?=\n## )/m, block + '\n');
        fs.writeFileSync(LLMS, txt, 'utf8');
        console.log('Refreshed llms.txt services list.');
    }
}

// ─── Sync the home-page FAQ (visible accordion + FAQPage schema) ───
/* index.html is hand-authored, and its visible Q&A and its JSON-LD had
   drifted apart — different wording, two questions present only in the
   schema, and the zh/ms pages shipping the English schema against
   translated copy. Both halves are now written from scripts/home-faq.json
   on every build, so they cannot disagree again. */
const HOME_FAQ = JSON.parse(fs.readFileSync(path.join(__dirname, 'home-faq.json'), 'utf8'));
{
    let synced = 0;
    for (const locale of LOCALES) {
        const file = path.join(ROOT, META[locale].dir, 'index.html');
        if (!fs.existsSync(file)) continue;
        const items = HOME_FAQ[locale];
        if (!items || !items.length) continue;
        let h = fs.readFileSync(file, 'utf8');
        const before = h;

        const chev = '<svg class="faq-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
        const rows = items.map((qa, i) => `
                    <details class="faq-item"${i === 0 ? ' open' : ''}>
                        <summary class="faq-q">
                            <span>${esc(qa.q)}</span>
                            ${chev}
                        </summary>
                        <div class="faq-a"><p>${esc(qa.a)}</p></div>
                    </details>`).join('');

        const gridRe = /(<div class="faq-grid">)[\s\S]*?(\n\s*<\/div>\n\s*<div style="text-align:center;)/;
        if (!gridRe.test(h)) { console.log(`  ! ${locale}/index.html: FAQ grid not found, skipped`); continue; }
        h = h.replace(gridRe, (m, open, tail) => open + rows + tail);

        let wrote = false;
        h = h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (full, json) => {
            let j; try { j = JSON.parse(json); } catch (e) { return full; }
            if (j['@type'] !== 'FAQPage') return full;
            j.inLanguage = META[locale].hreflang;
            j.mainEntity = items.map((qa) => ({
                '@type': 'Question', name: qa.q,
                acceptedAnswer: { '@type': 'Answer', text: qa.a },
            }));
            wrote = true;
            return '<script type="application/ld+json">\n' + JSON.stringify(j, null, 4) + '\n    </script>';
        });
        if (!wrote) { console.log(`  ! ${locale}/index.html: no FAQPage block, skipped`); continue; }

        if (h !== before) fs.writeFileSync(file, h, 'utf8');
        synced++;
    }
    console.log(`Synced home-page FAQ on ${synced} locale(s) (${HOME_FAQ.en.length} Q&A each).`);
}

// ─── Regenerate the FAQ section of llms-full.txt ───
/* The 546 Q&As on the site are its strongest answer-engine asset, and
   llms-full.txt is what an LLM crawler reads instead of 91 pages. Both
   are generated from UI.faq* here, so the text file cannot drift away
   from what the pages actually say. */
{
    if (fs.existsSync(LLMS_FULL)) {
        const t = UI.en;
        const services = loadData('services', 'en');
        const portfolio = loadData('portfolio', 'en');
        const products = loadData('products', 'en');

        const qa = (pairs) => pairs.map((p) => `**Q: ${p.q}**\nA: ${p.a}`).join('\n\n');
        const parts = [];

        parts.push('## Frequently asked questions\n');
        parts.push('### General\n');
        parts.push(qa(HOME_FAQ.en) + '\n');

        parts.push('### About our products\n');
        parts.push(qa(t.faqProd(products)) + '\n');

        parts.push('### By service\n');
        for (const s of services) {
            parts.push(`#### ${s.title}\n`);
            parts.push(qa(t.faqSvc(s)) + '\n');
        }

        parts.push('### By solution\n');
        for (const p of portfolio) {
            parts.push(`#### ${p.title}\n`);
            parts.push(qa(t.faqPf(p)) + '\n');
        }

        const block = parts.join('\n');
        let txt = fs.readFileSync(LLMS_FULL, 'utf8');
        if (/\n## Frequently asked questions[\s\S]*?(?=\n## )/.test(txt)) {
            txt = txt.replace(/\n## Frequently asked questions[\s\S]*?(?=\n## )/, '\n' + block);
        } else {
            // insert before the trailing "## Update info" block
            txt = txt.replace(/\n## Update info/, '\n' + block + '\n## Update info');
        }
        fs.writeFileSync(LLMS_FULL, txt, 'utf8');
        const n = (block.match(/\*\*Q: /g) || []).length;
        console.log('Refreshed llms-full.txt FAQ section (' + n + ' Q&A).');
    }
}

console.log('\nDone.');
