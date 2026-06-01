/**
 * search-results.js
 * Client-side filtering + pagination for static search results page.
 *
 * Assumptions:
 * - Each product card root is `.product-container .product-item`
 * - Each `.product-item .item` contains `data-product-price` (number-like)
 * - Price filter uses `.facet-filter-by-price` and the text in `.price-from` / `.price-to`
 * - Pagination container is `.pagination-area .pagination-number`
 */

(function () {
  'use strict';

  function parseVndNumber(text) {
    if (!text) return 0;
    var num = String(text).replace(/[^0-9]/g, '');
    return parseInt(num || '0', 10) || 0;
  }

  function getProducts() {
    return Array.prototype.slice.call(document.querySelectorAll('.product-container .product-item'));
  }

  function getCheckedFacetValues(prefix) {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('input.check-box[id^="' + prefix + '"]'));
    if (inputs.length === 0) return null; // facet not present on this page

    var selected = [];
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        selected.push(inputs[i].id.slice(prefix.length));
      }
    }
    return selected; // empty array means "no selection" => allow all
  }

  function getCardTokens(productItemEl, attrName) {
    var card = productItemEl.querySelector('.item');
    if (!card) return [];
    var raw = card.getAttribute(attrName);
    if (!raw) return [];
    return String(raw)
      .split(/\s+/)
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  function getProductPrice(productItemEl) {
    var card = productItemEl.querySelector('.item');
    if (!card) return 0;
    var p = card.getAttribute('data-product-price');
    return parseVndNumber(p);
  }

  function getFilters() {
    var minInput = document.getElementById('price-min');
    var maxInput = document.getElementById('price-max');
    var minVal = minInput && minInput.value !== '' ? parseInt(minInput.value, 10) : NaN;
    var maxVal = maxInput && maxInput.value !== '' ? parseInt(maxInput.value, 10) : NaN;
    if (!isNaN(minVal) || !isNaN(maxVal)) {
      return {
        min: !isNaN(minVal) ? Math.max(0, minVal) : 0,
        max: !isNaN(maxVal) ? Math.max(0, maxVal) : 0
      };
    }

    var fromEl = document.querySelector('.facet-filter-by-price .price-from');
    var toEl = document.querySelector('.facet-filter-by-price .price-to');
    return {
      min: parseVndNumber(fromEl ? fromEl.textContent : ''),
      max: parseVndNumber(toEl ? toEl.textContent : '')
    };
  }

  function formatVnd(value) {
    var v = typeof value === 'number' && !isNaN(value) ? value : 0;
    return v.toLocaleString('vi-VN') + ' VND';
  }

  function setPriceLabels(minValue, maxValue) {
    var fromEl = document.querySelector('.facet-filter-by-price .price-from');
    var toEl = document.querySelector('.facet-filter-by-price .price-to');
    if (fromEl) fromEl.textContent = formatVnd(minValue);
    if (toEl) toEl.textContent = formatVnd(maxValue);
  }

  function initPriceSlider(onRangeChange) {
    if (typeof window.jQuery === 'undefined') return;
    if (!window.jQuery.fn || typeof window.jQuery.fn.slider !== 'function') return;

    var $ = window.jQuery;
    var rangeEl = document.querySelector('.facet-filter-by-price .price-slider-range');
    var filterEl = document.querySelector('.facet-filter-by-price .price-filter');
    if (!rangeEl || !filterEl) return;

    var minAttr = parseInt(rangeEl.getAttribute('data-min'), 10);
    var maxAttr = parseInt(rangeEl.getAttribute('data-max'), 10);
    var lowAttr = parseInt(rangeEl.getAttribute('data-default-low'), 10);
    var highAttr = parseInt(rangeEl.getAttribute('data-default-high'), 10);

    var sliderMin = isNaN(minAttr) ? 0 : minAttr;
    var sliderMax = isNaN(maxAttr) ? 500000 : maxAttr;
    var sliderLow = isNaN(lowAttr) ? sliderMin : lowAttr;
    var sliderHigh = isNaN(highAttr) ? sliderMax : highAttr;

    // Clamp
    sliderLow = Math.max(sliderMin, Math.min(sliderLow, sliderMax));
    sliderHigh = Math.max(sliderMin, Math.min(sliderHigh, sliderMax));
    if (sliderLow > sliderHigh) sliderLow = sliderHigh;

    var minInput = document.getElementById('price-min');
    var maxInput = document.getElementById('price-max');

    function syncToInputs(a, b) {
      // Respect input step=1000 to avoid native validation errors on submit.
      var step = 1000;
      a = Math.round(a / step) * step;
      b = Math.round(b / step) * step;
      if (minInput) minInput.value = String(a);
      if (maxInput) maxInput.value = String(b);
      setPriceLabels(a, b);
    }

    // Create slider on .price-filter (UI element), using values from .price-slider-range config
    $(filterEl).slider({
      range: true,
      min: sliderMin,
      max: sliderMax,
      step: 1000,
      values: [sliderLow, sliderHigh],
      slide: function (event, ui) {
        syncToInputs(ui.values[0], ui.values[1]);
      },
      change: function (event, ui) {
        syncToInputs(ui.values[0], ui.values[1]);
        if (typeof onRangeChange === 'function') onRangeChange(ui.values[0], ui.values[1]);
      }
    });

    syncToInputs(sliderLow, sliderHigh);

    // If user types inputs, update slider
    function updateFromInputs() {
      if (!minInput && !maxInput) return;
      var a = minInput && minInput.value !== '' ? parseInt(minInput.value, 10) : NaN;
      var b = maxInput && maxInput.value !== '' ? parseInt(maxInput.value, 10) : NaN;
      if (isNaN(a) && isNaN(b)) return;
      if (isNaN(a)) a = sliderMin;
      if (isNaN(b)) b = sliderMax;
      a = Math.max(sliderMin, Math.min(a, sliderMax));
      b = Math.max(sliderMin, Math.min(b, sliderMax));
      if (a > b) { var t = a; a = b; b = t; }
      $(filterEl).slider('values', [a, b]);
      syncToInputs(a, b);
    }

    if (minInput) minInput.addEventListener('change', updateFromInputs);
    if (maxInput) maxInput.addEventListener('change', updateFromInputs);
  }

  function getPageSize() {
    var sel = document.getElementById('show-records');
    if (!sel) return 8;
    if (String(sel.value).toLowerCase() === 'all') return Number.MAX_SAFE_INTEGER;
    var val = parseInt(sel.value, 10);
    if (!isNaN(val) && val > 0) return val;
    // Fallback: parse label like "Show: 8"
    var opt = sel.options[sel.selectedIndex];
    if (opt && opt.textContent) {
      var m = opt.textContent.match(/(\d+)/);
      if (m) return parseInt(m[1], 10) || 8;
    }
    return 8;
  }

  function getSortMode() {
    var sel = document.getElementById('sort-by');
    return sel ? String(sel.value || '') : '';
  }

  function productHasTag(productItemEl, tagName) {
    return !!productItemEl.querySelector('.item .tag.' + tagName);
  }

  function renderPagination(containerEl, page, totalPages, onPageChange) {
    if (!containerEl) return;

    containerEl.innerHTML = '';
    if (totalPages <= 1) return;

    var ul = document.createElement('ul');

    function addLi(label, targetPage, disabled, active, title) {
      var li = document.createElement('li');
      if (active) li.className = 'active';
      if (disabled) li.style.display = 'none';

      var a = document.createElement('a');
      a.href = 'javascript:void(0)';
      if (title) a.title = title;
      a.textContent = label;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (targetPage === page) return;
        onPageChange(targetPage);
      });
      li.appendChild(a);
      ul.appendChild(li);
    }

    addLi('‹', Math.max(1, page - 1), page === 1, false, 'Previous');

    for (var i = 1; i <= totalPages; i++) {
      addLi(String(i), i, false, i === page, null);
    }

    addLi('›', Math.min(totalPages, page + 1), page === totalPages, false, 'Next');

    containerEl.appendChild(ul);
  }

  function apply(products, page) {
    var filters = getFilters();
    var pageSize = getPageSize();
    var riceTypes = getCheckedFacetValues('rice-');
    var useCases = getCheckedFacetValues('use-');

    var filtered = [];
    for (var i = 0; i < products.length; i++) {
      var price = getProductPrice(products[i]);
      var okMin = filters.min ? price >= filters.min : true;
      var okMax = filters.max ? price <= filters.max : true;

      // Facet: Rice Type
      var okRice = true;
      if (riceTypes !== null && riceTypes.length > 0) {
        var cardRice = getCardTokens(products[i], 'data-filter-rice');
        okRice = cardRice.some(function (t) { return riceTypes.indexOf(t) !== -1; });
      }

      // Facet: Use Case
      var okUse = true;
      if (useCases !== null && useCases.length > 0) {
        var cardUse = getCardTokens(products[i], 'data-filter-use');
        okUse = cardUse.some(function (t) { return useCases.indexOf(t) !== -1; });
      }

    if (okMin && okMax && okRice && okUse) filtered.push(products[i]);
    }

    var sortMode = getSortMode();
    if (sortMode === 'hot' || sortMode === 'sale' || sortMode === 'new') {
      filtered = filtered.filter(function (product) {
        return productHasTag(product, sortMode);
      });
    } else if (sortMode === 'price-asc') {
      filtered.sort(function (a, b) {
        return getProductPrice(a) - getProductPrice(b);
      });
    } else if (sortMode === 'price-desc') {
      filtered.sort(function (a, b) {
        return getProductPrice(b) - getProductPrice(a);
      });
    }

    var container = document.querySelector('.product-container');
    if (container) {
      for (var s = 0; s < filtered.length; s++) {
        container.appendChild(filtered[s]);
      }
    }

    var totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    var safePage = Math.min(Math.max(1, page), totalPages);

    // Hide all first
    for (var j = 0; j < products.length; j++) products[j].style.display = 'none';

    var start = (safePage - 1) * pageSize;
    var end = Math.min(filtered.length, start + pageSize);
    for (var k = start; k < end; k++) filtered[k].style.display = '';

    var pager = document.querySelector('.pagination-area .pagination-number');
    renderPagination(pager, safePage, totalPages, function (nextPage) {
      apply(products, nextPage);
      // scroll to products
      var anchor = document.querySelector('.product-container');
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function init() {
    var products = getProducts();
    if (products.length === 0) return;

    initPriceSlider(function () {
      apply(products, 1);
    });

    // Price filter submit
    var priceForm = document.querySelector('.facet-filter-by-price form.facet-form');
    if (priceForm) {
      priceForm.addEventListener('submit', function (e) {
        e.preventDefault();
        apply(products, 1);
      });
    }

    // Facet checkboxes
    var facetInputs = Array.prototype.slice.call(document.querySelectorAll('input.check-box[id^="rice-"], input.check-box[id^="use-"]'));
    for (var i = 0; i < facetInputs.length; i++) {
      facetInputs[i].addEventListener('change', function () {
        apply(products, 1);
      });
    }

    // Page size change
    var showSel = document.getElementById('show-records');
    if (showSel) {
      showSel.addEventListener('change', function () {
        apply(products, 1);
      });
    }

    var sortSel = document.getElementById('sort-by');
    if (sortSel) {
      sortSel.addEventListener('change', function () {
        apply(products, 1);
      });
    }

    apply(products, 1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
