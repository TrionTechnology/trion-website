#!/usr/bin/env python3
"""
Builds answer-style guide pages in en / ms / zh:

    /guides/<slug>.html   /ms/guides/<slug>.html   /zh/guides/<slug>.html

    python3 scripts/guides/build-guides.py

Header and footer are lifted from the matching-locale ERP service page so the
guides share the site chrome. Prices come from the same data the site already
publishes (home estimator in scripts/home/copy.<lang>.json and the service
price bands in scripts/services.json), so the guide never disagrees with them.
Run `node scripts/build-site.js` afterwards to add the pages to sitemap.xml.
"""
import datetime
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
ORIGIN = "https://trioncreation.com"
SLUG = "software-development-cost-malaysia"
PUBLISHED = "2026-11-18"
TODAY = datetime.date.today().isoformat()

LOC = {
    "en": {"dir": "", "html": "en", "hreflang": "en", "og": "en_MY"},
    "ms": {"dir": "ms", "html": "ms", "hreflang": "ms", "og": "ms_MY"},
    "zh": {"dir": "zh", "html": "zh-Hans", "hreflang": "zh-Hans", "og": "zh_MY"},
}


def e(s):
    return html.escape(str(s), quote=False)


def a(s):
    return html.escape(str(s), quote=True)


def rm(n):
    return "RM" + f"{n:,}"


def url(loc):
    d = LOC[loc]["dir"]
    return f"{ORIGIN}{'/' + d if d else ''}/guides/{SLUG}.html"


