/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * Hỗ trợ: ENG (English) và VIE (Tiếng Việt)
 * 
 * - Chọn VIE: set cookie → Google Translate dịch toàn trang sang Tiếng Việt
 * - Chọn ENG: xóa cookie + clear Google Translate cache → trả về English gốc
 * - Ẩn hoàn toàn UI của Google Translate
 */

(function() {
  'use strict';

  // ---- 0. Đọc trạng thái ----
  var savedLang = 'en';
  try {
    var s = localStorage.getItem('gt_lang');
    if (s === 'vi') savedLang = 'vi';
  } catch(e) {}

  // Nếu là VIE, set cookie để Google Translate dịch
  // Nếu là ENG (mặc định), KHÔNG set cookie gì
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/;';
  }

  // ---- CSS ẩn hoàn toàn Google Translate ----
  var style = document.createElement('style');
  style.textContent = 
    '.goog-te-banner-frame, .skiptranslate, ' +
    '#goog-gt-tt, .goog-te-balloon-frame, ' +
    '.goog-te-gadget-simple, .goog-te-gadget-icon, ' +
    '#google_translate_element, .goog-te-gadget, ' +
    'iframe[src*="translate.googleapis.com"] { ' +
      'display: none !important; ' +
    '} ' +
    'body { top: 0px !important; }';
  document.head.appendChild(style);

  // ---- 1. Khởi tạo Google Translate ----
  function initGT() {
    var div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.cssText = 'display:none;';
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

    var script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
  }

  // ---- 2. Chuyển ngôn ngữ ----
  function switchLang(lang) {
    try { localStorage.setItem('gt_lang', lang); } catch(e) {}

    // Xóa cookie googtrans ở mọi path
    ['/', '/Shopping', '/Shopping/'].forEach(function(p) {
      document.cookie = 'googtrans=; path=' + p + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    // Xóa tất cả cache Google Translate
    try {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var key = localStorage.key(i);
        if (key && (key.indexOf('_gt') === 0 || key.indexOf('google') === 0 || key === 'gt_lc')) {
          localStorage.removeItem(key);
        }
      }
    } catch(e) {}

    if (lang === 'vi') {
      document.cookie = 'googtrans=/en/vi; path=/;';
    }

    // Xóa tất cả iframe của Google Translate trước khi redirect
    try {
      document.querySelectorAll('iframe[src*="google"]').forEach(function(f) { f.remove(); });
    } catch(e) {}

    // Dùng location.replace (không tạo history entry) để Google load trang mới hoàn toàn
    var url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?v=' + Date.now();
    location.assign(url);
  }

  // ---- 3. Dropdown ENG/VIE ----
  document.addEventListener('click', function(e) {
    var link = e.target.closest('.secondary-nav li a');
    if (!link) return;
    var text = link.textContent.trim().toUpperCase();
    if (text === 'ENG') {
      e.preventDefault();
      switchLang('en');
    } else if (text === 'VIE') {
      e.preventDefault();
      switchLang('vi');
    }
  });

  // ---- 4. Đánh dấu active ----
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

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initGT();
      markActive();
    });
  } else {
    initGT();
    markActive();
  }
})();