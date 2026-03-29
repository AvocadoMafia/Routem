/**
 * OAuth認証時のリダイレクトURLを取得する関数
 * クライアント側とサーバー側両方で使用可能
 */

/**
 * クライアント側でのリダイレクトURL取得
 * window.location.originを使用するため、クライアントコンポーネントからのみ呼び出し可能
 */
export function getClientAuthRedirectUrl(): string {
  // 環境変数が設定されていればそを優先（本番環境やngrok等の場合）
  if (process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL) {
    return process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
  }

  // ブラウザからのアクセスで、クライアント側の origin を取得
  if (typeof window !== "undefined") {
    return `${window.location.origin}/auth/callback`;
  }

  // フォールバック
  return "/auth/callback";
}

/**
 * サーバー側でのリダイレクトURL取得
 * NextRequestから origin 情報を使用
 */
export function getServerAuthRedirectUrl(origin: string): string {
  // 環境変数が設定されていればそれを優先
  if (process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL) {
    return process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL;
  }

  // リクエストの origin を使用
  return `${origin}/auth/callback`;
}
