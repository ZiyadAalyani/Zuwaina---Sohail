@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js LTS first.
  pause
  exit /b 1
)
start "Nikah Backend" /min cmd /c "cd /d \"%~dp0\" && node local-server.js"
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
echo Nikah backend started in a separate background window.
echo You can close this launcher window; keep the small server window running.
exit /b 0
