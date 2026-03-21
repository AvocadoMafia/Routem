# Routem プロジェクト 包括的セキュリティ監査報告書

**調査対象**: `/Users/koki/Avocado/Routem`
**ブランチ**: `45-スキーマの更新`
**調査日**: 2026-03-21
**調査範囲**: API、認証、DB設計、クライアント、インフラ、外部連携、ビジネスロジック

---

## エグゼクティブサマリー

本プロジェクトの包括的なセキュリティ監査を実施した結果、**42件のセキュリティ脆弱性・設計問題**を検出しました。

| 重大度 | 件数 | 主な問題 |
|--------|------|----------|
| **CRITICAL** | 5件 | 機密情報露出、npm脆弱性、Open Redirect、CSRF未対策 |
| **HIGH** | 12件 | ファイルアップロード脆弱性、TOCTOU、閲覧履歴漏洩、DoS |
| **MEDIUM** | 18件 | 権限チェック不備、トランザクション欠如、為替計算エラー |
| **LOW** | 7件 | ログ出力、エラーメッセージ詳細化、命名規則 |

**総合セキュリティスコア**: 42/100

---

## PART 1: CRITICAL（緊急対応必須）

### 1.1 機密情報のGit露出
| 項目 | 詳細 |
|------|------|
| **場所** | `.env`ファイル |
| **露出情報** | DBパスワード、Supabase Service Role Key (JWT)、MinIOシークレット、Mapbox APIキー |
| **証拠** | `postgresql://postgres...DayJjbWw4NW0zbjUwNDJ@...supabase.com` |
| **影響** | データベース完全アクセス、Supabase管理者権限、S3バケット操作 |
| **対策** | Git履歴から削除、全シークレットを即時ローテーション |

### 1.2 npm依存関係の既知脆弱性（12件）

**HIGH (6件)**:
| パッケージ | 脆弱性 | CVE |
|------------|--------|-----|
| `@hono/node-server <1.19.10` | Authorization bypass (エンコードスラッシュ) | - |
| `fast-xml-parser 4.0.0-5.5.6` | XML Entity Expansion (DoS) | CVE-2026-26278 |
| `hono <=4.12.6` | XSS (ErrorBoundary)、キャッシュデセプション、IPv4検証バイパス、Prototype Pollution | 複数 |

**MODERATE (6件)**:
| パッケージ | 脆弱性 |
|------------|--------|
| `lodash 4.17.21` | Prototype Pollution (`_.unset`, `_.omit`) |
| `next 16.0.0-16.1.6` | HTTP request smuggling、CSRF bypass (null origin)、unbounded cache growth |

### 1.3 Open Redirect脆弱性
```
場所: app/auth/callback/route.ts:10-13
問題: nextパラメータの検証不十分
攻撃例: /auth/callback?next=//evil.com/phishing
対策: ホワイトリストによるリダイレクト先検証
```

### 1.4 CSRF対策の完全欠如
```
影響範囲: 全POST/DELETE APIエンドポイント
  - POST /api/v1/likes（いいね操作）
  - POST /api/v1/comments（コメント投稿）
  - POST /api/v1/follows（フォロー操作）
  - DELETE /api/v1/routes/[id]（ルート削除）
攻撃シナリオ: 悪意あるサイトから被害者のブラウザ経由で操作実行
```

### 1.5 認証ヘッダーインジェクション
```
場所: app/auth/callback/route.ts:78
問題: x-forwarded-hostヘッダーを無検証で信頼
攻撃: ホストヘッダー偽装によるセッションハイジャック
```

---

## PART 2: HIGH（1週間以内に対応）

### 2.1 ファイルアップロードの脆弱性
```typescript
// app/api/v1/uploads/route.ts
const fileName = url.searchParams.get('fileName') || `upload-${Date.now()}`;
const contentType = url.searchParams.get('contentType') || 'image/webp';
```
| 問題 | 詳細 |
|------|------|
| パストラバーサル | `fileName=../../../etc/passwd` |
| MIME詐称 | `contentType=application/x-sh` |
| 認証不要 | 匿名ユーザーでも署名付きURL取得可能 |

### 2.2 いいね操作のTOCTOU脆弱性
```typescript
// features/likes/service.ts:6-33
const existing = await likesRepository.findByUserAndRoute(userId, routeId);
// ↑ここで取得
if (existing) {
  await likesRepository.deleteByUserAndRoute(...);
} else {
  await likesRepository.createLike(...);  // ← ここで二重作成の可能性
}
```
**レースコンディション**: 同時リクエストで重複いいねが作成される

