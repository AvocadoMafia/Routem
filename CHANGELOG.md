# Changelog

このプロジェクトの注目すべき変更を記録する。
書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠し、
バージョニングは [Semantic Versioning](https://semver.org/lang/ja/) に従う。

未公開の変更は `## [Unreleased]` 配下に追記する。

---

## [Unreleased] — 77-デプロイ準備（main マージ予定）

本ブランチでは「本番デプロイに必要な最小限のインフラ整備」と「Bug#1 / Bug#2 / Bug#3 として
集約された UX / セキュリティ / 認証系の不整合修正」を中心に、85 コミットで以下の改善を行った。

### ✨ Features / UX

- **i18n 4 言語対応の漏れを全網羅**（ja / en / ko / zh）
  - home / trending / likes / followings / tags / routes / dashboard / explore / search の各セクションのハードコード英語を `messages/*.json` に集約
  - 認証系（login / signup / profile）のモーダル文言、placeholder / aria-label / alt / title をすべて i18n 化
  - commentItem の User / Anonymous fallback、loginPromptCard の redirect 文言、toastCard の aria を 4 言語化
  - CJK 用の tracking（letter-spacing）を i18n 化に併せて追加
  - コミット例: `3d91dfb`, `f1f940d`, `922bae4`, `b4a2d2c`, `ab1c3aa`
- **UX-1〜6 系のフィードバック改善**
  - sectionErrorState を新設し、loading / error / empty / data の 4 状態を全セクションで実装（home / trending / explore / search / tags / users / dashboard/me）
  - `useInfiniteScroll` に 429 / 5xx リトライ + Retry-After 対応を追加
  - RATE_LIMITED 表示にカウントダウン UI と aria-busy 属性を追加
  - useLike: 楽観 UI + 認証エラー処理（header / details の initialIsLiked を共通化）
  - useShare: webShare → clipboard → execCommand → prompt の段階フォールバック + 可視フィードバック
  - useComments: コメント投稿フックの実装、未ログイン時はログイン誘導に切替
  - 汎用トーストストア（zustand）と loginPromptCard 基盤を新設
  - コミット例: `bb03bb4`, `1d301f0`, `a1f74e7`, `08ebe0e`, `eaf5fc3`, `a99b9c2`, `9dbd286`, `b93d5bf`

### 🔒 Security / Auth

- **proxy.ts のセキュリティ強化**
  - CORS Origin 判定を `String#includes` 部分一致 → URL.origin 完全一致に修正（`routem.net.evil.com` 型 bypass を防御）
  - Cookie の `Secure` 属性を `X-Forwarded-Proto` ベースの動的判定に変更（`NODE_ENV === "production"` 固定だと HTTP 運用環境で session が保存されなかった問題を解消）
  - Supabase cookie の `httpOnly` / `maxAge` / `expires` / `domain` / `sameSite` / `priority` を `propagateSessionCookies` で確実に保持（旧実装は `secure` のみ継承で他の options を破壊していた）
  - コミット: `a2ed8d7`, `e0ae67f`, `410e533`
- **認証エラーの semantic な分離**
  - handleError に 401 / 403 / 404 の分岐を追加し、本番でも認証エラーを区別可能に
  - features/ の throw message を `Unauthorized` / `Forbidden` / `Not Found` / `Validation Error` に正規化
  - validation error を `400 VALIDATION_ERROR` に統一し、Zod issues の本番漏洩を防止
  - 🔴 Prisma エラーの内部情報漏洩を修正（コミット `7df28a0`）
  - コミット: `7f04067`, `69fa73e`, `f46ebe8`, `cffe7ba`, `97588b4`
- **認証フローの URL 統一**
  - OAuth リダイレクトを `NEXT_PUBLIC_SITE_URL` ベースに統一（旧実装は `localhost:3000` への hardcode フォールバックがあり本番に漏れていた）
  - getClientSiteUrl にプロトコル検証を追加（`javascript:`, `ftp://` 等の不正スキームを throw）
  - コミット: `ac491dd`, `8aab434`

### 🐛 Bug Fixes

- routes/[id] 系で UUID validation を追加し、404 body フォーマットを統一（他人所有検出も 404 固定化、所有判定の漏洩を防ぐ）（`cb4a223`）
- mapViewerOnLaptop 内 RouteList の無限スクロール不発を修正（`7816342`）
- 型エラー修正と useInfiniteScroll フックによる無限スクロールの共通化（`6f94e2b`）
- messages ファイルで言語間で不足していた翻訳キーを追加（`9ad21b9`）
- photo セクション無限スクロール / タグページ / trending 実データ化（`635b2b6`）
- enumsStore の配列フィールドを Prisma enum 型に絞り（`bc14445`）
- useComments の as any 除去と DEFAULT_TAKE 定数を components/section で共有（`e07b695`）
- User.gender カラム + Gender enum を削除（dead field 整理）（`9591dfd` / `9955e38`）

### 🛠️ Infra / Deploy

- **本番デプロイ手順の整備**
  - `docker-compose-prod.yml` + `nginx` 構成を確立、`Dockerfile` の build stage / runner stage を分離
  - `entrypoint.sh` を全面リライト: 依存サービス（postgres / meilisearch / redis）の `nc -z` 待機に MAX_WAIT 60 秒タイムアウトを追加し永久ハング防止、`prisma db push` / `prisma migrate deploy` のガード切替、`RUN_SEED` / `RUN_RECOMMEND` フラグ化
  - nginx に rate limit ゾーン（read / write 別、429 で JSON レスポンス）と HTTPS 有効化用の設定コメント、共通プロキシヘッダー（X-Forwarded-Proto / X-Forwarded-Host / X-Forwarded-For）を整備
  - コミット: `f1462bd`, `8b0d5be`, `c687d27`
- **env / vercel 残骸の整理**
  - `.env` から DB_TYPE / LOCAL_DATABASE_URL / VERCEL_DATABASE_URL / VERCEL_DIRECT_URL / DIRECT_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_AUTH_REDIRECT_URL / PRODUCTION_URL を削除
  - `NEXT_PUBLIC_SITE_URL` に自サイト URL 用途を一本化（OAuth コールバック / CORS 判定 / 共有 URL）
  - Supabase 環境変数の多段フォールバック（旧 SUPABASE_URL / SUPABASE_ANON_KEY 等）を撤去し `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` 1 本に集約
  - `.env.example` を網羅版で新規作成、`.env.production` を本番用に新設
  - Docker / docker-compose-prod.yml で NEXT_PUBLIC_* を build-args 経由に統一（runtime env では Next.js のクライアントバンドルに反映されないため）
  - features/images/service.ts の MinIO 公開 URL 生成を簡素化、OCI Object Storage 切替を NODE_ENV ベースに整理
  - コミット: `409643d`, `b8d6bfb`, `4d23da5`
- **`.dockerignore` の新設**
  - build context を **474 MB → 670 KB**（約 99.9% 削減）
  - `.env*` を除外し（`!.env.example` でテンプレのみ追跡）、機密値が image layer に焼き込まれないよう保証
  - コミット: `d7f6173`
- **esbuild version mismatch の解消**
  - `node:22-slim` ベースイメージ同梱の古い npm cache（Feb 25 ビルドの esbuild 0.27.3）が image に焼き込まれ、tsx 実行時に native binary（0.27.7）と version mismatch を起こす問題を発見
  - `Dockerfile` の `npm install` 前後に `npm cache clean --force` を追加して駆逐
  - host (darwin-arm64) と container (linux) の platform 差分対策で `npm install` を retain（`npm ci` だと `Missing: @swc/helpers@0.5.21 from lock file` で abort）
  - host 側で `npm install` し package-lock.json を同期（10+/20- の最小差分）
  - コミット: `4c21f7b`, `fb46783`
- **Redis cold start race の解消**
  - `getRedisClient` を「接続完了を保証する Promise」シングルトン化、cold start 直後の並列リクエストでも ready なクライアントを返す
  - `getRedisClientOrNull` を新設し、Redis 不達時は DB フォールバックでページ全体を壊さない
  - コミット: `dfa9c27`

### ♻️ Refactor / Cleanup

- enum を Prisma 由来に統一し `lib/constants/enums` と `userEnumsStore` を削除（`d4c07de`）
- UI レイヤの string literal と `as any` を Prisma enum に置換、`helpers` に safe 変換関数（`toSpotSource` / `toTransitMode`）を追加（`56ee1d6`）
- Zod スキーマを `z.nativeEnum` に統一し `TransitMode` 欠落（BIKE / FLIGHT / SHIP）を修正（`7ff4fab`）
- store 分離 + API レート制限の緩和（`89cc8f5`）
- API handler の "unauthorized" → "Unauthorized" 表記統一（`f46ebe8`）

### 🧪 Tests

- `lib/config/client.ts` (`getClientSiteUrl` / `getClientAuthRedirectUrl`) の単体テストを追加（`06a4fb8`）
- `proxy.ts` の `isSameOrigin` regression test（CORS 完全一致）を追加（`410e533`）
- `features/images/service.ts` の `buildPublicUrl` / `getStorageBucket` 単体テスト 15 件
- `lib/auth/supabase/client.ts` / `lib/config/server.ts` の `getSupabaseUrl` / `getSupabasePublishableKey` 単体テスト 各 9 件
- `toSpotSource` / `toTransitMode` の単体テスト（`482c59d`）
- features/ service ユニットテスト scaffolding（helpers + comments sample）を追加（`50f2ecd`）
- コミット: `e63452d`

### 📚 Docs

- README を docker compose prod 運用手順に刷新し vercel 記述を削除（`ac10576`）
- README に環境変数の反映タイミング表（NEXT_PUBLIC_* がビルド時 / それ以外が起動時）とトラブルシューティング 4 カテゴリ（docker build 失敗 / prisma 失敗 / OAuth / 画像 403 / Redis cold start）を追記（`53fbeb5`）
- README に SSL 有効化（Let's Encrypt + nginx）/ OCI バケット事前作成 / Supabase Redirect URLs / RUN_SEED 運用の手順を追記（`2a4fdf6`）
- nginx/conf.d/default.conf に HTTPS 有効化用の設定コメント
- Phase D2 開始前の残タスクを `.claude/backlog.md` に集約（`9ae0570`）
- backlog に最終段階で洗い出した項目（H-14..H-20）を追記
- Bug#3 の E2E 検証シナリオドキュメントを追加（`e9812d6`）
- bug3-test-scenarios と backlog を features/ throw 正規化後の仕様に追従（`d4e6d32`）

### ⚠️ Known Issues

- `app/api/v1/routes/route.test.ts` の GET test が `localhost:3000` への live fetch に依存しており、dev server 未起動環境では失敗する（既知 flaky、本ブランチの変更と無関係）
  - 対応案: describe.skip + TODO / MSW で mock 化 / integration suite に分離
- ESLint: 138 errors / 146 warnings 残存（主に `@typescript-eslint/no-explicit-any` の古い箇所）。incremental に PR 分割で潰す方針

詳細は `.claude/backlog.md` 参照。
