# Run from inside dj-timkey-experience\

npm install @vercel/analytics

$path = ".\src\App.jsx"
$content = Get-Content -Raw $path

$oldImport = "import Admin from './pages/Admin'"
$newImport = "import Admin from './pages/Admin'
import { Analytics } from '@vercel/analytics/react'"

$oldClosing = "      <FloatingWhatsApp />
      <footer"
$newClosing = "      <FloatingWhatsApp />
      <Analytics />
      <footer"

if ($content -notmatch [regex]::Escape($oldImport)) {
    Write-Host "Could not find the Admin import line - stopping without changes." -ForegroundColor Red
    exit
}
if ($content -notmatch [regex]::Escape($oldClosing)) {
    Write-Host "Could not find the FloatingWhatsApp/footer block - stopping without changes." -ForegroundColor Red
    exit
}

$content = $content.Replace($oldImport, $newImport)
$content = $content.Replace($oldClosing, $newClosing)
[System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))

Write-Host "App.jsx updated: Vercel Analytics is now tracking page views." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
