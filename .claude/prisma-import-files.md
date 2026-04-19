# @prisma/client import ファイル一覧

> Engineer_F (enum統一作業) のメモ。
> Phase D2 の import path 置換で「これらのファイルの `@prisma/client` は据え置き対象である」ことを明示するための参照資料。
> 生成日: 2026-04-19
> 最終再生成: `grep -rln 'from "@prisma/client"' --include='*.ts' --include='*.tsx' .` で再生成可能

## 目的

- D2 の sed スクリプト（`@/lib/...` プレフィックスのみを対象）が `@prisma/client`（`@prisma/` プレフィックス）に**誤爆しないことを確認済**
- ただし将来 `@prisma/` を含む置換（例: `@prisma/client` → `@prisma/shared-client` のような alias 変更）が発生する場合は、下記リストが影響範囲

## D2 でパス変更されるファイル（5件、要注意）

| ファイル | D2 での扱い | @prisma/client import の扱い |
|---|---|---|
| `lib/client/stores/userStore.ts` | `lib/stores/userStore.ts` に単純 git mv | そのまま保持 |
| `lib/client/stores/enumsStore.ts` | `lib/stores/enumsStore.ts` に単純 git mv | そのまま保持 |
| `lib/client/helpers.ts` | 3ファイルに分解（lib/api/client.ts, lib/utils/budget.ts, lib/utils/image.ts + **lib/utils/enum.ts** ※1） | **※1**: `SpotSource, TransitMode` は `lib/utils/enum.ts` (新設) の `toSpotSource` / `toTransitMode` が使用。RouteEditorClient.tsx で6箇所使用中のため D2 で必ず移行すること |
| `lib/client/helpers.test.ts` | 2ファイルに分解（lib/api/client.test.ts, lib/utils/enum.test.ts） | そのまま保持（enum テストを含む side） |
| `lib/config/server.ts` | 5ファイルに分解（lib/env/server.ts, lib/db/prisma.ts, lib/services/{s3,redis,meilisearch}.ts） | `PrismaClient` import は `lib/db/prisma.ts` に移動 |

## D2 で触れないファイル（39件、完全に安全）

### lib/types/ (1)
- `lib/types/domain.ts` ← D2 では移動しない (Waypoint/Transportation の Prisma enum 型を保持)

### features/ (20)
- `features/database_schema.ts`
- `features/comments/schema.ts`
- `features/exchangeRates/repository.ts`
- `features/images/service.ts`
- `features/images/repository.ts`
- `features/likes/schema.ts`
- `features/likes/service.ts`
- `features/likes/repository.ts`
- `features/routes/schema.ts`
- `features/routes/service.ts`
- `features/routes/repository.ts`
- `features/routes/utils.ts`
- `features/routes/explore/schema.ts`
- `features/routes/explore/service.ts`
- `features/routes/search/schema.ts`
- `features/routes/search/service.ts`
- `features/users/schema.ts`
- `features/users/repository.ts`
- `features/views/service.ts`
- `features/views/repository.ts`

### app/ (12)
- `app/api/v1/meta/enums/route.ts`
- `app/api/v1/meta/enums/user/route.ts`
- `app/api/v1/tags/route.ts`
- `app/auth/callback/route.ts`
- `app/[locale]/(dashboard)/routes/[id]/edit/page.tsx`
- `app/[locale]/(dashboard)/routes/_components/RouteEditorClient.tsx`
- `app/[locale]/(dashboard)/routes/_components/ingredients/RouteNode.tsx`
- `app/[locale]/(dashboard)/routes/_components/ingredients/TransportationCard.tsx`
- `app/[locale]/(dashboard)/routes/_components/ingredients/TransportationEditor.tsx`
- `app/[locale]/(dashboard)/routes/_components/templates/routeSettingsSection.tsx`
- `app/[locale]/(dashboard)/routes/_hooks/useRouteEditor.ts`
- `app/[locale]/(public)/explore/_components/templates/exploreCard.tsx`

### scripts/ (4)
- `scripts/generateRecommendations.ts`
- `scripts/schema.ts`
- `scripts/seedExchangeRates.ts`
- `scripts/updateExchangeRates.ts`

### prisma/ (1)
- `prisma/seed.ts`

### lib/server/ (1)
- `lib/server/handleError.ts`
- `lib/server/handleError.test.ts` （※ D2 で `lib/api/server.test.ts` に吸収される予定）

## 再生成コマンド

```sh
grep -rln 'from "@prisma/client"' --include='*.ts' --include='*.tsx' . \
  | grep -v node_modules | grep -v '\.next' | sort
```

## 関連エンジニア

- 本リストを整理したのは Engineer_F (enum統一作業)
- D2 plan 作成は Engineer_D
- D2 plan へのクロスチェック反映は PM 経由で依頼済み（CRITICAL-1/2/3 + HIGH-1）
