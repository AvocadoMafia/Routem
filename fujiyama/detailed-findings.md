# 詳細調査結果

## 1. API エンドポイント詳細分析

### 認証チェック状況一覧

| エンドポイント | メソッド | 認証 | 認可 | 入力検証 | 評価 |
|---------------|----------|------|------|----------|------|
| `/api/v1/comments` | GET | なし | - | 部分的 | 要改善 |
| `/api/v1/comments` | POST | あり | あり | Zod | 良好 |
| `/api/v1/comments` | DELETE | あり | あり | Zod | 良好 |
| `/api/v1/likes` | POST | あり | 部分的 | Zod | 要改善 |
| `/api/v1/follows` | POST | あり | あり | Zod | 良好 |
| `/api/v1/uploads` | GET | なし | - | なし | 危険 |
| `/api/v1/routes` | GET | 任意 | 部分的 | Zod | 要改善 |
| `/api/v1/routes` | POST | あり | あり | Zod | 良好 |
| `/api/v1/routes` | PATCH | あり | あり | Zod | 良好 |
| `/api/v1/routes/[id]` | DELETE | あり | あり | Zod | 良好 |
| `/api/v1/routes/[id]/invite` | POST | あり | あり | - | 良好 |
| `/api/v1/invites/[token]/accept` | POST | あり | あり | ハッシュ検証 | 良好 |
| `/api/v1/users` | GET | なし | - | Zod | 要改善 |
| `/api/v1/users/me` | GET | あり | あり | - | 良好 |
| `/api/v1/users/me` | PATCH | あり | あり | Zod | 良好 |
| `/api/v1/users/[id]` | GET | 任意 | 部分的 | Zod | 要改善 |
| `/api/v1/views` | POST | あり | あり | Zod | 良好 |
| `/api/v1/me/likes` | GET | あり | あり | - | 良好 |
| `/api/v1/me/views` | GET | あり | あり | - | 良好 |
| `/api/v1/tags` | GET | なし | - | なし | 危険 |
| `/api/v1/searchHistory` | GET | なし | - | 部分的 | 危険 |
| `/api/v1/searchHistory` | POST | あり | あり | 部分的 | 要改善 |
| `/api/v1/mapbox/geocode` | GET | なし | - | 部分的 | 要改善 |
| `/api/v1/categories` | GET | なし | - | - | 要改善 |

---

## 2. データベーススキーマ詳細分析

### 2.1 インデックス不足一覧

| テーブル | フィールド | 理由 | 重要度 |
|---------|----------|------|--------|
| Image | uploaderId | ユーザーのアップロード画像検索 | 高 |
| Image | status | ドラフト画像の検索/クリーンアップ | 高 |
| Image | createdAt | 古い画像の削除クーロン | 中 |
| Route | createdAt | 時系列ソート | 中 |
| Route | visibility | 公開ルート検索 | 高 |
| Comment | routeId | ルートごとのコメント検索 | 高 |
| Comment | userId | ユーザーのコメント検索 | 中 |
| SearchHistory | createdAt | 古いレコードの定期削除 | 中 |
| View | createdAt | 時系列分析 | 低 |

### 2.2 推奨複合インデックス

```prisma
// Route
@@index([visibility, createdAt])

// Comment
@@index([routeId, createdAt])

// View
@@index([userId, createdAt])

// SearchHistory
@@index([userId, createdAt])

// Image
@@index([uploaderId, createdAt])
@@index([status, createdAt])
```

### 2.3 制約追加推奨

```prisma
// Follow: 自己フォロー防止
model Follow {
  // ...existing fields...
  @@check(followingId != followerId, "cannot_follow_self")
}

// Image: orphan防止
model Image {
  // ...existing fields...
  // いずれか1つは必ずNOT NULL
  @@check(
    (uploaderId IS NOT NULL)::int +
    (routeNodeId IS NOT NULL)::int +
    (userIconId IS NOT NULL)::int +
    (userBackgroundId IS NOT NULL)::int +
    (routeThumbId IS NOT NULL)::int >= 1,
    "must_have_reference"
  )
}

// データ型の長さ制限
model User {
  name String @db.VarChar(100)
  bio  String? @db.VarChar(500)
}

model Comment {
  text String @db.VarChar(5000)
}

model Tag {
  name String @unique @db.VarChar(100)
}
```

---

## 3. 認証・認可システム詳細

### 3.1 認証フロー

