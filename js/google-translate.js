/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * Hỗ trợ: ENG (English) và VIE (Tiếng Việt)
 * 
 * - Chọn VIE: bật Google Translate, ẩn banner Google, chỉ dùng dropdown của dự án
 * - Chọn ENG: xóa cookie Google Translate, reload về tiếng Anh mặc định
 */

(function() {
  'use strict';

  // ---- 0. Khôi phục trạng thái ----
  var savedLang = 'en';
  try {
    var s = localStorage.getItem('gt_lang');
    if (s === 'vi' || s === 'en') savedLang = s;
  } catch(e) {}

  // Set/Xóa cookie googtrans
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/;';
  } else {
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  // ---- CSS ẩn hoàn toàn Google Translate ----
  var style = document.createElement('style');
  style.textContent = 
    '.goog-te-banner-frame.skiptranslate, ' +
    '.goog-te-banner-frame, ' +
    '#goog-gt-tt, ' +
    '.goog-te-balloon-frame, ' +
    '.goog-te-gadget-simple, ' +
    '.goog-te-gadget-icon, ' +
    'iframe[src*="translate.googleapis.com"], ' +
    '.goog-te-spinner-pos, ' +
    '#google_translate_element { ' +
      'display: none !important; ' +
    '} ' +
    'body { top: 0px !important; } ' +
    /* Ẩn thanh thông báo "This page is in English" */
    '.skiptranslate > iframe:first-child { display: none !important; } ' +
    'iframe.goog-te-banner-frame { display: none !important; }';
  document.head.appendChild(style);

  // ---- 1. Tạo widget ẩn + load Google Translate ----
  function initGT() {
    var div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.cssText = 'display:none;position:fixed;top:-9999px;left:-9999px;';
    document.body.appendChild(div);

    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,vi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    var script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
  }

  // ---- 2. Chuyển ngôn ngữ ----
  function switchLang(lang) {
    try { localStorage.setItem('gt_lang', lang); } catch(e) {}

    if (lang === 'vi') {
      document.cookie = 'googtrans=/en/vi; path=/;';
    } else {
      // Xóa cookie để tắt Google Translate hoàn toàn
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    location.reload();
  }

  // ---- 3. Gắn sự kiện cho dropdown ENG/VIE ----
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