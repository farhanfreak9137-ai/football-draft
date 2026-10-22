Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   HISTORICAL FOOTBALL SIMULATOR - ONE-CLICK LAUNCHER" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[*] Launching game in default browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"
Write-Host "[*] Starting Backend (http://localhost:3001) and Frontend (http://localhost:5173)..." -ForegroundColor Green
npm run dev
