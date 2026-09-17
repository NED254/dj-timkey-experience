# Run from inside dj-timkey-experience\

@'
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
'@ | Set-Content -Path ".\vercel.json" -Encoding UTF8

Write-Host "vercel.json updated with the standard SPA catch-all rewrite." -ForegroundColor Green
