# Quick script to find your local IP address for testing on iPhone
# Run with: powershell -ExecutionPolicy Bypass -File get-ip.ps1

$IP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    ($_.InterfaceAlias -like "*Wi-Fi*" -or 
     $_.InterfaceAlias -like "*Ethernet*" -or 
     $_.InterfaceAlias -like "*WLAN*") -and
    $_.IPAddress -notlike "169.254.*"
} | Select-Object -First 1).IPAddress

if ($IP) {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "Your Local IP Address: $IP" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend URL: http://$IP:3000" -ForegroundColor Yellow
    Write-Host "Backend URL:  http://$IP:4000" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To test on iPhone:" -ForegroundColor White
    Write-Host "1. Make sure iPhone and computer are on the same Wi-Fi" -ForegroundColor Gray
    Write-Host "2. Open Safari on iPhone and go to: http://$IP:3000" -ForegroundColor Gray
    Write-Host "3. Use: npm run dev:network (in frontend folder) to allow network access" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "Could not find IP address. Make sure you're connected to Wi-Fi." -ForegroundColor Red
}













