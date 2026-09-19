# Run from inside dj-timkey-experience\

# ---------- src/chapters/Ads.jsx: rewritten as a scrolling ticker fixed to the top ----------
@'
import { useEffect, useState } from "react"

export default function Ads() {
  const [ads, setAds] = useState([])

  useEffect(() => {
    fetch("/api/ads")
      .then((r) => r.json())
      .then((data) => setAds(data.ads || []))
      .catch(() => setAds([]))
  }, [])

  if (ads.length === 0) return null

  const items = [...ads, ...ads]

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-9 bg-zinc-950 border-b border-zinc-800 overflow-hidden flex items-center">
      <style>{`
        @keyframes ads-ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex items-center gap-10 whitespace-nowrap will-change-transform"
        style={{ animation: "ads-ticker-scroll 28s linear infinite" }}
      >
        {items.map((ad, i) => (
          <a
            key={i}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-xs uppercase tracking-wide transition-colors"
          >
            <span className="text-zinc-600">Sponsored</span>
            {ad.image && (
              <img src={ad.image} alt="" className="w-5 h-5 object-cover rounded-sm" />
            )}
            {ad.title && <span>{ad.title}</span>}
          </a>
        ))}
      </div>
    </div>
  )
}
'@ | Set-Content -Path ".\src\chapters\Ads.jsx" -Encoding UTF8

# ---------- src/components/Navbar.jsx: push down below the ticker ----------
$navPath = ".\src\components\Navbar.jsx"
$navContent = Get-Content -Raw $navPath
$old = 'className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"'
$new = 'className="fixed top-9 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"'

if ($navContent -notmatch [regex]::Escape($old)) {
    Write-Host "Could not find Navbar's className line - stopping without changes to Navbar.jsx." -ForegroundColor Red
} else {
    $navContent = $navContent.Replace($old, $new)
    [System.IO.File]::WriteAllText((Resolve-Path $navPath), $navContent, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Navbar.jsx updated: pushed down to sit below the new ticker." -ForegroundColor Green
}

# ---------- src/App.jsx: move <Ads /> to right after <Navbar />, remove from bottom ----------
$appPath = ".\src\App.jsx"
$appContent = Get-Content -Raw $appPath

$oldNav = '<Navbar />
      <ChapterErrorBoundary><Arrival /></ChapterErrorBoundary>'
$newNav = '<Navbar />
      <Ads />
      <ChapterErrorBoundary><Arrival /></ChapterErrorBoundary>'

$oldBottomAds = '      <ChapterErrorBoundary><Ads /></ChapterErrorBoundary>
'

if ($appContent -notmatch [regex]::Escape($oldNav)) {
    Write-Host "Could not find the Navbar/Arrival block in App.jsx - stopping without changes to App.jsx." -ForegroundColor Red
} elseif ($appContent -notmatch [regex]::Escape($oldBottomAds)) {
    Write-Host "Could not find the old bottom Ads line in App.jsx - stopping without changes to App.jsx." -ForegroundColor Red
} else {
    $appContent = $appContent.Replace($oldNav, $newNav)
    $appContent = $appContent.Replace($oldBottomAds, "")
    [System.IO.File]::WriteAllText((Resolve-Path $appPath), $appContent, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "App.jsx updated: Ads now renders as a fixed top ticker instead of a bottom section." -ForegroundColor Green
}

Write-Host "Next: npm run build" -ForegroundColor Cyan
