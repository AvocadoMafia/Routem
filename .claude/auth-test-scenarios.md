# 認証フロー E2E 検証シナリオ

Tester_1 / Tester_2 がリリース前の実機確認で使うシナリオ集。

対象ブランチ: `77-デプロイ準備`
関連 Bug: Bug#2 (OAuth redirect localhost 問題), Bug#3 (like/comment 401), Bug#2-sub (Secure cookie 保持)
関連ファイル: `proxy.ts`, `lib/config/client.ts`, `lib/auth/supabase/`, `app/auth/callback/route.ts`

---

## 0. 共通前提

### 0-1. テスト環境

| 環境 | URL | サーバ構成 | Secure Cookie |
|---|---|---|---|
| **dev** | `http://localhost:3000` | `npm run dev` 直起動 | false (HTTP) |
| **prod-http** (現行) | `http://routem.net` | nginx:80 → app:3000 | false (HTTP) |
| **prod-https** (SSL 導入後) | `https://routem.net` | nginx:443 → app:3000 | true |

### 0-2. 環境変数 (各環境で必須)

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000     # dev
NEXT_PUBLIC_SITE_URL=https://routem.net        # prod (HTTPS 前提で固定、HTTP 運用中でもこの値)
```

- **prod 側でビルド時に build-arg 必須**: docker-compose-prod.yml の build.args 経由で渡す
- 未設定 / 不正値でビルドされると `getClientSiteUrl()` が runtime で throw しログイン画面の Google ボタン押下で即失敗する（これは「気付ける失敗」なので意図通り）

### 0-3. Supabase Dashboard 側の設定

Authentication → URL Configuration → Redirect URLs に以下が登録されていること:
- `http://localhost:3000/auth/callback`
- `http://routem.net/auth/callback` (HTTP 運用時)
- `https://routem.net/auth/callback` (HTTPS 切替後に追加)

未登録だと Google 認証成功後に Supabase 側で "Redirect URL not allowed" になり `/auth/auth-code-error` に飛ぶ。

### 0-4. ブラウザ準備

- DevTools → Application → Cookies / Network タブを開いた状態でテストすること
- セッション汚染回避のため、各シナリオ開始前に **Incognito / Private ウィンドウ** を新規で開く
- 複数環境同時検証時はブラウザプロファイル / ブラウザ自体を分ける

---

## 1. OAuth (Google) ログインフロー

### SCN-1-1. dev 環境で Google ログイン成功

**目的**: OAuth redirect URL が localhost:3000 で組み立てられ、コールバック後ホームに遷移すること

**前提**: dev サーバ起動中 (`npm run dev`), Supabase Redirect URLs に `http://localhost:3000/auth/callback` 登録済み

**手順**:
1. シークレットウィンドウで `http://localhost:3000/login` を開く
2. DevTools Network タブを録画開始
3. 「Continue with Google」ボタンを押下
4. Google アカウント選択 → 認可許可
5. コールバック処理完了までネットワーク履歴を観察

**期待結果**:
- [ ] Step 3 で発火するリクエストの URL クエリに `redirect_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback` が含まれる（URL エンコード済みで OK）
- [ ] Google 認証後 `http://localhost:3000/auth/callback?code=...` にリダイレクトされる（**`localhost:3000` であること**が本シナリオの最重要確認項目）
- [ ] 最終的に `http://localhost:3000/` (ホーム) に着地する
- [ ] Application → Cookies に `sb-<project-ref>-auth-token` が保存されている
- [ ] Cookie の Secure 属性が **false**（HTTP 接続のため）
- [ ] Cookie の HttpOnly 属性が **true**
- [ ] Cookie に `Max-Age` または `Expires` が設定されている（セッション cookie ではない）

