# Parental Control App Startup Script
Write-Host "Starting Parental Control App..." -ForegroundColor Green

# Kill any existing Node processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
taskkill /f /im node.exe 2>$null

# Wait a moment
Start-Sleep -Seconds 2

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev; Read-Host 'Press Enter to close'"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "Starting frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\web'; npm run dev; Read-Host 'Press Enter to close'"

Write-Host "Both servers should be starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:4000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
