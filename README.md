# Смачная точка (smak)

Корпоративное питание: публичный сайт (Vue), админка меню (Vue), backend (Next.js + Prisma).

## Быстрый старт

Подробно: [README-VUE.md](README-VUE.md)

```bash
# Backend
cd menu-crm && npm install && npm run db:push && npm run db:seed && npm run dev

# Сайт
cd frontend && npm install && npm run dev

# Админка
cd admin && npm install && npm run dev
```

- Сайт: http://127.0.0.1:5173  
- API: http://127.0.0.1:3105  
- Админка: http://127.0.0.1:5174/admin/

## Деплой (Docker)

```bash
cd deploy
cp .env.example .env   # задать пароли и SITE_URL
docker compose up -d --build
```

См. [deploy/README.md](deploy/README.md)

## Структура

| Папка | Назначение |
|-------|------------|
| `frontend/` | Публичный SPA |
| `admin/` | Админка меню и CMS |
| `menu-crm/` | Backend API |
| `www/smachnaya.ru/assets` | Статика (CSS, картинки) |
| `deploy/` | Docker Compose |
