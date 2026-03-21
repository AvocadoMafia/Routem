import { ZodError } from "zod";
import { AppError } from "./AppError";
import { ErrorCode } from "@/lib/types/error";

/**
 * エラーを統一形式のレスポンスに変換
 */
export async function handleError(error: unknown): Promise<Response> {
  // AppErrorの場合
  if (error instanceof AppError) {
    return Response.json(error.toJSON(), { status: error.status });
  }

  // Zodバリデーションエラーの場合
  if (error instanceof ZodError) {
    return Response.json(
      {
        code: ErrorCode.VALIDATION_ERROR,
        message: "Validation error",
        details: { issues: error.issues },
      },
      { status: 400 }
    );
  }

  // 一般的なErrorの場合（開発環境ではメッセージを含める）
  if (error instanceof Error) {
    const isDev = process.env.NODE_ENV === "development";
    return Response.json(
      {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: isDev ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }

  // 未知のエラー
  return Response.json(
    {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: "Internal Server Error",
    },
    { status: 500 }
  );
}
