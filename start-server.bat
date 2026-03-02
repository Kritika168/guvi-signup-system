@echo off
cls
echo ========================================
echo   GUVI Project - Local Development
echo ========================================
echo.
echo Starting server on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
node api/index.js

pause
