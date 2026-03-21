# Routem プロジェクト 設計レビューレポート

**調査対象**: `/Users/koki/Avocado/Routem`
**調査日**: 2026-03-21
**設計全体スコア**: 68/100

---

## エグゼクティブサマリー

本プロジェクトは**3層アーキテクチャ**と**フィーチャーベースの構造**を採用しており、基本的な設計は良好です。しかし、**型定義の分散**、**責務の肥大化**、**エラーハンドリングの不統一**など、長期的な保守性に影響する問題が検出されました。

| 観点 | スコア | コメント |
|------|--------|----------|
| アーキテクチャ | 75/100 | 3層分離は良いが責務が混在 |
| コード品質 | 60/100 | DRY違反、エラーハンドリング不統一 |
| 型安全性 | 70/100 | Prisma/Zod活用は良いが分散 |
| 保守性 | 65/100 | フィーチャーベースは良いが改善余地あり |

---

## PART 1: アーキテクチャ評価

### 1.1 現在のディレクトリ構造

```
/app                          # Next.js App Router
├── /_components              # グローバルコンポーネント（70個）
│   ├── /layout               # レイアウト関連
│   │   ├── /ingredients      # 小規模部品
│   │   └── /templates        # 複合コンポーネント
│   └── /common               # 共通コンポーネント
├── /(auth)                   # 認証関連ページ
├── /(public)                 # 公開ページ
├── /(dashboard)              # ダッシュボード
└── /api/v1                   # APIエンドポイント（17個）

/features                     # ビジネスロジック層
├── /routes                   # ルート機能
│   ├── schema.ts             # Zodスキーマ
│   ├── service.ts            # ビジネスロジック
│   ├── repository.ts         # DB操作
│   └── utils.ts              # ユーティリティ
├── /users                    # ユーザー機能
├── /comments                 # コメント機能
├── /likes                    # いいね機能
├── /images                   # 画像機能
├── /views                    # 閲覧履歴機能
└── /searchHistory            # 検索履歴機能

/lib                          # ユーティリティ
├── /auth                     # 認証ロジック
├── /server                   # サーバーユーティリティ
├── /client                   # クライアント状態管理
├── /config                   # 環境設定
└── /translation              # 翻訳機能

/prisma                       # データベース
├── schema.prisma             # スキーマ定義
└── seed.ts                   # シードデータ
```

### 1.2 3層アーキテクチャ

```
┌─────────────────────────────────────────┐
│  API Layer (app/api/v1/)                │
│  - リクエスト受付                        │
│  - 認証確認                              │
│  - バリデーション                        │
│  - レスポンス返却                        │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Service Layer (features/*/service.ts)  │
│  - ビジネスロジック                      │
│  - 認可チェック                          │
│  - 外部サービス連携                      │
│  - データ変換                            │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Repository Layer (features/*/repo.ts)  │
│  - CRUD操作                              │
│  - Prismaクエリ                          │
└─────────────────┬───────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Database (Prisma + PostgreSQL)         │
└─────────────────────────────────────────┘
```

**評価**: 良好。責務が明確に分離されている。

### 1.3 問題点: Service層の責務過多

```typescript
// features/routes/service.ts に以下が混在
export const routesService = {
  // 1. 検索ロジック（Meilisearch連携）
  getRoutes: async () => {
    const meilisearch = getMeilisearch();
    const search = await index.search(query.q);
    // ...
  },

  // 2. 認可チェック
  checkUpdatePermission: async (routeId, userId) => {
    // ...
  },

  // 3. 外部サービス同期
  syncToMeilisearch: async (route) => {
    // 翻訳API呼び出し
    // Meilisearchインデックス更新
  },

  // 4. 招待トークン管理
  generateInvite: async () => { ... },
  acceptInvite: async () => { ... },
}
```

**改善案**:
```
features/routes/
├── service.ts           # 純粋なビジネスロジック
├── searchService.ts     # Meilisearch連携
├── inviteService.ts     # 招待トークン管理
└── repository.ts        # DB操作
```

---

## PART 2: 型定義の問題

### 2.1 型定義が5箇所に分散

