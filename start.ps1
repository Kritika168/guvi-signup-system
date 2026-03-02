Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  🚀 GUVI User Registration - Quick Start" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

$projectPath = "C:\Users\kriti\OneDrive\Desktop\guviPS"
Set-Location $projectPath

# Check Node.js
Write-Host "[1/4] Checking Node.js..." -ForegroundColor Yellow
$nodeExists = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeExists) {
    Write-Host "  ✗ Node.js not found!" -ForegroundColor Red
    Write-Host "  Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "`nPress Enter to exit"
    exit
}

$nodeVersion = node --version
Write-Host "  ✓ Node.js $nodeVersion found!" -ForegroundColor Green

# Install dependencies
Write-Host "`n[2/4] Installing dependencies..." -ForegroundColor Yellow
npm install --silent 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to install dependencies" -ForegroundColor Red
    Read-Host "`nPress Enter to exit"
    exit
}

# Test database connections
Write-Host "`n[3/4] Testing database connections..." -ForegroundColor Yellow

Write-Host "  • Testing MySQL..." -NoNewline
node test_mysql_direct.js 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ✗" -ForegroundColor Red
}

Write-Host "  • Testing MongoDB..." -NoNewline
node test_mongodb.js 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ✗" -ForegroundColor Red
}

Write-Host "  • Testing Redis..." -NoNewline
node test_redis.js 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ✗" -ForegroundColor Red
}

# Start server
Write-Host "`n[4/4] Starting server..." -ForegroundColor Yellow
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Server starting on: http://localhost:3000" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📋 Available Pages:" -ForegroundColor Yellow
Write-Host "  • Signup:  http://localhost:3000/signup.html" -ForegroundColor Cyan
Write-Host "  • Login:   http://localhost:3000/login.html" -ForegroundColor Cyan
Write-Host "  • Profile: http://localhost:3000/profile.html" -ForegroundColor Cyan

Write-Host "`n✓ All systems ready!" -ForegroundColor Green
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Yellow

node server.js
