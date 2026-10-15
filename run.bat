@echo off
echo ===================================================
echo Starting MechNova - Intelligent Mechanical Assistant
echo Tagline: tamaro smart mechanical sahayak
echo ===================================================

set "PATH=%~dp0tools\node-v20.18.0-win-x64;%PATH%"

echo [1/2] Launching Python FastAPI Backend on http://127.0.0.1:8000 ...
start "MechNova Backend" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Vite Frontend on http://localhost:5173 ...
cd "%~dp0frontend"
npm run dev
