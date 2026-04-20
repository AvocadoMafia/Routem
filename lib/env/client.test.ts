import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getClientAuthRedirectUrl, getClientSiteUrl } from "./client";

/**
 * lib/config/client.ts の純粋関数ユニットテスト。
 *
 * `getClientSiteUrl` / `getClientAuthRedirectUrl` は呼び出しのたびに
 * `process.env.NEXT_PUBLIC_SITE_URL` を参照する（モジュールロード時に固定しない）ので、
 * 各ケースで `vi.stubEnv` によって値を差し替えれば import は一度でよい。
 */
describe("getClientSiteUrl", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("NEXT_PUBLIC_SITE_URL 未定義なら throw する", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(() => getClientSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("空文字でも throw する（`!raw` 判定のカバレッジ）", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(() => getClientSiteUrl()).toThrow(/Missing required env/);
  });

  it("末尾スラッシュを 1 個でも削除して返す", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://routem.net/");
    expect(getClientSiteUrl()).toBe("https://routem.net");
  });

  it("末尾スラッシュが複数あっても全て削除して返す", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://routem.net//");
    expect(getClientSiteUrl()).toBe("https://routem.net");
  });

  it("末尾スラッシュがなければそのまま返す", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://routem.net");
    expect(getClientSiteUrl()).toBe("https://routem.net");
  });

  it("dev 用の http://localhost:3000 も受け付ける", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    expect(getClientSiteUrl()).toBe("http://localhost:3000");
  });

  it("スキーム抜け（例: 'routem.net'）は throw する", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "routem.net");
    expect(() => getClientSiteUrl()).toThrow(/valid absolute URL|http/);
  });

  it("プロトコル相対URL（例: '//routem.net'）は throw する", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "//routem.net");
    expect(() => getClientSiteUrl()).toThrow();
  });

  it("http/https 以外のスキーム（例: 'ftp://routem.net'）は throw する", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "ftp://routem.net");
    expect(() => getClientSiteUrl()).toThrow(/http/);
  });

  it("javascript: スキームも throw する（XSS 回避）", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "javascript:alert(1)");
    expect(() => getClientSiteUrl()).toThrow(/http/);
  });

  it("ポート付きURLも正しく受け取る", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://routem.net:8443");
    expect(getClientSiteUrl()).toBe("https://routem.net:8443");
  });
});

describe("getClientAuthRedirectUrl", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("${SITE_URL}/auth/callback を返す", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://routem.net");
    expect(getClientAuthRedirectUrl()).toBe("https://routem.net/auth/callback");
  });

  it("末尾スラッシュがある場合でも二重スラッシュにならない", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://routem.net/");
    expect(getClientAuthRedirectUrl()).toBe("https://routem.net/auth/callback");
  });

  it("dev 向け localhost でも正しく組み立てる", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    expect(getClientAuthRedirectUrl()).toBe("http://localhost:3000/auth/callback");
  });

  it("NEXT_PUBLIC_SITE_URL 未定義時は getClientSiteUrl 経由で throw", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(() => getClientAuthRedirectUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("不正なURL（スキーム抜け）でも getClientSiteUrl 経由で throw", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "routem.net");
    expect(() => getClientAuthRedirectUrl()).toThrow();
  });
});
