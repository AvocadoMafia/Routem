// API route 共通サーバユーティリティを 1 ファイルに集約。
// 旧 lib/server/{handleRequest,handleError,validateParams,validateUser}.ts を統合。
//
// この単一エントリにすることで、API route の boilerplate を:
//   import { handleRequest, handleError, validateParams, validateUser } from "@/lib/api/server";
// のように 1 行で取り込めるようにする。

import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { ErrorScheme } from "@/lib/types/error";
// NOTE: Step 3 の git mv で `lib/auth/supabase/server` → `lib/auth/supabase-server` に
// renameされるが、Step 2 時点では旧パスのまま。Step 6 の sed で `@/lib/auth/supabase-server`
// → `@/lib/auth/supabase-server` に一括置換される。
import { createClient } from "@/lib/auth/supabase-server";

// ---------------------------------------------------------------------------
// validateParams: パスパラメータ / クエリ等の Zod バリデーション
// ---------------------------------------------------------------------------

/**
 * `handleError` 側で 400 VALIDATION_ERROR に変換してもらうための手動 validation エラー。
 *
 * route handler が「Zod では表現しきれない横断的な必須チェック」
 * (例: `if (!parsed.routeId) throw ...`) を書く場面で使う。
 * 生の `throw new Error(...)` で投げると `handleError` の Error 分岐で 500 扱いになり、
 * dev 環境では `message` がそのまま漏洩するため、必ずこのクラスを使う。
 *
 * - `code` / `status` を固定で持たせ、 handleError 側で instanceof 判定できる
 * - message はサーバーログには残るが、本番レスポンスではマスクされる
 */
export class ValidationError extends Error {
    readonly code = "VALIDATION_ERROR";
    readonly status = 400;
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

/**
 * パスパラメータのバリデーション
 * @param T Zodスキーマの型をそのまま受け取るジェネリクス
 * @param schema Zodスキーマ
 * @param params パスパラメータ
 * @returns バリデーション成功時はパースされたデータ、失敗時はZodError
 */
export async function validateParams<T extends z.ZodType>(
    schema: T,
    params: unknown | Promise<unknown>,
): Promise<z.infer<T>> {
    const resolved = params instanceof Promise ? await params : params;

    const parsed = schema.safeParse(resolved);
    if (!parsed.success) {
        throw parsed.error;
    }
    return parsed.data;
}

// ---------------------------------------------------------------------------
// validateUser: Supabase セッションから User を解決
// ---------------------------------------------------------------------------

export async function validateUser(request: NextRequest) {
    const supabase = await createClient(request);
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        throw error;
    }
    return data.user;
}

// ---------------------------------------------------------------------------
// handleError: エラーを統一形式の HTTP レスポンスに変換
// ---------------------------------------------------------------------------

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
    const msg =
        typeof anyErr.message === "string" ? anyErr.message.trim().toLowerCase() : "";
    const code =
        typeof anyErr.code === "string" ? anyErr.code.trim().toUpperCase() : "";

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

    // 3) 手動バリデーションエラー (ValidationError クラス) → 400 VALIDATION_ERROR
    //    route handler が `throw new ValidationError("xxx is required")` を投げた場合に
    //    ここで捕まえ、本番では内部メッセージをマスクした固定文言に倒す。
    //    これを ErrorScheme 分岐より前に置くことで、 dev/prod の切替も一元管理できる。
    if (error instanceof ValidationError) {
        const isDev = process.env.NODE_ENV === "development";
        return NextResponse.json(
            {
                code: "VALIDATION_ERROR",
                message: isDev ? error.message : "Validation failed",
            },
            { status: 400 },
        );
    }

    // 4) Zodバリデーションエラー → 400 VALIDATION_ERROR
    //    本番は details (Zod issues) と生 message を晒さない:
    //    - `details.issues` は regex pattern / format / origin 等の制約情報を含み、攻撃者に
    //      スキーマ構造を提示する形になるため dev 限定で返す。
    //    - message も同様に dev では最初の issue の message を使い、本番は固定文言。
    if (error instanceof ZodError) {
        const isDev = process.env.NODE_ENV === "development";
        const firstIssueMessage = error.issues[0]?.message;
        return NextResponse.json(
            {
                code: "VALIDATION_ERROR",
                message:
                    isDev && firstIssueMessage
                        ? `Validation error: ${firstIssueMessage}`
                        : "Validation failed",
                ...(isDev ? { details: { issues: error.issues } } : {}),
            },
            { status: 400 },
        );
    }

    // 5) すでに ErrorScheme の形をしている場合、またはカスタムエラーオブジェクトの場合
    //    ※ Prisma エラーは code/message を持つため、ここに来る前に (2) で落とす必要がある
    //    ※ VALIDATION_ERROR code も (3) で先に処理しているため、ここでは他の domain 定義済みエラーだけ残る
    if (error && typeof error === "object" && "code" in error && "message" in error) {
        const errorScheme = error as ErrorScheme;
        const status =
            "status" in error && typeof (error as { status?: unknown }).status === "number"
                ? (error as { status: number }).status
                : 400;
        return NextResponse.json(errorScheme, { status });
    }

    // 6) 一般的なErrorの場合（開発環境ではメッセージを含める）
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

    // 7) 未知のエラー
    return NextResponse.json(
        {
            code: "INTERNAL_SERVER_ERROR",
            message: "Internal Server Error",
        },
        { status: 500 },
    );
}

// ---------------------------------------------------------------------------
// handleRequest: route handler を try/catch でラップする糖衣
// ---------------------------------------------------------------------------

export async function handleRequest(fn: () => Promise<Response>) {
    try {
        return await fn();
    } catch (error) {
        return handleError(error);
    }
}
