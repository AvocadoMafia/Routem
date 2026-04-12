import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase/server'
import { getPrisma } from '@/lib/config/server'
import { Locale as DbLocale, Language as DbLanguage } from '@prisma/client'
import { isValidLocale, type Locale as AppLocale } from '@/i18n/config'

function isValidRedirectPath(path: string): boolean {
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (path.includes(':')) return false
  if (path.includes('\\')) return false
  return true
}

function normalizeAppLocale(input?: string | null): AppLocale | null {
  if (!input) return null
  const normalized = input.trim().toLowerCase()
  const head = normalized.split('-')[0]
  return isValidLocale(head) ? head : null
}

function appLocaleToDbLocale(value: AppLocale): DbLocale {
  return value.toUpperCase() as DbLocale
}

function appLocaleToDbLanguage(value: AppLocale): DbLanguage {
  return value.toUpperCase() as DbLanguage
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next') ?? '/'
  const next = isValidRedirectPath(nextParam) ? nextParam : '/'

  if (code) {
    const supabase = await createClient(request)
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      const supabaseUser = userData.user
      const localeFromCookie = normalizeAppLocale(request.cookies.get('NEXT_LOCALE')?.value)
      const languageFromMetadata = normalizeAppLocale(
        (supabaseUser.user_metadata?.locale as string | undefined) ??
          (supabaseUser.user_metadata?.language as string | undefined) ??
          (supabaseUser.user_metadata?.preferred_language as string | undefined),
      )
      const initialAppLocale = localeFromCookie ?? languageFromMetadata ?? 'ja'
      const userLocale = appLocaleToDbLocale(initialAppLocale)
      const userLanguage = appLocaleToDbLanguage(initialAppLocale)

      const displayName =
        (supabaseUser.user_metadata?.name as string | undefined) ??
        (supabaseUser.user_metadata?.full_name as string | undefined) ??
        (supabaseUser.email ? supabaseUser.email.split('@')[0] : 'user')

      const iconUrl =
        userData.user.user_metadata.avatar_url ||
        userData.user.user_metadata.picture ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`

      await getPrisma().user.upsert({
        where: { id: supabaseUser.id },
        create: {
          id: supabaseUser.id,
          name: displayName,
          bio: undefined,
          locale: userLocale,
          language: userLanguage,
          icon: {
            create: {
              url: iconUrl,
              key: null,
              status: 'EXTERNAL',
              type: 'USER_ICON',
              createdAt: new Date(),
              updatedAt: new Date(),
              uploaderId: supabaseUser.id,
            },
          },
        },
        // locale/language are intentionally managed independently after initialization.
        update: {},
        include: {
          icon: true,
        },
      })

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
