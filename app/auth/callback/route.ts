import { NextRequest, NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/auth/supabase-server'
import {getPrisma} from "@/lib/db/prisma";
import { ImageStatus, ImageType } from "@prisma/client";

/**
 * OAuth認証コールバックエンドポイント
 * 
 * Supabaseからリダイレクトされ、認証コードをセッションに交換するエンドポイント
 * 
 * このエンドポイントへのアクセスソースについて：
 * - ブラウザ（Web）: http://localhost:3000/auth/callback
 * - iPhone実機: http://192.168.x.x:3000/auth/callback (またはNGROK URL)
 * - いずれの場合でも、Supabaseの「Redirect URLs」設定に追加する必要があります
 * 
 * リダイレクト後の挙動：
 * - 開発環境: request.origin を使用（自動的にクライアントの origin が使われる）
 * - 本番環境: X-Forwarded-Host ヘッダーを確認（ロードバランサー等を想定）
 */

/**
 * Open Redirect防止: 安全な相対パスのみ許可
 * - `/`で始まる必要がある
 * - `//`で始まるURL（プロトコル相対URL）を拒否
 * - `:`を含むURL（プロトコル指定）を拒否
 * - `\`を含むURL（パストラバーサル）を拒否
 */
function isValidRedirectPath(path: string): boolean {
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (path.includes(':')) return false
  if (path.includes('\\')) return false
  return true
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const origin = request.nextUrl.origin
  const nextParam = request.nextUrl.searchParams.get('next') ?? '/'
  const next = isValidRedirectPath(nextParam) ? nextParam : '/'

  console.log(`[Auth-Callback] Processing callback. Code present: ${!!code}, Origin: ${origin}`)

  if (code) {
    try {
      const supabase = await createClient(request)
      console.log(`[Auth-Callback] Exchanging code for session...`)
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error(`[Auth-Callback] Auth error:`, error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=auth_exchange_failed`)
      }

      console.log(`[Auth-Callback] Getting user data...`)
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        console.error(`[Auth-Callback] User fetch error:`, userError)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=user_fetch_failed`)
      }

      const supabaseUser = userData.user
      console.log(`[Auth-Callback] Supabase User ID: ${supabaseUser.id}`)

      const displayName =
        (supabaseUser.user_metadata?.name as string | undefined) ??
        (supabaseUser.user_metadata?.full_name as string | undefined) ??
        (supabaseUser.email ? supabaseUser.email.split('@')[0] : 'user')

      const iconUrl =
          userData.user.user_metadata.avatar_url ||
          userData.user.user_metadata.picture

      console.log(`[Auth-Callback] Starting DB upsert for user... Icon: ${!!iconUrl}`)

      try {
        const user = await getPrisma().user.upsert({
          where: { id: supabaseUser.id },
          create: {
            id: supabaseUser.id,
            name: displayName,
            bio: undefined,
            icon: {
              create: {
                url: iconUrl,
                key: null,
                status: ImageStatus.EXTERNAL,
                type: ImageType.USER_ICON,
                createdAt: new Date(),
                updatedAt: new Date(),
                uploaderId: supabaseUser.id,
              }
            },
          },
          update: {},
          include: {
            icon: true
          }
        })
        console.log(`[Auth-Callback] DB upsert success. User: ${user.name}`)
      } catch (dbError) {
        console.error(`[Auth-Callback] DB Error:`, dbError)
        // DBエラーでもセッションは確立されているのでリダイレクトさせる選択肢もあるが、
        // ユーザー作成に失敗するとアプリが動かない可能性が高いので一旦エラーページへ
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=db_upsert_failed`)
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // Build final redirect URL
      // Use relative path to avoid 502/origin mismatch issues with full URLs
      const redirectUrl = next;

      console.log(`[Auth-Callback] Final Redirect URL (Relative): ${redirectUrl}`)
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch (unexpectedError) {
      console.error(`[Auth-Callback] Unexpected critical error:`, unexpectedError)
      // Use relative path as last resort to avoid origin issues
      return NextResponse.redirect(new URL('/auth/auth-code-error?error=unexpected_error', request.url))
    }
  }

  console.warn(`[Auth-Callback] No code provided in query params.`)
  return NextResponse.redirect(new URL('/auth/auth-code-error?error=no_code', request.url))
}
