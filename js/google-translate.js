/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * 
 * Chuyển đổi ENG/VIE bằng cách điều khiển trực tiếp
 * combo select của Google Translate
 */

(function() {
  'use strict';

  // ---- Trạng thái ----
  var savedLang = 'en';
  try { var s = localStorage.getItem('gt_lang'); if (s === 'vi') savedLang = 'vi'; } catch(e) {}

  // Set cookie cho lần load đầu tiên
  document.cookie = 'googtrans=/en/' + savedLang + '; path=/;';

  // ---- CSS ẩn Google Translate nhưng GIỮ combo select ----
  var ss = document.createElement('style');
  ss.textContent = 
    '.goog-te-banner-frame,.skiptranslate,#goog-gt-tt,' +
    '.goog-te-balloon-frame,.goog-te-gadget-simple,' +
    '.goog-te-gadget-icon,#google_translate_element,' +
    '.goog-te-gadget,iframe[src*="translate.googleapis.com"]{' +
      'display:none!important}' +
    'body{top:0!important}';
  document.head.appendChild(ss);

  // ---- Khởi tạo Google Translate ----
  function initGT() {
    if (document.getElementById('gt_init_done')) return;
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
      // Đánh dấu đã init
      var mark = document.createElement('div');
      mark.id = 'gt_init_done';
      mark.style.display = 'none';
      document.body.appendChild(mark);
    };

    var sc = document.createElement('script');
    sc.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(sc);
  }

  // ---- Chuyển ngôn ngữ bằng cách click vào combo ----
  function switchLang(lang) {
    try { localStorage.setItem('gt_lang', lang); } catch(e) {}

    // Tìm combo select mà Google Translate tạo ra
    var combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = lang; // 'en' hoặc 'vi'
      combo.dispatchEvent(new Event('change'));
      savedLang = lang;
      markActive();
      return;
    }

    // Fallback: set cookie + reload
    document.cookie = 'googtrans=/en/' + lang + '; path=/;';
    location.reload();
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

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initGT(); markActive(); });
  } else { initGT(); markActive(); }
})();