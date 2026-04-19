#!/usr/bin/env bash
# =============================================================================
# Routem prod smoke test
# =============================================================================
# 全エンドポイントに対して curl で期待 HTTP status と body のキー存在を assert
# する。Tester_2 が prod stack で PASS 確認した curl を shell 化したもの。
#
# 使い方:
#   ./prod-smoke-curls.sh                    # http://localhost (prod stack 同一ホスト)
#   ./prod-smoke-curls.sh http://routem.net  # 本番環境
#   ./prod-smoke-curls.sh https://routem.net # HTTPS 切替後
#
# 前提:
#   - prod stack が起動済 (nginx:80 or :443 + app:3000 + DB 全て up)
#   - build 時の NEXT_PUBLIC_SITE_URL がこのスクリプトの BASE と一致している
#     (不一致の場合 CORS で全 403 になる)
#   - 空 DB でも一部 200 を期待するテストがあるので `prisma db seed` 実施推奨
# =============================================================================

set -eu

BASE=${1:-http://localhost}
ORIGIN="$BASE"

PASS=0
FAIL=0
FAIL_LOG=""

color_ok()   { printf '\033[32m%s\033[0m' "$*"; }
color_fail() { printf '\033[31m%s\033[0m' "$*"; }

# -----------------------------------------------------------------------------
# assert_status <label> <expected-status> <curl-args...>
#   curl 実行して status と body を取得し、status が expected と一致するかチェック
# -----------------------------------------------------------------------------
assert_status() {
  local label="$1"
  local expected="$2"
  shift 2

  local tmpbody
  tmpbody=$(mktemp)
  local actual
  actual=$(curl -sS -o "$tmpbody" -w '%{http_code}' "$@")
  local body
  body=$(cat "$tmpbody")
  rm -f "$tmpbody"

  if [[ "$actual" == "$expected" ]]; then
    PASS=$((PASS + 1))
    printf '  [%s] %s: %s\n' "$(color_ok PASS)" "$label" "$actual"
  else
    FAIL=$((FAIL + 1))
    FAIL_LOG+="  [$label] expected=$expected actual=$actual body=$body"$'\n'
    printf '  [%s] %s: expected=%s actual=%s\n       body=%s\n' \
      "$(color_fail FAIL)" "$label" "$expected" "$actual" "$body"
  fi
}

# -----------------------------------------------------------------------------
# assert_body_contains <label> <expected-status> <expected-substring> <curl-args...>
#   status と body substring を両方チェック
# -----------------------------------------------------------------------------
assert_body_contains() {
  local label="$1"
  local expected_status="$2"
  local expected_sub="$3"
  shift 3

  local tmpbody
  tmpbody=$(mktemp)
  local actual_status
  actual_status=$(curl -sS -o "$tmpbody" -w '%{http_code}' "$@")
  local body
  body=$(cat "$tmpbody")
  rm -f "$tmpbody"

  if [[ "$actual_status" == "$expected_status" ]] && grep -q "$expected_sub" <<<"$body"; then
    PASS=$((PASS + 1))
    printf '  [%s] %s: %s contains %q\n' "$(color_ok PASS)" "$label" "$actual_status" "$expected_sub"
  else
    FAIL=$((FAIL + 1))
    FAIL_LOG+="  [$label] expected=$expected_status+$expected_sub actual=$actual_status body=$body"$'\n'
    printf '  [%s] %s: expected=%s+%q actual=%s\n       body=%s\n' \
      "$(color_fail FAIL)" "$label" "$expected_status" "$expected_sub" "$actual_status" "$body"
  fi
}

# -----------------------------------------------------------------------------
# assert_body_not_contains <label> <expected-status> <forbidden-substring> <curl-args...>
#   本番マスクの回帰防止用: body に漏洩 keyword が **含まれない** ことを assert
# -----------------------------------------------------------------------------
assert_body_not_contains() {
  local label="$1"
  local expected_status="$2"
  local forbidden="$3"
  shift 3

  local tmpbody
  tmpbody=$(mktemp)
  local actual_status
  actual_status=$(curl -sS -o "$tmpbody" -w '%{http_code}' "$@")
  local body
  body=$(cat "$tmpbody")
  rm -f "$tmpbody"

  if [[ "$actual_status" == "$expected_status" ]] && ! grep -qi "$forbidden" <<<"$body"; then
    PASS=$((PASS + 1))
    printf '  [%s] %s: %s does not leak %q\n' "$(color_ok PASS)" "$label" "$actual_status" "$forbidden"
  else
    FAIL=$((FAIL + 1))
    FAIL_LOG+="  [$label] expected=$expected_status without $forbidden actual=$actual_status body=$body"$'\n'
    printf '  [%s] %s: LEAK or wrong status, actual=%s body=%s\n' \
      "$(color_fail FAIL)" "$label" "$actual_status" "$body"
  fi
}

# =============================================================================
# テスト本体
# =============================================================================

NONEXIST_UUID='55555555-5555-4555-8555-555555555555'
EVIL_ORIGIN='http://localhost.evil.com'

echo "=== 1. 基本疎通 ==="
assert_status 'GET /'                                        200 "$BASE/"
assert_status 'GET /api/v1/routes?limit=1 (same-origin)'     200 -H "Origin: $ORIGIN" "$BASE/api/v1/routes?limit=1"
assert_status 'GET /api/v1/exchange-rates'                   200 -H "Origin: $ORIGIN" "$BASE/api/v1/exchange-rates"
assert_status 'GET /api/v1/meta/enums'                       200 -H "Origin: $ORIGIN" "$BASE/api/v1/meta/enums"

echo ""
echo "=== 2. SSR + locale ==="
assert_status 'GET /ja'                                      200 -L "$BASE/ja"
assert_status 'GET /ja/login'                                200 -L "$BASE/ja/login"
assert_status 'GET /en/login'                                200 -L "$BASE/en/login"
assert_body_contains 'SSR /ja has <title>Routem</title>'     200 '<title>Routem</title>' -L "$BASE/ja"

echo ""
echo "=== 3. エラー正規化 (status) ==="
assert_status 'GET /api/v1/routes/not-a-uuid'                400 -H "Origin: $ORIGIN" "$BASE/api/v1/routes/not-a-uuid"
assert_status 'GET /api/v1/routes/{non-exist}'               404 -H "Origin: $ORIGIN" "$BASE/api/v1/routes/$NONEXIST_UUID"
assert_status 'POST /api/v1/likes 未ログイン'                401 -H "Origin: $ORIGIN" -X POST "$BASE/api/v1/likes"
assert_status 'POST /api/v1/comments 未ログイン'             401 -H "Origin: $ORIGIN" -H 'Content-Type: application/json' -X POST "$BASE/api/v1/comments" -d '{}'
assert_status 'POST /api/v1/routes 未ログイン'               401 -H "Origin: $ORIGIN" -H 'Content-Type: application/json' -X POST "$BASE/api/v1/routes" -d '{}'
assert_status 'GET /api/v1/routes/me 未ログイン'             401 -H "Origin: $ORIGIN" "$BASE/api/v1/routes/me"
assert_status 'GET /api/v1/routes/explore 未ログイン'        401 -H "Origin: $ORIGIN" "$BASE/api/v1/routes/explore"
assert_status 'PATCH /api/v1/users/me 未ログイン'            401 -H "Origin: $ORIGIN" -X PATCH "$BASE/api/v1/users/me"
assert_status 'POST /api/v1/follows 未ログイン'              401 -H "Origin: $ORIGIN" -H 'Content-Type: application/json' -X POST "$BASE/api/v1/follows" -d '{}'
assert_status 'POST /api/v1/invites/fake/accept 未ログイン'  401 -H "Origin: $ORIGIN" -X POST "$BASE/api/v1/invites/fake-token/accept"
assert_status 'POST /api/v1/routes/*/invite 未ログイン'      401 -H "Origin: $ORIGIN" -X POST "$BASE/api/v1/routes/$NONEXIST_UUID/invite"

echo ""
echo "=== 4. エラー正規化 (ErrorScheme body) ==="
assert_body_contains '/routes/not-a-uuid body has VALIDATION_ERROR' 400 '"code":"VALIDATION_ERROR"' -H "Origin: $ORIGIN" "$BASE/api/v1/routes/not-a-uuid"
assert_body_contains '/routes/{non-exist} body has NOT_FOUND'       404 '"code":"NOT_FOUND"'       -H "Origin: $ORIGIN" "$BASE/api/v1/routes/$NONEXIST_UUID"
assert_body_contains 'likes POST has UNAUTHORIZED'                  401 '"code":"UNAUTHORIZED"'    -H "Origin: $ORIGIN" -X POST "$BASE/api/v1/likes"

echo ""
echo "=== 5. Zod details prod マスク (本番必須) ==="
# prod build では details キー / issues / Zod pattern は body に含まれてはならない
assert_body_not_contains 'comments?routeId=not-a-uuid body no details key' 400 'details'        -H "Origin: $ORIGIN" "$BASE/api/v1/comments?routeId=not-a-uuid"
assert_body_not_contains 'comments?routeId=not-a-uuid body no issues key'  400 'issues'         -H "Origin: $ORIGIN" "$BASE/api/v1/comments?routeId=not-a-uuid"
assert_body_not_contains 'comments?routeId=not-a-uuid body no Zod pattern' 400 'invalid_format' -H "Origin: $ORIGIN" "$BASE/api/v1/comments?routeId=not-a-uuid"

echo ""
echo "=== 6. CORS isSameOrigin (CVE 回帰) ==="
assert_status 'Origin: http://localhost.evil.com → 403' 403 -H "Origin: $EVIL_ORIGIN" -H 'sec-fetch-site: cross-site' "$BASE/api/v1/routes?limit=1"
assert_status 'Origin: http://evil.com → 403'           403 -H 'Origin: http://evil.com' -H 'sec-fetch-site: cross-site' "$BASE/api/v1/routes?limit=1"
assert_body_contains 'サブドメ詐称 body は Invalid Origin' 403 'Invalid Origin' -H "Origin: $EVIL_ORIGIN" -H 'sec-fetch-site: cross-site' "$BASE/api/v1/routes?limit=1"

echo ""
echo "=== 7. セキュリティヘッダ ==="
headers_tmp=$(mktemp)
curl -sS -I -H "Origin: $ORIGIN" "$BASE/api/v1/routes?limit=1" > "$headers_tmp"
for header in 'content-security-policy' 'x-frame-options' 'x-content-type-options' 'referrer-policy'; do
  if grep -qi "$header" "$headers_tmp"; then
    PASS=$((PASS + 1))
    printf '  [%s] header %s present\n' "$(color_ok PASS)" "$header"
  else
    FAIL=$((FAIL + 1))
    FAIL_LOG+="  [header $header] missing"$'\n'
    printf '  [%s] header %s missing\n' "$(color_fail FAIL)" "$header"
  fi
done
rm -f "$headers_tmp"

echo ""
echo "=== 8. nginx rate limit (burst + rate) ==="
echo "  200 並列 GET /api/v1/routes?limit=1 を発火..."
counts_tmp=$(mktemp)
for _ in $(seq 1 200); do
  curl -sS -o /dev/null -w '%{http_code}\n' -H "Origin: $ORIGIN" "$BASE/api/v1/routes?limit=1" >> "$counts_tmp" &
done
wait
n200=$(grep -c '^200$' "$counts_tmp" || echo 0)
n429=$(grep -c '^429$' "$counts_tmp" || echo 0)
rm -f "$counts_tmp"
if [[ "$n200" -gt 0 && "$n429" -gt 0 ]]; then
  PASS=$((PASS + 1))
  printf '  [%s] rate limit split: 200=%s, 429=%s\n' "$(color_ok PASS)" "$n200" "$n429"
else
  FAIL=$((FAIL + 1))
  FAIL_LOG+="  [rate-limit] no 429 triggered: 200=$n200, 429=$n429"$'\n'
  printf '  [%s] rate limit split: 200=%s, 429=%s (nginx burst/rate not enforced)\n' "$(color_fail FAIL)" "$n200" "$n429"
fi

echo ""
echo "=== 9. optional: Prisma 漏洩マスク (DB 停止が必要、手動実施) ==="
echo "  docker stop postgres && curl -sS $BASE/api/v1/routes?limit=1"
echo "  期待: 500 + {\"code\":\"INTERNAL_SERVER_ERROR\",\"message\":\"Internal Server Error\"}"
echo "  body に prisma/password/clientVersion/P1000/ECONNREFUSED 等が含まれないこと"

# =============================================================================
# 結果表示
# =============================================================================
echo ""
echo "============================================================"
printf 'PASS: %s   FAIL: %s\n' "$(color_ok "$PASS")" "$(color_fail "$FAIL")"
echo "============================================================"

if [[ "$FAIL" -gt 0 ]]; then
  echo ""
  echo "FAILED cases:"
  printf '%s' "$FAIL_LOG"
  exit 1
fi

exit 0
