#!/bin/bash

# =============================================================
# RentalMobil - Deploy Script (Linux/Mac Server)
# Jalankan: chmod +x deploy.sh && ./deploy.sh
# Untuk update: ./deploy.sh update
# =============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

step() { echo -e "\n${BLUE}==>${NC} ${YELLOW}$1${NC}"; }
ok()   { echo -e "  ${GREEN}✔${NC} $1"; }
fail() { echo -e "  ${RED}✘ ERROR: $1${NC}"; exit 1; }

MODE=${1:-fresh}

echo -e "${GREEN}"
echo "  ____            _        _ __  __       _     _ _ "
echo " |  _ \ ___ _ __ | |_ __ _| |  \/  | ___ | |__ (_) |"
echo " | |_) / _ \ '_ \| __/ _\` | | |\/| |/ _ \| '_ \| | |"
echo " |  _ <  __/ | | | || (_| | | |  | | (_) | |_) | | |"
echo " |_| \_\___|_| |_|\__\__,_|_|_|  |_|\___/|_.__/|_|_|"
echo -e "${NC}"
echo -e "${YELLOW}  Mode: ${MODE}${NC}"
echo ""

if [ "$MODE" = "update" ]; then
    step "Pull kode terbaru dari Git"
    git pull origin main || fail "Git pull gagal"
    ok "Git pull selesai"
fi

step "Install PHP dependencies"
if [ "$MODE" = "update" ]; then
    composer install --no-dev --optimize-autoloader || fail "Composer install gagal"
else
    composer install --no-dev --optimize-autoloader || fail "Composer install gagal"
fi
ok "Composer install selesai"

if [ "$MODE" != "update" ]; then
    step "Setup environment"
    if [ ! -f .env ]; then
        cp .env.example .env
        echo ""
        echo -e "  ${RED}PENTING: Edit file .env sebelum lanjut:${NC}"
        echo -e "    - APP_ENV=production"
        echo -e "    - APP_DEBUG=false"
        echo -e "    - APP_URL=https://domain-anda.com"
        echo -e "    - DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD"
        echo -e "    - MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY"
        echo -e "    - MIDTRANS_IS_PRODUCTION=true"
        echo ""
        read -p "  Sudah selesai edit .env? Tekan ENTER untuk lanjut..."
    else
        ok ".env sudah ada, melanjutkan..."
    fi

    step "Generate APP_KEY"
    php artisan key:generate --force || fail "Key generate gagal"
    ok "APP_KEY generated"
fi

step "Install Node.js dependencies"
npm install || fail "npm install gagal"
ok "npm install selesai"

step "Build frontend assets (production)"
npm run build || fail "npm build gagal"
ok "Build frontend selesai"

step "Jalankan migrasi database"
php artisan migrate --force || fail "Migrasi gagal"
ok "Migrasi selesai"

if [ "$MODE" != "update" ]; then
    step "Buat symlink storage"
    php artisan storage:link || true
    ok "Storage link selesai"
fi

step "Clear dan cache ulang semua konfigurasi"
php artisan optimize:clear
php artisan config:cache  || fail "Config cache gagal"
php artisan route:cache   || fail "Route cache gagal"
php artisan view:cache    || fail "View cache gagal"
php artisan event:cache   || fail "Event cache gagal"
ok "Cache selesai"

step "Set permission folder"
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
ok "Permission selesai"

if [ "$MODE" != "update" ]; then
    echo ""
    echo -e "${YELLOW}  ⚙️  Setup Cron Job (jalankan: crontab -e lalu tambahkan baris ini):${NC}"
    echo -e "  ${GREEN}* * * * * cd $(pwd) && php artisan schedule:run >> /dev/null 2>&1${NC}"
    echo ""
    echo -e "${YELLOW}  ⚙️  Setup Queue Worker (Supervisor) - tambahkan ke /etc/supervisor/conf.d/rental.conf:${NC}"
    echo -e "  ${GREEN}[program:rental-worker]${NC}"
    echo -e "  ${GREEN}command=php $(pwd)/artisan queue:work --tries=3${NC}"
fi

echo ""
echo -e "${GREEN}======================================================"
echo -e "  ✅  DEPLOY SELESAI!"
echo -e "======================================================${NC}"
echo ""