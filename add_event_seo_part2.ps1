# Run from inside dj-timkey-experience\
# Injects Google structured data (JSON-LD) for events that have an exact date set.

$path = ".\src\chapters\Events.jsx"
$content = Get-Content -Raw $path

$oldEffect = @'
  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])
'@
$newEffect = @'
  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        const list = data.events || []
        setEvents(list)

        const withDates = list.filter((ev) => ev.isoDate)
        if (withDates.length > 0) {
          const jsonLd = withDates.map((ev) => ({
            "@context": "https://schema.org",
            "@type": "MusicEvent",
            name: `DJ Timkey at ${ev.venue}`,
            startDate: ev.isoDate,
            location: {
              "@type": "Place",
              name: ev.venue,
              address: ev.city || undefined,
            },
            performer: {
              "@type": "MusicGroup",
              name: "DJ Timkey",
            },
            url: "https://dj-timkey-experience.vercel.app/#events",
          }))

          let script = document.getElementById("events-jsonld")
          if (!script) {
            script = document.createElement("script")
            script.id = "events-jsonld"
            script.type = "application/ld+json"
            document.head.appendChild(script)
          }
          script.textContent = JSON.stringify(jsonLd)
        }
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])
'@

if ($content -notmatch [regex]::Escape($oldEffect)) {
    Write-Host "Could not find the events fetch block - stopping without changes." -ForegroundColor Red
    exit
}
$content = $content.Replace($oldEffect, $newEffect)
[System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Events.jsx updated: adds Google-readable structured data for any event with an exact date set." -ForegroundColor Green
Write-Host "Next: npm run build" -ForegroundColor Cyan
