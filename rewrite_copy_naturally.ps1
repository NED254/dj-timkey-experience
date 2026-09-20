# Run from inside dj-timkey-experience\

$edits = @(
    @{ file = ".\src\chapters\Sound.jsx"
       old = "No single genre defines a night - Timkey moves through all of these live, reading the`n              crowd and blending as he goes."
       new = "He doesn't stick to one genre for a whole night. Same set can go from Afrobeats to`n              House depending on what the crowd's doing." },
    @{ file = ".\src\chapters\Gallery.jsx"
       old = "Moments that speak louder than words - a look at Timkey in action across clubs, campuses,`n          and brand activations."
       new = "Some shots from clubs, campuses, and brand events he's played." },
    @{ file = ".\src\chapters\Merch.jsx"
       old = "Wear the brand. Official DJ Timkey merch, made for the crowd."
       new = "Official DJ Timkey merch - made for the people who actually show up to the sets." },
    @{ file = ".\src\chapters\Booking.jsx"
       old = "Clubs, corporate functions, campus events, brand activations - reach out directly and`n          Timkey will get back to you."
       new = "Clubs, corporate events, campus functions, brand activations - reach out and he'll get`n          back to you directly." },
    @{ file = ".\src\chapters\Arrival.jsx"
       old = "Scroll to enter the experience"
       new = "Scroll down" }
)

foreach ($edit in $edits) {
    $content = Get-Content -Raw $edit.file
    if ($content -notmatch [regex]::Escape($edit.old)) {
        Write-Host "SKIPPED ($($edit.file)): exact text not found - no change made there." -ForegroundColor Yellow
        continue
    }
    $content = $content.Replace($edit.old, $edit.new)
    [System.IO.File]::WriteAllText((Resolve-Path $edit.file), $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Updated: $($edit.file)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done. Any file marked SKIPPED needs its exact current text pasted back so I can retry that one precisely." -ForegroundColor Cyan
Write-Host "Next: npm run build" -ForegroundColor Cyan
