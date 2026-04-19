# Phase D2 実行計画書 (Engineer_D)

> ⚠️ 本ドキュメントは lib/ リファクタリング Phase D2 の作業指示書。
> Phase D1 は完了済み。本計画の実行は **B/C/E/F 全員の [DONE] 受領後 + PM からの [GO D2]** 受領を待ってから。
> .claude/ 配下は untracked（git 追跡外）。

---

## 0. Phase D2 開始時の前提条件チェックリスト

開始直前に以下を必ず確認:

- [ ] Engineer_B [DONE #2] 受領済み
- [ ] Engineer_C [DONE #3] 受領済み
- [ ] Engineer_E [DONE ENV] 受領済み
- [ ] Engineer_F [DONE ENUM] 受領済み
- [ ] PM から [GO D2] 受領済み
- [ ] `git fetch origin && git pull` 最新化完了（他エンジニアのコミットを取り込む）
- [ ] `git status` で未コミット変更が自分の意図通りのもの以外ないこと確認
- [ ] `npx tsc --noEmit` が **エラー0** で通る
- [ ] ロールバック用タグ打刻: `git tag pre-d2-$(date +%Y%m%d-%H%M)`
- [ ] ブランチ名確認（`77-デプロイ準備`）

---

## 1. 新ディレクトリ構成（最終形）

```
lib/
├── auth/
│   ├── supabase-client.ts        # browser client
│   ├── supabase-client.test.ts   # 既存の client.test.ts をそのまま移動
│   ├── supabase-server.ts        # server client (route handlers / server components)
│   ├── supabase-admin.ts         # service role client
│   ├── session.ts                # updateSession (Next.js middleware用helper)
│   └── google.ts                 # Google OAuth login helper
├── api/
│   ├── client.ts                 # fetch ラッパー + retry/backoff + error scheme utils
│   ├── client.test.ts            # helpers.test.ts のうち computeBackoffMs / isRetryableStatus / fetchWithRetry / toErrorScheme / isErrorScheme
│   ├── server.ts                 # handleRequest + handleError + validateParams + validateUser
│   └── server.test.ts            # 既存 lib/server/handleError.test.ts を移設・import 修正
├── db/
│   ├── prisma.ts                 # getPrisma
│   └── cursor.ts                 # cursor helpers
├── env/
│   ├── client.ts                 # NEXT_PUBLIC_* getter (mapbox, site url, auth redirect)
│   ├── client.test.ts            # 既存 lib/config/client.test.ts を移設
│   ├── server.ts                 # server env getter (supabase url/key)
│   └── server.test.ts            # 既存 lib/config/server.test.ts を移設
├── services/
│   ├── s3.ts                     # getS3Client
│   ├── redis.ts                  # getRedisClient + getRedisClientOrNull
│   ├── meilisearch.ts            # getMeilisearch
│   └── translate.ts              # translateJa2En
├── stores/
│   ├── enumsStore.ts
│   ├── errorStore.ts
│   ├── exchangeRatesStore.ts
│   ├── toastStore.ts
│   ├── toastStore.test.ts
│   ├── uiStore.ts
│   └── userStore.ts
├── hooks/
│   ├── useComments.ts
│   ├── useComments.test.ts
│   ├── useHeaderHeight.ts
│   ├── useInfiniteScroll.ts
│   ├── useLike.ts
│   ├── useLike.test.ts
│   ├── useLocalizedBudget.ts
│   ├── useRouteGeometry.ts
│   ├── useShare.ts
│   └── useShare.test.ts
├── utils/
│   ├── budget.ts                 # formatBudgetByLocale + dbLocaleToAppLocale
│   ├── datetime.ts               # formatDateToYmdInTz + formatRelativeTime (relativeTime.ts を統合)
│   ├── datetime.test.ts          # 既存 lib/client/relativeTime.test.ts を統合
│   ├── enum.ts                   # toSpotSource + toTransitMode (Prisma enum 正規化)
│   ├── enum.test.ts              # helpers.test.ts のうち toSpotSource / toTransitMode
│   ├── image.ts                  # convertToWebP
│   ├── pagination.ts             # MAX_LIMIT + DEFAULT_LIMIT + clampLimit + clampOffset
│   └── upload.ts                 # sanitizeFileName + ALLOWED_*
└── types/
    ├── domain.ts                 # Route / User / Comment / Waypoint / Transportation / RouteItem
    └── error.ts                  # ErrorScheme
```

削除対象ディレクトリ: `lib/client/`, `lib/config/`, `lib/server/`, `lib/datetime/`, `lib/translation/`, `lib/auth/login/`, `lib/auth/supabase/`, `app/[locale]/_components/common/hooks/`

---

## 2. ファイル移動マッピング (before → after)

### 2-A. 単純 git mv（内容変更なし）

| Before | After | コマンド |
|---|---|---|
| lib/auth/supabase/client.ts | lib/auth/supabase-client.ts | `git mv lib/auth/supabase/client.ts lib/auth/supabase-client.ts` |
| lib/auth/supabase/server.ts | lib/auth/supabase-server.ts | 同上 |
| lib/auth/supabase/admin.ts | lib/auth/supabase-admin.ts | 同上 |
| lib/auth/supabase/proxy.ts | lib/auth/session.ts | 同上 |
| lib/auth/login/google.ts | lib/auth/google.ts | 同上 |
| lib/config/client.ts | lib/env/client.ts | 同上 |
| lib/server/cursor.ts | lib/db/cursor.ts | 同上 |
| lib/server/constants.ts | lib/utils/pagination.ts | 同上 |
| lib/server/uploadValidation.ts | lib/utils/upload.ts | 同上 |
| lib/datetime/format.ts | lib/utils/datetime.ts | 同上 |
| lib/translation/translateJa2En.ts | lib/services/translate.ts | 同上 |
| lib/client/stores/enumsStore.ts | lib/stores/enumsStore.ts | `git mv lib/client/stores/* lib/stores/` |
| lib/client/stores/errorStore.ts | lib/stores/errorStore.ts | ↑ 一括 |
| lib/client/stores/exchangeRatesStore.ts | lib/stores/exchangeRatesStore.ts | ↑ |
| lib/client/stores/toastStore.ts | lib/stores/toastStore.ts | ↑ |
| lib/client/stores/toastStore.test.ts | lib/stores/toastStore.test.ts | ↑ |
| lib/client/stores/uiStore.ts | lib/stores/uiStore.ts | ↑ |
| lib/client/stores/userStore.ts | lib/stores/userStore.ts | ↑ |
| lib/client/hooks/useComments.ts | lib/hooks/useComments.ts | `git mv lib/client/hooks/* lib/hooks/` |
| lib/client/hooks/useComments.test.ts | lib/hooks/useComments.test.ts | ↑ |
| lib/client/hooks/useInfiniteScroll.ts | lib/hooks/useInfiniteScroll.ts | ↑ |
| lib/client/hooks/useLike.ts | lib/hooks/useLike.ts | ↑ |
| lib/client/hooks/useLike.test.ts | lib/hooks/useLike.test.ts | ↑ |
| lib/client/hooks/useLocalizedBudget.ts | lib/hooks/useLocalizedBudget.ts | ↑ |
| lib/client/hooks/useRouteGeometry.ts | lib/hooks/useRouteGeometry.ts | ↑ |
| lib/client/hooks/useShare.ts | lib/hooks/useShare.ts | ↑ |
| lib/client/hooks/useShare.test.ts | lib/hooks/useShare.test.ts | ↑ |
| app/[locale]/_components/common/hooks/useHeaderHeight.ts | lib/hooks/useHeaderHeight.ts | git mv |
| lib/auth/supabase/client.test.ts | lib/auth/supabase-client.test.ts | git mv |
| lib/config/client.test.ts | lib/env/client.test.ts | git mv |
| lib/config/server.test.ts | lib/env/server.test.ts | git mv |

### 2-B. 分解が必要（複数ファイルへの分離）

#### lib/config/server.ts → 5ファイル
| 関数 | 移動先 |
|---|---|
| `requireServerEnv`, `getServerSupabaseUrl`, `getServerSupabasePublishableKey` | lib/env/server.ts |
| `getPrisma` (+ global declaration) | lib/db/prisma.ts |
| `getS3Client` (+ global declaration) | lib/services/s3.ts |
| `getMeilisearch` (+ global declaration) | lib/services/meilisearch.ts |
| `getRedisClient`, `getRedisClientOrNull` (+ redisPromise declaration) | lib/services/redis.ts |

実施方法: **新規ファイル5つを Write で作成 → 旧 lib/config/server.ts を `git rm`**。global 宣言は redisPromise / prisma / s3Client / meilisearch の4つを各サービスファイルで個別に保持する（従来の global 名称維持で挙動互換）。

#### lib/server/{handleRequest,handleError,validateParams,validateUser}.ts → lib/api/server.ts
4ファイルの中身を連結して 1ファイル化。exportsは `handleRequest`, `handleError`, `validateParams`, `validateUser`。
→ `git rm lib/server/handleRequest.ts lib/server/handleError.ts lib/server/validateParams.ts lib/server/validateUser.ts`
→ `lib/api/server.ts` を Write

#### lib/client/helpers.ts → 4ファイル
| export | 移動先 |
|---|---|
| `isErrorScheme`, `toErrorScheme`, `HttpMethod`, `requestToServerWithJson`, `postDataToServerWithJson`, `getDataFromServerWithJson`, `patchDataToServerWithJson`, `putDataToServerWithJson`, `deleteDataToServerWithJson` (+ nprogress + requestCount 内部) | lib/api/client.ts |
| `dbLocaleToAppLocale`, `formatBudgetByLocale` (+ localeCurrencyMap, isSupportedCurrencyCode, convertAmount 内部) | lib/utils/budget.ts |
| `convertToWebP` | lib/utils/image.ts |
| `toSpotSource`, `toTransitMode` | lib/utils/enum.ts |

`SpotSource, TransitMode from @prisma/client` は `toSpotSource` / `toTransitMode` が使用するため**保持必須**。`lib/utils/enum.ts` (新設) に移動する。`app/[locale]/(dashboard)/routes/_components/RouteEditorClient.tsx` で 6 箇所 (`toSpotSource` 3 + `toTransitMode` 3) 使用中のため、helpers 分解時に必ず一緒に移行すること。削除すると tsc エラー多数発生。

#### lib/client/types.ts → 削除
全参照を `@/lib/types/domain` または `@/lib/types/error` に置換してから `git rm lib/client/types.ts`。詳細は §4。

---

## 3. import path 置換戦略

tsconfig.json の paths は `@/* → ./*` のみ。追加設定は不要。全置換は sed -i '' (macOS) で対応可能。

### 3-A. 1対1置換（単純 sed 可）

以下は出現パスを一括置換するだけで良い。作業ディレクトリは repo root。

```sh
# 置換定義 (before → after)
declare -a REPLACEMENTS=(
  "@/lib/auth/supabase/client|@/lib/auth/supabase-client"
  "@/lib/auth/supabase/server|@/lib/auth/supabase-server"
  "@/lib/auth/supabase/admin|@/lib/auth/supabase-admin"
  "@/lib/auth/supabase/proxy|@/lib/auth/session"
  "@/lib/auth/login/google|@/lib/auth/google"
  "@/lib/config/client|@/lib/env/client"
  "@/lib/server/cursor|@/lib/db/cursor"
  "@/lib/server/constants|@/lib/utils/pagination"
  "@/lib/server/uploadValidation|@/lib/utils/upload"
  "@/lib/server/handleRequest|@/lib/api/server"
  "@/lib/server/handleError|@/lib/api/server"
  "@/lib/server/validateParams|@/lib/api/server"
  "@/lib/server/validateUser|@/lib/api/server"
  "@/lib/datetime/format|@/lib/utils/datetime"
  "@/lib/translation/translateJa2En|@/lib/services/translate"
)

# stores 一括 (client/stores/X → stores/X)
grep -rl '@/lib/client/stores/' --include='*.ts' --include='*.tsx' . \
  | grep -v node_modules | grep -v '\.next' \
  | xargs sed -i '' 's|@/lib/client/stores/|@/lib/stores/|g'

# hooks 一括 (client/hooks/X → hooks/X)
grep -rl '@/lib/client/hooks/' --include='*.ts' --include='*.tsx' . \
  | grep -v node_modules | grep -v '\.next' \
  | xargs sed -i '' 's|@/lib/client/hooks/|@/lib/hooks/|g'

# 1対1置換を順次適用
for pair in "${REPLACEMENTS[@]}"; do
  before="${pair%%|*}"
  after="${pair##*|}"
  grep -rl "$before" --include='*.ts' --include='*.tsx' . \
    | grep -v node_modules | grep -v '\.next' \
    | xargs sed -i '' "s|$before|$after|g"
done
```

⚠️ macOS の sed は `-i ''` が必要。Linux なら `-i` のみ。

### 3-B. 分岐が必要な置換（手動 or 特殊 sed）

#### lib/config/server → 関数別に行き先が異なる

**方針**: 1ファイル1インポート行単位で手動確認 / 小さめの sed を複数回。最初に grep で全 import 行をリストアップ:

```sh
grep -rn 'from "@/lib/config/server"' --include='*.ts' --include='*.tsx' . \
  | grep -v node_modules | grep -v '\.next'
```

import されている symbol で書き分ける:
| import される symbol | 置換先 |
|---|---|
| `getPrisma` | `@/lib/db/prisma` |
| `getS3Client` | `@/lib/services/s3` |
| `getMeilisearch` | `@/lib/services/meilisearch` |
| `getRedisClient`, `getRedisClientOrNull` | `@/lib/services/redis` |
| `getServerSupabaseUrl`, `getServerSupabasePublishableKey` | `@/lib/env/server` |

同一import文に複数symbolがある場合（例 `import { getMeilisearch, getPrisma, getRedisClientOrNull } from "@/lib/config/server"`）は、import文を分割する必要がある。

**実装**: `rg "from \"@/lib/config/server\"" -n` で該当行を列挙し、Edit/MultiEdit でファイル毎に適切な分割 import に書き換え（約 33 箇所）。sed 一括は困難なので手動処理を推奨。

#### lib/client/helpers → 関数別に行き先が異なる

| import される symbol | 置換先 |
|---|---|
| `requestToServerWithJson`, `getDataFromServerWithJson`, `postDataToServerWithJson`, `patchDataToServerWithJson`, `putDataToServerWithJson`, `deleteDataToServerWithJson`, `HttpMethod`, `isErrorScheme`, `toErrorScheme` | `@/lib/api/client` |
| `dbLocaleToAppLocale`, `formatBudgetByLocale` | `@/lib/utils/budget` |
| `convertToWebP` | `@/lib/utils/image` |
| `toSpotSource`, `toTransitMode` | `@/lib/utils/enum` |

同じく `import { dbLocaleToAppLocale, deleteDataToServerWithJson } from "@/lib/client/helpers"` のようなミックスがある場合は import 文を分割する。`toSpotSource`/`toTransitMode` は現状 `RouteEditorClient.tsx` のみが import しているが、同ファイルでは他に `convertToWebP` / HTTP 系も同一行 import しているため、**import 文を4行に分割**する必要がある。

#### lib/client/types → domain と error に分離

§4 の一覧表に従い Edit で一括置換（MultiEdit 推奨）。

---

## 4. lib/client/types.ts 参照ファイル分類（計 51 箇所、48 ファイル）

> 各ファイルから import している symbol により振り分け:
> - `ErrorScheme` → `@/lib/types/error`
> - それ以外（Route, RouteWithRelations, User, Comment, Waypoint, Transportation, RouteItem） → `@/lib/types/domain`

### 4-A. domain のみ（単純置換）

```
@/lib/client/types → @/lib/types/domain
```

対象ファイル:
- lib/client/hooks/useComments.test.ts                                      [Comment]
- lib/client/hooks/useComments.ts                                           [Comment]
- app/[locale]/(dashboard)/settings/rootClient.tsx                          [User]
- app/[locale]/(public)/routes/[id]/rootClient.tsx                          [Route]
- app/[locale]/(public)/routes/[id]/_components/templates/mapViewer.tsx     [Route]
- app/[locale]/(public)/routes/[id]/_components/templates/initialModal.tsx  [Route]
- app/[locale]/(dashboard)/routes/[id]/edit/clientRoot.tsx                  [Route]
- app/[locale]/(dashboard)/routes/_hooks/useRouteEditor.ts                  [RouteItem, Waypoint, Transportation]
- app/[locale]/(dashboard)/routes/_components/RouteEditorClient.tsx         [Route, RouteItem]
- app/[locale]/(dashboard)/routes/_components/templates/nodeLinkDiagram.tsx [RouteItem]
- app/[locale]/(dashboard)/routes/_components/templates/routeEditingSection.tsx [RouteItem]
- app/[locale]/(dashboard)/routes/_components/ingredients/WaypointCard.tsx  [Waypoint]
- app/[locale]/(dashboard)/routes/_components/ingredients/WaypointEditor.tsx [Waypoint]
- app/[locale]/(dashboard)/routes/_components/ingredients/TransportationEditor.tsx [Transportation]
- app/[locale]/(dashboard)/routes/_components/ingredients/TransportationCard.tsx [Transportation]
- app/[locale]/(dashboard)/routes/_components/ingredients/RouteNode.tsx     [RouteItem]
- app/[locale]/(dashboard)/me/rootClient.tsx                                [Route]
- app/[locale]/(public)/routes/[id]/_components/ingredients/categoryTags.tsx [Route]
- app/[locale]/(public)/users/[id]/rootClient.tsx                           [Route, User]
- app/[locale]/(public)/routes/[id]/_components/ingredients/routeHeader.tsx [Route]
- app/[locale]/(public)/routes/[id]/_components/ingredients/authorSection.tsx [Route]
- app/[locale]/(public)/routes/[id]/_components/ingredients/commentItem.tsx [Comment]
- app/[locale]/(public)/_components/templates/routeListBasic.tsx            [Route]
- app/[locale]/(public)/routes/[id]/_components/ingredients/importButton.tsx [Route]
- app/[locale]/(public)/_components/(followings)/followingsSection.tsx      [Route]
- app/[locale]/(public)/_components/(home)/templates/mapViewerOnMobile.tsx  [Route]
- app/[locale]/(public)/_components/(home)/templates/mapViewerOnLaptop.tsx  [Route]
- app/[locale]/(public)/tags/[name]/rootClient.tsx                          [Route]
- app/[locale]/(public)/_components/(home)/homeSection.tsx                  [Route]
- app/[locale]/(public)/_components/(home)/ingredients/routeList.tsx        [Route]
- app/[locale]/(public)/_components/(home)/ingredients/featuredUserCard.tsx [User]
- app/[locale]/(public)/_components/(home)/ingredients/routeViewer.tsx      [Route]
- app/[locale]/_components/common/templates/userCardGraphical.tsx           [User]
- app/[locale]/(public)/explore/page.tsx                                    [Route]
- app/[locale]/(public)/search/_components/templates/resultsGrid.tsx        [Route]
- app/[locale]/(public)/search/rootClient.tsx                               [Route]

### 4-B. error のみ（単純置換）

```
@/lib/client/types → @/lib/types/error
```

対象ファイル:
- lib/client/hooks/useInfiniteScroll.ts                                     [ErrorScheme]
- lib/client/helpers.ts                                                     [ErrorScheme] ※ helpers.ts は §2-B で分解されるので、分解後の lib/api/client.ts で `from "@/lib/types/error"` として持ち込む
- app/[locale]/(public)/routes/[id]/_components/templates/diagramViewer.tsx [ErrorScheme]

### 4-C. 両方（手動で2行のimportに分割）

対象ファイル:
- lib/client/stores/userStore.ts                                            [ErrorScheme, User]
- app/[locale]/(public)/routes/[id]/_components/templates/relatedArticles.tsx [Route, ErrorScheme]
- app/[locale]/(public)/routes/[id]/_components/templates/detailsViewer.tsx  [Route, ErrorScheme]
- app/[locale]/(public)/_components/(home)/templates/topRoutesList.tsx       [Route; 別行で ErrorScheme]
- app/[locale]/(public)/_components/(home)/templates/recommendedRoutesList.tsx [Route; 別行で ErrorScheme]
- app/[locale]/(public)/_components/(trending)/trendingSection.tsx           [Route, User; 別行で ErrorScheme]
- app/[locale]/(public)/_components/(trending)/templates/trendingRoutesList.tsx [Route; 別行で ErrorScheme]
- app/[locale]/(public)/_components/(home)/templates/topUsersList.tsx        [User; 別行で ErrorScheme]

**手順**: 4-A / 4-B は sed で一括、4-C は Edit で個別に:

```sh
# 4-A: domain only のパス置換 (事前に 4-B と 4-C のファイルを除外)
# → 現実には 4-A / 4-B / 4-C を判定する sed は困難なので、
#   4-C ファイルのみ先に手動で 2行分割 → 残り全部を単純置換で `@/lib/types/domain` に寄せ、
#   最後に 4-B の3ファイルのみ Edit で `domain` → `error` に戻す、という順序が最も安全。
```

より安全な順序（推奨）:

1. **Step 1**: 4-C の 8ファイルを Edit で先に2行 import に分割 (ErrorScheme を別行に切り出し、`@/lib/types/error` から import)
2. **Step 2**: 4-B の 3ファイル (`diagramViewer.tsx`, `useInfiniteScroll.ts`, helpers.ts分解後の api/client.ts) を先に `@/lib/types/error` に置換
3. **Step 3**: 残り全ファイルを一括で `@/lib/client/types` → `@/lib/types/domain` に置換
4. **Step 4**: `git rm lib/client/types.ts`
5. **Step 5**: grep で残骸確認 `grep -rn "@/lib/client/types" --include='*.ts' --include='*.tsx' .` → 0件

---

## 5. 他エンジニアとの競合ファイル一覧

B/C/E/F 完了前に以下ファイルに触ると competing merge になる可能性がある。D2 実行前に pull した上で再確認する。

### Engineer_B
- `lib/config/client.ts` ← D2で `lib/env/client.ts` に移動（B完了後）
- `lib/config/server.ts` ← D2で5ファイルに分解（B完了後）
- `Dockerfile`, `docker-compose-prod.yml`, `.env` ← D2では触らない
- `lib/auth/supabase/client.ts` の `getSupabaseUrl` / `getSupabasePublishableKey` 内部化 ← Phase D1でスキップ、D2 で実施

### Engineer_C
- `lib/auth/supabase/proxy.ts` (Secure cookie 修正) ← D2で `lib/auth/session.ts` に rename （C完了後）
- `lib/client/hooks/useShare.ts`, `useLike.ts`, `useComments.ts` 新規 ← D2で `lib/hooks/` へ移動（C完了後）
- UI関連ファイル ← D2では触らない

### Engineer_E
- `entrypoint.sh`, `features/images/service.ts`, `docker-compose.yml` ← D2では触らない
- `.env` 整理 ← D2では触らない
- `lib/config/server.ts` の Supabase フォールバック削除 ← E完了後に D2 で分解
- `proxy.ts` (root) の PRODUCTION_URL 撤去 ← root proxy.ts は D2 の対象外なので基本は触らないが、`updateSession` import path が変わるので 1行だけ更新必要

### Engineer_F
- `lib/constants/enums.ts` 削除 ← D1 完了時点で既に実施済み
- `lib/types/domain.ts` の Waypoint/Transportation 型を Prisma enum 化 ← F完了後に確認するだけ
- `scripts/schema.ts`, `features/*/schema.ts` ← D2では触らない
- 24ファイルの string literal 置換 ← D2では触らない

**競合回避のマージ手順**:
```sh
git status                        # ローカルが clean であることを確認
git fetch origin
git pull --rebase origin 77-デプロイ準備  # or appropriate upstream
npx tsc --noEmit                  # pull 直後が通ることを確認
git tag pre-d2-$(date +%Y%m%d-%H%M)
```

---

## 6. tsconfig.json paths エイリアス確認

```json
"paths": {
  "@/*": ["./*"]
}
```

`@/*` がワイルドカードで全 lib/ 配下に効くので、**新規追加は不要**。新規ディレクトリ (lib/api, lib/db, lib/env, lib/services, lib/stores, lib/hooks, lib/utils) はすべて `@/lib/api/...` 等で参照可能。

---

## 7. 実行順序（推奨）

1. **[Step 0] 前提条件チェック（§0）**
2. **[Step 1] ディレクトリ作成**（git はディレクトリ自体を管理しないので、初手でファイルを書く）
   - `mkdir -p lib/api lib/db lib/env lib/services lib/stores lib/hooks lib/utils`
3. **[Step 2] 分解系の新規ファイル作成**
   - lib/env/server.ts
   - lib/db/prisma.ts
   - lib/services/{s3,redis,meilisearch,translate}.ts
   - lib/api/server.ts
   - lib/api/client.ts
   - lib/utils/{budget,image,enum}.ts
4. **[Step 3] 単純 git mv 実行（§2-A）**
   - 一括 mv script を走らせる。
   - git が rename 検出するように content は変えない。
5. **[Step 4] 分解元の旧ファイル削除**
   - `git rm lib/config/server.ts lib/client/helpers.ts lib/server/{handleRequest,handleError,validateParams,validateUser}.ts`
6. **[Step 5] 空ディレクトリ削除（git 管理外）**
   - `rmdir lib/client/stores lib/client/hooks lib/client lib/server lib/config lib/datetime lib/translation lib/auth/supabase lib/auth/login app/[locale]/_components/common/hooks`
   - 空でない場合は `ls` で確認
7. **[Step 6] lib/client/types.ts 分類置換（§4）**
   - まず 4-C の8ファイル Edit
   - 次に 4-B ファイルを `@/lib/types/error` に置換
   - 最後に残りを一括 `@/lib/types/domain` に置換
   - `git rm lib/client/types.ts`
8. **[Step 7] 単純 sed で path 置換（§3-A）**
9. **[Step 8] lib/config/server 分岐置換（§3-B）**
   - `rg '@/lib/config/server'` で残り一覧を出し、Edit/MultiEdit で振り分け
10. **[Step 9] lib/client/helpers 分岐置換（§3-B）**
    - `rg '@/lib/client/helpers'` 同上
11. **[Step 10] 検証**
    - `npx tsc --noEmit`
    - `grep -rn "@/lib/client" --include='*.ts' --include='*.tsx' .` → 0件
    - `grep -rn "@/lib/config" --include='*.ts' --include='*.tsx' .` → 0件
    - `grep -rn "@/lib/server" --include='*.ts' --include='*.tsx' .` → 0件
    - `grep -rn "@/lib/datetime" --include='*.ts' --include='*.tsx' .` → 0件
    - `grep -rn "@/lib/translation" --include='*.ts' --include='*.tsx' .` → 0件
    - `grep -rn "@/lib/auth/supabase/" --include='*.ts' --include='*.tsx' .` → 0件
    - `grep -rn "@/lib/auth/login/" --include='*.ts' --include='*.tsx' .` → 0件
12. **[Step 11] コミット粒度**
    - Step 2 新規ファイル → 1 commit
    - Step 3 git mv (auth) → 1 commit
    - Step 3 git mv (config/env) → 1 commit
    - Step 3 git mv (server→db/utils/api) → 1 commit
    - Step 3 git mv (stores) → 1 commit
    - Step 3 git mv (hooks) → 1 commit
    - Step 3 git mv (datetime/translation) → 1 commit
    - Step 4 旧ファイル削除 + import 書き換え → 複数 commit に分ける（機能単位）
    - Step 6 types 整理 → 1 commit

---

## 8. リスクと対応策

### R1: import 置換の取りこぼし
**症状**: tsc エラー `Cannot find module '@/lib/xxx'`
**対応**: Step 10 の grep 検証を段階ごとに実施。残ったら該当行を Edit で個別修正。

### R2: 循環 import
**症状**: dev server でロードエラー / 型推論がおかしくなる
**ハイリスクなペア**:
- `lib/api/client.ts` ← lib/stores/errorStore.ts / lib/stores/userStore.ts (errorStore は helpers→client.ts に依存, userStore は client.ts+supabase-client に依存)
- `lib/hooks/useInfiniteScroll.ts` → lib/stores/errorStore.ts → @/lib/types/error のみ（OK）
**対応**: stores → api → utils の依存方向を厳守（stores から api を import は OK、逆はしない）。lib/api/client.ts に zustand store を import しない方針を維持。

### R3: sed が Windows CRLF / 非 ASCII で失敗
**対応**: macOS 環境なので gsed 不使用、`sed -i ''` のみ使用。日本語コメントを含むファイルでも sed は UTF-8 対応。`grep -rl` は `.` 配下の全テキストを走査するので node_modules / .next を必ず除外。

### R4: Engineer_C の `useComments.ts` が `useLike.ts` を同じディレクトリから import している
**現状**: `import { isAuthError } from "@/lib/client/hooks/useLike"`
**対応**: stores 一括 sed と同じように `@/lib/client/hooks/` → `@/lib/hooks/` の一括置換でケア。hooks 内部の相互 import は sed で全部拾える。

### R5: root の `proxy.ts`（Next.js middleware）が `lib/auth/supabase/proxy` を import
**対応**: Step 8 の単純置換 `@/lib/auth/supabase/proxy` → `@/lib/auth/session` で一緒にケアされる。root の `proxy.ts` 本体は rename しない。

### R6: `toastStore.test.ts` が sibling `toastStore` を何らかの形で参照
**現状確認**: import なし（確認済）。移動しても問題なし。

### R7: 移動後に空ディレクトリが残ると git は気にしないが ls が汚い
**対応**: Step 5 で手動 rmdir。

### R8: Phase D1 で保留した Supabase 内部化を D2 中に忘れる
**対応**: Step 3 で `lib/auth/supabase-client.ts` に rename した直後のコミットで、`getSupabaseUrl` / `getSupabasePublishableKey` を export から外し、内部関数化する（別コミット推奨）。

### R9: features/routes/service.ts など `import { getMeilisearch, getPrisma, getRedisClientOrNull } from "@/lib/config/server"` のような複数 symbol 一行 import
**対応**: Edit で 3行に分割してから sed 置換するか、Edit 一発で書き換える。MultiEdit で replace_all=false の Edit を複数連結するのが最も安全。

### R10: 型チェックが長時間かかる
**対応**: 各大きなステップ後に `npx tsc --noEmit` を走らせる。キャッシュが効くので 2回目以降は高速。

---

## 9. 新規作成ファイル雛形メモ

### lib/env/server.ts
```ts
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY のgetter
// 現在の lib/config/server.ts 先頭 requireServerEnv / getServerSupabaseUrl / getServerSupabasePublishableKey をそのまま移設
```

### lib/db/prisma.ts
```ts
// lib/config/server.ts の getPrisma + `var prisma: PrismaClient` global declaration
```

### lib/services/s3.ts
```ts
// lib/config/server.ts の getS3Client + `var s3Client: S3Client` global declaration
```

### lib/services/redis.ts
```ts
// getRedisClient + getRedisClientOrNull + `var redisPromise: Promise<RedisClientType> | null` global declaration
```

### lib/services/meilisearch.ts
```ts
// getMeilisearch + `var meilisearch: Meilisearch` global declaration
```

### lib/api/server.ts
```ts
// handleRequest + handleError + validateParams + validateUser を 1ファイルに
// 依存: NextResponse, ZodError, z, ErrorScheme from @/lib/types/error, createClient from @/lib/auth/supabase-server
```

### lib/api/client.ts
```ts
// helpers.ts から HTTP 系 + error scheme utils を移設
// 依存: ErrorScheme from @/lib/types/error, nprogress
```

### lib/utils/budget.ts
```ts
// dbLocaleToAppLocale + formatBudgetByLocale + 内部の convertAmount / localeCurrencyMap / isSupportedCurrencyCode
// 依存: Locale from @/i18n/config
```

### lib/utils/image.ts
```ts
// convertToWebP のみ
// 依存なし (DOM APIのみ)
```

### lib/utils/enum.ts
```ts
// toSpotSource + toTransitMode (Prisma enum 値正規化)
// 外部由来の string | null を Prisma enum 値にフォールバック付きで絞り込む。
// 不正値時のフォールバック: SpotSource.USER / TransitMode.OTHER
// 依存: SpotSource, TransitMode from @prisma/client
```

---

## 10. 実行後の成果物チェック

最終 `lib/` tree が §1 と完全一致することを `find lib -type f | sort` で確認。

`npx tsc --noEmit` → エラー0。

`grep -rn "@/lib/client" --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '.next'` → 0件。

import 文の数がほぼ保存されていること (`grep -rln 'from "@/lib' --include='*.ts' --include='*.tsx' .` の行数が D1 終了時点の値 ± α)。

---

## 11. 備考

- Engineer_B が `lib/config/server.ts` 内に新設した `redisPromise` の global は重要な再接続ロジックを含むので、`lib/services/redis.ts` へ忠実にコピー（改変禁止）。
- `lib/client/helpers.ts` を分解する際、冒頭の nprogress 初期化副作用 `NProgress.configure(...)` は `lib/api/client.ts` に移す（side-effect import は 1箇所でのみ発火させる）。
- `lib/auth/supabase-client.ts` の `getSupabaseUrl` / `getSupabasePublishableKey` 内部関数化は別コミットで分離推奨（理由トレースのため）。
- Engineer_F がここで `lib/constants/enums.ts` を既に削除済み（D1 時点で確認済）なので、D2 で触る必要なし。
- `@/i18n/config`, `@/lib/types/*` は変更対象外（paths は既存のまま）。

---

## 12. v2 改訂まとめ (F/E レビュー反映)

本節は F/E からのレビュー指摘を反映した差分。§1〜§11 の記述と矛盾する場合は **本節が優先**。

### 12.1 F's CRITICAL — lib/utils/enum.ts 新設（§2-B の helpers 分解に追記）

- `lib/client/helpers.ts` の **`toSpotSource`, `toTransitMode`** は `app/[locale]/(dashboard)/routes/_components/RouteEditorClient.tsx` で **6箇所で使用中** (`toSpotSource` 3回 + `toTransitMode` 3回)。`@prisma/client` から `SpotSource, TransitMode` を import している。
- 分解後の行き先は **`lib/utils/enum.ts` (新設)**。同ファイルに `SpotSource, TransitMode` の import を持ち込む。
- §1 の tree にも `lib/utils/enum.ts` を追加済。
- 将来 `toLanguage` / `toLocale` / `toRouteFor` 等の同種コーサを追加する場合もこのファイルを玄関口にする。

### 12.2 F's CRITICAL — Engineer_A 追加の retry 系 helpers

helpers.ts に Engineer_A が追加した `computeBackoffMs` / `isRetryableStatus` / `fetchWithRetry` (+ 内部定数 `BASE_BACKOFF_MS` / `MAX_BACKOFF_MS`) は **`lib/api/client.ts` に同居**。理由: `fetchWithRetry` は HTTP ラッパ群と同じ責務領域（retry 可否判定は status/method に閉じており、ここ以外から呼ばれないほうが健全）。

### 12.3 F's CRITICAL — §3-B 置換表の追記

| import される symbol | 置換先 |
|---|---|
| `toSpotSource`, `toTransitMode` | `@/lib/utils/enum` |
| `computeBackoffMs`, `isRetryableStatus`, `fetchWithRetry` | `@/lib/api/client` |

現状 `toSpotSource` / `toTransitMode` を import しているのは `app/[locale]/(dashboard)/routes/_components/RouteEditorClient.tsx` の 1ファイル。1行 import で他の helpers とミックスされているので **Edit/MultiEdit で分割**が必要:

```ts
// Before
import { getDataFromServerWithJson, postDataToServerWithJson, patchDataToServerWithJson, convertToWebP, toSpotSource, toTransitMode } from "@/lib/client/helpers";
// After
import { getDataFromServerWithJson, postDataToServerWithJson, patchDataToServerWithJson } from "@/lib/api/client";
import { convertToWebP } from "@/lib/utils/image";
import { toSpotSource, toTransitMode } from "@/lib/utils/enum";
```

### 12.4 F's HIGH — lib/client/helpers.test.ts の分解

helpers.test.ts (321行、7 describe ブロック) を機能別に分解:

| describe ブロック | 移動先 |
|---|---|
| `computeBackoffMs`, `isRetryableStatus`, `toErrorScheme`, `isErrorScheme`, `fetchWithRetry` (5 describe) | `lib/api/client.test.ts` |
| `toSpotSource`, `toTransitMode` (2 describe) | `lib/utils/enum.test.ts` |

両ファイルで `import { ... } from "./helpers"` を `from "./client"` / `from "./enum"` に書き換え、共通 import (vitest) は両方に、`SpotSource/TransitMode from @prisma/client` は enum.test.ts のみに残す。

### 12.5 E1 (中) — テストファイル 3本の移動先

§2-A の単純 git mv 表に以下を追加（既に 2-A 末尾に追記済）:

| Before | After |
|---|---|
| `lib/auth/supabase/client.test.ts` | `lib/auth/supabase-client.test.ts` |
| `lib/config/client.test.ts` | `lib/env/client.test.ts` |
| `lib/config/server.test.ts` | `lib/env/server.test.ts` |

補足:
- `lib/auth/supabase/client.test.ts` は `getSupabaseUrl` / `getSupabasePublishableKey` を test 対象として import しているため、§7 Step 9 の「getter 内部化」は **D2 スコープからドロップ** する。内部化が必要なら D3 以降で test 更新と同時に実施する。
- `lib/config/server.test.ts` は中身が Supabase getter テストのみなので `lib/env/server.test.ts` で正しい（db/services 系のテストが生まれたら別途分解）。

### 12.6 E2 (低) — features/images/service.test.ts は D2 スコープ外

- 競合ファイル §5 の Engineer_E セクションに明記:
  > **Engineer_E**: `features/images/service.test.ts` は D2 で触らない（features/ 配下の test は別レイヤ）。D2 で `@/lib/server/*` → `@/lib/api/server` 等の import path 置換だけは sed で受けるが、ファイルの移動・分解は対象外。

### 12.7 E3 (中) — 重複 import 文統合 step 追加

§3-A の sed で `@/lib/server/handleRequest` / `handleError` / `validateParams` / `validateUser` 4つが同じ `@/lib/api/server` に寄せられる結果、1ファイル内に同一パスの import 文が複数行並ぶケースが発生する。例:

```ts
// sed 後 (重複状態)
import { handleRequest } from "@/lib/api/server";
import { validateParams } from "@/lib/api/server";
```

→ Step 11 の最終サニティ直前に **Step 10.5: 重複 import 統合** を追加。対象ファイルは以下の grep で抽出:

```sh
# 同一 module を 2回以上 import しているファイルを列挙
grep -rE 'from "@/lib/api/server"' --include='*.ts' --include='*.tsx' . \
  | grep -v node_modules | grep -v '\.next' \
  | awk -F: '{count[$1]++} END {for (f in count) if (count[f]>1) print f}'
```

各該当ファイルを Edit で手動統合:

```ts
// Before (重複 2行)
import { handleRequest } from "@/lib/api/server";
import { validateParams } from "@/lib/api/server";

// After (1行)
import { handleRequest, validateParams } from "@/lib/api/server";
```

同様に `@/lib/api/client` / `@/lib/utils/budget` / `@/lib/utils/enum` / `@/lib/utils/image` でも起こりうるので、まとめて検出 → 統合。

### 12.8 §9 (Supabase getter 内部化) のドロップ

§7 Step 9 は **D2 スコープから外す**。理由: `lib/auth/supabase/client.test.ts` がこれら getter を public API として test しており、内部化するとテストが壊れる。保留し、別フェーズで「テストを含めた内部化 or API 整理」として扱う。

### 12.9 §1 の tree 追記

`lib/utils/enum.ts` と `lib/utils/enum.test.ts` は §1 の `lib/utils/` 配下に追加済み。`lib/utils/datetime.ts` は `formatRelativeTime` 統合版（relativeTime.ts を吸収）。

### 12.10 lib/client/relativeTime.ts 統合

`lib/client/relativeTime.ts` + `lib/client/relativeTime.test.ts` (Engineer_C 追加) は `lib/utils/datetime.ts` + `lib/utils/datetime.test.ts` に統合:

| Before | After |
|---|---|
| `lib/client/relativeTime.ts` の中身 | `lib/utils/datetime.ts` (`formatDateToYmdInTz` を先に mv した後、末尾に `formatRelativeTime` 関連を append) |
| `lib/client/relativeTime.test.ts` の中身 | `lib/utils/datetime.test.ts` として新規 (import を `./datetime` に修正) |
| `lib/client/relativeTime.ts` (ファイル) | `git rm` |
| `lib/client/relativeTime.test.ts` (ファイル) | `git rm` |

呼び出し側 1ファイル (`app/[locale]/(public)/routes/[id]/_components/ingredients/commentItem.tsx`) の import を §3-A の sed リストに追加:

```
"@/lib/client/relativeTime|@/lib/utils/datetime"
```

### 12.11 lib/server/handleError.test.ts → lib/api/server.test.ts

§2-B の server 4ファイル統合に伴い、test も同時に移設:

| Before | After |
|---|---|
| `lib/server/handleError.test.ts` | `lib/api/server.test.ts` (git mv + import path 書き換え) |

書き換え:
- `import { handleError, matchAuthError, isPrismaError } from "./handleError"` → `from "./server"`
- `import { ValidationError } from "./validateParams"` → `from "./server"`

統合後の `lib/api/server.ts` は `ValidationError` も export する必要あり (handleError が `validateParams` 由来の `ValidationError` を判定に使うため、既存 `validateParams.ts` から symbol を維持)。

