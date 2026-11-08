@echo off
for /f "tokens=5" %%P in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /PID %%P /F >nul 2>&1
 echo Nikah backend stopped.
 pause
