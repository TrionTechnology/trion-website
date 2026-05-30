#!/usr/bin/env node
/**
 * Trion Creation — site builder
 * ─────────────────────────────────────────────────────────────────────
 * • Generates services/<slug>.html for every entry in services.json
 * • Refreshes <lastmod> dates in sitemap.xml to today
 * • Refreshes "last updated" line in llms.txt / llms-full.txt
 *
 * Idempotent: re-running on an unchanged source is a no-op
 * (except for the lastmod dates).
 *
 * Usage:  node scripts/build-site.js
 *         npm run build
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SERVICES_JSON = path.join(__dirname, 'services.json');
const PORTFOLIO_JSON = path.join(__dirname, 'portfolio.json');
const SERVICES_DIR = path.join(ROOT, 'services');
const PORTFOLIO_DIR = path.join(ROOT, 'portfolio');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const LLMS = path.join(ROOT, 'llms.txt');
const LLMS_FULL = path.join(ROOT, 'llms-full.txt');

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const services = JSON.parse(fs.readFileSync(SERVICES_JSON, 'utf8'));
const portfolio = JSON.parse(fs.readFileSync(PORTFOLIO_JSON, 'utf8'));

if (!fs.existsSync(PORTFOLIO_DIR)) fs.mkdirSync(PORTFOLIO_DIR, { recursive: true });

// ─── helpers ───
const esc = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');

function renderService(s) {
    const url = `https://trioncreation.com/services/${s.slug}.html`;
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
        name: `${s.title} Malaysia`,
        description: s.schemaDescription,
        provider: {
            '@type': 'Organization',
            name: 'Trion Creation Sdn Bhd',
            url: 'https://trioncreation.com',
            logo: 'https://trioncreation.com/logo%20master%20-%20Trion-07%203.png'
        },
        areaServed: [
            { '@type': 'Country', name: 'Malaysia' },
            { '@type': 'Country', name: 'Singapore' },
            { '@type': 'Country', name: 'Thailand' },
            { '@type': 'Country', name: 'Indonesia' }
        ],
        url,
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
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trioncreation.com/' },
            { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://trioncreation.com/#services' },
            { '@type': 'ListItem', position: 3, name: s.title, item: url }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `How long does ${s.title.toLowerCase()} typically take with Trion Creation?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Most ${s.title.toLowerCase()} projects fall into one of three bands. MVPs typically take 6–12 weeks. Mid-size systems take 3–4 months. Enterprise platforms can take 3–6 months depending on integrations and compliance requirements. We give a fixed timeline after the free discovery call.`
                }
            },
            {
                '@type': 'Question',
                name: `What does ${s.title.toLowerCase()} cost in Malaysia?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `For ${s.title.toLowerCase()}, Trion Creation projects typically range from RM${s.priceMin.toLocaleString('en-US')} for smaller scoped builds to RM${s.priceMax.toLocaleString('en-US')}+ for enterprise platforms. Fixed-scope quote provided after a discovery call — no hidden costs.`
                }
            }
        ]
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escAttr(s.metaTitle)}</title>
    <meta name="description" content="${escAttr(s.metaDescription)}">
    <meta name="keywords" content="${escAttr(s.keywords)}">
    <meta name="author" content="Trion Creation Sdn Bhd">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escAttr(s.metaTitle)}">
    <meta property="og:description" content="${escAttr(s.ogShort)}">
    <meta property="og:image" content="https://trioncreation.com/logo%20master%20-%20Trion-07%203.png">
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
    <link rel="stylesheet" href="../styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="../trion-favicon.png">
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#07051A">
</head>
<body>
    <canvas id="trion-canvas" aria-hidden="true"></canvas>
    <header class="header">
        <div class="container">
            <div class="header-content">
                <a href="../index.html#home" class="logo">
                    <img src="../logo master - Trion-07 3.png" alt="Trion Creation">
                </a>
                <nav class="main-nav">
                    <ul class="nav-list">
                        <li><a href="../index.html#home" class="nav-link">Home</a></li>
                        <li><a href="../index.html#services" class="nav-link active">Services</a></li>
                        <li><a href="../index.html#portfolio" class="nav-link">Portfolio</a></li>
                        <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
                    </ul>
                </nav>
                <div class="header-actions">
                    <a href="../index.html#contact" class="btn btn-primary">Get Started</a>
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
        <section class="page-header with-banner" style="background-image: linear-gradient(135deg, rgba(123,91,255,0.4), rgba(0,240,255,0.25)), url('../images/services/${escAttr(s.image)}'); background-size: cover; background-position: center;">
            <div class="container">
                <div style="font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.2em; color: var(--holo-cyan); margin-bottom: var(--space-4); text-transform: uppercase;">
                    <a href="../index.html" style="color: var(--text-200);">Home</a> <span style="opacity: 0.5;">/</span>
                    <a href="../index.html#services" style="color: var(--text-200);">Services</a> <span style="opacity: 0.5;">/</span>
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
                            <h2 style="margin-bottom: var(--space-6);">Service Overview</h2>
${overview}
                        </div>
                        <div style="padding: var(--space-8); background: var(--grad-card); border: 1px solid var(--glass-border); border-radius: var(--radius-xl); backdrop-filter: blur(10px) saturate(130%);">
                            <h3 style="margin-bottom: var(--space-5); color: var(--holo-cyan); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.95rem;">Key Features</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
${features}
                            </ul>
                        </div>
                    </div>

                    <div style="padding: var(--space-12); background: var(--grad-card); border: 1px solid var(--glass-border); border-radius: var(--radius-xl); backdrop-filter: blur(10px) saturate(130%); margin-bottom: var(--space-16);">
                        <h2 style="margin-bottom: var(--space-8);">Our Expertise</h2>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-8);">${expertise}
                        </div>
                    </div>

                    <div style="text-align: center; padding: var(--space-16) var(--space-8); background: var(--grad-holo); border-radius: var(--radius-2xl); color: var(--void-0); position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2), transparent 60%); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <h2 style="color: var(--void-0); margin-bottom: var(--space-4);">Ready to start your ${esc(s.title.toLowerCase())} project?</h2>
                            <p style="color: rgba(7,5,26,0.85); margin-bottom: var(--space-8); font-size: 1.1rem; max-width: 600px; margin-left: auto; margin-right: auto;">Book a free discovery call. We'll scope your needs and give a fixed-price quote — no hidden costs.</p>
                            <div style="display: flex; gap: var(--space-4); justify-content: center; flex-wrap: wrap;">
                                <a href="../index.html#contact" class="btn btn-secondary">Book Discovery Call</a>
                                <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(s.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">WhatsApp Us</a>
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
                    <div class="logo"><img src="../logo master - Trion-07 3.png" alt="Trion Creation"></div>
                    <p>We Build Any System You Need — Fast, Modern &amp; Fully Custom.</p>
                </div>
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="../index.html#services">All Services</a></li>
                            <li><a href="mobile-web-app-development.html">Mobile & Web App</a></li>
                            <li><a href="erp-crm-development.html">ERP & CRM</a></li>
                            <li><a href="ai-automation-chatbot.html">AI & Chatbot</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="../index.html#about">About</a></li>
                            <li><a href="../index.html#portfolio">Portfolio</a></li>
                            <li><a href="../index.html#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Trion Creation Sdn Bhd. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(s.title)}" class="whatsapp-button" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    </a>

    <script src="../script.js"></script>
    <script src="../futuristic.js"></script>
    <script src="../scroll.js"></script>
</body>
</html>
`;
}

// ────────────────────────────────────────────────────────────
//  PORTFOLIO PAGE RENDERER
//  Each item gets its own /portfolio/<slug>.html with a tech-feel
//  animated background (perspective grid floor, typewriter tagline,
//  scanline accent) and full Service + Article + BreadcrumbList JSON-LD.
// ────────────────────────────────────────────────────────────
function renderPortfolio(p) {
    const url = `https://trioncreation.com/portfolio/${p.slug}.html`;
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

    const techChips = p.techStack.map((t) =>
        `<span class="pf-tech-chip">${esc(t)}</span>`).join('');

    const useCases = p.useCases.map((u) =>
        `<li><span class="pf-bullet">◇</span> ${esc(u)}</li>`).join('');

    const industries = p.industries.map((i) =>
        `<span class="pf-industry-chip">${esc(i)}</span>`).join('');

    const tags = p.tags.map((t) =>
        `<span class="pf-tag">${esc(t)}</span>`).join('');

    // JSON-LD blocks
    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': ['Service', 'CreativeWork'],
        name: p.title,
        description: p.longDescription,
        provider: { '@type': 'Organization', name: 'Trion Creation Sdn Bhd', url: 'https://trioncreation.com' },
        areaServed: [{ '@type': 'Country', name: 'Malaysia' }, { '@type': 'Country', name: 'Singapore' }],
        url,
        keywords: [p.title, ...p.industries, ...p.useCases, ...p.tags, ...p.techStack].join(', ')
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trioncreation.com/' },
            { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://trioncreation.com/#portfolio' },
            { '@type': 'ListItem', position: 3, name: p.title, item: url }
        ]
    };

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `What is a ${p.title.toLowerCase()}?`,
                acceptedAnswer: { '@type': 'Answer', text: p.longDescription }
            },
            {
                '@type': 'Question',
                name: `What technologies are used to build a ${p.title.toLowerCase()}?`,
                acceptedAnswer: { '@type': 'Answer', text: `Trion Creation typically builds ${p.title.toLowerCase()} using ${p.techStack.join(', ')}.` }
            },
            {
                '@type': 'Question',
                name: `Who is a ${p.title.toLowerCase()} suitable for?`,
                acceptedAnswer: { '@type': 'Answer', text: `A ${p.title.toLowerCase()} is suitable for ${p.useCases.join(', ')}. We have delivered similar systems across ${p.industries.join(', ')}.` }
            }
        ]
    };

    const metaTitle = `${p.title} Development Malaysia | Trion Creation`;
    const metaDescription = `${p.longDescription.slice(0, 158)}${p.longDescription.length > 158 ? '...' : ''}`;
    const keywords = [
        p.title.toLowerCase() + ' malaysia',
        p.title.toLowerCase() + ' development malaysia',
        'custom ' + p.title.toLowerCase(),
        ...p.industries.map(i => i.toLowerCase() + ' software malaysia'),
        ...p.techStack.map(t => t.toLowerCase() + ' developer malaysia')
    ].join(', ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escAttr(metaTitle)}</title>
    <meta name="description" content="${escAttr(metaDescription)}">
    <meta name="keywords" content="${escAttr(keywords)}">
    <meta name="author" content="Trion Creation Sdn Bhd">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${escAttr(metaTitle)}">
    <meta property="og:description" content="${escAttr(ogShort)}">
    <meta property="og:image" content="https://trioncreation.com/logo%20master%20-%20Trion-07%203.png">
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
    <link rel="stylesheet" href="../styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="../trion-favicon.png">
    <link rel="manifest" href="../manifest.json">
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
                <a href="../index.html#home" class="logo">
                    <img src="../logo master - Trion-07 3.png" alt="Trion Creation">
                </a>
                <nav class="main-nav">
                    <ul class="nav-list">
                        <li><a href="../index.html#home" class="nav-link">Home</a></li>
                        <li><a href="../index.html#services" class="nav-link">Services</a></li>
                        <li><a href="../index.html#portfolio" class="nav-link active">Portfolio</a></li>
                        <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
                    </ul>
                </nav>
                <div class="header-actions">
                    <a href="../index.html#contact" class="btn btn-primary">Get Started</a>
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
                    <a href="../index.html">Home</a>
                    <span class="pf-breadcrumb-sep">›</span>
                    <a href="../index.html#portfolio">Portfolio</a>
                    <span class="pf-breadcrumb-sep">›</span>
                    <span>${esc(p.title)}</span>
                </div>
                <div class="pf-eyebrow">SOLUTION · ${esc(p.categoryLabel.toUpperCase())}</div>
                <h1 class="pf-title">${esc(p.title)}</h1>
                <p class="pf-tagline">${esc(p.tagline)}</p>
                <div class="pf-tag-row">${tags}</div>
                <div class="pf-stats">${stats}
                </div>
                <div class="pf-cta-row">
                    <a href="../index.html#contact" class="btn btn-primary">Discuss This Project</a>
                    <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20a%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">WhatsApp Us</a>
                </div>
            </div>
        </section>

        <!-- ─── OVERVIEW ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">01</span>
                    <h2>Overview</h2>
                </div>
                <p class="pf-prose">${esc(p.longDescription)}</p>
            </div>
        </section>

        <!-- ─── KEY FEATURES ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">02</span>
                    <h2>Key Features</h2>
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
                    <h2>Built With</h2>
                </div>
                <p class="pf-prose-muted">Our recommended stack for this solution. Every project is tailored — we'll adjust based on your team, infrastructure and integration needs.</p>
                <div class="pf-tech-chips">${techChips}</div>
            </div>
        </section>

        <!-- ─── USE CASES ─── -->
        <section class="pf-section">
            <div class="container">
                <div class="pf-section-head">
                    <span class="pf-section-num">04</span>
                    <h2>Use Cases</h2>
                </div>
                <div class="pf-usecase-cols">
                    <div>
                        <h4 class="pf-sub-head">Perfect For</h4>
                        <ul class="pf-usecase-list">${useCases}</ul>
                    </div>
                    <div>
                        <h4 class="pf-sub-head">Industries We've Built For</h4>
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
                        <div class="pf-eyebrow" style="color: var(--void-0);">READY TO BUILD?</div>
                        <h2>Let's build your ${esc(p.title.toLowerCase())}.</h2>
                        <p>Book a free discovery call — we'll scope your needs and give a fixed-price quote with no hidden costs.</p>
                        <div class="pf-cta-row" style="margin-top: 2rem;">
                            <a href="../index.html#contact" class="btn btn-secondary" style="background: var(--void-0); color: var(--text-100); border-color: rgba(255,255,255,0.3);">Book Discovery Call</a>
                            <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20a%20${encodeURIComponent(p.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="background: transparent; color: var(--void-0); border-color: var(--void-0);">WhatsApp Us</a>
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
                    <div class="logo"><img src="../logo master - Trion-07 3.png" alt="Trion Creation"></div>
                    <p>We Build Any System You Need — Fast, Modern &amp; Fully Custom.</p>
                </div>
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>Portfolio</h4>
                        <ul>
                            <li><a href="../index.html#portfolio">All Solutions</a></li>
                            <li><a href="../projects/yippi.html">Yippi Case Study</a></li>
                            <li><a href="../projects/colorverse.html">Colorverse</a></li>
                            <li><a href="../projects/dddrive.html">DDDrive</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="../index.html#about">About</a></li>
                            <li><a href="../index.html#services">Services</a></li>
                            <li><a href="../index.html#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Trion Creation Sdn Bhd. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20a%20${encodeURIComponent(p.title)}" class="whatsapp-button" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    </a>

    <script src="../script.js"></script>
    <script src="../futuristic.js"></script>
    <script src="../scroll.js"></script>
</body>
</html>
`;
}

// ─── 1. Generate service pages ───
let generated = 0;
for (const s of services) {
    const html = renderService(s);
    const file = path.join(SERVICES_DIR, `${s.slug}.html`);
    fs.writeFileSync(file, html, 'utf8');
    generated += 1;
    console.log(`  ✓ services/${s.slug}.html`);
}
console.log(`Generated ${generated} service pages.`);

// ─── 1b. Generate portfolio pages ───
let pfGenerated = 0;
for (const p of portfolio) {
    const html = renderPortfolio(p);
    const file = path.join(PORTFOLIO_DIR, `${p.slug}.html`);
    fs.writeFileSync(file, html, 'utf8');
    pfGenerated += 1;
    console.log(`  ✓ portfolio/${p.slug}.html`);
}
console.log(`Generated ${pfGenerated} portfolio pages.`);

// ─── 2. Refresh sitemap.xml ───
//    a) Update every <lastmod>...</lastmod> to today
//    b) Ensure every service URL is present
{
    let sitemap = fs.readFileSync(SITEMAP, 'utf8');
    sitemap = sitemap.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);

    // Add any missing service URLs
    for (const s of services) {
        const url = `https://trioncreation.com/services/${s.slug}.html`;
        if (!sitemap.includes(url)) {
            const block = `\n    <url>\n        <loc>${url}</loc>\n        <lastmod>${today}</lastmod>\n        <changefreq>monthly</changefreq>\n        <priority>0.8</priority>\n    </url>\n`;
            sitemap = sitemap.replace('</urlset>', `${block}</urlset>`);
        }
    }
    // Add any missing portfolio URLs
    for (const p of portfolio) {
        const url = `https://trioncreation.com/portfolio/${p.slug}.html`;
        if (!sitemap.includes(url)) {
            const block = `\n    <url>\n        <loc>${url}</loc>\n        <lastmod>${today}</lastmod>\n        <changefreq>monthly</changefreq>\n        <priority>0.7</priority>\n    </url>\n`;
            sitemap = sitemap.replace('</urlset>', `${block}</urlset>`);
        }
    }
    fs.writeFileSync(SITEMAP, sitemap, 'utf8');
    console.log(`Refreshed sitemap.xml (lastmod → ${today}).`);
}

// ─── 3. Refresh llms.txt + llms-full.txt date stamps ───
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

// ─── 4. Update llms.txt service list (regenerate the "## Services" section) ───
{
    if (fs.existsSync(LLMS)) {
        let txt = fs.readFileSync(LLMS, 'utf8');
        const lines = services.map((s) => {
            const url = `https://trioncreation.com/services/${s.slug}.html`;
            return `- [${s.title}](${url}): ${s.tagline}`;
        }).join('\n');
        const block = `## Services\n\n${lines}\n`;
        txt = txt.replace(/## Services[\s\S]*?(?=\n## )/m, block + '\n');
        fs.writeFileSync(LLMS, txt, 'utf8');
        console.log('Refreshed llms.txt services list.');
    }
}

console.log('\nDone.');
