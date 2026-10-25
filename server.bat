@echo off
title RouteHire Backend Server
echo ====================================================
echo        Starting RouteHire Backend Server
echo ====================================================
echo.
cd /d "%~dp0server"
if not exist node_modules (
    echo Installing node dependencies...
    cmd /c npm install
)
echo.
echo Launching Server on http://localhost:5000 ...
node server.js
pause