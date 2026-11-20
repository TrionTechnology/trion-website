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

# founders: (copy key, name, initials, mobile E.164 digits, display number, email, WhatsApp?)
PEOPLE = [
    ("freddy", "Freddy Chia", "FC", "60166380495", "+60 16-638 0495", "freddy.chia@trioncreation.com", True),
    ("colin", "Colin Ho", "CH", "60149141459", "+60 14-914 1459", "colin.ho@trioncreation.com", False),
]

PHONE = ('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
         'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 '
         '19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6'
         'l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>')
MAIL = ('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/>'
        '<path d="m22 6-10 7L2 6"/></svg>')

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


# per-service colour: (background, text on it)
SVC_COLOR = {
    "mobile": ("#71EECE", "#0E100F"), "erp": ("#FFC24B", "#0E100F"), "ai": ("#C6F45B", "#0E100F"),
    "games": ("#FF7A59", "#0E100F"), "cloud": ("#2EC4B6", "#0E100F"), "api": ("#FF9F1C", "#0E100F"),
    "web3": ("#FF8FAB", "#0E100F"), "ux": ("#FFE45C", "#0E100F"), "odoo": ("#F7B2A0", "#0E100F"),
    "pos": ("#12B886", "#FFFFFF"), "booking": ("#FFB38A", "#0E100F"), "loan": ("#E9D985", "#0E100F"),
}
STACK_COLOR = {"web": "#71EECE", "mobile": "#FF7A59", "backend": "#FFC24B", "data": "#2EC4B6", "cloud": "#C6F45B",
               "ai": "#FF8FAB", "web3": "#FF9F1C", "business": "#12B886", "games": "#FFE45C"}


def people_cards(c, sep):
    """Founder contact cards, shared by the home #founders block and the Contact tab."""
    pp = c["people"]
    people = []
    for key, name, ini, num, shown, mail, wa in PEOPLE:
        q = pp[key]
        tags = "".join(f"<li>{e(t)}</li>" for t in q["tags"])
        if wa:
            phone = (f'<a class="pc-line" href="https://wa.me/{num}" target="_blank" rel="noopener noreferrer">{PHONE}'
                     f'<span><small>{e(pp["whatsapp"])}</small>{e(shown)}</span></a>')
        else:
            phone = (f'<a class="pc-line" href="tel:+{num}">{PHONE}'
                     f'<span><small>{e(pp["call"])}</small>{e(shown)}</span></a>')
        people.append(
            f'<article class="person-card pc-{key}" data-reveal>'
            f'<header class="pc-head"><span class="pc-avatar" aria-hidden="true">{ini}</span>'
            f'<div><h3>{e(name)}</h3><p class="pc-role">{e(q["role"])}</p></div></header>'
            f'<p class="pc-focus">{e(q["focus"])}</p><ul class="pc-tags">{tags}</ul>'
            f'<div class="pc-lines">{phone}'
            f'<a class="pc-line" href="mailto:{mail}?subject=Project%20Inquiry">{MAIL}'
            f'<span><small>{e(pp["email"])}</small>{e(mail)}</span></a></div></article>')
    return sep.join(people)


