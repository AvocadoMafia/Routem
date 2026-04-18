import {z} from "zod";

/**
 * `handleError.ts` 側で 400 VALIDATION_ERROR に変換してもらうための手動 validation エラー。
 *
 * route handler が「Zod では表現しきれない横断的な必須チェック」
 * (例: `if (!parsed.routeId) throw ...`) を書く場面で使う。
 * 生の `throw new Error(...)` で投げると `handleError.ts` の Error 分岐で 500 扱いになり、
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
    params: unknown | Promise<unknown>
): Promise<z.infer<T>> {
    const resolved = params instanceof Promise ? await params : params;

    const parsed = schema.safeParse(resolved);
    if (!parsed.success) {
        throw(parsed.error);
    }
    return parsed.data;
}
