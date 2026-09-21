#!/bin/sh
set -e
mkdir -p /app/data
export DATABASE_URL="${DATABASE_URL:-file:/app/data/prod.db}"
echo "DATABASE_URL=$DATABASE_URL"
# Миграций в репо пока нет — поднимаем схему через db push.
npx prisma db push --skip-generate
exec npx next start -p "${PORT:-3105}" -H 0.0.0.0
