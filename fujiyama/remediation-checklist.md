# セキュリティ対応チェックリスト

## P0: 即時対応（24時間以内）

### 機密情報対応
- [ ] `.env`ファイルを`.gitignore`に追加確認
- [ ] Git履歴から`.env`を完全削除
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
- [ ] 手動対応が必要なパッケージの更新
  - [ ] hono → 最新版
  - [ ] @hono/node-server → 1.19.10以上
  - [ ] fast-xml-parser → 5.5.7以上
  - [ ] next → 16.1.7以上

---

## P1: 緊急対応（1週間以内）

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
- [ ] `app/auth/callback/route.ts`の修正
  ```typescript
  const ALLOWED_HOSTS = ['localhost', 'yourdomain.com'];
  const next = url.searchParams.get("next") ?? "/";

  // ホワイトリスト検証
  if (next.startsWith('//') || !next.startsWith('/')) {
    return NextResponse.redirect(`${origin}/`);
  }
  ```

### セキュリティヘッダー追加
- [ ] `middleware.ts`の作成
- [ ] 以下のヘッダー設定
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options: SAMEORIGIN
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-XSS-Protection: 1; mode=block
  - [ ] Strict-Transport-Security

### アップロードエンドポイント修正
- [ ] 認証必須化
- [ ] ファイル名サニタイズ
  ```typescript
  const sanitizedFileName = fileName
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  ```
- [ ] ContentTypeホワイトリスト
  ```typescript
  const ALLOWED_TYPES = ['image/webp', 'image/jpeg', 'image/png', 'image/gif'];
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }
  ```
- [ ] typeパラメータのバリデーション

### 閲覧履歴API修正
- [ ] `features/views/service.ts`にvisibilityフィルタ追加
  ```typescript
  const where: Prisma.RouteWhereInput = {
    views: { some: { userId } },
    OR: [
      { visibility: RouteVisibility.PUBLIC },
      { authorId: userId },
      { collaborators: { some: { userId } } }
    ]
  };
  ```

### 検索履歴API修正
- [ ] GET `/api/v1/searchHistory`に認証追加
- [ ] ユーザーごとのサジェスト分離

---

## P2: 高優先度（2週間以内）

### limitパラメータ制限
- [ ] `/api/v1/tags`
  ```typescript
  const limit = Math.min(Math.max(Number(limitParam) || 10, 1), 100);
  ```
- [ ] `/api/v1/users`
- [ ] `/api/v1/searchHistory`
- [ ] `/api/v1/routes`

### トランザクション追加
- [ ] `features/likes/service.ts` toggleLike
- [ ] `features/users/service.ts` toggleFollow
- [ ] `features/comments/service.ts` deleteComment

### 招待トークンmaxUsesチェック
- [ ] `features/routes/service.ts` acceptInvite修正
  ```typescript
  if (invite.maxUses && invite.usedCount >= invite.maxUses) {
    throw new Error("Token usage limit reached");
  }
  ```

### Docker設定修正
- [ ] ポートをlocalhostにバインド
- [ ] MinIO認証情報の強化
- [ ] ネットワーク分離の実装

---

## P3: 中優先度（1ヶ月以内）

### 為替レート計算
- [ ] 為替レートAPI連携の実装
- [ ] `features/routes/utils.ts`の修正
- [ ] 定期更新の仕組み

### DBスキーマ改善
- [ ] Followリレーション名の修正
- [ ] 自己フォローCHECK制約追加
- [ ] Image orphan防止制約
- [ ] 文字列長制限の追加
- [ ] インデックスの追加

### 監査ログシステム
- [ ] AuditLogモデルの追加
- [ ] 重要操作のログ記録
  - [ ] ルート作成/更新/削除
  - [ ] ユーザー情報更新
  - [ ] 権限変更

### レート制限
- [ ] Upstash Redis設定
- [ ] レート制限ミドルウェア実装
- [ ] エンドポイントごとの制限設定

### エラーハンドリング統一
- [ ] カスタムエラークラス作成
- [ ] エラーメッセージの統一
- [ ] 本番環境での詳細非表示

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

## 検証チェックリスト

### 対応完了後の検証
- [ ] `npm audit`で脆弱性0件確認
- [ ] セキュリティヘッダーの確認（DevTools）
- [ ] CSRF保護の動作確認
- [ ] 権限チェックのテスト
- [ ] レート制限の動作確認

### 定期的なセキュリティレビュー
- [ ] 月次: 依存関係の更新確認
- [ ] 四半期: コードレビュー
- [ ] 年次: 第三者によるセキュリティ監査
