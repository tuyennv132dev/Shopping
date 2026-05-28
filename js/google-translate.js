/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * Hỗ trợ: ENG (English) và VIE (Tiếng Việt)
 * Khi chọn ENG: xóa hoàn toàn cookie Google Translate để tắt dịch
 * Khi chọn VIE: set cookie để Google Translate dịch sang tiếng Việt
 */

(function() {
  'use strict';

  // ---- 0. Kiểm tra và khôi phục trạng thái ----
  var savedLang = 'en';
  try {
    var s = localStorage.getItem('gt_lang');
    if (s === 'vi' || s === 'en') savedLang = s;
  } catch(e) {}

  // Nếu lần trước chọn VI, set cookie để Google Translate dịch
  // Nếu lần trước chọn EN, XÓA cookie để tắt hoàn toàn Google Translate
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/;';
  } else {
    // Xóa cookie googtrans để tắt Google Translate
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  // ---- 1. Thêm div ẩn + script Google Translate ----
  function init() {
    // Div ẩn cho Google Translate
    var div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.cssText = 'display:none;';
    document.body.appendChild(div);

    // CSS ẩn banner Google
    var style = document.createElement('style');
    style.textContent = 
      '.goog-te-banner-frame.skiptranslate { display:none !important; } ' +
      'body { top:0px !important; } ' +
      '.goog-te-gadget-icon { display:none !important; }';
    document.head.appendChild(style);

    // Hàm init Google Translate
    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,vi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    // Load script Google Translate
    var script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
  }

  // ---- 2. Chuyển ngôn ngữ ----
  function switchLang(lang) {
    try { localStorage.setItem('gt_lang', lang); } catch(e) {}

    if (lang === 'vi') {
      // Bật Google Translate: set cookie
      document.cookie = 'googtrans=/en/vi; path=/;';
    } else {
      // Tắt Google Translate: XÓA cookie
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    location.reload();
  }

  // ---- 3. Gắn sự kiện click cho dropdown ENG/VIE ----
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

  // ---- 4. Đánh dấu active trên dropdown ----
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
      init();
      markActive();
    });
  } else {
    init();
    markActive();
  }
})();