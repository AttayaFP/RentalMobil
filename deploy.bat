@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: =============================================================
:: RentalMobil - Deploy Script (Windows)
:: Jalankan: deploy.bat         (fresh deploy)
:: Untuk update: deploy.bat update
:: =============================================================

set MODE=%1
if "%MODE%"=="" set MODE=fresh

echo.
echo  ____            _        _ __  __       _     _ _
echo  ^|  _ \ ___ _ __ ^| ^|_ __ _^| ^|  \/  ^| ___ ^| ^|__ (_) ^|
echo  ^| ^|_) / _ \ ^'_ \^| __/ _` ^| ^| ^|\/^| ^|/ _ \^| ^'_ \^| ^| ^|
echo  ^|  _ ^<  __/ ^| ^| ^| ^|^| (_^| ^| ^| ^|  ^| ^| (_) ^| ^|_) ^| ^| ^|
echo  ^|_^| \_\___|_^| ^|_^\__\__,_^|_^|_^|  ^|_^\___/^|_.__/^|_^|_^|
echo.
echo  Mode: %MODE%
echo.

if "%MODE%"=="update" (
    echo [^>] Pull kode terbaru dari Git...
    git pull origin main
    if errorlevel 1 ( echo [ERROR] Git pull gagal! & pause & exit /b 1 )
    echo     OK - Git pull selesai
)

echo.
echo [^>] Install PHP dependencies...
composer install --no-dev --optimize-autoloader
if errorlevel 1 ( echo [ERROR] Composer install gagal! & pause & exit /b 1 )
echo     OK - Composer install selesai

if not "%MODE%"=="update" (
    echo.
    echo [^>] Setup environment...
    if not exist .env (
        copy .env.example .env
        echo.
        echo  [PENTING] Edit file .env terlebih dahulu:
        echo    - APP_ENV=production
        echo    - APP_DEBUG=false
        echo    - APP_URL=https://domain-anda.com
        echo    - DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
        echo    - MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY
        echo    - MIDTRANS_IS_PRODUCTION=true
        echo.
        pause
    ) else (
        echo     OK - .env sudah ada, melanjutkan...
    )

    echo.
    echo [^>] Generate APP_KEY...
    php artisan key:generate --force
    if errorlevel 1 ( echo [ERROR] Key generate gagal! & pause & exit /b 1 )
    echo     OK - APP_KEY generated
)

echo.
echo [^>] Install Node.js dependencies...
npm install
if errorlevel 1 ( echo [ERROR] npm install gagal! & pause & exit /b 1 )
echo     OK - npm install selesai

echo.
echo [^>] Build frontend assets (production)...
npm run build
if errorlevel 1 ( echo [ERROR] npm build gagal! & pause & exit /b 1 )
echo     OK - Build frontend selesai

echo.
echo [^>] Jalankan migrasi database...
php artisan migrate --force
if errorlevel 1 ( echo [ERROR] Migrasi gagal! & pause & exit /b 1 )
echo     OK - Migrasi selesai

if not "%MODE%"=="update" (
    echo.
    echo [^>] Buat symlink storage...
    php artisan storage:link
    echo     OK - Storage link selesai
)

echo.
echo [^>] Clear dan cache ulang semua konfigurasi...
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
if errorlevel 1 ( echo [ERROR] Cache gagal! & pause & exit /b 1 )
echo     OK - Cache selesai

echo.
echo ======================================================
echo   DEPLOY SELESAI!
echo ======================================================
echo.
if not "%MODE%"=="update" (
    echo  CATATAN PENTING:
    echo  - Pastikan cron job sudah dikonfigurasi di server
    echo  - Pastikan queue worker berjalan (Supervisor)
    echo  - Cek file .env sudah benar untuk production
    echo.
)
pause