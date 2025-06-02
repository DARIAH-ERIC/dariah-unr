#!/bin/sh

set -e

echo "⏳ Waiting for database to be ready..."

until nc -z -v -w30 cronos2.arz.oeaw.ac.at 5432
do
  echo "⏳ Waiting for DB connection..."
  sleep 2
done

echo "✅ Database is up! Running migrations..."

pnpx prisma migrate deploy

echo "🚀 Starting app..."

exec "$@"
