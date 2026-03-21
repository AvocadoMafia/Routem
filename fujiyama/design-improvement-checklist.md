# 設計改善チェックリスト

## P1: 高優先度（2週間以内）

### 型定義の統一
- [ ] `/lib/types/`ディレクトリを作成
- [ ] `lib/types/domain.ts`にPrisma型ベースの型を集約
- [ ] `lib/types/schemas.ts`にZodスキーマを集約
- [ ] `lib/types/api.ts`にAPI Request/Response型を定義
- [ ] `lib/types/errors.ts`にエラー型を定義
- [ ] 既存の型定義ファイルから移行
  - [ ] `lib/client/types.ts`
  - [ ] `lib/server/types.ts`
  - [ ] `features/database_schema.ts`
- [ ] 不要になった型定義ファイルを削除

### エラーハンドリング統一
- [ ] `lib/errors/types.ts`にErrorCode型を定義
- [ ] `lib/errors/handler.ts`にcreateErrorResponse関数を実装
- [ ] 既存のAPIエンドポイントを修正
  - [ ] `/api/v1/comments/route.ts`
  - [ ] `/api/v1/likes/route.ts`
  - [ ] `/api/v1/routes/route.ts`
  - [ ] `/api/v1/users/route.ts`
  - [ ] `/api/v1/mapbox/geocode/route.ts`
  - [ ] その他のエンドポイント
- [ ] `lib/server/handleError.ts`を更新

### Service層の責務分離
- [ ] `features/routes/searchService.ts`を作成（Meilisearch連携）
- [ ] `features/routes/inviteService.ts`を作成（招待トークン管理）
- [ ] `features/routes/service.ts`を純粋なビジネスロジックに整理
- [ ] 認可チェックをミドルウェアに移動検討

---

## P2: 中優先度（1ヶ月以内）

### MUIスタイルの抽出
- [ ] `lib/styles/mui.ts`を作成
- [ ] 共通スタイル定数を定義
  - [ ] `formFieldStyles`
  - [ ] `selectStyles`
  - [ ] `inputStyles`
- [ ] `routeFilter.tsx`のスタイルを共通化
- [ ] 他のMUIコンポーネントも確認・共通化

### カスタムフックの抽出
- [ ] `hooks/useComments.ts`を作成
  ```typescript
  export function useComments(routeId: string) {
    // コメント取得・投稿ロジック
  }
  ```
- [ ] `hooks/useLikes.ts`を作成
- [ ] `hooks/useFollow.ts`を作成
- [ ] コンポーネントからロジックを分離

### 状態管理の統一
- [ ] JotaiまたはZustandどちらかに決定
- [ ] 選択した方に状態を移行
- [ ] devtoolsの設定を追加
- [ ] 不要になったライブラリを削除

### HTTPクライアントの整理
- [ ] `lib/client/api.ts`を作成
  ```typescript
  export const api = {
    get: <T>(url: string) => ...,
    post: <T>(url: string, body: unknown) => ...,
    // ...
  };
  ```
- [ ] 既存の個別関数を非推奨化
- [ ] 使用箇所を順次移行

---

## P3: 低優先度（ロードマップ）

### 命名規則の統一
- [ ] 命名規則ドキュメントを作成
- [ ] コンポーネントファイルをPascalCaseに統一
  - [ ] `routeCardGraphical.tsx` → `RouteCardGraphical.tsx`
  - [ ] `featuredRouteCard.tsx` → `FeaturedRouteCard.tsx`
- [ ] boolean状態変数にis/has/can接頭辞を統一

### TODOコメントの整理
- [ ] 既存のTODOをIssueに移行
  - [ ] "デザイン整える"
  - [ ] "loginwithgoogleのエラーハンドリング"
  - [ ] "ボタンコンポーネント整理"
  - [ ] "ログイン中にアクセスした場合のリダイレクト"
- [ ] TODOコメントを削除

### features/componentsの整理
- [ ] 配置基準を決定
  - Option A: `app/_components/features/`に移動
  - Option B: 各ページの`_components/`に移動
- [ ] 決定した基準に従って移動
- [ ] インポートパスを更新

### 依存性注入の導入
- [ ] `lib/container.ts`を作成
- [ ] グローバル変数をコンテナ経由に変更
- [ ] テスト時のモック方法を確立

---

## コードスタイル統一

### ESLint/Prettier設定
- [ ] 命名規則のルールを追加
- [ ] インポート順序のルールを追加
- [ ] 未使用変数の警告を有効化

### コメント規約
- [ ] JSDocコメントの推奨箇所を定義
  - [ ] 公開API（export関数）
  - [ ] 複雑なビジネスロジック
  - [ ] 型定義
- [ ] コメントテンプレートを作成

---

## 検証チェックリスト

### 型定義統一後
- [ ] `npm run build`でエラーなし
- [ ] 型エラーがないことを確認
- [ ] 既存の機能が動作することを確認

### エラーハンドリング統一後
- [ ] 全APIエンドポイントのエラーレスポンス形式を確認
- [ ] フロントエンドのエラー処理が動作することを確認

### リファクタリング後
- [ ] 全ページの動作確認
- [ ] コンソールエラーがないことを確認
- [ ] パフォーマンスの劣化がないことを確認
