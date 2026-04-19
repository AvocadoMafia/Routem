#!/usr/bin/env bash
# Phase D2 開始直前に走らせるプリフライトチェック
#
# 役割:
#   - 作業ブランチが最新か (origin と HEAD がズレていないか)
#   - 未コミット変更の有無
#   - tsc --noEmit が通るか
#   - lib/ 配下の旧構造ファイルが D1 時点のものと一致するか (= B/C/E/F の作業を取り込む前後で差分がないか把握)
#   - rollback タグが打たれているか
#
# 全てパスすれば [GO D2] 実行可。1つでも fail なら原因解消まで D2 着手禁止。
#
# 使い方:
#   ./.claude/phase-d2-preflight.sh

set -uo pipefail

cd "$(git rev-parse --show-toplevel)"

PASS="✅"
FAIL="❌"
WARN="⚠️ "
EXIT_CODE=0

echo "================================"
echo " Phase D2 Preflight Check"
echo "================================"

# -------- 1. ブランチと upstream の状態 --------
echo ""
echo "[1/6] ブランチ / upstream 状態"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "    現在のブランチ: $BRANCH"

git fetch --quiet origin 2>/dev/null || echo "    ($WARN  fetch に失敗。ネットワーク未接続なら後で再実行)"

if git rev-parse --verify --quiet "origin/$BRANCH" >/dev/null; then
  BEHIND=$(git rev-list --count "HEAD..origin/$BRANCH" 2>/dev/null || echo "?")
  AHEAD=$(git rev-list --count "origin/$BRANCH..HEAD" 2>/dev/null || echo "?")
  echo "    ahead:  $AHEAD"
  echo "    behind: $BEHIND"
  if [[ "$BEHIND" != "0" ]]; then
    echo "    $FAIL origin に取り込むべきコミットがあります。 git pull --rebase してから再実行してください。"
    EXIT_CODE=1
  else
    echo "    $PASS ブランチは最新"
  fi
else
  echo "    $WARN  upstream が見つかりません (origin/$BRANCH)"
fi

# -------- 2. 未コミット変更 --------
echo ""
echo "[2/6] 作業ツリーの clean 状態"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "    $FAIL 未コミットの変更があります:"
  git status --short | sed 's/^/        /'
  EXIT_CODE=1
else
  echo "    $PASS clean"
fi

# -------- 3. rollback タグの存在 --------
echo ""
echo "[3/6] rollback タグ (pre-d2-*)"
LATEST_TAG=$(git for-each-ref --sort=-creatordate --format='%(refname:short)' 'refs/tags/pre-d2-*' | head -1 || true)
if [[ -z "$LATEST_TAG" ]]; then
  echo "    $FAIL pre-d2-* タグがありません。 ./.claude/phase-d2-tag-and-rollback.sh tag で打刻してください。"
  EXIT_CODE=1
else
  TAG_COMMIT=$(git rev-parse --short "$LATEST_TAG")
  HEAD_COMMIT=$(git rev-parse --short HEAD)
  if [[ "$TAG_COMMIT" == "$HEAD_COMMIT" ]]; then
    echo "    $PASS $LATEST_TAG は HEAD と同一 ($TAG_COMMIT)"
  else
    echo "    $WARN  $LATEST_TAG ($TAG_COMMIT) と HEAD ($HEAD_COMMIT) が異なります。"
    echo "          D2 開始前に最新位置でタグを打ち直すことを推奨:"
    echo "          ./.claude/phase-d2-tag-and-rollback.sh tag"
  fi
fi

# -------- 4. tsc --noEmit --------
echo ""
echo "[4/6] tsc --noEmit (エラーゼロか)"
if TSC_OUT=$(npx --no-install tsc --noEmit 2>&1); then
  if [[ -z "$TSC_OUT" ]]; then
    echo "    $PASS 型エラーなし"
  else
    echo "    $WARN  警告あり:"
    echo "$TSC_OUT" | head -20 | sed 's/^/        /'
  fi
else
  echo "    $FAIL tsc エラーあり:"
  echo "$TSC_OUT" | head -30 | sed 's/^/        /'
  EXIT_CODE=1
fi

# -------- 5. D2 対象の主要ディレクトリ存在確認 --------
echo ""
echo "[5/6] D2 対象の旧ディレクトリ構造"
REQUIRED_PATHS=(
  lib/auth/supabase/client.ts
  lib/auth/supabase/server.ts
  lib/auth/supabase/admin.ts
  lib/auth/supabase/proxy.ts
  lib/auth/login/google.ts
  lib/config/client.ts
  lib/config/server.ts
  lib/server/cursor.ts
  lib/server/constants.ts
  lib/server/handleRequest.ts
  lib/server/handleError.ts
  lib/server/validateParams.ts
  lib/server/validateUser.ts
  lib/server/uploadValidation.ts
  lib/datetime/format.ts
  lib/translation/translateJa2En.ts
  lib/client/helpers.ts
  lib/client/types.ts
  lib/client/stores/enumsStore.ts
  lib/client/hooks/useInfiniteScroll.ts
)
MISSING=0
for p in "${REQUIRED_PATHS[@]}"; do
  if [[ ! -f "$p" ]]; then
    echo "    $FAIL 不在: $p"
    MISSING=$((MISSING + 1))
  fi
done
if [[ "$MISSING" == "0" ]]; then
  echo "    $PASS 対象ファイルすべて存在 (${#REQUIRED_PATHS[@]}件)"
else
  echo "    → 先行エンジニアが大規模な構造変更をしている可能性あり。D2 プランの再確認を推奨。"
  EXIT_CODE=1
fi

# -------- 6. 新規ディレクトリの衝突確認 --------
echo ""
echo "[6/6] D2 で新規作成するディレクトリの衝突確認"
NEW_DIRS=(lib/api lib/db lib/env lib/services lib/stores lib/hooks lib/utils)
COLLISION=0
for d in "${NEW_DIRS[@]}"; do
  if [[ -d "$d" ]]; then
    echo "    $WARN  既に存在: $d (他エンジニアが先行作成した可能性)"
    COLLISION=$((COLLISION + 1))
  fi
done
if [[ "$COLLISION" == "0" ]]; then
  echo "    $PASS 衝突なし"
fi

# -------- 総評 --------
echo ""
echo "================================"
if [[ "$EXIT_CODE" == "0" ]]; then
  echo " $PASS Preflight PASS — D2 着手可能"
else
  echo " $FAIL Preflight FAIL — 上記 FAIL 項目を解消してから再実行"
fi
echo "================================"
exit "$EXIT_CODE"
