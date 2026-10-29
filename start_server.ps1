Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   HISTORICAL FOOTBALL SIMULATOR - ONE-CLICK LAUNCHER" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254*" } | Select-Object -First 1).IPAddress
Write-Host "[*] Launching game in default browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"
Write-Host "[*] PC Browser  : http://localhost:5173" -ForegroundColor Green
if ($localIp) {
    Write-Host "[*] Phone Access: http://$($localIp):5173 (Connected to same Wi-Fi)" -ForegroundColor Cyan
}
Write-Host "[*] Backend API : http://localhost:3001" -ForegroundColor Green
Write-Host ""
npm run dev

