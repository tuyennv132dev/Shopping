/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * 
 * Giải pháp: dùng query parameter `?lang=en` hoặc `?lang=vi` để xác định ngôn ngữ
 * Google Translate chỉ được kích hoạt khi `?lang=vi` được set.
 * Khi `?lang=en`, không load Google Translate để tránh cache.
 */

(function() {
  'use strict';

  // ---- Đọc trạng thái từ URL (ưu tiên) và localStorage ----
  var params = new URLSearchParams(window.location.search);
  var langFromUrl = params.get('lang');
  var savedLang = 'en';
  try { var s = localStorage.getItem('gt_lang'); if (s === 'vi') savedLang = 'vi'; } catch(e) {}

  // URL parameter có quyền cao nhất
  if (langFromUrl === 'en' || langFromUrl === 'vi') {
    savedLang = langFromUrl;
    try { localStorage.setItem('gt_lang', langFromUrl); } catch(e) {}
  }

  // ---- CSS ẩn Google Translate ----
  var ss = document.createElement('style');
  ss.textContent = 
    '.goog-te-banner-frame,.skiptranslate,#goog-gt-tt,' +
    '.goog-te-balloon-frame,.goog-te-gadget-simple,' +
    '.goog-te-gadget-icon,#google_translate_element,' +
    '.goog-te-gadget,iframe[src*="translate.googleapis.com"]{' +
      'display:none!important}' +
    'body{top:0!important}';
  document.head.appendChild(ss);

  // ---- Nếu là VIE, set cookie + load Google Translate ----
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/;';
    loadGoogleTranslate();
  } else {
    // ENG: xóa cookie + KHÔNG load Google Translate
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // KHÔNG load script Google Translate để tránh cache
  }

  function loadGoogleTranslate() {
    var div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.cssText = 'display:none';
    document.body.appendChild(div);

    window.googleTranslateElementInit = function() {
      try {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,vi',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      } catch(e) {}
    };

    var sc = document.createElement('script');
    sc.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(sc);
  }

  // ---- Chuyển ngôn ngữ ----
  function switchLang(lang) {
    try { localStorage.setItem('gt_lang', lang); } catch(e) {}

    // Xóa cookie
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Redirect đến URL với query parameter `lang=`
    // Nếu cùng URL + cùng lang → browser dùng cache → Google Translate không refresh
    // Nếu khác URL → browser load mới hoàn toàn
    var base = window.location.origin + window.location.pathname;
    window.location.href = base + '?lang=' + lang;
  }

  // ---- Dropdown ENG/VIE ----
  document.addEventListener('click', function(e) {
    var link = e.target.closest('.secondary-nav li a');
    if (!link) return;
    var txt = link.textContent.trim().toUpperCase();
    if (txt === 'ENG') { e.preventDefault(); switchLang('en'); }
    else if (txt === 'VIE') { e.preventDefault(); switchLang('vi'); }
  });

  // ---- Đánh dấu active ----
  function markActive() {
    var links = document.querySelectorAll('.secondary-nav li a');
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove('u-c-brand');
      var txt = links[i].textContent.trim().toUpperCase();
      if ((savedLang === 'vi' && txt === 'VIE') || (savedLang !== 'vi' && txt === 'ENG')) {
        links[i].classList.add('u-c-brand');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markActive);
  } else {
    markActive();
  }
})();