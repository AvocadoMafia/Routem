# PR: 77-デプロイ準備 → main

本番デプロイ直前の大型統合 PR。Tester_1 が本番ダミーデプロイで発見した 3 バグを起点に、根本原因とその周辺に潜んでいた追加バグを網羅的に潰した。

---

## TL;DR

| 項目 | 値 |
|---|---|
| 対象バグ | **Bug#1** (like/comment/share UX 崩壊) / **Bug#2** (Google OAuth → localhost redirect) / **Bug#3** (本番 HTTP 運用で認証必須 API が 401) |
| 追加で潰したバグ | 7 件（Prisma エラー漏洩、Zod validation 500 塗りつぶし、enum 欠落、認証エラー 500 化、i18n 欠落、race condition 対応、docker 巨大 build context 等） |
| 担当エンジニア | Engineer_A / B / C / E / F の 5 人並列 + CTO_1/2 レビュー |
| コミット数 | **53 commits** (ブランチ `77-デプロイ準備` → `main`) |
| ファイル変更 | **115 files changed, +6,507 / −1,077** |
| 追加テスト数 | **46 テストケース追加** (proxy.test.ts 22, client.test.ts 16, handleError.test.ts, buildPublicUrl.test.ts 等) |
| 合計テスト (vitest) | **209 pass / 1 fail** (failing 1 件は live fetch 依存の既知 flaky、本ブランチ変更と無関係) |
| TypeScript (tsc) | **exit 0** |
| Next.js 本番ビルド | `NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build` → ✓ Compiled successfully、67/67 static pages |
| CTO レビューラウンド | CTO_1: 5 ラウンド（Bug#2 は 3 ラウンド）、CTO_2: 2 ラウンド |

---

## 1. 本編バグ (3 件)

### Bug#1: like / comment / share の UX 崩壊
**発見**: Tester_1 が記事詳細ページで操作 → 何も起こらない / エラートースト出ない / 未ログインでも握り潰し。

**根本原因**:
- 楽観 UI (optimistic update) が導入されておらず、クリック時に UI が無応答
- 未ログイン時 401 レスポンスがクライアント側で握り潰されていた（トーストも出ない）
- Share 機能が `navigator.share` 一本足で、HTTP 運用 / 非対応ブラウザで即死

**修正**:
- `useLike.ts` / `useComments.ts` / `useShare.ts` の 3 フックを新設 (commit: `eaf5fc3`, `9dbd286`, `a99b9c2`)
- 楽観 UI + 401 catch + `loginPromptCard` 誘導 UI 表示
- Share は **navigator.share → clipboard API → execCommand → prompt** の 4 段フォールバック
- 汎用 `toastStore` と `loginPromptCard` 基盤を追加 (`b93d5bf`)

**担当**: Engineer_C

---

### Bug#2: Google OAuth 認証後に `http://localhost:3000/auth/callback` へリダイレクトされる
**発見**: Tester_1 が本番 URL で Google ログイン → Google 認証成功後になぜか localhost に飛ばされログインが失敗。

**根本原因**:
- `lib/config/client.ts` で `getClientAuthRedirectUrl()` が `NEXT_PUBLIC_AUTH_REDIRECT_URL` 未定義時に `"http://localhost:3000/auth/callback"` を**ハードコードでフォールバック**していた
- `NEXT_PUBLIC_*` は Next.js ビルド時にクライアントバンドルへインライン化されるが、Dockerfile / docker-compose-prod.yml の build-args には該当変数が未指定だったため、fallback が本番バンドルにそのまま焼き付いていた
- 加えて `proxy.ts` の CORS 判定が `origin.includes(allowedOrigin)` で部分一致していたため `routem.net.evil.com` のようなサブドメイン詐称を許可する脆弱性も併発

**修正**:
- 環境変数を `NEXT_PUBLIC_SITE_URL` に一本化 (OAuth / 共有URL / sitemap / CORS 全てここを参照) (`ac491dd`)
- `getClientSiteUrl()` を新設: 未定義で throw / URL.parse 検証 / http(s) 限定 / 末尾スラッシュ正規化 (`a2ed8d7`)
- `PRODUCTION_URL` → `NEXT_PUBLIC_SITE_URL` に統一、dev フォールバックも完全URL形式 `http://localhost:3000` に揃える
- `Dockerfile` / `docker-compose-prod.yml` の build-args に `NEXT_PUBLIC_SITE_URL` を追加
- **CORS `isSameOrigin()` ヘルパー追加**: `new URL(a).origin === new URL(b).origin` で完全一致判定、パース不能時は false (fail-safe) (`a2ed8d7`)
- getClientSiteUrl / getClientAuthRedirectUrl に 16 ケースのユニットテスト、isSameOrigin に 10 ケースの regression test を追加 (`06a4fb8`, `410e533`)

