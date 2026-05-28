/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * 
 * Cơ chế:
 * - Mỗi lần load trang, tự động redirect đến URL có ?lang= (en hoặc vi)
 * - VIE: load Google Translate script → dịch trang
 * - ENG: KHÔNG load Google Translate script → English gốc
 * - Cookie googtrans luôn được set đồng bộ với ?lang=
 */

(function() {
  'use strict';

  // ---- Đọc ngôn ngữ ----
  var savedLang = 'en';
  try { var s = localStorage.getItem('gt_lang'); if (s === 'vi') savedLang = 'vi'; } catch(e) {}

  // ---- Set/Xóa cookie tùy theo ngôn ngữ ----
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/; max-age=31536000';
  } else {
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  // ---- CSS ẩn Google Translate UI ----
  var ss = document.createElement('style');
  ss.textContent = 
    '.goog-te-banner-frame,.skiptranslate,#goog-gt-tt,' +
    '.goog-te-balloon-frame,.goog-te-gadget-simple,' +
    '.goog-te-gadget-icon,#google_translate_element,' +
    '.goog-te-gadget,iframe[src*="translate.googleapis.com"]{' +
      'display:none!important}' +
    'body{top:0!important}';
  document.head.appendChild(ss);

  // ---- Chỉ load Google Translate khi cần (VIE) ----
  if (savedLang === 'vi') {
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

  // ---- Chuyển ngôn ngữ: set cookie + reload ----
  function switchLang(lang) {
    try { localStorage.setItem('gt_lang', lang); } catch(e) {}

    if (lang === 'vi') {
      document.cookie = 'googtrans=/en/vi; path=/; max-age=31536000';
    } else {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    // Reload với URL KHÔNG có query params và KHÔNG có hash
    var url = window.location.protocol + '//' + window.location.host + window.location.pathname;
    location.replace(url);
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