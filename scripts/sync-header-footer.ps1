$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $projectRoot 'index.html'

if (-not (Test-Path -LiteralPath $sourcePath)) {
    throw "Canonical source not found: $sourcePath"
}

$sourceHtml = Get-Content -Raw -LiteralPath $sourcePath
$headerMatch = [regex]::Match($sourceHtml, '(?s)<header\b.*?</header>')
$footerMatch = [regex]::Match($sourceHtml, '(?s)<footer\b.*?</footer>')

if (-not $headerMatch.Success) {
    throw 'Canonical header block was not found in index.html'
}

if (-not $footerMatch.Success) {
    throw 'Canonical footer block was not found in index.html'
}

$canonicalHeader = $headerMatch.Value
$canonicalFooter = $footerMatch.Value
$faviconLine = '    <link href="images/main-logo/huyen-tuyen-rice-favicon.png" rel="shortcut icon" type="image/png">'
$htmlFiles = Get-ChildItem -LiteralPath $projectRoot -Filter '*.html' -File
$updated = New-Object System.Collections.Generic.List[string]
$skipped = New-Object System.Collections.Generic.List[string]

foreach ($file in $htmlFiles) {
    $html = Get-Content -Raw -LiteralPath $file.FullName
    $originalHtml = $html
    $hasHeader = [regex]::IsMatch($html, '(?s)<header\b.*?</header>')
    $hasFooter = [regex]::IsMatch($html, '(?s)<footer\b.*?</footer>')

    if (-not [regex]::IsMatch($html, '<link\b[^>]*rel="shortcut icon"')) {
        $html = [regex]::Replace($html, '(?i)(<title>.*?</title>)', "`$1`r`n$faviconLine", 1)
    }

    if (-not $hasHeader -and $html -match 'Header omitted for brevity') {
        $html = $html -replace '\s*<!-- Header omitted for brevity, same as other pages -->', "`r`n$canonicalHeader"
        $hasHeader = $true
    }

    if (-not $hasFooter -and $html -match 'Footer, and Scripts omitted for brevity') {
        $html = $html -replace '\s*<!-- Tabs, Footer, and Scripts omitted for brevity \(same as other product pages\) -->', "`r`n$canonicalFooter"
        $hasFooter = $true
    }

    if (-not $hasHeader -or -not $hasFooter) {
        $skipped.Add($file.Name)
        continue
    }

    $nextHtml = [regex]::Replace($html, '(?s)<header\b.*?</header>', [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $canonicalHeader }, 1)
    $nextHtml = [regex]::Replace($nextHtml, '(?s)<footer\b.*?</footer>', [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $canonicalFooter }, 1)

    if ($nextHtml -ne $originalHtml) {
        Set-Content -LiteralPath $file.FullName -Value $nextHtml -NoNewline
        $updated.Add($file.Name)
    }
}

Write-Output "Updated files: $($updated.Count)"
if ($updated.Count -gt 0) {
    $updated | Sort-Object | ForEach-Object { Write-Output "  $_" }
}

Write-Output "Skipped files without full header/footer: $($skipped.Count)"
if ($skipped.Count -gt 0) {
    $skipped | Sort-Object | ForEach-Object { Write-Output "  $_" }
}
