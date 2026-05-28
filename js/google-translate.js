/**
 * Site language switcher for Huyen Tuyen Rice.
 *
 * Source content is English. Vietnamese is applied through Google Translate.
 * ENG clears Google Translate state and reloads the original page.
 * VIE stores the preference, sets googtrans=/en/vi, and loads Google Translate.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'gt_lang';
  var SOURCE_LANG = 'en';
  var VI_LANG = 'vi';
  var TRANSLATE_COOKIE = 'googtrans';

  function getSavedLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) === VI_LANG ? VI_LANG : SOURCE_LANG;
    } catch (e) {
      return SOURCE_LANG;
    }
  }

  function setSavedLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang === VI_LANG ? VI_LANG : SOURCE_LANG);
    } catch (e) {}
  }

  function getCookieDomains() {
    var host = window.location.hostname;
    var domains = [''];

    if (!host || host === 'localhost' || /^[0-9.]+$/.test(host)) {
      return domains;
    }

    domains.push(host);
    domains.push('.' + host);

    var parts = host.split('.');
    for (var i = 1; i < parts.length - 1; i++) {
      domains.push('.' + parts.slice(i).join('.'));
    }

    return domains;
  }

  function writeCookie(value, maxAge) {
    var domains = getCookieDomains();
    for (var i = 0; i < domains.length; i++) {
      var cookie = TRANSLATE_COOKIE + '=' + value + '; path=/; max-age=' + maxAge + '; SameSite=Lax';
      if (domains[i]) cookie += '; domain=' + domains[i];
      document.cookie = cookie;
    }
  }

  function clearTranslateCookie() {
    var domains = getCookieDomains();
    for (var i = 0; i < domains.length; i++) {
      var cookie = TRANSLATE_COOKIE + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0';
      if (domains[i]) cookie += '; domain=' + domains[i];
      document.cookie = cookie;
    }
  }

  function setVietnameseCookie() {
    writeCookie('/' + SOURCE_LANG + '/' + VI_LANG, 31536000);
  }

  function addNoTranslateMeta() {
    var meta = document.querySelector('meta[name="google"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'google';
      document.head.appendChild(meta);
    }
    meta.content = 'notranslate';
  }

  function addTranslateMeta() {
    var meta = document.querySelector('meta[name="google"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'google';
      document.head.appendChild(meta);
    }
    meta.content = 'translate';
  }

  function hideGoogleTranslateUi() {
    if (document.getElementById('google-translate-hide-style')) return;

    var style = document.createElement('style');
    style.id = 'google-translate-hide-style';
    style.textContent =
      '.goog-te-banner-frame,.skiptranslate,#goog-gt-tt,' +
      '.goog-te-balloon-frame,.goog-te-gadget-simple,' +
      '.goog-te-gadget-icon,#google_translate_element,' +
      '.goog-te-gadget,iframe[src*="translate.googleapis.com"]{' +
      'display:none!important}' +
      'body{top:0!important}';
    document.head.appendChild(style);
  }

  function ensureTranslateContainer() {
    var el = document.getElementById('google_translate_element');
    if (el) return el;

    el = document.createElement('div');
    el.id = 'google_translate_element';
    el.style.display = 'none';
    document.body.appendChild(el);
    return el;
  }

  function forceVietnameseSelection(attempt) {
    attempt = attempt || 0;
    var combo = document.querySelector('.goog-te-combo');

    if (combo) {
      combo.value = VI_LANG;
      combo.dispatchEvent(new Event('change'));
      return;
    }

    if (attempt < 30) {
      window.setTimeout(function () {
        forceVietnameseSelection(attempt + 1);
      }, 200);
    }
  }

  function loadGoogleTranslate() {
    if (window.__htrGoogleTranslateLoaded) {
      forceVietnameseSelection(0);
      return;
    }
    window.__htrGoogleTranslateLoaded = true;

    ensureTranslateContainer();

    window.googleTranslateElementInit = function () {
      try {
        new google.translate.TranslateElement({
          pageLanguage: SOURCE_LANG,
          includedLanguages: SOURCE_LANG + ',' + VI_LANG,
          autoDisplay: false
        }, 'google_translate_element');
      } catch (e) {}

      forceVietnameseSelection(0);
    };

    var script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }

  function reloadCleanPage() {
    window.location.reload();
  }

  function switchLanguage(lang) {
    if (lang === VI_LANG) {
      setSavedLang(VI_LANG);
      setVietnameseCookie();
      reloadCleanPage();
      return;
    }

    setSavedLang(SOURCE_LANG);
    clearTranslateCookie();
    reloadCleanPage();
  }

  function normalizeLanguageText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function isLanguageOption(link) {
    var text = normalizeLanguageText(link.textContent);
    if (text !== 'ENG' && text !== 'VIE') return false;

    var dropdown = link.closest('ul.g-dropdown');
    if (dropdown) return true;

    var parentLi = link.parentElement;
    return !!(parentLi && parentLi.querySelector('ul.g-dropdown'));
  }

  function markActiveLanguage() {
    var currentLang = getSavedLang();
    var links = document.querySelectorAll('.secondary-nav a');

    for (var i = 0; i < links.length; i++) {
      if (!isLanguageOption(links[i])) continue;

      var text = normalizeLanguageText(links[i].textContent);
      links[i].classList.remove('u-c-brand');
      if ((currentLang === VI_LANG && text === 'VIE') || (currentLang !== VI_LANG && text === 'ENG')) {
        links[i].classList.add('u-c-brand');
      }
    }
  }

  function bindLanguageClicks() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('.secondary-nav a');
      if (!link || !isLanguageOption(link)) return;

      var text = normalizeLanguageText(link.textContent);
      event.preventDefault();

      if (text === 'VIE') switchLanguage(VI_LANG);
      if (text === 'ENG') switchLanguage(SOURCE_LANG);
    });
  }

  function init() {
    hideGoogleTranslateUi();
    bindLanguageClicks();
    markActiveLanguage();

    if (getSavedLang() === VI_LANG) {
      addTranslateMeta();
      setVietnameseCookie();
      loadGoogleTranslate();
      return;
    }

    addNoTranslateMeta();
    clearTranslateCookie();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
