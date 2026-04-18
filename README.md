@next-project-basis 

**使用方法**
**この右上のuse Templateボタンを押して、このリポジトリをtemplateとして利用すること。**

Next.jsを用いるプロジェクトのbasis
基本的なnextの開発環境と、各種APIを起動するためのdockerの設定ファイルが含まれる。
それぞれの環境での起動には.env系ファイルが必要であるため、提供するリンクからこれをダウンロードしルートディレクトリに配置する。

**APIについて**
RESTAPIに基づいて、./users/route.tsの中身は、get post delete put patchなどで何をするかを書く。
apiに何をするかを含めず、リクエストで指定することができて、/apiが肥大化しない。
それぞれに対応する処理は、libにまとめること。
また、型はzodでschemaを組んでフロントがインポートするだけでよいようにする。

**環境変数について**

環境判定は `NODE_ENV` 1本で行う（`development` / `production`）。
用途は次の2ファイルで分ける:

- `.env`             … ローカル開発用（dev DB / MinIO / localhost）
- `.env.production`  … 本番用（prod DB / OCI Object Storage / https://routem.net）

プロジェクト内での環境変数の取得関数は `lib/config/` 配下の `client.ts` / `server.ts` に使う場所で分けて定義し、
そこで `NODE_ENV` による切り替えを行う。直接 `process.env` を参照するのは config ファイルと script 系のみに留める。

クライアントサイドで用いる変数は `NEXT_PUBLIC_` プレフィックスを付ける。
Next.js は `NEXT_PUBLIC_*` をビルド時にクライアントバンドルへインライン化するため、
Docker ビルドでは必ず `docker-compose-prod.yml` の `build.args` 経由で渡すこと（runtime env では反映されない）。

自サイトの完全URLは `NEXT_PUBLIC_SITE_URL` に一本化している（OAuth コールバック、CORS 判定、共有URL等すべて）。

# ローカル開発の起動手順

1. `.env.example` を `.env` にコピーし、Supabase / Mapbox / Turnstile 等のキーを埋める。
2. 依存サービス（Postgres / Redis / MinIO / Meilisearch / LibreTranslate）を compose で立ち上げる:

   ```sh
   docker compose up -d
   ```
3. Prisma クライアントを生成し、スキーマを dev DB へ反映:

   ```sh
   npx prisma generate
   npx prisma db push
   ```
4. Next.js dev サーバを起動（ホスト側で走らせる運用）:

   ```sh
   npm run dev
   ```

# 本番デプロイ手順

本番は `docker compose -f docker-compose-prod.yml` + `nginx` で運用する。
VM / サーバ上で以下の順番で作業する。

## 事前準備（初回のみ）

1. サーバに `git clone` してブランチをチェックアウト。
2. `.env.example` を参考に **ビルド前に** `.env.production` を作成し、以下を埋める:
   - `NEXT_PUBLIC_SITE_URL=https://routem.net` など **本番ドメイン**
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB`
   - `MEILISEARCH_APIKEY`
   - `OCI_STORAGE_NAMESPACE` / `OCI_REGION` / `OCI_ACCESS_KEY` / `OCI_SECRET_KEY`
   - `OPENEXCHANGERATES_URL`
3. Supabase ダッシュボードで「Redirect URLs」に `https://routem.net/auth/callback` を追加（OAuth / メール認証のため）。
4. 初回はシードを流すため、`.env.production` に `RUN_SEED=true` を設定する（2回目以降は `false` に戻す）。

## 初回デプロイ

```sh
# ビルド & 起動（build.args 経由で NEXT_PUBLIC_* がクライアントバンドルへインライン化される）
docker compose -f docker-compose-prod.yml --env-file .env.production up -d --build

# 起動ログで entrypoint が正常に完走したか確認
docker compose -f docker-compose-prod.yml logs -f app
```

初回起動完了後、`.env.production` で `RUN_SEED=false` に戻しておくこと。

## 2回目以降のデプロイ（コード更新時）

```sh
git pull
docker compose -f docker-compose-prod.yml --env-file .env.production up -d --build
```

**重要**: `NEXT_PUBLIC_*` はビルド時にクライアントバンドルへインライン化されるため、
値を変えた場合は必ず `--build` を付けて**再ビルド**すること。runtime env の変更だけでは反映されない。

## 環境変数の設定タイミング

| 変数種別 | 反映タイミング | 参照先 |
| --- | --- | --- |
| `NEXT_PUBLIC_*` | **ビルド時**（build-arg → Dockerfile `ENV`） | `docker-compose-prod.yml` `app.build.args` |
| それ以外（`DATABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `OCI_*` 等） | **起動時**（container runtime env） | `docker-compose-prod.yml` `app.env_file` / `app.environment` |
| `RUN_SEED` / `RUN_RECOMMEND` | 起動時（entrypoint.sh が条件分岐に使用） | `.env.production` |

## トラブルシューティング

### docker build が失敗する
- **Prisma 生成エラー**: Dockerfile 内でダミー `DATABASE_URL` をセットしてあるが、`prisma/schema.prisma` に構文エラーがあると生成が落ちる。`npx prisma validate` で事前チェック。
- **`NEXT_PUBLIC_*` 未設定で type エラー**: `NEXT_PUBLIC_SITE_URL` は未定義だと `getClientSiteUrl()` で throw する。`.env.production` に値を入れてから `--build` すること。
- **ネットワークエラー**: `npm install` 時のレジストリ到達性、OCI / Supabase への DNS を確認。

### entrypoint.sh の prisma 実行が失敗する
- `prisma/migrations/` が存在しないとガードで自動的に `prisma db push` にフォールバックする。
- `db push` が失敗する場合は `DATABASE_URL` 形式（`postgresql://user:pass@postgres:5432/db`）と Postgres コンテナの起動状態を確認。
- 既存 DB とスキーマ差分が破壊的変更を含むと `db push` は失敗する。マイグレーション運用に移行するまでは手動調整が必要。

### OAuth / メール認証が動かない
- Supabase ダッシュボードの **Redirect URLs** に `${NEXT_PUBLIC_SITE_URL}/auth/callback` が入っているか確認。
- `NEXT_PUBLIC_SITE_URL` が **ビルド時**に正しく渡っているか（例: `docker compose logs app` で `Missing required env: NEXT_PUBLIC_SITE_URL` が出ていないか）。
- `nginx` が `X-Forwarded-Host` / `X-Forwarded-Proto` を立てているか（`nginx/conf.d/default.conf` 参照）。

### 画像が 403 / 表示されない
- 本番: OCI の `OCI_BUCKET_NAME`（既定 `rtmimages`）に `public` アクセスが設定されているか。
- `next.config.ts` の `images.remotePatterns` に画像ホスト名が登録されているか（追加時は編集して再ビルド）。
- dev: MinIO コンテナが起動し、バケット `rtmimages` が anonymous public になっているか（`mc` サービスの自動セットアップで構築される）。

### Redis cold start で trending / recommend が落ちる
- `entrypoint.sh` で `redis` コンテナの疎通待機を入れているので、正常起動時は発生しない。
- それでも落ちる場合は `lib/config/server.ts` の `getRedisClientOrNull` が `null` フォールバックを返すので、ページ全体は壊れない（キャッシュなしで DB フェッチ）。

# CORDING STANDARD
**命名規則**
DBカラム名：キャメルケース
クエリパラメータ：キャメルケース
**宣言の並び順**
- できるだけ使用する直前で宣言
- 型なども同じであるが、特に理由がない場合は、アルファベット順で並べる
→ctrl shift P　でコマンドパレットを開き、sort ascendingで選択範囲を並び替えることができる
