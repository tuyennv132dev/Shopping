/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * Hỗ trợ: ENG (English) và VIE (Tiếng Việt)
 * 
 * - Chọn VIE: set cookie googtrans=/en/vi → Google dịch sang Tiếng Việt
 * - Chọn ENG: set cookie googtrans=/en/en → Google giữ nguyên English (không dịch)
 * - Nếu lần đầu truy cập (không có localStorage): mặc định ENG, KHÔNG set cookie gì
 */

(function() {
  'use strict';

  // ---- 0. Đọc trạng thái ----
  var savedLang = 'en';
  try {
    var s = localStorage.getItem('gt_lang');
    if (s === 'vi') savedLang = 'vi';
  } catch(e) {}

  // Set cookie TRƯỚC khi Google Translate khởi tạo
  // Quan trọng: set cookie với path, domain và max-age
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/;';
  } else {
    // Set cookie /en/en = giữ nguyên English gốc
    document.cookie = 'googtrans=/en/en; path=/;';
  }

  // ---- CSS ẩn Google Translate ----
  var style = document.createElement('style');
  style.textContent = 
    '.goog-te-banner-frame, .skiptranslate iframe, ' +
    '#goog-gt-tt, .goog-te-balloon-frame, ' +
    '.goog-te-gadget-simple, .goog-te-gadget-icon, ' +
    '#google_translate_element, .goog-te-gadget { ' +
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

    // Set cookie googtrans
    document.cookie = 'googtrans=/en/' + lang + '; path=/;';

    // Dùng Google Translate API để chuyển ngôn ngữ trực tiếp
    if (window.google && google.translate) {
      try {
        // Google Translate tạo iframe với combo, thay đổi giá trị sẽ kích hoạt dịch
        var iframe = document.querySelector('iframe.goog-te-menu-frame');
        if (iframe) {
          var doc = iframe.contentDocument || iframe.contentWindow.document;
          if (doc) {
            var combo = doc.querySelector('.goog-te-menu2-item span.text');
            if (combo) {
              // Click vào đúng mục
              var items = doc.querySelectorAll('.goog-te-menu2-item');
              var langCode = lang === 'vi' ? 'vi' : 'en';
              for (var i = 0; i < items.length; i++) {
                var text = items[i].textContent.trim().toLowerCase();
                if ((langCode === 'vi' && (text.indexOf('vietnam') !== -1 || text.indexOf('việt') !== -1)) ||
                    (langCode === 'en' && text.indexOf('english') !== -1)) {
                  items[i].querySelector('span.text').click();
                  return;
                }
              }
            }
          }
        }
      } catch(e) {}
    }

    // Fallback: reload
    location.reload();
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