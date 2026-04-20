import { updateSession } from "@/lib/auth/session";
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

/**
 * 実際のリクエストが HTTPS で到達しているかを判定する。
 *
 * - nginx / リバースプロキシ経由では `X-Forwarded-Proto: https` が立つ
 *   （`nginx/conf.d/default.conf` で `proxy_set_header X-Forwarded-Proto $scheme;` している）
 * - ない場合は `request.nextUrl.protocol` をフォールバック
 *
 * Cookie の `Secure` 属性を動的に切り替えるために使う。
 * `NODE_ENV === "production"` で secure を固定すると、
 * 現行の nginx port:80 運用（HTTPS 未設定）ではブラウザが Cookie を
 * そもそも保存せず、API が一貫して 401 を返す原因になる。
 */
export function isSecureRequest(request: NextRequest): boolean {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    // `X-Forwarded-Proto: https, http` のようにチェーンされた場合は
    // 先頭（= クライアントに最も近いホップ）を見る
    const primary = forwardedProto.split(",")[0]?.trim().toLowerCase();
    if (primary === "https") return true;
    if (primary === "http") return false;
  }
  return request.nextUrl.protocol === "https:";
}

/**
 * supabase-ssr が sessionResponse に書き込んだ Cookie を、別のレスポンスに
 * **options を壊さずに** 引き継ぐ。
 *
 * 旧実装は `{ path, sameSite, secure }` の 3 つだけを継承しており、
 * supabase が意図していた `httpOnly` / `maxAge` / `expires` / `domain` /
 * `priority` を全て破壊していた。結果、セッションが
 *  - `httpOnly` を失い XSS 経由で token が奪われ得る
 *  - `maxAge` / `expires` を失い、ブラウザを閉じると即ログアウトする
 *    （Next リロードのたびに一瞬ログインが外れる現象の原因）
 * という二重の壊れ方をしていた。
 *
 * ここでは supabase が付けた options をそのまま伝搬させ、
 * `secure` のみ現行プロトコル (`isSecureRequest()`) に合わせて上書きする。
 */
export function propagateSessionCookies(
  sessionResponse: NextResponse,
  target: NextResponse,
  secure: boolean,
): void {
  for (const cookie of sessionResponse.cookies.getAll()) {
    const { name, value, ...rest } = cookie;
    target.cookies.set(name, value, {
      ...rest,
      secure,
    });
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Cookie の Secure 属性は「この request が実際に HTTPS で到達したか」で決める。
  // NODE_ENV で固定してしまうと、HTTP 運用環境（現行 nginx port:80）で
  // ブラウザが Cookie を保存してくれず、API が 401 を吐く原因になる。
  const secure = isSecureRequest(request);

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

    // supabase が付けた options (httpOnly / maxAge / expires / domain / sameSite / priority)
    // を保持したまま cookie を引き継ぐ。`secure` のみ現行プロトコルに合わせて上書きする。
    const sessionResponse = await updateSession(request);
    propagateSessionCookies(sessionResponse, nextResponse, secure);

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

        // 一時的なクッキーを設定（ゲストの Accept-Language 判定結果は 1 日有効）
        intlResponse.cookies.set("NEXT_LOCALE", preferredLocale, {
          maxAge: 60 * 60 * 24,
          path: "/",
          sameSite: "lax",
          secure,
        });

        // Supabase セッション cookie を options を保持したままコピー
        const sessionResponse = await updateSession(request);
        propagateSessionCookies(sessionResponse, intlResponse, secure);

        return intlResponse;
      }
    }
  }

  // next-intlのミドルウェアを実行
  const intlResponse = intlMiddleware(request);

  // Supabase セッション cookie を options を保持したままコピー
  const sessionResponse = await updateSession(request);
  propagateSessionCookies(sessionResponse, intlResponse, secure);

  return intlResponse;
}

export const config = {
  matcher: [
    // 静的ファイルを除外
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
