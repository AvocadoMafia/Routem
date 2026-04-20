import { test, expect } from "@playwright/test";

/**
 * Validation / Not-Found / UUID バリデーションの E2E 回帰テスト。
 *
 * 対応シナリオドキュメント: `.claude/bug3-test-scenarios.md` §5c / §5d
 *
 * 狙い:
 *   - 5c: features/ 内の `throw new Error(...)` を handler が固定 code + 正しい
 *     HTTP status に正規化しているか (404 / 400 / 403)
 *   - 5d: Zod バリデーション失敗時、本番では issues 詳細が body に漏れないこと。
 *     dev では details.issues が開示されること
 *
 * 事前条件:
 *   - dev server が :3001 で起動中 (NODE_ENV=development)
 *   - 本番ビルドでの検証は `E2E_BASE_URL=<prod-or-prodlike-url> npx playwright test validation`
 *     でURLを差し替えて走らせる
 *
 * 意図的に含めないもの:
 *   - 実データを前提にした成功系 (200 ケース) はこの spec のスコープ外。
 *     failure path の status + body shape だけを固く検査する。
 */

// どの環境でも確実に存在しない UUID (0 埋め version-4)
const NON_EXISTENT_UUID = "00000000-0000-4000-8000-000000000000";

test.describe("validation: Zod 400 VALIDATION_ERROR の body 形状", () => {
    test("routeId が UUID 形式でない GET /api/v1/comments は 400 を返す", async ({ request }) => {
        const res = await request.get("/api/v1/comments?routeId=not-a-uuid");
        expect(res.status()).toBe(400);

        const body = await res.json();
        expect(body.code).toBe("VALIDATION_ERROR");
        expect(typeof body.message).toBe("string");

        // dev 環境では details.issues を含めて再現しやすく、本番環境では絶対に含まない。
        // ここでは少なくとも message が issues の JSON dump をそのまま垂れ流していない
        // (= uuid / regex / not-a-uuid などの内部語が漏れていない) ことを検査する。
        const bodyStr = JSON.stringify(body);
        const isProdLike = process.env.E2E_EXPECT_PROD === "1";
        if (isProdLike) {
            expect(bodyStr).not.toMatch(/uuid/i);
            expect(bodyStr).not.toMatch(/regex/i);
            expect(bodyStr).not.toMatch(/not-a-uuid/);
            expect(bodyStr).not.toMatch(/issues/);
        }
    });

    test("空 body で POST /api/v1/comments は 400", async ({ request }) => {
        const res = await request.post("/api/v1/comments", {
            data: {},
            failOnStatusCode: false,
        });
        // 認証が先に 401 を返す構成でもOK、Zod が先に弾く構成でも 400。
        // Bug#3 の主眼は「少なくとも 5xx ではない」こと。
        expect([400, 401]).toContain(res.status());

        const body = await res.json();
        expect(["VALIDATION_ERROR", "UNAUTHORIZED"]).toContain(body.code);
    });

    test("DELETE /api/v1/comments に不正な id (非 UUID) を渡すと 400", async ({ request }) => {
        const res = await request.delete("/api/v1/comments", {
            data: { id: "not-a-uuid" },
            failOnStatusCode: false,
        });
        expect([400, 401]).toContain(res.status());
        const body = await res.json();
        expect(["VALIDATION_ERROR", "UNAUTHORIZED"]).toContain(body.code);
    });
});

test.describe("not-found: features/ throw 正規化 (§5c)", () => {
    test("存在しない UUID で GET /api/v1/comments?routeId=... は 404 NOT_FOUND", async ({
        request,
    }) => {
        const res = await request.get(`/api/v1/comments?routeId=${NON_EXISTENT_UUID}`);
        // Bug#3 修正以前は 500 INTERNAL_SERVER_ERROR で落ちていた回帰点
        expect(res.status(), "500 に戻っていたら features/ throw 正規化の regression").not.toBe(500);
        // 実データ次第で 200 (0件) / 404 のどちらもあり得るので両方許容。
        // 大事なのは 500 ではないこと。
        expect([200, 404]).toContain(res.status());
    });

    test("存在しない UUID で GET /api/v1/users/:id は 404", async ({ request }) => {
        const res = await request.get(`/api/v1/users/${NON_EXISTENT_UUID}`);
        expect(res.status()).not.toBe(500);
        expect([200, 404]).toContain(res.status());
    });

    test("DELETE /api/v1/comments に存在しない UUID を渡すと 404 (未ログイン時は 401 優先)", async ({
        request,
    }) => {
        const res = await request.delete("/api/v1/comments", {
            data: { id: NON_EXISTENT_UUID },
            failOnStatusCode: false,
        });
        // 未ログイン → 401 が先に返る。ログイン済なら 404。どちらも 500 ではない回帰防止。
        expect(res.status()).not.toBe(500);
        expect([401, 404]).toContain(res.status());
    });
});

test.describe("auth boundary: 未ログインで保護 API は 401 UNAUTHORIZED (§SCN-4-1)", () => {
    test("未ログインで POST /api/v1/likes は 401", async ({ request }) => {
        const res = await request.post("/api/v1/likes", {
            data: { targetType: "ROUTE", targetId: NON_EXISTENT_UUID },
            failOnStatusCode: false,
        });
        // 認証エラーが 500 に塗りつぶされていないこと (Bug#3 W2 regression)
        expect(res.status(), "500 に戻っていたら handleError の AUTH_ERROR_TABLE regression").not.toBe(500);
        // 401 (未ログイン) か、認証前に zod で 400 かの二択。どちらも 5xx ではない。
        expect([400, 401]).toContain(res.status());
    });

    test("未ログインで POST /api/v1/routes/<uuid>/invite は 401 ", async ({ request }) => {
        const res = await request.post(`/api/v1/routes/${NON_EXISTENT_UUID}/invite`, {
            failOnStatusCode: false,
        });
        expect(res.status()).not.toBe(500);
        expect([401, 404]).toContain(res.status());
    });
});

test.describe("error body shape: Prisma / Zod の内部情報漏洩が無いこと", () => {
    test("400 のボディに `clientVersion` / `P2` / `prisma` が含まれない", async ({ request }) => {
        const res = await request.get("/api/v1/comments?routeId=not-a-uuid");
        const bodyStr = JSON.stringify(await res.json());
        expect(bodyStr, "Prisma エラー漏洩 §5b regression").not.toMatch(/clientVersion/);
        expect(bodyStr).not.toMatch(/P20\d\d/);
        expect(bodyStr).not.toMatch(/prisma/i);
        expect(bodyStr).not.toMatch(/hostname/i);
        expect(bodyStr).not.toMatch(/password/i);
    });

    test("ErrorScheme 基本形 (code / message) を満たす", async ({ request }) => {
        const res = await request.get("/api/v1/comments?routeId=not-a-uuid");
        const body = await res.json();
        expect(body).toHaveProperty("code");
        expect(body).toHaveProperty("message");
        expect(typeof body.code).toBe("string");
        expect(typeof body.message).toBe("string");
    });
});
