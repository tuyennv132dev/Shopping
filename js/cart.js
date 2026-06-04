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

  // â”€â”€ Core Cart Functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Extract numeric price from a string like "115,000 VND/500g" -> 115000
   * Takes only the first number segment before any letter unit (kg, g, VND, etc.)
   */
  function extractPrice(str) {
    if (typeof str === 'number') return str;
    if (typeof str !== 'string') return 0;
    // Match the first group of digits (with optional thousand separators)
    // Example: "115,000 VND/500g" -> match "115,000" -> 115000
    // Example: "95.000 VND" -> match "95.000" -> 95000
    // Example: "18000" -> match "18000" -> 18000
    var match = str.match(/(\d[\d,.]*)/);
    if (!match) return 0;
    // Remove commas and dots (thousand separators)
    var numStr = match[1].replace(/[,.]/g, '');
    return parseFloat(numStr) || 0;
  }

  /**
   * Normalize cart item from localStorage.
   * Handles old format: { id, name, price, qty } -> { id, name, price, image, quantity }
   */
  function normalizeItem(item) {
    var price = extractPrice(item.price);
    return applyCanonicalProductPrice({
      id: item.id || 'unknown',
      name: item.name || 'Unknown',
      price: price,
      image: item.image || '',
      quantity: typeof item.quantity === 'number' ? item.quantity : (typeof item.qty === 'number' ? item.qty : 1)
    });
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

  var VAT_RATE = 0.1;

  var PRODUCT_PRICE_OVERRIDES = {
    'product-white-rice': 18000,
    'product-sticky-rice': 25000,
    'product-fragrant-rice': 22000,
    'product-broken-rice': 15000,
    'product-bac-huong-rice': 28000,
    'product-st25-rice': 50000,
    'product-st24-rice': 42000,
    'product-jasmine-rice': 35000,
    'product-brown-rice': 35000,
    'product-black-rice': 40000,
    'product-mixed-grains': 44000,
    'product-multi-grain-powder': 50000,
    'product-multi-grains': 50000,
    'product-rolled-oats': 35000,
    'product-barley': 38000,
    'product-quinoa': 48000,
    'product-fruit-granola': 45000,
    'product-millet': 38000,
    'product-buckwheat': 42000,
    'product-brown-rice-mix': 46000,
    'product-cornflakes': 39000,
    'product-muesli': 50000
  };

  function normalizeProductKey(id) {
    if (!id || typeof id !== 'string') return '';
    return id
      .split('#')[0]
      .split('?')[0]
      .split('/')
      .pop()
      .replace(/\.html$/i, '')
      .toLowerCase();
  }

  function getCanonicalProductPrice(id) {
    var key = normalizeProductKey(id);
    return Object.prototype.hasOwnProperty.call(PRODUCT_PRICE_OVERRIDES, key) ? PRODUCT_PRICE_OVERRIDES[key] : null;
  }

  function hasExplicitPackVariant(product) {
    var name = product && product.name ? product.name : '';
    return /\s-\s(?:\d+(?:\.\d+)?\s*(?:kg|g)|standard|family|premium|bulk|double)/i.test(name);
  }

  function applyCanonicalProductPrice(product) {
    if (!product) return product;
    var canonicalPrice = getCanonicalProductPrice(product.id || product.url);
    if (canonicalPrice !== null && !hasExplicitPackVariant(product)) {
      product.price = canonicalPrice;
    }
    return product;
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

  // â”€â”€ Cart Operations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function addToCart(product) {
    if (!product || !product.id) return;
    product = applyCanonicalProductPrice(product);

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

  // â”€â”€ Computed Values â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  function getOrderTotals() {
    var subtotal = getTotalPrice();
    var vat = Math.round(subtotal * VAT_RATE);
    return {
      subtotal: subtotal,
      vat: vat,
      shipping: 0,
      grandTotal: subtotal + vat
    };
  }

  function getWishlistTotal() {
    return getWishlist().length;
  }

  // â”€â”€ Wishlist Operations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function getWishlist() {
    try {
      const data = localStorage.getItem('wishlist');
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  function addToWishlist(product) {
    if (!product || !product.id) return;
    var wishlist = getWishlist();
    var exists = wishlist.some(item => item.id === product.id);
    if (!exists) {
      wishlist.push(product);
      saveWishlist(wishlist);
      updateAllUI();
    }
  }

  function removeFromWishlist(productId) {
    var wishlist = getWishlist();
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist(wishlist);
    updateAllUI();
  }

  function renderWishlistPage() {
    if (!document.body.classList.contains('wishlist-page')) return;
    var wishlist = getWishlist();
    var tbody = document.querySelector('.page-wishlist table tbody');
    if (!tbody) return;

    if (wishlist.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:50px;">Your wishlist is empty.</td></tr>';
      return;
    }

    var html = '';
    for (var i = 0; i < wishlist.length; i++) {
      var item = wishlist[i];
      html +=
        '<tr data-product-id="' + item.id + '">' +
        '<td>' +
        '<div class="cart-anchor-image">' +
        '<a href="' + (item.url || item.id) + '">' +
        '<img src="' + item.image + '" alt="' + item.name + '" style="width:80px;height:80px;object-fit:cover;">' +
        '<h6>' + item.name + '</h6>' +
        '</a>' +
        '</div>' +
        '</td>' +
        '<td>' +
        '<div class="cart-price">' + formatCurrency(item.price) + '</div>' +
        '</td>' +
        '<td>' +
        '<div class="cart-stock">In Stock</div>' +
        '</td>' +
        '<td>' +
        '<div class="action-wrapper" style="display:flex; gap:10px;">' +
        '<button class="button button-outline-secondary fas fa-plus item-addCart" ' +
        'data-product-id="' + item.id + '" ' +
        'data-product-name="' + item.name + '" ' +
        'data-product-price="' + item.price + '" ' +
        'data-product-image="' + item.image + '" ' +
        'title="Add to Cart" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;"></button>' +
        '<button class="button button-outline-secondary fas fa-trash btn-remove-wishlist" data-product-id="' + item.id + '" title="Remove" style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;"></button>' +
        '</div>' +
        '</td>' +
        '</tr>';
    }
    tbody.innerHTML = html;
  }

  function initWishlistButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.item-addwishlist') || e.target.closest('.wishlist-btn');
      if (!btn) return;
      e.preventDefault();

      var card = btn.closest('.item');
      if (!card) return;

      var product = getProductFromCard(card);
      addToWishlist(product);

      // Visual feedback
      var originalHTML = btn.innerHTML;
      if (btn.tagName === 'BUTTON') {
        btn.classList.add('added');
      } else {
        btn.style.color = '#ff4757';
      }

      setTimeout(function () {
        if (btn.tagName === 'BUTTON') {
          btn.classList.remove('added');
        } else {
          btn.style.color = '';
        }
      }, 1000);
    });

    // Remove from wishlist button (on wishlist page)
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-remove-wishlist');
      if (!btn) return;
      var pid = btn.getAttribute('data-product-id');
      if (pid) removeFromWishlist(pid);
    });
  }

  // â”€â”€ UI Update Functions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function updateAllUI() {
    updateCartCount();
    renderMiniCart();
    renderCartPage();
    renderCheckoutPage();
    renderWishlistPage();
    updateFixedCounter();
    updateWishlistCount();
  }

  function updateCartCount() {
    var total = getTotalQuantity();
    var els = document.querySelectorAll('.item-counter');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = total;
    }
    var totalPrice = getTotalPrice();
    var priceEls = document.querySelectorAll('.item-price');
    for (var i = 0; i < priceEls.length; i++) {
      priceEls[i].textContent = formatCurrency(totalPrice);
    }
  }

  function updateWishlistCount() {
    var total = getWishlistTotal();
    var els = document.querySelectorAll('.wishlist-counter');
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = total;
    }
  }

  function updateFixedCounter() {
    // Fixed responsive counter sits on the wishlist icon across the site,
    // so it should reflect wishlist total (not cart quantity).
    var total = getWishlistTotal();
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

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var subtotal = (item.price || 0) * (item.quantity || 0);

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

    var totals = getOrderTotals();

    // Update billing totals
    var calcTexts = document.querySelectorAll('.calc-text');
    if (calcTexts.length >= 1) {
      calcTexts[0].textContent = formatCurrency(totals.subtotal);
    }
    if (calcTexts.length >= 2) {
      calcTexts[1].textContent = formatCurrency(totals.vat);
    }
    if (calcTexts.length >= 3) {
      calcTexts[calcTexts.length - 1].textContent = formatCurrency(totals.grandTotal);
    }

    // Also update mini cart in header
    renderMiniCart();
    updateCartCount();
    updateFixedCounter();
  }

  function renderCheckoutPage() {
    if (!document.body.classList.contains('checkout-page')) return;

    var cart = getCart();
    var tbody = document.querySelector('.checkout-order table tbody');
    if (!tbody) return;

    updateCheckoutReceiptMeta();

    if (cart.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;padding:40px 20px;color:#999;">Your cart is empty. <a href="index.html" style="color:#c9a96e;">Shop now</a></td></tr>';
      // Also update totals
      var totalPriceEl = document.querySelector('.qr-order-info strong:last-child');
      if (totalPriceEl) totalPriceEl.textContent = '0 VND';
      return;
    }

    // Keywords that indicate 500g-increment products (nuts, seeds, granola, muesli, etc.)
    var halfKgKeywords = ['almond', 'walnut', 'macadamia', 'cashew', 'pistachio', 'sesame', 'granola', 'muesli', 'chia', 'flax', 'pumpkin', 'sunflower', 'raisin', 'dried', 'cornflakes', 'rolled oat', 'millet', 'quinoa', 'barley', 'buckwheat', 'powder', 'nut', 'seed'];

    function isHalfKgProduct(name) {
      if (!name) return false;
      var lower = name.toLowerCase();
      for (var k = 0; k < halfKgKeywords.length; k++) {
        if (lower.indexOf(halfKgKeywords[k]) !== -1) return true;
      }
      return false;
    }

    function formatWeight(item) {
      var qty = item.quantity || 0;
      if (isHalfKgProduct(item.name)) {
        // 1 unit = 500g, 2 units = 1kg
        var grams = qty * 500;
        if (grams >= 1000) {
          return (grams / 1000) + ' kg';
        } else {
          return grams + 'g';
        }
      } else {
        // Rice / grains: 1 unit = 1kg
        return qty + ' kg';
      }
    }

    var html = '';

    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var subtotal = (item.price || 0) * (item.quantity || 0);

      // Use image if available, otherwise a placeholder
      var imgSrc = item.image || 'images/product/product@2x.jpg';

      html +=
        '<tr>' +
        '<td>' +
        '<div class="receipt-product">' +
        '<img src="' + imgSrc + '" alt="' + item.name + '" class="prod-img" onerror="this.src=\'images/product/product@2x.jpg\'">' +
        '<div>' +
        '<div class="prod-name">' + item.name + '</div>' +
        '<div class="prod-qty">' + formatWeight(item) + '</div>' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td>' + formatCurrency(subtotal) + '</td>' +
        '</tr>';
    }

    var totals = getOrderTotals();

    html +=
      '<tr>' +
      '<td>Subtotal</td>' +
      '<td>' + formatCurrency(totals.subtotal) + '</td>' +
      '</tr>' +
      '<tr>' +
      '<td>VAT (10%)</td>' +
      '<td>' + formatCurrency(totals.vat) + '</td>' +
      '</tr>' +
      '<tr class="receipt-total-row">' +
      '<td><span class="total-label">TOTAL</span></td>' +
      '<td><span class="total-amount">' + formatCurrency(totals.grandTotal) + '</span></td>' +
      '</tr>';

    tbody.innerHTML = html;

    // Update the QR modal total too
    var totalPriceEl = document.querySelector('.qr-order-info strong:last-child');
    if (totalPriceEl) totalPriceEl.textContent = formatCurrency(totals.grandTotal);
  }

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function updateCheckoutReceiptMeta() {
    var now = new Date();
    var day = pad2(now.getDate());
    var month = pad2(now.getMonth() + 1);
    var year = now.getFullYear();
    var dateText = day + '/' + month + '/' + year;
    var invoiceText = '#INV-' + year + month + day;

    var dateEl = document.getElementById('receiptDate');
    if (dateEl) dateEl.textContent = dateText;

    var invoiceEl = document.getElementById('receiptInvoice');
    if (invoiceEl) invoiceEl.textContent = invoiceText;

    var qrOrderInfo = document.querySelector('.qr-order-info strong:first-child');
    if (qrOrderInfo) qrOrderInfo.textContent = 'Order ' + invoiceText;
  }

  function initCheckoutAction() {
    if (!document.body.classList.contains('checkout-page')) return;

    var form = document.querySelector('.page-checkout form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      var inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
      var valid = true;
      for (var i = 0; i < inputs.length; i++) {
        if (!inputs[i].value.trim()) {
          inputs[i].style.borderColor = 'red';
          valid = false;
        } else {
          inputs[i].style.borderColor = '';
        }
      }

      if (!valid) {
        alert('Please fill in all required fields.');
        return;
      }

      // Get cart total for the QR modal
      var totalPrice = getOrderTotals().grandTotal;
      var cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty. Please add products before placing an order.');
        return;
      }

      // Update QR modal with real data
      var invoiceSpan = document.getElementById('receiptInvoice');
      var invoiceNum = invoiceSpan ? invoiceSpan.textContent : '#INV-' + new Date().toISOString().slice(0,10).replace(/-/g,'');
      var qrOrderInfo = document.querySelector('.qr-order-info');
      if (qrOrderInfo) {
        qrOrderInfo.innerHTML = '<strong>' + invoiceNum + '</strong> &nbsp;·&nbsp; Total: <strong>' + formatCurrency(totalPrice) + '</strong>';
      }

      // Show the QR modal
      var modal = document.getElementById('qrModal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Clear cart after order
      localStorage.removeItem('cart');
      updateAllUI();
    });
  }

  // â”€â”€ Product Data Extraction â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    var url = card.getAttribute('data-product-url');

    // Fallback to DOM parsing
    if (!id) {
      var link = card.querySelector('.item-img-wrapper-link');
      id = link ? link.getAttribute('href') : 'product-' + Date.now();
    }
    if (!url) {
      var productLink = card.querySelector('.item-img-wrapper-link') || card.querySelector('.item-title a');
      url = productLink ? productLink.getAttribute('href') : id;
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

    // Parse price: extract only the first number segment before any letter unit
    // "115,000 VND/500g" -> match "115,000" -> 115000
    // "18,000 VND/kg" -> match "18,000" -> 18000
    var price = extractPrice(priceAttr);

    return applyCanonicalProductPrice({
      id: id,
      name: name,
      price: price,
      image: image,
      url: url
    });
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

  // â”€â”€ Event Listeners â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Initialize add-to-cart buttons using event delegation.
   * Listens for clicks on .item-addCart anywhere in the document.
   */
  function initAddToCartButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.item-addCart');
      if (!btn) return;
      e.preventDefault();

      var product;
      var card = btn.closest('.item');

      if (card) {
        product = getProductFromCard(card);
        // Try to find quantity input within the card (Product detail page)
        var qtyInput = card.querySelector('.quantity-text-field');
        if (qtyInput) {
          product.quantity = parseInt(qtyInput.value, 10) || 1;
        } else {
          product.quantity = 1;
        }
      } else {
        // Fallback for buttons with direct data attributes (e.g., Wishlist page)
        product = {
          id: btn.getAttribute('data-product-id'),
          name: btn.getAttribute('data-product-name'),
          price: parseFloat(btn.getAttribute('data-product-price')) || 0,
          image: btn.getAttribute('data-product-image'),
          quantity: 1
        };
      }

      if (product.id) {
        addToCart(product);

        // Visual feedback
        var originalHTML = btn.innerHTML;
        if (btn.classList.contains('fas')) {
           // Icon-only button
           var originalClass = btn.className;
           btn.className = 'button button-primary fas fa-check added';
           setTimeout(function() {
             btn.className = originalClass;
           }, 1000);
        } else {
          btn.textContent = 'Added âœ“';
          btn.classList.add('added');
          setTimeout(function () {
            btn.innerHTML = originalHTML;
            btn.classList.remove('added');
          }, 1000);
        }
      }
    });
  }

  /**
   * Handle pack size changes on product detail page
   */
  function initPackSizeSelection() {
    document.addEventListener('change', function (e) {
      var select = e.target.closest('#pack-size');
      if (!select) return;

      var card = select.closest('.item');
      if (!card) return;

      var selectedOption = select.options[select.selectedIndex];
      var newPrice = selectedOption.getAttribute('data-price');
      var packLabel = selectedOption.textContent.split('-')[0].trim();

      if (newPrice) {
        // Update card data attribute for cart logic
        card.setAttribute('data-product-price', newPrice);
        card.setAttribute('data-product-name', "Premium White Rice - " + packLabel);

        // Update UI price display
        var priceDisplay = card.querySelector('.price h4');
        if (priceDisplay) {
          priceDisplay.textContent = formatCurrency(parseInt(newPrice, 10)) + (packLabel === '1kg' ? ' / kg' : '');
        }
      }
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

  // â”€â”€ Initialization â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
    initCheckoutAction();
    initPackSizeSelection();
    initWishlistButtons();

    // Initial UI update
    updateAllUI();

    // Re-enrich when Bootstrap tabs change (shows hidden products)
    document.addEventListener('shown.bs.tab', function () {
      enrichProductCards();
    });

    // Re-enrich after a delay for any lazy-loaded content
    setTimeout(enrichProductCards, 800);
  }

  // â”€â”€ Boot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