# ───────────────────────────── copy ─────────────────────────────
T = {
    "en": {
        "title": "How Much Does Custom Software Cost in Malaysia? (2026 Guide)",
        "metaTitle": "Software Development Cost in Malaysia (2026 Guide) | Trion Creation",
        "desc": "What custom software, mobile apps and ERP systems cost in Malaysia in 2026: price ranges by project type, timelines, what drives cost, and how to keep it down.",
        "crumbHome": "Home", "crumb": "Software cost guide",
        "eyebrow": "GUIDE · PRICING",
        "lede": "Real price ranges from a Kuala Lumpur software house, using the same numbers we quote from. No sales call needed to read them.",
        "byline": "By {name}, Founder (Technology)", "updated": "Updated",
        "answerKicker": "Short answer",
        "answer": [
            "A custom software project in Malaysia typically costs <strong>RM15,000–RM40,000 for an MVP</strong> (about 6–12 weeks), <strong>RM40,000–RM150,000 for a business system</strong> such as an ERP, CRM or POS (about 3–6 months), and <strong>RM150,000–RM400,000+ for an enterprise platform</strong> (6 months or more).",
            "The price depends mostly on how many platforms you need, how many user roles there are, and how many outside systems it has to connect to.",
        ],
        "h_type": "Cost by type of project",
        "p_type": "Typical ranges for a first release. Timelines run from signed scope to launch.",
        "th_type": ["Project", "Typical budget", "Timeline"],
        "weeks": "weeks",
        "h_add": "What adds to the price",
        "p_add": "Each of these is quoted on top of the base project. Most projects use two or three of them.",
        "th_add": ["Add-on", "Adds roughly"],
        "h_svc": "Price bands by service",
        "p_svc": "From the smallest useful build to large multi-company systems. Click a service for scope, features and examples.",
        "th_svc": ["Service", "From", "Large builds up to"],
        "h_drivers": "Why two quotes for the same idea can differ by 3×",
        "drivers": [
            ("User roles", "A customer app with one login is simple. Add staff, managers, branches and an admin, and every screen needs permission rules and testing for each role."),
            ("Platforms", "Web only is cheapest. Native iOS and Android each add design, build, testing and store review. A cross-platform framework such as Flutter keeps this down."),
            ("Integrations", "Connecting to accounting, payment gateways (FPX, e-wallets, cards), SMS, couriers or an existing ERP is often where the hidden work sits."),
            ("Data migration", "Moving years of records out of spreadsheets or an old system needs cleaning, mapping and a dry run before go-live."),
            ("Compliance", "Personal data falls under Malaysia's PDPA. Lending, healthcare and finance usually need audit trails, stricter access control and hosting choices."),
            ("Scope clarity", "A fixed price needs a written scope. Vague briefs get padded quotes, or cheap quotes that grow later."),
        ],
        "h_save": "How to keep the cost down",
        "save": [
            "<strong>Launch an MVP first.</strong> Ship the one workflow that matters, then pay for version two with real usage data.",
            "<strong>Start with one platform.</strong> Web or one mobile platform first; add the other once people use it.",
            "<strong>Use Odoo where it fits.</strong> If standard accounting, inventory or HR modules cover most of your needs, customising Odoo is cheaper than building from zero.",
            "<strong>Reuse what you have.</strong> Connect to your existing accounting or payment provider instead of rebuilding it.",
            "<strong>Insist on a fixed scope.</strong> Get features, user roles and platforms in writing before work starts.",
        ],
        "h_vs": "Custom software or an off-the-shelf subscription?",
        "vs": [
            "If a ready-made SaaS product covers most of what you need, start there. It is cheaper to begin with and you can switch later.",
            "Custom software pays off when your workflow is how you win against competitors, when per-user subscription fees keep climbing as you grow, or when you need several systems to work as one. You also own the code and data outright.",
        ],
        "h_run": "Running costs after launch",
        "run": [
            "Cloud hosting, domain, SMS and payment-gateway fees are billed by those providers, usually monthly.",
            "Publishing apps: the Apple Developer Program is USD 99 a year; a Google Play developer account is a one-time USD 25.",
            "Support and updates: every Trion Creation project has a warranty period after launch, then an optional monthly retainer for fixes, security patches and small changes.",
        ],
        "h_faq": "Frequently asked questions",
        "faq": [
            ("How much does it cost to build an app in Malaysia?",
             "A mobile app typically costs RM15,000–RM60,000 for the first release and takes about 8–14 weeks. Each extra native platform (iOS or Android) adds roughly RM6,000–RM15,000, and an admin panel adds RM8,000–RM15,000."),
            ("How much does an ERP system cost in Malaysia?",
             "A custom ERP, CRM or POS system usually costs RM40,000–RM150,000 and takes 3–6 months. Larger multi-company ERP builds go up to about RM300,000. If standard Odoo modules fit, an Odoo customisation can start from RM20,000."),
            ("How long does custom software development take?",
             "An MVP takes about 6–12 weeks, a business system 3–6 months, and an enterprise platform 6 months or more. Integrations, data migration and extra platforms add time."),
            ("Why do software quotes in Malaysia vary so much?",
             "Quotes are usually priced against different scopes. Compare the number of user roles, platforms, integrations and the support period, and check whether the price is fixed and whether you own the source code."),
            ("Is custom software cheaper than SaaS in the long run?",
             "Not always. SaaS is cheaper to start. Custom software becomes cheaper when per-user fees grow with your team, or when you pay for several tools that a single system could replace."),
            ("What does a Trion Creation quote include?",
             "A fixed price for a written scope covering design, development, testing and deployment, a warranty period after launch, and 100% ownership of the source code and data. The discovery call before the quote is free."),
        ],
        "h_next": "Get a number for your project",
        "p_next": "Use the estimator for a range in under a minute, or send us your idea for a fixed quote.",
        "b_est": "Open the estimator", "b_wa": "WhatsApp Freddy",
    },
    "ms": {
        "title": "Berapakah Kos Perisian Tersuai di Malaysia? (Panduan 2026)",
        "metaTitle": "Kos Pembangunan Perisian di Malaysia (Panduan 2026) | Trion Creation",
        "desc": "Kos perisian tersuai, aplikasi mudah alih dan sistem ERP di Malaysia pada 2026: julat harga mengikut jenis projek, tempoh, faktor kos dan cara menjimatkannya.",
        "crumbHome": "Utama", "crumb": "Panduan kos perisian",
        "eyebrow": "PANDUAN · HARGA",
        "lede": "Julat harga sebenar daripada syarikat perisian di Kuala Lumpur, menggunakan angka yang sama yang kami guna untuk sebut harga.",
        "byline": "Oleh {name}, Pengasas (Teknologi)", "updated": "Dikemas kini",
        "answerKicker": "Jawapan ringkas",
        "answer": [
            "Projek perisian tersuai di Malaysia biasanya berharga <strong>RM15,000–RM40,000 untuk MVP</strong> (kira-kira 6–12 minggu), <strong>RM40,000–RM150,000 untuk sistem perniagaan</strong> seperti ERP, CRM atau POS (kira-kira 3–6 bulan), dan <strong>RM150,000–RM400,000+ untuk platform perusahaan</strong> (6 bulan atau lebih).",
            "Harga paling banyak bergantung pada bilangan platform, bilangan peranan pengguna, dan bilangan sistem luar yang perlu disambungkan.",
        ],
        "h_type": "Kos mengikut jenis projek",
        "p_type": "Julat biasa untuk keluaran pertama. Tempoh dikira dari skop ditandatangani hingga pelancaran.",
        "th_type": ["Projek", "Bajet biasa", "Tempoh"],
        "weeks": "minggu",
        "h_add": "Apa yang menambah harga",
        "p_add": "Setiap satu disebut harga di atas projek asas. Kebanyakan projek menggunakan dua atau tiga daripadanya.",
        "th_add": ["Tambahan", "Menambah kira-kira"],
        "h_svc": "Julat harga mengikut perkhidmatan",
        "p_svc": "Daripada binaan terkecil yang berguna hingga sistem berbilang syarikat. Klik perkhidmatan untuk skop, ciri dan contoh.",
        "th_svc": ["Perkhidmatan", "Dari", "Binaan besar sehingga"],
        "h_drivers": "Kenapa dua sebut harga untuk idea sama boleh berbeza 3×",
        "drivers": [
            ("Peranan pengguna", "Aplikasi pelanggan dengan satu log masuk adalah mudah. Tambah kakitangan, pengurus, cawangan dan admin, dan setiap skrin perlukan peraturan akses dan ujian untuk setiap peranan."),
            ("Platform", "Web sahaja paling murah. iOS dan Android natif masing-masing menambah reka bentuk, binaan, ujian dan semakan kedai aplikasi. Rangka kerja merentas platform seperti Flutter mengurangkan kos ini."),
            ("Integrasi", "Sambungan ke sistem perakaunan, gerbang pembayaran (FPX, e-dompet, kad), SMS, kurier atau ERP sedia ada sering menjadi kerja tersembunyi."),
            ("Pemindahan data", "Memindahkan rekod bertahun-tahun daripada hamparan atau sistem lama perlukan pembersihan, pemetaan dan percubaan sebelum dilancarkan."),
            ("Pematuhan", "Data peribadi tertakluk kepada PDPA Malaysia. Pinjaman, kesihatan dan kewangan biasanya perlukan jejak audit, kawalan akses lebih ketat dan pilihan pengehosan."),
            ("Kejelasan skop", "Harga tetap perlukan skop bertulis. Taklimat yang kabur menghasilkan sebut harga yang dilambungkan, atau sebut harga murah yang naik kemudian."),
        ],
        "h_save": "Cara mengurangkan kos",
        "save": [
            "<strong>Lancarkan MVP dahulu.</strong> Keluarkan satu aliran kerja yang penting, kemudian bayar versi kedua berdasarkan data penggunaan sebenar.",
            "<strong>Mula dengan satu platform.</strong> Web atau satu platform mudah alih dahulu; tambah yang lain apabila orang menggunakannya.",
            "<strong>Guna Odoo jika sesuai.</strong> Jika modul standard perakaunan, inventori atau HR memenuhi kebanyakan keperluan, menyesuaikan Odoo lebih murah daripada membina dari kosong.",
            "<strong>Guna semula apa yang ada.</strong> Sambung ke sistem perakaunan atau pembayaran sedia ada dan bukannya membinanya semula.",
            "<strong>Tuntut skop tetap.</strong> Dapatkan ciri, peranan pengguna dan platform secara bertulis sebelum kerja bermula.",
        ],
        "h_vs": "Perisian tersuai atau langganan siap guna?",
        "vs": [
            "Jika produk SaaS siap guna memenuhi kebanyakan keperluan anda, mulakan di situ. Ia lebih murah untuk bermula dan anda boleh bertukar kemudian.",
            "Perisian tersuai berbaloi apabila aliran kerja anda ialah kelebihan berbanding pesaing, apabila yuran langganan setiap pengguna terus naik apabila anda berkembang, atau apabila beberapa sistem perlu berfungsi sebagai satu. Anda juga memiliki kod dan data sepenuhnya.",
        ],
        "h_run": "Kos berjalan selepas pelancaran",
        "run": [
            "Pengehosan awan, domain, SMS dan yuran gerbang pembayaran dibilkan oleh pembekal tersebut, biasanya setiap bulan.",
            "Menerbitkan aplikasi: Apple Developer Program berharga USD 99 setahun; akaun pembangun Google Play ialah USD 25 sekali sahaja.",
            "Sokongan dan kemas kini: setiap projek Trion Creation ada tempoh waranti selepas pelancaran, kemudian retainer bulanan pilihan untuk pembetulan, tampalan keselamatan dan perubahan kecil.",
        ],
        "h_faq": "Soalan lazim",
        "faq": [
            ("Berapakah kos membina aplikasi di Malaysia?",
             "Aplikasi mudah alih biasanya berharga RM15,000–RM60,000 untuk keluaran pertama dan mengambil kira-kira 8–14 minggu. Setiap platform natif tambahan (iOS atau Android) menambah kira-kira RM6,000–RM15,000, dan panel admin menambah RM8,000–RM15,000."),
            ("Berapakah kos sistem ERP di Malaysia?",
             "Sistem ERP, CRM atau POS tersuai biasanya berharga RM40,000–RM150,000 dan mengambil 3–6 bulan. Binaan ERP berbilang syarikat yang lebih besar mencecah kira-kira RM300,000. Jika modul Odoo standard sesuai, penyesuaian Odoo boleh bermula dari RM20,000."),
            ("Berapa lama pembangunan perisian tersuai?",
             "MVP mengambil kira-kira 6–12 minggu, sistem perniagaan 3–6 bulan, dan platform perusahaan 6 bulan atau lebih. Integrasi, pemindahan data dan platform tambahan menambah masa."),
            ("Kenapa sebut harga perisian di Malaysia sangat berbeza?",
             "Sebut harga biasanya dibuat untuk skop yang berbeza. Bandingkan bilangan peranan pengguna, platform, integrasi dan tempoh sokongan, dan semak sama ada harganya tetap dan sama ada anda memiliki kod sumber."),
            ("Adakah perisian tersuai lebih murah daripada SaaS dalam jangka panjang?",
             "Tidak selalu. SaaS lebih murah untuk bermula. Perisian tersuai menjadi lebih murah apabila yuran setiap pengguna naik dengan pasukan anda, atau apabila anda membayar beberapa alat yang boleh diganti dengan satu sistem."),
            ("Apa yang termasuk dalam sebut harga Trion Creation?",
             "Harga tetap untuk skop bertulis merangkumi reka bentuk, pembangunan, ujian dan pelaksanaan, tempoh waranti selepas pelancaran, dan pemilikan 100% kod sumber dan data. Panggilan penerokaan sebelum sebut harga adalah percuma."),
        ],
        "h_next": "Dapatkan angka untuk projek anda",
        "p_next": "Guna penganggar untuk julat dalam masa kurang seminit, atau hantar idea anda untuk sebut harga tetap.",
        "b_est": "Buka penganggar", "b_wa": "WhatsApp Freddy",
    },
    "zh": {
        "title": "在马来西亚开发定制软件要多少钱？（2026 指南）",
        "metaTitle": "马来西亚软件开发费用（2026 指南）| Trion Creation",
        "desc": "2026 年马来西亚定制软件、手机应用与 ERP 系统的开发费用：按项目类型的价格区间、工期、影响成本的因素，以及如何控制预算。",
        "crumbHome": "首页", "crumb": "软件费用指南",
        "eyebrow": "指南 · 价格",
        "lede": "来自吉隆坡软件公司的真实价格区间，与我们报价时使用的数字一致。",
        "byline": "作者：{name}，创办人（技术）", "updated": "更新于",
        "answerKicker": "简短回答",
        "answer": [
            "在马来西亚，定制软件项目通常为：<strong>MVP 约 RM15,000–RM40,000</strong>（约 6–12 周）；<strong>ERP、CRM 或 POS 等业务系统约 RM40,000–RM150,000</strong>（约 3–6 个月）；<strong>企业级平台约 RM150,000–RM400,000 以上</strong>（6 个月或更长）。",
            "价格主要取决于需要几个平台、有多少种用户角色，以及要对接多少个外部系统。",
        ],
        "h_type": "按项目类型的费用",
        "p_type": "首个版本的常见区间。工期从签订范围到上线计算。",
        "th_type": ["项目", "常见预算", "工期"],
        "weeks": "周",
        "h_add": "哪些功能会增加费用",
        "p_add": "以下每项都在基础项目之上另行报价。大多数项目会用到其中两三项。",
        "th_add": ["附加项", "大约增加"],
        "h_svc": "各项服务的价格区间",
        "p_svc": "从最小可用版本到多公司大型系统。点击服务查看范围、功能与案例。",
        "th_svc": ["服务", "起价", "大型项目可达"],
        "h_drivers": "为什么同一个想法的两份报价可以相差 3 倍",
        "drivers": [
            ("用户角色", "只有一种登录的客户应用很简单。加上员工、经理、分行和管理员后，每个页面都需要为每个角色设定权限并测试。"),
            ("平台", "只做网页最便宜。原生 iOS 和 Android 各自增加设计、开发、测试和商店审核。使用 Flutter 等跨平台框架可以降低这部分成本。"),
            ("系统对接", "对接会计系统、支付网关（FPX、电子钱包、银行卡）、短信、快递或现有 ERP，往往是隐藏工作量最多的地方。"),
            ("数据迁移", "把多年的记录从表格或旧系统迁移过来，需要清理、映射，并在上线前试运行。"),
            ("合规", "个人资料受马来西亚 PDPA 约束。借贷、医疗与金融通常需要审计记录、更严格的权限控制和合适的托管方案。"),
            ("范围清晰度", "固定价格需要书面范围。描述模糊的需求会得到偏高的报价，或之后不断加价的低价报价。"),
        ],
        "h_save": "如何控制成本",
        "save": [
            "<strong>先上线 MVP。</strong>先做最关键的一个流程，再根据真实使用数据投入第二版。",
            "<strong>先做一个平台。</strong>先做网页或一个手机平台，有人使用后再加另一个。",
            "<strong>适合时使用 Odoo。</strong>如果标准的会计、库存或人事模块已能满足大部分需求，定制 Odoo 比从零开发更省钱。",
            "<strong>沿用现有系统。</strong>对接现有的会计或支付服务，而不是重新开发。",
            "<strong>坚持固定范围。</strong>开工前把功能、用户角色和平台写清楚。",
        ],
        "h_vs": "定制软件还是现成订阅软件？",
        "vs": [
            "如果现成的 SaaS 产品已能满足大部分需求，就先用它。起步更便宜，之后也可以再换。",
            "当你的业务流程正是你胜过竞争对手的关键、按用户收费的订阅随团队扩大而不断上涨，或需要多个系统像一个系统一样运作时，定制软件才划算。你也完全拥有代码和数据。",
        ],
        "h_run": "上线后的运营成本",
        "run": [
            "云托管、域名、短信和支付网关费用由相应服务商收取，通常按月计费。",
            "应用上架：Apple Developer Program 每年 99 美元；Google Play 开发者账号一次性 25 美元。",
            "维护与更新：每个 Trion Creation 项目上线后都有保修期，之后可选择按月维护，涵盖修复、安全补丁和小改动。",
        ],
        "h_faq": "常见问题",
        "faq": [
            ("在马来西亚开发一个 App 要多少钱？",
             "手机应用首个版本通常为 RM15,000–RM60,000，约需 8–14 周。每增加一个原生平台（iOS 或 Android）约增加 RM6,000–RM15,000，管理后台约增加 RM8,000–RM15,000。"),
            ("在马来西亚做 ERP 系统要多少钱？",
             "定制 ERP、CRM 或 POS 系统通常为 RM40,000–RM150,000，约需 3–6 个月。较大型的多公司 ERP 可达约 RM300,000。如果标准 Odoo 模块适用，Odoo 定制可从 RM20,000 起。"),
            ("定制软件开发需要多长时间？",
             "MVP 约 6–12 周，业务系统 3–6 个月，企业级平台 6 个月或更长。系统对接、数据迁移和增加平台都会延长工期。"),
            ("为什么马来西亚的软件报价差距这么大？",
             "通常是因为报价对应的范围不同。请比较用户角色数量、平台、对接系统和维护期，并确认价格是否固定、源代码是否归你所有。"),
            ("长期来看，定制软件比 SaaS 便宜吗？",
             "不一定。SaaS 起步更便宜。当按用户收费随团队扩大而上涨，或你同时为多个工具付费而一个系统就能取代它们时，定制软件会更划算。"),
            ("Trion Creation 的报价包含什么？",
             "针对书面范围的固定价格，涵盖设计、开发、测试与部署，上线后的保修期，以及源代码和数据 100% 归你所有。报价前的需求沟通免费。"),
        ],
        "h_next": "为你的项目算一个数字",
        "p_next": "用估算器不到一分钟得到区间，或把你的想法发给我们获取固定报价。",
        "b_est": "打开估算器", "b_wa": "WhatsApp Freddy",
    },
}


