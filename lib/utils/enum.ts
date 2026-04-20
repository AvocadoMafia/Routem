// Prisma enum への安全な正規化ヘルパ。
// 旧 lib/client/helpers.ts から toSpotSource / toTransitMode を切り出し。
// クライアント / サーバ両方で使うため、@prisma/client の値オブジェクトのみに依存し、
// fetch / dom 等の副作用を持たない。

import { SpotSource, TransitMode } from "@prisma/client";

/**
 * 不明な文字列を SpotSource enum に安全に変換する。
 * 値が未設定 / 不正な場合は SpotSource.USER にフォールバック。
 */
export function toSpotSource(value?: string | null): SpotSource {
    if (value && (Object.values(SpotSource) as string[]).includes(value)) {
        return value as SpotSource;
    }
    return SpotSource.USER;
}

/**
 * 不明な文字列を TransitMode enum に安全に変換する。
 * 値が未設定 / 不正な場合は TransitMode.OTHER にフォールバック。
 */
export function toTransitMode(value?: string | null): TransitMode {
    if (value && (Object.values(TransitMode) as string[]).includes(value)) {
        return value as TransitMode;
    }
    return TransitMode.OTHER;
}
