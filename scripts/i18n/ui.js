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

/* Service and portfolio titles are acronym-heavy (ERP, CRM, POS, API, HRMS,
   F&B, AR/VR, DevOps). Lower-casing them inside a sentence reads as a typo,
   so titles are used verbatim and only the English article is derived.
   An all-caps acronym takes "an" when its first LETTER NAME starts with a
   vowel sound — ERP ("ee-arr-pee"), HRMS ("aitch"), API ("ay") — which is a
   different rule from ordinary words. */
const ACRONYM_AN = new Set('AEFHILMNORSX'.split(''));
const aAn = (title) => {
    const first = String(title).trim().split(/\s+/)[0] || '';
    const letters = first.replace(/[^A-Za-z]/g, '');
    const isAcronym = letters.length >= 2 && letters === letters.toUpperCase();
    const takesAn = isAcronym
        ? ACRONYM_AN.has(letters[0])
        : /^[aeiou]/i.test(first);
    return (takesAn ? 'an ' : 'a ') + title;
};

const UI = {
    en: {
        nav: { home: 'Home', about: 'About', services: 'Services', portfolio: 'Portfolio', partnerships: 'Partnerships', products: 'Products', faq: 'FAQ', contact: 'Contact' },
        getStarted: 'Get Started',
        whatsapp: 'WhatsApp Us',
        bookCall: 'Book Discovery Call',
        langLabel: 'EN',
        faqH: 'Frequently Asked Questions',
        faqIntro: 'Straight answers to what clients ask us most before a project starts.',
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
            ctaTitle: (t) => `Ready to start your ${t} project?`,
            ctaBody: "Book a free discovery call. We'll scope your needs and give a fixed-price quote — no hidden costs.",
        },
        pf: {
            home: 'Home', portfolio: 'Portfolio', solution: 'SOLUTION',
            overview: 'Overview', keyFeatures: 'Key Features', builtWith: 'Built With', useCases: 'Use Cases',
            builtWithProse: "Our recommended stack for this solution. Every project is tailored — we'll adjust based on your team, infrastructure and integration needs.",
            perfectFor: 'Perfect For', industries: "Industries We've Built For",
            discuss: 'Discuss This Project', readyToBuild: 'READY TO BUILD?',
            ctaTitle: (t) => `Let's build your ${t}.`,
            ctaBody: "Book a free discovery call — we'll scope your needs and give a fixed-price quote with no hidden costs.",
        },
        faqSvc: (s) => [
            { q: `How long does ${s.title} typically take with Trion Creation?`,
              a: `Most ${s.title} projects fall into one of three bands. MVPs typically take 6–12 weeks. Mid-size systems take 3–4 months. Enterprise platforms can take 3–6 months depending on integrations and compliance requirements. We give a fixed timeline after the free discovery call.` },
            { q: `What does ${s.title} cost in Malaysia?`,
              a: `For ${s.title}, Trion Creation projects typically range from ${fmtRM(s.priceMin)} for smaller scoped builds to ${fmtRM(s.priceMax)}+ for enterprise platforms. Fixed-scope quote provided after a discovery call — no hidden costs.` },
            { q: `Who owns the source code for ${aAn(s.title)} project?`,
              a: `You do. Trion Creation clients own 100% of the source code and data we produce for them. We sign NDAs, follow secure SDLC practices, and can deploy to your own AWS, Alibaba Cloud or on-premise infrastructure if you prefer to keep everything in your own environment.` },
            { q: `Do you provide support and maintenance after launch?`,
              a: `Yes. Every Trion Creation project includes a warranty period after handover, and we offer monthly support retainers covering bug fixes, security patches, server monitoring, feature updates and 24/7 critical incident response.` },
            { q: `Can you integrate ${s.title} with our existing systems?`,
              a: `Yes. We regularly integrate with existing ERP, accounting, payment and logistics platforms, and we customise or migrate from Odoo, WordPress, Laravel and legacy PHP systems — including full data migration and re-platforming without downtime.` },
            { q: `Does Trion Creation take ${s.title} projects outside Malaysia?`,
              a: `Yes. Trion Creation is based in Kuala Lumpur, Malaysia and also delivers projects for clients in Singapore, Thailand and Indonesia. Discovery calls, delivery and support all run remotely.` },
        ],
        faqPf: (p) => [
            { q: `What is ${aAn(p.title)}?`, a: p.longDescription },
            { q: `What technologies are used to build ${aAn(p.title)}?`, a: `Trion Creation typically builds ${p.title} using ${p.techStack.join(', ')}.` },
            { q: `Who is ${aAn(p.title)} suitable for?`, a: `${aAn(p.title).charAt(0).toUpperCase() + aAn(p.title).slice(1)} is suitable for ${p.useCases.join(', ')}. We have delivered similar systems across ${p.industries.join(', ')}.` },
            { q: `How long does it take to build ${aAn(p.title)}?`,
              a: `A ${p.title} MVP typically takes 6–12 weeks to build. A full production system with integrations usually takes 3–6 months, depending on scope and compliance requirements. Trion Creation confirms a fixed timeline after the free discovery call.` },
            { q: `How much does ${aAn(p.title)} cost in Malaysia?`,
              a: `Typical project bands are RM15,000–40,000 for an MVP, RM40,000–150,000 for a mid-size business system, and RM150,000+ for an enterprise platform. Trion Creation provides a fixed-scope quote after the first discovery call — no hidden costs.` },
            { q: `Do we own the source code of the ${p.title}?`,
              a: `Yes. Clients own 100% of the source code and data. Trion Creation signs NDAs and can deploy to your own AWS, Alibaba Cloud or on-premise infrastructure.` },
        ],
        faqProd: (products) => {
            const live = products.filter((p) => p.status === 'live');
            const soon = products.filter((p) => p.status !== 'live');
            const names = products.map((p) => p.name).join(' and ');
            return [
                { q: 'What products has Trion Creation built?',
                  a: `Trion Creation currently publishes ${names}. ` + products.map((p) => `${p.name} — ${p.tagline} ${p.description}`).join(' ') },
                ...products.map((p) => ({
                    q: `What is ${p.name}?`,
                    a: `${p.name} is a ${p.category.toLowerCase()} app built and published by Trion Creation Sdn Bhd for ${p.platforms.join(' and ')}. ${p.description}`,
                })),
                { q: 'Are these client projects or Trion Creation\u2019s own apps?',
                  a: 'These are our own products. Trion Creation designs, builds, publishes and maintains them end to end — they are not client work. We build them to prove the standard we ship at when we are the customer.' },
                ...(live.length ? [{ q: `Where can I download ${live.map((p) => p.name).join(' and ')}?`,
                  a: `${live.map((p) => `${p.name} is available on ${p.platforms.join(' and ')}`).join('. ')}. Links are on each product card above.` }] : []),
                ...(soon.length ? [{ q: `When is ${soon.map((p) => p.name).join(' and ')} launching?`,
                  a: `${soon.map((p) => p.name).join(' and ')} is still in development and has not been released to the app stores yet. Store links will appear on this page as soon as it goes live.` }] : []),
                { q: 'Can Trion Creation build an app like this for my business?',
                  a: 'Yes. Building our own products is the same work we do for clients — custom mobile and web apps, AI features, backends and cloud infrastructure. Book a free discovery call and we will scope your idea and give a fixed-price quote.' },
            ];
        },
        prod: {
            home: 'Home', products: 'Products',
            eyebrow: 'BUILT & PUBLISHED BY TRION',
            title: 'Our Products',
            subtitle: "Apps we design, build and publish ourselves — not client work. A proof of what we ship when we're the customer.",
            live: 'Live', comingSoon: 'Coming Soon', view: 'View Product', getPlay: 'Get it on Google Play',
        },
    },

    zh: {
        nav: { home: '首页', about: '关于我们', services: '服务', portfolio: '案例', partnerships: '合作伙伴', products: '产品', faq: '常见问题', contact: '联系我们' },
        getStarted: '立即开始',
        whatsapp: 'WhatsApp 联系',
        bookCall: '预约免费咨询',
        langLabel: '中文',
        faqH: '常见问题',
        faqIntro: '客户在项目启动前最常问的问题，我们直接给出答案。',
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
            { q: `${s.title}项目的源代码归谁所有？`,
              a: `归您所有。Trion Creation 的客户拥有我们为其开发的源代码与数据的 100% 所有权。我们签署保密协议（NDA），遵循安全开发流程（SDLC），并可按您的要求部署到您自己的 AWS、阿里云或本地服务器环境。` },
            { q: `上线后你们提供技术支持与维护吗？`,
              a: `提供。Trion Creation 的每个项目在交付后都包含保修期，我们还提供按月的支持服务，涵盖缺陷修复、安全补丁、服务器监控、功能更新以及 7×24 小时重大故障响应。` },
            { q: `${s.title}能与我们现有的系统集成吗？`,
              a: `可以。我们经常与现有的 ERP、财务、支付和物流平台对接，也会定制或迁移 Odoo、WordPress、Laravel 以及老旧的 PHP 系统 —— 包括完整的数据迁移与平台重构，且不影响正常运营。` },
            { q: `Trion Creation 承接马来西亚以外的${s.title}项目吗？`,
              a: `承接。Trion Creation 总部位于马来西亚吉隆坡，同时也为新加坡、泰国和印尼的客户交付项目。咨询、交付与后续支持均可远程进行。` },
        ],
        faqPf: (p) => [
            { q: `什么是${p.title}？`, a: p.longDescription },
            { q: `构建${p.title}使用哪些技术？`, a: `Trion Creation 通常使用 ${p.techStack.join('、')} 来构建${p.title}。` },
            { q: `${p.title}适合谁使用？`, a: `${p.title}适用于${p.useCases.join('、')}。我们已在${p.industries.join('、')}等行业交付过类似系统。` },
            { q: `构建一套${p.title}需要多长时间？`,
              a: `${p.title}的最小可行产品（MVP）通常需要 6–12 周。包含完整集成的正式生产系统一般需要 3–6 个月，具体取决于项目范围与合规要求。免费咨询通话后，Trion Creation 会确认固定的交付时间表。` },
            { q: `在马来西亚，一套${p.title}的费用是多少？`,
              a: `常见的项目区间为：MVP 约 RM15,000–40,000；中型业务系统约 RM40,000–150,000；企业级平台 RM150,000 以上。首次咨询通话后，Trion Creation 会提供固定范围报价 —— 绝无隐藏费用。` },
            { q: `我们是否拥有${p.title}的源代码？`,
              a: `是的。客户拥有源代码与数据的 100% 所有权。Trion Creation 会签署保密协议（NDA），并可部署到您自己的 AWS、阿里云或本地服务器环境。` },
        ],
        faqProd: (products) => {
            const live = products.filter((p) => p.status === 'live');
            const soon = products.filter((p) => p.status !== 'live');
            const names = products.map((p) => p.name).join('、');
            return [
                { q: 'Trion Creation 开发了哪些自有产品？',
                  a: `Trion Creation 目前发布的产品包括 ${names}。` + products.map((p) => `${p.name} —— ${p.tagline} ${p.description}`).join(' ') },
                ...products.map((p) => ({
                    q: `${p.name} 是什么？`,
                    a: `${p.name} 是由 Trion Creation Sdn Bhd 自主开发并发布的${p.category}类应用，支持 ${p.platforms.join(' 和 ')}。${p.description}`,
                })),
                { q: '这些是客户项目还是 Trion Creation 的自有产品？',
                  a: '这些都是我们的自有产品。从设计、开发、发布到后续维护，全部由 Trion Creation 独立完成，并非客户委托项目。我们以此证明：当我们自己就是客户时，我们交付的标准是什么样的。' },
                ...(live.length ? [{ q: `在哪里可以下载 ${live.map((p) => p.name).join('、')}？`,
                  a: `${live.map((p) => `${p.name} 已在 ${p.platforms.join(' 和 ')} 上架`).join('；')}。下载链接可在上方的产品卡片中找到。` }] : []),
                ...(soon.length ? [{ q: `${soon.map((p) => p.name).join('、')} 何时上线？`,
                  a: `${soon.map((p) => p.name).join('、')} 仍在开发中，尚未在应用商店发布。上线后，我们会第一时间在本页面放出下载链接。` }] : []),
                { q: 'Trion Creation 能为我的企业开发类似的应用吗？',
                  a: '可以。开发自有产品与我们为客户提供的服务完全一致 —— 定制移动端与网页应用、AI 功能、后端系统以及云基础设施。欢迎预约免费咨询通话，我们会梳理您的想法并提供固定报价。' },
            ];
        },
        prod: {
            home: '首页', products: '产品',
            eyebrow: 'TRION 自主开发并发布',
            title: '我们的产品',
            subtitle: '这些是我们自己设计、开发并发布的应用程序 —— 不是客户项目，而是我们作为客户时交付水准的证明。',
            live: '已上线', comingSoon: '即将推出', view: '查看产品', getPlay: '在 Google Play 上获取',
        },
    },

    ms: {
        nav: { home: 'Utama', about: 'Tentang', services: 'Perkhidmatan', portfolio: 'Portfolio', partnerships: 'Perkongsian', products: 'Produk', faq: 'Soalan Lazim', contact: 'Hubungi' },
        getStarted: 'Mula Sekarang',
        whatsapp: 'WhatsApp Kami',
        bookCall: 'Tempah Sesi Perundingan',
        langLabel: 'BM',
        faqH: 'Soalan Lazim',
        faqIntro: 'Jawapan terus kepada soalan yang paling kerap ditanya klien sebelum sesuatu projek bermula.',
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
            ctaTitle: (t) => `Sedia untuk memulakan projek ${t} anda?`,
            ctaBody: 'Tempah sesi perundingan percuma. Kami akan menilai keperluan anda dan memberikan sebut harga tetap — tanpa kos tersembunyi.',
        },
        pf: {
            home: 'Utama', portfolio: 'Portfolio', solution: 'PENYELESAIAN',
            overview: 'Gambaran Keseluruhan', keyFeatures: 'Ciri Utama', builtWith: 'Dibina Dengan', useCases: 'Kegunaan',
            builtWithProse: 'Inilah tindanan teknologi yang kami cadangkan untuk penyelesaian ini. Setiap projek disesuaikan — kami akan ubah suai mengikut pasukan, infrastruktur dan keperluan integrasi anda.',
            perfectFor: 'Sesuai Untuk', industries: 'Industri Yang Telah Kami Layani',
            discuss: 'Bincang Projek Ini', readyToBuild: 'SEDIA UNTUK BINA?',
            ctaTitle: (t) => `Mari kita bina ${t} anda.`,
            ctaBody: 'Tempah sesi perundingan percuma — kami akan menilai keperluan anda dan memberikan sebut harga tetap tanpa kos tersembunyi.',
        },
        faqSvc: (s) => [
            { q: `Berapa lama ${s.title} biasanya mengambil masa dengan Trion Creation?`,
              a: `Kebanyakan projek ${s.title} terbahagi kepada tiga julat. MVP biasanya mengambil masa 6–12 minggu. Sistem bersaiz sederhana mengambil masa 3–4 bulan. Platform perusahaan boleh mengambil masa 3–6 bulan bergantung pada integrasi dan keperluan pematuhan. Kami berikan jadual masa tetap selepas sesi perundingan percuma.` },
            { q: `Berapakah kos ${s.title} di Malaysia?`,
              a: `Untuk ${s.title}, projek Trion Creation biasanya berjulat dari ${fmtRM(s.priceMin)} bagi pembinaan berskop kecil hingga ${fmtRM(s.priceMax)}+ bagi platform perusahaan. Sebut harga skop tetap diberikan selepas sesi perundingan — tanpa kos tersembunyi.` },
            { q: `Siapakah pemilik kod sumber bagi projek ${s.title}?`,
              a: `Anda. Klien Trion Creation memiliki 100% kod sumber dan data yang kami hasilkan untuk mereka. Kami menandatangani NDA, mengamalkan amalan SDLC yang selamat, dan boleh melaksanakan penempatan ke infrastruktur AWS, Alibaba Cloud atau on-premise milik anda sendiri.` },
            { q: `Adakah anda menyediakan sokongan dan penyelenggaraan selepas pelancaran?`,
              a: `Ya. Setiap projek Trion Creation disertakan tempoh waranti selepas penyerahan, dan kami menawarkan pakej sokongan bulanan merangkumi pembaikan pepijat, tampung keselamatan, pemantauan pelayan, kemas kini ciri dan tindak balas insiden kritikal 24/7.` },
            { q: `Bolehkah ${s.title} diintegrasikan dengan sistem sedia ada kami?`,
              a: `Boleh. Kami kerap berintegrasi dengan platform ERP, perakaunan, pembayaran dan logistik sedia ada, serta menyesuaikan atau memindahkan sistem Odoo, WordPress, Laravel dan PHP lama — termasuk pemindahan data penuh dan pemindahan platform tanpa gangguan operasi.` },
            { q: `Adakah Trion Creation menerima projek ${s.title} di luar Malaysia?`,
              a: `Ya. Trion Creation beroperasi dari Kuala Lumpur, Malaysia dan turut menyampaikan projek untuk klien di Singapura, Thailand dan Indonesia. Sesi perundingan, penyampaian dan sokongan semuanya boleh dijalankan dari jarak jauh.` },
        ],
        faqPf: (p) => [
            { q: `Apakah itu ${p.title}?`, a: p.longDescription },
            { q: `Apakah teknologi yang digunakan untuk membina ${p.title}?`, a: `Trion Creation biasanya membina ${p.title} menggunakan ${p.techStack.join(', ')}.` },
            { q: `Untuk siapa ${p.title} ini sesuai?`, a: `${p.title} sesuai untuk ${p.useCases.join(', ')}. Kami telah menyampaikan sistem serupa merentasi ${p.industries.join(', ')}.` },
            { q: `Berapa lama masa diperlukan untuk membina ${p.title}?`,
              a: `MVP ${p.title} biasanya mengambil masa 6–12 minggu. Sistem produksi penuh berserta integrasi lazimnya mengambil masa 3–6 bulan, bergantung pada skop dan keperluan pematuhan. Trion Creation mengesahkan jadual masa tetap selepas sesi perundingan percuma.` },
            { q: `Berapakah kos ${p.title} di Malaysia?`,
              a: `Julat projek lazim ialah RM15,000–40,000 bagi MVP, RM40,000–150,000 bagi sistem perniagaan bersaiz sederhana, dan RM150,000+ bagi platform perusahaan. Trion Creation memberikan sebut harga skop tetap selepas sesi perundingan pertama — tanpa kos tersembunyi.` },
            { q: `Adakah kami memiliki kod sumber ${p.title} tersebut?`,
              a: `Ya. Klien memiliki 100% kod sumber dan data. Trion Creation menandatangani NDA dan boleh melaksanakan penempatan ke infrastruktur AWS, Alibaba Cloud atau on-premise milik anda sendiri.` },
        ],
        faqProd: (products) => {
            const live = products.filter((p) => p.status === 'live');
            const soon = products.filter((p) => p.status !== 'live');
            const names = products.map((p) => p.name).join(' dan ');
            return [
                { q: 'Apakah produk yang telah dibina oleh Trion Creation?',
                  a: `Buat masa ini Trion Creation menerbitkan ${names}. ` + products.map((p) => `${p.name} — ${p.tagline} ${p.description}`).join(' ') },
                ...products.map((p) => ({
                    q: `Apakah itu ${p.name}?`,
                    a: `${p.name} ialah aplikasi ${p.category.toLowerCase()} yang dibina dan diterbitkan sendiri oleh Trion Creation Sdn Bhd untuk ${p.platforms.join(' dan ')}. ${p.description}`,
                })),
                { q: 'Adakah ini projek klien atau produk milik Trion Creation sendiri?',
                  a: 'Ini produk kami sendiri. Trion Creation mereka bentuk, membina, menerbitkan dan menyelenggaranya dari mula hingga akhir — ia bukan kerja klien. Kami membinanya sebagai bukti tahap kualiti yang kami hasilkan apabila kami sendiri menjadi pelanggan.' },
                ...(live.length ? [{ q: `Di manakah saya boleh memuat turun ${live.map((p) => p.name).join(' dan ')}?`,
                  a: `${live.map((p) => `${p.name} tersedia di ${p.platforms.join(' dan ')}`).join('. ')}. Pautan disediakan pada setiap kad produk di atas.` }] : []),
                ...(soon.length ? [{ q: `Bilakah ${soon.map((p) => p.name).join(' dan ')} akan dilancarkan?`,
                  a: `${soon.map((p) => p.name).join(' dan ')} masih dalam pembangunan dan belum dikeluarkan di gedung aplikasi. Pautan gedung akan dipaparkan di halaman ini sebaik sahaja ia dilancarkan.` }] : []),
                { q: 'Bolehkah Trion Creation membina aplikasi seperti ini untuk perniagaan saya?',
                  a: 'Boleh. Membina produk kami sendiri menggunakan kepakaran yang sama seperti kerja klien kami — aplikasi mudah alih dan web tersuai, ciri AI, sistem backend dan infrastruktur awan. Tempah sesi perundingan percuma dan kami akan menilai idea anda serta memberikan sebut harga tetap.' },
            ];
        },
        prod: {
            home: 'Utama', products: 'Produk',
            eyebrow: 'DIBINA & DITERBITKAN OLEH TRION',
            title: 'Produk Kami',
            subtitle: 'Aplikasi yang kami reka bentuk, bina dan terbitkan sendiri — bukan projek klien. Bukti kualiti kerja kami apabila kami sendiri menjadi pelanggan.',
            live: 'Langsung', comingSoon: 'Akan Datang', view: 'Lihat Produk', getPlay: 'Dapatkan di Google Play',
        },
    },
};

module.exports = { LOCALES, META, UI, fmtRM, aAn };