def load_services(loc):
    base = json.loads((SCRIPTS / "services.json").read_text("utf8"))
    if loc == "en":
        return base
    f = SCRIPTS / "i18n" / f"services.{loc}.json"
    tr = {s["slug"]: s for s in json.loads(f.read_text("utf8"))} if f.exists() else {}
    return [{**s, "title": tr.get(s["slug"], s).get("title", s["title"])} for s in base]


def chrome(loc):
    """Header + footer from the same-locale ERP service page, retargeted at the guide."""
    d = LOC[loc]["dir"]
    src = (ROOT / d / "services" / "erp-crm-development.html").read_text("utf8")
    css = re.search(r'    <link rel="stylesheet" href="(?:\.\./)+styles\.css">', src)
    head_tail = src[css.start():src.index("</head>")]
    body_open = src[src.index("<body"):src.index("</header>") + len("</header>")]
    body_open = body_open.replace("services/erp-crm-development.html", f"guides/{SLUG}.html")
    body_open = body_open.replace(' class="nav-link active"', ' class="nav-link"')
    body_open = re.sub(r'<body[^>]*>', '<body class="has-pc guide-page" style="--pc:#71EECE">', body_open, count=1)
    foot = src[src.index("    <footer"):]
    return head_tail, body_open, foot


def build(loc):
    t = T[loc]
    copy = json.loads((SCRIPTS / "home" / f"copy.{loc}.json").read_text("utf8"))["estimate"]
    services = load_services(loc)
    head_tail, body_open, foot = chrome(loc)
    me = url(loc)
    home = f"{ORIGIN}/{LOC[loc]['dir'] + '/' if LOC[loc]['dir'] else ''}"
    author = "Freddy Chia"

    alts = "\n".join(f'    <link rel="alternate" hreflang="{LOC[l]["hreflang"]}" href="{url(l)}">' for l in LOC)
    alts += f'\n    <link rel="alternate" hreflang="x-default" href="{url("en")}">'

    article = {
        "@context": "https://schema.org", "@type": "Article", "@id": me + "#article",
        "headline": t["title"], "description": t["desc"], "inLanguage": LOC[loc]["hreflang"],
        "datePublished": PUBLISHED, "dateModified": TODAY, "mainEntityOfPage": me,
        "image": f"{ORIGIN}/images/og/og-home-{loc}.jpg",
        "author": {"@type": "Person", "name": author, "jobTitle": "Founder, Technology",
                   "worksFor": {"@id": f"{ORIGIN}/#organization"}, "url": f"{ORIGIN}/#founders"},
        "publisher": {"@id": f"{ORIGIN}/#organization"},
        "about": ["Custom software development", "Software development cost", "Malaysia"],
    }
    faq = {
        "@context": "https://schema.org", "@type": "FAQPage", "inLanguage": LOC[loc]["hreflang"],
        "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": ans}} for q, ans in t["faq"]],
    }
    crumbs = {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": t["crumbHome"], "item": home},
            {"@type": "ListItem", "position": 2, "name": t["crumb"], "item": me},
        ],
    }
    ld = "\n".join(f'    <script type="application/ld+json">\n{json.dumps(x, ensure_ascii=False, indent=4)}\n    </script>'
                   for x in (article, faq, crumbs))

    # tables
    type_rows = "".join(
        f"<tr><th scope=\"row\">{e(lbl)}</th><td>{rm(mn)} – {rm(mx)}</td><td>{wmn}–{wmx} {e(t['weeks'])}</td></tr>"
        for _, lbl, mn, mx, wmn, wmx in copy["types"])
    add_rows = "".join(
        f"<tr><th scope=\"row\">{e(lbl)}</th><td>+{rm(mn)} – {rm(mx)}</td></tr>"
        for k, lbl, mn, mx in copy["platforms"] if mx)
    add_rows += "".join(
        f"<tr><th scope=\"row\">{e(lbl)}</th><td>+{rm(mn)} – {rm(mx)}</td></tr>"
        for _, lbl, mn, mx, _w in copy["features"])
    svc_rows = "".join(
        f"<tr><th scope=\"row\"><a href=\"../services/{s['slug']}.html\">{e(s['title'])}</a></th>"
        f"<td>{rm(s['priceMin'])}</td><td>{rm(s['priceMax'])}</td></tr>"
        for s in services)

    def table(cls, heads, rows):
        th = "".join(f'<th scope="col">{e(h)}</th>' for h in heads)
        return f'<div class="guide-table-wrap"><table class="guide-table {cls}"><thead><tr>{th}</tr></thead><tbody>{rows}</tbody></table></div>'

    drivers = "".join(f'<li><h3>{e(h)}</h3><p>{e(p)}</p></li>' for h, p in t["drivers"])
    save = "".join(f"<li>{s}</li>" for s in t["save"])
    vs = "".join(f"<p>{e(p)}</p>" for p in t["vs"])
    run = "".join(f"<li>{e(p)}</li>" for p in t["run"])
    answer = "".join(f"<p>{p}</p>" for p in t["answer"])
    faq_html = "".join(
        f'<details class="faq-item"{" open" if i == 0 else ""}><summary class="faq-q"><span>{e(q)}</span>'
        f'<svg class="faq-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" '
        f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>'
        f'<div class="faq-a"><p>{e(ans)}</p></div></details>'
        for i, (q, ans) in enumerate(t["faq"]))
    upd = datetime.date.fromisoformat(TODAY)
    upd_txt = upd.strftime("%-d %b %Y") if loc != "zh" else f"{upd.year} 年 {upd.month} 月 {upd.day} 日"

    def sec(n, h, inner):
        return (f'        <section class="pf-section">\n            <div class="container guide-container">\n'
                f'                <div class="pf-section-head"><span class="pf-section-num">{n:02d}</span><h2>{e(h)}</h2></div>\n'
                f'                {inner}\n            </div>\n        </section>\n')

    body = (
        f'    <main class="main-content" id="main">\n'
        f'        <section class="guide-hero">\n            <div class="container guide-container">\n'
        f'                <nav class="pf-breadcrumb" aria-label="Breadcrumb"><a href="../index.html">{e(t["crumbHome"])}</a>'
        f'<span class="pf-breadcrumb-sep">›</span><span>{e(t["crumb"])}</span></nav>\n'
        f'                <p class="block-kicker"><span class="kd"></span>{e(t["eyebrow"])}</p>\n'
        f'                <h1>{e(t["title"])}</h1>\n'
        f'                <p class="guide-lede">{e(t["lede"])}</p>\n'
        f'                <p class="guide-meta"><a href="../index.html#founders">{e(t["byline"].format(name=author))}</a>'
        f' · {e(t["updated"])} <time datetime="{TODAY}">{e(upd_txt)}</time></p>\n'
        f'                <div class="guide-answer"><p class="ga-kicker">{e(t["answerKicker"])}</p>{answer}</div>\n'
        f'            </div>\n        </section>\n'
        + sec(1, t["h_type"], f'<p class="guide-p">{e(t["p_type"])}</p>' + table("t-type", t["th_type"], type_rows))
        + sec(2, t["h_add"], f'<p class="guide-p">{e(t["p_add"])}</p>' + table("t-add", t["th_add"], add_rows))
        + sec(3, t["h_drivers"], f'<ul class="guide-drivers">{drivers}</ul>')
        + sec(4, t["h_svc"], f'<p class="guide-p">{e(t["p_svc"])}</p>' + table("t-svc", t["th_svc"], svc_rows))
        + sec(5, t["h_save"], f'<ul class="guide-list">{save}</ul>')
        + sec(6, t["h_vs"], f'<div class="guide-prose">{vs}</div>')
        + sec(7, t["h_run"], f'<ul class="guide-list">{run}</ul>')
        + sec(8, t["h_faq"], f'<div class="faq-list">{faq_html}</div>')
        + f'        <section class="pf-section">\n            <div class="container guide-container">\n'
        f'                <div class="guide-next"><h2>{e(t["h_next"])}</h2><p>{e(t["p_next"])}</p>'
        f'<div class="guide-next-actions"><a class="btn btn-primary btn-lg" href="../index.html#estimate">{e(t["b_est"])}</a>'
        f'<a class="btn btn-secondary btn-lg" href="https://wa.me/60166380495" target="_blank" rel="noopener noreferrer">{e(t["b_wa"])}</a></div></div>\n'
        f'            </div>\n        </section>\n'
        f'    </main>\n\n'
    )

    page = f'''<!DOCTYPE html>
<html lang="{LOC[loc]["html"]}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{e(t["metaTitle"])}</title>
    <meta name="description" content="{a(t["desc"])}">
    <meta name="author" content="{author}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <link rel="canonical" href="{me}">
{alts}
    <meta property="og:type" content="article">
    <meta property="og:url" content="{me}">
    <meta property="og:title" content="{a(t["title"])}">
    <meta property="og:description" content="{a(t["desc"])}">
    <meta property="og:image" content="{ORIGIN}/images/og/og-home-{loc}.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="{LOC[loc]["og"]}">
    <meta property="og:site_name" content="Trion Creation">
    <meta property="article:published_time" content="{PUBLISHED}">
    <meta property="article:modified_time" content="{TODAY}">
    <meta name="twitter:card" content="summary_large_image">
{ld}
{head_tail}</head>
{body_open}

{body}{foot}'''
    out = ROOT / LOC[loc]["dir"] / "guides" / f"{SLUG}.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, "utf8")
    print("guide ->", out.relative_to(ROOT))


if __name__ == "__main__":
    for loc in LOC:
        build(loc)
