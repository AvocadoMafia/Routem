/**
 * サーバーサイド共通定数
 */

// ページネーション
export const MAX_LIMIT = 100
export const DEFAULT_LIMIT = 15

/**
 * limitパラメータを安全な範囲にクランプ
 * @param limit ユーザー指定のlimit
 * @param defaultValue デフォルト値（省略時はDEFAULT_LIMIT）
 * @returns 1〜MAX_LIMITの範囲内の値
 */
export function clampLimit(limit: number | undefined | null, defaultValue: number = DEFAULT_LIMIT): number {
  if (limit === undefined || limit === null || isNaN(limit)) {
    return defaultValue
  }
  return Math.max(1, Math.min(MAX_LIMIT, Math.floor(limit)))
}

/**
 * offsetパラメータを安全な値にクランプ
 * @param offset ユーザー指定のoffset
 * @returns 0以上の整数
 */
export function clampOffset(offset: number | undefined | null): number {
  if (offset === undefined || offset === null || isNaN(offset)) {
    return 0
  }
  return Math.max(0, Math.floor(offset))
}
