# Run from inside dj-timkey-experience\ (same folder as package.json)

@'
{
  "headers": [
    {
      "source": "/videos/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
'@ | Set-Content -Path ".\vercel.json" -Encoding UTF8

Write-Host "vercel.json created with immutable long-term caching for videos and images." -ForegroundColor Green
Write-Host "Next: git add -A, commit, push. This only helps after a fresh deploy + a new visit (not the current cached-but-still-revalidating state)." -ForegroundColor Cyan
