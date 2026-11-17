#!/usr/bin/env python3
"""
Builds the home panel (<section id="home">) of index.html, zh/index.html
and ms/index.html from one template plus scripts/home/copy.<lang>.json.

    python3 scripts/home/build-home.py

Only the markup between '<section id="home"' and '<!-- About Tab -->'
is replaced; the rest of each page is left alone.
"""
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent

PAGES = {"en": ROOT / "index.html", "zh": ROOT / "zh/index.html", "ms": ROOT / "ms/index.html"}
ASSET = {"en": "", "zh": "../", "ms": "../"}

ARR = ('<svg class="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
       'stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>')
ARR_UR = ('<svg class="arr arr-ur" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
          'stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>')

# service key -> (slug, image base, size class, tech chips)
SERVICES = [
    ("mobile", "mobile-web-app-development", "service-web-mobile", "xl", ["Flutter", "React Native", "Next.js", "Swift", "Kotlin"]),
    ("erp", "erp-crm-development", "service-erp-crm", "lg", ["Laravel", "Node.js", "PostgreSQL", "Power BI"]),
    ("ai", "ai-automation-chatbot", "service-ai-chatbot", "lg", ["OpenAI", "Dialogflow", "Python", "WhatsApp API"]),
    ("games", "ar-vr-metaverse-development", "service-ar-vr", "xl", ["Unity", "C#", "AR", "VR"]),
    ("cloud", "cloud-infrastructure-devops", "service-cloud", "md", ["AWS", "Alibaba Cloud", "Docker"]),
    ("api", "api-integration-development", "service-api", "md", ["REST", "GraphQL", "Webhooks"]),
    ("web3", "blockchain-web3-solutions", "service-blockchain", "md", ["Solidity", "Hardhat", "Web3.js"]),
    ("ux", "product-design-ux", "service-ux", "md", ["Figma", "Prototypes", "Design systems"]),
    ("odoo", "odoo-customisation", "service-odoo", "sm", ["Odoo", "Python"]),
    ("pos", "pos-inventory-management", "service-pos", "sm", ["Multi-outlet", "Barcode"]),
    ("booking", "booking-system-development", "service-booking", "sm", ["Calendars", "Payments"]),
    ("loan", "loan-management-system", "service-loan", "sm", ["Credit scoring", "Workflows"]),
]

# (category key, [(icon file or None, label)])
STACK = [
    ("web", [("react", "React"), ("nextjs", "Next.js"), ("vuejs", "Vue"), ("typescript", "TypeScript"), ("tailwindcss", "Tailwind"), ("html5", "HTML5")]),
    ("mobile", [("flutter", "Flutter"), ("react", "React Native"), ("swift", "Swift"), ("kotlin", "Kotlin"), ("xamarin", "Xamarin")]),
    ("backend", [("nodejs", "Node.js"), ("express", "Express"), ("laravel", "Laravel"), ("php", "PHP"), ("graphql", "GraphQL"), ("prisma", "Prisma"), ("apollo", "Apollo")]),
    ("data", [("postgresql", "PostgreSQL"), ("mysql", "MySQL"), ("mongodb", "MongoDB"), ("redis", "Redis"), ("firebase", "Firebase"), ("powerbi", "Power BI"), ("airflow", "Airflow")]),
    ("cloud", [("aws", "AWS"), ("alibaba-cloud", "Alibaba Cloud"), ("docker", "Docker"), ("kubernetes", "Kubernetes"), ("nginx", "Nginx"), ("github-actions", "GitHub Actions")]),
    ("ai", [("openai", "OpenAI"), ("tensorflow", "TensorFlow"), ("pytorch", "PyTorch"), ("spacy", "spaCy"), ("dialogflow", "Dialogflow"), ("zapier", "Zapier")]),
    ("web3", [("ethereum", "Ethereum"), ("solidity", "Solidity"), ("hardhat", "Hardhat"), ("web3js", "Web3.js"), ("opensea", "OpenSea")]),
    ("business", [("odoo", "Odoo"), ("sap", "SAP"), ("stripe", "Stripe"), ("paypal", "PayPal"), ("square", "Square"), ("rapidapi", "RapidAPI")]),
]

