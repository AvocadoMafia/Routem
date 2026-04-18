# Build Stage
FROM node:22-slim AS builder

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# ビルド時に Prisma Client の生成と Next.js の型チェックを通すためのダミー環境変数
# これによりビルド時には実際のデータベース接続が不要になります
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ARG NEXT_PUBLIC_SUPABASE_URL="https://dummy.supabase.co"
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="dummy"
# NEXT_PUBLIC_SITE_URL はビルド時にクライアントバンドルへインライン化される必要があるため、
# 実行時 env ではなくビルド引数として渡す (例: https://routem.net)。
# デフォルト値は**敢えて設定しない**: build-arg 未指定ならビルド後の runtime で
# getClientSiteUrl() が throw し、localhost フォールバックでの本番汚染を防ぐ。
ARG NEXT_PUBLIC_SITE_URL
# Mapbox アクセストークン（クライアント側 Mapbox GL / Search で必須）と Turnstile サイトキー
# （クライアント側 login/signup フォームの Bot 対策）も NEXT_PUBLIC_* のためビルド時必須。
# こちらは未設定時は空バンドルになるが throw はしない（dev で Turnstile / Mapbox をオフにできる）。
ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=""
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=$NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm install && npm cache clean --force
RUN npx prisma generate

COPY . .
RUN npm run build

# Production Stage
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl netcat-traditional && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/i18n ./i18n

# Entrypoint script for initialization
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["entrypoint.sh"]
