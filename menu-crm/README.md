# Меню CRM (отдельно от MODX)

Номенклатура, фото, цены, вес, состав, недельное меню, JSON API для сайта.

## Запуск (локально)

1. Скопируйте `.env.example` в `.env`, задайте пароль и ключи.
2. `npm install`
3. `npx prisma migrate dev` (если ещё не применяли миграции)
4. `npm run dev` → **http://localhost:3105** (отдельный порт, чтобы не конфликтовать с другими проектами на :3000)

## Продакшен без Docker

**Что переносить на сервер:** весь каталог **`menu-crm`** из репозитория (удобнее `git clone` / `git pull`, чем zip). Не нужны: `node_modules/`, `.next/`, локальный `prisma/dev.db` (если есть).

**На сервере один раз:**

1. Установите **Node.js 20 LTS** (или 22).
2. В каталоге `menu-crm`: скопируйте **`.env.example` → `.env`** и заполните:
   - `DATABASE_URL` — для SQLite, например `file:/var/www/menu-crm/data/prod.db` (создайте каталог `data` и дайте пользователю процесса права на запись);
   - `ADMIN_PASSWORD`, `COOKIE_SECRET`, `PUBLIC_API_KEY` — свои длинные значения;
   - при импорте из iiko: `IIKO_API_LOGIN`, при необходимости `IIKO_ORGANIZATION_ID`, `IIKO_API_BASE`.
3. Команды:

```bash
cd /path/to/menu-crm
npm ci
npx prisma migrate deploy
npm run build
```

4. Запуск процесса (пример, порт **3105**, слушать все интерфейсы):

```bash
export NODE_ENV=production
export PORT=3105
npx next start -H 0.0.0.0 -p 3105
```

Для постоянной работы оформите **systemd** или **pm2** с теми же переменными окружения (или `EnvironmentFile=/path/to/menu-crm/.env` в unit-файле — формат как у dotenv). Перед обновлением кода: `git pull` → `npm ci` → `npx prisma migrate deploy` → `npm run build` → перезапуск процесса.

Перед сервером обычно ставят **nginx** (TLS, прокси на `127.0.0.1:3105`).

## API (для сайта)

Заголовок `X-Api-Key: <PUBLIC_API_KEY>`.

- `GET /api/v1/products` — все позиции
- `GET /api/v1/menu/week?weekStart=YYYY-MM-DD` — неделя (понедельник в `weekStart`)

## Импорт из iiko

В `.env` задайте `IIKO_API_LOGIN`, `IIKO_ORGANIZATION_ID`, при необходимости `IIKO_API_BASE`. В CRM: раздел **«Импорт iiko»** или `POST /api/admin/import/iiko` (с кукой входа) — подтягивает номенклатуру `Dish`/`Goods`, цены, вес, описание, первое фото.

## Дальше по плану

Мапперы выгрузки под iiko / Яндекс и синхронизация с облаком — отдельные эндпоинты и согласование полей.
