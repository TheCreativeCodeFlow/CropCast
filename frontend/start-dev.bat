@echo off
echo Starting CropCast Agricultural Platform...
echo.

echo [1/3] Starting MongoDB...
start "MongoDB" mongod

echo [2/3] Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

echo [3/3] Starting Frontend Development Server...
timeout /t 3 >nul
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo CropCast Platform is starting up...
echo ========================================
echo Backend API: http://localhost:5000/api
echo Frontend App: http://localhost:5173
echo ========================================
echo.
echo Press any key to close this window...
pause >nul