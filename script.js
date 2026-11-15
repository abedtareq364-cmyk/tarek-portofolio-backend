(function () {
  'use strict';

  var API = 'https://tarek-portofolio-backend.onrender.com';
  var GA_ID = 'G-FTX94ZRQ8N';
  var ADS_CLIENT = 'ca-pub-8236586351473750';

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- الترجمات ---------- */
  var T = {
    ar: {
      skip: 'تخطَّ إلى المحتوى',
      nav_home: 'الرئيسية', nav_about: 'من أنا', nav_blog: 'المدونة', nav_projects: 'المشاريع', nav_contact: 'تواصل',
      hero_title: 'طارق عابد',
      hero_desc: 'مطوّر واجهات أمامية، وأنفّذ أعمال التشطيبات (دهانات، جبس بورد، بلاط) في فرنسا.',
      btn_consult: 'استشارة مجانية', btn_estimator: 'حاسبة الأسعار',
      consult_title: 'طلب استشارة مجانية',
      consult_intro: 'عندك استفسار برمجي أو فني عن التشطيبات في فرنسا؟ ابعتلي تفاصيله.',
      ph_name: 'اسمك الكريم', ph_email: 'بريدك الإلكتروني', ph_phone: 'رقم الهاتف أو واتساب (اختياري)',
      ph_msg: 'اكتب تفاصيل استشارتك...', ph_message: 'رسالتك...',
      consent_pre: 'أوافق على معالجة بياناتي للرد على طلبي، حسب', consent_link: 'سياسة الخصوصية',
      consult_send: 'إرسال الاستشارة', send_msg: 'إرسال الرسالة',
      st_sending: 'جاري الإرسال... قد يستغرق لحظات.',
      st_ok: 'وصلتني رسالتك، سأرد عليك قريباً.',
      st_fail: 'تعذر الإرسال حالياً. جرّب مرة أخرى أو راسلني على واتساب.',
      calc_title: 'حاسبة الأسعار التقديرية', calc_service: 'اختر الخدمة',
      opt_web: 'تطوير صفحات ويب', opt_app: 'تطوير تطبيق (ابتداءً من)',
      opt_placo: 'جبس بورد (Plaquiste)', opt_peinture: 'دهانات (Peinture)', opt_carrelage: 'بلاط (Carrelage)',
      lbl_pages: 'عدد الصفحات', lbl_m2: 'المساحة (م²)',
      res_est: 'التكلفة التقديرية:', res_from: 'تبدأ من',
      res_note: 'تقدير مبدئي غير ملزم. السعر النهائي بعد تحديد المتطلبات أو المعاينة، وعبر عرض سعر مكتوب.',
      tr_title: 'دليل المشاكل الفنية وحلولها',
      tr1_h: 'مشاكل الأكواد وتصميم الويب', tr1_p: 'المشكلة: عدم تجاوب الشاشات أو بطء التحميل.', tr1_s: 'الحل: Flexbox/Grid مع ضغط الصور وتحسين الجافاسكريبت.',
      tr2_h: 'مشاكل الجبس بورد (Plaquiste)', tr2_p: 'المشكلة: تشققات في الفواصل.', tr2_s: 'الحل: شريط تسليح (Bande à joint) مع معجون جيد وصنفرة دقيقة.',
      tr3_h: 'مشاكل الدهانات (Peinture)', tr3_p: 'المشكلة: تقشّر الدهان أو ظهور عيوب.', tr3_s: 'الحل: صنفرة الحائط، طبقة Primer عازلة، ثم وجهين دهان.',
      tr4_h: 'مشاكل البلاط (Carrelage)', tr4_p: 'المشكلة: تفاوت حواف البلاط.', tr4_s: 'الحل: ضبط الميل واستخدام نظام التسوية (Cales de nivellement).',
      sv_title: 'خدمات مصغّرة وأكواد جاهزة',
      sv1_h: 'قالب موقع شخصي متجاوب', sv1_p: 'قالب HTML/CSS/JS مع دعم الوضع المظلم.',
      sv2_h: 'إصلاح مشكلة برمجية', sv2_p: 'فحص كود موقعك وحل أخطاء JavaScript وتصميم الواجهات.',
      sv3_h: 'استشارة فنية لورشة عمل', sv3_p: 'نصائح وحساب كميات المواد للجبس بورد والدهانات والبلاط.',
      btn_order: 'اطلب الآن',
      blog_title: 'المدونة التقنية', btn_read: 'اقرأ المقال',
      b1: 'أفضل ممارسات كتابة كود نظيف.', b2: 'إتقان تخطيطات الشاشات الحديثة.', b3: 'تصميم واجهات مرنة ومتجاوبة.',
      b4: 'إدارة إصدارات المشروع باحتراف.', b5: 'تحسين أداء وسرعة السكربتات.', b6: 'تحسين السرعة وظهور الموقع في البحث.',
      b7: 'أساسيات حماية التطبيقات.', b8: 'معايير إتاحة الويب لكل الفئات.', b9: 'استضافة ونشر مواقع الويب.', b10: 'أفضل الممارسات الأمنية.',
      pj_title: 'المشاريع',
      pj1_h: 'المحفظة الرقمية (Netlify)', pj1_p: 'النسخة المنشورة على Netlify.',
      pj2_h: 'اللعبة التفاعلية (Vercel)', pj2_p: 'لعبة تختبر سرعة رد الفعل.',
      btn_visit: 'زيارة الموقع', btn_try: 'جرّب اللعبة',
      contact_title: 'تواصل معي',
      ck_text: 'أستخدم ملفات تعريف الارتباط للتحليلات والإعلانات (Google Analytics وAdSense) فقط بموافقتك.',
      ck_more: 'التفاصيل', ck_accept: 'قبول', ck_reject: 'رفض',
      f_about: 'من أنا', f_privacy: 'الخصوصية', f_terms: 'الشروط', f_disc: 'إخلاء المسؤولية', f_cookies: 'إعدادات الكوكيز',
      f_rights: '© 2026 Tarek.Dev (tarekkorshed.com). جميع الحقوق محفوظة.'
    },
    fr: {
      skip: 'Aller au contenu',
      nav_home: 'Accueil', nav_about: 'À propos', nav_blog: 'Blog', nav_projects: 'Projets', nav_contact: 'Contact',
      hero_title: 'Tarek Abed',
      hero_desc: 'Développeur front-end, et professionnel des finitions (peinture, plaquiste, carrelage) en France.',
      btn_consult: 'Consultation gratuite', btn_estimator: 'Estimer un prix',
      consult_title: 'Demande de consultation gratuite',
      consult_intro: 'Une question technique ou sur des travaux de finition en France ? Décrivez-la-moi.',
      ph_name: 'Votre nom', ph_email: 'Votre e-mail', ph_phone: 'Téléphone ou WhatsApp (facultatif)',
      ph_msg: 'Détails de votre demande...', ph_message: 'Votre message...',
      consent_pre: 'J’accepte le traitement de mes données pour répondre à ma demande, selon la', consent_link: 'politique de confidentialité',
      consult_send: 'Envoyer la demande', send_msg: 'Envoyer le message',
      st_sending: 'Envoi en cours... cela peut prendre un moment.',
      st_ok: 'Votre message est bien arrivé, je vous réponds rapidement.',
      st_fail: 'Envoi impossible pour le moment. Réessayez ou écrivez-moi sur WhatsApp.',
      calc_title: 'Estimateur de prix', calc_service: 'Choisissez le service',
      opt_web: 'Création de pages web', opt_app: 'Développement d’application (à partir de)',
      opt_placo: 'Plaquiste (placo)', opt_peinture: 'Peinture', opt_carrelage: 'Carrelage',
      lbl_pages: 'Nombre de pages', lbl_m2: 'Surface (m²)',
      res_est: 'Estimation :', res_from: 'à partir de',
      res_note: 'Estimation indicative, non contractuelle. Le prix final dépend du cahier des charges ou d’une visite, et d’un devis écrit.',
      tr_title: 'Guide des problèmes techniques',
      tr1_h: 'Code et design web', tr1_p: 'Problème : écrans non adaptés ou chargement lent.', tr1_s: 'Solution : Flexbox/Grid, images compressées, JavaScript optimisé.',
      tr2_h: 'Plaquiste', tr2_p: 'Problème : fissures aux joints.', tr2_s: 'Solution : bande à joint, enduit de qualité et ponçage soigné.',
      tr3_h: 'Peinture', tr3_p: 'Problème : peinture qui s’écaille ou défauts visibles.', tr3_s: 'Solution : ponçage, sous-couche d’accrochage, puis deux couches.',
      tr4_h: 'Carrelage', tr4_p: 'Problème : désaffleurement entre carreaux.', tr4_s: 'Solution : bon réglage de la pente et cales de nivellement.',
      sv_title: 'Micro-services et codes prêts à l’emploi',
      sv1_h: 'Modèle de site personnel responsive', sv1_p: 'Modèle HTML/CSS/JS avec mode sombre.',
      sv2_h: 'Correction d’un bug', sv2_p: 'Analyse de votre code et correction d’erreurs JavaScript et d’interface.',
      sv3_h: 'Conseil technique pour chantier', sv3_p: 'Conseils et calcul des quantités pour placo, peinture et carrelage.',
      btn_order: 'Commander',
      blog_title: 'Blog technique', btn_read: 'Lire l’article',
      b1: 'Les bonnes pratiques d’un code propre.', b2: 'Maîtriser les mises en page modernes.', b3: 'Concevoir des interfaces flexibles.',
      b4: 'Gérer les versions d’un projet.', b5: 'Optimiser la vitesse des scripts.', b6: 'Vitesse du site et référencement.',
      b7: 'Les bases de la sécurité applicative.', b8: 'Accessibilité du web pour tous.', b9: 'Hébergement et déploiement de sites.', b10: 'Bonnes pratiques de sécurité.',
      pj_title: 'Projets',
      pj1_h: 'Portfolio (Netlify)', pj1_p: 'Version publiée sur Netlify.',
      pj2_h: 'Jeu interactif (Vercel)', pj2_p: 'Un jeu qui teste votre temps de réaction.',
      btn_visit: 'Visiter le site', btn_try: 'Essayer le jeu',
      contact_title: 'Me contacter',
      ck_text: 'J’utilise des cookies d’analyse et de publicité (Google Analytics, AdSense) uniquement avec votre accord.',
      ck_more: 'Détails', ck_accept: 'Accepter', ck_reject: 'Refuser',
      f_about: 'À propos', f_privacy: 'Confidentialité', f_terms: 'Conditions', f_disc: 'Avertissement', f_cookies: 'Gérer les cookies',
      f_rights: '© 2026 Tarek.Dev (tarekkorshed.com). Tous droits réservés.'
    },
    en: {
      skip: 'Skip to content',
      nav_home: 'Home', nav_about: 'About', nav_blog: 'Blog', nav_projects: 'Projects', nav_contact: 'Contact',
      hero_title: 'Tarek Abed',
      hero_desc: 'Front-end developer, and finishing professional (painting, drywall, tiling) in France.',
      btn_consult: 'Free consultation', btn_estimator: 'Price estimator',
      consult_title: 'Free consultation request',
      consult_intro: 'A technical question or one about finishing work in France? Send me the details.',
      ph_name: 'Your name', ph_email: 'Your email', ph_phone: 'Phone or WhatsApp (optional)',
      ph_msg: 'Describe your request...', ph_message: 'Your message...',
      consent_pre: 'I agree to the processing of my data to answer my request, per the', consent_link: 'privacy policy',
      consult_send: 'Send request', send_msg: 'Send message',
      st_sending: 'Sending... this may take a moment.',
      st_ok: 'Your message arrived. I’ll reply soon.',
      st_fail: 'Could not send right now. Try again or message me on WhatsApp.',
      calc_title: 'Price estimator', calc_service: 'Choose a service',
      opt_web: 'Web pages development', opt_app: 'App development (from)',
      opt_placo: 'Drywall (Plaquiste)', opt_peinture: 'Painting (Peinture)', opt_carrelage: 'Tiling (Carrelage)',
      lbl_pages: 'Number of pages', lbl_m2: 'Area (m²)',
      res_est: 'Estimate:', res_from: 'from',
      res_note: 'Indicative, non-binding estimate. The final price depends on requirements or a site visit, and a written quote.',
      tr_title: 'Troubleshooting guide',
      tr1_h: 'Code and web design', tr1_p: 'Problem: screens not responsive or slow loading.', tr1_s: 'Fix: Flexbox/Grid, compressed images, optimized JavaScript.',
      tr2_h: 'Drywall (Plaquiste)', tr2_p: 'Problem: cracks at the joints.', tr2_s: 'Fix: joint tape, quality compound and careful sanding.',
      tr3_h: 'Painting (Peinture)', tr3_p: 'Problem: peeling paint or visible flaws.', tr3_s: 'Fix: sand the wall, apply a primer, then two coats.',
      tr4_h: 'Tiling (Carrelage)', tr4_p: 'Problem: uneven tile edges (lippage).', tr4_s: 'Fix: correct slope and leveling spacers.',
      sv_title: 'Micro-services and ready-made code',
      sv1_h: 'Responsive personal website template', sv1_p: 'HTML/CSS/JS template with dark mode.',
      sv2_h: 'Bug fix', sv2_p: 'Review your code and fix JavaScript and UI errors.',
      sv3_h: 'Technical consultation for a job site', sv3_p: 'Advice and material quantities for drywall, painting and tiling.',
      btn_order: 'Order now',
      blog_title: 'Tech blog', btn_read: 'Read article',
      b1: 'Best practices for clean code.', b2: 'Mastering modern layouts.', b3: 'Building flexible interfaces.',
      b4: 'Managing project versions.', b5: 'Speeding up your scripts.', b6: 'Site speed and search visibility.',
      b7: 'Application security basics.', b8: 'Web accessibility for everyone.', b9: 'Hosting and deploying websites.', b10: 'Security best practices.',
      pj_title: 'Projects',
      pj1_h: 'Portfolio (Netlify)', pj1_p: 'The version published on Netlify.',
      pj2_h: 'Interactive game (Vercel)', pj2_p: 'A game that tests your reaction time.',
      btn_visit: 'Visit site', btn_try: 'Play the game',
      contact_title: 'Get in touch',
      ck_text: 'I use analytics and advertising cookies (Google Analytics, AdSense) only with your consent.',
      ck_more: 'Details', ck_accept: 'Accept', ck_reject: 'Reject',
      f_about: 'About', f_privacy: 'Privacy', f_terms: 'Terms', f_disc: 'Disclaimer', f_cookies: 'Cookie settings',
      f_rights: '© 2026 Tarek.Dev (tarekkorshed.com). All rights reserved.'
    }
  };

  var hasLangSelect = !!document.getElementById('langSelect');
  var lang = store.get('lang');
  if (!hasLangSelect || !T[lang]) lang = 'ar';
  function t(k) { return (T[lang] && T[lang][k]) || T.ar[k] || ''; }

  /* ---------- الحاسبة ---------- */
  var SERVICES = {
    web: { rate: 50, unit: 'pages' },
    app: { flat: 300 },
    placo: { rate: 25, unit: 'm2' },
    peinture: { rate: 20, unit: 'm2' },
    carrelage: { rate: 40, unit: 'm2' }
  };
  function calc() {
    var sel = document.getElementById('serviceType');
    if (!sel) return;
    var qtyIn = document.getElementById('serviceQty');
    var wrap = document.getElementById('qtyWrap');
    var label = document.getElementById('qtyLabel');
    var out = document.getElementById('estimateResult');
    var note = document.getElementById('estimateNote');
    var s = SERVICES[sel.value];
    if (!s) return;
    var qty = Math.floor(parseFloat(qtyIn.value));
    if (!isFinite(qty) || qty < 1) qty = 1;
    if (qty > 10000) qty = 10000;
    if (s.flat) {
      wrap.hidden = true;
      out.textContent = t('res_est') + ' ' + t('res_from') + ' ' + s.flat + ' €';
    } else {
      wrap.hidden = false;
      label.textContent = t(s.unit === 'pages' ? 'lbl_pages' : 'lbl_m2');
      var low = s.rate * qty;
      var high = Math.round(low * 1.3);
      out.textContent = t('res_est') + ' ' + low + ' – ' + high + ' €';
    }
    note.textContent = t('res_note');
  }

  /* ---------- اللغة ---------- */
  function applyLang() {
    if (!hasLangSelect) return;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-ph'));
      if (v) el.setAttribute('placeholder', v);
    });
    calc();
    buildBanner();
  }

  /* ---------- الثيم والقائمة ---------- */
  function setThemeIcon() {
    var icon = document.getElementById('themeIcon');
    if (icon) icon.className = 'fa-solid ' + (document.documentElement.getAttribute('data-theme') === 'dark' ? 'fa-moon' : 'fa-sun');
  }

  /* ---------- الموافقة على الكوكيز ---------- */
  var trackingLoaded = false;
  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    if (src.indexOf('adsbygoogle') > -1) s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }
  function loadTracking() {
    if (trackingLoaded) return;
    trackingLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);
    if (document.body.getAttribute('data-ads') === 'true') {
      loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADS_CLIENT);
    }
  }
  function hideBanner() {
    var b = document.getElementById('cookieBanner');
    if (b) b.remove();
  }
  function setConsent(v) {
    store.set('consent', v);
    hideBanner();
    if (v === 'granted') loadTracking();
  }
  function buildBanner() {
    if (store.get('consent')) return;
    hideBanner();
    var b = document.createElement('div');
    b.id = 'cookieBanner';
    b.className = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookies');
    var p = document.createElement('p');
    p.textContent = t('ck_text') + ' ';
    var a = document.createElement('a');
    a.href = 'privacy.html'; a.textContent = t('ck_more');
    p.appendChild(a);
    var actions = document.createElement('div');
    actions.className = 'cookie-actions';
    var no = document.createElement('button');
    no.type = 'button'; no.className = 'btn secondary small'; no.textContent = t('ck_reject');
    no.addEventListener('click', function () { setConsent('denied'); });
    var yes = document.createElement('button');
    yes.type = 'button'; yes.className = 'btn primary small'; yes.textContent = t('ck_accept');
    yes.addEventListener('click', function () { setConsent('granted'); });
    actions.appendChild(no); actions.appendChild(yes);
    b.appendChild(p); b.appendChild(actions);
    document.body.appendChild(b);
  }

  /* ---------- النماذج ---------- */
  var warmed = false;
  function warmUp() {
    if (warmed) return;
    warmed = true;
    try { fetch(API + '/', { mode: 'no-cors' }).catch(function () {}); } catch (e) {}
  }
  function bindForm(form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener('focusin', warmUp);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var fd = new FormData(form);
      if (fd.get('website')) return;
      var name = String(fd.get('name') || '').trim();
      var email = String(fd.get('email') || '').trim();
      var phone = String(fd.get('phone') || '').trim();
      var message = String(fd.get('message') || '').trim();
      if (phone) message = 'Tel/WhatsApp: ' + phone + '\n' + message;
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = t('st_sending');
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, 60000);
      fetch(API + '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: message }),
        signal: ctrl.signal
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || !data.success) throw new Error('fail');
            status.className = 'form-status ok';
            status.textContent = t('st_ok');
            form.reset();
          });
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = t('st_fail');
        })
        .then(function () { clearTimeout(timer); btn.disabled = false; });
    });
  }

  /* ---------- تشغيل ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    setThemeIcon();

    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.set('theme', next);
      setThemeIcon();
    });

    var menuBtn = document.getElementById('menuBtn');
    var nav = document.getElementById('mainNav');
    if (menuBtn && nav) {
      menuBtn.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
      });
      nav.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
      });
    }

    var sel = document.getElementById('langSelect');
    if (sel) {
      sel.value = lang;
      sel.addEventListener('change', function (e) { lang = e.target.value; store.set('lang', lang); applyLang(); });
    }

    var svc = document.getElementById('serviceType');
    var qty = document.getElementById('serviceQty');
    if (svc) svc.addEventListener('change', calc);
    if (qty) qty.addEventListener('input', calc);

    document.querySelectorAll('[data-wa]').forEach(function (a) {
      a.href = 'https://wa.me/33749408535?text=' + encodeURIComponent(a.getAttribute('data-wa'));
    });
    document.querySelectorAll('form[data-form]').forEach(bindForm);

    var cs = document.getElementById('cookieSettings');
    if (cs) cs.addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem('consent'); } catch (err) {}
      buildBanner();
    });

    if (hasLangSelect) applyLang(); else buildBanner();
    if (store.get('consent') === 'granted') loadTracking();
  });
})();