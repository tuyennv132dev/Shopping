/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * Hỗ trợ: ENG (English) và VIE (Tiếng Việt)
 */

(function() {
  'use strict';

  // Đọc ngôn ngữ đã lưu
  var savedLang = 'en';
  try {
    var s = localStorage.getItem('gt_lang');
    if (s === 'vi') savedLang = 'vi';
  } catch(e) {}

  // Set cookie googtrans TRƯỚC khi load Google Translate
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/;';
  } else {
    document.cookie = 'googtrans=/en/en; path=/;';
  }

  // ---- 1. Thêm div ẩn + script Google Translate ----
  function init() {
    // Div ẩn cho Google Translate
    var div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.cssText = 'display:none;';
    document.body.appendChild(div);

    // CSS ẩn banner
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
    document.cookie = 'googtrans=/en/' + (lang === 'vi' ? 'vi' : 'en') + '; path=/;';
    location.reload();
  }

  // ---- 3. Gắn sự kiện click cho dropdown ENG/VI ----
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