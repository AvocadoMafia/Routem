import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/auth/supabase/server'
import {getPrisma} from "@/lib/config/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      const supabaseUser = userData.user

      // 初回ログイン時のみ作成（ただし upsert なので冪等）
      const displayName =
        (supabaseUser.user_metadata?.name as string | undefined) ??
        (supabaseUser.user_metadata?.full_name as string | undefined) ??
        (supabaseUser.email ? supabaseUser.email.split('@')[0] : 'user')

      await getPrisma().user.upsert({
        where: { id: supabaseUser.id },
        create: {
          id: supabaseUser.id,
          name: displayName,
          bio: undefined,
          // location/profileImage 等も必要ならここで user_metadata から埋める
        },
        update: {
          // 初回以降に同期したい項目だけ更新する（例：nameを毎回上書きしたくないなら空でOK）
        },
      })

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}