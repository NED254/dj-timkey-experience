# Run from inside dj-timkey-experience\

$path = ".\src\chapters\Ads.jsx"
$content = Get-Content -Raw $path
$old = 'const duration = Math.max(10, ads.length * 4)'
$new = 'const duration = Math.max(5, ads.length * 2)'

if ($content -notmatch [regex]::Escape($old)) {
    Write-Host "Could not find the duration line - no changes made." -ForegroundColor Red
} else {
    $content = $content.Replace($old, $new)
    [System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Ticker speed roughly doubled." -ForegroundColor Green
}
