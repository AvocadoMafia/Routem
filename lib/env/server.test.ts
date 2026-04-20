import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getServerSupabasePublishableKey,
  getServerSupabaseUrl,
} from "./server";

/**
 * lib/config/server.ts の env getter ユニットテスト。
 *
 * vercel 運用時代の多段フォールバック (SUPABASE_URL / SUPABASE_ANON_KEY /
 * SUPABASE_PUBLISHABLE_DEFAULT_KEY) を撤去し、
 * サーバでもクライアントと同じ NEXT_PUBLIC_* を単一ソースとする挙動を固定する。
 *
 * ※ 同ファイルの getPrisma / getS3Client / getMeilisearch / getRedisClient は
 *    外部 I/O を伴うためここでは扱わない（統合テスト / e2e の範疇）。
 */

describe("getServerSupabaseUrl", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("NEXT_PUBLIC_SUPABASE_URL が設定されていればそのまま返す", () => {
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      "https://imggbqpwmhhymjipzfed.supabase.co",
    );
    expect(getServerSupabaseUrl()).toBe(
      "https://imggbqpwmhhymjipzfed.supabase.co",
    );
  });

  it("NEXT_PUBLIC_SUPABASE_URL が空文字なら throw する", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(() => getServerSupabaseUrl()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("エラーメッセージに『Missing required server env』が含まれる", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(() => getServerSupabaseUrl()).toThrow(
      /Missing required server env: NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("旧 SUPABASE_URL（プレフィックスなし）へはフォールバックしない", () => {
    // 旧命名にだけ値が入っていても、新命名（NEXT_PUBLIC_）が空なら必ず throw する。
    // vercel 運用時代のフォールバックを確実に撤去できていることを保証する。
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_URL", "https://old-env.supabase.co");
    expect(() => getServerSupabaseUrl()).toThrow();
  });
});

describe("getServerSupabasePublishableKey", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY が設定されていればそのまま返す", () => {
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
      "sb_publishable_foo_bar_baz",
    );
    expect(getServerSupabasePublishableKey()).toBe(
      "sb_publishable_foo_bar_baz",
    );
  });

  it("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY が空文字なら throw する", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "");
    expect(() => getServerSupabasePublishableKey()).toThrow(
      /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY/,
    );
  });

  it("エラーメッセージに『Missing required server env』が含まれる", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "");
    expect(() => getServerSupabasePublishableKey()).toThrow(
      /Missing required server env: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY/,
    );
  });

  it("旧 SUPABASE_PUBLISHABLE_DEFAULT_KEY / SUPABASE_ANON_KEY にフォールバックしない", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "");
    vi.stubEnv("SUPABASE_PUBLISHABLE_DEFAULT_KEY", "server-only-publishable");
    vi.stubEnv("SUPABASE_ANON_KEY", "server-only-anon");
    expect(() => getServerSupabasePublishableKey()).toThrow();
  });

  it("NEXT_PUBLIC_SUPABASE_ANON_KEY（旧命名の NEXT_PUBLIC_ 版）にもフォールバックしない", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-from-old-name");
    expect(() => getServerSupabasePublishableKey()).toThrow();
  });
});
