# Run from inside dj-timkey-experience\
# Re-muxes every top-level video in public\videos with +faststart.
# -c copy means no re-encoding: same quality, same size, just reordered for streaming.

$videos = Get-ChildItem .\public\videos -Filter *.mp4 -File

foreach ($v in $videos) {
    $tmp = "$($v.FullName).faststart.mp4"
    Write-Host "Fixing: $($v.Name)" -ForegroundColor Cyan
    ffmpeg -y -i $v.FullName -c copy -movflags +faststart $tmp -loglevel error

    if (Test-Path $tmp) {
        $originalSize = (Get-Item $v.FullName).Length
        $newSize = (Get-Item $tmp).Length
        if ($newSize -gt 0) {
            Move-Item -Force $tmp $v.FullName
            Write-Host "  OK ($originalSize -> $newSize bytes)" -ForegroundColor Green
        } else {
            Write-Host "  FAILED - output was empty, original left untouched" -ForegroundColor Red
            Remove-Item $tmp -ErrorAction SilentlyContinue
        }
    } else {
        Write-Host "  FAILED - ffmpeg did not produce output for $($v.Name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done. Next: npm run build, then check locally before pushing." -ForegroundColor Yellow
