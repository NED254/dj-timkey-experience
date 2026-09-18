# Run this in a NEW PowerShell window (not necessarily inside your project folder)

Write-Host "Restarting OneDrive..." -ForegroundColor Cyan
Get-Process -Name "OneDrive" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Start-Process "$env:LOCALAPPDATA\Microsoft\OneDrive\OneDrive.exe"

Write-Host "Restarting Phone Link (Your Phone)..." -ForegroundColor Cyan
Get-Process -Name "PhoneExperienceHost","YourPhone" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Start-Process "shell:AppsFolder\Microsoft.YourPhone_8wekyb3d8bbwe!App"

Write-Host ""
Write-Host "Done. Give it 15-30 seconds to reconnect, then try the photo upload again." -ForegroundColor Green
Write-Host "If it still fails on the same photo, that specific file may not be readable this way - try a different photo instead." -ForegroundColor Yellow
