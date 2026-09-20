# Run from inside dj-timkey-experience\

$edits = @(
    @{ file = ".\src\chapters\Booking.jsx"
       pattern = "Message sent\s*-\s*Timkey will get back to you soon"
       replacement = "Message sent. Timkey will get back to you soon" },
    @{ file = ".\src\chapters\Booking.jsx"
       pattern = "New booking request\s*-\s*DJ Timkey site"
       replacement = "New booking request from DJ Timkey site" },
    @{ file = ".\src\chapters\Gallery.jsx"
       pattern = '\$\{title\} - photo gallery by \$\{credit\}'
       replacement = '${title}, photo gallery by ${credit}' }
)

foreach ($edit in $edits) {
    $content = Get-Content -Raw $edit.file
    if ($content -notmatch $edit.pattern) {
        Write-Host "SKIPPED ($($edit.file)): pattern not found - '$($edit.pattern)'" -ForegroundColor Yellow
        continue
    }
    $content = $content -replace $edit.pattern, $edit.replacement
    [System.IO.File]::WriteAllText((Resolve-Path $edit.file), $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Fixed: $($edit.file)" -ForegroundColor Green
}

# Replace the "- ${session.date}" separator with a middle dot in Gallery.jsx (3 occurrences)
$galleryPath = ".\src\chapters\Gallery.jsx"
$galleryContent = Get-Content -Raw $galleryPath
$before = ($galleryContent | Select-String -Pattern '- \$\{session\.date\}' -AllMatches).Matches.Count
$galleryContent = $galleryContent -replace '- \$\{session\.date\}', '&bull; ${session.date}'
[System.IO.File]::WriteAllText((Resolve-Path $galleryPath), $galleryContent, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Replaced $before date-separator dash(es) with a bullet in Gallery.jsx" -ForegroundColor Green

Write-Host ""
Write-Host "Note: mix titles like 'Tirries Tuesday - Old Skool Edition' were left untouched - those are real mix names, not prose I wrote." -ForegroundColor Cyan
Write-Host "Next: npm run build" -ForegroundColor Cyan
