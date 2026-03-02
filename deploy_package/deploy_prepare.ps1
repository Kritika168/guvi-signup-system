# Simple Deployment Preparation Script

Write-Host "GUVI Project - Deployment Preparation" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\kriti\OneDrive\Desktop\guviPS"
$deployPath = "$projectPath\deploy_package"

# Check Composer
Write-Host "Step 1: Checking Composer..." -ForegroundColor Yellow
$composerExists = Get-Command composer -ErrorAction SilentlyContinue

if ($composerExists) {
    Write-Host "  Composer found! Installing dependencies..." -ForegroundColor Green
    Set-Location $projectPath
    composer install 2>&1 | Out-Null
    if (Test-Path "$projectPath\vendor") {
        Write-Host "  Dependencies installed!" -ForegroundColor Green
    }
} else {
    Write-Host "  Composer not found. You'll need to install it:" -ForegroundColor Yellow
    Write-Host "  https://getcomposer.org" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Step 2: Creating deployment package..." -ForegroundColor Yellow

# Clean old package
if (Test-Path $deployPath) {
    Remove-Item $deployPath -Recurse -Force
}

# Create new package
New-Item -ItemType Directory -Path $deployPath -Force | Out-Null

# Copy all files except unwanted ones
$exclude = @("deploy_package", ".git", "node_modules", "prepare_deployment.ps1")
Get-ChildItem $projectPath | Where-Object { $exclude -notcontains $_.Name } | Copy-Item -Destination $deployPath -Recurse -Force

Write-Host "  Package created at: $deployPath" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Creating checklist..." -ForegroundColor Yellow

$checklist = @"
================================================================================
GUVI PROJECT - DEPLOYMENT CHECKLIST
================================================================================

Your deployment package is ready at:
$deployPath

NEXT STEPS:
-----------

1. Choose FREE hosting:
   - InfinityFree: https://infinityfree.net
   - 000webhost: https://www.000webhost.com
   - Replit: https://replit.com

2. Upload all files from deploy_package folder

3. Setup MySQL Database:
   - Create database in hosting panel
   - Import sql/schema.sql
   - Update php/config/mysql_config.php with credentials

4. Setup MongoDB Atlas (FREE):
   - Sign up: https://www.mongodb.com/cloud/atlas/register
   - Create M0 Free cluster
   - Get connection string
   - Update php/config/mongodb_config.php

5. Setup Redis Cloud (FREE):
   - Sign up: https://redis.com/try-free/
   - Create free database
   - Get host, port, password
   - Update php/config/redis_config.php

6. Test your site:
   - Visit your live URL/signup.html
   - Test registration and login

================================================================================
DOCUMENTATION FILES:
================================================================================

- QUICKSTART.md  : Quick deployment guide
- DEPLOYMENT.md  : Detailed instructions
- README.md      : Full documentation

================================================================================
Estimated Time: 30-45 minutes | Cost: FREE
================================================================================
"@

$checklist | Out-File "$deployPath\DEPLOYMENT_CHECKLIST.txt" -Encoding UTF8

Write-Host "  Checklist saved!" -ForegroundColor Green

Write-Host ""
Write-Host "===================================" -ForegroundColor Green
Write-Host "  PREPARATION COMPLETE!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Read QUICKSTART.md for deployment instructions" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opening deployment folder..." -ForegroundColor Cyan

# Open folder
Start-Process explorer.exe $deployPath

Write-Host ""
Write-Host "Done! Good luck with your internship application!" -ForegroundColor Green
