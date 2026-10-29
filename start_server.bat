@echo off
title Historical Football Simulator
cd /d "%~dp0"

echo ========================================================
echo   HISTORICAL FOOTBALL SIMULATOR - ONE-CLICK LAUNCHER
echo ========================================================
echo.
echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please install Node.js from https://nodejs.org/ and retry.
    echo.
    pause
    exit /b 1
)

echo [2/3] Preparing game services...
echo       - Backend Express API : http://localhost:3001
echo       - Frontend Web Client : http://localhost:5173
echo       - Phone (Same Wi-Fi)  : http://192.168.1.106:5173
echo.
echo [3/3] Starting servers and opening game in browser...
echo.

:: Automatically open browser once servers start up
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"

:: Launch both Backend and Frontend concurrently
call npm.cmd run dev

if %errorlevel% neq 0 (
    echo.
    echo [INFO] Server process ended.
    pause
)

