# Run from inside dj-timkey-experience\

$path = ".\src\pages\Admin.jsx"
$content = Get-Content -Raw $path
$old = 'const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd"'
$new = 'const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd"'

if ($content -notmatch [regex]::Escape($old)) {
    Write-Host "Could not find the CDN line - no changes made." -ForegroundColor Red
} else {
    $content = $content.Replace($old, $new)
    [System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Switched ffmpeg trimmer download from unpkg to jsdelivr." -ForegroundColor Green
}
