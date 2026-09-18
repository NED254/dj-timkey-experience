# Run from inside dj-timkey-experience\

$path = ".\src\pages\Admin.jsx"
$content = Get-Content -Raw $path
$old = 'placeholder="Price (e.g. KES 1,500)"'
$new = 'placeholder="Price in KES, numbers only (e.g. 1500)"'

if ($content -notmatch [regex]::Escape($old)) {
    Write-Host "Could not find the expected text - no changes made. Paste Admin.jsx back if this happens." -ForegroundColor Red
} else {
    $content = $content.Replace($old, $new)
    [System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Admin.jsx price field wording updated to match Merch.jsx's KES-prefix display." -ForegroundColor Green
}
