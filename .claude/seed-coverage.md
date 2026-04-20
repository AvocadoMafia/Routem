# Prisma seed データ充実度レビュー

現状 `prisma/seed.ts` の coverage と、API 完全検証に必要な不足領域の整理。

- **作成**: 2026-04-19 Tester_2
- **対象**: `prisma/seed.ts` (v6.7 time 現在)

## 1. 現在の seed 内容

| 種別 | 件数 | 特徴 |
|---|---|---|
| Supabase auth users | 5 | lychee/avocado/mango/papaya/plum、`password123`、4言語のロケール分散 |
| Prisma User | 5 | 同上、bio / locale / language セット済 |
| Tag | 8 | History / Nature / Culture / Food / Activity / General / Walk / Temple |
| Spot | 6 | 京都 / 奈良 / 大阪 / 東京 / 福岡 / 洞爺湖 |
| Route | 40 | **全て PUBLIC + DISABLED**、5ユーザーに分散、各1 routeDate + 1 routeNode |
| Budget | 40 (route 毎) | 1000×i JPY |
| Meilisearch index | 40 ドキュメント | routes + tags 両方 |

## 2. テスト観点での不足領域

### 2-1. PRIVATE route (CWE-209 M9 回帰テスト必須)

**不足**: 全 40 件 PUBLIC のため、「Auth/non-owner が PRIVATE route にアクセス → 404」の検証が空行。

**現状の回避策**: 私が psql で 1 件手動 UPDATE (id=11111111-...-000000000001 → PRIVATE) して検証済 (cb4a223 PASS)。

**推奨追加**:
```ts
// route 1-5 を PRIVATE, 6-10 を FRIENDS_ONLY (あれば), 11-40 を PUBLIC に分散
visibility: i <= 5 ? RouteVisibility.PRIVATE
          : i <= 10 ? RouteVisibility.FRIENDS_ONLY
          : RouteVisibility.PUBLIC,
```

### 2-2. collaboratorPolicy の多様性 (403 FORBIDDEN 検証)

**不足**: 全 40 件 `collaboratorPolicy = DISABLED`。 `OPEN` / `REQUEST_TO_JOIN` があれば generateInvite 403 FORBIDDEN と 201 成功の両ケースを seed で固定できる。

**推奨追加**:
```ts
collaboratorPolicy:
  i % 3 === 0 ? RouteCollaboratorPolicy.DISABLED
: i % 3 === 1 ? RouteCollaboratorPolicy.OPEN
:               RouteCollaboratorPolicy.REQUEST_TO_JOIN,
```

### 2-3. Follow 関係 (POST /follows + GET /follows のテスト)

**不足**: 0 件。`Cannot follow yourself` の 400 VALIDATION_ERROR は検証できるが、既存フォロー状態での挙動 (toggle / 重複禁止) テストが空行。

**推奨追加**: seed の最後に
```ts
// lychee → avocado, lychee → mango, avocado → lychee (reciprocal), plum → mango
await prisma.follow.createMany({
  data: [
    { followerId: users[0].id, followeeId: users[1].id },
    { followerId: users[0].id, followeeId: users[2].id },
    { followerId: users[1].id, followeeId: users[0].id },
    { followerId: users[4].id, followeeId: users[2].id },
  ],
  skipDuplicates: true,
});
```

### 2-4. Comment (GET /comments?routeId で空配列以外が欲しい)

**不足**: 0 件。GET は常に `{items:[], nextCursor:null}` で comment 一覧 pagination テスト困難。

**推奨追加**:
```ts
// route 1 に複数ユーザからコメント
const route1Id = `11111111-1111-4111-a111-000000000001`;
await prisma.comment.createMany({
  data: [
    { routeId: route1Id, userId: users[1].id, body: 'Great route!' },
    { routeId: route1Id, userId: users[2].id, body: 'I want to try this.' },
    { routeId: route1Id, userId: users[3].id, body: 'どこが一番良かった?' },
  ],
});
```

### 2-5. Like (home TopRoutes ランキングが empty)

**不足**: 0 件。TopRoutes (routes?type=trending) が view/like 数でソートする場合、seed で固定ランキングが作れる。

