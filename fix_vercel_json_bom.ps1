# Run from inside dj-timkey-experience\

$content = '{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}'

[System.IO.File]::WriteAllText("$PWD\vercel.json", $content, (New-Object System.Text.UTF8Encoding $false))

Write-Host "vercel.json rewritten without BOM." -ForegroundColor Green
Write-Host "Verifying content:" -ForegroundColor Cyan
Get-Content .\vercel.json
