@echo off
echo ===================================================
echo   MechNova - Direct Vercel Deployment (No GitHub)
echo ===================================================
echo.

set "PATH=%~dp0tools\node-v20.18.0-win-x64;%PATH%"

cd "%~dp0frontend"

echo [1/3] Checking Vercel Login...
echo Browser khulega, wahan Continue with Google/Email par click karein.
echo.
call npx vercel login
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Login complete nahi hua. Kripya dobara try karein.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Building frontend for production...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Deploying directly to Vercel...
call npx vercel --prod

echo.
echo ===================================================
echo Deployment Process Finished!
echo ===================================================
pause
