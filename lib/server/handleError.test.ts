import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { ZodError, z } from "zod";
import { Prisma } from "@prisma/client";
import { handleError, matchAuthError, isPrismaError } from "./handleError";

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

describe("isPrismaError / handleError Prisma leak guard (SECURITY)", () => {
  // Tester_2 が発見した「本番で生の PrismaClientKnownRequestError が JSON で返り、
  // DBユーザー名やパスワード認証失敗文言が漏洩する」事案への regression guard。
  // Prisma 系エラーは全て 500 + 固定 message に倒れ、 clientVersion / meta / code (Pxxxx) /
  // 生メッセージが外に出ないことを assert する。

  beforeEach(() => {
    vi.unstubAllEnvs();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("isPrismaError: PrismaClientKnownRequestError を true と判定", () => {
    const err = new Prisma.PrismaClientKnownRequestError("unique constraint failed", {
      code: "P2002",
      clientVersion: "6.16.0",
      meta: { target: ["email"] },
    });
    expect(isPrismaError(err)).toBe(true);
  });

  it("isPrismaError: PrismaClientValidationError を true と判定", () => {
    const err = new Prisma.PrismaClientValidationError("invalid argument", {
      clientVersion: "6.16.0",
    });
    expect(isPrismaError(err)).toBe(true);
  });

  it("isPrismaError: PrismaClientInitializationError を true と判定", () => {
    const err = new Prisma.PrismaClientInitializationError(
      "Can't reach database server",
      "6.16.0",
      "P1001",
    );
    expect(isPrismaError(err)).toBe(true);
  });

  it("isPrismaError: PrismaClientRustPanicError を true と判定", () => {
    const err = new Prisma.PrismaClientRustPanicError("panic!", "6.16.0");
    expect(isPrismaError(err)).toBe(true);
  });

  it("isPrismaError: PrismaClientUnknownRequestError を true と判定", () => {
    const err = new Prisma.PrismaClientUnknownRequestError("socket hang up", {
      clientVersion: "6.16.0",
    });
    expect(isPrismaError(err)).toBe(true);
  });

  it("isPrismaError: 普通の Error は false", () => {
    expect(isPrismaError(new Error("boom"))).toBe(false);
    expect(isPrismaError("string")).toBe(false);
    expect(isPrismaError(null)).toBe(false);
  });

  it("PrismaClientKnownRequestError (P2002) → 500 + 固定メッセージ、内部情報ゼロ", async () => {
    const err = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed on the fields: (`email`)",
      {
        code: "P2002",
        clientVersion: "6.16.0",
        meta: { target: ["email"], modelName: "User" },
      },
    );
    // サーバーログに落ちる console.error を抑制 (テスト出力を汚さないため)
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await handleError(err);
    spy.mockRestore();

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ code: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" });

    // 内部情報が漏れていないか (クライアント側 body に絶対に含まれてはいけない文字列群)
    const json = JSON.stringify(body);
    expect(json).not.toContain("P2002");
    expect(json).not.toContain("clientVersion");
    expect(json).not.toContain("6.16.0");
    expect(json).not.toContain("email");
    expect(json).not.toContain("User");
    expect(json).not.toContain("meta");
    expect(json).not.toContain("Unique constraint");
  });

  it("PrismaClientInitializationError (DB 認証失敗) でもユーザー名/パスワード文言が漏れない", async () => {
    // Tester_2 が見た実例に近いメッセージ: password / user 'prisma' の認証失敗
    const err = new Prisma.PrismaClientInitializationError(
      "Authentication failed against database server, the provided database credentials for `prisma` are not valid. password=hunter2",
      "6.16.0",
      "P1000",
    );
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await handleError(err);
    spy.mockRestore();

    expect(res.status).toBe(500);
    const body = await res.json();
    const json = JSON.stringify(body);

    expect(body.code).toBe("INTERNAL_SERVER_ERROR");
    expect(body.message).toBe("Internal Server Error");
    expect(json).not.toContain("prisma");
    expect(json).not.toContain("hunter2");
    expect(json).not.toContain("password");
    expect(json).not.toContain("P1000");
    expect(json).not.toContain("Authentication failed");
  });

  it("PrismaClientValidationError も 500 + 固定メッセージで返る", async () => {
    const err = new Prisma.PrismaClientValidationError(
      "Argument `userId` is missing. Please provide it. [model: Like]",
      { clientVersion: "6.16.0" },
    );
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await handleError(err);
    spy.mockRestore();

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.message).toBe("Internal Server Error");
    const json = JSON.stringify(body);
    expect(json).not.toContain("userId");
    expect(json).not.toContain("Like");
    expect(json).not.toContain("clientVersion");
  });

  it("dev 環境でも Prisma エラーは message をマスクする (通常 Error と挙動が異なる)", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const err = new Prisma.PrismaClientKnownRequestError("secret internal detail", {
      code: "P2025",
      clientVersion: "6.16.0",
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await handleError(err);
    spy.mockRestore();

    const body = await res.json();
    // 通常の Error なら dev で message が出るが、 Prisma は常にマスク
    expect(body.message).toBe("Internal Server Error");
    expect(body.message).not.toContain("secret internal detail");
  });

  it("サーバーログには詳細を残す (observability のため) — Prisma エラーで console.error が呼ばれる", async () => {
    const err = new Prisma.PrismaClientKnownRequestError("x", {
      code: "P2002",
      clientVersion: "6.16.0",
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await handleError(err);
    expect(spy).toHaveBeenCalled();
    const firstCallArgs = spy.mock.calls[0];
    // console.error には元の Prisma Error オブジェクトが渡る (ログで clientVersion/code を追える)
    expect(firstCallArgs.some((a) => a instanceof Prisma.PrismaClientKnownRequestError)).toBe(true);
    spy.mockRestore();
  });

  it("Prisma エラーは matchAuthError / ErrorScheme 判定より前に処理される (順序担保)", async () => {
    // もし Prisma 捕捉が後にあると、 code/message プロパティ持ちなので
    // ErrorScheme 分岐に吸われて生の Prisma error が JSON 化されてしまう。
    const err = new Prisma.PrismaClientKnownRequestError("boom", {
      code: "P2002",
      clientVersion: "6.16.0",
      meta: { hostname: "internal-db.example.com", user: "prisma" },
    });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await handleError(err);
    spy.mockRestore();

    const body = await res.json();
    const json = JSON.stringify(body);
    // これが一番クリティカル: 本番 DB ホスト名 / ユーザー名が絶対に body に載らない
    expect(json).not.toContain("internal-db.example.com");
    expect(json).not.toContain("prisma");
    expect(json).not.toContain("hostname");
  });
});
