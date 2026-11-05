@echo off
title ZEUS GYM - Lanzador Kiosco & Servidor Local
chcp 65001 >nul

:: Cambiar al directorio raíz del proyecto (un nivel arriba de /scripts)
cd /d "%~dp0.."

echo ====================================================================
echo   ⚡⚡⚡  INICIANDO ZEUS GYM — SISTEMA DE CONTROL OLÍMPICO  ⚡⚡⚡
echo           Modo Simulación Activo • Kiosco y Servidor Local
echo ====================================================================

:: 0. Verificar si el bundle de producción existe; compilar automáticamente si falta
if not exist "dist\index.html" (
    echo.
    echo [ZEUS GYM] Compilando aplicación web (dist/ no detectado)...
    call npm run build
    if errorlevel 1 (
        echo.
        echo [ERROR] Falló la compilación de la aplicación.
        pause
        exit /b 1
    )
    echo [ZEUS GYM] Compilación completada exitosamente.
)

:: 1. Iniciar servidor Node.js con reinicio automático en ventana minimizada
start "ZEUS GYM Server (Port 3000)" /min cmd /c "for /L %%i in (1,0,2) do @(node backend/server.js & timeout /t 2 /nobreak >nul)"

:: 2. Esperar 3 segundos a que el servidor Express + SQLite levante en el puerto 3000
echo Esperando a que el servidor Express en puerto 3000 esté activo...
timeout /t 3 /nobreak >nul

:: 3. Detectar Google Chrome o Microsoft Edge y abrir en Modo Kiosco
set "TARGET_URL=http://localhost:3000/?view=monitor"
set "KIOSK_FLAGS=--kiosk --autoplay-policy=no-user-gesture-required --disable-pinch --overscroll-history-navigation=0 --no-first-run --disable-infobars --disable-session-crashed-bubble"

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
