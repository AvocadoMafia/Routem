import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { ZodError, z } from "zod";
import { handleError, matchAuthError } from "./handleError";

/**
 * handleError / matchAuthError のユニットテスト。
 *
 * 旧実装は本番で全てのエラーを 500 INTERNAL_SERVER_ERROR に変換していたため、
 * クライアント側 (isAuthError 等) で 401 を区別できず、ログイン誘導トースト等が
 * 機能しなかった。W2 修正で Unauthorized / Forbidden / Not Found を正しく
 * 対応 HTTP ステータスに変換できるようにしたので、その挙動を固定化する。
 */

describe("matchAuthError", () => {
  it("message='Unauthorized' → 401 へマップ", () => {
    const m = matchAuthError(new Error("Unauthorized"));
    expect(m).not.toBeNull();
    expect(m?.status).toBe(401);
    expect(m?.code).toBe("UNAUTHORIZED");
  });

  it("前後空白や大文字小文字混在でも吸収", () => {
    expect(matchAuthError({ message: "  unauthorized " })?.status).toBe(401);
    expect(matchAuthError({ message: "UNAUTHORIZED" })?.status).toBe(401);
  });

  it("code='UNAUTHORIZED' → 401", () => {
    expect(matchAuthError({ code: "UNAUTHORIZED" })?.status).toBe(401);
  });

  it("message='Forbidden' → 403", () => {
    expect(matchAuthError(new Error("Forbidden"))?.status).toBe(403);
  });

  it("message='Not Found' → 404 (空白含むバリアント吸収)", () => {
    expect(matchAuthError(new Error("Not Found"))?.status).toBe(404);
  });

  it("message='notfound' / code='NOT_FOUND' でも 404", () => {
    expect(matchAuthError({ message: "notfound" })?.status).toBe(404);
    expect(matchAuthError({ code: "NOT_FOUND" })?.status).toBe(404);
  });

  it("無関係な Error は null を返す (500 扱いに回す)", () => {
    expect(matchAuthError(new Error("database exploded"))).toBeNull();
  });

  it("null / undefined / primitive は null", () => {
    expect(matchAuthError(null)).toBeNull();
    expect(matchAuthError(undefined)).toBeNull();
    expect(matchAuthError("Unauthorized")).toBeNull();
    expect(matchAuthError(42)).toBeNull();
  });

  it("message に 'unauthorized' が含まれても完全一致でなければマッチしない (過剰マッチ防止)", () => {
    expect(matchAuthError({ message: "Something unauthorized went wrong" })).toBeNull();
  });
});

describe("handleError", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("Unauthorized Error → 401 UNAUTHORIZED", async () => {
    const res = await handleError(new Error("Unauthorized"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toMatchObject({ code: "UNAUTHORIZED", message: "Unauthorized" });
  });

  it("Forbidden Error → 403 FORBIDDEN", async () => {
    const res = await handleError(new Error("Forbidden"));
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("FORBIDDEN");
  });

  it("Not Found Error → 404 NOT_FOUND", async () => {
    const res = await handleError(new Error("Not Found"));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.code).toBe("NOT_FOUND");
  });

  it("Zod バリデーションエラー → 400 VALIDATION_ERROR", async () => {
    const schema = z.object({ id: z.string().uuid() });
    let zodErr: ZodError | null = null;
    try {
      schema.parse({ id: "not-a-uuid" });
    } catch (e) {
      zodErr = e as ZodError;
    }
    if (!zodErr) throw new Error("expected ZodError to be thrown");

    const res = await handleError(zodErr);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("VALIDATION_ERROR");
    expect(body.message).toMatch(/Validation error/);
  });

  it("ErrorScheme 風オブジェクト (code/message 持ち) は status 未指定で 400", async () => {
    const res = await handleError({ code: "BAD_REQUEST", message: "invalid input" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("BAD_REQUEST");
  });

  it("ErrorScheme に status が乗っていればそれを尊重する", async () => {
    const res = await handleError({ code: "CUSTOM", message: "teapot", status: 418 });
    expect(res.status).toBe(418);
  });

  it("一般的な Error (production) → 500 + 'Internal Server Error' で message をマスクする", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = await handleError(new Error("DB timeout: password=hunter2"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.code).toBe("INTERNAL_SERVER_ERROR");
    // 本番は内部エラー内容を露出しない
    expect(body.message).toBe("Internal Server Error");
    expect(body.message).not.toContain("hunter2");
  });

  it("一般的な Error (development) → 500 だが元メッセージを出す", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const res = await handleError(new Error("DB timeout"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("DB timeout");
  });

  it("未知のエラー (string 投げ等) → 500 INTERNAL_SERVER_ERROR", async () => {
    const res = await handleError("boom");
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.code).toBe("INTERNAL_SERVER_ERROR");
  });

  it("ErrorScheme 型で code='UNAUTHORIZED' を持っていれば 401 に飛ばす (認証系優先)", async () => {
    // matchAuthError が ErrorScheme 判定より先に走る必要がある (retrieval 順序担保)
    const res = await handleError({ code: "UNAUTHORIZED", message: "nope", status: 400 });
    expect(res.status).toBe(401);
  });
});
