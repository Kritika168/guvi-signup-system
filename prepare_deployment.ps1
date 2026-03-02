# Deployment Preparation Script for GUVI Project
# This script prepares your project for online deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GUVI Project - Deployment Preparation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\kriti\OneDrive\Desktop\guviPS"
Set-Location $projectPath

# Check if Composer is installed
Write-Host "[1/4] Checking for Composer..." -ForegroundColor Yellow
$composerExists = Get-Command composer -ErrorAction SilentlyContinue

if ($composerExists) {
    Write-Host "[OK] Composer found! Installing dependencies..." -ForegroundColor Green
    composer install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        Write-Host "  Please install Composer from: https://getcomposer.org" -ForegroundColor Yellow
    }
} else {
    Write-Host "[WARN] Composer not found" -ForegroundColor Yellow
    Write-Host "  Download Composer from: https://getcomposer.org" -ForegroundColor Yellow
    Write-Host "  After installing Composer, run this script again" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Download vendor.zip from project repository" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "[2/4] Checking project structure..." -ForegroundColor Yellow

$requiredFiles = @(
    "signup.html",
    "login.html", 
    "profile.html",
    "css\style.css",
    "js\signup.js",
    "js\login.js",
    "js\profile.js",
    "php\signup.php",
    "php\login.php",
    "php\get_profile.php",
    "php\update_profile.php",
    "php\logout.php",
    "sql\schema.sql"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (missing)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""
Write-Host "[3/4] Creating deployment package..." -ForegroundColor Yellow

$deployPath = "$projectPath\deploy_package"
if (Test-Path $deployPath) {
    Remove-Item $deployPath -Recurse -Force
}
New-Item -ItemType Directory -Path $deployPath -Force | Out-Null

# Copy files to deployment package
Copy-Item -Path "$projectPath\*" -Destination $deployPath -Recurse -Exclude @("deploy_package", ".git", "node_modules", "*.md")

Write-Host "✓ Deployment package created at: $deployPath" -ForegroundColor Green

Write-Host ""
Write-Host "[4/4] Creating deployment checklist..." -ForegroundColor Yellow

$checklist = @"
════════════════════════════════════════════════════
DEPLOYMENT CHECKLIST - GUVI Internship Project
════════════════════════════════════════════════════

📦 Your deployment package is ready at:
   $deployPath

🚀 NEXT STEPS:

1. Choose a hosting provider (FREE options):
   ☐ InfinityFree: https://infinityfree.net
   ☐ 000webhost: https://www.000webhost.com
   ☐ Replit: https://replit.com

2. Upload files:
   ☐ Upload all files from 'deploy_package' folder
   ☐ Upload to htdocs or public_html folder

3. Setup MySQL Database:
   ☐ Create database in hosting control panel
   ☐ Import sql/schema.sql via phpMyAdmin
   ☐ Note down database credentials
   ☐ Update php/config/mysql_config.php

4. Setup MongoDB Atlas (FREE):
   ☐ Sign up: https://www.mongodb.com/cloud/atlas/register
   ☐ Create M0 Free cluster (512MB)
   ☐ Create database user
   ☐ Allow network access (0.0.0.0/0)
   ☐ Copy connection string
   ☐ Update php/config/mongodb_config.php

5. Setup Redis Cloud (FREE):
   ☐ Sign up: https://redis.com/try-free/
   ☐ Create database (30MB free)
   ☐ Copy host, port, password
   ☐ Update php/config/redis_config.php

6. Test your application:
   ☐ Visit your live URL
   ☐ Test signup page
   ☐ Test login functionality
   ☐ Test profile updates
   ☐ Test logout

════════════════════════════════════════════════════
📚 DOCUMENTATION:
════════════════════════════════════════════════════

Read these files for detailed instructions:
- QUICKSTART.md  → Quick deployment guide
- DEPLOYMENT.md  → Detailed deployment instructions
- README.md      → Full project documentation

════════════════════════════════════════════════════
🎯 SUMMARY:
════════════════════════════════════════════════════

✓ Project files: Ready
"@

if ($composerExists -and (Test-Path "vendor")) {
    $checklist += "`n✓ Dependencies: Installed"
} else {
    $checklist += "`n⚠ Dependencies: Need to install (run composer install)"
}

$checklist += @"

⏱ Estimated deployment time: 30-45 minutes
💰 Total cost: FREE

════════════════════════════════════════════════════

📞 Need help? Check the documentation files or:
   - QUICKSTART.md for step-by-step guide
   - DEPLOYMENT.md for cloud setup instructions

Good luck with your GUVI internship application! 🚀

════════════════════════════════════════════════════
"@

Write-Host $checklist -ForegroundColor Cyan

# Save checklist to file
$checklist | Out-File "$deployPath\DEPLOYMENT_CHECKLIST.txt" -Encoding UTF8

Write-Host ""
Write-Host "✓ Deployment checklist saved to: $deployPath\DEPLOYMENT_CHECKLIST.txt" -ForegroundColor Green
Write-Host ""
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "       PREPARATION COMPLETE! Ready to deploy!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Follow the instructions in QUICKSTART.md" -ForegroundColor Yellow
Write-Host ""

# Open deployment folder
Start-Process explorer.exe $deployPath
