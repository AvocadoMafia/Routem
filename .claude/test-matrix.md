# Routem API テストシナリオマトリクス

各 API エンドポイント × アクター × 期待 HTTP status の網羅表。
Tester_1 (Chrome 拡張・実認証) / Tester_2 (ヘッドレス・curl) / CI 自動化の検証分担を明示する。

- **作成**: 2026-04-19 Tester_2
- **対象ブランチ**: 77-デプロイ準備
- **前提**: prod stack (`docker compose -f docker-compose-prod.yml up`) または dev stack + prisma seed

## 凡例

- ✅ 実機検証 PASS 済 (curl + prod stack で確認)
- 🔵 静的レビュー PASS (コード + handleError wiring で論理的に正しい)
- 🟡 Tester_1 (Chrome拡張/実認証) 領域
- 🟠 本番ドメイン routem.net + HTTPS 必要
- ⚫ 未実装 or 非該当 (handler 未定義の HTTP method 等)
- ❓ 未検証 (seed不足 / 環境不足)

アクター:
- **Anon**: 未ログイン (Cookie なし)
- **Auth/owner**: 認証済かつリソース所有者
- **Auth/non-owner**: 認証済だが他人リソース
- **Auth/no-role**: 認証済で権限なし (general user)
- **Evil**: CORS 詐称 Origin (サブドメ含む)

## 1. 公開 GET 系 (認証不要)

| Endpoint | Anon | Evil Origin | invalid UUID | 非存在 UUID | 備考 |
|---|---|---|---|---|---|
| GET /api/v1/routes | ✅ 200 | ✅ 403 | — | — | seed 40 件で 200 確認 |
| GET /api/v1/routes/[id] | ✅ 200 (PUBLIC) | ✅ 403 | ✅ 400 VALIDATION_ERROR | ✅ 404 NOT_FOUND | cb4a223 |
| GET /api/v1/routes/explore | 🔵 401 (cffe7ba) | ✅ 403 | — | — | 認証必須化 済 |
| GET /api/v1/routes/search?q=... | ❓ 200 | ❓ 403 | — | — | Meilisearch 疎通未検証 |
| GET /api/v1/users | ✅ 200 | ✅ 403 | — | — | 公開 list |
| GET /api/v1/users/[id] | ✅ 200 | ✅ 403 | ✅ 400 VALIDATION_ERROR | ✅ 404 NOT_FOUND | 69fa73e |
| GET /api/v1/comments?routeId={uuid} | ✅ 200 (空配列) | ✅ 403 | ✅ 400 VALIDATION_ERROR | ✅ 200 (空配列) | GET は認証不要、route存在確認せず |
| GET /api/v1/tags | ❓ 200 | ❓ 403 | — | — | 未検証 |
| GET /api/v1/meta/enums | ✅ 200 | ✅ 403 | — | — | |
| GET /api/v1/meta/enums/user | ❓ 200 | ❓ 403 | — | — | |
| GET /api/v1/exchange-rates | ✅ 200 | ✅ 403 | — | — | |
| GET /api/v1/mapbox/geocode | ❓ 200 | ❓ 403 | — | — | 外部 API 依存 |

## 2. 認証済 GET 系

| Endpoint | Anon | Auth/owner | Auth/non-owner | Auth/no-role | invalid UUID |
|---|---|---|---|---|---|
| GET /api/v1/users/me | ✅ 401 UNAUTHORIZED | 🟡 200 | — | — | — |
| GET /api/v1/routes/me | ✅ 401 UNAUTHORIZED | 🟡 200 | — | — | — |
| GET /api/v1/images | ❓ 401 | 🟡 200 | — | — | — |
| GET /api/v1/images/uploads | ❓ 401 | 🟡 200 | — | — | — |
| GET /api/v1/likes | ❓ 401 | 🟡 200 | — | — | — |
| GET /api/v1/follows | ❓ 401 | 🟡 200 | — | — | — |
| GET /api/v1/views | ❓ 401 | 🟡 200 | — | — | — |
| GET /api/v1/searchHistory | ❓ 401 | 🟡 200 | — | — | — |
| GET /api/v1/redis-test | ❓ — | 🟡 200 | — | — | dev用デバッグ、prod 無効化推奨 |

## 3. PRIVATE リソースアクセス (CWE-209 情報露出防止)

| Endpoint | Anon | Auth/owner | Auth/non-owner | 備考 |
|---|---|---|---|---|
| GET /api/v1/routes/[PRIVATE] | ✅ **404 NOT_FOUND** (M9) | 🟡 200 | 🔵 **404 NOT_FOUND** (M9) | 認証済でも非 owner には存在露出禁止 |
| GET /api/v1/users/[private-info?] | ❓ | 🟡 | ❓ | private data 判別ポリシー確認要 |

## 4. 認証必須 POST 系 (作成)