MARQUEE = ["react", "nextjs", "flutter", "swift", "kotlin", "nodejs", "laravel", "typescript", "postgresql", "mongodb", "redis",
           "aws", "alibaba-cloud", "docker", "kubernetes", "openai", "tensorflow", "pytorch", "odoo", "stripe", "ethereum",
           "solidity", "graphql", "firebase", "tailwindcss", "github-actions", "vuejs", "sap"]


def e(s):
    return html.escape(s, quote=False)


def a(s):
    return html.escape(s, quote=True)


def pic(A, base, sizes, alt, eager=False, w=1536, h=1024):
    load = 'fetchpriority="high" decoding="async"' if eager else 'loading="lazy" decoding="async"'
    return (f'<picture><source type="image/avif" srcset="{A}images/services/{base}-400.avif 400w, {A}images/services/{base}-800.avif 800w, {A}images/services/{base}-1200.avif 1200w" sizes="{sizes}">'
            f'<source type="image/webp" srcset="{A}images/services/{base}-400.webp 400w, {A}images/services/{base}-800.webp 800w, {A}images/services/{base}-1200.webp 1200w" sizes="{sizes}">'
            f'<img src="{A}images/services/{base}-800.webp" width="{w}" height="{h}" alt="{a(alt)}" {load}></picture>')


def hero_stage(A, c):
    s = c["stage"]
    bars = "".join(f'<i style="--h:{h}%"></i>' for h in (38, 52, 44, 63, 58, 71, 66, 84, 77, 92, 88, 97))
    rows = "".join(
        f'<div class="hs-row"><span class="hs-av" style="--hue:{hue}"></span><span>{e(n)}</span><span class="hs-tag is-{st}">{e(s["status"][st])}</span><span class="hs-num">{e(v)}</span></div>'
        for n, st, v, hue in s["rows"])
    return f'''<div class="hero-stage" aria-hidden="true" data-intro-stage>
                        <div class="hs-window" data-depth="0.4">
                            <div class="hs-bar"><span></span><span></span><span></span><em>{e(s["url"])}</em></div>
                            <div class="hs-body">
                                <nav class="hs-side"><b></b><i class="on"></i><i></i><i></i><i></i><i></i></nav>
                                <div class="hs-main">
                                    <div class="hs-head"><strong>{e(s["title"])}</strong><span class="hs-live"><span class="dot"></span>{e(s["live"])}</span></div>
                                    <div class="hs-kpis">
                                        <div><span>{e(s["k1"])}</span><b>RM 482,190</b><em class="up">+12.4%</em></div>
                                        <div><span>{e(s["k2"])}</span><b>1,284</b><em class="up">+8.1%</em></div>
                                        <div><span>{e(s["k3"])}</span><b>98.2%</b><em>{e(s["k3n"])}</em></div>
                                    </div>
                                    <div class="hs-charts">
                                        <svg class="hs-line" viewBox="0 0 320 120" preserveAspectRatio="none"><defs><linearGradient id="hsFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#71EECE" stop-opacity=".45"/><stop offset="1" stop-color="#71EECE" stop-opacity="0"/></linearGradient></defs><path class="hs-area" d="M0 96 C30 90 46 70 74 74 S120 92 148 66 S196 30 226 42 S282 18 320 10 L320 120 L0 120Z" fill="url(#hsFill)"/><path class="hs-stroke" d="M0 96 C30 90 46 70 74 74 S120 92 148 66 S196 30 226 42 S282 18 320 10" fill="none" stroke="#0E8F6E" stroke-width="2.2" pathLength="1"/></svg>
                                        <div class="hs-bars">{bars}</div>
                                    </div>
                                    <div class="hs-table">{rows}</div>
                                </div>
                            </div>
                        </div>
                        <div class="hs-phone" data-depth="1.1"><picture><source type="image/webp" srcset="{A}images/cadence-today-440.webp 440w"><img src="{A}images/cadence-today-440.webp" width="440" height="593" alt="" decoding="async"></picture></div>
                        <div class="hs-game" data-depth="0.8"><picture><source type="image/webp" srcset="{A}images/titan-legends-feature-440.webp 440w, {A}images/titan-legends-feature-880.webp 880w" sizes="260px"><img src="{A}images/titan-legends-feature-880.webp" width="1600" height="900" alt="" decoding="async"></picture><span>Titan Legends · Unity</span></div>
                        <div class="hs-chip hs-chip-api" data-depth="1.4"><span class="m">POST</span>/api/orders <span class="ok">201</span><span class="ms">38ms</span></div>
                        <div class="hs-chip hs-chip-deploy" data-depth="1.6"><span class="tick"></span>{e(s["deploy"])}</div>
                        <div class="hs-chip hs-chip-ai" data-depth="1.2"><span class="spark"></span>{e(s["ai"])}</div>
                    </div>'''


