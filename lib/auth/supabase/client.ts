import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required Supabase env: ${name}`);
  }
  return value;
}

export function getSupabaseUrl(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl);
}

export function getSupabasePublishableKey(): string {
  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)",
    supabasePublishableKey,
  );
}

export const createClient = () =>
  createBrowserClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
  );
