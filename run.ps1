# MechNova PowerShell Launcher
$toolsNode = Join-Path $PSScriptRoot "tools\node-v20.18.0-win-x64"
if (Test-Path $toolsNode) {
    $env:PATH = "$toolsNode;" + $env:PATH
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "MechNova – Intelligent Mechanical Assistant" -ForegroundColor White
Write-Host "તમારો સ્માર્ટ મિકેનિકલ સહાયક" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

Write-Host "[1/2] Starting Python FastAPI Backend at http://127.0.0.1:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/2] Starting Vite Frontend at http://localhost:5173..." -ForegroundColor Green
Set-Location (Join-Path $PSScriptRoot "frontend")
npm run dev
