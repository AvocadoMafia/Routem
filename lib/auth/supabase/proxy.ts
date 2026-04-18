import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getServerSupabasePublishableKey, getServerSupabaseUrl } from "@/lib/config/server";

// publicに追加した場合はここにパスを追加する
const publicPaths = ['/', '/about', '/routes', '/search', '/contact']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    getServerSupabaseUrl(),
    getServerSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
//   DBに問い合わせてるわけではなく、Cookieからセッション情報を取得して署名の検証を行っているだけらしい
  const { data } = await supabase.auth.getClaims()

  const user = data?.claims

  const path = request.nextUrl.pathname

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')&&
    !request.nextUrl.pathname.startsWith('/api')&&
    !publicPaths.includes(path)
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  // セキュリティヘッダーを追加
  // addSecurityHeaders(supabaseResponse)

  return supabaseResponse
}

/**
 * セキュリティヘッダーをレスポンスに追加
 */
// function addSecurityHeaders(response: NextResponse) {
//   // クリックジャッキング対策
//   response.headers.set('X-Frame-Options', 'DENY')
//
//   // MIMEタイプスニッフィング対策
//   response.headers.set('X-Content-Type-Options', 'nosniff')
//
//   // Referrer制御
//   response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
//
//   // XSS対策（レガシーブラウザ向け）
//   response.headers.set('X-XSS-Protection', '1; mode=block')
//
//   // Content-Security-Policy
//   const csp = [
//     "default-src 'self'",
//     "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.mapbox.com",
//     "style-src 'self' 'unsafe-inline' https://api.mapbox.com",
//     "img-src 'self' data: blob: https://*.mapbox.com https://*.maptiles.com https://lh3.googleusercontent.com https://images.unsplash.com https://i.pravatar.cc *",
//     "font-src 'self'",
//     "connect-src 'self' https://api.mapbox.com https://*.supabase.co wss://*.supabase.co https://events.mapbox.com",
//     "frame-ancestors 'none'",
//     "base-uri 'self'",
//     "form-action 'self'",
//   ].join('; ')
//   response.headers.set('Content-Security-Policy', csp)
//
//   // HTTPS強制（本番環境）
//   if (process.env.NODE_ENV === 'production') {
//     response.headers.set(
//       'Strict-Transport-Security',
//       'max-age=31536000; includeSubDomains'
//     )
//   }
//
//   // Permissions Policy
//   response.headers.set(
//     'Permissions-Policy',
//     'camera=(), microphone=(), geolocation=(self)'
//   )
// }
