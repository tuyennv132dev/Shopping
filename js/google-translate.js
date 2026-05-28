/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * Hỗ trợ: ENG (English) và VIE (Tiếng Việt)
 * 
 * - Chọn VIE: set cookie → Google dịch sang Tiếng Việt
 * - Chọn ENG: xóa cookie → Google không dịch, hiển thị English gốc
 * - Ẩn hoàn toàn banner/popup Google Translate
 */

(function() {
  'use strict';

  // ---- 0. Khôi phục trạng thái ----
  var savedLang = 'en';
  try {
    var s = localStorage.getItem('gt_lang');
    if (s === 'vi') savedLang = 'vi';
  } catch(e) {}

  // Set cookie TRƯỚC khi Google Translate load
  // VIE = /en/vi, ENG = xóa cookie
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/;';
  } else {
    // Xóa cookie hoàn toàn - Google sẽ không dịch gì
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  // ---- CSS ẩn hoàn toàn Google Translate ----
  var style = document.createElement('style');
  style.textContent = 
    '.goog-te-banner-frame, ' +
    '.goog-te-banner-frame.skiptranslate, ' +
    '#goog-gt-tt, ' +
    '.goog-te-balloon-frame, ' +
    '.goog-te-gadget-simple, ' +
    '.goog-te-gadget-icon, ' +
    'iframe[src*="translate.googleapis.com"], ' +
    '.goog-te-spinner-pos, ' +
    '#google_translate_element, ' +
    '.skiptranslate > iframe { ' +
      'display: none !important; ' +
    '} ' +
    'body { top: 0px !important; }';
  document.head.appendChild(style);

  // ---- 1. Load Google Translate (ẩn) ----
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

    if (lang === 'vi') {
      // Set cookie để Google Translate dịch sang Việt
      document.cookie = 'googtrans=/en/vi; path=/;';
    } else {
      // Xóa cookie googtrans ở TẤT CẢ các path/domain để Google không dịch
      // Path=/
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Path=/Shopping
      document.cookie = 'googtrans=; path=/Shopping; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Path=/Shopping/
      document.cookie = 'googtrans=; path=/Shopping/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Domain .github.io
      document.cookie = 'googtrans=; path=/; domain=.github.io; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'googtrans=; path=/Shopping; domain=.github.io; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'googtrans=; path=/Shopping/; domain=.github.io; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // Cũng dùng Google Translate API để chuyển về English nếu có iframe
      try {
        var iframes = document.querySelectorAll('iframe.goog-te-menu-frame');
        if (iframes.length) {
          var doc = iframes[0].contentDocument || iframes[0].contentWindow.document;
          if (doc) {
            var items = doc.querySelectorAll('.goog-te-menu2-item span.text');
            for (var i = 0; i < items.length; i++) {
              var txt = items[i].textContent.trim().toLowerCase();
              if (txt.indexOf('english') !== -1) {
                items[i].click();
                return;
              }
            }
          }
        }
      } catch(ex) {}
    }
    location.reload();
  }

  // ---- 3. Gắn sự kiện dropdown ENG/VIE ----
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