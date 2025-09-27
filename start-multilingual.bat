@echo off
echo 🌾 Starting CropCast Multilingual Platform
echo ==========================================
echo.
echo Starting Backend Server on port 5000...
echo Starting Frontend Server on port 5173...
echo.
echo Backend API: http://localhost:5000/api
echo Frontend App: http://localhost:5173
echo Multilingual Demo: http://localhost:5173/multilingual
echo Translation Demo: http://localhost:5173/translation-demo
echo.

REM Kill any existing node processes
taskkill /F /IM node.exe >nul 2>&1

REM Start backend server in background
cd /d "%~dp0backend"
start "CropCast Backend" cmd /k "echo Backend Server Starting... && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
cd /d "%~dp0frontend"
echo Frontend Server Starting...
npm run dev

pause