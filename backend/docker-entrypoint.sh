#!/bin/sh
set -e

npx prisma migrate deploy

if [ "${RUN_SEED:-true}" = "true" ]; then
  npx prisma db seed || true
fi

exec node dist/main.js