### 2.3 閲覧履歴の権限チェック欠落
```typescript
// features/views/service.ts:21-32
getViewedRoutes: async (userId: string) => {
  const where = { views: { some: { userId } } };
  return await routesRepository.findMany(where);
  // ↑ PRIVATEルートも全て返される！
}
```
**影響**: プライベートルートの閲覧履歴が漏洩

### 2.4 検索履歴のプライバシー侵害
```typescript
// app/api/v1/searchHistory/route.ts:7-16 (GET)
// 認証チェックなし！
const suggestions = await searchHistoryService.suggest(q, limit);
return NextResponse.json(suggestions);
```
**問題**: 他ユーザーの検索パターンが推測可能

### 2.5 セキュリティヘッダーの完全欠如
```
欠落ヘッダー:
- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security (HSTS)

middleware.ts が存在しない
```

### 2.6 DoS脆弱性（limitパラメータ無制限）
```typescript
// app/api/v1/tags/route.ts
const limit = Number(url.searchParams.get("limit") || 10);
// 上限チェックなし！ limit=999999999 で大量データ取得
```
**影響エンドポイント**: `/api/v1/tags`, `/api/v1/users`, `/api/v1/searchHistory`

### 2.7 招待トークンの使用回数制限未実装
```typescript
// features/routes/service.ts:138-167
// maxUses フィールドはスキーマにあるがチェックされていない！
await routesRepository.updateInvite(invite.id, {
  usedCount: { increment: 1 },
});
// ↑ maxUses との比較なし
```

### 2.8 Mapboxトークンのクライアント露出
```typescript
// NEXT_PUBLIC_ プレフィックスでブラウザに公開
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYXZvdGVjaC...
```
**リスク**: APIトークンの不正利用、課金超過

### 2.9 Dockerポート全公開
```yaml
# docker-compose.yml
services:
  db:
    ports: ["5432:5432"]  # PostgreSQL外部公開
  minio:
    ports: ["9000:9000", "9001:9001"]  # MinIO外部公開
  meilisearch:
    ports: ["7700:7700"]  # Meilisearch外部公開
```

### 2.10 MinIOデフォルト認証情報
```yaml
MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}  # = minioadmin
MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}  # = minioadmin
```

### 2.11 Cookie セキュリティ属性未設定
```
欠落属性:
- HttpOnly
- Secure
- SameSite
```

### 2.12 ログでのユーザーデータ出力
```typescript
// app/auth/callback/route.ts
console.log(userData);  // ユーザーメタデータ全出力
console.log(iconUrl);
console.log(user);
```

---

## PART 3: MEDIUM（2週間以内に対応）

### 3.1 getRouteDetail()のAPI未統合
```
問題: service.tsに権限チェック付きメソッドがあるが、
      APIエンドポイントで使用されていない
場所: features/routes/service.ts:91-111
影響: page.tsxでPrisma直接呼び出し、権限チェック重複
```

### 3.2 トランザクション未使用（3箇所）
| 場所 | 問題 |
|------|------|
| `likes/service.ts` toggleLike | いいねのトグル操作 |
| `users/service.ts` toggleFollow | フォローのトグル操作 |
| `comments/service.ts` deleteComment | 権限チェック→削除 |

### 3.3 為替レート計算の未実装
```typescript
// features/routes/utils.ts:170-178
budget: {
  create: {
    amount: body.budget.amount,
    baseAmount: body.budget.amount,  // ← そのままコピー！
    baseCurrency: "JPY",
  }
}
// USD 100 → baseAmount: 100 JPY（実際は約15,000円）
```

### 3.4 DBスキーマ設計問題
| 問題 | 場所 | 詳細 |
|------|------|------|
| Followリレーション命名逆転 | `prisma/schema.prisma` | `followings`が`@relation("follower")` |
| 自己フォロー防止なし | `Follow`モデル | CHECK制約未実装 |
| Imageのorphan問題 | `Image`モデル | 参照全NULLでも存在可能 |
| 長さ制限なし | `User.bio`, `Comment.text` | VarChar制限未設定 |
| Spot座標nullable | `Spot.longitude/latitude` | 地理情報がnull許容 |

### 3.5 エラーハンドリング問題
```typescript
// 無意味な再スロー（複数箇所）
try {
    return await getPrisma().comment.findMany(...);
} catch (e) {
    throw e;  // ← 何もしていない
}

// エラーメッセージ不一致
"Notfound or Unauthorized"  // スペルミス
"Comment not found"
"User not found"
```

### 3.6 外部API タイムアウト未設定
```typescript
// lib/translation/translateJa2En.ts
const res = await fetch(translateUrl, {...});
// タイムアウト設定なし
```

### 3.7 検索クエリのPII保存
```
問題: ユーザーの検索クエリがそのまま保存される
例: "how to hide from parents" → DB + Meilisearchに記録
GDPR: 削除権（Right to Erasure）未実装
```