```
[ブラウザ]
    │
    ▼
[OAuth2.0 (Google)]
    │
    ▼
[/auth/callback]
    │ - 認可コード交換
    │ - セッション作成
    │ - ユーザーupsert
    ▼
[Cookie設定]
    │
    ▼
[API リクエスト]
    │
    ▼
[Supabase getUser()]
    │
    ▼
[認証済みユーザー情報]
```

### 3.2 認可チェックパターン

**現状（分散型）**:
```
API Layer: validateUser() → userId取得
Service Layer: checkPermission() → 権限チェック
Repository Layer: authorIdフィルタ → データアクセス
```

**推奨（統一型）**:
```
Middleware: 認証 + 基本権限チェック
Service Layer: ビジネスロジック固有の権限チェック
Repository Layer: データアクセスのみ
```

### 3.3 セッション管理

| 項目 | 現状 | 推奨 |
|------|------|------|
| 保存場所 | Cookie (Supabase管理) | 変更不要 |
| HttpOnly | 未確認 | 明示的に設定 |
| Secure | 未確認 | 明示的に設定 |
| SameSite | 未確認 | Strict |
| 有効期限 | Supabase デフォルト | 明示的に設定 |

---

## 4. 外部サービス連携詳細

### 4.1 Meilisearch

**使用箇所**:
- ルート検索 (`features/routes/service.ts`)
- 検索履歴サジェスト (`features/searchHistory/service.ts`)
- タグ検索 (`app/api/v1/tags/route.ts`)

**セキュリティ設定**:
- API Key: 環境変数管理 ✓
- インデックス: routes, search_queries, tags

**推奨改善**:
- 検索クエリの長さ制限
- インデックス操作の監査ログ

### 4.2 Mapbox

**使用箇所**:
- ジオコーディング (`app/api/v1/mapbox/geocode/route.ts`)

**セキュリティ問題**:
- トークンがNEXT_PUBLIC_で公開
- session_tokenが固定値

**推奨改善**:
```typescript
// Before
const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// After
const token = process.env.MAPBOX_ACCESS_TOKEN; // サーバー専用
```

### 4.3 LibreTranslate

**使用箇所**:
- 日英翻訳 (`lib/translation/translateJa2En.ts`)

**セキュリティ設定**:
- タイムアウト: 未設定
- リトライ: 未実装
- 配列サイズ制限: なし

**推奨改善**:
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

