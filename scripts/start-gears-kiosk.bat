@echo off
title GEARS GYM - Lanzador Kiosco & Servidor Local
chcp 65001 >nul

:: Cambiar al directorio raíz del proyecto (un nivel arriba de /scripts)
cd /d "%~dp0.."

echo ========================================================
echo 💀 INICIANDO SISTEMA GEARS GYM (OFFLINE-FIRST KIOSK) 💀
echo ========================================================

:: 1. Iniciar servidor Node.js con reinicio automático en ventana minimizada
start "GEARS GYM Server (Port 3000)" /min cmd /c "for /L %%i in (1,0,2) do @(node backend/server.js & timeout /t 2 /nobreak >nul)"

:: 2. Esperar 3 segundos a que el servidor Express + SQLite levante en el puerto 3000
echo Esperando 3 segundos a que el puerto 3000 este activo...
timeout /t 3 /nobreak >nul

:: 3. Detectar Google Chrome o Microsoft Edge y abrir en Modo Kiosco
set "TARGET_URL=http://localhost:3000/?view=monitor"
set "KIOSK_FLAGS=--kiosk --autoplay-policy=no-user-gesture-required --disable-pinch --overscroll-history-navigation=0 --no-first-run --disable-infobars -- disable-session-crashed-bubble"

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    echo Lanzando Google Chrome en Modo Kiosco...
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" %KIOSK_FLAGS% "%TARGET_URL%"
    exit /b 0
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    echo Lanzando Google Chrome (x86) en Modo Kiosco...
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" %KIOSK_FLAGS% "%TARGET_URL%"
    exit /b 0
)

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    echo Lanzando Microsoft Edge en Modo Kiosco...
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" %KIOSK_FLAGS% "%TARGET_URL%"
    exit /b 0
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    echo Lanzando Microsoft Edge en Modo Kiosco...
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" %KIOSK_FLAGS% "%TARGET_URL%"
    exit /b 0
)

:: Fallback con el navegador predeterminado de Windows
start "" msedge %KIOSK_FLAGS% "%TARGET_URL%"
exit /b 0