**担当**: Engineer_B（私）

---

### Bug#3: 本番 HTTP 運用 (nginx :80) で like / comment の API が一貫して 401 を返す
**発見**: Bug#2 修正後も記事アクションが失敗。Network タブでは `Set-Cookie` は来ているが、次のリクエストに cookie が付かない。

**根本原因** (2 層):
1. **Secure cookie の強制**: `proxy.ts` が session cookie を伝搬する際に `secure: process.env.NODE_ENV === "production"` でハードコード。nginx が :80 運用 (HTTPS 未設定) の現状では、Secure=true の cookie を HTTP 接続で受け取ったブラウザが**保存自体を拒否**するため次リクエストに載らない。
2. **supabase cookie options の破壊**: 同じく proxy.ts が `{ path: "/", sameSite: "lax", secure }` の 3 options しか引き継いでおらず、supabase-ssr が意図した `httpOnly` / `maxAge` / `expires` / `domain` / `priority` を全部捨てていた。結果、httpOnly 欠落で XSS 経由の token 窃取に晒される二重破壊。
3. **認証エラーが 500 に塗りつぶされる**: サーバ側 `throw new Error("Unauthorized")` が `handleError.ts` で `INTERNAL_SERVER_ERROR` (500) にまとめられ、クライアントが 401 として判定できず、ログイン誘導 UI が出なかった。

**修正**:
- `proxy.ts` に `isSecureRequest(request)` を新設: `X-Forwarded-Proto` ヘッダ優先 (`https, http` チェーンは先頭採用)、なければ `request.nextUrl.protocol` にフォールバック (`e0ae67f`)
- `propagateSessionCookies(source, target, secure)` を新設: supabase が付けた options を `...rest` で全部引き継ぎ、`secure` だけ動的上書き
- `proxy()` 内の 3 箇所の cookie コピーループを全て `propagateSessionCookies()` に置換
- `handleError.ts` に `AUTH_ERROR_TABLE` を導入し `throw new Error("Unauthorized" | "Forbidden" | "Not Found")` を 401 / 403 / 404 にマップ (`7f04067`)
- Prisma エラーの内部情報漏洩も合わせて修正 (`7df28a0` 🔴 security) — query error の message に DB schema が露出していた
- isSecureRequest に 7 ケース、propagateSessionCookies に 4 ケースの単体テストを追加 (`e0ae67f` / `d3cfc36`)

**担当**: Engineer_B (proxy.ts 関連) / Engineer_A (handleError / nginx X-Forwarded-Proto)

---

## 2. 追加で発見・修正したバグ（Tester_1 / CTO レビュー経由）

| # | 内容 | 修正 commit | 担当 |
|---|---|---|---|
| A1 | Zod validation エラーが handleError で 500 になっており Zod issues 詳細が本番レスポンスで漏洩 | `97588b4` (validation errorを400 VALIDATION_ERRORに正規化) | A |
| A2 | `TransitMode` enum が Zod スキーマで `z.enum([...])` ハードコードで BIKE/FLIGHT/SHIP が欠落 | `7ff4fab` (`z.nativeEnum` に統一) | F |
| A3 | `lib/constants/enums.ts` と `userEnumsStore` が Prisma enum と重複 → 二重管理による drift | `d4c07de`, `e07b695` (Prisma 由来に統一) | F |
| A4 | UIレイヤで `as any` / string literal enum 多用 → typo やリネーム時に漏れ発生 | `56ee1d6` (helpers に safe 変換関数追加) | F |
| A5 | ハードコード英語 (`Sign In` / `Edit Profile` / `alt="Background"` 等) が auth / profile モーダルで i18n バイパス | `f1f940d`, `922bae4`, `450c376` (4言語対応) | B |
| A6 | `messages/ja/ko/zh.json` で errors.loadFailed / rateLimited の翻訳キー欠落 → en fallback 表示 | `b8c410d` | B |
| A7 | docker build context が 474 MB (node_modules / .next / .git 等全部送信) → ビルド遅延 | `d7f6173` (`.dockerignore` 追加で数 MB に) | F |

