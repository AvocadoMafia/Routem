# Routem セキュリティ・設計改善 進捗チェックリスト

**最終更新**: 2026-03-26
**対応ブランチ**: 45-スキーマの更新
**監査レポート日**: 2026-03-21

---

## 凡例

- [x] 修正済み
- [ ] 未対応

---

## P0: 即時対応（CRITICAL - 24時間以内）

### 機密情報対応
- [ ] `.env`ファイルをGit履歴から完全削除
  ```bash
  git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch .env' \
    --prune-empty --tag-name-filter cat -- --all
  git push origin --force --all
  ```
- [ ] データベースパスワードのローテーション
- [ ] Supabase Service Role Keyの再生成
- [ ] MinIOアクセスキーの変更
- [ ] Mapbox APIトークンの再生成と権限制限

### npm脆弱性対応
- [ ] `npm audit`で現状確認
- [ ] `npm audit fix`で自動修正
- [ ] hono → 最新版へ更新
- [ ] @hono/node-server → 1.19.10以上へ更新
- [ ] fast-xml-parser → 5.5.7以上へ更新
- [ ] next → 16.1.7以上へ更新

---

## P1: 緊急対応（HIGH - 1週間以内）

### CSRF対策
- [ ] `lib/csrf.ts`の実装
- [ ] CSRF_SECRET環境変数の追加
- [ ] POST/DELETE APIへのCSRFトークン検証追加
  - [ ] `/api/v1/comments` POST/DELETE
  - [ ] `/api/v1/likes` POST
  - [ ] `/api/v1/follows` POST
  - [ ] `/api/v1/routes` POST/PATCH
  - [ ] `/api/v1/routes/[id]` DELETE
  - [ ] `/api/v1/views` POST

