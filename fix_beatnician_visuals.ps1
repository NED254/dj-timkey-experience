# Run from inside dj-timkey-experience\

$path = ".\src\chapters\MeetTheBeatnician.jsx"
$content = Get-Content -Raw $path

# 1. Remove the border box + corner brackets around the portrait image
$oldFrame = @'
            <div className="absolute -inset-px border border-blue-500/40 rounded-sm pointer-events-none" />
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-blue-500" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-blue-500" />
'@

if ($content -notmatch [regex]::Escape($oldFrame)) {
    Write-Host "Could not find the image frame block - stopping without changes." -ForegroundColor Red
    exit
}
$content = $content.Replace($oldFrame, "")

# 2. Lighten the dark gradient overlays so the background video shows through more
$oldGradients = @'
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/60" />
'@
$newGradients = @'
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
'@

if ($content -notmatch [regex]::Escape($oldGradients)) {
    Write-Host "Could not find the gradient overlay block - stopping without changes to that part." -ForegroundColor Red
} else {
    $content = $content.Replace($oldGradients, $newGradients)
}

[System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "MeetTheBeatnician.jsx updated: removed image frame, lightened overlay so video shows through more." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