| ファイル | 定義されている型 |
|----------|------------------|
| `lib/client/types.ts` | Route, User, Waypoint, Comment, ErrorScheme |
| `lib/server/types.ts` | Route, RouteNode, TransitStep |
| `features/database_schema.ts` | WaypointSchema, TransportationSchema |
| `features/routes/schema.ts` | GetRoutesSchema, PostRouteSchema |
| `features/users/schema.ts` | UserSchema, UpdateUserSchema |

### 2.2 具体例: Waypoint型の重複

**lib/client/types.ts**:
```typescript
export type Waypoint = {
    id?: string;
    type: 'waypoint';
    name: string;
    images?: string[];
    memo: string;
    order: number;
    lat?: number;
    lng?: number;
    source: 'MAPBOX' | 'USER'
    sourceId?: string;
};
```

**features/database_schema.ts**:
```typescript
export const WaypointSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.literal("waypoint"),
  name: z.string(),
  images: z.array(z.string()).max(3).optional(),
  memo: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  source: z.enum(["MAPBOX", "USER"]).optional(),
  sourceId: z.string().optional(),
});
```

**問題**: 同じ構造が2箇所で定義されており、片方を変更するともう片方との不整合が発生する。

### 2.3 改善案: 型定義の統一

```
/lib/types/
├── domain.ts       # Prisma型ベース（Route, User, Comment等）
├── api.ts          # API Request/Response型
├── schemas.ts      # Zodスキーマ（型推論で使用）
└── errors.ts       # カスタムエラー型
```

```typescript
// lib/types/schemas.ts
export const WaypointSchema = z.object({ ... });
export type Waypoint = z.infer<typeof WaypointSchema>;

// 型とスキーマが常に同期
```

---

## PART 3: コード品質の問題

### 3.1 DRY違反: MUIスタイルの重複

**場所**: `app/(public)/_components/ingredients/routeFilter.tsx`

```tsx
// TextField に適用
<TextField
  sx={{
    width: { xs: 200, md: 220 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'var(--background-0)',
      borderRadius: '8px',
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: 'none' }
    },
    '& .MuiInputBase-input': {
      color: 'var(--foreground-0)'
    },
  }}
/>

// Select に適用（同じスタイル）
<Select
  sx={{
    width: { xs: 200, md: 220 },
    '& .MuiOutlinedInput-root': { ... },  // 同じ
    // ...40行以上のコピペ
  }}
/>

// OutlinedInput に適用（同じスタイル）
<OutlinedInput sx={{ ... }} />  // また同じ
```

**改善案**:
```typescript
// lib/styles/mui.ts
export const formFieldStyles = {
  width: { xs: 200, md: 220 },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--background-0)',
    borderRadius: '8px',
    '& fieldset': { border: 'none' },
  },
  // ...
};

// 使用側
<TextField sx={formFieldStyles} />
<Select sx={formFieldStyles} />
```

### 3.2 DRY違反: HTTPリクエストラッパー

**場所**: `lib/client/helpers.ts`

```typescript
// 基本関数
export async function requestToServerWithJson<T>(
  method: string, url: string, body?: unknown
): Promise<T | null> { ... }

// 5つの個別ラッパー（冗長）
export async function postDataToServerWithJson<T>(...) {
  return requestToServerWithJson<T>('POST', url, body);
}
export async function getDataFromServerWithJson<T>(...) {
  return requestToServerWithJson<T>('GET', url);
}
export async function patchDataToServerWithJson<T>(...) { ... }
export async function putDataToServerWithJson<T>(...) { ... }
export async function deleteDataToServerWithJson<T>(...) { ... }
```

**改善案**:
```typescript
// オブジェクト形式で統一
export const api = {
  get: <T>(url: string) => requestToServerWithJson<T>('GET', url),
  post: <T>(url: string, body: unknown) => requestToServerWithJson<T>('POST', url, body),
  patch: <T>(url: string, body: unknown) => requestToServerWithJson<T>('PATCH', url, body),
  delete: <T>(url: string) => requestToServerWithJson<T>('DELETE', url),
};

// 使用側
const user = await api.get<User>('/api/v1/users/me');
```

### 3.3 単一責任原則違反: コンポーネントの肥大化

**場所**: `app/(public)/routes/[id]/_components/templates/commentSection.tsx`

