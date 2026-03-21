/**
 * エラー型定義
 */

// エラーコード
export const ErrorCode = {
  // 4xx クライアントエラー
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',

  // 5xx サーバーエラー
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]

// APIエラーレスポンス
export interface ApiError {
  code: ErrorCodeType
  message: string
  details?: Record<string, unknown>
}

// クライアント用エラースキーマ
export interface ErrorScheme {
  message: string
  code: string
}
