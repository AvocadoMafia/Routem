/**
 * アップロード入力検証ユーティリティ
 * セキュリティ: ファイル名サニタイズ、ContentType検証
 */

// 許可されたContent-Type
export const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const

export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number]

/**
 * Content-Typeが許可されているかチェック
 */
export function isAllowedContentType(contentType: string): contentType is AllowedContentType {
  return ALLOWED_CONTENT_TYPES.includes(contentType as AllowedContentType)
}

/**
 * ファイル名をサニタイズ（パストラバーサル防止）
 * - パス区切り文字を除去
 * - 特殊文字を除去
 * - 空白をハイフンに置換
 * - 長さ制限
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') {
    return `upload-${Date.now()}`
  }

  let sanitized = fileName
    // パス区切り文字を除去
    .replace(/[/\\]/g, '')
    // NULLバイトを除去
    .replace(/\x00/g, '')
    // 相対パス参照を除去
    .replace(/\.\./g, '')
    // 特殊文字を除去（英数字、ハイフン、アンダースコア、ドットのみ許可）
    .replace(/[^a-zA-Z0-9\-_.\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, '')
    // 連続するドットを単一に
    .replace(/\.{2,}/g, '.')
    // 先頭・末尾のドットを除去
    .replace(/^\.+|\.+$/g, '')
    .trim()

  // 長さ制限（100文字）
  if (sanitized.length > 100) {
    const ext = sanitized.includes('.') ? sanitized.slice(sanitized.lastIndexOf('.')) : ''
    const baseName = sanitized.slice(0, 100 - ext.length)
    sanitized = baseName + ext
  }

  // 空になった場合はデフォルト
  if (!sanitized) {
    return `upload-${Date.now()}`
  }

  return sanitized
}

/**
 * アップロードタイプが有効かチェック
 */
export const ALLOWED_UPLOAD_TYPES = ['route-thumbnails', 'user-profiles', 'node-images', 'others'] as const
export type AllowedUploadType = (typeof ALLOWED_UPLOAD_TYPES)[number]

export function isAllowedUploadType(type: string): type is AllowedUploadType {
  return ALLOWED_UPLOAD_TYPES.includes(type as AllowedUploadType)
}

/**
 * アップロードコンテキストが有効かチェック
 */
export const ALLOWED_CONTEXTS = ['icon', 'background', null] as const
export type AllowedContext = (typeof ALLOWED_CONTEXTS)[number]

export function isAllowedContext(context: string | null): context is AllowedContext {
  return context === null || context === 'icon' || context === 'background'
}