const res = await fetch(translateUrl, {
  signal: controller.signal,
  // ...
});
```

### 4.4 MinIO/S3

**使用箇所**:
- 画像アップロード (`features/images/service.ts`)

**セキュリティ設定**:
- 署名付きURL有効期限: 5分 ✓
- 操作制限: PUTのみ ✓
- ディレクトリ分離: あり ✓

**推奨改善**:
- ファイル名のサニタイズ強化
- MIMEタイプのホワイトリスト

### 4.5 Supabase

**使用箇所**:
- 認証 (`lib/auth/supabase/*`)
- Admin操作 (`lib/auth/supabase/admin.ts`)

**セキュリティ設定**:
- Service Role Key: サーバー専用 ✓
- Publishable Key: クライアント用 ✓

**推奨改善**:
- Admin Client使用箇所の最小化
- syncUsersDev.ts の本番環境ガード

---

## 5. ビジネスロジック脆弱性詳細

### 5.1 TOCTOU (Time-of-check to time-of-use)

**いいねトグル**:
```
Timeline:
  T1: Request A - findByUserAndRoute() → null
  T2: Request B - findByUserAndRoute() → null
  T3: Request A - createLike() → 成功
  T4: Request B - createLike() → 重複エラー or 重複作成
```

**修正案**:
```typescript
toggleLike: async (userId: string, target: LikeViewTarget, routeId?: string) => {
  return await getPrisma().$transaction(async (tx) => {
    const existing = await tx.like.findUnique({
      where: { userId_routeId: { userId, routeId } }
    });

    if (existing) {
      await tx.like.delete({ where: { id: existing.id } });
      return { liked: false };
    } else {
      await tx.like.create({ data: { userId, routeId, target } });
      return { liked: true };
    }
  });
}
```

### 5.2 招待トークン制限未実装

**現状**:
```typescript
// maxUses はスキーマにあるが使われていない
await routesRepository.updateInvite(invite.id, {
  usedCount: { increment: 1 },
});
```

**修正案**:
```typescript
acceptInvite: async (token: string, userId: string) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const invite = await routesRepository.findInviteByTokenHash(tokenHash);

  if (!invite) throw new Error("Invalid token");
  if (invite.revokedAt) throw new Error("Token revoked");
  if (invite.expiresAt && invite.expiresAt < new Date()) throw new Error("Token expired");

  // maxUses チェック追加
  if (invite.maxUses && invite.usedCount >= invite.maxUses) {
    throw new Error("Token usage limit reached");
  }

  // ... rest of the code
}
```

### 5.3 為替計算未実装

**現状**:
```typescript
budget: {
  create: {
    amount: body.budget.amount,
    baseAmount: body.budget.amount,  // 変換なし
    baseCurrency: "JPY",
  }
}
```

**修正案**:
```typescript
import { getExchangeRate } from '@/lib/exchange';

const fxRate = await getExchangeRate(body.budget.currency, 'JPY');
const baseAmount = body.budget.amount * fxRate;

budget: {
  create: {
    currency: body.budget.currency,
    amount: body.budget.amount,
    baseAmount: baseAmount,
    baseCurrency: "JPY",
    fxRateToBase: fxRate,
    fxRateDate: new Date(),
  }
}
```

---

## 6. クライアントサイドセキュリティ詳細

### 6.1 XSS対策状況

| 対策 | 状況 | 評価 |
|------|------|------|
| dangerouslySetInnerHTML | 未使用 | 良好 |
| innerHTML | 未使用 | 良好 |
| eval() | 未使用 | 良好 |
| React自動エスケープ | 有効 | 良好 |
| DOMPurify | 未導入 | 検討 |

### 6.2 機密情報露出

| 変数名 | 内容 | リスク |
|--------|------|--------|
| NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN | Mapbox APIトークン | 高 |
| NEXT_PUBLIC_SUPABASE_URL | Supabase URL | 中 |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY | Supabase公開キー | 低（仕様） |

### 6.3 セッションストレージ使用

```typescript
// app/(public)/routes/[id]/rootClient.tsx
const key = `viewed:${route.id}`;
if (sessionStorage.getItem(key)) return;
sessionStorage.setItem(key, "1");
```

**評価**: 問題なし（機密情報なし、ビュー重複防止のみ）

---

## 7. インフラセキュリティ詳細

### 7.1 Docker Compose設定

**問題点**:
```yaml
services:
  db:
    ports:
      - "5432:5432"  # 外部公開

  minio:
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}      # minioadmin
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}  # minioadmin
```

**推奨設定**:
```yaml
services:
  db:
    ports:
      - "127.0.0.1:5432:5432"  # ローカルのみ

  minio:
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    # 強力なパスワードを.envで設定
```

### 7.2 ネットワーク分離推奨

```yaml
networks:
  frontend:
  backend:
  database:

services:
  app:
    networks:
      - frontend
      - backend

  db:
    networks:
      - database

  minio:
    networks:
      - backend
```

---

## 8. ログ・監査詳細

### 8.1 現状のログ出力

| 場所 | 内容 | リスク |
|------|------|--------|
| lib/server/handleRequest.ts | エラー全体 | 中 |
| app/auth/callback/route.ts | ユーザーデータ | 高 |
| app/api/v1/mapbox/geocode/route.ts | エラー | 低 |
| features/searchHistory/service.ts | エラー/警告 | 低 |
| lib/auth/login/google.ts | 認証エラー | 低 |

### 8.2 監査ログ推奨スキーマ

```prisma
model AuditLog {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  createdAt DateTime @default(now())

  userId    String?  @db.Uuid
  user      User?    @relation(fields: [userId], references: [id])

  action    String   // CREATE, UPDATE, DELETE, LOGIN, etc.
  resource  String   // Route, Comment, User, etc.
  resourceId String?

  ipAddress String?
  userAgent String?

  details   Json?    // 追加情報

  @@index([userId, createdAt])
  @@index([resource, resourceId])
  @@index([action, createdAt])
}
```

### 8.3 ログレベル推奨

| レベル | 用途 | 本番環境 |
|--------|------|----------|
| ERROR | 例外、システムエラー | 有効 |
| WARN | 警告、非推奨使用 | 有効 |
| INFO | 重要な操作ログ | 有効 |
| DEBUG | 詳細デバッグ情報 | 無効 |
| TRACE | 最詳細トレース | 無効 |
