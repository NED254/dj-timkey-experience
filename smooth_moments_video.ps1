# Run from inside dj-timkey-experience\

$path = ".\src\chapters\Moments.jsx"
$content = Get-Content -Raw $path

$old = "preload={isSectionInView ? (isCenter ? 'auto' : 'metadata') : 'none'}"
$new = "preload={isSectionInView ? 'auto' : 'none'}"

if ($content -notmatch [regex]::Escape($old)) {
    Write-Host "Could not find the preload line - paste Moments.jsx back so I can fix it precisely." -ForegroundColor Red
    exit
}
$content = $content.Replace($old, $new)
[System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Moments.jsx updated: all 4 clips now fully preload once the section is in view, not just the centered one." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
