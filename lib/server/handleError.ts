import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ErrorScheme } from "@/lib/types/error";

/**
 * 認証/認可/リソースエラーを HTTP ステータスにマップするためのテーブル。
 *
 * 背景:
 *  サービス層 / route handler は `throw new Error("Unauthorized")` のように文字列で
 *  エラー種別を表現している。本番環境では元の実装が `INTERNAL_SERVER_ERROR` (500) に
 *  全て塗りつぶしていたため、クライアント側で 401/403/404 の区別ができず、
 *  ログイン誘導トーストなどの UX が機能していなかった。
 *
 *  ここでは message (大文字小文字は揃えて比較) または code で種別を特定し、
 *  ErrorScheme 形式のまま該当 HTTP ステータスで返す。
 *
 *  設計判断: message / code 両方を見ることで、
 *   - 既存の `throw new Error("Unauthorized")` 実装 (message ベース)
 *   - 今後 `{ code: "UNAUTHORIZED", ... }` を throw するパターン
 *  の両方をハンドルできる。
 */
type AuthErrorEntry = {
  status: number;
  code: string;
  publicMessage: string;
  /** message 比較用の候補 (小文字) */
  messageCandidates: string[];
  /** code 比較用の候補 */
  codeCandidates: string[];
};

const AUTH_ERROR_TABLE: AuthErrorEntry[] = [
  {
    status: 401,
    code: "UNAUTHORIZED",
    publicMessage: "Unauthorized",
    messageCandidates: ["unauthorized"],
    codeCandidates: ["UNAUTHORIZED"],
  },
  {
    status: 403,
    code: "FORBIDDEN",
    publicMessage: "Forbidden",
    messageCandidates: ["forbidden"],
    codeCandidates: ["FORBIDDEN"],
  },
  {
    status: 404,
    code: "NOT_FOUND",
    publicMessage: "Not Found",
    messageCandidates: ["not found", "notfound"],
    codeCandidates: ["NOT_FOUND"],
  },
];

/**
 * エラーが AUTH_ERROR_TABLE のどれかにマッチするか判定する pure function。
 * 一致した場合は正規化された AuthErrorEntry を返し、なければ null を返す。
 * テストから呼びやすいよう export している。
 */
export function matchAuthError(error: unknown): AuthErrorEntry | null {
  if (!error || typeof error !== "object") return null;
  const anyErr = error as { message?: unknown; code?: unknown };
  const msg = typeof anyErr.message === "string" ? anyErr.message.trim().toLowerCase() : "";
  const code = typeof anyErr.code === "string" ? anyErr.code.trim().toUpperCase() : "";

  for (const entry of AUTH_ERROR_TABLE) {
    if (code && entry.codeCandidates.includes(code)) return entry;
    if (msg && entry.messageCandidates.includes(msg)) return entry;
  }
  return null;
}

/**
 * Prisma が投げる例外クラスのいずれかに当たるかを判定する。
 *
 * Prisma のエラーは Error を継承しているが、 `code` (例: "P2002") と `message`、
 * さらに `clientVersion` / `meta` / `batchRequestIdx` / `errorCode` のような
 * 内部情報を保持している。これらは直接 JSON 化すると本番環境で:
 *   - DB ユーザー名 (例: "prisma")
 *   - DB ホスト / スキーマ
 *   - 「password authentication failed for user ..」の文言
 *   - Prisma ランタイムのバージョン
 * などが外部に漏れる (Tester_2 が本番で検出したセキュリティ事案)。
 *
 * そのため `handleError` では他の分岐より先にこの関数で Prisma 系エラーを捕まえ、
 * サーバーログにだけ詳細を残して、クライアントには固定の
 * `{ code: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" }` を返す。
 *
 * 対象クラス:
 *   - PrismaClientKnownRequestError:   既知のクエリ失敗 (P20xx 系コード)
 *   - PrismaClientUnknownRequestError: 不明なクエリ失敗 (ネットワーク断等)
 *   - PrismaClientValidationError:     prisma schema レベルのバリデーション失敗
 *   - PrismaClientInitializationError: 接続初期化失敗 (DB password ミス、ここで resource 漏洩が起きやすい)
 *   - PrismaClientRustPanicError:      内部ランタイム panic
 */
export function isPrismaError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  );
}

/**
 * エラーを統一形式のレスポンスに変換 (ErrorScheme形式)
 */
export async function handleError(error: unknown): Promise<NextResponse<ErrorScheme>> {
  // 1) 認証/認可/存在系エラーを最初に処理する。
  //    (Error instance 判定や ErrorScheme 判定に吸われると 500 扱いになるため先に捕まえる)
  const authMatch = matchAuthError(error);
  if (authMatch) {
    return NextResponse.json(
      { code: authMatch.code, message: authMatch.publicMessage },
      { status: authMatch.status },
    );
  }

  // 2) Prisma 系エラーを ErrorScheme 判定より**前**に捕まえる。
  //    - Prisma エラーは `code` (Pxxxx) / `message` / `clientVersion` / `meta` を持つので、
  //      次の ErrorScheme 分岐に吸われるとそれらが生のまま JSON 化されて漏洩する
  //      (Tester_2 発見のセキュリティ事案)
  //    - サーバーログにだけ詳細を残す (観測できるように console.error)
  //    - 本番/開発を問わず message は固定文言で返す (dev でも内部メッセージを混ぜない)
  if (isPrismaError(error)) {
    console.error("[handleError] Prisma error:", error);
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" },
      { status: 500 },
    );
  }

  // 3) すでに ErrorScheme の形をしている場合、またはカスタムエラーオブジェクトの場合
  //    ※ Prisma エラーは code/message を持つため、ここに来る前に (2) で落とす必要がある
  if (error && typeof error === "object" && "code" in error && "message" in error) {
    const errorScheme = error as ErrorScheme;
    const status =
      "status" in error && typeof (error as any).status === "number"
        ? (error as any).status
        : 400;
    return NextResponse.json(errorScheme, { status });
  }

  // 4) Zodバリデーションエラーの場合
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "Validation error: " + error.issues.map((e: any) => e.message).join(", "),
        details: { issues: error.issues },
      },
      { status: 400 },
    );
  }

  // 5) 一般的なErrorの場合（開発環境ではメッセージを含める）
  if (error instanceof Error) {
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        message: isDev ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }

  // 6) 未知のエラー
  return NextResponse.json(
    {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    },
    { status: 500 },
  );
}