---

## 3. UX / インフラ改善 (Tester_2 / CTO_2 レビュー経由)

- **4状態セクション (`sectionErrorState`)**: 全セクションに loading/error/empty/data を正規化 (`bb03bb4`, `f1cb411`, `5d34429`, `307a56a`, `57ea945`, `a32a0f9`) — Engineer_A
- **429 / 5xx リトライ + Retry-After**: `helpers.ts` の API layer に指数バックオフとヘッダ秒数解釈を追加 (`1d301f0`) — Engineer_A
- **無限スクロール error/retry 提供**: `useInfiniteScroll.ts` に error boundary と再試行 API を追加 (`1d301f0`) — Engineer_A
- **Redis graceful fallback**: Redis 不達時に DB フォールバックする層を追加 (`dfa9c27`) — Engineer_A
- **entrypoint.sh**: Redis 待機 / migration ガード / seed・recommend のフラグ化 / 依存待ちタイムアウト 60s (`f1462bd`, `8b0d5be`) — Engineer_A
- **nginx HTTPS 準備**: 443 用の設定を証明書配置後にコメント解除するだけで済む形に整備 (`c687d27`) — Engineer_A
- **RATE_LIMITED UX**: カウントダウン表示と CJK tracking 調整 (`08ebe0e`, `a1f74e7`) — Engineer_C/B
- **User.gender dead field 整理**: schema / store / API 全部一貫して削除 (`9591dfd`, `9955e38`) — Engineer_F

---

## 4. エンジニア別サマリー

| 担当 | 主な貢献領域 | 代表 commit |
|---|---|---|
| **Engineer_A** | Bug#3 の handleError / infra (nginx / entrypoint / graceful Redis / retry / SSL 準備) | `7f04067`, `dfa9c27`, `1d301f0`, `bb03bb4` |
| **Engineer_B** (私) | Bug#2 本体 + Bug#2-sub (Secure cookie / httpOnly 保持) / i18n auth & profile / auth E2E docs | `ac491dd`, `a2ed8d7`, `e0ae67f`, `410e533`, `f1f940d`, `922bae4`, `450c376` |
| **Engineer_C** | Bug#1 本体 (useLike / useComments / useShare / toastStore / loginPromptCard) | `eaf5fc3`, `9dbd286`, `a99b9c2`, `b93d5bf` |
| **Engineer_E** | env / docker / .env.example 整備 / build-arg 統一 / README 刷新 | `409643d`, `b8d6bfb`, `ac10576`, `53fbeb5`, `4d23da5` |
| **Engineer_F** | Prisma enum / Zod schema / enum store 統一 / dead field 整理 / dockerignore | `7ff4fab`, `d4c07de`, `56ee1d6`, `9591dfd`, `d7f6173` |

---

## 5. 本番デプロイ手順

### 5-1. 前提: 環境変数 (本番サーバの `.env` or CI secret)

```env
# 最重要: クライアントバンドルにインライン化される → build 前に必須
NEXT_PUBLIC_SITE_URL=https://routem.net

# Supabase (既存)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# DB / Redis / Meilisearch / OCI Object Storage 等は docker-compose-prod.yml 側で解決
```

完全版は `.env.example` 参照。`NEXT_PUBLIC_*` は全て `docker-compose-prod.yml` の `build.args` 経由で渡される（runtime container env では反映されない）。

### 5-2. ビルド & デプロイ

```bash
# 1) 既存イメージに localhost フォールバックが焼き付いているため必須
docker compose -f docker-compose-prod.yml build --no-cache app

# 2) 起動
docker compose -f docker-compose-prod.yml up -d

# 3) ログで起動確認 (entrypoint.sh が redis/postgres/meilisearch の準備完了を 60s タイムアウトで待機)
docker compose -f docker-compose-prod.yml logs -f app
```

### 5-3. Supabase Dashboard 側の必須設定

Authentication → URL Configuration → Redirect URLs に以下を登録:
- `http://routem.net/auth/callback` (HTTPS 切替までの一時)
- `https://routem.net/auth/callback` (HTTPS 切替後の本命)
- `http://localhost:3000/auth/callback` (dev 用)

