/**
 * cart.js - Unified cart logic for the whole site
 *
 * Single localStorage key: "cart"
 * Each cart item: { id, name, price, image, quantity }
 *
 * Handles:
 *   - Add to cart from product cards (.item-addCart)
 *   - Mini cart / Your Cart dynamic render
 *   - Cart page (cart.html) full render
 *   - Cart count badge
 *   - Quantity update, remove
 *   - Normalize old data (qty -> quantity)
 */

(function () {
  'use strict';

  // ── Core Cart Functions ──────────────────────────────────────────

  /**
   * Normalize cart item from localStorage.
   * Handles old format: { id, name, price, qty } -> { id, name, price, image, quantity }
   */
  function normalizeItem(item) {
    // Parse price: if it's a string like "18,000 VND/kg", extract the numeric part
    var price = 0;
    if (typeof item.price === 'number') {
      price = item.price;
    } else if (typeof item.price === 'string') {
      price = parseFloat(item.price.replace(/[^0-9]/g, '')) || 0;
    }
    return {
      id: item.id || 'unknown',
      name: item.name || 'Unknown',
      price: price,
      image: item.image || '',
      quantity: typeof item.quantity === 'number' ? item.quantity : (typeof item.qty === 'number' ? item.qty : 1)
    };
  }

  function getCart() {
    try {
      const data = localStorage.getItem('cart');
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      // Normalize each item and filter out invalid ones
      return parsed
        .map(normalizeItem)
        .filter(function (item) {
          return item.id && item.id !== 'unknown' && item.price > 0;
        });
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    // Save only with the standard format
    const clean = cart.map(function (item) {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || '',
        quantity: item.quantity
      };
    });
    localStorage.setItem('cart', JSON.stringify(clean));
  }

  /**
   * Format number to VND string with thousand separators
   */
  function formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) return '0 VND';
    return value.toLocaleString('vi-VN') + ' VND';
  }

  /**
   * Clean up any old/broken cart data
   */
  function clearOldCart() {
    // If there's any old key we don't use, remove it
    var oldKeys = ['shoppingCart', 'cartItems', 'groceryCart'];
    oldKeys.forEach(function (key) {
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    });
  }

  // ── Cart Operations ──────────────────────────────────────────────

  function addToCart(product) {
    if (!product || !product.id) return;

    var cart = getCart();
    var existingIndex = -1;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === product.id) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += (product.quantity || 1);
    } else {
      cart.push({
        id: product.id,
        name: product.name || 'Unknown',
        price: typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 0),
        image: product.image || '',
        quantity: product.quantity || 1
      });
    }

    saveCart(cart);
    updateAllUI();
  }

  function removeFromCart(productId) {
    var cart = getCart();
    cart = cart.filter(function (item) {
      return item.id !== productId;
    });
    saveCart(cart);
    updateAllUI();
  }

  function updateQuantity(productId, newQty) {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        cart[i].quantity = newQty;
        saveCart(cart);
        updateAllUI();
        return;
      }
    }
  }

  // ── Computed Values ──────────────────────────────────────────────

  function getTotalQuantity() {
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
      total += (typeof cart[i].quantity === 'number' ? cart[i].quantity : 0);
    }
    return total;
  }

  function getTotalPrice() {
    var cart = getCart();
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
      total += (typeof cart[i].price === 'number' ? cart[i].price : 0) * (typeof cart[i].quantity === 'number' ? cart[i].quantity : 0);
    }
    return total;
  }

  // ── UI Update Functions ──────────────────────────────────────────

  function updateAllUI() {
    updateCartCount();
    renderMiniCart();
    renderCartPage();
    updateFixedCounter();
  }

  function updateCartCount() {
    var total = getTotalQuantity();
    var els = document.querySelectorAll('.item-counter');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = total;
    }
  }

  function updateFixedCounter() {
    var total = getTotalQuantity();
    var els = document.querySelectorAll('.fixed-item-counter');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = total;
    }
  }

  function renderMiniCart() {
    var listEl = document.querySelector('.mini-cart-list');
    if (!listEl) return;

    var cart = getCart();
    var totalPrice = getTotalPrice();

    if (cart.length === 0) {
      listEl.innerHTML =
        '<li class="clearfix empty-cart-msg" style="text-align:center;padding:30px 20px;">' +
        '<span style="color:#999;font-size:14px;">Your cart is empty.</span>' +
        '</li>';
      var totalEl = document.querySelector('.mini-total-price');
      if (totalEl) totalEl.textContent = '0 VND';
      return;
    }

    var html = '';
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var subtotal = (item.price || 0) * (item.quantity || 0);
      html +=
        '<li class="clearfix">' +
        '<a href="' + item.id + '" style="display:flex;align-items:center;gap:10px;padding:8px 0;">';
      if (item.image) {
        html += '<img src="' + item.image + '" alt="' + item.name + '" style="width:50px;height:50px;object-fit:cover;border-radius:4px;">';
      }
      html +=
        '<div style="flex:1;min-width:0;">' +
        '<span class="mini-item-name" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.name + '</span>' +
        '<span class="mini-item-price">' + formatCurrency(item.price) + '</span>' +
        '<span class="mini-item-quantity"> x ' + item.quantity + '</span>' +
        '</div>' +
        '</a>' +
        '</li>';
    }

    listEl.innerHTML = html;

    var totalEl = document.querySelector('.mini-total-price');
    if (totalEl) totalEl.textContent = formatCurrency(totalPrice);
  }

  function renderCartPage() {
    // Only run on cart page
    if (!document.body.classList.contains('cart-page')) return;

    var cart = getCart();
    var tbody = document.querySelector('.page-cart table tbody');
    if (!tbody) return;

    if (cart.length === 0) {
      var tableWrapper = document.querySelector('.table-wrapper');
      if (tableWrapper) {
        tableWrapper.innerHTML =
          '<div class="empty-cart" style="text-align:center;padding:60px 20px;">' +
          '<i class="ion ion-md-basket" style="font-size:80px;color:#ddd;"></i>' +
          '<h3 style="margin-top:20px;color:#666;">Your cart is empty</h3>' +
          '<p style="color:#999;margin-bottom:20px;">Looks like you haven\'t added any products yet.</p>' +
          '<a href="index.html" class="button button-outline-secondary" style="padding:10px 30px;">Continue Shopping</a>' +
          '</div>';
      }
      var coupon = document.querySelector('.coupon-continue-checkout');
      var billing = document.querySelector('.calculation');
      if (coupon) coupon.style.display = 'none';
      if (billing) billing.style.display = 'none';

      // Also update mini cart in header
      renderMiniCart();
      updateCartCount();
      return;
    }

    var coupon = document.querySelector('.coupon-continue-checkout');
    var billing = document.querySelector('.calculation');
    if (coupon) coupon.style.display = '';
    if (billing) billing.style.display = '';

    var html = '';
    var subtotalSum = 0;

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var subtotal = (item.price || 0) * (item.quantity || 0);
      subtotalSum += subtotal;

      html +=
        '<tr data-product-id="' + item.id + '">' +
        '<td>' +
        '<div class="cart-anchor-image">' +
        '<a href="' + item.id + '">';
      if (item.image) {
        html += '<img src="' + item.image + '" alt="' + item.name + '" style="width:80px;height:80px;object-fit:cover;">';
      }
      html +=
        '<h6>' + item.name + '</h6>' +
        '</a>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<div class="cart-price">' + formatCurrency(item.price) + '</div>' +
        '</td>' +
        '<td>' +
        '<div class="cart-quantity">' +
        '<div class="quantity">' +
        '<input type="text" class="quantity-text-field" value="' + item.quantity + '">' +
        '<a class="plus-a" data-max="1000" data-product-id="' + item.id + '">&#43;</a>' +
        '<a class="minus-a" data-min="1" data-product-id="' + item.id + '">&#45;</a>' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<div class="action-wrapper">' +
        '<span class="cart-subtotal" style="margin-right:10px;font-weight:600;">' + formatCurrency(subtotal) + '</span>' +
        '<button class="button button-outline-secondary fas fa-trash btn-remove-cart" data-product-id="' + item.id + '"></button>' +
        '</div>' +
        '</td>' +
        '</tr>';
    }

    tbody.innerHTML = html;

    // Update billing totals
    var calcTexts = document.querySelectorAll('.calc-text');
    if (calcTexts.length >= 1) {
      calcTexts[0].textContent = formatCurrency(subtotalSum);
    }
    if (calcTexts.length >= 3) {
      calcTexts[calcTexts.length - 1].textContent = formatCurrency(subtotalSum);
    }

    // Also update mini cart in header
    renderMiniCart();
    updateCartCount();
    updateFixedCounter();
  }

  // ── Product Data Extraction ──────────────────────────────────────

  /**
   * Get product info from a product card (.item) element.
   * Uses data-* attributes first, then falls back to DOM parsing.
   */
  function getProductFromCard(card) {
    // Prefer data attributes (fastest, most reliable)
    var id = card.getAttribute('data-product-id');
    var name = card.getAttribute('data-product-name');
    var priceAttr = card.getAttribute('data-product-price');
    var image = card.getAttribute('data-product-image');

    // Fallback to DOM parsing
    if (!id) {
      var link = card.querySelector('.item-img-wrapper-link');
      id = link ? link.getAttribute('href') : 'product-' + Date.now();
    }
    if (!name) {
      var nameEl = card.querySelector('.item-title a');
      name = nameEl ? nameEl.textContent.trim() : 'Unknown';
    }
    if (!priceAttr) {
      var priceEl = card.querySelector('.item-new-price');
      priceAttr = priceEl ? priceEl.textContent.trim() : '0';
    }
    if (!image) {
      var imgEl = card.querySelector('.item-img-wrapper-link img');
      image = imgEl ? imgEl.getAttribute('src') : '';
    }

    // Parse price: remove all non-numeric characters (keep digits only)
    // "18,000 VND/kg" -> 18000
    // "95,000 VND/500g" -> 95000
    var price = parseFloat(priceAttr.replace(/[^0-9]/g, '')) || 0;

    return {
      id: id,
      name: name,
      price: price,
      image: image
    };
  }

  /**
   * Auto-enrich all product cards with data-* attributes from DOM content.
   * This runs once on page load so subsequent clicks use data attributes.
   */
  function enrichProductCards() {
    var cards = document.querySelectorAll('.item');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      // Skip if already has data-product-id set
      if (card.hasAttribute('data-product-id') && card.getAttribute('data-product-id') !== '') continue;

      var link = card.querySelector('.item-img-wrapper-link');
      var id = link ? link.getAttribute('href') : 'product-' + i + '-' + Date.now();
      card.setAttribute('data-product-id', id);

      var nameEl = card.querySelector('.item-title a');
      if (nameEl) {
        card.setAttribute('data-product-name', nameEl.textContent.trim());
      }

      var priceEl = card.querySelector('.item-new-price');
      if (priceEl) {
        card.setAttribute('data-product-price', priceEl.textContent.trim());
      }

      var imgEl = card.querySelector('.item-img-wrapper-link img');
      if (imgEl) {
        card.setAttribute('data-product-image', imgEl.getAttribute('src'));
      }
    }

    // Also enrich quick-view modal
    var qvCard = document.querySelector('#quick-view .item');
    if (qvCard && !qvCard.hasAttribute('data-product-id')) {
      qvCard.setAttribute('data-product-id', 'quick-view-product');
      var qvName = qvCard.querySelector('.item-title a');
      if (qvName) qvCard.setAttribute('data-product-name', qvName.textContent.trim());
      var qvPrice = qvCard.querySelector('.item-new-price');
      if (qvPrice) qvCard.setAttribute('data-product-price', qvPrice.textContent.trim());
      var qvImg = qvCard.querySelector('.item-img-wrapper-link img');
      if (qvImg) qvCard.setAttribute('data-product-image', qvImg.getAttribute('src'));
    }
  }

  // ── Event Listeners ──────────────────────────────────────────────

  /**
   * Initialize add-to-cart buttons using event delegation.
   * Listens for clicks on .item-addCart anywhere in the document.
   */
  function initAddToCartButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.item-addCart');
      if (!btn) return;
      e.preventDefault();

      var card = btn.closest('.item');
      if (!card) {
        console.warn('Add to cart button not inside .item card');
        return;
      }

      var product = getProductFromCard(card);
      product.quantity = 1;

      addToCart(product);

      // Visual feedback
      var originalHTML = btn.innerHTML;
      btn.textContent = 'Added ✓';
      setTimeout(function () {
        btn.innerHTML = originalHTML;
      }, 1000);
    });
  }

  /**
   * Initialize cart page actions (quantity +/-, remove) using event delegation.
   */
  function initCartPageActions() {
    document.addEventListener('click', function (e) {
      // Plus button on cart page
      var plusBtn = e.target.closest('.plus-a');
      if (plusBtn && document.body.classList.contains('cart-page')) {
        e.preventDefault();
        var input = plusBtn.previousElementSibling;
        if (input && input.classList.contains('quantity-text-field')) {
          var val = parseInt(input.value, 10) || 1;
          var max = parseInt(plusBtn.getAttribute('data-max'), 10) || 1000;
          if (val < max) {
            val += 1;
            input.value = val;
            var pid = plusBtn.getAttribute('data-product-id');
            if (pid) updateQuantity(pid, val);
          }
        }
        return;
      }

      // Minus button on cart page
      var minusBtn = e.target.closest('.minus-a');
      if (minusBtn && document.body.classList.contains('cart-page')) {
        e.preventDefault();
        var parentDiv = minusBtn.closest('div');
        if (parentDiv) {
          var input = parentDiv.querySelector('.quantity-text-field');
          if (input) {
            var val = parseInt(input.value, 10) || 1;
            var min = parseInt(minusBtn.getAttribute('data-min'), 10) || 1;
            if (val > min) {
              val -= 1;
              input.value = val;
              var pid = minusBtn.getAttribute('data-product-id');
              if (pid) updateQuantity(pid, val);
            }
          }
        }
        return;
      }

      // Remove button
      var removeBtn = e.target.closest('.btn-remove-cart');
      if (removeBtn) {
        e.preventDefault();
        var pid = removeBtn.getAttribute('data-product-id');
        if (pid) removeFromCart(pid);
        return;
      }
    });

    // Quantity input change (direct typing)
    document.addEventListener('change', function (e) {
      var input = e.target.closest('.quantity-text-field');
      if (input && document.body.classList.contains('cart-page')) {
        var row = input.closest('tr');
        if (row) {
          var pid = row.getAttribute('data-product-id');
          var val = parseInt(input.value, 10) || 1;
          if (val < 1) val = 1;
          input.value = val;
          if (pid) updateQuantity(pid, val);
        }
      }
    });
  }

  // ── Initialization ───────────────────────────────────────────────

  /**
   * Normalize the cart data in localStorage.
   * If old format (qty instead of quantity) is detected, convert and save immediately.
   */
  function normalizeCartInStorage() {
    try {
      var data = localStorage.getItem('cart');
      if (!data) return;
      var parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      var needsSave = false;
      var normalized = [];
      for (var i = 0; i < parsed.length; i++) {
        var item = parsed[i];
        // Detect old format: has 'qty' field or missing 'quantity'
        if (typeof item.qty !== 'undefined' || typeof item.quantity === 'undefined') {
          needsSave = true;
        }
        var norm = normalizeItem(item);
        if (norm.id && norm.id !== 'unknown' && norm.price > 0) {
          normalized.push(norm);
        }
      }

      if (needsSave || normalized.length !== parsed.length) {
        saveCart(normalized);
      }
    } catch (e) {
      // If any error, just clear the cart
      try { localStorage.removeItem('cart'); } catch (ex) { /* ignore */ }
    }
  }

  function init() {
    // Clear any old/broken cart data from other keys
    clearOldCart();

    // Normalize existing cart data (convert old qty format to quantity)
    normalizeCartInStorage();

    // Enrich all product cards with data attributes
    enrichProductCards();

    // Set up event listeners
    initAddToCartButtons();
    initCartPageActions();

    // Initial UI update
    updateAllUI();

    // Re-enrich when Bootstrap tabs change (shows hidden products)
    document.addEventListener('shown.bs.tab', function () {
      enrichProductCards();
    });

    // Re-enrich after a delay for any lazy-loaded content
    setTimeout(enrichProductCards, 800);
  }

  // ── Boot ──────────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();