**推奨追加**:
```ts
// route 1-10 に 各 route の index 分だけ like (重複避け)
for (let r = 1; r <= 10; r++) {
  const routeId = `11111111-1111-4111-a111-${r.toString().padStart(12, '0')}`;
  const likerCount = 11 - r; // r=1 → 10 likes
  for (let u = 0; u < Math.min(likerCount, users.length); u++) {
    await prisma.like.upsert({
      where: { userId_routeId: { userId: users[u].id, routeId } },
      update: {},
      create: { userId: users[u].id, routeId, target: LikeViewTarget.ROUTE },
    });
  }
}
```

### 2-6. View 履歴 (trending ソート)

**不足**: 0 件。trending は view 数依存の可能性あり。

**推奨追加**: Like と同様のパターンで View を投入。

### 2-7. RouteInvite (revoked/expired の token 検証)

**不足**: 0 件。`Invalid token` / `Token revoked` / `Token expired` の 400 VALIDATION_ERROR 検証に必要。

**推奨追加**:
```ts
const revokedInvite = await prisma.routeInvite.create({
  data: {
    routeId: `11111111-1111-4111-a111-000000000001`,
    tokenHash: sha256('revoked-test-token'),
    issuerId: users[0].id,
    revokedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});
const expiredInvite = await prisma.routeInvite.create({
  data: {
    routeId: `11111111-1111-4111-a111-000000000002`,
    tokenHash: sha256('expired-test-token'),
    issuerId: users[0].id,
    expiresAt: new Date(Date.now() - 1000), // 過去
  },
});
const validInvite = await prisma.routeInvite.create({
  data: {
    routeId: `11111111-1111-4111-a111-000000000003`,
    tokenHash: sha256('valid-test-token'),
    issuerId: users[0].id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
});
console.log('Invite tokens for testing:');
console.log('  revoked:', 'revoked-test-token');
console.log('  expired:', 'expired-test-token');
console.log('  valid:  ', 'valid-test-token');
```

### 2-8. RouteCollaborator

**不足**: 0 件。「authorId は A、collaborator として B が入っている route」が無いと、 generateInvite の collaborator check (service.ts 内の role 判定) テストが fakeable。

**推奨追加**:
```ts
await prisma.routeCollaborator.createMany({
  data: [
    { routeId: `11111111-1111-4111-a111-000000000002`, userId: users[1].id, role: 'EDITOR' },
    { routeId: `11111111-1111-4111-a111-000000000002`, userId: users[2].id, role: 'VIEWER' },
  ],
});
```

### 2-9. 複数 RouteNode / 複数 RouteDate

**不足**: 各 route に 1 routeDate + 1 routeNode のみ。day 2/day 3 のマルチデイ route、 dayあたり複数 node の seed が無い。

**推奨追加**:
```ts
// route 1 と 2 だけ 3 days × 3 nodes に拡張
if (i === 1 || i === 2) {
  routeDates: {
    create: [1, 2, 3].map(day => ({
      day,
      routeNodes: {
        create: [1, 2, 3].map(order => ({
          order,
          details: `Day ${day} stop ${order} for route ${i}`,
          spotId: spotsData[(order + day) % spotsData.length].id,
          transitSteps: order > 1 ? { create: [{ mode: 'WALK', durationMinutes: 15 }] } : undefined,
        })),
      },
    })),
  }
}
```

### 2-10. Image (thumbnail / icon / background)

**不足**: 0 件。PATCH /users/me の `iconId` / `backgroundId` で `ValidationError("New icon image not found")` ケースは、逆に「存在する image」を seed しないと 200 ケースが作れない。

