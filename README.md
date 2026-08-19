# Huyen Tuyen Rice Shopping Website

Static e-commerce website for Huyen Tuyen Rice, focused on Premium Vietnamese rice, whole grains, nuts, seeds, healthy food products, family combo packs, and recipe content.

The project is based on the Groover online shopping template and has been customized into a clean, client-side shopping experience for rice and healthy food products.

## Features

- **Homepage (`index.html`)**: Product sliders, category sections, banners, best sellers, and recipe cards.
- **Organized Modular Directory Structure**: HTML files are cleanly categorized into subdirectories (`pages/`, `blog/`, `shop/`, `products/`, `cart/`, `deals/`).
- **Product Listing Pages (`shop/`)**: Rice types, healthy nuts and seeds, whole grains & cereals, beans & legumes, baby & kids food, and search result listings.
- **Product Detail Pages (`products/`)**: Detailed view for 50+ individual products (rice, grains, nuts, seeds, beans, baby food, combo packs).
- **Cart & Wishlist System (`cart/` & `js/cart.js`)**:
  - Full client-side Shopping Cart, Wishlist, Checkout, and Order Confirmation pages using `localStorage`.
  - **Dynamic Interactive Mini Cart (`YOUR CART`)**: Real-time quantity adjustment (`+` / `-`), item removal, and auto-updated subtotal/grand total without page refresh.
  - Non-intrusive modal design (remains open during quantity adjustment, closes smoothly when clicking outside the overlay).
  - Toast notifications when adding products to the cart.
  - Automatic calculation of relative image & page URLs across all subfolder depths.
- **Responsive Header Search**: Smart keyword & category search bar with auto-scaling price badges to prevent line wraps on high cart totals.
- **Multi-language Support**: ENG/VIE language selector using Google Translate for Vietnamese.
- **Unified Currency**: Standardized `VND` currency formatting across all pages.
- **Blog & Recipe Guides (`blog/`)**: Rice classification guides, recipe bowls, and rice market news.

## Tech Stack

- **HTML5 & CSS3** (Vanilla CSS + `css/brand-polish.css` design system)
- **Bootstrap 4**
- **jQuery**
- **Owl Carousel**
- **Font Awesome 5 & Ion-Icons**
- **NProgress & ElevateZoom**
- **LocalStorage-based Cart & State Engine**

## Project Structure

```text
Shopping/
│
├── index.html                  ← Main Homepage (Root)
├── favicon.ico
├── LICENSE
├── README.md
│
├── css/                        ← Theme styles, utilities, Bootstrap, brand polish
├── js/                         ← Site logic, cart engine, language switcher, menu sync
├── images/                     ← Product images, banners, blog visuals, logos
├── fonts/                      ← Web font icons
├── scripts/                    ← Maintenance and automation PowerShell scripts
├── tools/                      ← Auxiliary tools
│
├── pages/ (9 files)            ← Static & support pages
│   ├── about.html
│   ├── contact.html
│   ├── faq.html
│   ├── store-directory.html
│   ├── terms-and-conditions.html
│   ├── track-order.html
│   ├── account.html
│   ├── lost-password.html
│   └── 404.html
│
├── blog/ (12 files)            ← Blog articles & culinary guides
│   ├── blog.html               (Main Blog Listing)
│   ├── blog-detail.html
│   ├── blog-family-rice-meal-ideas.html
│   ├── blog-fragrant-rice-daily-meals.html
│   ├── blog-granola-breakfast-bowl.html
│   ├── blog-healthy-brown-rice-bowl.html
│   ├── blog-how-to-store-rice-properly.html
│   ├── blog-mixed-grain-porridge.html
│   ├── blog-rice-meals-kids.html
│   ├── blog-warm-oatmeal-nuts.html
│   ├── rice-grain-recipes.html
│   └── rice-market-news.html
│
├── shop/ (12 files)            ← Shop category & search result pages
│   ├── shop-v1-root-category.html
│   ├── shop-v2-sub-category.html
│   ├── shop-v3-sub-sub-category.html
│   ├── shop-v4-filter-as-category.html
│   ├── shop-v5-product-not-found.html
│   ├── shop-v6-search-results.html
│   ├── shop-whole-grains-cereals.html
│   ├── shop-beans-legumes.html
│   ├── shop-healthy-food-products.html
│   ├── shop-baby-kids-food.html
│   ├── Healthy-Nuts-Seeds.html
│   └── single-product.html
│
├── products/ (53 files)        ← Individual product detail pages
│   ├── product-white-rice.html
│   ├── product-sticky-rice.html
│   ├── product-jasmine-rice.html
│   ├── product-st25-rice.html
│   ├── product-brown-rice.html
│   ├── product-almonds.html
│   ├── product-cashews.html
│   └── ... (50+ product pages)
│
├── cart/ (6 files)             ← Cart, Wishlist, and Checkout pages
│   ├── cart.html
│   ├── cart-empty.html
│   ├── checkout.html
│   ├── confirmation.html
│   ├── wishlist.html
│   └── wishlist-empty.html
│
└── deals/ (3 files)            ← Special promotions & combo offers
    ├── custom-deal-page.html
    ├── family-combo-page.html
    └── monthly-sale-page.html
```

## How to Run Locally

This project is a pure static web application. Open `index.html` directly in any web browser or use a local HTTP server.

Recommended local server workflow:

```bash
# From the project root
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
```

## Core Client Scripts (`js/`)

- `js/app.js`: General UI behavior, responsive search submission (`q` & `cat` query params), menu handlers, and carousel initialization.
- `js/cart.js`: Unified cart & wishlist engine, interactive Mini Cart (`YOUR CART`), quantity controls (`+` / `-`), relative path resolver (`resolveUrl`), checkout receipt generator, and toast notifications.
- `js/vmenu-sync.js`: Shared vertical catalog menu builder with dynamic depth detection (`basePath`).
- `js/product-detail-renderer.js`: Dynamic content renderer for individual product pages.
- `js/google-translate.js`: Language switcher (`ENG` / `VIE`).

## Language and Currency

- **Language**: English by default (`ENG`), with automated Vietnamese translation (`VIE`) powered by Google Translate widget integration.
- **Currency**: Unified `VND` (Vietnamese Dong) formatting throughout the entire site.

## Development & Maintenance Notes

- When adding new product or blog pages, place them into their respective subdirectories (`products/`, `blog/`, `shop/`, etc.).
- Ensure relative pathing (`../`) is maintained for static assets (`css/`, `js/`, `images/`) when adding new pages inside subfolders.
- The `js/cart.js` `resolveUrl()` function handles relative paths dynamically across different subfolder depths.

## License

This repository includes template-derived assets and custom project code. Check `LICENSE` and any third-party asset/plugin licenses before redistributing or using the project commercially.
