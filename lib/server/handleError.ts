import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ErrorScheme } from "@/lib/types/error";

/**
 * エラーを統一形式のレスポンスに変換 (ErrorScheme形式)
 */
export async function handleError(error: unknown): Promise<NextResponse<ErrorScheme>> {
  // すでに ErrorScheme の形をしている場合、またはカスタムエラーオブジェクトの場合
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const errorScheme = error as ErrorScheme;
    const status = ('status' in error && typeof (error as any).status === 'number') ? (error as any).status : 400;
    return NextResponse.json(errorScheme, { status });
  }

  // Zodバリデーションエラーの場合
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "Validation error: " + error.issues.map((e: any) => e.message).join(", "),
        details: { issues: error.issues },
      },
      { status: 400 }
    );
  }

  // 一般的なErrorの場合（開発環境ではメッセージを含める）
  if (error instanceof Error) {
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: isDev ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }

  // 未知のエラー
  return NextResponse.json(
    {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    },
    { status: 500 }
  );
}
