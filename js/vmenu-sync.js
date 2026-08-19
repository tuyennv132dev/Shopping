/**
 * vmenu-sync.js
 * Keep the left "Product catalog" v-menu consistent across static HTML pages.
 *
 * This script replaces the inner HTML of `.v-menu .v-list` with a canonical menu.
 * It is intentionally markup-only (no dependencies).
 */
(function () {
  'use strict';

  // Detect depth: pages in subfolders need ../ prefix
  var depth = window.location.pathname.split('/').filter(Boolean).length;
  var basePath = depth > 1 ? '../' : '';


  function setMenuHtml(vListEl) {
    vListEl.innerHTML =
      '<li class="js-backdrop">' +
      '  <a href="' + basePath + 'shop/shop-v1-root-category.html">' +
      '    <i class="ion ion-ios-nutrition"></i>' +
      '    Types of Rice' +
      '    <i class="ion ion-ios-arrow-forward"></i>' +
      '  </a>' +
      '  <button class="v-button ion ion-md-add"></button>' +
      '  <div class="v-drop-right" style="width: 700px;">' +
      '    <div class="row">' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/shop-v1-root-category.html">Daily White Rice</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'products/product-white-rice.html">Premium White Rice</a></li>' +
      '            <li><a href="' + basePath + 'products/product-jasmine-rice.html">Jasmine Rice</a></li>' +
      '            <li><a href="' + basePath + 'products/product-fragrant-rice.html">Fragrant Rice</a></li>' +
      '            <li><a href="' + basePath + 'products/product-bac-huong-rice.html">Bac Huong Rice</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'products/product-sticky-rice.html">Sticky Rice</a>' +
      '          <ul><li><a href="' + basePath + 'products/product-sticky-rice.html">Premium Sticky Rice</a></li></ul>' +
      '        </li></ul>' +
      '      </div>' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'products/product-brown-rice.html">Brown Rice</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'products/product-brown-rice.html">Premium Brown Rice</a></li>' +
      '            <li><a href="' + basePath + 'products/product-brown-rice-mix.html">Brown Rice Mix</a></li>' +
      '            <li><a href="' + basePath + 'products/product-brown-rice-nuts-combo.html">Brown Rice & Nuts Combo</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '    </div>' +
      '    <div class="row">' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/shop-v1-root-category.html">Specialty Rice</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'products/product-st25-rice.html">ST25 Rice</a></li>' +
      '            <li><a href="' + basePath + 'products/product-st24-rice.html">ST24 Rice</a></li>' +
      '            <li><a href="' + basePath + 'products/product-Black-rice.html">Black Rice</a></li>' +
      '            <li><a href="' + basePath + 'products/product-broken-rice.html">Broken Rice</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/shop-healthy-food-products.html">Healthy & Meal Plans</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'shop/shop-healthy-food-products.html">Healthy Food Products</a></li>' +
      '            <li><a href="' + basePath + 'products/product-brown-rice-mix.html">Whole-grain Mixes</a></li>' +
      '            <li><a href="' + basePath + 'products/product-Black-rice.html">Antioxidant Rice</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'deals/family-combo-page.html">Rice Packs</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'products/product-weekly-rice-pack.html">Weekly Rice Pack</a></li>' +
      '            <li><a href="' + basePath + 'products/product-daily-rice-family-pack.html">Daily Family Pack</a></li>' +
      '            <li><a href="' + basePath + 'products/product-large-family-rice-pack.html">Large Family Pack</a></li>' +
      '            <li><a href="' + basePath + 'products/product-premium-rice-combo.html">Premium Rice Combo</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</li>' +

      '<li class="js-backdrop">' +
      '  <a href="' + basePath + 'shop/Healthy-Nuts-Seeds.html">' +
      '    <i class="ion ion-ios-leaf"></i>' +
      '    Healthy Nuts & Seeds' +
      '    <i class="ion ion-ios-arrow-forward"></i>' +
      '  </a>' +
      '  <button class="v-button ion ion-md-add"></button>' +
      '  <div class="v-drop-right" style="width: 700px;">' +
      '    <div class="row">' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/Healthy-Nuts-Seeds.html">Nuts</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'products/product-cashews.html">Cashew Nuts</a></li>' +
      '            <li><a href="' + basePath + 'products/product-almonds.html">Almonds</a></li>' +
      '            <li><a href="' + basePath + 'products/product-walnuts.html">Walnuts</a></li>' +
      '            <li><a href="' + basePath + 'products/product-macadamia.html">Macadamia Nuts</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/Healthy-Nuts-Seeds.html">Seeds & Powders</a>' +
      '          <ul><li><a href="' + basePath + 'products/product-black-sesame-powder.html">Black Sesame Powder</a></li></ul>' +
      '        </li></ul>' +
      '      </div>' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/Healthy-Nuts-Seeds.html">Explore</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'shop/Healthy-Nuts-Seeds.html">View All Healthy Nuts & Seeds</a></li>' +
      '            <li><a href="' + basePath + 'shop/shop-healthy-food-products.html">Healthy Food Products</a></li>' +
      '            <li><a href="' + basePath + 'products/product-fruit-granola.html">Fruit Granola</a></li>' +
      '            <li><a href="' + basePath + 'shop/shop-beans-legumes.html">Beans & Legumes</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</li>' +

      '<li class="js-backdrop">' +
      '  <a href="' + basePath + 'shop/shop-whole-grains-cereals.html">' +
      '    <i class="ion ion-ios-nutrition"></i>' +
      '    Whole Grains & Cereals' +
      '    <i class="ion ion-ios-arrow-forward"></i>' +
      '  </a>' +
      '  <button class="v-button ion ion-md-add"></button>' +
      '  <div class="v-drop-right" style="width: 700px;">' +
      '    <div class="row">' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/shop-whole-grains-cereals.html">Whole Grains</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'products/product-rolled-oats.html">Rolled Oats</a></li>' +
      '            <li><a href="' + basePath + 'products/product-barley.html">Pearl Barley</a></li>' +
      '            <li><a href="' + basePath + 'products/product-quinoa.html">White Quinoa</a></li>' +
      '            <li><a href="' + basePath + 'products/product-millet.html">Millet</a></li>' +
      '            <li><a href="' + basePath + 'products/product-buckwheat.html">Buckwheat</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/shop-whole-grains-cereals.html">Breakfast Cereals</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'products/product-cornflakes.html">Corn Flakes</a></li>' +
      '            <li><a href="' + basePath + 'products/product-muesli.html">Muesli</a></li>' +
      '            <li><a href="' + basePath + 'products/product-fruit-granola.html">Fruit Granola</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/shop-whole-grains-cereals.html">Mixes & Powders</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'products/product-Mixed-grains.html">Mixed Grains</a></li>' +
      '            <li><a href="' + basePath + 'products/product-Multi-grains.html">Multi-Grains</a></li>' +
      '            <li><a href="' + basePath + 'products/product-multi-grain-powder.html">Multi-Grain Powder</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '    </div>' +
      '    <div class="row">' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/shop-healthy-food-products.html">Combos</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'products/product-healthy-breakfast-combo.html">Healthy Breakfast Combo</a></li>' +
      '            <li><a href="' + basePath + 'products/product-premium-rice-combo.html">Premium Rice Combo</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '      <div class="col-lg-4">' +
      '        <ul class="v-level-2"><li><a href="' + basePath + 'shop/shop-whole-grains-cereals.html">Explore</a>' +
      '          <ul>' +
      '            <li><a href="' + basePath + 'shop/shop-whole-grains-cereals.html">View All Whole Grains & Cereals</a></li>' +
      '            <li><a href="' + basePath + 'shop/shop-healthy-food-products.html">Healthy Food Products</a></li>' +
      '            <li><a href="' + basePath + 'shop/Healthy-Nuts-Seeds.html">Healthy Nuts & Seeds</a></li>' +
      '          </ul>' +
      '        </li></ul>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</li>' +

      '<li><a href="' + basePath + 'blog/rice-grain-recipes.html"><i class="ion ion-ios-book"></i>Rice & Grain Recipes</a></li>' +
      '<li><a href="' + basePath + 'blog/rice-market-news.html"><i class="ion ion-md-trending-up"></i>Rice Market News</a></li>' +
      '<li><a href="' + basePath + 'shop/shop-baby-kids-food.html"><i class="ion ion-ios-nutrition"></i>Baby & Kids Food</a></li>' +
      '<li><a href="' + basePath + 'shop/shop-healthy-food-products.html"><i class="ion ion-md-heart"></i>Healthy Food Products</a></li>' +
      '<li><a href="' + basePath + 'blog/blog.html"><i class="ion ion-ios-list-box"></i>Rice Classification Guide</a></li>';
  }

  function init() {
    var vList = document.querySelector('.v-menu .v-list');
    if (!vList) return;
    setMenuHtml(vList);
  }

  // Prefer immediate run when script is placed near the end of <body>.
  // If loaded in <head>, wait for DOM.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }
  init();
})();
