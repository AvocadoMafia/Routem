# Phase D2 実行チェックリスト

> 各ステップ後に `npx tsc --noEmit` を挟み、fail-fast する。
> 本チェックリストは `.claude/phase-d2-plan.md` §7 を実作業手順に落としたもの。
> 各ステップの見積り時間は参考値。

---

## Step 0: 開始ゲート（必須）

- [ ] B [DONE #2] / C [DONE #3] / E [DONE ENV] / F [DONE ENUM] すべて受領
- [ ] PM から [GO D2] 受領
- [ ] `git fetch origin && git pull --rebase origin 77-デプロイ準備`
- [ ] `./.claude/phase-d2-preflight.sh` → 全項目 PASS
- [ ] `./.claude/phase-d2-tag-and-rollback.sh tag` → pre-d2-<ts> タグ打刻
- [ ] `./.claude/phase-d2-tag-and-rollback.sh status` で確認

---

## Step 1: 新規ディレクトリ作成（1分）

```sh
mkdir -p lib/api lib/db lib/env lib/services lib/stores lib/hooks lib/utils
```

- [ ] mkdir 実行 (git は空ディレクトリを管理しないのでこの時点ではコミット不要)

---

## Step 2: 分解系の新規ファイル作成（20〜30分）

内容は `.claude/phase-d2-plan.md` §9 を参照。**Write tool** で作成。

- [ ] `lib/env/server.ts` (requireServerEnv + getServerSupabase*)
- [ ] `lib/db/prisma.ts` (getPrisma + global `var prisma` 宣言)
- [ ] `lib/services/s3.ts` (getS3Client + global `var s3Client`)
- [ ] `lib/services/redis.ts` (getRedisClient + getRedisClientOrNull + global `var redisPromise`)
- [ ] `lib/services/meilisearch.ts` (getMeilisearch + global `var meilisearch`)
- [ ] `lib/api/server.ts` (handleRequest + handleError (+ matchAuthError, isPrismaError) + validateParams (+ ValidationError) + validateUser を統合 export)
- [ ] `lib/api/client.ts` (nprogress + error scheme utils + HTTP ラッパ群 + retry系: computeBackoffMs/isRetryableStatus/fetchWithRetry + 内部定数 BASE_BACKOFF_MS/MAX_BACKOFF_MS)
- [ ] `lib/utils/budget.ts` (dbLocaleToAppLocale + formatBudgetByLocale + 内部関数)
- [ ] `lib/utils/image.ts` (convertToWebP)
- [ ] `lib/utils/enum.ts` (toSpotSource + toTransitMode, Prisma enum 正規化, 依存: SpotSource/TransitMode from @prisma/client) 【v2 F's CRITICAL】

> ⚠️ test ファイルは **Step 2 では作らない**。既存の helpers.test.ts / handleError.test.ts / relativeTime.test.ts はそのまま Step 3-4 で mv + 分解する。Step 2 で新規作成するのはプロダクトコードのみ。

**コミット**: "lib: add new module skeletons for D2 refactor (config split, api, utils)"

- [ ] `npx tsc --noEmit` エラーゼロ (既存 importers は旧パスを向いたままなのでまだ通る)

---

## Step 3: 単純 git mv（15分）

```sh
# auth
git mv lib/auth/supabase/client.ts  lib/auth/supabase-client.ts
git mv lib/auth/supabase/server.ts  lib/auth/supabase-server.ts
git mv lib/auth/supabase/admin.ts   lib/auth/supabase-admin.ts
git mv lib/auth/supabase/proxy.ts   lib/auth/session.ts
git mv lib/auth/login/google.ts     lib/auth/google.ts
rmdir lib/auth/supabase lib/auth/login

# env
git mv lib/config/client.ts lib/env/client.ts

# db / utils (from server)
git mv lib/server/cursor.ts            lib/db/cursor.ts
git mv lib/server/constants.ts         lib/utils/pagination.ts
git mv lib/server/uploadValidation.ts  lib/utils/upload.ts

# utils / services (from top-level single-file dirs)
git mv lib/datetime/format.ts              lib/utils/datetime.ts
git mv lib/translation/translateJa2En.ts   lib/services/translate.ts
rmdir lib/datetime lib/translation

# stores (一括)
git mv lib/client/stores/enumsStore.ts          lib/stores/enumsStore.ts
git mv lib/client/stores/errorStore.ts          lib/stores/errorStore.ts
git mv lib/client/stores/exchangeRatesStore.ts  lib/stores/exchangeRatesStore.ts
git mv lib/client/stores/toastStore.ts          lib/stores/toastStore.ts
git mv lib/client/stores/toastStore.test.ts     lib/stores/toastStore.test.ts
git mv lib/client/stores/uiStore.ts             lib/stores/uiStore.ts
git mv lib/client/stores/userStore.ts           lib/stores/userStore.ts
rmdir lib/client/stores

# hooks (一括)
git mv lib/client/hooks/useComments.ts         lib/hooks/useComments.ts
git mv lib/client/hooks/useComments.test.ts    lib/hooks/useComments.test.ts
git mv lib/client/hooks/useInfiniteScroll.ts   lib/hooks/useInfiniteScroll.ts
git mv lib/client/hooks/useLike.ts             lib/hooks/useLike.ts
git mv lib/client/hooks/useLike.test.ts        lib/hooks/useLike.test.ts
git mv lib/client/hooks/useLocalizedBudget.ts  lib/hooks/useLocalizedBudget.ts
git mv lib/client/hooks/useRouteGeometry.ts    lib/hooks/useRouteGeometry.ts
git mv lib/client/hooks/useShare.ts            lib/hooks/useShare.ts
git mv lib/client/hooks/useShare.test.ts       lib/hooks/useShare.test.ts
rmdir lib/client/hooks

# useHeaderHeight を lib へ
git mv app/\[locale\]/_components/common/hooks/useHeaderHeight.ts lib/hooks/useHeaderHeight.ts
rmdir app/\[locale\]/_components/common/hooks

# 【v2 E1】test ファイル群の mv (単純 mv のみ、import 書き換えは後で)
git mv lib/auth/supabase/client.test.ts  lib/auth/supabase-client.test.ts
git mv lib/config/client.test.ts         lib/env/client.test.ts
git mv lib/config/server.test.ts         lib/env/server.test.ts
git mv lib/server/handleError.test.ts    lib/api/server.test.ts   # ↓ Step 5.5 で import 書き換え
```

- [ ] auth 5件 mv
- [ ] env 1件 mv
- [ ] db/utils (server由来) 3件 mv
- [ ] datetime/translation 2件 mv + rmdir
- [ ] stores 7件 mv + rmdir
- [ ] hooks 9件 mv + rmdir
- [ ] useHeaderHeight.ts 1件 mv + rmdir
- [ ] test 4件 mv (supabase-client.test / env/client.test / env/server.test / api/server.test) 【v2 E1】
- [ ] `npx tsc --noEmit` — 旧パス参照しているファイルがあれば大量エラー (Step 7-10 で解消予定。一旦無視してコミット)

**コミット**: "lib: git mv files to new structure (auth, env, db, utils, services, stores, hooks)"

> 💡 tsc エラーが出た状態でコミットするのは通常避けるべきだが、git rename 検出を最大化するため「中身を変えない純粋 mv コミット」を独立させる。直後の Step 4-10 で import を直せば、PR 全体では緑になる。

---

## Step 4: 分解元の旧ファイル削除（2分）

```sh
git rm lib/config/server.ts
git rm lib/client/helpers.ts
git rm lib/server/handleRequest.ts lib/server/handleError.ts lib/server/validateParams.ts lib/server/validateUser.ts
rmdir lib/server lib/config lib/client
```

- [ ] 6ファイル rm + 3ディレクトリ rmdir

---

## Step 5: lib/client/types.ts 分類置換（§4）

### 5-a. 4-C (両方) を先に 2行 import へ分割（8ファイル、Edit 手動）

- [ ] `lib/client/stores/userStore.ts` → (D1で移動済) → 現パスは `lib/stores/userStore.ts`
  ```ts
  // before:
  import {ErrorScheme, User} from "@/lib/client/types"
  // after:
  import { User } from "@/lib/types/domain"
  import { ErrorScheme } from "@/lib/types/error"
  ```
- [ ] `app/[locale]/(public)/routes/[id]/_components/templates/relatedArticles.tsx`
- [ ] `app/[locale]/(public)/routes/[id]/_components/templates/detailsViewer.tsx`
- [ ] `app/[locale]/(public)/_components/(home)/templates/topRoutesList.tsx` (Route + 別行 ErrorScheme)
- [ ] `app/[locale]/(public)/_components/(home)/templates/recommendedRoutesList.tsx`
- [ ] `app/[locale]/(public)/_components/(trending)/trendingSection.tsx` (Route, User + 別行 ErrorScheme)
- [ ] `app/[locale]/(public)/_components/(trending)/templates/trendingRoutesList.tsx`
- [ ] `app/[locale]/(public)/_components/(home)/templates/topUsersList.tsx` (User + 別行 ErrorScheme)

### 5-b. 4-B (error only) を `@/lib/types/error` に置換（3ファイル）

```sh
# Step 3 後、lib/client/hooks は lib/hooks になっているのでパスに注意
for f in \
  app/\[locale\]/\(public\)/routes/\[id\]/_components/templates/diagramViewer.tsx \
  lib/hooks/useInfiniteScroll.ts
do
  sed -i '' 's|@/lib/client/types|@/lib/types/error|g' "$f"
done
# lib/api/client.ts は Step 2 で新規作成時に @/lib/types/error を直接 import する想定なので対象外
```

- [ ] 2ファイル sed (helpers.ts 分解先の api/client.ts は初めから error 参照)

### 5-c. 残りを一括で `@/lib/types/domain` に置換

```sh
grep -rl '@/lib/client/types' --include='*.ts' --include='*.tsx' . \
  | grep -v node_modules | grep -v '\.next' \
  | xargs sed -i '' 's|@/lib/client/types|@/lib/types/domain|g'
```

- [ ] 残り 36ファイル一括

### 5-d. 残骸確認 + 削除

```sh
grep -rn '@/lib/client/types' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'
# → 0件確認後
git rm lib/client/types.ts
```

- [ ] grep 0件確認
- [ ] `git rm lib/client/types.ts`

**コミット**: "lib: migrate @/lib/client/types → @/lib/types/{domain,error}, remove shim"

---

## Step 6: 単純 sed で path 置換（10分）

プラン §3-A のスクリプトを走らせる。以下まとめ:

```sh
# stores / hooks 一括
grep -rl '@/lib/client/stores/' --include='*.ts' --include='*.tsx' . \
  | grep -v node_modules | grep -v '\.next' \
  | xargs sed -i '' 's|@/lib/client/stores/|@/lib/stores/|g'

grep -rl '@/lib/client/hooks/' --include='*.ts' --include='*.tsx' . \
  | grep -v node_modules | grep -v '\.next' \
  | xargs sed -i '' 's|@/lib/client/hooks/|@/lib/hooks/|g'

# 1対1 置換
replacements=(
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
for pair in "${replacements[@]}"; do
  before="${pair%%|*}"
  after="${pair##*|}"
  grep -rl "$before" --include='*.ts' --include='*.tsx' . \
    | grep -v node_modules | grep -v '\.next' \
    | xargs -I{} sed -i '' "s|$before|$after|g" {}
done

# useHeaderHeight.ts パス変更
grep -rl "@/app/\[locale\]/_components/common/hooks/useHeaderHeight" --include='*.ts' --include='*.tsx' . \
  | grep -v node_modules | grep -v '\.next' \
  | xargs sed -i '' 's|@/app/\[locale\]/_components/common/hooks/useHeaderHeight|@/lib/hooks/useHeaderHeight|g'
# 相対パスで import されている箇所は個別確認
```

- [ ] stores/hooks 一括
- [ ] 15パターンの一対一置換
- [ ] useHeaderHeight の import パス更新 (存在する場合)
- [ ] `npx tsc --noEmit` — この時点で残りは config/server と helpers の分岐案件のみ

**コミット**: "lib: rewrite import paths for renamed modules (auth, env, db, stores, hooks, utils, services)"

---

## Step 7: lib/config/server 分岐置換（15分）

```sh
rg 'from ["\x27]@/lib/config/server["\x27]' --type=ts --type=tsx
```

各 import 文を Edit / MultiEdit で対象ファイルごとに振り分け:

| import される symbol | 置換先 |
|---|---|
| getPrisma | `@/lib/db/prisma` |
| getS3Client | `@/lib/services/s3` |
| getMeilisearch | `@/lib/services/meilisearch` |
| getRedisClient, getRedisClientOrNull | `@/lib/services/redis` |
| getServerSupabaseUrl, getServerSupabasePublishableKey | `@/lib/env/server` |

複数 symbol 一行 import の場合は import 文を分割 (例: `import { getMeilisearch, getPrisma, getRedisClientOrNull } from "@/lib/config/server"` → 3行).

- [ ] 対象ファイルリストを `rg` で出力
- [ ] 各ファイルを Edit で修正
- [ ] `grep -rn '@/lib/config/server' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'` → 0件
- [ ] `npx tsc --noEmit`

**コミット**: "lib: split @/lib/config/server imports into db/prisma, services/{s3,redis,meilisearch}, env/server"

---

## Step 8: lib/client/helpers 分岐置換（15分）

```sh
rg 'from ["\x27]@/lib/client/helpers["\x27]' --type=ts --type=tsx
```

| import される symbol | 置換先 |
|---|---|
| HTTP系 (requestToServerWithJson, get/post/patch/put/delete*, HttpMethod), isErrorScheme, toErrorScheme | `@/lib/api/client` |
| dbLocaleToAppLocale, formatBudgetByLocale | `@/lib/utils/budget` |
| convertToWebP | `@/lib/utils/image` |
| toSpotSource, toTransitMode | `@/lib/utils/enum` |

複数 symbol 一行の場合は分割。例: `import { dbLocaleToAppLocale, deleteDataToServerWithJson } from "@/lib/client/helpers"` → 2行に。`RouteEditorClient.tsx` は HTTP 系 + `convertToWebP` + `toSpotSource` + `toTransitMode` を 1 行で import しているため、3 行 (`api/client`, `utils/image`, `utils/enum`) に分割すること。

- [ ] 対象ファイルリスト出力
- [ ] 各ファイル Edit
- [ ] `grep -rn '@/lib/client/helpers' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'` → 0件
- [ ] `npx tsc --noEmit`

**コミット**: "lib: split @/lib/client/helpers imports into api/client, utils/budget, utils/image"

---

## Step 9: Supabase key/url getter 内部化（5分）

Phase D1 で保留した項目。`lib/auth/supabase-client.ts` の `getSupabaseUrl` / `getSupabasePublishableKey` を export から外し、ファイル内部でしか使わない関数にする。

- [ ] `export` 除去
- [ ] 外部からの import が無いことを `grep -rn 'getSupabaseUrl\|getSupabasePublishableKey'` で再確認
- [ ] `npx tsc --noEmit`

**コミット**: "auth: make supabase env getters private to supabase-client module"

---

## Step 10: 残骸の総合検証（5分）

以下の grep が **全て0件** であること。0件でない場合は該当箇所を個別修正。

- [ ] `grep -rn '@/lib/client/' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'`
- [ ] `grep -rn '@/lib/config' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'`
- [ ] `grep -rn '@/lib/server' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'`
- [ ] `grep -rn '@/lib/datetime' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'`
- [ ] `grep -rn '@/lib/translation' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'`
- [ ] `grep -rn '@/lib/auth/supabase/' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'`
- [ ] `grep -rn '@/lib/auth/login/' --include='*.ts' --include='*.tsx' . | grep -v node_modules | grep -v '\.next'`

---

## Step 11: 最終サニティチェック（5分）

- [ ] `find lib -type f | sort` が .claude/phase-d2-plan.md §1 の構成と一致
- [ ] `npx tsc --noEmit` エラー0
- [ ] `npm test` or `npx vitest run` が通る (既存のテストスイートを壊していないか)
- [ ] 主要ページを dev server で目視 (PMの判断)
  - [ ] `/` (home)
  - [ ] `/routes/:id`
  - [ ] `/me` (dashboard)
  - [ ] `/settings`
  - [ ] `/explore`
  - [ ] `/signup`, `/login`
- [ ] nprogress が正常に動く (API 呼び出し時のバー表示)

---

## Step 12: PR / コミット整理

最終的なコミット一覧 (例):

1. `lib: add new module skeletons for D2 refactor`
2. `lib: git mv files to new structure`
3. `lib: migrate @/lib/client/types → @/lib/types/{domain,error}`
4. `lib: rewrite import paths for renamed modules`
5. `lib: split @/lib/config/server imports`
6. `lib: split @/lib/client/helpers imports`
7. `auth: make supabase env getters private`

必要に応じて rebase -i で squash/fixup。ただし **git mv の rename 検出は crossmodify で壊れる**ので、#2 は単独維持推奨。

---

## 緊急時

- `./.claude/phase-d2-tag-and-rollback.sh rollback` で pre-d2-* タグに一発戻し
- 中途半端な状態で詰まったら PM に状況を送って判断仰ぐ
