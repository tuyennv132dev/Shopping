// cart.js - Handles add-to-cart functionality using localStorage

(function () {
  // Utility functions
  function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateMiniCartUI() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    const counterEl = document.querySelector('.item-counter');
    const priceEl = document.querySelector('.mini-total-price');
    if (counterEl) counterEl.textContent = totalItems;
    if (priceEl) priceEl.textContent = `$${totalPrice.toLocaleString()}`;
  }

  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      existing.qty += product.qty;
    } else {
      cart.push(product);
    }
    saveCart(cart);
    updateMiniCartUI();
  }

  // Extract product info from a card element
  function extractProductInfo(cardEl) {
    const id = cardEl.getAttribute('data-product-id') || cardEl.querySelector('a.item-img-wrapper-link').getAttribute('href');
    const name = cardEl.querySelector('.item-title a')?.textContent.trim() || 'Unknown';
    const priceText = cardEl.querySelector('.item-new-price')?.textContent.trim() || '0';
    // Extract numeric price (remove non-digits)
    const price = parseFloat(priceText.replace(/[^0-9\.]/g, '')) || 0;
    const qty = 1;
    return { id, name, price, qty };
  }

  // Attach click listeners to product cards
  function initCardListeners() {
    document.querySelectorAll('.item-addCart').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = this.closest('.item');
        if (!card) return;
        const product = extractProductInfo(card);
        addToCart(product);
        // Optional visual feedback
        this.textContent = 'Added';
        setTimeout(() => (this.textContent = 'Add to Cart'), 1000);
      });
    });
  }

  // For product detail pages – button inside form
  function initDetailPageListener() {
    const addBtn = document.querySelector('button[type="submit"]');
    if (addBtn) {
      addBtn.addEventListener('click', function (e) {
        // prevent actual form submit
        e.preventDefault();
        // Gather info from the page (simplified)
        const nameEl = document.querySelector('.information-heading + h6');
        const priceEl = document.querySelector('.item-new-price');
        const qtyInput = document.querySelector('.quantity-text-field');
        const name = nameEl ? nameEl.textContent.trim() : 'Unknown';
        const priceText = priceEl ? priceEl.textContent.trim() : '0';
        const price = parseFloat(priceText.replace(/[^0-9\.]/g, '')) || 0;
        const qty = parseInt(qtyInput?.value) || 1;
        const id = window.location.pathname; // use URL as id
        addToCart({ id, name, price, qty });
        this.textContent = 'Added';
        setTimeout(() => (this.textContent = 'Add to cart'), 1000);
      });
    }
  }

  // Render cart items on cart.html page
  function renderCartPage() {
    if (!document.body.classList.contains('cart-page')) return; // optional check
    const cart = getCart();
    const container = document.querySelector('.mini-cart-list');
    if (!container) return;
    container.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'clearfix';
      li.innerHTML = `
        <a href="#">
          <span class="mini-item-name">${item.name}</span>
          <span class="mini-item-price">$${item.price.toLocaleString()}</span>
          <span class="mini-item-quantity"> x ${item.qty} </span>
        </a>`;
      container.appendChild(li);
      total += item.price * item.qty;
    });
    const totalPriceEl = document.querySelector('.mini-total-price');
    if (totalPriceEl) totalPriceEl.textContent = `$${total.toLocaleString()}`;
    const counterEl = document.querySelector('.item-counter');
    if (counterEl) counterEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
  }

  // Initialise on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initCardListeners();
    initDetailPageListener();
    updateMiniCartUI();
    renderCartPage();
  });
})();
