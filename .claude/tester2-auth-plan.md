# Tester_2 認証フロー E2E テスト実行計画

作成日時: 2026-04-19
対象ブランチ: `77-デプロイ準備`
根拠ドキュメント: `.claude/auth-test-scenarios.md`

## スコープ判定

`auth-test-scenarios.md` SCN-1-1 〜 SCN-5-4 を dev 環境 (`http://localhost:3000`) で実行可能な範囲に絞り込み。

| シナリオID | 環境 | 実施可否 | 理由 |
|---|---|---|---|
| SCN-1-1 | dev | ✅ 実施 | 本タスクの主眼。Googleログイン画面遷移までを確認 |
| SCN-1-2 | prod-http | ❌ スキップ | prod デプロイ後に Tester_1 側で実施 |
| SCN-1-3 | prod-https | ❌ スキップ | HTTPS 切替後 |
| SCN-2-1 | prod-http | △ 計画のみ | dev でも Max-Age/Expires の保持確認は可能 |
| SCN-2-2 | prod-http | ✅ 実施 | dev 環境でログアウト→cookie削除を検証 |
| SCN-3-1 | prod-http | △ dev で代替 | `http://localhost:3000` への同一origin fetch 200 確認 |
| SCN-3-2 | prod-http | ✅ 実施 | curl で localhost:3000 相手に Origin 詐称 |
| SCN-3-3 | 実機 | ❌ スキップ | routem.net への到達性に依存、本ラウンドは単体テスト側で回帰防止 |
| SCN-4-1 | prod-http | ✅ 実施 | curl で未ログイン POST → 401 確認 (dev) |
| SCN-4-2 | prod-http | ❌ スキップ | 本物の Google ログインが必要 |
| SCN-4-3 | prod-http | △ 計画のみ | cookie 手動削除 → UI 反応は Tester_1 が実機で |
| SCN-5-1 | prod-https | ❌ スキップ | HTTPS 環境必要 |
| SCN-5-2 | prod-http | △ 計画のみ | 実機 prod で Tester_1 が |
| SCN-5-3 | 任意 | ✅ 単体テスト | `proxy.test.ts` で網羅 |
| SCN-5-4 | dev | ✅ 単体テスト | `proxy.test.ts` で網羅 |

## 実行フェーズ

### Phase 1: 単体テスト全体 pass 確認
- `npx vitest run` 実行
- 期待: 全テスト pass
- 重点確認ファイル:
  - `proxy.test.ts` (isSameOrigin / isSecureRequest / propagateSessionCookies)
  - `lib/config/client.test.ts` (getClientSiteUrl / getClientAuthRedirectUrl)
  - `lib/server/handleError.test.ts` (AUTH_ERROR_TABLE)

### Phase 2: dev サーバ起動前チェック
- docker compose 状態確認
- `.env` の `NEXT_PUBLIC_SITE_URL=http://localhost:3000` 確認
- 必要なら `docker compose up -d`

### Phase 3: dev サーバ起動 & Playwright 検証
- `npm run dev` を backgroundで
- Playwright で `http://localhost:3000` へアクセス、スクショ
- `/login` に遷移、スクショ
- Google ログインボタン押下して `accounts.google.com` への遷移確認
  - redirect_to パラメータに `http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback` が含まれることを確認
  - ここで Google 認証は実施せず、URL 確認のみで SCN-1-1 合格判定

### Phase 4: CORS / 401 の curl 検証
- SCN-3-2 相当: dev サーバ に偽装 Origin で POST → 403
- SCN-4-1 相当: dev サーバ に未ログイン POST → 401 + UNAUTHORIZED コード

### Phase 5: セッション cookie 属性確認
- Playwright `context.cookies()` で `sb-*-auth-token` の属性取得
  - Secure = false（HTTP dev 環境）
  - HttpOnly = true
  - Max-Age または expires 設定
  - （ただし Google認証まで行かないと生成されないため、確認できない場合はスキップ）

### Phase 6: 問題発見時の即時報告 → 完了報告

## 報告フォーマット

- bug 発見時: `claude-team send --name Routem PM '[BUG] <内容>、スクショ: <パス>'`
- 完了時: `claude-team send --name Routem PM '[TEST DONE AUTH] <結果サマリ>'`
