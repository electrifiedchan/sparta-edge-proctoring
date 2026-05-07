@echo off
title GitReal - Matrix Command Center                                   
color 0A
cls
echo.
echo  ========================================================
echo.
echo    ██████╗ ██╗████████╗██████╗ ███████╗ █████╗ ██╗
echo   ██╔════╝ ██║╚══██╔══╝██╔══██╗██╔════╝██╔══██╗██║
echo   ██║  ███╗██║   ██║   ██████╔╝█████╗  ███████║██║
echo   ██║   ██║██║   ██║   ██╔══██╗██╔══╝  ██╔══██║██║
echo   ╚██████╔╝██║   ██║   ██║  ██║███████╗██║  ██║███████╗
echo    ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
echo.
echo   M A T R I X   R E S U M E   V E R I F I C A T I O N
echo  ========================================================
echo.

echo  [SYSTEM CHECK] Cleaning up stale caches and legacy processes...
taskkill /FI "WINDOWTITLE eq GitReal*" /F >nul 2>&1
if exist "frontend\.next" rmdir /s /q "frontend\.next"

echo  [SYSTEM CHECK] Verifying components...
echo.

REM Check if backend venv exists
if not exist "backend\venv\Scripts\activate.bat" (
    echo  [ERROR] Backend virtual environment not found!
    echo  Please run: cd backend ^&^& python -m venv venv ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

REM Check if frontend node_modules exists
if not exist "frontend\node_modules" (
    echo  [ERROR] Frontend dependencies not found!
    echo  Please run: cd frontend ^&^& pnpm install
    echo.
    pause
    exit /b 1
)

REM Check if .env exists
if not exist "backend\.env" (
    echo  [WARNING] Backend .env file not found!
    echo  Please create backend\.env with your API keys
    echo.
    pause
)

echo  [OK] All components verified
echo.
echo  [1] Launching The Brain (Python Backend)...
echo      - Activating virtual environment
echo      - Starting FastAPI server explicitly on IPv4 (127.0.0.1:8000)
start "GitReal Backend" /D "%~dp0backend" cmd /k "call venv\Scripts\activate.bat && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo.
echo  [2] Launching The Face (Next.js Frontend)...
echo      - Starting Next.js dev server on port 3000
start "GitReal Frontend" /D "%~dp0frontend" cmd /k "pnpm dev"

echo.
timeout /t 10 /nobreak >nul

echo  [3] Launching Browser...
start http://localhost:3000

echo.
echo  ========================================================
echo   [SUCCESS] GitReal Systems Online
echo  ========================================================
echo.
echo   Backend API:  http://127.0.0.1:8000
echo   Frontend UI:  http://localhost:3000
echo   API Docs:     http://127.0.0.1:8000/docs
echo.
echo  ========================================================
echo   Press any key to close this window
echo   (Backend and Frontend will keep running)
echo  ========================================================
echo.
pause >nul
