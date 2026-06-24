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

    const features = s.features.map((f) =>
        `                            <li style="padding: var(--space-3) 0; border-bottom: 1px solid var(--glass-border); color: var(--text-200);"><span style="color: var(--holo-cyan); margin-right: var(--space-2);">▸</span> ${esc(f)}</li>`
    ).join('\n');

    const overview = s.overview.map((p) =>
        `                        <p style="margin-bottom: var(--space-4); line-height: 1.8; color: var(--text-200);">${esc(p)}</p>`
    ).join('\n');

    const expertise = s.expertise.map((e) => `
                        <div>
                            <h4 style="color: var(--holo-cyan); margin-bottom: var(--space-2); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.95rem;">${esc(e.title)}</h4>
                            <p style="color: var(--text-300);">${esc(e.desc)}</p>
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="${A}trion-favicon.png">
    <link rel="manifest" href="${A}manifest.json">
    <meta name="theme-color" content="#07051A">
</head>
<body>
    <canvas id="trion-canvas" aria-hidden="true"></canvas>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="${N}index.html#home" class="logo">
                    <img src="${A}logo master - Trion-07 3.png" alt="Trion Creation">
                </a>
                <nav class="main-nav">
                    <ul class="nav-list">
                        <li><a href="${N}index.html#home" class="nav-link">${t.nav.home}</a></li>
                        <li><a href="${N}index.html#about" class="nav-link">${t.nav.about}</a></li>
                        <li><a href="${N}index.html#services" class="nav-link active">${t.nav.services}</a></li>
                        <li><a href="${N}index.html#portfolio" class="nav-link">${t.nav.portfolio}</a></li>
                        <li><a href="${N}index.html#partnerships" class="nav-link">${t.nav.partnerships}</a></li>
                        <li><a href="${N}index.html#tech-stack" class="nav-link">${t.nav.techStack}</a></li>
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

    <main class="main-content">
        <section class="page-header with-banner" style="background-image: linear-gradient(135deg, rgba(123,91,255,0.4), rgba(0,240,255,0.25)), url('${A}images/services/${escAttr(s.image)}'); background-size: cover; background-position: center;">
            <div class="container">
                <div style="font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.2em; color: var(--holo-cyan); margin-bottom: var(--space-4); text-transform: uppercase;">
                    <a href="${N}index.html" style="color: var(--text-200);">${t.svc.home}</a> <span style="opacity: 0.5;">/</span>
                    <a href="${N}index.html#services" style="color: var(--text-200);">${t.svc.services}</a> <span style="opacity: 0.5;">/</span>
                    <span>${esc(s.title)}</span>
                </div>
                <h1>${esc(s.title)}</h1>
                <p>${esc(s.tagline)}</p>
            </div>
        </section>

        <section style="padding: var(--space-20) 0;">
            <div class="container">
                <div style="max-width: 1080px; margin: 0 auto;">
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-12); margin-bottom: var(--space-16); align-items: start;">
                        <div>
                            <h2 style="margin-bottom: var(--space-6);">${t.svc.overview}</h2>
${overview}
                        </div>
                        <div style="padding: var(--space-8); background: var(--grad-card); border: 1px solid var(--glass-border); border-radius: var(--radius-xl); backdrop-filter: blur(10px) saturate(130%);">
                            <h3 style="margin-bottom: var(--space-5); color: var(--holo-cyan); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.95rem;">${t.svc.keyFeatures}</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
${features}
                            </ul>
                        </div>
                    </div>

                    <div style="padding: var(--space-12); background: var(--grad-card); border: 1px solid var(--glass-border); border-radius: var(--radius-xl); backdrop-filter: blur(10px) saturate(130%); margin-bottom: var(--space-16);">
                        <h2 style="margin-bottom: var(--space-8);">${t.svc.expertise}</h2>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-8);">${expertise}
                        </div>
                    </div>

                    <div style="text-align: center; padding: var(--space-16) var(--space-8); background: var(--grad-holo); border-radius: var(--radius-2xl); color: var(--void-0); position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2), transparent 60%); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <h2 style="color: var(--void-0); margin-bottom: var(--space-4);">${esc(t.svc.ctaTitle(s.title))}</h2>
                            <p style="color: rgba(7,5,26,0.85); margin-bottom: var(--space-8); font-size: 1.1rem; max-width: 600px; margin-left: auto; margin-right: auto;">${esc(t.svc.ctaBody)}</p>
                            <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap;">
                                <a href="${N}index.html#contact" class="btn btn-secondary">${t.bookCall}</a>
                                <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(s.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">${t.whatsapp}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="logo"><img src="${A}logo master - Trion-07 3.png" alt="Trion Creation"></div>
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

// ────────────────────────────────────────────────────────────
//  PORTFOLIO PAGE RENDERER
// ────────────────────────────────────────────────────────────
function renderPortfolio(p, locale) {
    const t = UI[locale];
    const A = assetPrefix(locale);
    const N = '../';
    const urlFor = (loc) => `${ORIGIN}${seg(loc)}/portfolio/${p.slug}.html`;
    const url = urlFor(locale);
    const accent = p.accent || '#00F0FF';
    const ogShort = p.tagline.length > 160 ? p.tagline.slice(0, 157) + '...' : p.tagline;

    const stats = p.stats.map((s) => `
                        <div class="stat-cell">
                            <div class="stat-cell-number">${esc(s.number)}</div>
                            <div class="stat-cell-label">${esc(s.label)}</div>
                        </div>`).join('');

    const features = p.features.map((f) => `
                        <div class="pf-feature-card">
                            <div class="pf-feature-mark">▸</div>
                            <h3>${esc(f.title)}</h3>
                            <p>${esc(f.desc)}</p>
                        </div>`).join('');

    const techChips = p.techStack.map((tch) =>
        `<span class="pf-tech-chip">${esc(tch)}</span>`).join('');

    const useCases = p.useCases.map((u) =>
        `<li><span class="pf-bullet">◇</span> ${esc(u)}</li>`).join('');

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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="${A}trion-favicon.png">
    <link rel="manifest" href="${A}manifest.json">
    <meta name="theme-color" content="#07051A">
    <style>
        /* Page-specific accent color override */
        .pf-hero { --pf-accent: ${accent}; }
        .pf-section { --pf-accent: ${accent}; }
    </style>
</head>
<body>
    <canvas id="trion-canvas" aria-hidden="true"></canvas>

    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="${N}index.html#home" class="logo">
                    <img src="${A}logo master - Trion-07 3.png" alt="Trion Creation">
                </a>
                <nav class="main-nav">
                    <ul class="nav-list">
                        <li><a href="${N}index.html#home" class="nav-link">${t.nav.home}</a></li>
                        <li><a href="${N}index.html#about" class="nav-link">${t.nav.about}</a></li>
                        <li><a href="${N}index.html#services" class="nav-link">${t.nav.services}</a></li>
                        <li><a href="${N}index.html#portfolio" class="nav-link active">${t.nav.portfolio}</a></li>
                        <li><a href="${N}index.html#partnerships" class="nav-link">${t.nav.partnerships}</a></li>
                        <li><a href="${N}index.html#tech-stack" class="nav-link">${t.nav.techStack}</a></li>
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

    <main class="main-content">
        <!-- ─── PORTFOLIO HERO with tech grid floor + scanline ─── -->
        <section class="pf-hero" style="--pf-gradient: ${p.gradient};">
            <div class="pf-grid-floor" aria-hidden="true"></div>
            <div class="pf-scanline" aria-hidden="true"></div>
            <div class="container">
                <div class="pf-breadcrumb">
                    <a href="${N}index.html">${t.pf.home}</a>
                    <span class="pf-breadcrumb-sep">›</span>
                    <a href="${N}index.html#portfolio">${t.pf.portfolio}</a>
                    <span class="pf-breadcrumb-sep">›</span>
                    <span>${esc(p.title)}</span>
                </div>
                <div class="pf-eyebrow">${t.pf.solution} · ${esc(p.categoryLabel.toUpperCase())}</div>
                <h1 class="pf-title">${esc(p.title)}</h1>
                <p class="pf-tagline">${esc(p.tagline)}</p>
                <div class="pf-tag-row">${tags}</div>
                <div class="pf-stats">${stats}
                </div>
                <div class="pf-cta-row">
                    <a href="${N}index.html#contact" class="btn btn-primary">${t.pf.discuss}</a>
                    <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20a%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">${t.whatsapp}</a>
                </div>
            </div>
        </section>

        <!-- ─── OVERVIEW ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">01</span>
                    <h2>${t.pf.overview}</h2>
                </div>
                <p class="pf-prose">${esc(p.longDescription)}</p>
            </div>
        </section>

        <!-- ─── KEY FEATURES ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">02</span>
                    <h2>${t.pf.keyFeatures}</h2>
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
                    <h2>${t.pf.builtWith}</h2>
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
                    <h2>${t.pf.useCases}</h2>
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
                        <h2>${esc(t.pf.ctaTitle(p.title))}</h2>
                        <p>${esc(t.pf.ctaBody)}</p>
                        <div class="pf-cta-row" style="margin-top: 2rem;">
                            <a href="${N}index.html#contact" class="btn btn-secondary" style="background: var(--void-0); color: var(--text-100); border-color: rgba(255,255,255,0.3);">${t.bookCall}</a>
                            <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20a%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="background: transparent; color: var(--void-0); border-color: var(--void-0);">${t.whatsapp}</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="logo"><img src="${A}logo master - Trion-07 3.png" alt="Trion Creation"></div>
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
    console.log(`  ✓ [${locale}] ${services.length} services, ${portfolio.length} portfolio pages`);
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
    for (const slug of slugs.services) groups.push({ pathFor: (loc) => `${seg(loc)}/services/${slug}.html`, changefreq: 'monthly', priority: '0.8' });
    for (const slug of slugs.portfolio) groups.push({ pathFor: (loc) => `${seg(loc)}/portfolio/${slug}.html`, changefreq: 'monthly', priority: '0.7' });
    for (const slug of projectSlugs) groups.push({ pathFor: (loc) => `${seg(loc)}/projects/${slug}.html`, changefreq: 'monthly', priority: '0.7' });

    // English-only homepage section anchors (deep-link hints for search).
    const anchors = [
        ['#about', '0.8'], ['#services', '0.9'], ['#portfolio', '0.8'],
        ['#partnerships', '0.7'], ['#tech-stack', '0.7'], ['#faq', '0.7'], ['#contact', '0.8'],
    ];

    const urlBlock = (group) => {
        const alts = LOCALES.map((loc) =>
            `        <xhtml:link rel="alternate" hreflang="${META[loc].hreflang}" href="${ORIGIN}${group.pathFor(loc)}"/>`).join('\n')
            + `\n        <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${group.pathFor('en')}"/>`;
        return LOCALES.map((loc) => `    <url>
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

console.log('\nDone.');
