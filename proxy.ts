import { updateSession } from "@/lib/auth/supabase/proxy";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, localeMapping, locales, type Locale } from "./i18n/config";

/**
 * next-intl ミドルウェア
 */
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: true,
});

/**
 * Accept-Languageヘッダーをパースして対応ロケールを取得
 */
function parseAcceptLanguage(header: string): Locale | null {
  const languages = header
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=");
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
    const baseCode = code.split("-")[0];
    if (localeMapping[baseCode]) {
      return localeMapping[baseCode];
    }
  }

  return null;
}

function applyApiSecurityHeaders(res: NextResponse) {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "no-referrer");

  // APIはCSP軽めでOK
  res.headers.set("Content-Security-Policy", "default-src 'none'");

  return res;
}

/**
 * 2つのオリジン文字列が `scheme://host[:port]` レベルで完全一致するか判定する。
 *
 * `a.includes(b)` での部分一致判定は
 *   allowed = "https://routem.net"
 *   origin  = "https://routem.net.evil.com"
 * のようなオリジンを通してしまうため絶対に使わない。
 *
 * どちらか一方でも URL としてパースできない場合は false（= 拒否）を返し、
 * 未知の形式をうっかり許可しないフェイルセーフにする。
 */
export function isSameOrigin(a: string, b: string): boolean {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // APIルートはセッション更新のみ
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin");
    const isDev = process.env.NODE_ENV === "development";
    // CORS 判定用の自サイトオリジン。
    //  - 本番: NEXT_PUBLIC_SITE_URL (例: "https://routem.net") を使用
    //  - dev:  未設定時のみ "http://localhost:3000" にフォールバック
    // いずれも URL.origin でパースできる完全URL形式であること。
    const allowedOrigin =
      process.env.NEXT_PUBLIC_SITE_URL || (isDev ? "http://localhost:3000" : null);

    // 完全一致で判定（`origin.includes(allowedOrigin)` は `routem.net.evil.com` 等を通す脆弱性あり）
    if (origin && allowedOrigin && !isSameOrigin(origin, allowedOrigin)) {
      console.warn(`[Blocked] Unauthorized origin:${origin}`);
      return new NextResponse(JSON.stringify({ error: "Forbidden: Invalid Origin" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const secFetchSite = request.headers.get("sec-fetch-site");
    if (secFetchSite && secFetchSite !== "same-origin" && !isDev) {
      console.warn(`[Blocked] Unauthorized origin:${secFetchSite}`);
      return new NextResponse(JSON.stringify({ error: "Forbidden: Cross-site request" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const nextResponse = NextResponse.next({
      request,
    });

    const sessionResponse = await updateSession(request);
    sessionResponse.cookies.getAll().forEach((cookie) => {
      nextResponse.cookies.set(cookie.name, cookie.value, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    });

    applyApiSecurityHeaders(nextResponse);

    return nextResponse;
  }

  // OAuth コールバックはセッション更新のみ
  if (pathname.startsWith("/auth/callback")) {
    return await updateSession(request);
  }

  // ユーザーのロケール設定をクッキーからチェック
  const userLocaleCookie = request.cookies.get("NEXT_LOCALE");

  if (!userLocaleCookie?.value || !locales.includes(userLocaleCookie.value as Locale)) {
    // ゲストユーザー: Accept-Languageヘッダーから検出
    const acceptLanguage = request.headers.get("Accept-Language");
    if (acceptLanguage) {
      const preferredLocale = parseAcceptLanguage(acceptLanguage);
      if (preferredLocale) {
        // next-intlのミドルウェアを実行
        const intlResponse = intlMiddleware(request);

        // 一時的なクッキーを設定
        intlResponse.cookies.set("NEXT_LOCALE", preferredLocale, {
          maxAge: 60 * 60 * 24, // ゲストは1日
          path: "/",
          sameSite: "lax",
        });

        // Supabaseセッションクッキーをコピー
        const sessionResponse = await updateSession(request);
        sessionResponse.cookies.getAll().forEach((cookie) => {
          intlResponse.cookies.set(cookie.name, cookie.value, {
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
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
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  });

  return intlResponse;
}

export const config = {
  matcher: [
    // 静的ファイルを除外
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
