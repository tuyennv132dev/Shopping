# PowerShell script to update footer Shop links in all HTML files
# Replaces:
#   1. shop-v2-sub-category.html">Healthy Nuts & Seeds  -->  Healthy-Nuts-Seeds.html
#   2. shop-v3-sub-sub-category.html">Whole Grains & Cereals  -->  shop-whole-grains-cereals.html
#   3. shop-v4-filter-as-category.html">Family Combo Packs  -->  family-combo-page.html

$htmlFiles = Get-ChildItem -Path (Split-Path $PSScriptRoot) -Filter "*.html" | Where-Object { $_.Name -ne "home-html.html" }

$totalUpdated = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content

    # Find footer section using regex
    $footerPattern = '(?si)(<footer[\s\S]*?</footer>)'
    $footerMatch = [regex]::Match($content, $footerPattern)

    if ($footerMatch.Success) {
        $footerContent = $footerMatch.Value
        $newFooter = $footerContent

        # Replace 1: Healthy Nuts & Seeds
        $newFooter = $newFooter -replace 'shop-v2-sub-category\.html">Healthy Nuts & Seeds</a>', 'Healthy-Nuts-Seeds.html">Healthy Nuts & Seeds</a>'
        $newFooter = $newFooter -replace 'shop-v2-sub-category\.html">Healthy Nuts & Seeds</a>', 'Healthy-Nuts-Seeds.html">Healthy Nuts & Seeds</a>'

        # Replace 2: Whole Grains & Cereals
        $newFooter = $newFooter -replace 'shop-v3-sub-sub-category\.html">Whole Grains & Cereals</a>', 'shop-whole-grains-cereals.html">Whole Grains & Cereals</a>'
        $newFooter = $newFooter -replace 'shop-v3-sub-sub-category\.html">Whole Grains & Cereals</a>', 'shop-whole-grains-cereals.html">Whole Grains & Cereals</a>'

        # Replace 3: Family Combo Packs
        $newFooter = $newFooter -replace 'shop-v4-filter-as-category\.html">Family Combo Packs</a>', 'family-combo-page.html">Family Combo Packs</a>'

        if ($newFooter -ne $footerContent) {
            $content = $content.Substring(0, $footerMatch.Index) + $newFooter + $content.Substring($footerMatch.Index + $footerMatch.Length)
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $totalUpdated++
            Write-Host "UPDATED: $($file.Name)"
        } else {
            Write-Host "NO CHANGE: $($file.Name)"
        }
    } else {
        Write-Host "NO FOOTER FOUND: $($file.Name)"
    }
}

Write-Host "`nTotal files updated: $totalUpdated"