### Open Redirect修正
- [x] `app/auth/callback/route.ts`に`isValidRedirectPath`関数追加
  - [x] `/`で始まる相対パスのみ許可
  - [x] `//`で始まるURL拒否
  - [x] `:`を含むURL拒否
  - [x] `\`を含むURL拒否

### セキュリティヘッダー追加
- [ ] `middleware.ts`の作成
- [ ] Content-Security-Policy設定
- [ ] X-Frame-Options: SAMEORIGIN設定
- [ ] X-Content-Type-Options: nosniff設定
- [ ] X-XSS-Protection: 1; mode=block設定
- [ ] Strict-Transport-Security設定

### アップロードエンドポイント修正
- [x] `lib/server/uploadValidation.ts`作成
- [x] ファイル名サニタイズ（`sanitizeFileName`関数）
  - [x] パストラバーサル防止（`../`除去）
  - [x] 特殊文字除去
  - [x] 長さ制限（100文字）
- [x] ContentTypeホワイトリスト（`isAllowedContentType`関数）
  - [x] image/jpeg許可
  - [x] image/png許可
  - [x] image/webp許可
  - [x] image/gif許可
- [x] typeパラメータのバリデーション（`isAllowedUploadType`関数）
- [x] contextパラメータのバリデーション（`isAllowedContext`関数）
- [x] `app/api/v1/uploads/route.ts`で検証を使用

### 閲覧履歴API修正
- [x] `features/views/service.ts`にvisibilityフィルタ追加
  - [x] PUBLICルートのみ返す
  - [x] 自分が作成したルートも返す

### 検索履歴API修正
- [ ] GET `/api/v1/searchHistory`に認証追加
- [ ] ユーザーごとのサジェスト分離

### Cookie セキュリティ属性
- [ ] HttpOnly属性設定
- [ ] Secure属性設定
- [ ] SameSite属性設定

### 本番ログ削除
- [ ] `app/auth/callback/route.ts`のconsole.log削除

---

## P2: 高優先度（2週間以内）

### limitパラメータ制限（DoS防止）
- [x] `lib/server/constants.ts`作成
  - [x] MAX_LIMIT: 100定義
  - [x] DEFAULT_LIMIT: 15定義
  - [x] `clampLimit`関数実装
  - [x] `clampOffset`関数実装
- [x] `/api/v1/tags`に適用
- [x] `/api/v1/searchHistory`に適用
- [ ] `/api/v1/users`に適用
- [ ] `/api/v1/routes`に適用
- [ ] `/api/v1/comments`に適用

### トランザクション追加（TOCTOU防止）
- [x] `features/likes/service.ts` toggleLike
  - [x] `getPrisma().$transaction`使用
  - [x] チェックと更新を単一トランザクションで実行
- [x] `features/users/service.ts` toggleFollow
  - [x] `getPrisma().$transaction`使用
  - [x] 自己フォロー防止チェック追加
- [x] `features/comments/service.ts` deleteComment
  - [x] `getPrisma().$transaction`使用
  - [x] 権限チェックと削除を単一トランザクションで実行

### 招待トークンmaxUsesチェック
- [ ] `features/routes/service.ts` acceptInvite修正
  ```typescript
  if (invite.maxUses && invite.usedCount >= invite.maxUses) {
    throw new Error("Token usage limit reached");
  }
  ```

### Docker設定修正
- [ ] PostgreSQLポートをlocalhostにバインド（`127.0.0.1:5432:5432`）
- [ ] MinIOポートをlocalhostにバインド
- [ ] Meilisearchポートをlocalhostにバインド
- [ ] MinIO認証情報の強化（デフォルトから変更）
- [ ] ネットワーク分離の実装

### Mapboxトークン制限
- [ ] ドメイン制限の設定
- [ ] API使用量制限の設定

---

## P3: 中優先度（1ヶ月以内）

### 為替レート計算
- [ ] 為替レートAPI連携の実装
- [ ] `features/routes/utils.ts`のbudget計算修正
- [ ] 定期更新の仕組み

### DBスキーマ改善
- [ ] Followリレーション名の修正（命名逆転問題）
- [ ] 自己フォローCHECK制約追加
- [ ] Image orphan防止制約
- [ ] User.bio文字列長制限追加
- [ ] Comment.text文字列長制限追加
- [ ] Spot座標のnullable見直し
- [ ] 適切なインデックス追加

### 監査ログシステム
- [ ] AuditLogモデルの追加
- [ ] ルート作成/更新/削除のログ記録
- [ ] ユーザー情報更新のログ記録
- [ ] 権限変更のログ記録
- [ ] 管理者操作のログ記録

### レート制限
- [ ] Upstash Redis設定
- [ ] レート制限ミドルウェア実装
- [ ] エンドポイントごとの制限設定

### エラーハンドリング統一
- [x] `lib/server/AppError.ts`作成
  - [x] ErrorCodeType対応
  - [x] ファクトリメソッド（badRequest, unauthorized, forbidden, notFound, conflict, validationError, internal）
  - [x] toJSON()メソッド
- [x] `lib/types/error.ts`にErrorCode型定義
- [x] `lib/server/handleError.ts`をAppError対応に更新
  - [x] AppErrorインスタンス判定
  - [x] ZodError対応
  - [x] 本番環境でのエラーメッセージ非表示
- [ ] 全APIエンドポイントでAppError使用に統一
- [ ] エラーメッセージの統一（"Notfound" → "Not found"等）

### 外部APIタイムアウト
- [ ] `lib/translation/translateJa2En.ts`にタイムアウト設定追加

### Mapbox session_token
- [ ] 固定値("fixed-session-123")を動的生成に変更

### 認証ヘッダー形式検証
- [ ] "Bearer "プレフィックス確認追加
- [ ] トークン形式検証追加

---

## P4: 長期（ロードマップ）

### 認可ミドルウェア統一
- [ ] 権限チェック用ミドルウェア設計
- [ ] API層とService層の役割明確化
- [ ] テスト追加

### GDPR対応
- [ ] ユーザーデータエクスポート機能
- [ ] データ削除権の実装
- [ ] 検索履歴の削除機能

### セキュリティテスト自動化
- [ ] OWASP ZAP統合
- [ ] 依存関係スキャンのCI統合
- [ ] ペネトレーションテストの定期実施

---

## 設計改善

### 型定義の統一
- [x] `/lib/types/`ディレクトリ作成
- [x] `lib/types/domain.ts`作成
  - [x] Route型定義
  - [x] User型定義
  - [x] Comment型定義
  - [x] Waypoint型定義
  - [x] Transportation型定義
- [x] `lib/types/error.ts`作成
  - [x] ErrorCode定数
  - [x] ErrorCodeType型
  - [x] ApiError型
- [ ] `lib/types/api.ts`にAPI Request/Response型定義
- [ ] 既存の型定義ファイルから完全移行
- [ ] `lib/client/types.ts`をre-export形式に変更

### 状態管理の統一（Jotai→Zustand）
- [x] `lib/client/stores/uiStore.ts`作成
  - [x] scrollDirection状態
  - [x] headerHeight状態
  - [x] isMobile状態
- [x] `lib/client/stores/userStore.ts`作成
- [x] コンポーネントでZustand使用に移行
- [ ] `lib/client/atoms.ts`削除（移行完了後）

### Service層の責務分離
- [ ] `features/routes/searchService.ts`作成（Meilisearch連携）
- [ ] `features/routes/inviteService.ts`作成（招待トークン管理）
- [ ] `features/routes/service.ts`を純粋なビジネスロジックに整理

### カスタムフックの抽出
- [ ] `hooks/useComments.ts`作成
- [ ] `hooks/useLikes.ts`作成
- [ ] `hooks/useFollow.ts`作成

### HTTPクライアントの整理
- [ ] `lib/client/api.ts`作成
- [ ] 既存の個別関数を非推奨化
- [ ] 使用箇所を順次移行

---

## 検証チェックリスト

### 対応完了後の検証
- [ ] `npm audit`で脆弱性0件確認
- [ ] `npm run build`でエラーなし確認
- [ ] セキュリティヘッダーの確認（DevTools）
- [ ] CSRF保護の動作確認
- [ ] 権限チェックのテスト
- [ ] レート制限の動作確認
- [ ] 全ページの動作確認

### 定期的なセキュリティレビュー
- [ ] 月次: 依存関係の更新確認
- [ ] 四半期: コードレビュー
- [ ] 年次: 第三者によるセキュリティ監査

---

## 修正済みサマリー

| カテゴリ | 修正済み | 未対応 | 進捗率 |
|----------|----------|--------|--------|
| P0: CRITICAL | 0 | 11 | 0% |
| P1: HIGH | 12 | 14 | 46% |
| P2: 高優先度 | 12 | 10 | 55% |
| P3: 中優先度 | 6 | 20 | 23% |
| P4: 長期 | 0 | 9 | 0% |
| 設計改善 | 10 | 10 | 50% |
| **合計** | **40** | **74** | **35%** |

---

## 更新履歴

| 日付 | 更新者 | 内容 |
|------|--------|------|
| 2026-03-26 | Claude | 初版作成、ブランチ45の修正内容を反映 |
| | | |
| | | |
