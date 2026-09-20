# Run from inside dj-timkey-experience\

$path = ".\src\chapters\MeetTheBeatnician.jsx"
$content = Get-Content -Raw $path

$old = @'
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
'@
$new = @'
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-950/75 via-zinc-950/35 to-transparent" />
'@

if ($content -notmatch [regex]::Escape($old)) {
    Write-Host "Could not find the current gradient block - pasting the file's current content is needed to proceed precisely." -ForegroundColor Red
    exit
}
$content = $content.Replace($old, $new)
[System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Overlay lightened further, and the second (top) darkening layer removed entirely." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
