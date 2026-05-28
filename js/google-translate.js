/**
 * Site language switcher for Huyen Tuyen Rice.
 *
 * Source content is English. Vietnamese is applied through Google Translate.
 * ENG clears Google Translate state and reloads the original English page.
 * VIE stores the preference, sets googtrans=/en/vi, and loads Google Translate.
 * The switcher labels are marked as notranslate so clicks keep working after
 * Google mutates the page text.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'htr_lang';
  var LEGACY_STORAGE_KEYS = ['gt_lang', 'site_lang', 'language'];
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
      for (var i = 0; i < LEGACY_STORAGE_KEYS.length; i++) {
        localStorage.removeItem(LEGACY_STORAGE_KEYS[i]);
      }
    } catch (e) {}
  }

  function removeLegacyLanguageState() {
    try {
      for (var i = 0; i < LEGACY_STORAGE_KEYS.length; i++) {
        localStorage.removeItem(LEGACY_STORAGE_KEYS[i]);
      }
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

  function clearTranslateState() {
    clearTranslateCookie();

    try {
      sessionStorage.removeItem(TRANSLATE_COOKIE);
      sessionStorage.removeItem('googleTranslateElementInit');
    } catch (e) {}

    try {
      localStorage.removeItem(TRANSLATE_COOKIE);
    } catch (e) {}
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
    try {
      var url = new URL(window.location.href);
      url.searchParams.delete('googtrans');
      window.location.replace(url.toString());
      return;
    } catch (e) {}

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
    clearTranslateState();
    reloadCleanPage();
  }

  function normalizeLanguageText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  function getLanguageLabel(lang) {
    return lang === VI_LANG ? 'VIE' : 'ENG';
  }

  function isLanguageOption(link) {
    if (link.getAttribute('data-htr-lang')) return true;

    var text = normalizeLanguageText(link.textContent);
    if (text !== 'ENG' && text !== 'VIE') return false;

    var dropdown = link.closest('ul.g-dropdown');
    if (dropdown) return true;

    var parentLi = link.parentElement;
    return !!(parentLi && parentLi.querySelector('ul.g-dropdown'));
  }

  function detectLanguageFromLink(link) {
    var explicitLang = link.getAttribute('data-htr-lang');
    if (explicitLang === SOURCE_LANG || explicitLang === VI_LANG) return explicitLang;

    var text = normalizeLanguageText(link.textContent);
    if (text === 'ENG' || text === 'ENGLISH' || text.indexOf('ANH') !== -1) return SOURCE_LANG;
    if (text === 'VIE' || text === 'VI' || text.indexOf('VIET') !== -1 || text.indexOf('VIỆT') !== -1) return VI_LANG;

    return '';
  }

  function getDirectAnchor(parentLi) {
    if (!parentLi) return null;

    for (var i = 0; i < parentLi.children.length; i++) {
      if (parentLi.children[i].tagName === 'A') return parentLi.children[i];
    }

    return null;
  }

  function getLanguageTriggerFromOption(link) {
    var dropdown = link.closest('ul.g-dropdown');
    if (!dropdown) return null;

    return getDirectAnchor(dropdown.parentElement);
  }

  function setLanguageTriggerText(trigger, lang) {
    if (!trigger) return;

    var icon = trigger.querySelector('i');
    trigger.textContent = getLanguageLabel(lang) + ' ';
    if (icon) trigger.appendChild(icon);
  }

  function updateLanguageTriggers(lang) {
    var triggers = document.querySelectorAll('.secondary-nav [data-htr-lang-trigger]');

    for (var i = 0; i < triggers.length; i++) {
      setLanguageTriggerText(triggers[i], lang);
    }
  }

  function prepareLanguageSwitcher() {
    var navs = document.querySelectorAll('.secondary-nav');

    for (var i = 0; i < navs.length; i++) {
      var links = navs[i].querySelectorAll('a');

      for (var j = 0; j < links.length; j++) {
        var text = normalizeLanguageText(links[j].textContent);
        var lang = '';

        if (text === 'ENG') lang = SOURCE_LANG;
        if (text === 'VIE') lang = VI_LANG;
        if (!lang || !isLanguageOption(links[j])) continue;

        links[j].setAttribute('href', '#');
        links[j].setAttribute('data-htr-lang', lang);
        links[j].setAttribute('translate', 'no');
        links[j].classList.add('notranslate');

        var li = links[j].closest('li');
        if (li) {
          li.setAttribute('translate', 'no');
          li.classList.add('notranslate');
        }

        var trigger = getLanguageTriggerFromOption(links[j]);
        if (trigger) {
          trigger.setAttribute('data-htr-lang-trigger', 'true');
          trigger.setAttribute('translate', 'no');
          trigger.classList.add('notranslate');
        }
      }
    }
  }

  function markActiveLanguage() {
    var currentLang = getSavedLang();
    var links = document.querySelectorAll('.secondary-nav a');

    updateLanguageTriggers(currentLang);

    for (var i = 0; i < links.length; i++) {
      if (!isLanguageOption(links[i])) continue;

      var lang = detectLanguageFromLink(links[i]);
      links[i].classList.remove('u-c-brand');
      if ((currentLang === VI_LANG && lang === VI_LANG) || (currentLang !== VI_LANG && lang === SOURCE_LANG)) {
        links[i].classList.add('u-c-brand');
      }
    }
  }

  function bindLanguageClicks() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('.secondary-nav a');
      if (!link || !isLanguageOption(link)) return;

      var lang = detectLanguageFromLink(link);
      if (!lang) return;

      event.preventDefault();
      event.stopPropagation();

      switchLanguage(lang);
    });
  }

  function init() {
    hideGoogleTranslateUi();
    prepareLanguageSwitcher();
    bindLanguageClicks();
    markActiveLanguage();

    if (getSavedLang() === VI_LANG) {
      addTranslateMeta();
      setVietnameseCookie();
      loadGoogleTranslate();
      return;
    }

    removeLegacyLanguageState();
    addNoTranslateMeta();
    clearTranslateState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
