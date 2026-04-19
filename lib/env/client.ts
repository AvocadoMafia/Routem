const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function getClientMapboxAccessToken() {
  return mapboxAccessToken;
}

/**
 * サイトのベースURL（末尾スラッシュなし）を返す。
 *
 * NEXT_PUBLIC_SITE_URL はビルド時にクライアントバンドルにインライン化されるため、
 * Docker ビルドの build-arg から必ず渡すこと。
 *
 * 検証項目:
 *  - 未定義 → 明示的に throw（localhost フォールバックで本番を汚染しない）
 *  - スキーム抜け（例: "routem.net"） → throw
 *  - http / https 以外（例: "ftp://"） → throw
 *  - URL としてパース不能 → throw
 *  - 末尾スラッシュは正規化して除去
 */
export function getClientSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) {
    throw new Error(
      "Missing required env: NEXT_PUBLIC_SITE_URL. " +
        "Set e.g. NEXT_PUBLIC_SITE_URL=https://routem.net (production) or http://localhost:3000 (dev) " +
        "and pass it as a Docker build-arg so it is inlined at build time.",
    );
  }

  // URL としてパース可能か & スキームが http/https であることを検証
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_SITE_URL: "${raw}" is not a valid absolute URL. ` +
        "Include the scheme, e.g. https://routem.net",
    );
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `Invalid NEXT_PUBLIC_SITE_URL: "${raw}" must start with http:// or https://`,
    );
  }

  // 末尾スラッシュを除去して正規化
  return raw.replace(/\/+$/, "");
}

/**
 * OAuth / メール認証リダイレクト先の完全URL（例: https://routem.net/auth/callback）
 */
export function getClientAuthRedirectUrl(): string {
  return `${getClientSiteUrl()}/auth/callback`;
}
