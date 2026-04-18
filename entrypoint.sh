#!/bin/sh
set -e

# ---------------------------------------------------------------------------
# Wait for dependencies
# ---------------------------------------------------------------------------
echo "[entrypoint] Waiting for database..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "[entrypoint] Database is up."

echo "[entrypoint] Waiting for meilisearch..."
while ! nc -z meilisearch 7700; do
  sleep 1
done
echo "[entrypoint] Meilisearch is up."

# Redis: cold start race（最初のリクエストが Redis 未起動に当たって失敗する現象）を避けるため
# prisma 実行の前に疎通確認しておく。
echo "[entrypoint] Waiting for redis..."
while ! nc -z redis 6379; do
  sleep 1
done
echo "[entrypoint] Redis is up."

# ---------------------------------------------------------------------------
# Env validation
# docker-compose の env_file / environment で既に注入済み。
# 以前はここで .env を再export していたが、二重注入になり値がズレる恐れがあるため削除。
# ---------------------------------------------------------------------------
if [ -z "$DATABASE_URL" ]; then
  echo "[entrypoint] Error: DATABASE_URL is not set." >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Schema sync
#  - prisma/migrations が存在しコミット済みなら migrate deploy（本番正攻法）
#  - 無ければ db push（--accept-data-loss を付けない安全側）で schema.prisma を適用
# 現状 migrations ディレクトリは未作成のため実質 db push 経由。将来 migrations 化すれば
# このスクリプト側は変更不要で自動的に migrate deploy に切り替わる。
# ---------------------------------------------------------------------------
if [ -d prisma/migrations ] && [ -n "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "[entrypoint] Running: prisma migrate deploy"
  npx prisma migrate deploy
else
  echo "[entrypoint] No migrations directory found. Running: prisma db push"
  npx prisma db push
fi

# ---------------------------------------------------------------------------
# Meilisearch index 初期化（冪等処理。毎起動で走っても安全）
# ---------------------------------------------------------------------------
echo "[entrypoint] Initializing Meilisearch indexes..."
npm run initialize

# ---------------------------------------------------------------------------
# Seed（重い / 冪等でない可能性があるため既定 off）
#   初回起動時 or 明示的に欲しい時だけ RUN_SEED=true を渡す
# ---------------------------------------------------------------------------
if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "[entrypoint] Seeding database (RUN_SEED=true)..."
  npm run seed:exchange-rates
  npx prisma db seed
else
  echo "[entrypoint] Skipping seed (set RUN_SEED=true to run seeds on startup)."
fi

# ---------------------------------------------------------------------------
# Recommendations（負荷大。起動ごとに回すべきではないため既定 off。
# 本来は cron / 別ワーカーコンテナで定期実行するのが望ましい）
# ---------------------------------------------------------------------------
if [ "${RUN_RECOMMEND:-false}" = "true" ]; then
  echo "[entrypoint] Generating recommendations (RUN_RECOMMEND=true)..."
  npm run recommend
else
  echo "[entrypoint] Skipping recommendation generation (set RUN_RECOMMEND=true to enable)."
fi

# ---------------------------------------------------------------------------
# Start App
# ---------------------------------------------------------------------------
echo "[entrypoint] Starting application..."
npm start