```tsx
export default function CommentSection({ isMobile, routeId }) {
  // 責務1: 状態管理
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 責務2: データ取得
  const fetchComments = async () => {
    setLoading(true);
    const res = await getDataFromServerWithJson<Comment[]>(...);
    setComments(res || []);
    setLoading(false);
  };

  // 責務3: コメント投稿
  const handlePostComment = async (text: string) => {
    await postDataToServerWithJson(...);
    await fetchComments();
  };

  // 責務4: 条件分岐レンダリング
  return (
    <>
      {!isMobile && <DesktopView />}
      {isMobile && <MobileView />}
    </>
  );
}
```

**改善案**:
```typescript
// hooks/useComments.ts
export function useComments(routeId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => { ... };
  const postComment = async (text: string) => { ... };

  useEffect(() => { fetchComments(); }, [routeId]);

  return { comments, loading, postComment };
}

// CommentSection.tsx
export default function CommentSection({ routeId }) {
  const { comments, loading, postComment } = useComments(routeId);
  return <CommentList comments={comments} onPost={postComment} />;
}
```

---

## PART 4: エラーハンドリングの不統一

### 4.1 現状: 4つの異なるパターン

**パターンA: 例外スロー**
```typescript
// lib/server/validateParams.ts
if (!parsed.success) {
  throw parsed.error;
}
```

**パターンB: ErrorSchemeオブジェクト**
```typescript
// lib/client/helpers.ts
catch (error) {
  throw { message: "Network error", code: "NETWORK_ERROR" } as ErrorScheme;
}
```

**パターンC: useStateで管理**
```typescript
// コンポーネント内
const [error, setError] = useState<string | null>(null);
catch (err) {
  setError(err.message);
}
```

**パターンD: リダイレクト**
```typescript
// app/auth/callback/route.ts
return NextResponse.redirect(`${origin}/auth/auth-code-error`);
```

### 4.2 APIレスポンス形式の不一致

**handleError.ts**:
```typescript
return Response.json(
  { message: error.message, code: "ZOD_ERROR" },
  { status: 400 }
);
```

**mapbox/geocode/route.ts**:
```typescript
return NextResponse.json(
  { error: e?.message ?? "Unknown error" },  // "error"キー
  { status: 500 }
);
```

### 4.3 改善案: 統一されたエラーハンドリング

```typescript
// lib/errors/types.ts
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

export interface ApiError {
  message: string;
  code: ErrorCode;
  details?: Record<string, unknown>;
  timestamp: number;
}

// lib/errors/handler.ts
export function createErrorResponse(
  code: ErrorCode,
  message: string,
  status: number
): Response {
  const error: ApiError = {
    message,
    code,
    timestamp: Date.now(),
  };
  return Response.json(error, { status });
}

// 使用側
if (!user) {
  return createErrorResponse('AUTH_ERROR', 'Unauthorized', 401);
}
```

---

## PART 5: 状態管理の問題

### 5.1 現状: Jotai + Zustand の混在

**Jotai（UI状態）**: `lib/client/atoms.ts`
```typescript
export const scrollDirectionAtom = atom<'up' | 'down'>('up');
export const headerHeightAtom = atom<number>(60);
export const isMobileAtom = atom<boolean>(false);
```

**Zustand（ユーザー状態）**: `lib/client/stores/userStore.ts`
```typescript
export const userStore = create<StoreConfig>((set) => ({
  user: initialUser,
  login: async (onStart?, onSuccess?, onFailure?) => { ... },
  edit: async (profile, onStart, onSuccess, onFailure) => { ... },
}));
```

### 5.2 問題点: コールバック地獄

```typescript
// 現在のパターン
userStore.getState().login(
  () => setLoading(true),           // onStart
  (user) => { setUser(user); },     // onSuccess
  (error) => { setError(error); }   // onFailure
);

// 使用側が複雑になる
```

### 5.3 改善案

**Option A: Jotaiに統一**
```typescript
// lib/client/atoms/user.ts
export const userAtom = atom<User | null>(null);
export const userLoadingAtom = atom(false);

export const loginAtom = atom(
  null,
  async (get, set) => {
    set(userLoadingAtom, true);
    const user = await api.get<User>('/api/v1/users/me');
    set(userAtom, user);
    set(userLoadingAtom, false);
  }
);
```

