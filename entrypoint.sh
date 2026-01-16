#!/bin/sh

set -e

echo "⏳ Waiting for database to be ready..."

until nc -z -v -w30 acdh-ch-ha-postgres-cluster-pgbouncer.postgres-cluster.svc 5432
do
  echo "⏳ Waiting for DB connection..."
  sleep 2
done

echo "✅ Database is up! Running migrations..."

drizzle-kit migrate --config ./config/drizzle.config.ts

echo "🚀 Starting app..."

exec "$@"