**失敗シグナル**:
- ❌ redirect_to に `routem.net` が混入 → ビルド時の NEXT_PUBLIC_SITE_URL 設定ミス
- ❌ Cookie が保存されない → proxy.ts の Secure 判定問題 (Bug#2-sub)
- ❌ `/auth/auth-code-error` に着地 → Supabase Redirect URLs 未登録

---

### SCN-1-2. prod (HTTP 運用) で Google ログイン成功

**目的**: 本番 HTTP 運用下でも OAuth フローが完了し、Cookie が保存されること（Bug#2-sub の主眼）

**前提**:
- 本番サーバで `NEXT_PUBLIC_SITE_URL=https://routem.net` で **ビルド済み**（※HTTP 運用中でも値は https にしておく、将来の SSL 切替で破綻しないため）
- Supabase Redirect URLs に `http://routem.net/auth/callback` と `https://routem.net/auth/callback` 両方登録済み
- nginx 設定に `proxy_set_header X-Forwarded-Proto $scheme;` が全 location で入っている

**手順**: SCN-1-1 と同じ、URL だけ `http://routem.net` に置換

**期待結果**:
- [ ] redirect_to が `https%3A%2F%2Froutem.net%2Fauth%2Fcallback` になる（ビルド時に https で固定されているため）
- [ ] Google 認証後、Supabase は `https://routem.net/auth/callback` にリダイレクトしようとするが、ブラウザは **nginx:80 のみなので HTTPS 接続に失敗する可能性**がある
  - ここがグレーゾーン: HTTPS 未設定時は `NEXT_PUBLIC_SITE_URL=http://routem.net` に一時的に戻すか、Supabase の Site URL 設定で吸収する
- [ ] Cookie の **Secure 属性 = false** (X-Forwarded-Proto: http なので isSecureRequest が false → Secure=false で発行される)
- [ ] Cookie の HttpOnly = true, Max-Age 設定あり
- [ ] ログイン後ホームに着地、ユーザーアイコンが表示される

**注意**: HTTPS 切替完了までは SCN-1-2 は「HTTP のみ運用」向けとして `NEXT_PUBLIC_SITE_URL=http://routem.net` でビルドしたイメージで検証すること。HTTPS 切替後に SCN-1-3 へ移行。

---

### SCN-1-3. prod (HTTPS 切替後) で Google ログイン成功

**目的**: HTTPS 本番運用で Secure cookie が正しく発行されること

**前提**: nginx :443 有効 + 証明書配置, `NEXT_PUBLIC_SITE_URL=https://routem.net` で再ビルド

**手順**: SCN-1-1 と同じ、URL だけ `https://routem.net` に置換

**期待結果**:
- [ ] 最終的に `https://routem.net/` に着地、鍵マーク (🔒) が URL バーに表示
- [ ] Cookie の **Secure 属性 = true** (X-Forwarded-Proto: https → isSecureRequest が true)
- [ ] HTTP → HTTPS リダイレクトが nginx で効いている
- [ ] HttpOnly = true, Max-Age 設定あり

---

## 2. セッション永続性

### SCN-2-1. ブラウザ閉じ再訪問でログイン維持 (HTTP 運用)

**目的**: Max-Age / Expires が cookie に保持されているため、ブラウザを閉じてもセッションが消えないこと（旧実装で破壊されていた挙動の回帰防止）

**手順**:
1. SCN-1-2 でログイン完了
2. Application → Cookies で `sb-*-auth-token` の Max-Age/Expires を記録
3. ブラウザを **完全終了** (Cmd+Q / Alt+F4)
4. ブラウザ再起動 → `http://routem.net/` にアクセス

**期待結果**:
- [ ] ログイン状態のまま（ユーザーアイコンが表示されており、/login へリダイレクトされない）
- [ ] Cookie が引き続き存在、Max-Age/Expires が手順 2 の値とほぼ一致（残時間が減っているだけ）
- [ ] `/api/v1/users/me` 等の認証必須 API が 200 で返る

**失敗シグナル**:
- ❌ ブラウザ再起動でログアウト状態になる → Max-Age/Expires が破壊されている（propagateSessionCookies 未適用 or 破損）
- ❌ Cookie は残っているが 401 が返る → Cookie 値が session のみで実態が失効している（Expires が正しくないまたは supabase 側で無効化）

---

### SCN-2-2. ログアウトでセッション完全クリア

**手順**:
1. ログイン済み状態からヘッダー右上 → ログアウト
2. Application → Cookies を確認
3. ブラウザを閉じて再起動 → `/` にアクセス

**期待結果**:
- [ ] ログアウト直後に `sb-*-auth-token` cookie が削除されている（Application タブから消える、または値が空＋即時期限切れ）
- [ ] 再訪問で `/login` 画面相当 or 未ログイン UI が表示される

---

## 3. CORS 境界テスト

### SCN-3-1. 同一オリジンからの API コールは成功

**手順**:
1. `https://routem.net` をブラウザで開く
2. DevTools Console で:
   ```js
   fetch('/api/v1/routes').then(r => console.log(r.status))
   ```

**期待結果**:
- [ ] 200 が返る
- [ ] Network タブでレスポンスヘッダに `Content-Security-Policy: default-src 'none'` 等のセキュリティヘッダが付いている (applyApiSecurityHeaders)

---

### SCN-3-2. サブドメイン詐称オリジンは拒否 (isSameOrigin 回帰)

**目的**: 過去の `origin.includes()` 判定で通っていた `routem.net.evil.com` を確実にブロック

**手順** (curl で Origin ヘッダ偽装):
```bash
curl -i -H "Origin: https://routem.net.evil.com" \
     -H "sec-fetch-site: cross-site" \
     https://routem.net/api/v1/routes
```

**期待結果**:
- [ ] HTTP **403** が返る
- [ ] ボディに `{"error":"Forbidden: Invalid Origin"}`
- [ ] サーバログに `[Blocked] Unauthorized origin:https://routem.net.evil.com`

**追加パターン** (すべて 403 になること):
- `Origin: https://evil.com` (完全別オリジン)
- `Origin: http://routem.net` (プロトコル違い)
- `Origin: https://routem.net:8443` (ポート違い)
- `Origin: not-a-url` (パース不能、fail-safe 拒否)

---

### SCN-3-3. localhost から prod API は拒否

**手順** (ローカル開発端末から):
```bash
curl -i -H "Origin: http://localhost:3000" \
     -H "sec-fetch-site: cross-site" \
     https://routem.net/api/v1/routes
```

**期待結果**:
- [ ] HTTP **403** (Invalid Origin)

---

## 4. 認証必須 API の動作

### SCN-4-1. 未ログインで保護 API → 401

**手順** (Incognito + 未ログイン):
```bash
curl -i -X POST https://routem.net/api/v1/routes/<valid-route-id>/likes
```

**期待結果**:
- [ ] HTTP **401**
- [ ] ボディは `{"code":"UNAUTHORIZED","message":"Unauthorized"}` 形式 (handleError.ts の AUTH_ERROR_TABLE マップ)
- [ ] ❌ 500 `INTERNAL_SERVER_ERROR` が返ったら Bug 再発（handleError の matchAuthError 失敗）

---

### SCN-4-2. ログイン済みで保護 API → 200

**手順**:
1. ブラウザでログイン済み状態を用意
2. 同一ブラウザのコンソールから:
   ```js
   fetch('/api/v1/routes/<valid-route-id>/likes', { method: 'POST' })
     .then(r => r.json()).then(console.log)
   ```

**期待結果**:
- [ ] HTTP **200**
- [ ] like が DB に保存される (ホーム等で UI reflect 確認)

---

### SCN-4-3. セッション期限切れで 401 + ログイン誘導

**再現手順**:
1. ログイン済み状態で、Application → Cookies の `sb-*-auth-token` を **手動削除**
2. UI 上で Like ボタンを押下

**期待結果**:
- [ ] ネットワークで 401 が返る
- [ ] クライアント側でログイン誘導トースト / loginPromptCard 相当の UI が表示される
- [ ] もう一度押してもループせず、ログイン画面へのリンクが明示される

---

## 5. X-Forwarded-Proto の挙動 (isSecureRequest)

### SCN-5-1. nginx 経由で X-Forwarded-Proto: https → Secure=true

**前提**: HTTPS 環境

**手順**:
1. HTTPS でログイン
2. Application → Cookies で `sb-*-auth-token` の属性を確認

**期待結果**:
- [ ] **Secure = true**
- [ ] HttpOnly = true
- [ ] SameSite: 値は supabase 側設定のまま（Lax が既定）

---

### SCN-5-2. nginx 経由で X-Forwarded-Proto: http → Secure=false

**前提**: HTTP 運用 (nginx:80)

**手順**:
1. HTTP でログイン
2. Cookie 属性確認

**期待結果**:
- [ ] **Secure = false** (HTTP でも Cookie がブラウザに保存されるようになる)
- [ ] HttpOnly = true (維持される)
- [ ] Max-Age または Expires 設定あり

**失敗シグナル**:
- ❌ Secure=true が付いて Cookie がそもそも送信されない → isSecureRequest の判定ミス or proxy.ts 反映漏れ
- ❌ HttpOnly が欠落 → propagateSessionCookies 未適用

---

### SCN-5-3. X-Forwarded-Proto チェーン値の先頭採用

**手順** (nginx 多段 or curl で直接送信):
```bash
curl -i -H "X-Forwarded-Proto: https, http" \
     -H "Cookie: sb-<ref>-auth-token=<valid>" \
     http://app-host:3000/
```

**期待結果**:
- [ ] Cookie Set-Cookie の Secure=true（先頭 `https` を採用）

---

### SCN-5-4. X-Forwarded-Proto 未設定時の nextUrl.protocol フォールバック

**手順**: `X-Forwarded-Proto` ヘッダを付けない状態で dev サーバ (`http://localhost:3000`) に直接アクセスしてログイン

**期待結果**:
- [ ] Secure=false (nextUrl.protocol = "http:" へフォールバックして false 判定)

---

## 6. 回帰防止テスト早見表 (自動テスト側との対応)

| シナリオ | 単体テスト | テストファイル |
|---|---|---|
| SCN-3-2 サブドメイン詐称拒否 | isSameOrigin("https://routem.net.evil.com", "https://routem.net") → false | `proxy.test.ts` |
| SCN-3-2 プロトコル違い | isSameOrigin("http://", "https://") → false | `proxy.test.ts` |
| SCN-5-1 X-Forwarded-Proto: https | isSecureRequest({proto: "https"}) → true | `proxy.test.ts` |
| SCN-5-2 X-Forwarded-Proto: http | isSecureRequest({proto: "http"}) → false | `proxy.test.ts` |
| SCN-5-3 チェーン先頭 | isSecureRequest({proto: "https, http"}) → true | `proxy.test.ts` |
| SCN-5-4 フォールバック | isSecureRequest({nextUrl: "https:"}) → true | `proxy.test.ts` |
| SCN-2-1 options 保持 | propagateSessionCookies が httpOnly/maxAge 維持 | `proxy.test.ts` |
| OAuth redirect URL 生成 | getClientAuthRedirectUrl() → "${SITE_URL}/auth/callback" | `lib/config/client.test.ts` |
| SITE_URL 検証 | スキーム抜けで throw | `lib/config/client.test.ts` |
| SCN-4-1 401 マッピング | matchAuthError({message: "Unauthorized"}) → 401 | `lib/server/handleError.test.ts` (既存) |

実機シナリオで failing が出た場合、まず対応する単体テストが通っているか確認し、通っていれば「wiring 側 (proxy.ts / handleError.ts 呼び出し箇所 / supabase 設定) の問題」と切り分ける。

---

## 7. チェックリスト (リリース Go/No-Go)

リリース判定会議で以下の表を埋める:

| シナリオID | 実行環境 | 実施者 | 実施日時 | 結果 | 備考 |
|---|---|---|---|---|---|
| SCN-1-1 | dev | | | ☐ Pass / ☐ Fail | |
| SCN-1-2 | prod-http | | | ☐ Pass / ☐ Fail | HTTPS 切替前限定 |
| SCN-1-3 | prod-https | | | ☐ Pass / ☐ Fail | HTTPS 切替後に実施 |
| SCN-2-1 | prod-http | | | ☐ Pass / ☐ Fail | **Bug#2-sub 回帰確認**: 必須 |
| SCN-2-2 | prod-http | | | ☐ Pass / ☐ Fail | |
| SCN-3-1 | prod-http | | | ☐ Pass / ☐ Fail | |
| SCN-3-2 | prod-http | | | ☐ Pass / ☐ Fail | **CORS bypass 回帰確認**: 必須 |
| SCN-3-3 | prod-http | | | ☐ Pass / ☐ Fail | |
| SCN-4-1 | prod-http | | | ☐ Pass / ☐ Fail | **Bug#3 回帰確認**: 必須 |
| SCN-4-2 | prod-http | | | ☐ Pass / ☐ Fail | **Bug#3 回帰確認**: 必須 |
| SCN-4-3 | prod-http | | | ☐ Pass / ☐ Fail | |
| SCN-5-1 | prod-https | | | ☐ Pass / ☐ Fail | HTTPS 切替後 |
| SCN-5-2 | prod-http | | | ☐ Pass / ☐ Fail | **Bug#2-sub 回帰確認**: 必須 |
| SCN-5-3 | 任意 | | | ☐ Pass / ☐ Fail | |
| SCN-5-4 | dev | | | ☐ Pass / ☐ Fail | |

**Go 条件**: 上記「回帰確認必須」マーク付きが全て Pass、かつその他の該当環境シナリオが全て Pass。
