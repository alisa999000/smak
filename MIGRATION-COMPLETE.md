# Полная замена MODX — статус

## Выполнено

| Этап | Описание | Статус |
|------|----------|--------|
| 0 | Расширена Prisma-схема: CMS, auth, commerce | ✅ |
| 1 | Меню дня/недели из menu-crm (`/api/site/menu/*`) | ✅ |
| 2 | Каталог из menu-crm (`/api/site/catalog/*`, search) | ✅ |
| 3 | CMS: config, banners, pages, news | ✅ |
| 4 | Auth: login, register, profile, orders | ✅ |
| 5 | Commerce: cart, checkout, order, `/commerce/action` | ✅ |
| 6 | Frontend прокси → menu-crm :3105, logout без MODX | ✅ |

## Архитектура

```
Vue frontend (:5173)  ──►  menu-crm backend (:3105)  ──►  SQLite/Postgres
Vue admin (:5174)     ──►  menu-crm /api/admin/*
```

MODX (PHP :8090) **не участвует** в работе сайта.

## Первый запуск

```powershell
cd d:\smachnay\menu-crm
npm install
npm run db:push
npm run db:seed
npm run dev
```

```powershell
cd d:\smachnay\frontend
npm run dev
```

## Импорт старых данных

```powershell
cd d:\smachnay\menu-crm
$env:MODX_URL="http://127.0.0.1:8090"
npm run import:modx
```

## Управление контентом

- **Меню, блюда, неделя** — Vue admin `/admin/` или Next CRM `:3105`
- **Страницы, новости, баннеры** — через Prisma/seed или будущие экраны admin (API готов)

## Legacy

- `www/smachnaya.ru/core/` — Evolution CMS, можно удалить после финального импорта
- `deploy/docker-compose.yml` — сервисы `mysql`, `web` помечены как legacy
