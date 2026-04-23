import { describe, expect, it } from "vitest";
import { isSameOrigin } from "./proxy";

/**
 * isSameOrigin の回帰防止テスト。
 *
 * 直前の proxy.ts CORS 実装は `origin.includes(allowedOrigin)` で部分一致判定
 * していたため、`https://routem.net.evil.com` のようなサブドメイン詐称を許可して
 * しまう脆弱性があった。本テストはその再発を防ぐためのもの。
 */
describe("isSameOrigin", () => {
  it("同一origin は true を返す", () => {
    expect(isSameOrigin("https://routem.net", "https://routem.net")).toBe(true);
  });

  it("サブドメイン詐称は false を返す（CORS bypass regression）", () => {
    expect(isSameOrigin("https://routem.net.evil.com", "https://routem.net")).toBe(false);
  });

  it("プロトコル違い（http vs https）は false を返す", () => {
    expect(isSameOrigin("http://routem.net", "https://routem.net")).toBe(false);
  });

  it("ポート違いは false を返す", () => {
    expect(isSameOrigin("https://routem.net:8443", "https://routem.net")).toBe(false);
  });

  it("path は origin に含まれないため、パス違いでも一致扱い", () => {
    expect(isSameOrigin("https://routem.net/api/x", "https://routem.net")).toBe(true);
  });

  it("パース不能な origin 側入力は false（fail-safe）", () => {
    expect(isSameOrigin("not a url", "https://routem.net")).toBe(false);
  });

  it("パース不能な allowedOrigin 側入力も false", () => {
    expect(isSameOrigin("https://routem.net", "garbage")).toBe(false);
  });

  it("どちらも空文字なら false（URL() が throw するため fail-safe が効く）", () => {
    expect(isSameOrigin("", "")).toBe(false);
  });

  it("末尾スラッシュ有無は origin 比較に影響しない", () => {
    expect(isSameOrigin("https://routem.net/", "https://routem.net")).toBe(true);
  });

  it("同一ホストでもクエリ違いは origin レベルでは一致扱い", () => {
    expect(isSameOrigin("https://routem.net?x=1", "https://routem.net")).toBe(true);
  });
});

import { NextRequest, NextResponse } from "next/server";
import { proxy } from "./proxy";
import { vi, beforeEach, afterEach } from "vitest";
import * as session from "@/lib/auth/session";

describe("proxy (CORS logic)", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://routem.net");
    // updateSession をモック化して環境変数のエラーを回避
    vi.spyOn(session, "updateSession").mockResolvedValue(NextResponse.next());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("allowedOrigin と一致する Origin は許可される", async () => {
    const req = new NextRequest("https://routem.net/api/test", {
      headers: { origin: "https://routem.net", "sec-fetch-site": "same-origin" },
    });
    const res = await proxy(req);
    expect(res.status).toBe(200);
  });

  it("www ありの Origin も許可される (allowedOrigin が www なしの場合)", async () => {
    const req = new NextRequest("https://routem.net/api/test", {
      headers: { origin: "https://www.routem.net", "sec-fetch-site": "same-site" },
    });
    const res = await proxy(req);
    expect(res.status).toBe(200);
  });

  it("www なしの Origin も許可される (allowedOrigin が www ありの場合)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.routem.net");
    const req = new NextRequest("https://www.routem.net/api/test", {
      headers: { origin: "https://routem.net", "sec-fetch-site": "same-site" },
    });
    const res = await proxy(req);
    expect(res.status).toBe(200);
  });

  it("全く別の Origin はブロックされる", async () => {
    const req = new NextRequest("https://routem.net/api/test", {
      headers: { origin: "https://evil.com", "sec-fetch-site": "cross-site" },
    });
    const res = await proxy(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Forbidden: Invalid Origin");
  });

  it("sec-fetch-site: same-site は許可される", async () => {
    const req = new NextRequest("https://routem.net/api/test", {
      headers: { origin: "https://www.routem.net", "sec-fetch-site": "same-site" },
    });
    const res = await proxy(req);
    expect(res.status).toBe(200);
  });

  it("sec-fetch-site: cross-site はブロックされる", async () => {
    const req = new NextRequest("https://routem.net/api/test", {
      headers: { origin: "https://routem.net", "sec-fetch-site": "cross-site" },
    });
    const res = await proxy(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("Forbidden: Cross-site request");
  });
});