**推奨追加**:
```ts
// 各ユーザに icon + background、 route 1-5 に thumbnail
for (const user of users) {
  const icon = await prisma.image.create({
    data: {
      url: `https://minio:9000/rtmimages/icons/${user.id}.png`,
      key: `icons/${user.id}.png`,
      status: ImageStatus.ACTIVE,
      type: ImageType.USER_ICON,
      uploaderId: user.id,
    }
  });
  await prisma.user.update({ where: { id: user.id }, data: { iconId: icon.id } });
}
```

## 3. リスクレベル判定

| 不足 | リリース blocker? | 影響 |
|---|---|---|
| PRIVATE route 0件 | ⭐ 高 (CWE-209 回帰テスト空洞) | M9/M10 実装変更で regressing しても気付けない |
| policy 多様性 0件 | 中 | generateInvite 403 分岐の実機検証不可 |
| Follow 0件 | 中 | reciprocal follow UI の表示確認不可 |
| Comment 0件 | 低 | pagination 確認不可 (handler は動いている) |
| Like/View 0件 | 中 | TopRoutes ランキング挙動確認不可 |
| RouteInvite 0件 | 中 | 400 VALIDATION_ERROR 実機検証不可 |
| RouteCollaborator 0件 | 中 | role 判定ロジック実機検証不可 |
| マルチ day/node 0件 | 低 | UI 複数 day 表示確認不可 |
| Image 0件 | 低 | PATCH /users/me の 200 ケース検証不可 |

## 4. 推奨アクション

### A. 最低限 (リリース前に追加)
- 2-1 PRIVATE route (M9 回帰テスト用)

### B. 強く推奨 (次の sprint)
- 2-2 policy 多様性
- 2-3 Follow 関係
- 2-7 RouteInvite (valid/revoked/expired の 3 token 固定)
- 2-10 Image (thumbnail / icon)

### C. あると便利 (余裕があれば)
- 2-4 Comment
- 2-5 Like / 2-6 View (ランキングテスト)
- 2-8 RouteCollaborator
- 2-9 マルチ day / node

## 5. seed.ts への追加案 (差分のみ)

`prisma/seed.ts` の `main()` 末尾、 `for (let i = 1; i <= 40; i++)` の後に以下を追加する draft:

```ts
// ===== visibility / policy を分散 =====
// 既存ループ内で i を使って分散する方が合理的。一時的に UPDATE するなら:
await prisma.$transaction([
  // route 1-5 を PRIVATE
  prisma.route.updateMany({
    where: { id: { in: [1,2,3,4,5].map(i => `11111111-1111-4111-a111-${i.toString().padStart(12,'0')}`) } },
    data: { visibility: RouteVisibility.PRIVATE },
  }),
  // route 11-15 を policy OPEN
  prisma.route.updateMany({
    where: { id: { in: [11,12,13,14,15].map(i => `11111111-1111-4111-a111-${i.toString().padStart(12,'0')}`) } },
    data: { collaboratorPolicy: RouteCollaboratorPolicy.OPEN },
  }),
]);

// ===== Follow (reciprocal) =====
await prisma.follow.createMany({
  data: [
    { followerId: users[0].id, followeeId: users[1].id },
    { followerId: users[1].id, followeeId: users[0].id }, // reciprocal
    { followerId: users[0].id, followeeId: users[2].id },
    { followerId: users[4].id, followeeId: users[2].id },
  ],
  skipDuplicates: true,
});

// ===== 固定 RouteInvite (valid/revoked/expired) =====
import crypto from 'crypto';
const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');
await prisma.routeInvite.createMany({
  data: [
    {
      routeId: `11111111-1111-4111-a111-000000000001`,
      tokenHash: sha256('valid-test-token'),
      issuerId: users[0].id,
      expiresAt: new Date(Date.now() + 7*24*60*60*1000),
    },
    {
      routeId: `11111111-1111-4111-a111-000000000002`,
      tokenHash: sha256('revoked-test-token'),
      issuerId: users[0].id,
      revokedAt: new Date(),
      expiresAt: new Date(Date.now() + 7*24*60*60*1000),
    },
    {
      routeId: `11111111-1111-4111-a111-000000000003`,
      tokenHash: sha256('expired-test-token'),
      issuerId: users[0].id,
      expiresAt: new Date(Date.now() - 1000),
    },
  ],
});
console.log('Test tokens: valid-test-token / revoked-test-token / expired-test-token');
```

## 6. CI での seed 活用

`prod-smoke-curls.sh` が seed 前提の assertion (例: GET /routes?limit=1 で 200 `items:[...]`) を持つ場合、CI で:
1. `docker compose up -d postgres redis meilisearch`
2. `DATABASE_URL=... npx prisma db push && npx prisma db seed`
3. `docker compose -f docker-compose-prod.yml up -d app nginx`
4. `./prod-smoke-curls.sh http://localhost`

という流れで regression CI が回せる。
