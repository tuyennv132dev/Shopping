/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * Hỗ trợ: ENG (English) và VIE (Tiếng Việt)
 * 
 * Sử dụng Google Translate API trực tiếp để chuyển đổi
 * Không dùng cookie (vì cookie không ổn định)
 */

(function() {
  'use strict';

  // ---- CSS ẩn Google Translate (giữ lại .goog-te-combo để điều khiển) ----
  var style = document.createElement('style');
  style.textContent = 
    '.goog-te-banner-frame, .skiptranslate iframe, ' +
    '#goog-gt-tt, .goog-te-balloon-frame, ' +
    '.goog-te-gadget-simple, .goog-te-gadget-icon, ' +
    '#google_translate_element, ' +
    '.goog-te-gadget { display: none !important; } ' +
    'body { top: 0px !important; } ' +
    /* Đảm bảo combo select luôn hiện để JS điều khiển */
    '.goog-te-combo { position: fixed; top: -9999px; left: -9999px; opacity: 0; pointer-events: none; }';
  document.head.appendChild(style);

  var savedLang = 'en';
  try {
    var s = localStorage.getItem('gt_lang');
    if (s === 'vi') savedLang = 'vi';
  } catch(e) {}

  // Set cookie TRƯỚC khi load Google Translate
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/;';
  } else {
    document.cookie = 'googtrans=/en/en; path=/;';
  }

  // ---- 1. Load Google Translate ----
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

    // Dùng Google Translate API để chuyển ngay (không cần reload)
    var combo = document.querySelector('.goog-te-combo');
    if (combo) {
      if (lang === 'vi') {
        combo.value = 'vi';
      } else {
        combo.value = 'en';
      }
      combo.dispatchEvent(new Event('change'));
      return;
    }

    // Fallback: set cookie + redirect
    document.cookie = 'googtrans=/en/' + lang + '; path=/;';
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