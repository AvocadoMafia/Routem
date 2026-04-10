import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/auth/supabase/proxy"
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localeMapping, type Locale } from './i18n/config';

/**
 * next-intl ミドルウェア
 */
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
});

/**
 * Accept-Languageヘッダーをパースして対応ロケールを取得
 */
function parseAcceptLanguage(header: string): Locale | null {
  const languages = header
    .split(',')
    .map((lang) => {
      const [code, qValue] = lang.trim().split(';q=');
      return {
        code: code.trim(),
        q: qValue ? parseFloat(qValue) : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { code } of languages) {
    if (localeMapping[code]) {
      return localeMapping[code];
    }
    const baseCode = code.split('-')[0];
    if (localeMapping[baseCode]) {
      return localeMapping[baseCode];
    }
  }

  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // APIルートはセッション更新のみ
  if (pathname.startsWith('/api')) {
    return await updateSession(request);
  }

  // OAuth コールバックはセッション更新のみ
  if (pathname.startsWith('/auth/callback')) {
    return await updateSession(request);
  }

  // ユーザーのロケール設定をクッキーからチェック
  const userLocaleCookie = request.cookies.get('NEXT_LOCALE');

  if (!userLocaleCookie?.value || !locales.includes(userLocaleCookie.value as Locale)) {
    // ゲストユーザー: Accept-Languageヘッダーから検出
    const acceptLanguage = request.headers.get('Accept-Language');
    if (acceptLanguage) {
      const preferredLocale = parseAcceptLanguage(acceptLanguage);
      if (preferredLocale) {
        // next-intlのミドルウェアを実行
        const intlResponse = intlMiddleware(request);

        // 一時的なクッキーを設定
        intlResponse.cookies.set('NEXT_LOCALE', preferredLocale, {
          maxAge: 60 * 60 * 24, // ゲストは1日
          path: '/',
          sameSite: 'lax',
        });

        // Supabaseセッションクッキーをコピー
        const sessionResponse = await updateSession(request);
        sessionResponse.cookies.getAll().forEach((cookie) => {
          intlResponse.cookies.set(cookie.name, cookie.value, {
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
        });

        return intlResponse;
      }
    }
  }

  // next-intlのミドルウェアを実行
  const intlResponse = intlMiddleware(request);

  // Supabaseセッション更新
  const sessionResponse = await updateSession(request);

  // セッションクッキーをintlResponseにコピー
  sessionResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  });

  return intlResponse;
}

export const config = {
  matcher: [
    // 静的ファイルを除外
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
