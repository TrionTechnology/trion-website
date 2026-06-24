'use strict';
/**
 * UI string dictionary + locale config for the multilingual build.
 * en = English (site root), zh = Simplified Chinese (/zh/), ms = Bahasa Malaysia (/ms/).
 *
 * Only fixed/chrome strings live here (nav, footer, section headings, CTAs,
 * JSON-LD FAQ templates). Page CONTENT comes from the translated JSON data files
 * (services.<lang>.json / portfolio.<lang>.json).
 */

const LOCALES = ['en', 'zh', 'ms'];

// Locale metadata used for <html lang>, hreflang and output directory.
const META = {
    en: { htmlLang: 'en',      hreflang: 'en',      dir: '' },
    zh: { htmlLang: 'zh-Hans', hreflang: 'zh-Hans', dir: 'zh' },
    ms: { htmlLang: 'ms',      hreflang: 'ms',      dir: 'ms' },
};

const fmtRM = (n) => 'RM' + Number(n).toLocaleString('en-US');

const UI = {
    en: {
        nav: { home: 'Home', about: 'About', services: 'Services', portfolio: 'Portfolio', partnerships: 'Partnerships', techStack: 'Tech Stack', faq: 'FAQ', contact: 'Contact' },
        getStarted: 'Get Started',
        whatsapp: 'WhatsApp Us',
        bookCall: 'Book Discovery Call',
        langLabel: 'EN',
        footer: {
            tagline: 'We Build Any System You Need — Fast, Modern &amp; Fully Custom.',
            servicesH: 'Services', allServices: 'All Services', mobileWeb: 'Mobile &amp; Web App', erpCrm: 'ERP &amp; CRM', aiChatbot: 'AI &amp; Chatbot',
            portfolioH: 'Portfolio', allSolutions: 'All Solutions', yippi: 'Yippi Case Study',
            companyH: 'Company', about: 'About', portfolio: 'Portfolio', contact: 'Contact',
            rights: 'All rights reserved.',
        },
        svc: {
            home: 'Home', services: 'Services',
            overview: 'Service Overview', keyFeatures: 'Key Features', expertise: 'Our Expertise',
            ctaTitle: (t) => `Ready to start your ${t.toLowerCase()} project?`,
            ctaBody: "Book a free discovery call. We'll scope your needs and give a fixed-price quote — no hidden costs.",
        },
        pf: {
            home: 'Home', portfolio: 'Portfolio', solution: 'SOLUTION',
            overview: 'Overview', keyFeatures: 'Key Features', builtWith: 'Built With', useCases: 'Use Cases',
            builtWithProse: "Our recommended stack for this solution. Every project is tailored — we'll adjust based on your team, infrastructure and integration needs.",
            perfectFor: 'Perfect For', industries: "Industries We've Built For",
            discuss: 'Discuss This Project', readyToBuild: 'READY TO BUILD?',
            ctaTitle: (t) => `Let's build your ${t.toLowerCase()}.`,
            ctaBody: "Book a free discovery call — we'll scope your needs and give a fixed-price quote with no hidden costs.",
        },
        faqSvc: (s) => [
            { q: `How long does ${s.title.toLowerCase()} typically take with Trion Creation?`,
              a: `Most ${s.title.toLowerCase()} projects fall into one of three bands. MVPs typically take 6–12 weeks. Mid-size systems take 3–4 months. Enterprise platforms can take 3–6 months depending on integrations and compliance requirements. We give a fixed timeline after the free discovery call.` },
            { q: `What does ${s.title.toLowerCase()} cost in Malaysia?`,
              a: `For ${s.title.toLowerCase()}, Trion Creation projects typically range from ${fmtRM(s.priceMin)} for smaller scoped builds to ${fmtRM(s.priceMax)}+ for enterprise platforms. Fixed-scope quote provided after a discovery call — no hidden costs.` },
        ],
        faqPf: (p) => [
            { q: `What is a ${p.title.toLowerCase()}?`, a: p.longDescription },
            { q: `What technologies are used to build a ${p.title.toLowerCase()}?`, a: `Trion Creation typically builds ${p.title.toLowerCase()} using ${p.techStack.join(', ')}.` },
            { q: `Who is a ${p.title.toLowerCase()} suitable for?`, a: `A ${p.title.toLowerCase()} is suitable for ${p.useCases.join(', ')}. We have delivered similar systems across ${p.industries.join(', ')}.` },
        ],
    },

    zh: {
        nav: { home: '首页', about: '关于我们', services: '服务', portfolio: '案例', partnerships: '合作伙伴', techStack: '技术栈', faq: '常见问题', contact: '联系我们' },
        getStarted: '立即开始',
        whatsapp: 'WhatsApp 联系',
        bookCall: '预约免费咨询',
        langLabel: '中文',
        footer: {
            tagline: '您需要的任何系统，我们都能打造 —— 快速、现代、完全定制。',
            servicesH: '服务', allServices: '全部服务', mobileWeb: '移动与网页应用', erpCrm: 'ERP 与 CRM', aiChatbot: 'AI 与聊天机器人',
            portfolioH: '案例', allSolutions: '全部解决方案', yippi: 'Yippi 案例研究',
            companyH: '公司', about: '关于我们', portfolio: '案例', contact: '联系我们',
            rights: '版权所有。',
        },
        svc: {
            home: '首页', services: '服务',
            overview: '服务概览', keyFeatures: '核心功能', expertise: '我们的专长',
            ctaTitle: (t) => `准备好启动您的${t}项目了吗？`,
            ctaBody: '预约一次免费的咨询通话。我们会梳理您的需求，并提供固定报价 —— 绝无隐藏费用。',
        },
        pf: {
            home: '首页', portfolio: '案例', solution: '解决方案',
            overview: '概览', keyFeatures: '核心功能', builtWith: '技术构建', useCases: '应用场景',
            builtWithProse: '这是我们为此类解决方案推荐的技术栈。每个项目都量身定制 —— 我们会根据您的团队、基础设施和集成需求进行调整。',
            perfectFor: '适合于', industries: '我们服务过的行业',
            discuss: '洽谈此项目', readyToBuild: '准备好开始了吗？',
            ctaTitle: (t) => `让我们一起打造您的${t}。`,
            ctaBody: '预约一次免费的咨询通话 —— 我们会梳理您的需求，并提供固定报价，绝无隐藏费用。',
        },
        faqSvc: (s) => [
            { q: `在 Trion Creation，${s.title}通常需要多长时间？`,
              a: `大多数${s.title}项目分为三个区间：最小可行产品（MVP）通常需要 6–12 周；中型系统需要 3–4 个月；企业级平台视集成与合规要求而定，可能需要 3–6 个月。免费咨询通话后，我们会给出固定的交付时间表。` },
            { q: `在马来西亚，${s.title}的费用是多少？`,
              a: `对于${s.title}，Trion Creation 的项目通常从约 ${fmtRM(s.priceMin)}（小型定制项目）到 ${fmtRM(s.priceMax)}+（企业级平台）不等。咨询通话后我们会提供固定范围报价 —— 绝无隐藏费用。` },
        ],
        faqPf: (p) => [
            { q: `什么是${p.title}？`, a: p.longDescription },
            { q: `构建${p.title}使用哪些技术？`, a: `Trion Creation 通常使用 ${p.techStack.join('、')} 来构建${p.title}。` },
            { q: `${p.title}适合谁使用？`, a: `${p.title}适用于${p.useCases.join('、')}。我们已在${p.industries.join('、')}等行业交付过类似系统。` },
        ],
    },

    ms: {
        nav: { home: 'Utama', about: 'Tentang', services: 'Perkhidmatan', portfolio: 'Portfolio', partnerships: 'Perkongsian', techStack: 'Teknologi', faq: 'Soalan Lazim', contact: 'Hubungi' },
        getStarted: 'Mula Sekarang',
        whatsapp: 'WhatsApp Kami',
        bookCall: 'Tempah Sesi Perundingan',
        langLabel: 'BM',
        footer: {
            tagline: 'Kami Bina Apa Sahaja Sistem Yang Anda Perlukan — Pantas, Moden &amp; Tersuai Sepenuhnya.',
            servicesH: 'Perkhidmatan', allServices: 'Semua Perkhidmatan', mobileWeb: 'Aplikasi Mudah Alih &amp; Web', erpCrm: 'ERP &amp; CRM', aiChatbot: 'AI &amp; Chatbot',
            portfolioH: 'Portfolio', allSolutions: 'Semua Penyelesaian', yippi: 'Kajian Kes Yippi',
            companyH: 'Syarikat', about: 'Tentang', portfolio: 'Portfolio', contact: 'Hubungi',
            rights: 'Hak cipta terpelihara.',
        },
        svc: {
            home: 'Utama', services: 'Perkhidmatan',
            overview: 'Gambaran Perkhidmatan', keyFeatures: 'Ciri Utama', expertise: 'Kepakaran Kami',
            ctaTitle: (t) => `Sedia untuk memulakan projek ${t.toLowerCase()} anda?`,
            ctaBody: 'Tempah sesi perundingan percuma. Kami akan menilai keperluan anda dan memberikan sebut harga tetap — tanpa kos tersembunyi.',
        },
        pf: {
            home: 'Utama', portfolio: 'Portfolio', solution: 'PENYELESAIAN',
            overview: 'Gambaran Keseluruhan', keyFeatures: 'Ciri Utama', builtWith: 'Dibina Dengan', useCases: 'Kegunaan',
            builtWithProse: 'Inilah tindanan teknologi yang kami cadangkan untuk penyelesaian ini. Setiap projek disesuaikan — kami akan ubah suai mengikut pasukan, infrastruktur dan keperluan integrasi anda.',
            perfectFor: 'Sesuai Untuk', industries: 'Industri Yang Telah Kami Layani',
            discuss: 'Bincang Projek Ini', readyToBuild: 'SEDIA UNTUK BINA?',
            ctaTitle: (t) => `Mari kita bina ${t.toLowerCase()} anda.`,
            ctaBody: 'Tempah sesi perundingan percuma — kami akan menilai keperluan anda dan memberikan sebut harga tetap tanpa kos tersembunyi.',
        },
        faqSvc: (s) => [
            { q: `Berapa lama ${s.title.toLowerCase()} biasanya mengambil masa dengan Trion Creation?`,
              a: `Kebanyakan projek ${s.title.toLowerCase()} terbahagi kepada tiga julat. MVP biasanya mengambil masa 6–12 minggu. Sistem bersaiz sederhana mengambil masa 3–4 bulan. Platform perusahaan boleh mengambil masa 3–6 bulan bergantung pada integrasi dan keperluan pematuhan. Kami berikan jadual masa tetap selepas sesi perundingan percuma.` },
            { q: `Berapakah kos ${s.title.toLowerCase()} di Malaysia?`,
              a: `Untuk ${s.title.toLowerCase()}, projek Trion Creation biasanya berjulat dari ${fmtRM(s.priceMin)} bagi pembinaan berskop kecil hingga ${fmtRM(s.priceMax)}+ bagi platform perusahaan. Sebut harga skop tetap diberikan selepas sesi perundingan — tanpa kos tersembunyi.` },
        ],
        faqPf: (p) => [
            { q: `Apakah itu ${p.title.toLowerCase()}?`, a: p.longDescription },
            { q: `Apakah teknologi yang digunakan untuk membina ${p.title.toLowerCase()}?`, a: `Trion Creation biasanya membina ${p.title.toLowerCase()} menggunakan ${p.techStack.join(', ')}.` },
            { q: `Untuk siapa ${p.title.toLowerCase()} ini sesuai?`, a: `${p.title} sesuai untuk ${p.useCases.join(', ')}. Kami telah menyampaikan sistem serupa merentasi ${p.industries.join(', ')}.` },
        ],
    },
};

module.exports = { LOCALES, META, UI, fmtRM };
