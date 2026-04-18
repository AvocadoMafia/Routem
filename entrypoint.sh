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
