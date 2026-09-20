# Run from inside dj-timkey-experience\
# Uses regex (with \s+ for flexible whitespace/line-wrap matching) rather than exact string match.

$edits = @(
    @{ file = ".\src\chapters\Merch.jsx"
       pattern = "merch\s*-\s*made for the people"
       replacement = "merch, made for the people" },
    @{ file = ".\src\chapters\Booking.jsx"
       pattern = "activations\s*-\s*reach out and he'll get\s+back to you directly"
       replacement = "activations. Reach out and he'll get back to you directly" },
    @{ file = ".\src\chapters\FAQ.jsx"
       pattern = "Dancehall\s*-\s*he plays whatever"
       replacement = "Dancehall, he plays whatever" },
    @{ file = ".\src\chapters\FAQ.jsx"
       pattern = "still ask\s*-\s*sometimes it works out"
       replacement = "still ask. Sometimes it works out" },
    @{ file = ".\src\chapters\FAQ.jsx"
       pattern = "on the night\s*-\s*he'll find a way"
       replacement = "on the night. He'll find a way" },
    @{ file = ".\src\chapters\Arrival.jsx"
       pattern = "Mr\. Beatnician</span>\s*-\s*hype master"
       replacement = "Mr. Beatnician</span>, hype master" },
    @{ file = ".\src\chapters\Arrival.jsx"
       pattern = "Dancehall\s*-\s*whatever the room needs"
       replacement = "Dancehall: whatever the room needs" },
    @{ file = ".\src\chapters\MeetTheBeatnician.jsx"
       pattern = "keeps it moving\s*-\s*that's the reputation"
       replacement = "keeps it moving. That's the reputation" }
)

foreach ($edit in $edits) {
    $content = Get-Content -Raw $edit.file
    if ($content -notmatch $edit.pattern) {
        Write-Host "SKIPPED ($($edit.file)): pattern '$($edit.pattern)' not found." -ForegroundColor Yellow
        continue
    }
    $content = $content -replace $edit.pattern, $edit.replacement
    [System.IO.File]::WriteAllText((Resolve-Path $edit.file), $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Fixed dash in: $($edit.file)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done. Any SKIPPED line means that text already changed - paste that file's current content back if so." -ForegroundColor Cyan
Write-Host "Next: npm run build" -ForegroundColor Cyan