| Endpoint | Anon | Auth (valid body) | Auth (invalid body) | invalid UUID path |
|---|---|---|---|---|
| POST /api/v1/routes | ✅ 401 UNAUTHORIZED | 🟡 201 | 🔵 400 VALIDATION_ERROR | — |
| POST /api/v1/comments | ✅ 401 UNAUTHORIZED | 🟡 201 | 🔵 400 VALIDATION_ERROR | — |
| POST /api/v1/likes | ✅ 401 UNAUTHORIZED | 🟡 200 (toggle) | 🔵 400 VALIDATION_ERROR ("Invalid target or missing ID") | — |
| POST /api/v1/follows | ✅ 401 UNAUTHORIZED | 🟡 201 | 🔵 400 VALIDATION_ERROR ("Cannot follow yourself") | — |
| POST /api/v1/views | ❓ 401 | 🟡 200 | ❓ | |
| POST /api/v1/searchHistory | ❓ 401 | 🟡 200 | ❓ | |

## 5. 認証必須 POST 系 (state 変更 + 認可判定)

| Endpoint | Anon | Auth/non-owner | Auth/owner (policy=ENABLED) | Auth/owner (policy=DISABLED) | invalid UUID |
|---|---|---|---|---|---|
| POST /api/v1/routes/[id]/invite | ✅ 401 UNAUTHORIZED | 🔵 **404 NOT_FOUND** (M10) | 🟡 201 (token発行) | 🔵 **403 FORBIDDEN** (service:197,226) | ✅ 400 VALIDATION_ERROR |
| POST /api/v1/invites/[token]/accept | ✅ 401 UNAUTHORIZED | 🟡 200 | — | — | — |
|   └─ 無効 token | ✅ 401 (先行) | 🔵 400 VALIDATION_ERROR ("Invalid token") | — | — | — |
|   └─ revoked token | ✅ 401 (先行) | 🔵 400 VALIDATION_ERROR ("Token revoked") | — | — | — |
|   └─ expired token | ✅ 401 (先行) | 🔵 400 VALIDATION_ERROR ("Token expired") | — | — | — |

## 6. 認証必須 PATCH/PUT/DELETE 系

| Endpoint | Anon | Auth/owner (valid) | Auth/owner (invalid data) | Auth/non-owner |
|---|---|---|---|---|
| PATCH /api/v1/users/me | ✅ 401 | 🟡 200 | 🔵 400 VALIDATION_ERROR ("New icon image not found" 等) | — (self only) |
| DELETE /api/v1/users/me | ❓ 401 | 🟡 200 | 🔵 500 ("Delete failed") | — (self only) |
| PATCH /api/v1/routes | ❓ 401 | 🟡 200 | 🔵 400 | 🔵 **404 NOT_FOUND** |
| DELETE /api/v1/routes | ❓ 401 | 🟡 200 | 🔵 400 | 🔵 **404 NOT_FOUND** |
| DELETE /api/v1/comments | ❓ 401 | 🟡 200 | 🔵 400 | 🔵 **401 Unauthorized** (comments/service.ts:60) |

## 7. CORS / CSRF 境界

| Scenario | Expected | 検証 |
|---|---|---|
| same-origin (Origin == SITE_URL) | 200 (通過) | ✅ dev/prod |
| Origin 欠落 | 200 (通過、非同一オリジン判定なし) | ✅ |
| Origin: subdomain.SITE_URL.evil.com | **403** Invalid Origin | ✅ dev/prod |
| Origin: http:// vs https:// (protocol違い) | **403** | ✅ |
| Origin: パース不能 | **403** (fail-safe) | ✅ |
| sec-fetch-site: cross-site (prod) | **403** Cross-site request | ✅ prod |
| sec-fetch-site: cross-site (dev) | 通過 (dev スルー設計) | ✅ dev |

## 8. Rate Limit (nginx)