未登録だと OAuth 成功後に Supabase 側で "Redirect URL not allowed" になり `/auth/auth-code-error` に飛ぶ。

### 5-4. HTTPS 切替 (Let's Encrypt)

現状 `nginx/conf.d/default.conf` は :80 のみアクティブ、:443 のブロックはコメントアウト済み。以下の手順で切替可能:

```bash
# 1) 証明書を発行 (nginx 停止不要、webroot plugin 使用想定)
certbot certonly --webroot -w /var/www/certbot -d routem.net \
  --email <admin@routem.net> --agree-tos --no-eff-email

# 2) 生成された fullchain.pem / privkey.pem を nginx コンテナがマウントする場所に配置
sudo cp /etc/letsencrypt/live/routem.net/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/routem.net/privkey.pem  nginx/ssl/

# 3) nginx/conf.d/default.conf の :443 ブロックをコメント解除、:80 → :443 リダイレクト有効化
# 4) docker-compose-prod.yml の "443:443" port と volume mount "./nginx/ssl:..." を有効化
# 5) nginx 再起動
docker compose -f docker-compose-prod.yml restart nginx
```

切替後は `X-Forwarded-Proto: https` が自動で付き、`isSecureRequest()` が true を返して Cookie に Secure 属性が付くようになる（`proxy.ts` の実装による自動追随、コード変更不要）。

### 5-5. デプロイ前後のスモーク

`.claude/auth-test-scenarios.md` の **Section 7 Go/No-Go チェックリスト** を Tester_1 / Tester_2 が埋めてから merge 判断。最低限以下の回帰確認必須項目が全 pass:
- SCN-2-1: HTTP 運用でブラウザ閉じ再訪問時のログイン維持
- SCN-3-2: `https://routem.net.evil.com` origin が 403 で拒否される
- SCN-4-1 / 4-2: 未ログイン 401 / ログイン済み 200
- SCN-5-2: HTTP 到達時に Secure=false の Cookie が保存される

`.claude/bug3-test-scenarios.md` の share / like / comment セクションも並行でチェック。

---

## 6. 計測指標

| 指標 | 値 |
|---|---|
| コミット数 | **53** |
| ファイル変更数 | **115** (insertions +6,507 / deletions −1,077) |
| 新規ファイル | 主要: `proxy.test.ts`, `lib/config/client.test.ts`, `lib/client/hooks/useLike.ts` / `useComments.ts` / `useShare.ts`, `lib/client/stores/toastStore.ts`, `app/[locale]/_components/common/ingredients/sectionErrorState.tsx` / `loginPromptCard.tsx` / `toastCard.tsx`, `lib/client/relativeTime.ts`, `.env.example`, `.claude/auth-test-scenarios.md` / `bug3-test-scenarios.md` / `backlog.md` |
| 削除ファイル | `lib/constants/enums.ts`, `lib/client/stores/searchEnumsStore.ts` / `userEnumsStore.ts`, `lib/auth/supabase/syncUsersDev.ts`, `lib/server/types.ts` |
| 新規テスト | **46 ケース** (proxy.test.ts 22, client.test.ts 16, handleError.test.ts 複数, buildPublicUrl.test.ts 複数) |
| 合計テスト | **209 pass / 1 fail** (1 fail は live fetch 依存の pre-existing、本 PR 変更と無関係) |
| TypeScript (`tsc --noEmit`) | **exit 0** |
| Next.js build | ✓ Compiled successfully / 67 static pages / no errors |
| ESLint | 138 errors / 146 warnings 残存 (主に旧コードの `no-explicit-any`)。 `.claude/backlog.md` H-5 として incremental に対応予定 |
| CTO レビューラウンド | Bug#2: 3 ラウンド (内 1 ラウンドは CTO_1 指摘の isSameOrigin テスト追加のみ) / Bug#3: 2 ラウンド / env: 1 ラウンド |

---

## 7. 既知の follow-up (`.claude/backlog.md` より抜粋)

本 PR でマージ対象外とした項目。優先順に:

### 🟡 Bug#3 follow-up
- **W-A**: `isForbiddenError` hook 追加、他人コメント削除試行 (403) を warning toast で可視化 — C
- **M2**: `LikeSummary` 型を camelCase 統一 (`{liked, like_count}` → `{isLiked, likeCount}`)。**破壊的変更**のためリリース計画と合わせて — C
- **N1 / N2 / N3 / N4**: useShare options memo / useLike 連打ガード ref 化 / Prisma log masking / useLike.test 修復 — C

