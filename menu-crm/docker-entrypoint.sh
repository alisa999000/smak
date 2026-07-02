#!/bin/sh
set -e
mkdir -p /app/data
export DATABASE_URL="${DATABASE_URL:-file:/app/data/prod.db}"
echo "DATABASE_URL=$DATABASE_URL"
npx prisma migrate deploy
exec npx next start -p "${PORT:-3105}" -H 0.0.0.0
