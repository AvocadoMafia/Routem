import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSupabasePublishableKey, getSupabaseUrl } from "./supabase-client";

/**
 * lib/auth/supabase/client.ts の env getter ユニットテスト。
 *
 * 値はモジュールトップで固定せず関数呼び出しごとに process.env を参照するようにしてある
 * （本リファクタで `vi.stubEnv` が確実に効くように変更済み）。
 * 未定義 / 空文字のときに Supabase 初期化を壊さず早期に throw することを保証する。
 */

describe("getSupabaseUrl", () => {
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
    expect(getSupabaseUrl()).toBe(
      "https://imggbqpwmhhymjipzfed.supabase.co",
    );
  });

  it("NEXT_PUBLIC_SUPABASE_URL が空文字なら throw する", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(() => getSupabaseUrl()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("エラーメッセージに『Missing required Supabase env』が含まれる", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    expect(() => getSupabaseUrl()).toThrow(
      /Missing required Supabase env: NEXT_PUBLIC_SUPABASE_URL/,
    );
  });

  it("旧 NEXT_PUBLIC_SUPABASE_ANON_KEY 等の別名 env にはフォールバックしない（統一後）", () => {
    // 旧命名の変数をセットしても、新命名が空ならエラーになること（撤去済みの挙動確認）
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_URL", "https://old-env.supabase.co");
    expect(() => getSupabaseUrl()).toThrow();
  });
});

describe("getSupabasePublishableKey", () => {
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
    expect(getSupabasePublishableKey()).toBe(
      "sb_publishable_foo_bar_baz",
    );
  });

  it("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY が空文字なら throw する", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "");
    expect(() => getSupabasePublishableKey()).toThrow(
      /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY/,
    );
  });

  it("エラーメッセージに『Missing required Supabase env』が含まれる", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "");
    expect(() => getSupabasePublishableKey()).toThrow(
      /Missing required Supabase env: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY/,
    );
  });

  it("旧 NEXT_PUBLIC_SUPABASE_ANON_KEY にはフォールバックしない（vercel 運用の名残を撤去済み）", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key-from-old-name");
    expect(() => getSupabasePublishableKey()).toThrow();
  });

  it("旧 SUPABASE_ANON_KEY / SUPABASE_PUBLISHABLE_DEFAULT_KEY にもフォールバックしない", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "");
    vi.stubEnv("SUPABASE_ANON_KEY", "anon-server-only");
    vi.stubEnv("SUPABASE_PUBLISHABLE_DEFAULT_KEY", "publishable-server-only");
    expect(() => getSupabasePublishableKey()).toThrow();
  });
});
