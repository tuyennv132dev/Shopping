$content = Get-Content 'index.html' -Raw
$marker = '<!-- Healthy Nuts & Seeds Banner -->'
$first = $content.IndexOf($marker)
$second = $content.IndexOf($marker, $first + 50)

if ($second -gt 0) {
    # Find end of second Our Rice Selection section (it ends before the second banner)
    # Find where the second Our Rice Selection section starts
    $ourRiceSecond = $content.IndexOf('<!-- Men-Clothing -->', $first + 50)
    
    if ($ourRiceSecond -gt 0) {
        # The duplicate Our Rice Selection ends where Healthy Nuts & Seeds Banner starts (the first instance)
        # So we need to remove from $ourRiceSecond to $second (where the second banner starts)
        $sectionEnd = $content.IndexOf("</section>", $ourRiceSecond)
        if ($sectionEnd -gt 0) {
            $sectionEnd = $content.IndexOf("</section>", $sectionEnd + 10)
            if ($sectionEnd -gt 0) {
                $content = $content.Substring(0, $ourRiceSecond) + $content.Substring($sectionEnd + 10)
            }
        }
    }
}

Set-Content 'index.html' -Value $content -Encoding UTF8
Write-Host "Duplicate removal complete"