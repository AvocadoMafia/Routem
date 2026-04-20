// サーバーで参照する環境変数の getter。
// 旧 lib/config/server.ts から Supabase env のみを切り出し、I/O クライアントの初期化は
// lib/db/* / lib/services/* に分離した。

function requireServerEnv(name: string, value: string | undefined): string {
    if (!value) {
        throw new Error(`Missing required server env: ${name}`);
    }
    return value;
}

// Supabase プロジェクトの URL / Publishable key はクライアント側 SDK でも必須で
// NEXT_PUBLIC_* としてビルド時にインライン化されるため、サーバ側でもそのまま流用する。
// 旧実装の SUPABASE_URL / SUPABASE_ANON_KEY 等へのフォールバック多段チェーンは
// vercel 運用時の名残で、現行の docker 運用では不要なため撤去。
export function getServerSupabaseUrl(): string {
    return requireServerEnv(
        "NEXT_PUBLIC_SUPABASE_URL",
        process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
}

export function getServerSupabasePublishableKey(): string {
    return requireServerEnv(
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    );
}