### 🟡 Bug#1 follow-up
- **A-1**: `useInfiniteScroll.ts` のテスト追加 (429 backoff / 5xx retry / Retry-After) — A
- **A-2**: Redis fallback の integration test — A

### 🟡 Bug#2 follow-up
- **B-1**: `propagateSessionCookies` の maxAge/expires 保持 regression test（既に単体テストで保持自体は検証済、この follow-up は「実機 E2E レベルの検証」）— B
- **B-3**: Supabase Dashboard の Redirect URL 一覧を `.env.example` / README に追記 — B
- **B-4**: supabase-ssr chunked cookie (`sb-<project>-auth-token.0/.1/...`) の signOut 全削除検証 — B
- **B-5 / B-6 / B-7**: stale cookie 明示クリア / supabase-ssr メジャー bump 時の SameSite 回帰確認 / 多言語化 `/auth/callback` の locale prefix 吸収 — B

### 🟡 共通
- **H-1 / H-2**: Unauthorized を class 化、全 route に validateUser helper 導入 — D
- **H-4**: `app/api/v1/routes/route.test.ts` GET テストを MSW or skip 化 (現 1 件 failing の正体) — C/A
- **H-5**: ESLint 138 errors の incremental PR 分割 — 全員
- **H-6**: SSL 導入後に nginx / compose のコメント解除 — A/DevOps

---

## 8. リスクと緩和

| リスク | 緩和策 |
|---|---|
| HTTPS 未導入のまま本番で Secure=true cookie が設定され再ログイン地獄 | **解決済み**: `isSecureRequest()` が X-Forwarded-Proto を見て動的に Secure を切り替え、HTTP / HTTPS 両方で動作。SSL 切替後は nginx が `X-Forwarded-Proto: https` を付けるだけで自動追随 |
| NEXT_PUBLIC_SITE_URL 未設定でビルドされると localhost フォールバックが復活 | **解決済み**: `getClientSiteUrl()` が未定義で throw、build ログで即気づける。fallback を意図的に置かない設計 |
| サブドメイン詐称による CORS bypass | **解決済み**: `isSameOrigin()` で完全一致判定、URL.parse 不能な入力も fail-safe で拒否。10 ケースの regression test 追加済 |
| supabase cookie の httpOnly 欠落で XSS 経由 token 窃取 | **解決済み**: `propagateSessionCookies` で options を全部透過、secure のみ上書き。4 ケースの単体テスト追加済 |
| 401 が 500 に塗りつぶされてクライアントでログイン誘導できない | **解決済み**: `AUTH_ERROR_TABLE` で message/code ベースに 401/403/404 マップ、handleError.test.ts で網羅 |
| 並行エンジニア commit の race condition で my changes が別エンジニアの commit に巻き込まれる | **一部残**: commentItem.tsx が `f1f940d` に swept in された事象あり。履歴書き換えはしない方針。今後は `[COMMIT START]` 事前通知 + 1 bash command atomic で運用継続 |

---

## 9. 確認観点 (レビュアー向け)

コードレビューの導線として以下の順で読むと流れが追いやすい:

1. **Bug#2 から入る**: `lib/config/client.ts` → `proxy.ts` (`isSameOrigin` / `isSecureRequest` / `propagateSessionCookies`) → `app/auth/callback/route.ts` → `Dockerfile` / `docker-compose-prod.yml` → `lib/config/client.test.ts` / `proxy.test.ts`
2. **Bug#3 の handleError**: `lib/server/handleError.ts` + テスト → 各 API route の `throw new Error("Unauthorized")` 使用箇所
3. **Bug#1 の hooks**: `lib/client/hooks/useLike.ts` / `useComments.ts` / `useShare.ts` → `lib/client/stores/toastStore.ts` → 呼び出し側のボタンコンポーネント
4. **横断改善**: `lib/client/helpers.ts` の retry / `sectionErrorState.tsx` の 4 状態 / Prisma enum 統一
5. **i18n 修正**: `messages/*.json` diff → 3 tsx ファイル (auth / profile モーダル)
6. **docs**: `.env.example` / `README.md` / `.claude/auth-test-scenarios.md` / `.claude/bug3-test-scenarios.md` / `.claude/backlog.md`

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
