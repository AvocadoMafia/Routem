import { createClient } from "@supabase/supabase-js";
import { getServerSupabaseUrl } from "@/lib/config/server";

export const supabaseAdmin = createClient(
  getServerSupabaseUrl(),
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role key
);
