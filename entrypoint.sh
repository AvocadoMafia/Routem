#!/bin/sh
set -e

# Wait for DB
echo "Waiting for database..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "Database is up!"

# Wait for Meilisearch
echo "Waiting for meilisearch..."
while ! nc -z meilisearch 7700; do
  sleep 1
done
echo "Meilisearch is up!"

# .envファイルから環境変数を読み込む（Prisma用に念のため）
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# DATABASE_URLが設定されているか確認
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

# Run DB push to ensure schema is sync
echo "Running Prisma migrations..."
npx prisma db push --accept-data-loss

# Initialize Meilisearch (npm run initialize)
echo "Initializing Meilisearch..."
npm run initialize

# Seed
echo "Seeding database..."
npm run seed:exchange-rates
npx prisma db seed

# Start App
echo "Starting application..."
npm start