### 3.8 Mapbox session_token固定値
```typescript
// app/api/v1/mapbox/geocode/route.ts:8
const session_token = url.searchParams.get("session_token")?.trim()
  || "fixed-session-123";  // ← 全ユーザー共通！
```

### 3.9 認証ヘッダー形式未検証
```typescript
// lib/auth/supabase/server.ts
const authHeader = request.headers.get('Authorization')
if (authHeader) {
    // "Bearer " プレフィックス確認なし
    // トークン形式検証なし
}
```

### 3.10 監査ログの完全欠如
```
未実装:
- ユーザーアクションログ
- 権限変更ログ
- ルート削除ログ
- 管理者操作ログ
```

### 3.11 レート制限の完全欠如
```
影響: 全APIエンドポイント
リスク: DDoS、スパム投稿、ブルートフォース
```

### 3.12-3.18 その他MEDIUM問題
- 入力サイズ制限不足
- uploads typeパラメータ未検証
- VIEW_ONLYポリシー未検証
- Decimal型のJSON変換問題
- N+1クエリの可能性
- バリデーションレイヤー分散
- Service/Utils責務境界曖昧

---

## PART 4: LOW（ロードマップに追加）

### 4.1 console.logの本番環境残存
### 4.2 エラーメッセージの詳細露出（Zodエラー）
### 4.3 TransitStepの単位未明記（km/m、秒/分）
### 4.4 .env.example ファイル欠如
### 4.5 Gender型の不一致（String vs enum）
### 4.6 SearchHistoryの重複ポリシー不明確
### 4.7 View.userId nullableの意図不明

---

## PART 5: 良好な実装（評価すべき点）

| 項目 | 詳細 |
|------|------|
| XSS対策 | `dangerouslySetInnerHTML`未使用、React自動エスケープ |
| SQLインジェクション対策 | Prisma ORM使用、生SQL無し |
| 入力バリデーション | Zodスキーマによる型安全検証 |
| 招待トークンハッシュ化 | SHA256でDB保存、平文非保存 |
| 署名付きURL | 5分有効期限、PUTに限定 |
| Cookie認証 | Supabase SSRによる適切な管理 |
| TypeScript strict | 型安全性確保 |

---

## PART 6: 対応優先度マトリクス

### P0: 即時対応（24時間以内）
1. `.env`をGit履歴から完全削除
2. 全シークレットのローテーション
3. `npm audit fix --force`

### P1: 緊急対応（1週間以内）
4. CSRFトークン実装
5. Open Redirect修正
6. セキュリティヘッダー追加（middleware.ts作成）
7. アップロードエンドポイントの入力検証
8. 閲覧履歴APIのvisibilityフィルタ追加
9. 検索履歴APIの認証追加

### P2: 高優先度（2週間以内）
10. limitパラメータの上限設定
11. トランザクション追加（likes, follows, comments）
12. 招待トークンのmaxUsesチェック
13. Dockerポート制限
14. MinIO認証情報変更

### P3: 中優先度（1ヶ月以内）
15. 為替レート計算実装
16. DBスキーマ制約強化
17. 監査ログシステム実装
18. レート制限実装
19. エラーハンドリング統一

### P4: 長期（ロードマップ）
20. 認可ミドルウェア統一
21. GDPR削除権実装
22. セキュリティテスト自動化

---

## PART 7: 推奨アーキテクチャ改善

### 7.1 middleware.ts の実装例
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // セキュリティヘッダー
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' *.mapbox.com;");

  return response;
}
```

### 7.2 CSRF保護の実装例
```typescript
// lib/csrf.ts
import { randomBytes, createHmac } from 'crypto';

export function generateCsrfToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex');
  const signature = createHmac('sha256', process.env.CSRF_SECRET!)
    .update(sessionId + token)
    .digest('hex');
  return `${token}.${signature}`;
}

export function verifyCsrfToken(token: string, sessionId: string): boolean {
  const [rawToken, signature] = token.split('.');
  const expected = createHmac('sha256', process.env.CSRF_SECRET!)
    .update(sessionId + rawToken)
    .digest('hex');
  return signature === expected;
}
```

### 7.3 レート制限の実装例
```typescript
// lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

---

## 結論

本プロジェクトは基本的なセキュリティプラクティス（XSS対策、SQLi対策、入力バリデーション）を実装していますが、**認証・認可レイヤーの不整合**と**インフラセキュリティの設定不足**が顕著です。

特に**.envファイルのGit露出**は即座の対応が必要であり、シークレットローテーション完了まで本番環境へのデプロイを中止することを強く推奨します。
