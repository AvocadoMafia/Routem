/**
 * 統一アプリケーションエラークラス
 * HTTPステータスコードとエラーコードを含む構造化エラー
 */

import { ErrorCodeType, ErrorCode } from '@/lib/types/error'

export class AppError extends Error {
  readonly code: ErrorCodeType
  readonly status: number
  readonly details?: Record<string, unknown>

  constructor(
    code: ErrorCodeType,
    status: number,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
  }

  // ファクトリメソッド
  static badRequest(message = 'Bad Request', details?: Record<string, unknown>): AppError {
    return new AppError(ErrorCode.BAD_REQUEST, 400, message, details)
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError(ErrorCode.UNAUTHORIZED, 401, message)
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError(ErrorCode.FORBIDDEN, 403, message)
  }

  static notFound(message = 'Not found'): AppError {
    return new AppError(ErrorCode.NOT_FOUND, 404, message)
  }

  static conflict(message = 'Conflict'): AppError {
    return new AppError(ErrorCode.CONFLICT, 409, message)
  }

  static validationError(message: string, details?: Record<string, unknown>): AppError {
    return new AppError(ErrorCode.VALIDATION_ERROR, 400, message, details)
  }

  static internal(message = 'Internal Server Error'): AppError {
    return new AppError(ErrorCode.INTERNAL_SERVER_ERROR, 500, message)
  }

  // JSONシリアライズ用
  toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      ...(this.details && { details: this.details }),
    }
  }
}
