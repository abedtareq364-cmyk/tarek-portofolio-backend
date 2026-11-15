(function () {
  'use strict';

  var API = 'https://tarek-portofolio-backend.onrender.com';
  var root = document.querySelector('[data-article]');
  if (!root) return;
  var ID = root.getAttribute('data-article');
  var LIKE_KEY = 'liked_' + ID;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function api(path, options) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, 60000);
    options = options || {};
    options.signal = ctrl.signal;
    return fetch(API + path, options).then(
      function (r) { clearTimeout(timer); return r; },
      function (e) { clearTimeout(timer); throw e; }
    );
  }

  /* ---------- الإعجاب ---------- */
  var likeBtn = $('likeBtn'), heart = $('heartIcon'), likeCount = $('likeCount');
  var liked = store.get(LIKE_KEY) === 'true';
  function paintLike() {
    likeBtn.setAttribute('aria-pressed', String(liked));
    heart.textContent = liked ? '❤️' : '♡';
  }
  paintLike();

  api('/api/likes?article=' + encodeURIComponent(ID))
    .then(function (r) { return r.json(); })
    .then(function (d) { if (d && d.success) likeCount.textContent = d.count; })
    .catch(function () { likeCount.textContent = '0'; });

  likeBtn.addEventListener('click', function () {
    var want = !liked;
    var before = liked;
    liked = want; paintLike();
    likeBtn.disabled = true;
    api('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId: ID, action: want ? 'like' : 'unlike' })
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok || !d.success) throw new Error('fail');
        likeCount.textContent = d.count;
        if (want) store.set(LIKE_KEY, 'true'); else store.del(LIKE_KEY);
      }); })
      .catch(function () { liked = before; paintLike(); })
      .then(function () { likeBtn.disabled = false; });
  });

  /* ---------- التقييم بالنجوم ---------- */
  var rating = 5;
  var starBtns = document.querySelectorAll('.star-btn');
  function paintStars() {
    starBtns.forEach(function (b) {
      var v = Number(b.getAttribute('data-v'));
      b.classList.toggle('on', v <= rating);
      b.setAttribute('aria-checked', String(v === rating));
    });
  }
  starBtns.forEach(function (b) {
    b.addEventListener('click', function () { rating = Number(b.getAttribute('data-v')); paintStars(); });
  });
  paintStars();

  /* ---------- التعليقات ---------- */
  var list = $('commentsList'), status = $('commentStatus');
  function setStatus(msg, cls) { status.textContent = msg; status.className = 'form-status' + (cls ? ' ' + cls : ''); }

  function renderComment(c) {
    var r = Math.min(5, Math.max(1, Math.round(Number(c.rating)) || 5));
    var item = el('div', 'comment-item');
    var head = el('div', 'comment-head');
    head.appendChild(el('strong', '', (c.name && String(c.name).trim()) || 'زائر'));
    var stars = el('span', 'comment-stars', '★'.repeat(r) + '☆'.repeat(5 - r));
    stars.title = 'تقييم: ' + r + ' من 5';
    head.appendChild(stars);
    item.appendChild(head);
    item.appendChild(el('p', '', String(c.text || '')));
    var d = new Date(c.created_at);
    if (!isNaN(d)) item.appendChild(el('span', 'comment-date', d.toLocaleDateString('ar-EG')));
    return item;
  }

  api('/api/comments?article=' + encodeURIComponent(ID))
    .then(function (r) { return r.json(); })
    .then(function (data) {
      list.replaceChildren();
      if (!Array.isArray(data) || !data.length) { list.appendChild(el('p', 'muted', 'لا توجد تعليقات بعد، كن أول من يعلّق.')); return; }
      data.forEach(function (c) { list.appendChild(renderComment(c)); });
    })
    .catch(function () { list.replaceChildren(el('p', 'muted', 'تعذر تحميل التعليقات الآن.')); });

  $('commentForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var nameIn = $('commenterName'), textIn = $('commentText'), btn = $('commentSubmit');
    var text = textIn.value.trim();
    if (!text) { setStatus('اكتب نص التعليق أولاً.', 'err'); return; }
    var payload = { articleId: ID, name: nameIn.value.trim(), rating: rating, text: text };
    btn.disabled = true;
    setStatus('جاري النشر...');
    api('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) {
        if (r.status === 429) { setStatus('محاولات كثيرة، جرّب بعد قليل.', 'err'); return; }
        if (!r.ok || !d.success) throw new Error('fail');
        if (list.querySelector('.muted')) list.replaceChildren();
        list.prepend(renderComment(d.comment || payload));
        textIn.value = ''; nameIn.value = '';
        setStatus('تم نشر تعليقك.', 'ok');
      }); })
      .catch(function () { setStatus('تعذر نشر التعليق. حاول مرة أخرى.', 'err'); })
      .then(function () { btn.disabled = false; });
  });

  /* ---------- أزرار أخرى ---------- */
  $('commentsBtn').addEventListener('click', function () {
    $('comments').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('shareBtn').addEventListener('click', function () {
    var shareStatus = $('shareStatus');
    var data = { title: document.title, url: location.href };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(location.href).then(
        function () { shareStatus.textContent = 'تم نسخ الرابط.'; },
        function () { shareStatus.textContent = location.href; }
      );
    } else { shareStatus.textContent = location.href; }
  });
})();