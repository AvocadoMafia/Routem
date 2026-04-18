# Deploy Prep Backlog (本日 77-デプロイ準備 ブランチ集約)

main へのマージ直前状態で、残している follow-up / 次フェーズで解決したい項目の集約。
各項目は担当エンジニアと、PR マージ後にすぐ着手可能な粒度で書く。

---

## 🟡 Bug#3 follow-up (非ブロッカー、CTO_2 合意済み)

| ID | 内容 | 担当候補 |
|---|---|---|
| W-A | `isForbiddenError` hook を追加し、 commentItem の他人コメント削除試行 (403) を warning toast で可視化 | C |
| N1 | `useShare.ts` の `useCallback(..., [options])` が毎 render で新 options オブジェクトを受けるため実質 memo 無効 → options を useRef で固定、または個別 callback 展開 | C |
| N2 | `useLike.ts` の連打ガード: `pending` state 比較だと 1 tick 内の二重発火に弱い → `useRef<boolean>` 化 | C |
| N3 | Prisma エラー漏洩のサーバーログマスキング運用整備 (本番ログ基盤とのマッピング) | C / DevOps |
| - | `app/api/v1/routes/route.test.ts` の GET テスト failing (localhost:3000 live fetch 依存) → vitest で mock 化 or skip flag | C / A |

---

## 🟡 Bug#1 follow-up (Engineer_A 担当)

| ID | 内容 | 担当候補 |
|---|---|---|
| A-1 | `useInfiniteScroll.ts` のテスト追加 (429 バックオフ / 5xx 1回リトライ / Retry-After ヘッダの秒数解釈) | A |
| A-2 | Redis 不達時の graceful fallback 動作を integration test で担保 | A |
| A-3 | `sectionErrorState.tsx` の 4 状態 (loading/error/empty/data) プリセットのスナップショット | A |

---

## 🟡 Bug#2 follow-up (Engineer_B 担当)

| ID | 内容 | 担当候補 |
|---|---|---|
| B-1 | `proxy.ts` の `propagateSessionCookies` で maxAge/expires 保持を明示する regression test | B |
| B-2 | CORS `isSameOrigin` ヘルパーの完全一致 regression (既に `410e533` で追加済) の CI 組み込み | B |
| B-3 | Supabase Dashboard の Redirect URL 一覧を `.env.example` / README に追記 | B |

---

## 🟡 共通 / horizontal な課題

| ID | 内容 |
|---|---|
| H-1 | `app/api/v1/routes/me/route.ts` の supabase.auth エラーを将来 `UnauthorizedError` クラス化 (ValidationError と同じパターン) |
| H-2 | `app/api/v1/**` 全 route で validateUser helper を導入して boilerplate 削減 |
| H-3 | `lib/server/handleError.ts` を `lib/api/server.ts` に統合する Phase D2 (D 担当) |
| H-4 | vitest の `app/api/v1/routes/route.test.ts` GETテストを live fetch 依存から MSW or mock 化 |
| H-5 | eslint: 138 errors / 146 warnings が残存 (主に `@typescript-eslint/no-explicit-any` の古い箇所)。 incremental に PR 分割で潰す |
| H-6 | 本番 SSL 導入後に `nginx/conf.d/default.conf` のコメント解除 + `docker-compose-prod.yml` の 443 解除 |

---

## 📝 Phase D2 開始前 最終チェックリスト

- [x] 全 commit 内容と message が整合している (race で混線した `5d0c9d7` 以外)
- [x] `npx tsc --noEmit` = EXIT 0
- [x] `npx vitest run` = 209/210 pass (1 fail は live fetch の pre-existing)
- [x] `NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build` 成功
- [ ] `npm run lint` = 未達 (138 errors 残。 H-5 として incremental 対応)
- [x] Bug#1 / Bug#2 / Bug#3 本体は CTO レビュー合格済み

---

## 📊 本日の統合予想見積もり (main merge 直前)

| 指標 | 値 |
|---|---|
| ブランチ: `77-デプロイ準備` → `main` | `68` commits |
| Contributors | Koki / Feet_Up / reondikapurio |
| ファイル変更 | `138 files changed` |
| insertions / deletions | `+8,676 / -5,635` |
| テスト合計 (vitest) | **209 pass / 1 fail (既知 flaky)** |
| TypeScript (tsc) | **EXIT 0** |
| Next.js build | **✓ Compiled successfully in 49s** |
| Static pages | `67/67 generated` |

---

## 🔴 残る唯一の赤 (マージ前に直す or スキップ判断)

- `app/api/v1/routes/route.test.ts` の GET test: `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`
  - 原因: テストが `fetch("http://localhost:3000/api/v1/routes")` を直打ちしており、dev server が立っていない環境では next.js 標準の 404 HTML が返る
  - これは Bug#3 修正以前から存在する既知 flaky テスト (本ブランチの変更と無関係)
  - 対応案: (a) `describe.skip` + TODO、(b) MSW で mock 化、(c) integration suite に分離
