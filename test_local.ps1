# Test the API locally before deploying

Write-Host "Testing API Setup..." -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\kriti\OneDrive\Desktop\guviPS"
Set-Location $projectPath

# Check if Node.js is installed
Write-Host "[1/3] Checking Node.js..." -ForegroundColor Yellow
$nodeExists = Get-Command node -ErrorAction SilentlyContinue

if ($nodeExists) {
    $nodeVersion = node --version
    Write-Host "  Node.js $nodeVersion found!" -ForegroundColor Green
} else {
    Write-Host "  Node.js not found!" -ForegroundColor Red
    Write-Host "  Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

# Install dependencies
Write-Host ""
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "  Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Test server
Write-Host ""
Write-Host "[3/3] Starting test server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Server will start on: http://localhost:3000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test URLs:" -ForegroundColor Yellow
Write-Host "  - http://localhost:3000/signup.html" -ForegroundColor Cyan
Write-Host "  - http://localhost:3000/login.html" -ForegroundColor Cyan
Write-Host "  - http://localhost:3000/profile.html" -ForegroundColor Cyan
Write-Host "  - http://localhost:3000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start server
node api/index.js
