# Run from inside dj-timkey-experience\

$path = ".\src\pages\Admin.jsx"
$content = Get-Content -Raw $path

$old1 = 'return upload(resized.name, resized, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({ password }),
    onUploadProgress: (p) => onProgress(Math.round(p.percentage)),
  })'
$new1 = 'return upload(resized.name, resized, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({ password }),
    addRandomSuffix: true,
    onUploadProgress: (p) => onProgress(Math.round(p.percentage)),
  })'

$old2 = 'return upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({ password }),
    onUploadProgress: (p) => onProgress(Math.round(p.percentage)),
  })'
$new2 = 'return upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: JSON.stringify({ password }),
    addRandomSuffix: true,
    onUploadProgress: (p) => onProgress(Math.round(p.percentage)),
  })'

$missing = @()
if ($content -notmatch [regex]::Escape($old1)) { $missing += "image upload block" }
if ($content -notmatch [regex]::Escape($old2)) { $missing += "video upload block" }

if ($missing.Count -gt 0) {
    Write-Host "Could not find: $($missing -join ', ') - no changes made. Paste Admin.jsx back if this happens." -ForegroundColor Red
} else {
    $content = $content.Replace($old1, $new1).Replace($old2, $new2)
    [System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Fixed: uploads now always get a unique filename, no more 'blob already exists' errors." -ForegroundColor Green
}
