# Smachnaya — Vue + собственный backend (без MODX)

Evolution CMS **больше не используется** для публичного сайта. Весь API — в **menu-crm** (Next.js + Prisma).

## Структура

| Папка | Назначение |
|-------|------------|
| `frontend/` | Публичный SPA |
| `admin/` | Vue-админка меню |
| `menu-crm/` | **Единый backend**: меню, CMS, auth, commerce, admin API |
| `www/smachnaya.ru/` | Статика (CSS, изображения) + собранные SPA |

## Запуск разработки

```bash
# Backend (единственный обязательный сервис)
cd menu-crm && npm install && npm run db:push && npm run db:seed && npm run dev

# Публичный сайт (прокси /api → :3105)
cd frontend && npm install && npm run dev

# Vue-админка
cd admin && npm install && npm run dev
```

- Сайт: http://127.0.0.1:5173
- Backend API: http://127.0.0.1:3105
- Админка: http://127.0.0.1:5174/admin/

## Миграция данных из MODX (один раз)

Если PHP ещё доступен:

```bash
cd menu-crm
MODX_URL=http://127.0.0.1:8090 npm run import:modx
```

## API сайта (menu-crm)

| Метод | URL |
|-------|-----|
| GET | `/api/site/config` |
| GET | `/api/site/banners` |
| GET | `/api/site/catalog/categories` |
| GET | `/api/site/catalog/products` |
| GET | `/api/site/catalog/product/{alias}` |
| GET | `/api/site/pages/{alias}` |
| GET | `/api/site/news`, `/api/site/news/{alias}` |
| GET | `/api/site/search` |
| GET | `/api/site/menu/day`, `/api/site/menu/week` |
| GET/POST | `/api/site/account/*` |
| GET/POST | `/api/site/commerce/*` |
| POST | `/evocms-user/auth`, `/evocms-user/register` |
| POST | `/commerce/action` |

## Docker (production)

```bash
cd deploy && docker compose up -d menu-crm
```

Сервисы `mysql` и `web` (PHP/MODX) — **legacy**, не нужны для сайта.

## Демо-пользователь

- Email: `demo@smachnaya.ru`
- Пароль: `demo123456`
