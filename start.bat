@echo off
title S.P.A.R.T.A. - Matrix Command Center
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
echo   S.P.A.R.T.A.   R E S U M E   V E R I F I C A T I O N
echo  ========================================================
echo.

echo  [SYSTEM CHECK] Cleaning up legacy processes and stale cache...
taskkill /FI "WINDOWTITLE eq S.P.A.R.T.A.*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq GitReal*" /F >nul 2>&1
if exist "frontend\.next\dev\cache" rmdir /s /q "frontend\.next\dev\cache" >nul 2>&1

echo  [SYSTEM CHECK] Verifying components...
echo.

REM 1. Check & Setup Backend Virtual Environment
if not exist "backend\venv\Scripts\activate.bat" (
    echo  [SETUP] Creating Python Virtual Environment in backend...
    cd backend
    python -m venv venv
    call venv\Scripts\activate.bat
    echo  [SETUP] Installing Python dependencies...
    python -m pip install -r requirements.txt
    cd ..
)

REM 2. Check & Setup Frontend Node Modules
if not exist "frontend\node_modules" (
    echo  [SETUP] Installing Frontend dependencies...
    cd frontend
    cmd /c "pnpm install || npm install"
    cd ..
)

REM 3. Check Backend Environment File
if not exist "backend\.env" (
    echo  [WARNING] backend\.env not found. Creating placeholder...
    echo GROQ_API_KEY="" > backend\.env
    echo DEEPGRAM_API_KEY="" >> backend\.env
    echo NVIDIA_API_KEY="" >> backend\.env
    echo GITHUB_TOKEN="" >> backend\.env
)

REM 4. Check Frontend Environment File
if not exist "frontend\.env.local" (
    echo  [WARNING] frontend\.env.local not found. Creating placeholder...
    echo DEEPGRAM_API_KEY="" > frontend\.env.local
)

echo  [OK] All components verified successfully!
echo.

echo  [1/3] Launching Backend Server (FastAPI + Uvicorn)...
echo      - Target: http://127.0.0.1:8000
start "S.P.A.R.T.A. Backend" /D "%~dp0backend" cmd /k "call venv\Scripts\activate.bat && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

echo  [2/3] Waiting for Backend initialization...
timeout /t 4 /nobreak >nul

echo.
echo  [3/3] Launching Frontend Server (Next.js)...
echo      - Target: http://localhost:3000
start "S.P.A.R.T.A. Frontend" /D "%~dp0frontend" cmd /k "pnpm dev || npm run dev"

echo.
echo  [SYSTEM] Opening S.P.A.R.T.A. in your default web browser...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo  ========================================================
echo   [SUCCESS] S.P.A.R.T.A. Systems Online
echo  ========================================================
echo.
echo   Backend API:  http://127.0.0.1:8000
echo   Frontend UI:  http://localhost:3000
echo   API Docs:     http://127.0.0.1:8000/docs
echo.
echo  ========================================================
echo   Press any key to close this control window
echo   (Backend and Frontend servers will remain running)
echo  ========================================================
echo.
pause >nul