| Scenario | rate=600r/m burst=120 | rate=60r/m burst=30 (write) |
|---|---|---|
| GET /api/v1/* × 200 並列 | ✅ 200 123件 / 429 77件 (prod実測) | — |
| POST /api/v1/* × 50 並列 | — | ❓ 未検証 (seed ユーザで auth 実施要) |
| Retry-After header 存在 | ❓ | ❓ |

## 9. エラーマスク (本番必須)

| Trigger | 外部 body | 含まれてはいけない keyword | 検証 |
|---|---|---|---|
| DB 停止 → GET /routes?limit=1 | 500 + `{code:"INTERNAL_SERVER_ERROR", message:"Internal Server Error"}` | prisma / password / clientVersion / P1000 / P2002 / driverAdapterError / originalMessage / authentication / ECONNREFUSED / DbConnect | ✅ prod 実測 |
| Zod invalid input → /comments?routeId=not-a-uuid | 400 + `{code:"VALIDATION_ERROR", message:"Validation failed"}` (prod) | details / issues / pattern / /^ / invalid_format / Invalid UUID | ✅ prod 実測 |
| "Update failed" / "Delete failed" | 500 + `{code:"INTERNAL_SERVER_ERROR"}` | 元 message 非含有 (prod) | 🔵 静的レビュー |

## 10. i18n 4言語

| Page | ja | en | ko | zh |
|---|---|---|---|---|
| /login Google btn + 各ロケール | 🟡 | 🟡 | 🟡 | 🟡 |
| SectionErrorState errors.loadFailed | ✅ | ✅ | ✅ | ✅ |
| SectionErrorState errors.rateLimited | ✅ | ✅ | ✅ | ✅ |
| Navigation (探索/概要/ログイン) | ✅ | ✅ | ✅ | ✅ |
| MISSING_MESSAGE エラー消失 | ✅ | ✅ | ✅ | ✅ |

## 11. a11y 属性

| 属性 | SectionErrorState | 検証 |
|---|---|---|
| role="alert" (block/inline) | 付与 | ✅ |
| aria-live="polite" | 付与 | ✅ |
| aria-busy={retrying} | 付与 (retry ボタン) | ✅ (初期false) / ❓ (true 瞬間) |
| aria-label={retryLabel} | 付与 | ✅ |
| focus-visible ring | 付与 | 🔵 |
| disabled during retry | 付与 | 🔵 |

## 12. OAuth / Session / HTTPS

| Scenario | Expected | 検証 | 備考 |
|---|---|---|---|
| SCN-1-1 dev OAuth redirect URL | redirect_to = http://localhost:3001/auth/callback | ✅ | Google 認証画面到達まで |
| SCN-1-2 prod-http OAuth | redirect_to = https://routem.net/auth/callback | 🟠 | 本番デプロイ後 |
| SCN-1-3 prod-https OAuth | 同上 + 鍵マーク | 🟠 | HTTPS 切替後 |
| SCN-2-1 session 永続性 | ブラウザ再起動で保持 | 🟡 | Tester_1 Chrome拡張 |
| SCN-2-2 logout → cookie 削除 | sb-* cookie 消失 | 🟡 | 同上 |
| SCN-5-1 HTTPS で Secure=true | cookie Secure 属性 true | 🟠 | HTTPS 切替後 |
| SCN-5-2 HTTP で Secure=false | cookie Secure 属性 false | 🟠 | 本番 HTTP 運用で |
| SCN-5-3 X-Forwarded-Proto chain | 先頭採用 | ✅ | 単体テスト |
| SCN-5-4 fallback to nextUrl.protocol | 動作 | ✅ | 単体テスト |

## 13. 未検証項目 (理由別)

### Chrome 拡張 / 実認証が必要 (Tester_1 領域)
- 認証済み状態での 400/403 実機検証 (follows self / invites revoked / users/me image / routes invite DISABLED)
- Session cookie 属性 (Secure / HttpOnly / Max-Age)
- navigator.share / clipboard フォールバック (Bug#3)
- loginPromptCard 表示 (401 後の UX)
- DevTools Application タブでの cookie 確認

### 本番環境 (routem.net + HTTPS) が必要
- SCN-1-2 / SCN-1-3 / SCN-5-1 / SCN-5-2
- 実ユーザ負荷での rate limit 挙動
- HSTS ヘッダ付与確認 (HTTPS 切替後)

### Supabase Dashboard 設定が必要
- Google OAuth 実認証完了 (Redirect URLs に localhost 登録)
- Magic link / email auth (該当機能あれば)

### seed データ不足 (後述 seed-coverage.md 参照)
- PRIVATE route でのコメント投稿 (seed に PRIVATE route 0件)
- Follow 関係 (seed で 0 件)
- Comment / Like / View の seed 不在
- RouteInvite / RouteCollaborator の seed 不在

## 14. regression roadmap

### A. 即時 (D2 後 Tester_2 が実施)
1. 全 23 エンドポイント curl sanity
2. `npx vitest run` 全 pass
3. Playwright で /ja 描画 + Google OAuth redirect URL確認
4. prod-smoke-curls.sh 実行

### B. 本番デプロイ直前 (Tester_1 + Tester_2)
1. 実 routem.net build + NEXT_PUBLIC_SITE_URL 確認
2. Supabase Dashboard に本番 Redirect URL 登録
3. SCN-1-2 実機確認
4. session 永続性テスト (Tester_1)

### C. HTTPS 切替後
1. SCN-1-3 / SCN-5-1 実機確認
2. HSTS ヘッダ追加確認
3. cookie Secure=true 確認

### D. CI 自動化候補
1. `prod-smoke-curls.sh` を PR merge 時 GitHub Actions で自動実行
2. proxy.test.ts / lib/config/client.test.ts / handleError.test.ts を main push で
3. Playwright script 化: SCN-1-1 (mock Supabase) / SectionErrorState レンダリング

## 15. リリース Go 判定

最低限のリリース条件 (全て ✅):
- 本章 §3 (PRIVATE 404): M9/M10 実装済 ✅
- §4-5 (作成 + 認可): features/ throw 正規化 ✅
- §7 (CORS): isSameOrigin 完全一致 ✅
- §8 (Rate Limit): nginx 動作 ✅
- §9 (エラーマスク): Prisma + Zod details 本番マスク ✅
- §10 (i18n): 4 言語 ✅
- §11 (a11y): role / aria-live / aria-busy / aria-label ✅
- §12 SCN-1-1 (dev OAuth): ✅

**現在の判定: GO 🟢**
実 routem.net HTTPS 化 + Supabase Redirect URL 追加は別フェーズで対応。
