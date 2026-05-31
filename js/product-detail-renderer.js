/*
 * Shared renderer for newly added product detail pages.
 * Each page is a real URL; content is selected from the current filename.
 */
(function () {
  'use strict';

  var PRODUCTS = {
    'product-black-beans.html': {
      id: 'product-black-beans',
      name: 'Black Beans',
      title: 'Huyen Tuyen Black Beans',
      category: 'Beans & Legumes',
      categoryUrl: 'shop-beans-legumes.html',
      subcategory: 'Cooking Beans',
      image: 'images/product/do-xanh-nguyen-hat.jpg',
      price: '65,000 VND/kg',
      oldPrice: '75,000 VND/kg',
      numericPrice: 65000,
      reviews: 18,
      ratingWidth: 67,
      shortDescription: 'Rich, clean black beans suitable for sweet soup, porridge, and healthy daily meals.',
      benefits: ['Good source of plant protein and fiber', 'Suitable for sweet soup and porridge', 'Clean selected beans for family cooking'],
      details: 'Black beans are a familiar ingredient for Vietnamese desserts, porridge, drinks, and balanced daily meals. Huyen Tuyen selects clean beans with even grains so they cook evenly and keep a naturally earthy flavor.',
      cookingTips: ['Rinse well before cooking.', 'Soak for 4-6 hours to shorten cooking time.', 'Use for sweet soup, bean milk, porridge, or mixed grain bowls.']
    },
    'product-green-beans.html': {
      id: 'product-green-beans',
      name: 'Green Beans',
      title: 'Huyen Tuyen Green Beans',
      category: 'Beans & Legumes',
      categoryUrl: 'shop-beans-legumes.html',
      subcategory: 'Cooking Beans',
      image: 'images/product/do-xanh-nguyen-hat.jpg',
      price: '58,000 VND/kg',
      oldPrice: '68,000 VND/kg',
      numericPrice: 58000,
      reviews: 16,
      ratingWidth: 67,
      shortDescription: 'Fresh green beans for desserts, sprouts, porridge, and traditional family dishes.',
      benefits: ['Naturally mild and easy to cook', 'Good for desserts and porridge', 'Useful for homemade sprouts and everyday meals'],
      details: 'Green beans are versatile beans used in Vietnamese sweet soups, savory dishes, breakfast porridge, and homemade sprout preparations. This pack is selected for clean, even grains and stable cooking quality.',
      cookingTips: ['Rinse until the water runs clear.', 'Soak before cooking for softer texture.', 'Use in che dau xanh, porridge, cakes, or sprout dishes.']
    },
    'product-red-beans.html': {
      id: 'product-red-beans',
      name: 'Red Beans',
      title: 'Huyen Tuyen Red Beans',
      category: 'Beans & Legumes',
      categoryUrl: 'shop-beans-legumes.html',
      subcategory: 'Cooking Beans',
      image: 'images/product/do-xanh-nguyen-hat.jpg',
      price: '72,000 VND/kg',
      oldPrice: '82,000 VND/kg',
      numericPrice: 72000,
      reviews: 17,
      ratingWidth: 67,
      shortDescription: 'Soft red beans for sweet soup, baking, porridge, and nutritious snacks.',
      benefits: ['Soft texture after cooking', 'Good for desserts and fillings', 'Rich, naturally sweet bean flavor'],
      details: 'Red beans are a popular ingredient for dessert soup, steamed cakes, porridge, and sweet fillings. Huyen Tuyen red beans are selected for even size and clean processing.',
      cookingTips: ['Soak for 4 hours or overnight.', 'Cook slowly until tender.', 'Use for che dau do, red bean paste, porridge, or mixed bean dessert.']
    },
    'product-soybeans.html': {
      id: 'product-soybeans',
      name: 'Soybeans',
      title: 'Huyen Tuyen Soybeans',
      category: 'Beans & Legumes',
      categoryUrl: 'shop-beans-legumes.html',
      subcategory: 'Plant-Based Protein',
      image: 'images/product/do-xanh-nguyen-hat.jpg',
      price: '55,000 VND/kg',
      oldPrice: '65,000 VND/kg',
      numericPrice: 55000,
      reviews: 15,
      ratingWidth: 66,
      shortDescription: 'Selected soybeans for soy milk, tofu, roasted snacks, and family cooking.',
      benefits: ['Plant-based protein source', 'Ideal for soy milk and tofu', 'Clean beans for daily kitchen use'],
      details: 'Soybeans are valued for their protein content and flexibility in home cooking. They can be used for soy milk, tofu, roasted snacks, soups, and mixed grain meals.',
      cookingTips: ['Soak overnight before blending for soy milk.', 'Remove floating beans before cooking.', 'Use in soy milk, tofu, roasted bean snacks, or stews.']
    },
    'product-chickpeas.html': {
      id: 'product-chickpeas',
      name: 'Chickpeas',
      title: 'Huyen Tuyen Chickpeas',
      category: 'Beans & Legumes',
      categoryUrl: 'shop-beans-legumes.html',
      subcategory: 'Imported Legumes',
      image: 'images/product/do-xanh-nguyen-hat.jpg',
      price: '92,000 VND/500g',
      oldPrice: '110,000 VND/500g',
      numericPrice: 92000,
      reviews: 14,
      ratingWidth: 67,
      shortDescription: 'High-protein chickpeas for salads, stews, hummus, and healthy meal prep.',
      benefits: ['Great for meal prep', 'Good plant protein and fiber', 'Works well in salads, stews, and dips'],
      details: 'Chickpeas have a firm texture and nutty flavor, making them useful for Mediterranean-style dishes, healthy salads, hummus, soups, and weekly meal prep.',
      cookingTips: ['Soak overnight before boiling.', 'Cook until tender but not mushy.', 'Use for hummus, curry, salads, soups, or roasted snacks.']
    },
    'product-lentils.html': {
      id: 'product-lentils',
      name: 'Lentils',
      title: 'Huyen Tuyen Lentils',
      category: 'Beans & Legumes',
      categoryUrl: 'shop-beans-legumes.html',
      subcategory: 'Imported Legumes',
      image: 'images/product/do-xanh-nguyen-hat.jpg',
      price: '88,000 VND/500g',
      oldPrice: '100,000 VND/500g',
      numericPrice: 88000,
      reviews: 13,
      ratingWidth: 66,
      shortDescription: 'Quick-cooking lentils for soups, porridge, and balanced plant-based meals.',
      benefits: ['Quick cooking compared with many beans', 'Good for soups and porridge', 'Useful for plant-based meals'],
      details: 'Lentils are convenient legumes for fast soups, stews, porridge, and healthy bowls. They provide a smooth texture and absorb spices well.',
      cookingTips: ['Rinse well; soaking is optional.', 'Simmer gently to avoid over-softening.', 'Use in soup, dal-style dishes, porridge, or grain bowls.']
    },
    'product-mixed-beans-pack.html': {
      id: 'product-mixed-beans-pack',
      name: 'Mixed Beans Pack',
      title: 'Huyen Tuyen Mixed Beans Pack',
      category: 'Beans & Legumes',
      categoryUrl: 'shop-beans-legumes.html',
      subcategory: 'Bean Mixes',
      image: 'images/product/do-xanh-nguyen-hat.jpg',
      price: '145,000 VND/pack',
      oldPrice: '165,000 VND/pack',
      numericPrice: 145000,
      reviews: 19,
      ratingWidth: 68,
      shortDescription: 'A balanced mix of black beans, green beans, red beans, and soybeans for weekly cooking.',
      benefits: ['Multiple beans in one pack', 'Convenient for porridge and dessert soup', 'Balanced color, texture, and nutrition'],
      details: 'This mixed beans pack is designed for families who cook bean porridge, dessert soup, and mixed grain meals regularly. It combines familiar beans in a practical weekly pack.',
      cookingTips: ['Rinse and soak before cooking.', 'Cook slowly for even softness.', 'Use for bean porridge, dessert soup, or breakfast bowls.']
    },
    'product-five-color-bean-mix.html': {
      id: 'product-five-color-bean-mix',
      name: 'Five-Color Bean Mix',
      title: 'Huyen Tuyen Five-Color Bean Mix',
      category: 'Beans & Legumes',
      categoryUrl: 'shop-beans-legumes.html',
      subcategory: 'Bean Mixes',
      image: 'images/product/do-xanh-nguyen-hat.jpg',
      price: '155,000 VND/pack',
      oldPrice: '175,000 VND/pack',
      numericPrice: 155000,
      reviews: 21,
      ratingWidth: 70,
      shortDescription: 'Colorful bean mix for nutritious porridge, dessert soup, and family breakfast bowls.',
      benefits: ['Colorful mix for attractive meals', 'Good for porridge and dessert soup', 'Convenient family-size pack'],
      details: 'Five-color bean mix brings different bean textures and colors into one convenient pack. It is suitable for warm porridge, sweet soup, and home-style nutrition bowls.',
      cookingTips: ['Soak before cooking for best texture.', 'Cook with pandan leaf or ginger for aroma.', 'Serve warm as porridge or chilled as dessert soup.']
    },
    'product-baby-rice-porridge.html': {
      id: 'product-baby-rice-porridge',
      name: 'Baby Rice Porridge',
      title: 'Huyen Tuyen Baby Rice Porridge',
      category: 'Baby & Kids Food',
      categoryUrl: 'shop-baby-kids-food.html',
      subcategory: 'Baby Porridge',
      image: 'images/product/Gao_lut.jpg',
      price: '85,000 VND/pack',
      oldPrice: '98,000 VND/pack',
      numericPrice: 85000,
      reviews: 20,
      ratingWidth: 70,
      shortDescription: 'Soft rice porridge base for simple, gentle meals prepared at home.',
      benefits: ['Mild rice base for homemade meals', 'Easy to cook soft and smooth', 'Suitable for simple family porridge recipes'],
      details: 'Baby Rice Porridge is a gentle rice base for parents who prepare warm meals at home. It is designed for smooth texture and simple pairing with vegetables or protein according to family needs.',
      cookingTips: ['Cook with extra water for a softer texture.', 'Stir often while simmering.', 'Pair with mashed vegetables or other age-appropriate ingredients.']
    },
    'product-brown-rice-baby-cereal.html': {
      id: 'product-brown-rice-baby-cereal',
      name: 'Brown Rice Baby Cereal',
      title: 'Huyen Tuyen Brown Rice Baby Cereal',
      category: 'Baby & Kids Food',
      categoryUrl: 'shop-baby-kids-food.html',
      subcategory: 'Kids Cereals',
      image: 'images/product/Gao_lut.jpg',
      price: '95,000 VND/pack',
      oldPrice: '110,000 VND/pack',
      numericPrice: 95000,
      reviews: 18,
      ratingWidth: 68,
      shortDescription: 'Brown rice cereal with mild flavor, suitable for breakfast and light meals.',
      benefits: ['Mild brown rice flavor', 'Good for warm cereal bowls', 'Simple base for breakfast and light meals'],
      details: 'Brown Rice Baby Cereal offers a mild whole-grain base for warm breakfast bowls and light meals. It is practical for families who want a simple cereal option with familiar rice flavor.',
      cookingTips: ['Cook slowly with water or milk depending on preference.', 'Adjust liquid for thinner or thicker texture.', 'Serve warm with fruit puree or other suitable toppings.']
    },
    'product-oat-cereal-kids.html': {
      id: 'product-oat-cereal-kids',
      name: 'Oat Cereal for Kids',
      title: 'Huyen Tuyen Oat Cereal for Kids',
      category: 'Baby & Kids Food',
      categoryUrl: 'shop-baby-kids-food.html',
      subcategory: 'Kids Cereals',
      image: 'images/product/oats.jpg',
      price: '78,000 VND/500g',
      oldPrice: '90,000 VND/500g',
      numericPrice: 78000,
      reviews: 22,
      ratingWidth: 70,
      shortDescription: 'Rolled oat cereal for warm bowls, milk mixes, and quick breakfast.',
      benefits: ['Quick breakfast option', 'Good with milk, fruit, or yogurt', 'Soft texture when cooked warm'],
      details: 'Oat Cereal for Kids is a convenient rolled-oat product for warm breakfast bowls and milk mixes. It is useful for busy mornings and simple family nutrition routines.',
      cookingTips: ['Cook with water or milk for 3-5 minutes.', 'Add banana or fruit for natural sweetness.', 'Use in overnight oats or warm porridge.']
    },
    'product-mixed-grain-baby-powder.html': {
      id: 'product-mixed-grain-baby-powder',
      name: 'Mixed Grain Baby Powder',
      title: 'Huyen Tuyen Mixed Grain Baby Powder',
      category: 'Baby & Kids Food',
      categoryUrl: 'shop-baby-kids-food.html',
      subcategory: 'Nutrition Mixes',
      image: 'images/product/multi-grain-powder.jpg',
      price: '125,000 VND/pack',
      oldPrice: '145,000 VND/pack',
      numericPrice: 125000,
      reviews: 24,
      ratingWidth: 72,
      shortDescription: 'Finely milled mixed grains for porridge, cereal drinks, and homemade meals.',
      benefits: ['Fine texture for smooth porridge', 'Mixed grains for varied nutrition', 'Convenient for cereal drinks and warm bowls'],
      details: 'Mixed Grain Baby Powder combines selected grains in a fine-milled format for warm porridge and cereal drinks. It helps families prepare varied grain meals without mixing many ingredients manually.',
      cookingTips: ['Whisk with water before heating to avoid lumps.', 'Cook gently and stir continuously.', 'Adjust thickness by adding more warm water or milk.']
    },
    'product-kids-rice-crackers.html': {
      id: 'product-kids-rice-crackers',
      name: 'Kids Rice Crackers',
      title: 'Huyen Tuyen Kids Rice Crackers',
      category: 'Baby & Kids Food',
      categoryUrl: 'shop-baby-kids-food.html',
      subcategory: 'Kids Snacks',
      image: 'images/product/Gao_tam_xoan_hai_hau.png',
      price: '55,000 VND/pack',
      oldPrice: '65,000 VND/pack',
      numericPrice: 55000,
      reviews: 16,
      ratingWidth: 67,
      shortDescription: 'Light rice crackers for simple snacks and lunchbox treats.',
      benefits: ['Light rice-based snack', 'Easy to pack for school or travel', 'Simple flavor for everyday snacking'],
      details: 'Kids Rice Crackers are light rice-based snacks for lunchboxes and simple family snack time. The product keeps the familiar rice flavor in a crisp format.',
      cookingTips: ['Store in an airtight container after opening.', 'Serve as a dry snack or with yogurt dips.', 'Keep away from moisture to preserve crispness.']
    },
    'product-pumpkin-grain-porridge.html': {
      id: 'product-pumpkin-grain-porridge',
      name: 'Pumpkin Grain Porridge',
      title: 'Huyen Tuyen Pumpkin Grain Porridge',
      category: 'Baby & Kids Food',
      categoryUrl: 'shop-baby-kids-food.html',
      subcategory: 'Baby Porridge',
      image: 'images/product/mixed-grains.jpg',
      price: '105,000 VND/pack',
      oldPrice: '120,000 VND/pack',
      numericPrice: 105000,
      reviews: 19,
      ratingWidth: 69,
      shortDescription: 'Pumpkin and grain porridge mix for a naturally sweet, warm meal.',
      benefits: ['Naturally sweet pumpkin flavor', 'Warm porridge mix for light meals', 'Useful for breakfast and evening bowls'],
      details: 'Pumpkin Grain Porridge combines grain flavor with the natural sweetness of pumpkin. It is intended for warm, soft meals prepared at home.',
      cookingTips: ['Cook gently with enough water for a soft texture.', 'Stir often while heating.', 'Serve warm and adjust thickness to preference.']
    },
    'product-banana-granola-bites.html': {
      id: 'product-banana-granola-bites',
      name: 'Banana Granola Bites',
      title: 'Huyen Tuyen Banana Granola Bites',
      category: 'Baby & Kids Food',
      categoryUrl: 'shop-baby-kids-food.html',
      subcategory: 'Kids Snacks',
      image: 'images/product/granola.jpg',
      price: '72,000 VND/pack',
      oldPrice: '85,000 VND/pack',
      numericPrice: 72000,
      reviews: 17,
      ratingWidth: 68,
      shortDescription: 'Small granola bites with banana flavor for easy school snacks.',
      benefits: ['Convenient bite-size snack', 'Banana flavor children enjoy', 'Good for lunchboxes and travel'],
      details: 'Banana Granola Bites are compact snacks made for quick breakfast support, school snacks, and family sharing. They bring granola texture with a gentle banana flavor.',
      cookingTips: ['Serve directly as a snack.', 'Pair with yogurt or milk.', 'Store sealed to keep the bites crisp.']
    },
    'product-kids-breakfast-combo.html': {
      id: 'product-kids-breakfast-combo',
      name: 'Family Kids Breakfast Combo',
      title: 'Huyen Tuyen Family Kids Breakfast Combo',
      category: 'Baby & Kids Food',
      categoryUrl: 'shop-baby-kids-food.html',
      subcategory: 'Nutrition Mixes',
      image: 'images/product/granola.jpg',
      price: '235,000 VND/combo',
      oldPrice: '270,000 VND/combo',
      numericPrice: 235000,
      reviews: 25,
      ratingWidth: 72,
      shortDescription: 'A family combo with oats, cereal, and grain powder for children breakfast.',
      benefits: ['Multiple breakfast options in one combo', 'Good for weekly family planning', 'Includes grain and cereal choices'],
      details: 'Family Kids Breakfast Combo helps families rotate breakfast between oats, cereal, and grain powder. It is a practical set for households that prepare breakfast at home.',
      cookingTips: ['Rotate products during the week for variety.', 'Pair with fruit, milk, or yogurt.', 'Store each pack sealed after opening.']
    },
    'product-chia-seeds.html': {
      id: 'product-chia-seeds',
      name: 'Chia Seeds',
      title: 'Huyen Tuyen Chia Seeds',
      category: 'Healthy Nuts & Seeds',
      categoryUrl: 'Healthy-Nuts-Seeds.html',
      subcategory: 'Super Seeds',
      image: 'images/product/nuts-seeds-chia-seeds.png',
      price: '88,000 VND/500g',
      oldPrice: '100,000 VND/500g',
      numericPrice: 88000,
      reviews: 31,
      ratingWidth: 72,
      shortDescription: 'Small nutrient-dense seeds for yogurt, smoothies, oatmeal, and healthy drinks.',
      benefits: ['Good for drinks and breakfast bowls', 'Naturally forms a gel when soaked', 'Useful topping for yogurt, oats, and smoothies'],
      details: 'Chia seeds are popular for healthy drinks, overnight oats, smoothie bowls, and yogurt toppings. They absorb liquid and create a soft gel texture.',
      cookingTips: ['Soak for 10-15 minutes before using in drinks.', 'Add to yogurt, oats, or smoothies.', 'Use a small amount first because chia expands in liquid.']
    },
    'product-pumpkin-seeds.html': {
      id: 'product-pumpkin-seeds',
      name: 'Pumpkin Seeds',
      title: 'Huyen Tuyen Pumpkin Seeds',
      category: 'Healthy Nuts & Seeds',
      categoryUrl: 'Healthy-Nuts-Seeds.html',
      subcategory: 'Super Seeds',
      image: 'images/product/nuts-seeds-pumpkin-seeds.png',
      price: '82,000 VND/500g',
      oldPrice: '95,000 VND/500g',
      numericPrice: 82000,
      reviews: 14,
      ratingWidth: 67,
      shortDescription: 'Roasted pumpkin seeds for simple snacks, toppings, and breakfast grain mixes.',
      benefits: ['Crunchy seed snack', 'Good topping for salads and oats', 'Useful in granola and grain mixes'],
      details: 'Pumpkin seeds are crunchy, convenient, and easy to add to breakfast bowls, salad toppings, trail mixes, and baked goods.',
      cookingTips: ['Eat directly as a snack.', 'Sprinkle over salad, oats, or yogurt.', 'Mix with nuts and dried fruit for homemade snack packs.']
    },
    'product-trail-mix.html': {
      id: 'product-trail-mix',
      name: 'Trail Mix',
      title: 'Huyen Tuyen Trail Mix',
      category: 'Healthy Nuts & Seeds',
      categoryUrl: 'Healthy-Nuts-Seeds.html',
      subcategory: 'Mixed Snacks',
      image: 'images/product/nuts-seeds-trail-mix.png',
      price: '115,000 VND/500g',
      oldPrice: '130,000 VND/500g',
      numericPrice: 115000,
      reviews: 25,
      ratingWidth: 70,
      shortDescription: 'Balanced mix of nuts, seeds, and dried fruits for office snacks and family sharing.',
      benefits: ['Ready-to-eat mixed snack', 'Good for office, travel, and sharing', 'Balanced crunchy and chewy texture'],
      details: 'Trail Mix is a convenient snack blend for busy days, school, office, and family sharing. It combines different textures in one pack.',
      cookingTips: ['Serve directly as a snack.', 'Add to yogurt or granola bowls.', 'Store in an airtight container after opening.']
    }
  };

  function formatCurrencyText(value) {
    return String(value || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND';
  }

  function getCurrentProduct() {
    var file = window.location.pathname.split('/').pop() || '';
    return PRODUCTS[file] || null;
  }

  function setText(selector, text) {
    var el = document.querySelector(selector);
    if (el) el.textContent = text;
  }

  function setHtml(selector, html) {
    var el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  }

  function renderList(items) {
    return items.map(function (item) {
      return '<li><i class="fas fa-check-circle"></i> ' + item + '</li>';
    }).join('');
  }

  function renderTips(items) {
    return items.map(function (item) {
      return '<li>' + item + '</li>';
    }).join('');
  }

  function render() {
    var product = getCurrentProduct();
    if (!product) {
      setText('#product-name', 'Product Not Found');
      return;
    }

    document.title = product.name + ' - Huyen Tuyen Rice';
    setText('#breadcrumb-category', product.category);
    setText('#breadcrumb-current', product.name);
    setText('#product-name', product.title);
    setText('#product-review-count', '(' + product.reviews + ' Customer Reviews)');
    setText('#short-description', product.shortDescription);
    setText('#product-price', product.price);
    setText('#product-old-price', 'Original Price: ' + product.oldPrice);
    setText('#product-detail-copy', product.details);

    var categoryLinks = document.querySelectorAll('[data-product-category-url]');
    for (var i = 0; i < categoryLinks.length; i++) {
      categoryLinks[i].setAttribute('href', product.categoryUrl);
      categoryLinks[i].textContent = product.category;
    }

    var image = document.getElementById('zoom-pro');
    if (image) {
      image.src = product.image;
      image.setAttribute('data-zoom-image', product.image);
      image.alt = product.name;
    }

    var gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.innerHTML = '<a class="active" data-image="' + product.image + '" data-zoom-image="' + product.image + '">' +
        '<img src="' + product.image + '" alt="' + product.name + '"></a>';
    }

    setHtml('#benefit-list', renderList(product.benefits));
    setHtml('#cooking-tips', renderTips(product.cookingTips));

    var star = document.querySelector('.product-rating .star span');
    if (star) star.style.width = product.ratingWidth + 'px';

    var wrapper = document.querySelector('.all-information-wrapper.item');
    if (wrapper) {
      wrapper.setAttribute('data-product-id', product.id);
      wrapper.setAttribute('data-product-name', product.name);
      wrapper.setAttribute('data-product-price', product.numericPrice);
      wrapper.setAttribute('data-product-image', product.image);
    }

    var packSize = document.getElementById('pack-size');
    if (packSize) {
      packSize.innerHTML = '<option value="1" data-price="' + product.numericPrice + '">' +
        product.price + '</option><option value="2" data-price="' + (product.numericPrice * 2) + '">' +
        'Double Pack - ' + formatCurrencyText(product.numericPrice * 2) + '</option>';
    }

    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.elevateZoom) {
      window.jQuery(function ($) {
        $('#zoom-pro').elevateZoom({
          gallery: 'gallery',
          galleryActiveClass: 'active',
          zoomWindowWidth: 400,
          zoomWindowHeight: 400,
          borderSize: 1,
          borderColour: '#eee'
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
