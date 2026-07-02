# Локальный стек (Docker)

1. Скопируйте переменные: `cp .env.example .env` и отредактируйте пароли и ключи.
2. Из этой папки: `docker compose up -d --build`
3. Сайт MODX: `http://localhost:${WEB_PORT:-8090}/`
4. CRM меню: `http://localhost:${MENU_CRM_PORT:-3105}/` — при старте контейнера выполняется `prisma migrate deploy`, SQLite хранится в volume `menu_crm_sqlite`.

На продакшен-сервере: те же шаги в каталоге с репозиторием, проброс HTTPS/домена — через nginx/Caddy перед `menu-crm:3105`.
