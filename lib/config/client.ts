const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function getClientMapboxAccessToken() {
  return mapboxAccessToken;
}

/**
 * サイトのベースURL（末尾スラッシュなし）を返す。
 *
 * NEXT_PUBLIC_SITE_URL はビルド時にクライアントバンドルにインライン化されるため、
 * Docker ビルドの build-arg から必ず渡すこと。
 * 未定義時は **明示的に throw** し、localhost へのフォールバックで本番を汚染しないようにする。
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
  // 末尾スラッシュを除去して正規化
  return raw.replace(/\/+$/, "");
}

/**
 * OAuth / メール認証リダイレクト先の完全URL（例: https://routem.net/auth/callback）
 */
export function getClientAuthRedirectUrl(): string {
  return `${getClientSiteUrl()}/auth/callback`;
}
