/**
 * google-translate.js - Google Translate cho Huyen Tuyen Rice
 * 
 * - VIE: set googtrans=/en/vi → Google dịch Anh→Việt
 * - ENG: xóa googtrans → Google không dịch, English gốc
 * - Ẩn hoàn toàn UI Google Translate
 * 
 * Nguyên tắc: CHỈ set cookie VIE. Với ENG thì xóa sạch.
 */

(function() {
  'use strict';

  // ---- Trạng thái ----
  var savedLang = 'en';
  try { var s = localStorage.getItem('gt_lang'); if (s === 'vi') savedLang = 'vi'; } catch(e) {}

  // Set cookie TRƯỚC khi Google Translate khởi tạo
  // QUAN TRỌNG: chỉ set khi VIE. ENG thì không set gì
  if (savedLang === 'vi') {
    document.cookie = 'googtrans=/en/vi; path=/';
  }

  // ---- CSS ẩn Google Translate ----
  var s = document.createElement('style');
  s.textContent = '.goog-te-banner-frame,.skiptranslate,#goog-gt-tt,.goog-te-balloon-frame,.goog-te-gadget-simple,.goog-te-gadget-icon,#google_translate_element,.goog-te-gadget,iframe[src*="translate.googleapis.com"]{display:none!important}body{top:0!important}';
  document.head.appendChild(s);

  // ---- Khởi tạo Google Translate ----
  function initGT() {
    if (document.getElementById('google_translate_element')) return;
    var d = document.createElement('div');
    d.id = 'google_translate_element';
    d.style.cssText = 'display:none;position:absolute;top:-9999px';
    document.body.appendChild(d);
    window.googleTranslateElementInit = function() {
      try { new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'en,vi',layout:google.translate.TranslateElement.InlineLayout.SIMPLE,autoDisplay:false}, 'google_translate_element'); } catch(e) {}
    };
    var sc = document.createElement('script');
    sc.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(sc);
  }

  // ---- Chuyển ngôn ngữ ----
  function switchLang(lang) {
    try { localStorage.setItem('gt_lang', lang); } catch(e) {}

    // Xóa cookie googtrans ở mọi path
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=; path=/Shopping; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=; path=/Shopping/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Nếu VIE, set cookie
    if (lang === 'vi') {
      document.cookie = 'googtrans=/en/vi; path=/';
    }

    // Redirect đến URL với timestamp để cache bust
    var base = window.location.origin + window.location.pathname;
    window.location.href = base + '?v=' + Date.now();
  }

  // ---- Dropdown ----
  document.addEventListener('click', function(e) {
    var link = e.target.closest('.secondary-nav li a');
    if (!link) return;
    var txt = link.textContent.trim().toUpperCase();
    if (txt === 'ENG') { e.preventDefault(); switchLang('en'); }
    else if (txt === 'VIE') { e.preventDefault(); switchLang('vi'); }
  });

  // ---- Active ----
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