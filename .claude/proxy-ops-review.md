# proxy.ts 運用観点レビュー（Engineer_E）

レビュー対象: `proxy.ts`（+ 関連ファイル: `lib/auth/supabase/proxy.ts`, `nginx/conf.d/default.conf`）
レビュー日: 2026-04-19
レビュー担当: Engineer_E
対応コミット: Engineer_B 実装分（e0ae67f / b455129 ほか、CTO_1 PASS #2-sub 済）

## サマリ

現行実装は **運用観点で堅実**。致命的な脆弱性や機能破綻のリスクは検出されず。
以下に列挙する改善提案はいずれも **polish-level / 将来拡張時に再検討すべき観点** であり、即時対応を要するものはない。

## レビュー結果

### 1. X-Forwarded-Proto / X-Forwarded-For の多段 proxy 耐性

**結論**: 現行の nginx→app 1 段構成では問題なし。CDN 多段化時に再検討が必要。

- `proxy.ts:isSecureRequest` は `X-Forwarded-Proto` 先頭値（`split(",")[0]`）を参照し、チェーン化にも最低限対応。
- `nginx/conf.d/default.conf` は `proxy_set_header X-Forwarded-Proto $scheme;` で全 location から確実に上書きしており、client 由来のヘッダは破棄される。
- `app` コンテナは `expose: "3000"` で外部公開されておらず、**nginx 経由でしか到達不可**。任意 client が偽の `X-Forwarded-Proto` を送っても届かない構成。

**懸念（将来 CDN 前段化時）**:
- Cloudflare / CloudFront 等を前段に置く場合、`X-Forwarded-Proto: https, http` のようにチェーンされる可能性あり。先頭を見る現実装で問題ないが、**CDN の `X-Forwarded-Proto` を信頼する条件**（信頼 IP リスト）が app 側に無いため、万一 CDN を経由せず nginx に直接届いた場合は偽値を信じてしまう。
- 推奨: CDN 導入時に nginx 側で `set_real_ip_from <cdn_cidr>;` と `real_ip_header X-Forwarded-For;` を設定し、実 client IP と proto を正しく取り直す。

### 2. Session cookie の SameSite 属性

**結論**: `Lax`（supabase-ssr デフォルト）で運用上問題なし。`None; Secure` は不要。

- `propagateSessionCookies` は supabase-ssr が set した cookie options（`httpOnly` / `maxAge` / `expires` / `domain` / `sameSite` / `priority`）を**全て保持**し、`secure` のみ実プロトコルで上書きする設計。この実装により:
  - `httpOnly` が確実に維持されるため XSS 経由の token 流出を防げる
  - `maxAge` / `expires` が維持されるためブラウザ閉じで即ログアウトしない
- OAuth フロー（`supabase.auth.exchangeCodeForSession`）は `/auth/callback` 経由の **同一サイト内遷移** で完結するため `SameSite=Lax` で十分（`None` が必要なのは iframe / cross-site form-submit を伴う場合のみ）。
- ゲスト用 `NEXT_LOCALE` cookie は `sameSite: "lax"` 固定、`httpOnly` なし（JS から UI 切替で参照するため）。これは妥当。

**懸念（将来拡張時）**:
- ブラウザ拡張や iframe embed を導入した場合、SameSite=Lax だと session cookie が届かないケースが出る。その際は OAuth callback / CORS 経路だけ `SameSite=None; Secure` に切り替える必要がある（現時点では該当ユースケースなし）。
- `supabase-ssr` メジャーアップデート時に SameSite デフォルトが変わる可能性。アップデート後は session 維持のリグレッションテスト推奨。

### 3. Supabase session の refresh 失敗時のハンドリング

**結論**: fail-close（未ログイン扱いで /login リダイレクト）で妥当。致命的な穴なし。

- `lib/auth/supabase/proxy.ts:updateSession` は `supabase.auth.getClaims()` で session 検証。refresh は supabase-ssr 内部が cookie 経由で silent refresh する実装で、失敗時は `data.claims` が null となり proxy で /login リダイレクトへ倒れる。
- Supabase 一時障害時でも、ユーザーは再ログインする動線に倒れるだけで**過去 session で誤って認可が通る等のリスクはない**。

**軽微な改善案（優先度低）**:
- refresh 失敗で stale な `sb-*-auth-token` cookie が残存し続けると、以降のリクエストでも無駄に検証が走る。`getClaims()` が失敗した場合に supabase-ssr の `removeAll` で cookie を明示クリアするとクリーンになる（ただし現状でも次回ログイン時に新 token で上書きされるため実害は小さい）。

### 4. 長期運用での cookie 肥大化

**結論**: 現状は問題なし。監視対象としての留意のみ。

- supabase-ssr の session cookie は access token + refresh token で約 1〜2 KB。大きい token は `sb-<project>-auth-token.0`, `.1` ... と chunking される仕様のため **4 KB 上限を超えない**。
- 自前で set しているのは `NEXT_LOCALE`（数 bytes）と supabase の session cookie のみ。不要な cookie 蓄積なし。

**懸念**:
- `signOut` 時に supabase-ssr chunked cookie（`.0`, `.1` ...）が**全て**削除されているかは proxy.ts の範疇外で、`lib/auth/logout.ts` 相当の実装（未レビュー）に依存する。将来の **"ログアウトしても session 残る"** 系バグが出た場合、この chunking 削除漏れを最初に疑う。

### 5. その他の運用観点での気付き

- **API 層の security header**: `applyApiSecurityHeaders` で `Content-Security-Policy: default-src 'none'` を付与。JSON API なら過剰に無害。ページ layer には `next.config.ts` / route 固有の response で別途 CSP を付けたほうがよい（今回スコープ外）。
- **Rate limit との整合**: nginx 側で `api_read_limit` / `api_write_limit` を method 別にゾーン分離。proxy.ts の CORS 拒否（403）は rate limit 適用後に走るため、意図しない request を 429 より先に 403 で弾ける。順序として正しい。
- **OAuth コールバック専用分岐**: `pathname.startsWith("/auth/callback")` は intl middleware を経由させないショートパス。Locale prefix 付き `/ja/auth/callback` 等が来た場合この分岐に入らないが、Supabase の Redirect URLs 設定で `https://routem.net/auth/callback` 固定にしているため問題なし（多言語化された callback path を追加する際は要修正）。

## 改善提案（優先度順）

| # | 内容 | 優先度 | 対応時期 |
| --- | --- | --- | --- |
| A | CDN 前段化時に nginx `set_real_ip_from` + `real_ip_header` を設定 | Medium | CDN 導入時 |
| B | `signOut` 処理で supabase-ssr chunked cookie の完全削除を検証（別タスク） | Medium | 次の session 系バグ報告時 |
| C | `getClaims()` 失敗時の stale cookie 明示クリア | Low | 余力時 |
| D | supabase-ssr メジャーアップデート時に SameSite デフォルト回帰確認 | Low | 依存アップデート時 |
| E | 多言語化された auth callback path が出る場合は `pathname.startsWith` 分岐を正規表現化 | Low | 該当ユースケース発生時 |

いずれも**ブロッカーではない**。現行実装のまま本番投入して差し支えない。

## 関連ファイル

- `proxy.ts`
- `lib/auth/supabase/proxy.ts`
- `nginx/conf.d/default.conf`
- Engineer_B 実装コミット: e0ae67f / b455129 （CTO_1 PASS 済）
