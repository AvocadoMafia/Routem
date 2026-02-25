// lib/supabase/api.ts (新しく作るか、server.tsに追加)
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function createClient(request: NextRequest) {
  // 1. まずスマホからの「ヘッダー」を確認する
  const authHeader = request.headers.get('Authorization')

  if (authHeader) {
    // A. ヘッダーがある場合（スマホからのアクセス）
    // Authorization: Bearer <token> の形なので、そのままSupabaseに渡すためのクライアントを作る
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return [] }, // クッキーは無視
          setAll() {}             // クッキー保存もしない
        },
        // ★ここがミソ：アクセストークンを直接注入してクライアントを作る
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    )
  }

  // 2. ヘッダーがないなら、いつもの「クッキー」を確認する（Webからのアクセス）
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // APIルート内でクッキー更新が必要ならセット（基本は読み取り専用でOK）
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
        },
      },
    }
  )
}