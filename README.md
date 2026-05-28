# Huyen Tuyen Rice Shopping Website

Static e-commerce website for Huyen Tuyen Rice, focused on Vietnamese rice, whole grains, nuts, seeds, healthy food products, family combo packs, and recipe content.

The project is based on the Groover online shopping template and has been customized into a client-side shopping experience for rice and healthy food products.

## Features

- Home page with product sliders, category sections, banners, best sellers, and recipe cards
- Product listing pages for rice, nuts and seeds, whole grains and cereals, beans and legumes, baby and kids food, and healthy food products
- Product detail pages for rice, grains, nuts, seeds, beans, baby products, and combo packs
- Cart, wishlist, checkout, order confirmation, and track order pages
- Client-side cart and wishlist using `localStorage`
- Checkout receipt date generated from the current day
- ENG/VIE language selector using Google Translate for Vietnamese
- VND as the unified currency across the storefront
- Blog and recipe pages for Rice & Grain Recipes
- Responsive layout using Bootstrap, jQuery, and Owl Carousel

## Tech Stack

- HTML5
- CSS3
- Bootstrap 4
- jQuery
- Owl Carousel
- Font Awesome
- Ionicons
- NProgress
- ElevateZoom
- LocalStorage-based cart and wishlist logic

## Project Structure

```text
.
|-- index.html
|-- product-*.html
|-- blog-*.html
|-- shop-*.html
|-- cart.html
|-- checkout.html
|-- confirmation.html
|-- css/
|-- js/
|-- images/
|-- scripts/
|-- html_webpack/
|-- PROJECT_ANALYSIS.txt
`-- README.md
```

Important folders:

- `css/` - theme styles, layout utilities, Bootstrap-related CSS, custom modal styles
- `js/` - site behavior, cart/wishlist logic, language switcher, menu sync, carousel setup
- `images/` - product images, banners, blog images, logo, patterns, and visual assets
- `scripts/` - maintenance scripts used during development
- `html_webpack/` - original template Webpack source/build setup, currently not used by the active root website

## How to Run Locally

This project is a static website. You can open `index.html` directly in a browser.

Recommended local workflow:

```bash
# From the project root
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
```

Using a local server is recommended because browser behavior can differ when pages are opened directly with the `file://` protocol.

## Runtime Notes

This project does not use a backend server.

Cart, wishlist, and checkout state are stored in the browser with `localStorage`.

Primary client-side scripts:

- `js/app.js` - general UI behavior, search form handling, menu behavior, carousel setup
- `js/cart.js` - cart, wishlist, checkout, mini cart, and receipt rendering
- `js/google-translate.js` - ENG/VIE language switcher
- `js/vmenu-sync.js` - shared vertical menu synchronization
- `js/product-detail-renderer.js` - shared renderer/data for newer product detail pages

## Language and Currency

- Source content is primarily English.
- The language selector supports:
  - `ENG` - original English content
  - `VIE` - Vietnamese translation through Google Translate
- Currency is standardized as `VND`.
- Currency switching has been removed from the UI.

## About `html_webpack`

The `html_webpack/` directory contains the original Webpack build system from the base template.

It includes:

- `html_webpack/package.json`
- `html_webpack/webpack.config.js`
- `html_webpack/src/`
- `html_webpack/dist/`

The active customized website currently runs from the root HTML/CSS/JS files, not from `html_webpack/dist`.

Do not use the Webpack build output as the deployment source unless you intentionally migrate the latest root-level customizations back into `html_webpack/src`.

## Development Notes

When editing the project:

- Update root HTML files directly unless the project is migrated back to a build pipeline.
- Keep product links mapped to their matching product detail pages.
- Keep generated or custom blog images in `images/blog/`.
- Keep product images in `images/product/`.
- After changing links or images, audit local `href`, `src`, `data-image`, and `data-zoom-image` targets.
- Be careful when changing header/footer markup because many pages contain duplicated static markup.

## Contact Information

Current store contact information used in the website:

- Phone: `09xx xxx xxx`
- Phone: `09xx xxx xxx`
- Email: `support@huyentuyenrice.com`
- Location: Vietnam

## License

This repository includes template-derived assets and custom project code. Check `LICENSE` and any third-party asset/plugin licenses before redistributing or using the project commercially.
