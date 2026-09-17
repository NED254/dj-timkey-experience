# Run from inside dj-timkey-experience\
# Checks how the LIVE Vercel site is actually serving each video file.

Write-Host "=== vercel.json (routing config) ===" -ForegroundColor Yellow
if (Test-Path .\vercel.json) {
    Get-Content .\vercel.json
} else {
    Write-Host "(no vercel.json found - Vercel is using default static handling)"
}

Write-Host ""
Write-Host "=== Checking each video on the live site ===" -ForegroundColor Yellow

$baseUrl = "https://dj-timkey-experience.vercel.app"
$videos = @(
    "/videos/beatnician-bg.mp4",
    "/videos/booking-bg.mp4",
    "/videos/citizen-tv.mp4",
    "/videos/freshers-night.mp4",
    "/videos/intro-logo.mp4",
    "/videos/mix-1-tirries-tuesday.mp4",
    "/videos/mix-2-soniq-ep5.mp4",
    "/videos/mix-3-soniq-java-b.mp4",
    "/videos/sound-bg.mp4",
    "/videos/university-festival.mp4",
    "/videos/weekend-club-tour.mp4"
)

foreach ($path in $videos) {
    $url = "$baseUrl$path"
    try {
        $resp = Invoke-WebRequest -Uri $url -Method Head -UseBasicParsing -TimeoutSec 15
        $contentType = $resp.Headers["Content-Type"]
        $contentLength = $resp.Headers["Content-Length"]
        $acceptRanges = $resp.Headers["Accept-Ranges"]
        $cacheControl = $resp.Headers["Cache-Control"]

        $flag = ""
        if ($contentType -notmatch "video") { $flag = "  <-- WRONG CONTENT-TYPE, likely being intercepted" }

        Write-Host "$path" -ForegroundColor Cyan
        Write-Host "  Status: $($resp.StatusCode)  Content-Type: $contentType$flag"
        Write-Host "  Content-Length: $contentLength   Accept-Ranges: $acceptRanges   Cache-Control: $cacheControl"
    } catch {
        Write-Host "$path" -ForegroundColor Red
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}
