# Env Checklist（本番デプロイ前のクイックリファレンス）

> README の「本番デプロイ手順」の env 部分だけを抽出した実行直前用チェックリスト。
> 詳細手順は README、運用 backlog は `.claude/backlog.md` を参照。

---

## 🏗 ビルド時に必要（Dockerfile ARG / docker-compose-prod.yml build.args）

Next.js は `NEXT_PUBLIC_*` をクライアントバンドルへ**ビルド時**にインライン化する。
runtime の container env では反映されない。docker-compose-prod.yml の `app.build.args` 経由で必ず渡すこと。

- [ ] `NEXT_PUBLIC_SITE_URL=https://routem.net`（本番ドメイン）
- [ ] `NEXT_PUBLIC_SUPABASE_URL=`（Supabase プロジェクト URL）
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=`（Supabase publishable key、新名称）
- [ ] `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=`（Mapbox GL / Search 用、空でも UI は壊れないが地図は出ない）
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY=`（Cloudflare Turnstile、空でもログインフォームは表示される）

確認:
```sh
grep -E 'NEXT_PUBLIC' .env.production | grep -v '^#'  # 空でないか
docker compose -f docker-compose-prod.yml config | grep -A 7 'build:'  # args に5つ揃っているか
```

---

## 🚀 起動時に必要（.env.production の `env_file` 経由 / docker-compose の `environment` で上書き）

container の runtime env として読まれる。`.env.production` を `--env-file` で渡し、
`DATABASE_URL` / `REDIS_URL` / `MEILISEARCH_URL` / `LIBRETRANSLATE_URL` は
docker-compose-prod.yml の `app.environment` で compose 内サービス名（`@postgres:5432` 等）に上書きされる。

- [ ] `SUPABASE_SERVICE_ROLE_KEY=`（Supabase service role、漏洩は致命）
- [ ] `POSTGRES_USER=`
- [ ] `POSTGRES_PASSWORD=`（強パスワード）
- [ ] `POSTGRES_DB=`（既定 `routem`）
- [ ] `MEILISEARCH_APIKEY=`（Meilisearch master key、強ランダム）
- [ ] `OPENEXCHANGERATES_URL=`（為替更新スクリプト用、`RUN_SEED=true` 時に使用）
- [ ] `OCI_STORAGE_NAMESPACE=`（OCI Object Storage 本番）
- [ ] `OCI_REGION=ap-tokyo-1`
- [ ] `OCI_ACCESS_KEY=`
- [ ] `OCI_SECRET_KEY=`
- [ ] `OCI_BUCKET_NAME=rtmimages`
- [ ] `RUN_SEED=false`（**初回のみ true**、完了後 false に戻す）
- [ ] `RUN_RECOMMEND=false`（cron 化推奨、起動時実行は負荷大）

確認:
```sh
docker compose -f docker-compose-prod.yml --env-file .env.production config | grep -A 30 'environment:'
```

---

## 🛡 デプロイ前 ops チェック

- [ ] Supabase Dashboard → Authentication → URL Configuration
  - Site URL: `https://routem.net`
  - Redirect URLs: `https://routem.net/auth/callback` を追加（dev 用 `http://localhost:3000/auth/callback` も並列で残す）
- [ ] OCI Object Storage バケット作成
  - Name: `rtmimages` / Visibility: Public / Customer Secret Key 発行
  - IAM Policy: `Allow user <username> to manage objects in tenancy where target.bucket.name = 'rtmimages'`
- [ ] DNS: `routem.net` を本番サーバ IP に向ける（Let's Encrypt 取得前）
- [ ] SSL 証明書取得（Let's Encrypt / certbot）し `/etc/letsencrypt/live/routem.net/` に配置
- [ ] `docker-compose-prod.yml` の `- "443:443"` ポートと nginx volume mount を有効化
- [ ] `nginx/conf.d/default.conf` の SSL ブロック / 80→443 リダイレクトをコメント解除
- [ ] cron 設定: `certbot renew && docker compose -f docker-compose-prod.yml restart nginx`
- [ ] cron 設定（任意）: 推薦生成を `docker compose exec app npm run recommend` で定期実行

---

## 🚦 初回デプロイのコマンド順

```sh
# 1. .env.production を完成させる（上記ビルド時 + 起動時項目を全埋め）
# 2. 初回シードを流すために RUN_SEED=true をセット
sed -i '' 's/^RUN_SEED=.*/RUN_SEED=true/' .env.production

# 3. ビルド + 起動（NEXT_PUBLIC_* がインライン化されることに注意、build-arg で渡す）
docker compose -f docker-compose-prod.yml --env-file .env.production up -d --build

# 4. ログで entrypoint 完走を確認（特に setupMeilisearch / seed 完了）
docker compose -f docker-compose-prod.yml logs -f app

# 5. seed 完了を確認したら RUN_SEED=false に戻す & app コンテナだけ再作成
sed -i '' 's/^RUN_SEED=.*/RUN_SEED=false/' .env.production
docker compose -f docker-compose-prod.yml --env-file .env.production up -d --force-recreate app

# 6. 動作確認
curl -I https://routem.net/
curl -I https://routem.net/api/v1/routes
```

## 🔁 2 回目以降のデプロイ

```sh
git pull
# NEXT_PUBLIC_* を変えた場合は必ず --build を付けて再ビルド（runtime env では反映されない）
docker compose -f docker-compose-prod.yml --env-file .env.production up -d --build
```

---

## 📚 関連ドキュメント

- `README.md` — 本番デプロイ手順、トラブルシューティング、SSL / OCI / Supabase / RUN_SEED 詳細
- `.env.example` — env 全変数のテンプレート（dev 推奨値）
- `.env.production` — 本番値（このリポジトリには含まれず、サーバ側で個別管理）
- `.claude/backlog.md` — H-7（CDN 前段化時の real_ip）/ H-8（prisma migrations 初期化）/ H-10（tsx 排除）/ H-18（npm install trade-off）等の運用 backlog
- `.claude/proxy-ops-review.md` — proxy.ts の本番運用観点レビュー
