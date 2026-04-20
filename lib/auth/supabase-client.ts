import { createBrowserClient } from "@supabase/ssr";

// クライアント側 Supabase 設定。
// NEXT_PUBLIC_* は Next.js がビルド時にインライン化するため、
// Docker ビルドの build-arg で必ず渡すこと（docker-compose-prod.yml / Dockerfile 参照）。
// 旧 NEXT_PUBLIC_SUPABASE_ANON_KEY 等への多段フォールバックは vercel 運用の名残なので撤去し、
// Supabase が2025年以降推奨する新名称 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` 1本に統一。
//
// NOTE: 値はモジュールトップで固定せず関数呼び出しのたびに参照する。
//       テスト (vitest の `vi.stubEnv`) で値を差し替えた際にキャッシュが効いていると
//       差し替えが効かなくなるため。本番での参照コストは無視できる。

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required Supabase env: ${name}`);
  }
  return value;
}

/**
 * @internal exported only for unit tests (`supabase-client.test.ts`).
 * 外部モジュールからは `createClient()` 経由でアクセスし、この getter は直接呼ばないこと。
 */
export function getSupabaseUrl(): string {
  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
}

/**
 * @internal exported only for unit tests (`supabase-client.test.ts`).
 * 外部モジュールからは `createClient()` 経由でアクセスし、この getter は直接呼ばないこと。
 */
export function getSupabasePublishableKey(): string {
  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  );
}

export const createClient = () =>
  createBrowserClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
  );
