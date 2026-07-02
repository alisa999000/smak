/**
 * Модалка регистрации без <form>: POST /auth/sms/send, редирект по email, OAuth.
 * Клики ловим делегированием (capture), чтобы сработало даже при чужих обработчиках и без #modals.
 */
(function () {
  function csrf() {
    var m = document.querySelector('meta[name="csrf-token"]');
    return m && m.getAttribute('content') ? m.getAttribute('content') : '';
  }

  function meta(name, fallback) {
    var el = document.querySelector('meta[name="' + name + '"]');
    var v = el && el.getAttribute('content');
    return v ? v : (fallback || '');
  }

  function postForm(url, fields) {
    var f = document.createElement('form');
    f.method = 'post';
    f.action = url;
    f.style.display = 'none';
    Object.keys(fields).forEach(function (k) {
      var inp = document.createElement('input');
      inp.type = 'hidden';
      inp.name = k;
      inp.value = fields[k];
      f.appendChild(inp);
    });
    document.body.appendChild(f);
    f.submit();
  }

  function modalShell(el) {
    if (!el || !el.closest) {
      return null;
    }
    return (
      el.closest('#modals') ||
      el.closest('.modals') ||
      el.closest('.modals-content')
    );
  }

  function tabWithEmail(shell) {
    if (!shell) {
      return null;
    }
    var byId = shell.querySelector('#emailTab');
    if (byId && byId.querySelector('input[type="email"]')) {
      return byId;
    }
    var tabs = shell.querySelectorAll('.tabcontent');
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].querySelector('input[type="email"]')) {
        return tabs[i];
      }
    }
    return null;
  }

  function tabWithPhone(shell) {
    if (!shell) {
      return null;
    }
    var byId = shell.querySelector('#phoneTab');
    if (byId && byId.querySelector('input[type="tel"]')) {
      return byId;
    }
    var tabs = shell.querySelectorAll('.tabcontent');
    for (var j = 0; j < tabs.length; j++) {
      if (tabs[j].querySelector('input[type="tel"]')) {
        return tabs[j];
      }
    }
    return null;
  }

  function submitLabel(t) {
    return String((t.value || t.textContent || '') + '').toLowerCase();
  }

  function wireSocial(root) {
    var blocks = root.querySelectorAll('.soc-seti a');
    for (var i = 0; i < blocks.length; i++) {
      var a = blocks[i];
      var img = a.querySelector('img');
      var alt = img ? (img.getAttribute('alt') || '').toLowerCase() : '';
      var href = (a.getAttribute('href') || '').trim();
      if (href && href !== '#' && href.indexOf('javascript:') !== 0) {
        continue;
      }
      if (alt === 'google' || (img && (img.src || '').indexOf('ggl') !== -1)) {
        a.setAttribute('href', '/auth/google');
      } else if (alt === 'yandex' || (img && (img.src || '').indexOf('ya.svg') !== -1)) {
        a.setAttribute('href', '/auth/yandex');
      }
    }
  }

  function wireLoginLink(root) {
    var a = root.querySelector('#loginLink');
    if (!a) {
      return;
    }
    var h = a.getAttribute('href');
    if (h && h !== '#') {
      return;
    }
    a.setAttribute('href', meta('smachnaya-login-url', '/account/'));
  }

  function onSubmitClick(e) {
    var t = e.target;
    if (!t || (t.tagName !== 'INPUT' && t.tagName !== 'BUTTON')) {
      return;
    }
    if (t.getAttribute('type') !== 'submit') {
      return;
    }
    var shell = modalShell(t);
    if (!shell) {
      return;
    }

    var label = submitLabel(t);
    var emailTab = tabWithEmail(shell);
    var phoneTab = tabWithPhone(shell);
    var inEmailTab = emailTab ? emailTab.contains(t) : false;
    var inPhoneTab = phoneTab ? phoneTab.contains(t) : false;

    var doEmail =
      inEmailTab ||
      (label.indexOf('продолж') !== -1 && !!shell.querySelector('input[type="email"]'));
    var doPhone =
      inPhoneTab ||
      (label.indexOf('код') !== -1 && !!shell.querySelector('input[type="tel"]'));

    if (doEmail && !doPhone) {
      var em = emailTab
        ? emailTab.querySelector('input[type="email"]')
        : shell.querySelector('input[type="email"]');
      e.preventDefault();
      e.stopPropagation();
      var email = em && em.value ? String(em.value).trim() : '';
      if (!email) {
        window.alert('Введите email');
        return;
      }
      var base = meta('smachnaya-register-url', '/account/registraciya');
      var u = base.indexOf('?') >= 0 ? base + '&' : base + '?';
      u += 'email=' + encodeURIComponent(email);
      window.location.href = u;
      return;
    }

    if (doPhone && !doEmail) {
      var tel = phoneTab
        ? phoneTab.querySelector('input[type="tel"]')
        : shell.querySelector('input[type="tel"]');
      e.preventDefault();
      e.stopPropagation();
      var phone = tel && tel.value ? String(tel.value).trim() : '';
      if (!phone) {
        window.alert('Введите номер телефона');
        return;
      }
      var tok = csrf();
      if (!tok) {
        window.alert('Обновите страницу (нет CSRF-токена). Убедитесь, что подключён плагин OnWebPagePrerender или meta csrf-token.');
        return;
      }
      postForm('/auth/sms/send', { _token: tok, phone: phone });
    }
  }

  function initStatic() {
    var roots = document.querySelectorAll('#modals, .modals, .modals-content');
    if (!roots.length) {
      return;
    }
    var seen = {};
    for (var r = 0; r < roots.length; r++) {
      var root = roots[r];
      if (seen[root]) {
        continue;
      }
      seen[root] = 1;
      wireSocial(root);
      wireLoginLink(root);
    }
  }

  document.addEventListener('click', onSubmitClick, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatic);
  } else {
    initStatic();
  }
})();
