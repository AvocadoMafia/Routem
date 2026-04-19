import { createServerClient } from "@supabase/ssr";
import { type NextRequest } from "next/server";
import { cookies } from "next/dist/server/request/cookies";
import { getServerSupabasePublishableKey, getServerSupabaseUrl } from "@/lib/env/server";

export async function createClient(request?: NextRequest | { headers: Headers }) {
  const authHeader = request?.headers.get("Authorization");

  if (authHeader) {
    return createServerClient(
      getServerSupabaseUrl(),
      getServerSupabasePublishableKey(),
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      },
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    getServerSupabaseUrl(),
    getServerSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component.
          }
        },
      },
    },
  );
}
