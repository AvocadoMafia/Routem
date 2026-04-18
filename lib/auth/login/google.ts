import { createClient } from "@/lib/auth/supabase/client";
import { getClientAuthRedirectUrl } from "@/lib/config/client";

export async function loginWithGoogle() {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    // プロバイダごとの追加オプションを指定
    options: {
      redirectTo: getClientAuthRedirectUrl(),
      queryParams: {
        access_type: "offline",
        prompt: "consent select_account",
      },
    },
  });

  if (error) {
    console.error("Auth Error:", error.message);
    throw error; // エラーを投げて、呼び出し元でキャッチさせる
  }


}
