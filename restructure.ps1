# ============================================================
# Shopping Project - HTML Restructure Script
# Run from: d:\Tuyen_Project\Shopping
# ============================================================

$ErrorActionPreference = "Stop"
$rootPath = $PSScriptRoot
Set-Location $rootPath

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Shopping Project - HTML Restructure" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# =============================================
# STEP 1: Create directories
# =============================================
Write-Host "`n[1/6] Creating new directories..." -ForegroundColor Yellow
$dirs = @("pages", "blog", "shop", "products", "cart", "deals")
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path "$rootPath\$dir" | Out-Null
    Write-Host "  + $dir/" -ForegroundColor Green
}

# =============================================
# STEP 2: Define file-to-folder mapping
# =============================================
$fileToFolder = [ordered]@{
    # pages/ - Common static pages
    "404.html"                   = "pages"
    "about.html"                 = "pages"
    "account.html"               = "pages"
    "contact.html"               = "pages"
    "faq.html"                   = "pages"
    "lost-password.html"         = "pages"
    "store-directory.html"       = "pages"
    "terms-and-conditions.html"  = "pages"
    "track-order.html"           = "pages"

    # blog/ - Blog posts and news
    "blog.html"                             = "blog"
    "blog-detail.html"                      = "blog"
    "blog-family-rice-meal-ideas.html"      = "blog"
    "blog-fragrant-rice-daily-meals.html"   = "blog"
    "blog-granola-breakfast-bowl.html"      = "blog"
    "blog-healthy-brown-rice-bowl.html"     = "blog"
    "blog-how-to-store-rice-properly.html"  = "blog"
    "blog-mixed-grain-porridge.html"        = "blog"
    "blog-rice-meals-kids.html"             = "blog"
    "blog-warm-oatmeal-nuts.html"           = "blog"
    "rice-grain-recipes.html"               = "blog"
    "rice-market-news.html"                 = "blog"

    # shop/ - Category/shop listing pages
    "shop-v1-root-category.html"        = "shop"
    "shop-v2-sub-category.html"         = "shop"
    "shop-v3-sub-sub-category.html"     = "shop"
    "shop-v4-filter-as-category.html"   = "shop"
    "shop-v5-product-not-found.html"    = "shop"
    "shop-v6-search-results.html"       = "shop"
    "shop-whole-grains-cereals.html"    = "shop"
    "shop-beans-legumes.html"           = "shop"
    "shop-healthy-food-products.html"   = "shop"
    "shop-baby-kids-food.html"          = "shop"
    "Healthy-Nuts-Seeds.html"           = "shop"
    "single-product.html"               = "shop"

    # cart/ - Shopping cart and checkout
    "cart.html"          = "cart"
    "cart-empty.html"    = "cart"
    "checkout.html"      = "cart"
    "confirmation.html"  = "cart"
    "wishlist.html"      = "cart"
    "wishlist-empty.html" = "cart"

    # deals/ - Special offer / deal pages
    "custom-deal-page.html"   = "deals"
    "family-combo-page.html"  = "deals"
    "monthly-sale-page.html"  = "deals"
}

# Auto-add all product-*.html files to products/
Get-ChildItem -Path $rootPath -Filter "product-*.html" | ForEach-Object {
    $fileToFolder[$_.Name] = "products"
}

Write-Host "`n  Total files to move: $($fileToFolder.Count)"

# =============================================
# STEP 3: Move HTML files
# =============================================
Write-Host "`n[2/6] Moving HTML files..." -ForegroundColor Yellow
$movedCount = 0
foreach ($entry in $fileToFolder.GetEnumerator()) {
    $srcFile = $entry.Key
    $destFolder = $entry.Value
    $srcPath = Join-Path $rootPath $srcFile
    $destPath = Join-Path $rootPath "$destFolder\$srcFile"
    if (Test-Path $srcPath) {
        Move-Item -Path $srcPath -Destination $destPath -Force
        $movedCount++
    } else {
        Write-Warning "  ! File not found: $srcFile"
    }
}
Write-Host "  Moved $movedCount HTML files" -ForegroundColor Green

# Delete home-html.html (confirmed by user)
$homeHtml = Join-Path $rootPath "home-html.html"
if (Test-Path $homeHtml) {
    Remove-Item $homeHtml -Force
    Write-Host "  Deleted: home-html.html" -ForegroundColor Green
}

# =============================================
# STEP 4: Update paths in index.html (ROOT - stays at /)
# =============================================
Write-Host "`n[3/6] Updating links in index.html..." -ForegroundColor Yellow
$indexPath = Join-Path $rootPath "index.html"
$content = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)