def build(lang):
    c = json.loads((HERE / f"copy.{lang}.json").read_text("utf8"))
    A = ASSET[lang]
    P = A  # own product pages live only at /projects/ (no zh/ms copies)

    rotate = "|".join(c["rotate"])
    marquee_items = "".join(
        f'<li><img src="{A}images/tech-icons/{n}.svg" width="28" height="28" alt="" loading="lazy" decoding="async"><span>{e(dict((k, l) for _, items in STACK for k, l in items).get(n, n))}</span></li>'
        for n in MARQUEE)

    stats = "".join(
        f'<div class="stat" data-reveal><dt>{e(lbl)}</dt><dd><span data-count="{num}">{num}</span>{e(suf)}</dd></div>'
        for num, suf, lbl in c["stats"])

    caps = []
    for i, (key, slug, img, size, chips) in enumerate(SERVICES, 1):
        sc = c["services"][key]
        chip_html = "".join(f"<li>{e(x)}</li>" for x in chips)
        sizes = {"xl": "(min-width: 1024px) 58vw, 92vw", "lg": "(min-width: 1024px) 42vw, 92vw",
                 "md": "(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 92vw", "sm": "(min-width: 1024px) 25vw, (min-width: 640px) 46vw, 92vw"}[size]
        caps.append(f'''<li class="cap cap-{size}" data-reveal><a href="services/{slug}.html">
                            <span class="cap-media">{pic(A, img, sizes, sc["alt"])}</span>
                            <span class="cap-body">
                                <span class="cap-top"><span class="cap-num">{i:02d}</span><span class="cap-price">{e(sc["price"])}</span></span>
                                <span class="cap-name">{e(sc["name"])}</span>
                                <span class="cap-desc">{e(sc["desc"])}</span>
                                <ul class="cap-chips">{chip_html}</ul>
                            </span>
                            <span class="cap-go">{ARR_UR}</span>
                        </a></li>''')
    caps_html = "\n                        ".join(caps)

    w = c["work"]
    clients = "".join(
        f'<li data-reveal><a href="projects/{slug}.html"><span class="cl-name">{e(n)}</span><span class="cl-desc">{e(d)}</span><span class="cl-tags">{e(t)}</span>{ARR_UR}</a></li>'
        for slug, n, d, t in w["clients"])

    steps = "".join(
        f'<li class="how-item" data-reveal><span class="how-num">{i:02d}</span><h3>{e(h)}</h3><p>{p}</p></li>'
        for i, (h, p) in enumerate(c["process"]["steps"], 1))

    stack_rows = []
    for key, items in STACK:
        chips = "".join(
            f'<li><img src="{A}images/tech-icons/{ic}.svg" width="22" height="22" alt="" loading="lazy" decoding="async">{e(l)}</li>' if ic
            else f"<li>{e(l)}</li>" for ic, l in items)
        if key == "web":
            pass
        stack_rows.append(f'<div class="stack-row" data-reveal><h3>{e(c["stack"]["cats"][key])}</h3><ul>{chips}</ul></div>')
    stack_rows.append(f'<div class="stack-row" data-reveal><h3>{e(c["stack"]["cats"]["games"])}</h3><ul><li><span class="ti-text">U</span>Unity</li><li><span class="ti-text">C#</span>C#</li><li><span class="ti-text">3D</span>Blender</li><li><span class="ti-text">XR</span>AR / VR</li></ul></div>')
    stack_html = "\n                        ".join(stack_rows)

    h = c["hero"]
    t = w["titan"]; hb = w["himmapan"]; cd = w["cadence"]
    cta = c["cta"]

    return f'''<section id="home" class="tab-content active" role="tabpanel" aria-labelledby="tab-home">
            <div class="hero-section" data-hero-intro>
                <div class="hero-bg" aria-hidden="true"><span class="hb-grid"></span><span class="hb-orb"></span></div>
                <div class="container hero-grid">
                    <div class="hero-copy">
                        <p class="hero-pill" data-intro><span class="pill-dot"></span>{e(h["pill"])} <span class="rotator" data-rotate="{a(rotate)}">{e(c["rotate"][0])}</span></p>
                        <h1 class="hero-title" data-intro>{e(h["title"])}<span class="hero-title-2">{e(h["title2"])}</span></h1>
                        <p class="hero-lede" data-intro>{e(h["lede"])}</p>
                        <div class="hero-actions" data-intro>
                            <a href="#contact" class="btn btn-primary btn-lg">{e(h["cta1"])} {ARR}</a>
                            <a href="#capabilities" class="btn btn-secondary btn-lg">{e(h["cta2"])}</a>
                        </div>
                        <p class="hero-trust" data-intro><span class="ht-stars" aria-hidden="true"></span>{e(h["trust"])}</p>
                    </div>
                    {hero_stage(A, c)}
                </div>
                <div class="marquee" aria-label="{a(c["marquee"])}">
                    <p class="marquee-label">{e(c["marquee"])}</p>
                    <div class="marquee-track"><ul>{marquee_items}</ul><ul aria-hidden="true">{marquee_items}</ul></div>
                </div>
            </div>

            <div class="home-block stats-band">
                <div class="container">
                    <dl class="stats" data-reveal-group>{stats}</dl>
                </div>
            </div>

            <div class="home-block caps-section" id="capabilities">
                <div class="container">
                    <header class="block-head">
                        <p class="block-kicker"><span class="kd"></span>{e(c["caps"]["kicker"])}</p>
                        <h2 data-split>{e(c["caps"]["title"])}</h2>
                        <p class="block-intro" data-reveal>{e(c["caps"]["intro"])}</p>
                    </header>
                    <ul class="caps" data-reveal-group>
                        {caps_html}
                    </ul>
                </div>
            </div>

            <div class="home-block work-section is-dark" id="work">
                <div class="container">
                    <header class="block-head">
                        <p class="block-kicker"><span class="kd"></span>{e(w["kicker"])}</p>
                        <h2 data-split>{e(w["title"])}</h2>
                        <p class="block-intro" data-reveal>{e(w["intro"])}</p>
                    </header>
                    <div class="work-grid">
                        <article class="work-card wc-wide" data-reveal>
                            <a class="work-media" href="{P}projects/titan-legends.html" data-img-reveal tabindex="-1" aria-hidden="true"><picture><source type="image/webp" srcset="{A}images/titan-legends-shot-1-440.webp 440w, {A}images/titan-legends-shot-1-880.webp 880w, {A}images/titan-legends-shot-1-1600.webp 1600w" sizes="(min-width: 1024px) 80vw, 92vw"><img src="{A}images/titan-legends-shot-1-1600.webp" width="1920" height="1080" alt="{a(t["alt"])}" loading="lazy" decoding="async"></picture></a>
                            <div class="work-text">
                                <p class="work-meta">{e(t["meta"])}</p>
                                <h3><a href="{P}projects/titan-legends.html">Titan Legends</a></h3>
                                <p>{e(t["desc"])}</p>
                                <p class="work-links"><a href="{P}projects/titan-legends.html" class="link-arrow">{e(t["link"])} {ARR}</a></p>
                            </div>
                        </article>
                        <article class="work-card" data-reveal>
                            <a class="work-media" href="{P}projects/himmapan-bloodlines.html" data-img-reveal tabindex="-1" aria-hidden="true"><picture><source type="image/webp" srcset="{A}images/himmapan-bloodlines-feature-440.webp 440w, {A}images/himmapan-bloodlines-feature-880.webp 880w, {A}images/himmapan-bloodlines-feature-1600.webp 1600w" sizes="(min-width: 1024px) 44vw, 92vw"><img src="{A}images/himmapan-bloodlines-feature-880.webp" width="1600" height="900" alt="{a(hb["alt"])}" loading="lazy" decoding="async"></picture></a>
                            <div class="work-text">
                                <p class="work-meta">{e(hb["meta"])}</p>
                                <h3><a href="{P}projects/himmapan-bloodlines.html">Himmapan Bloodlines</a></h3>
                                <p>{e(hb["desc"])}</p>
                                <p class="work-links"><a href="{P}projects/himmapan-bloodlines.html" class="link-arrow">{e(hb["link"])} {ARR}</a></p>
                            </div>
                        </article>
                        <article class="work-card" data-reveal>
                            <a class="work-media is-cadence" href="{P}projects/cadence.html" data-img-reveal tabindex="-1" aria-hidden="true"><span class="phones"><picture><source type="image/webp" srcset="{A}images/cadence-shot-mosaic-440.webp 440w, {A}images/cadence-shot-mosaic-880.webp 880w" sizes="(min-width: 1024px) 14vw, 36vw"><img src="{A}images/cadence-shot-mosaic-880.webp" width="1320" height="2868" alt="{a(cd["alt1"])}" loading="lazy" decoding="async"></picture><picture><source type="image/webp" srcset="{A}images/cadence-shot-forgiving-440.webp 440w, {A}images/cadence-shot-forgiving-880.webp 880w" sizes="(min-width: 1024px) 14vw, 36vw"><img src="{A}images/cadence-shot-forgiving-880.webp" width="1320" height="2868" alt="{a(cd["alt2"])}" loading="lazy" decoding="async"></picture></span></a>
                            <div class="work-text">
                                <p class="work-meta">{e(cd["meta"])}</p>
                                <h3><a href="{P}projects/cadence.html">Cadence</a></h3>
                                <p>{e(cd["desc"])}</p>
                                <p class="work-links"><a href="{P}projects/cadence.html" class="link-arrow">{e(cd["link"])} {ARR}</a><a href="https://play.google.com/store/apps/details?id=com.trioncreation.cadence" class="link-arrow" target="_blank" rel="noopener noreferrer">{e(cd["play"])} {ARR}</a></p>
                            </div>
                        </article>
                    </div>
                    <div class="client-list">
                        <h3 class="client-head" data-reveal>{e(w["clientsHead"])}</h3>
                        <ul data-reveal-group>{clients}</ul>
                        <p class="work-links" data-reveal><a href="#portfolio" class="link-arrow">{e(w["all"])} {ARR}</a><a href="products.html" class="link-arrow">{e(w["products"])} {ARR}</a></p>
                    </div>
                </div>
            </div>

            <div class="home-block how-section">
                <div class="container">
                    <header class="block-head">
                        <p class="block-kicker"><span class="kd"></span>{e(c["process"]["kicker"])}</p>
                        <h2 data-split>{e(c["process"]["title"])}</h2>
                        <p class="block-intro" data-reveal>{e(c["process"]["intro"])}</p>
                    </header>
                    <div class="how-track"><span class="how-line" data-progress-line></span></div>
                    <ol class="how-list" data-reveal-group>{steps}</ol>
                </div>
            </div>

            <div class="home-block stack-section">
                <div class="container">
                    <header class="block-head">
                        <p class="block-kicker"><span class="kd"></span>{e(c["stack"]["kicker"])}</p>
                        <h2 data-split>{e(c["stack"]["title"])}</h2>
                        <p class="block-intro" data-reveal>{e(c["stack"]["intro"])}</p>
                    </header>
                    <div class="stack-grid" data-reveal-group>
                        {stack_html}
                    </div>
                </div>
            </div>

            <div class="home-block cta-band">
                <div class="container">
                    <div class="cta-card">
                        <div class="cta-copy">
                            <h2 data-split>{e(cta["title"])}</h2>
                            <p data-reveal>{e(cta["text"])}</p>
                        </div>
                        <div class="cta-actions" data-reveal>
                            <a href="https://wa.me/60166380495?text=Hi,%20I'm%20interested%20in%20your%20services" class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">WhatsApp 016-638 0495</a>
                            <a href="mailto:freddy.chia@trioncreation.com?subject=Project%20Inquiry" class="btn btn-secondary btn-lg">freddy.chia@trioncreation.com</a>
                            <a href="#contact" class="btn btn-text">{e(cta["form"])} {ARR}</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        '''


def main():
    for lang, page in PAGES.items():
        src = page.read_text("utf8")
        start = src.index('<section id="home"')
        end = src.index("<!-- About Tab -->")
        out = src[:start] + build(lang) + src[end:]
        page.write_text(out, "utf8")
        print("home panel ->", page.relative_to(ROOT))


if __name__ == "__main__":
    main()
