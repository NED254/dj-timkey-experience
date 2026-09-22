# Run from inside dj-timkey-experience\
# Adds an optional "exact date" field to events, used only for Google structured data.

$path = ".\src\pages\Admin.jsx"
$content = Get-Content -Raw $path

$old = @'
            <input placeholder="Status (e.g. Tickets open)" value={ev.status} onChange={(e) => updateEvent(i, "status", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <button onClick={() => removeEvent(i)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2">Remove</button>
          </div>
          <input placeholder="Booking / ticket link (optional)" value={ev.link || ""} onChange={(e) => updateEvent(i, "link", e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
'@
$new = @'
            <input placeholder="Status (e.g. Tickets open)" value={ev.status} onChange={(e) => updateEvent(i, "status", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            <button onClick={() => removeEvent(i)} className="text-red-400 hover:text-red-300 text-sm font-semibold px-3 py-2">Remove</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 text-xs">Exact date (for Google search results, optional)</label>
              <input type="date" value={ev.isoDate || ""} onChange={(e) => updateEvent(i, "isoDate", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <input placeholder="Booking / ticket link (optional)" value={ev.link || ""} onChange={(e) => updateEvent(i, "link", e.target.value)} className="bg-zinc-800 border border-zinc-700 rounded-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 self-end" />
          </div>
'@

if ($content -notmatch [regex]::Escape($old)) {
    Write-Host "Could not find the events form block - stopping without changes." -ForegroundColor Red
    exit
}
$content = $content.Replace($old, $new)
[System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Admin.jsx updated: events now have an optional exact-date field." -ForegroundColor Green

# Also update BLANK_EVENT so new events include the field
$old2 = 'const BLANK_EVENT = { date: "", venue: "", city: "", status: "", image: "", link: "" }'
$new2 = 'const BLANK_EVENT = { date: "", venue: "", city: "", status: "", image: "", link: "", isoDate: "" }'
$content2 = Get-Content -Raw $path
if ($content2 -match [regex]::Escape($old2)) {
    $content2 = $content2.Replace($old2, $new2)
    [System.IO.File]::WriteAllText((Resolve-Path $path), $content2, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "BLANK_EVENT updated to include isoDate." -ForegroundColor Green
} else {
    Write-Host "Could not find BLANK_EVENT line - new events may not include isoDate by default (not critical, field still works once typed)." -ForegroundColor Yellow
}

Write-Host "Next: run part 2 (structured data injection in Events.jsx)" -ForegroundColor Cyan