foreach ($entry in $fileToFolder.GetEnumerator()) {
    $filename = $entry.Key
    $folder = $entry.Value
    # Replace: href="filename.html" -> href="folder/filename.html"
    $content = $content.Replace("href=`"$filename`"", "href=`"$folder/$filename`"")
    $content = $content.Replace("href='$filename'", "href='$folder/$filename'")
    # Also handle src= references
    $content = $content.Replace("src=`"$filename`"", "src=`"$folder/$filename`"")
}

[System.IO.File]::WriteAllText($indexPath, $content, [System.Text.Encoding]::UTF8)
Write-Host "  Updated: index.html" -ForegroundColor Green

# =============================================
# STEP 5: Update paths in ALL moved HTML files
# =============================================
Write-Host "`n[4/6] Updating links in moved HTML files..." -ForegroundColor Yellow

foreach ($entry in $fileToFolder.GetEnumerator()) {
    $filename = $entry.Key
    $myFolder = $entry.Value
    $filePath = Join-Path $rootPath "$myFolder\$filename"

    if (-not (Test-Path $filePath)) {
        Write-Warning "  ! Not found after move: $myFolder\$filename"
        continue
    }

    $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

    # --------------------------------------------------
    # Fix static asset paths: add ../ prefix
    # --------------------------------------------------
    $assetFolders = @('css', 'js', 'images', 'fonts')
    foreach ($asset in $assetFolders) {
        $content = $content.Replace("href=`"$asset/", "href=`"../$asset/")
        $content = $content.Replace("href='$asset/", "href='../$asset/")
        $content = $content.Replace("src=`"$asset/", "src=`"../$asset/")
        $content = $content.Replace("src='$asset/", "src='../$asset/")
    }

    # Fix favicon
    $content = $content.Replace('href="favicon.ico"', 'href="../favicon.ico"')
    $content = $content.Replace("href='favicon.ico'", "href='../favicon.ico'")

    # Fix link back to homepage (index.html)
    $content = $content.Replace('href="index.html"', 'href="../index.html"')
    $content = $content.Replace("href='index.html'", "href='../index.html'")

    # --------------------------------------------------
    # Fix cross-page HTML links
    # --------------------------------------------------
    foreach ($targetEntry in $fileToFolder.GetEnumerator()) {
        $targetFile = $targetEntry.Key
        $targetFolder = $targetEntry.Value

        if ($targetFolder -eq $myFolder) {
            # Same folder: no path change needed
            # e.g., from blog/blog.html to blog/blog-detail.html => "blog-detail.html" stays
            continue
        } else {
            # Different folder: prepend ../targetFolder/
            $content = $content.Replace("href=`"$targetFile`"", "href=`"../$targetFolder/$targetFile`"")
            $content = $content.Replace("href='$targetFile'", "href='../$targetFolder/$targetFile'")
        }
    }

    [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
}
Write-Host "  Updated $($fileToFolder.Count) HTML files" -ForegroundColor Green

# =============================================
# STEP 6: Update JS files that contain HTML references
# =============================================
Write-Host "`n[5/6] Updating JS files..." -ForegroundColor Yellow

# ---- vmenu-sync.js ----
# This JS is loaded by ALL pages including index.html (at root) AND subfolder pages.
# Since index.html is at root and uses this JS, we need paths WITHOUT ../ prefix.
# But subfolder pages need paths WITH ../ prefix.
#
# SOLUTION: vmenu-sync.js will use paths prefixed with folder/ (e.g. "products/product-xxx.html")
# which works correctly from index.html (root). For subfolder pages loading this JS,
# we need to detect depth and use a basePath variable.
# We will inject a dynamic basePath detection into vmenu-sync.js.

$vmenuPath = Join-Path $rootPath "js\vmenu-sync.js"
if (Test-Path $vmenuPath) {
    $content = [System.IO.File]::ReadAllText($vmenuPath, [System.Text.Encoding]::UTF8)

    # Replace all HTML filename references with folder-prefixed paths
    # vmenu-sync.js uses href="filename.html" strings inside JS string concatenation
    foreach ($entry in $fileToFolder.GetEnumerator()) {
        $filename = $entry.Key
        $folder = $entry.Value
        # In JS string context: href=\"filename.html\" (escaped)
        $content = $content.Replace("href=\`"$filename\`"", "href=\`"+basePath+`"$folder/$filename\`"")
        # Non-escaped JS string context: href="filename.html"
        $content = $content.Replace("href=`"$filename`"", "href=`"+basePath+`"$folder/$filename`"")
    }

    # Inject basePath variable at the top of the IIFE
    $content = $content.Replace(
        "(function () {`n  'use strict';",
        "(function () {`n  'use strict';`n`n  // Detect depth: pages in subfolders need ../ prefix`n  var depth = window.location.pathname.split('/').filter(Boolean).length;`n  var basePath = depth > 1 ? '../' : '';`n"
    )

    [System.IO.File]::WriteAllText($vmenuPath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "  Updated: js\vmenu-sync.js (with dynamic basePath)" -ForegroundColor Green
}

# ---- product-detail-renderer.js ----
# getCurrentProduct() uses: window.location.pathname.split('/').pop()
# This gets only the filename (e.g. "product-xxx.html") - KEYS don't need to change!
# Only the VALUES (categoryUrl, image paths) need updating.
$rendererPath = Join-Path $rootPath "js\product-detail-renderer.js"
if (Test-Path $rendererPath) {
    $content = [System.IO.File]::ReadAllText($rendererPath, [System.Text.Encoding]::UTF8)

    # Update categoryUrl values (these are URLs used for navigation)
    # The products pages are at depth 1 (products/product-xxx.html)
    # so relative URLs from there need ../ prefix for cross-folder navigation
    $shopFiles = @("shop-beans-legumes.html", "shop-baby-kids-food.html", "shop-healthy-food-products.html", "shop-whole-grains-cereals.html", "Healthy-Nuts-Seeds.html")
    foreach ($shopFile in $shopFiles) {
        if ($fileToFolder.Contains($shopFile)) {
            $folder = $fileToFolder[$shopFile]
            $content = $content.Replace("categoryUrl: '$shopFile'", "categoryUrl: '../$folder/$shopFile'")
            $content = $content.Replace("categoryUrl: `"$shopFile`"", "categoryUrl: `"../$folder/$shopFile`"")
        }
    }

    # Update image paths: 'images/product/xxx.png' -> '../images/product/xxx.png'
    # These pages live in /products/ so need ../images/
    $content = $content.Replace("image: 'images/", "image: '../images/")
    $content = $content.Replace('image: "images/', 'image: "../images/')

    [System.IO.File]::WriteAllText($rendererPath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "  Updated: js\product-detail-renderer.js" -ForegroundColor Green
}

# ---- search-results.js ----
$searchJsPath = Join-Path $rootPath "js\search-results.js"
if (Test-Path $searchJsPath) {
    $content = [System.IO.File]::ReadAllText($searchJsPath, [System.Text.Encoding]::UTF8)
    $hasChanges = $false
    foreach ($entry in $fileToFolder.GetEnumerator()) {
        $filename = $entry.Key
        $folder = $entry.Value
        if ($content.Contains($filename)) {
            $content = $content.Replace("'$filename'", "'../$folder/$filename'")
            $content = $content.Replace("`"$filename`"", "`"../$folder/$filename`"")
            $hasChanges = $true
        }
    }
    if ($hasChanges) {
        [System.IO.File]::WriteAllText($searchJsPath, $content, [System.Text.Encoding]::UTF8)
        Write-Host "  Updated: js\search-results.js" -ForegroundColor Green
    }
}

Write-Host "`n[6/6] Final verification..." -ForegroundColor Yellow
# Count total HTML files in subfolders
$totalMoved = (Get-ChildItem -Path $rootPath -Recurse -Filter "*.html" | Where-Object { $_.DirectoryName -ne $rootPath }).Count
$rootHtml = (Get-ChildItem -Path $rootPath -MaxDepth 0 -Filter "*.html" | Where-Object { $_.DirectoryName -eq $rootPath }).Count
Write-Host "  HTML files at root     : $rootHtml (should be 1 - index.html)" -ForegroundColor $(if ($rootHtml -eq 1) { "Green" } else { "Red" })
Write-Host "  HTML files in subfolders: $totalMoved" -ForegroundColor Green

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Restructuring Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Directories created : 6 (pages, blog, shop, products, cart, deals)"
Write-Host "  HTML files moved    : $movedCount"
Write-Host "  home-html.html      : Deleted"
Write-Host "  JS files updated    : vmenu-sync.js, product-detail-renderer.js"
Write-Host ""
Write-Host "  New structure:" -ForegroundColor White
foreach ($dir in $dirs) {
    $count = (Get-ChildItem -Path "$rootPath\$dir" -Filter "*.html").Count
    Write-Host "  $dir/ ($count files)" -ForegroundColor Gray
}
