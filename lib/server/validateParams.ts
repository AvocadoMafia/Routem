import {z} from "zod";
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