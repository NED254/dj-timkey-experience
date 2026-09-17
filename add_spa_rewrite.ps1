# Run from inside dj-timkey-experience\

@'
{
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
'@ | Set-Content -Path ".\vercel.json" -Encoding UTF8

Write-Host "vercel.json created with SPA rewrite (excludes /api routes)." -ForegroundColor Green
