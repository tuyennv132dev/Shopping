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

  // ---- Đọc ngôn ngữ từ URL (ưu tiên) + localStorage ----
  var params = new URLSearchParams(window.location.search);
  var langFromUrl = params.get('lang');
  var savedLang = 'en';

  // Đọc từ localStorage
  try {
    var s = localStorage.getItem('gt_lang');
    if (s === 'vi') savedLang = 'vi';
  } catch(e) {}

  // Nếu URL không có ?lang=, redirect đến URL phù hợp
  if (langFromUrl !== 'en' && langFromUrl !== 'vi') {
    try { localStorage.setItem('gt_lang', savedLang); } catch(e) {}
    var targetLang = savedLang;
    var cleanUrl = window.location.origin + window.location.pathname;
    window.location.href = cleanUrl + '?lang=' + targetLang;
    return; // Dừng mọi xử lý, chờ redirect
  }

  // Nếu URL có ?lang=, lưu vào localStorage và set cookie
  savedLang = langFromUrl;
  try { localStorage.setItem('gt_lang', langFromUrl); } catch(e) {}

  // Set cookie cho Google Translate
  // /en/vi = dịch Anh→Việt, /en/en = giữ nguyên English
  document.cookie = 'googtrans=/en/' + savedLang + '; path=/; max-age=31536000';

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

  // ---- Chỉ load Google Translate khi cần (lang=vi) ----
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
  // Nếu lang=en => KHÔNG load script nào, trang sẽ hiện English gốc

  // ---- Chuyển ngôn ngữ: redirect đến URL mới ----
  function switchLang(lang) {
    try { localStorage.setItem('gt_lang', lang); } catch(e) {}
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