**Option B: ZustandでPromise返却**
```typescript
export const userStore = create<StoreConfig>((set) => ({
  user: null,
  login: async () => {
    const user = await api.get<User>('/api/v1/users/me');
    set({ user });
    return user;  // Promiseで返す
  },
}));

// 使用側
const user = await userStore.getState().login();
```

---

## PART 6: 命名規則の問題

### 6.1 ファイル命名の不統一

```
✓ 正しい例:
  pageTitle.tsx       ← camelCase
  searchBar.tsx       ← camelCase

✗ 不統一な例:
  RouteCardBasic.tsx      ← PascalCase（コンポーネント名と同じ）
  routeCardGraphical.tsx  ← camelCase
  featuredRouteCard.tsx   ← camelCase
```

### 6.2 変数命名の不統一

```typescript
// コンポーネントA
const [isFocused, setIsFocused] = useState(false);  // is接頭辞

// コンポーネントB
const [submitting, setSubmitting] = useState(false);  // 接頭辞なし
const [loading, setLoading] = useState(true);         // 接頭辞なし
```

### 6.3 推奨命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| コンポーネントファイル | PascalCase.tsx | `RouteCard.tsx` |
| フック | camelCase.ts | `useComments.ts` |
| ユーティリティ | camelCase.ts | `helpers.ts` |
| 型定義 | camelCase.ts | `types.ts` |
| boolean状態 | is/has/can接頭辞 | `isLoading`, `hasError` |

---

## PART 7: その他の問題

### 7.1 TODOコメントの放置

**場所**: `app/(auth)/login/page.tsx`
```typescript
// TODO(ukyo): デザイン整える
// TODO(ukyo): loginwithgoogleのエラーハンドリング
// TODO(ukyo): ボタンコンポーネント整理
// TODO(Leon): ログイン中にアクセスした場合のリダイレクト
```

**改善案**: Issueトラッキングに移行

### 7.2 features/components の配置

```
現状:
features/users/components/     ← 9個のコンポーネント
app/_components/               ← 70個のコンポーネント

問題: 配置基準が不明確
```

**改善案**:
```
Option A: 全てapp/_componentsに
  app/_components/features/users/

Option B: ページ固有はページ配下に
  app/(public)/users/[id]/_components/
```

### 7.3 グローバルシングルトンの多用

```typescript
// lib/config/server.ts
declare global {
  var meilisearch: Meilisearch;
  var prisma: PrismaClient;
  var s3Client: S3Client;
}
```

**問題**: テスト時のモック化が困難

**改善案**: 依存性注入パターン
```typescript
// lib/container.ts
export const container = {
  prisma: () => getPrisma(),
  meilisearch: () => getMeilisearch(),
  s3: () => getS3Client(),
};

// テスト時
container.prisma = () => mockPrisma;
```

---

## PART 8: 改善優先度マトリクス

### P1: 高優先度（2週間以内）

| # | 問題 | 影響 | 工数 |
|---|------|------|------|
| 1 | 型定義の統一 | 保守性、バグ防止 | 中 |
| 2 | エラーハンドリング統一 | デバッグ、UX | 中 |
| 3 | Service層の責務分離 | テスタビリティ | 中 |

### P2: 中優先度（1ヶ月以内）

| # | 問題 | 影響 | 工数 |
|---|------|------|------|
| 4 | MUIスタイル抽出 | DRY、保守性 | 小 |
| 5 | カスタムフック抽出 | 可読性、再利用性 | 中 |
| 6 | 状態管理の統一 | 複雑性削減 | 中 |

### P3: 低優先度（ロードマップ）

| # | 問題 | 影響 | 工数 |
|---|------|------|------|
| 7 | 命名規則の統一 | 可読性 | 小 |
| 8 | TODO整理 | 技術的負債 | 小 |
| 9 | DI導入 | テスタビリティ | 大 |

---

## 結論

Routemプロジェクトは**基本的なアーキテクチャは良好**ですが、以下の改善により保守性が大幅に向上します：

1. **型定義の一元化** - DRY原則の遵守
2. **エラーハンドリングの統一** - 開発者体験の向上
3. **責務の分離** - テスタビリティの向上

セキュリティ問題ほど緊急ではありませんが、プロジェクトの成長に伴い技術的負債として蓄積するため、計画的な改善を推奨します。