def build(lang):
    c = json.loads((HERE / f"copy.{lang}.json").read_text("utf8"))
    A = ASSET[lang]
    P = A  # own product pages live only at /projects/ (no zh/ms copies)
    h = c["hero"]

    rotate = "|".join(c["rotate"])
    labels = dict((k, l) for _, items in STACK for k, l in items)
    marquee_items = "".join(
        f'<li><img src="{A}images/tech-icons/{n}.svg" width="28" height="28" alt="" loading="lazy" decoding="async"><span>{e(labels.get(n, n))}</span></li>'
        for n in MARQUEE)

    # ── kinetic type rows ──
    def kin_row(words, cls):
        cols = ["#71EECE", "#FFC24B", "#FF7A59", "#C6F45B", "#FF8FAB", "#2EC4B6"]
        out = []
        for i, w in enumerate(words * 3):
            style = ["is-fill", "is-outline", "is-pill"][i % 3]
            out.append(f'<span class="kw {style}" style="--kc:{cols[i % len(cols)]}">{e(w)}</span><span class="ks" aria-hidden="true">✦</span>')
        return f'<div class="kin-row {cls}"><div class="kin-inner">{"".join(out)}</div></div>'
    kinetic = kin_row(c["kinetic"][0], "kr-a") + kin_row(c["kinetic"][1], "kr-b")

    # ── services: horizontal pinned panels ──
    panels = []
    for i, (key, slug, img, _size, chips) in enumerate(SERVICES, 1):
        sc = c["services"][key]
        bg, fg = SVC_COLOR[key]
        chip_html = "".join(f"<li>{e(x)}</li>" for x in chips)
        panels.append(f'''<li class="svp" style="--c:{bg};--fg:{fg}"><a href="services/{slug}.html" data-cursor="{a(c["cursor"]["open"])}">
                                <span class="svp-top"><span class="svp-num">{i:02d}<em>/12</em></span><span class="svp-price">{e(sc["price"])}</span></span>
                                <span class="svp-media">{pic(A, img, "(min-width: 1024px) 34vw, 80vw", sc["alt"])}</span>
                                <span class="svp-name">{e(sc["name"])}</span>
                                <span class="svp-desc">{e(sc["desc"])}</span>
                                <span class="svp-foot"><ul class="svp-chips">{chip_html}</ul><span class="svp-go">{ARR_UR}</span></span>
                            </a></li>''')
    panels_html = "\n                        ".join(panels)

    # ── showcase stats ──
    stats = "".join(
        f'<div class="stat" data-reveal style="--sc:{col}"><dt>{e(lbl)}</dt><dd><span data-count="{num}">{num}</span>{e(suf)}</dd></div>'
        for (num, suf, lbl), col in zip(c["stats"], ["#71EECE", "#FFC24B", "#FF7A59", "#C6F45B"]))
    sh = c["showcase"]
    checks = "".join(f'<li><span class="ck" style="--kc:{col}"></span>{e(x)}</li>' for x, col in zip(sh["points"], ["#71EECE", "#FFC24B", "#FF7A59", "#C6F45B"]))

    # ── work: stacked sticky cards ──
    w = c["work"]
    t = w["titan"]; hb = w["himmapan"]; cd = w["cadence"]
    GL = {"en": {"view": "View full size", "of": "of", "pick": "Show image"},
          "zh": {"view": "查看大图", "of": "/", "pick": "显示图片"},
          "ms": {"view": "Lihat saiz penuh", "of": "daripada", "pick": "Papar imej"}}[lang]
    # (full src, thumb src, w, h, caption)  captions are short, same in every language
    # except the words around them; figures and client names in the shots are blurred.
    W = f"{A}images/work/"
    def shot(n, h): return (f"{W}shots/{n}-1600.webp", f"{W}shots/{n}-400.webp", 1600, h)
    GALLERY = {
        "pism": [(f"{W}work-pism-1600.webp", f"{W}work-pism-800.webp", 1600, 1100, "comp"), shot("pism-bi-1", 876), shot("pism-bi-2", 872), shot("pism-bi-3", 872)],
        "archimat": [(f"{W}work-archimat-1600.webp", f"{W}work-archimat-800.webp", 1600, 1100, "comp"), shot("am-discover", 876), shot("am-product", 876), shot("archimat-web-top", 1000)],
        "thai": [(f"{W}work-thai-1600.webp", f"{W}work-thai-800.webp", 1600, 1100, "comp"), shot("thai-sys-1", 826), shot("thai-sys-2", 822), shot("thai-web-top", 1000)],
        "titan": [(f"{A}images/titan-legends-shot-{k}-1600.webp", f"{A}images/titan-legends-shot-{k}-440.webp", 1600, 900) for k in range(1, 7)],
        "cadence": [(f"{A}images/cadence-feature-880.webp", f"{A}images/cadence-feature-440.webp", 1024, 500)] +
                   [(f"{A}images/cadence-{n}-880.webp", f"{A}images/cadence-{n}-440.webp", 880, 1912) for n in ("shot-mosaic", "shot-forgiving", "shot-rhythm")],
        "himmapan": [(f"{A}images/himmapan-bloodlines-feature-1600.webp", f"{A}images/himmapan-bloodlines-feature-440.webp", 1600, 900)] +
                    [(f"{A}images/himmapan-bloodlines-td-{k}-1600.webp", f"{A}images/himmapan-bloodlines-td-{k}-440.webp", 1600, 900) for k in range(1, 5)],
    }
    def gallery(key, title, alt):
        g = GALLERY[key]
        f0 = g[0]
        comp = " is-comp" if len(f0) > 4 else ""
        thumbs = "".join(
            f'<button type="button" class="sc-th{" is-on" if i == 0 else ""}" data-i="{i}" data-full="{x[0]}" data-w="{x[2]}" data-h="{x[3]}"{" data-comp" if len(x) > 4 else ""} aria-label="{a(GL["pick"])} {i + 1}"><img src="{x[1]}" alt="" loading="lazy" decoding="async"></button>'
            for i, x in enumerate(g))
        return (f'<div class="sc-gal" data-gal data-title="{a(title)}">'
                f'<button type="button" class="sc-stage" data-gal-open data-cursor="{a(c["cursor"]["view"])}" aria-label="{a(GL["view"])}: {a(title)}">'
                f'<img class="sc-main{comp}" src="{f0[0]}" width="{f0[2]}" height="{f0[3]}" alt="{a(alt)}" loading="lazy" decoding="async">'
                f'<span class="sc-zoom"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>{e(GL["view"])} · <b data-gal-n>1</b> / {len(g)}</span></button>'
                f'<div class="sc-thumbs">{thumbs}</div></div>')
    def card(i, color, fg, href, title, meta, desc, link, media, extra="", dark=False, sys=False):
        return f'''<article class="sc{' sc-dark' if dark else ''}{' sc-sys' if sys else ''}" style="--i:{i};--c:{color};--fg:{fg}">
                            <div class="sc-text">
                                <p class="sc-meta"><span class="sc-num">{i + 1:02d}</span>{e(meta)}</p>
                                <h3><a href="{href}">{e(title)}</a></h3>
                                <p class="sc-desc">{e(desc)}</p>
                                <p class="sc-links"><a href="{href}" class="btn btn-ink">{e(link)} {ARR}</a>{extra}</p>
                            </div>
                            <div class="sc-media">{media}</div>
                        </article>'''
    play = f'<a href="https://play.google.com/store/apps/details?id=com.trioncreation.cadence" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">{e(cd["play"])} {ARR}</a>'
    SYS_LINK = {"pism": ("feedback-bi-dashboard", "https://www.pism.edu.my", "#71EECE"),
                "archimat": ("project-management-suite", "https://www.archimat.io", "#C6F45B"),
                "thai": ("legal-case-management", "https://thaiadvocates.com", "#FFC24B")}
    cards = []
    for k, (slug, n, meta, d, alt) in enumerate(w["systems"]):
        pf, site, col = SYS_LINK[slug]
        visit = f'<a href="{site}" class="btn btn-ghost" target="_blank" rel="noopener noreferrer">{e(w["visit"])} {ARR_UR}</a>'
        cards.append(card(k, col, "#0E100F", f"portfolio/{pf}.html", n, meta, d, w["clientLink"], gallery(slug, n, alt), visit, sys=True))
    cards += [
        card(3, "#FF7A59", "#0E100F", f"{P}projects/titan-legends.html", "Titan Legends", t["meta"], t["desc"], t["link"], gallery("titan", "Titan Legends", t["alt"])),
        card(4, "#12B886", "#FFFFFF", f"{P}projects/cadence.html", "Cadence", cd["meta"], cd["desc"], cd["link"], gallery("cadence", "Cadence", cd["alt1"]), play),
        card(5, "#FF8FAB", "#0E100F", f"{P}projects/himmapan-bloodlines.html", "Himmapan Bloodlines", hb["meta"], hb["desc"], hb["link"], gallery("himmapan", "Himmapan Bloodlines", hb["alt"])),
    ]
    names = [x[1] for x in w["systems"]] + ["Titan Legends", "Cadence", "Himmapan Bloodlines"]
    meter = (f'<div class="sc-meter" aria-hidden="true"><span class="scm-n"><b data-scm-i>01</b> / {len(names):02d}</span>'
             f'<span class="scm-bar"><i data-scm-bar></i></span><span class="scm-name" data-scm-name>{e(names[0])}</span></div>')
    cards_html = "\n                        ".join(cards)

    # ── process ──
    steps = "".join(
        f'<li class="how-item" data-reveal style="--hc:{col}"><span class="how-num">{i:02d}</span><h3>{e(hh)}</h3><p>{p}</p></li>'
        for i, ((hh, p), col) in enumerate(zip(c["process"]["steps"], ["#71EECE", "#FFC24B", "#FF7A59", "#C6F45B"]), 1))

    # ── estimator ──
    es = c["estimate"]
    est_types = "".join(
        f'<label class="opt"><input type="radio" name="est-type" value="{k}" data-min="{mn}" data-max="{mx}" data-wmin="{wmn}" data-wmax="{wmx}"{" checked" if i == 0 else ""}><span>{e(lbl)}</span></label>'
        for i, (k, lbl, mn, mx, wmn, wmx) in enumerate(es["types"]))
    est_plat = "".join(
        f'<label class="opt"><input type="checkbox" name="est-plat" value="{k}" data-min="{mn}" data-max="{mx}"{" checked" if k == "web" else ""}><span>{e(lbl)}</span></label>'
        for k, lbl, mn, mx in es["platforms"])
    est_feat = "".join(
        f'<label class="opt"><input type="checkbox" name="est-feat" value="{k}" data-min="{mn}" data-max="{mx}" data-weeks="{wk}"><span>{e(lbl)}</span></label>'
        for k, lbl, mn, mx, wk in es["features"])
    team = "".join(f'<li style="--tc:{col}"><span>{e(r)}</span><i data-team="{k}"></i></li>'
                   for (k, r), col in zip(es["team"], ["#71EECE", "#FFC24B", "#FF7A59", "#C6F45B"]))

    # ── stack ──
    stack_rows = []
    for key, items in STACK:
        chips = "".join(f'<li><img src="{A}images/tech-icons/{ic}.svg" width="22" height="22" alt="" loading="lazy" decoding="async">{e(l)}</li>' for ic, l in items)
        stack_rows.append(f'<div class="stack-row" data-reveal style="--stc:{STACK_COLOR[key]}"><h3><span class="std"></span>{e(c["stack"]["cats"][key])}</h3><ul>{chips}</ul></div>')
    stack_rows.append(f'<div class="stack-row" data-reveal style="--stc:{STACK_COLOR["games"]}"><h3><span class="std"></span>{e(c["stack"]["cats"]["games"])}</h3><ul><li><span class="ti-text">U</span>Unity</li><li><span class="ti-text">C#</span>C#</li><li><span class="ti-text">3D</span>Blender</li><li><span class="ti-text">XR</span>AR / VR</li></ul></div>')
    stack_html = "\n                        ".join(stack_rows)

    pp = c["people"]
    people_html = people_cards(c, "\n                        ")

    cta = c["cta"]
    cta_rows = []
    for key, name, ini, num, shown, mail, wa in PEOPLE:
        if wa:
            phone = (f'<a href="https://wa.me/{num}?text=Hi,%20I\'m%20interested%20in%20your%20services" class="btn btn-primary" '
                     f'target="_blank" rel="noopener noreferrer">{e(pp["whatsapp"])} {e(shown)}</a>')
        else:
            phone = f'<a href="tel:+{num}" class="btn btn-primary">{e(pp["call"])} {e(shown)}</a>'
        cta_rows.append(
            f'<div class="cta-person"><p class="cta-who"><strong>{e(name)}</strong> · {e(pp[key]["role"].split(" · ")[-1])}</p>'
            f'{phone}<a href="mailto:{mail}?subject=Project%20Inquiry" class="btn btn-secondary">{e(mail)}</a></div>')
    cta_people = "\n                            ".join(cta_rows)
    return f'''<section id="home" class="tab-content active" role="tabpanel" aria-labelledby="tab-home">
            <div class="hero-section hero-x" data-hero-intro>
                <div class="hero-blobs" aria-hidden="true"><i class="hb1"></i><i class="hb2"></i><i class="hb3"></i><i class="hb4"></i></div>
                <div class="hero-3d" data-hero3d aria-hidden="true"><img class="h3d-fallback" src="{A}images/logo-mark.webp" width="113" height="79" alt=""></div>
                <div class="container hero-inner">
                    <p class="hero-pill" data-intro><span class="pill-dot"></span>{e(h["pill"])} <span class="rotator" data-rotate="{a(rotate)}">{e(c["rotate"][0])}</span></p>
                    <h1 class="hero-title" data-intro>{e(h["title"])}<span class="hero-title-2">{e(h["title2"])}</span></h1>
                    <div class="hero-foot">
                        <p class="hero-lede" data-intro>{e(h["lede"])}</p>
                        <div class="hero-actions" data-intro>
                            <a href="#contact" class="btn btn-primary btn-lg">{e(h["cta1"])} {ARR}</a>
                            <a href="#estimate" class="btn btn-secondary btn-lg">{e(h["cta2"])}</a>
                        </div>
                    </div>
                    <p class="hero-scroll" aria-hidden="true"><span class="hs-mouse"><i></i></span>{e(h["scroll"])}</p>
                </div>
                <div class="marquee" aria-label="{a(c["marquee"])}">
                    <p class="marquee-label">{e(c["marquee"])}</p>
                    <div class="marquee-track"><ul>{marquee_items}</ul><ul aria-hidden="true">{marquee_items}</ul></div>
                </div>
            </div>

            <div class="kinetic" aria-hidden="true">{kinetic}</div>

            <div class="svc-x" id="capabilities">
                <div class="svc-x-pin">
                    <div class="container svc-x-head">
                        <div>
                            <p class="block-kicker"><span class="kd"></span>{e(c["caps"]["kicker"])}</p>
                            <h2 data-split>{e(c["caps"]["title"])}</h2>
                        </div>
                        <div class="svc-x-side">
                            <p class="block-intro">{e(c["caps"]["intro"])}</p>
                            <div class="svc-x-meter" aria-hidden="true"><span class="svm-count"><b data-svc-count>01</b> / 12</span><span class="svm-bar"><i data-svc-bar></i></span></div>
                        </div>
                    </div>
                    <ul class="svc-x-track" data-svc-track>
                        {panels_html}
                    </ul>
                </div>
            </div>

            <div class="home-block showcase">
                <div class="container">
                    <div class="show-grid">
                        <div class="show-copy">
                            <p class="block-kicker"><span class="kd"></span>{e(sh["kicker"])}</p>
                            <h2 data-split>{e(sh["title"])}</h2>
                            <p class="block-intro" data-reveal>{e(sh["intro"])}</p>
                            <ul class="show-points" data-reveal-group>{checks}</ul>
                        </div>
                        {hero_stage(A, c)}
                    </div>
                    <dl class="stats" data-reveal-group>{stats}</dl>
                </div>
            </div>

            <div class="home-block work-stack is-dark" id="work">
                <div class="container">
                    <header class="block-head">
                        <p class="block-kicker"><span class="kd"></span>{e(w["kicker"])}</p>
                        <h2 data-split>{e(w["title"])}</h2>
                        <p class="block-intro" data-reveal>{e(w["intro"])}</p>
                    </header>
                    <div class="stack-cards">
                        {cards_html}
                    </div>
                    {meter}
                    <p class="work-links" data-reveal><a href="#portfolio" class="link-arrow">{e(w["all"])} {ARR}</a><a href="products.html" class="link-arrow">{e(w["products"])} {ARR}</a></p>
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

            <div class="home-block estimator" id="estimate">
                <div class="container">
                    <header class="block-head">
                        <p class="block-kicker"><span class="kd"></span>{e(es["kicker"])}</p>
                        <h2 data-split>{e(es["title"])}</h2>
                        <p class="block-intro" data-reveal>{e(es["intro"])}</p>
                    </header>
                    <form class="est" data-estimator onsubmit="return false" data-msg="{a(es["msg"])}" data-weeks="{a(es["weeksUnit"])}">
                        <div class="est-form">
                            <fieldset><legend><span>01</span>{e(es["q1"])}</legend><div class="opts">{est_types}</div></fieldset>
                            <fieldset><legend><span>02</span>{e(es["q2"])}</legend><div class="opts">{est_plat}</div></fieldset>
                            <fieldset><legend><span>03</span>{e(es["q3"])}</legend><div class="opts">{est_feat}</div></fieldset>
                        </div>
                        <aside class="est-out" aria-live="polite">
                            <p class="eo-label">{e(es["range"])}</p>
                            <p class="eo-price"><span data-est-min>RM 15k</span><em>–</em><span data-est-max>RM 60k</span></p>
                            <p class="eo-weeks"><span data-est-weeks>8–14</span> {e(es["weeksUnit"])}</p>
                            <ul class="eo-team">{team}</ul>
                            <a class="btn btn-primary btn-lg eo-cta" data-est-cta href="https://wa.me/60166380495" target="_blank" rel="noopener noreferrer">{e(es["cta"])} {ARR}</a>
                            <p class="eo-note">{e(es["note"])}</p>
                        </aside>
                    </form>
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

            <div class="home-block people-section" id="founders">
                <div class="container">
                    <header class="block-head">
                        <p class="block-kicker"><span class="kd"></span>{e(pp["kicker"])}</p>
                        <h2 data-split>{e(pp["title"])}</h2>
                        <p class="block-intro" data-reveal>{e(pp["intro"])}</p>
                    </header>
                    <div class="people-grid" data-reveal-group>
                        {people_html}
                    </div>
                </div>
            </div>

            <div class="home-block cta-band">
                <div class="container">
                    <div class="cta-card">
                        <div class="cta-shapes" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                        <div class="cta-copy">
                            <h2 data-split>{e(cta["title"])}</h2>
                            <p data-reveal>{e(cta["text"])}</p>
                        </div>
                        <div class="cta-actions" data-reveal>
                            {cta_people}
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
        # Contact tab: founder cards between the founders markers
        fs, fe = "<!-- founders:start -->", "<!-- founders:end -->"
        i, j = out.index(fs) + len(fs), out.index(fe)
        sep = "\n                                "
        c = json.loads((HERE / f"copy.{lang}.json").read_text("utf8"))
        out = out[:i] + '<div class="people-grid is-stacked">' + sep + people_cards(c, sep) + "\n                            </div>" + out[j:]
        page.write_text(out, "utf8")
        print("home panel ->", page.relative_to(ROOT))


if __name__ == "__main__":
    main()
