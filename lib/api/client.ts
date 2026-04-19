// クライアント側 HTTP ラッパ + リトライ + nprogress + ErrorScheme utils。
// 旧 lib/client/helpers.ts から HTTP 系のみ抜き出した。
//   - budget 系 (dbLocaleToAppLocale / formatBudgetByLocale) → lib/utils/budget.ts
//   - image (convertToWebP)                                  → lib/utils/image.ts
//   - enum 正規化 (toSpotSource / toTransitMode)             → lib/utils/enum.ts

import { ErrorScheme } from "@/lib/types/error";
import NProgress from "nprogress";

// nprogress 設定 (グローバル副作用なので import 1 回で 1 度だけ走らせる)
NProgress.configure({
    showSpinner: false,
    minimum: 0.1,
    speed: 300,
    trickleSpeed: 200,
});

// リクエストカウンター（複数リクエストを追跡）
let requestCount = 0;

function startProgress() {
    requestCount++;
    if (requestCount === 1) {
        NProgress.start();
    }
}

function stopProgress() {
    requestCount--;
    if (requestCount <= 0) {
        requestCount = 0;
        NProgress.done();
    }
}

export function isErrorScheme(error: unknown): error is ErrorScheme {
    return (
        typeof error === "object" &&
        error !== null &&
        typeof (error as { message?: unknown }).message === "string" &&
        typeof (error as { code?: unknown }).code === "string"
    );
}

export function toErrorScheme(error: unknown): ErrorScheme {
    if (isErrorScheme(error)) return error;
    if (error instanceof Error) {
        return { message: error.message, code: error.name };
    }
    return { message: "不明なエラー", code: "UNKNOWN_ERROR" };
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// -----------------------------------------------------------------------------
// リトライ設定
//
// 本番ではnginxのrate limitや、Redis/Meilisearchの一時的な瞬断などで
// 429 / 5xx が散発的に発生し得る。ユーザー操作のたびに画面が空になるのは
// UX として致命的なので、冪等な GET は指数バックオフでサイレントに再試行し、
// POST/PATCH/DELETE は原則1回の試行に留める (二重作成を避けるため)。
// -----------------------------------------------------------------------------
const MAX_RETRIES_FOR_429 = 3;
const MAX_RETRIES_FOR_5XX_GET = 1;
const BASE_BACKOFF_MS = 300;
const MAX_BACKOFF_MS = 4000;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// exported for unit tests
export function computeBackoffMs(attempt: number, retryAfterHeader: string | null): number {
    // Retry-After が秒数 or HTTP-date。秒数のみ尊重 (HTTP-date は滅多に使われない)
    if (retryAfterHeader) {
        const secs = Number(retryAfterHeader);
        if (Number.isFinite(secs) && secs >= 0) {
            return Math.min(Math.max(secs * 1000, BASE_BACKOFF_MS), MAX_BACKOFF_MS);
        }
    }
    // 指数バックオフ + jitter (0〜100ms)
    const expo = BASE_BACKOFF_MS * 2 ** attempt;
    const jitter = Math.floor(Math.random() * 100);
    return Math.min(expo + jitter, MAX_BACKOFF_MS);
}

// exported for unit tests
export function isRetryableStatus(
    status: number,
    method: HttpMethod,
): { retry: boolean; maxAttempts: number } {
    if (status === 429) return { retry: true, maxAttempts: MAX_RETRIES_FOR_429 };
    // 5xx は GET など冪等メソッドのみ1回だけ再試行。POST 等で二重作成するのを避ける。
    if (status >= 500 && method === "GET")
        return { retry: true, maxAttempts: MAX_RETRIES_FOR_5XX_GET };
    return { retry: false, maxAttempts: 0 };
}

/**
 * fetch + リトライのコアロジックを NProgress から分離した純粋版。
 * テスタブルにするため global.fetch のみに依存し、副作用 (進捗表示) は持たない。
 *
 * @internal - exported for unit tests; 実アプリコードは requestToServerWithJson を使う
 */
export async function fetchWithRetry<T>(
    url: string,
    method: HttpMethod,
    params: RequestInit,
    deps: {
        sleepFn?: (ms: number) => Promise<void>;
    } = {},
): Promise<T | null> {
    const sleepFn = deps.sleepFn ?? sleep;

    let attempt = 0;

    // ループで再試行。成功するか再試行不可になったら抜ける。
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let res: Response;
        try {
            res = await fetch(url, params);
        } catch {
            // ネットワーク断。GET のみ1回リトライの価値あり。
            if (method === "GET" && attempt < MAX_RETRIES_FOR_5XX_GET) {
                attempt++;
                await sleepFn(computeBackoffMs(attempt, null));
                continue;
            }
            throw {
                message: "ネットワークエラーが発生しました。",
                code: "NETWORK_ERROR",
            } as ErrorScheme;
        }

        // 2xx: 成功
        if (res.ok) {
            // 204 などボディが空の場合 .json() は失敗するので保険
            const text = await res.text();
            if (!text) return null as T | null;
            try {
                return JSON.parse(text) as T;
            } catch (parseErr) {
                throw toErrorScheme(parseErr);
            }
        }

        // 再試行判定
        const { retry, maxAttempts } = isRetryableStatus(res.status, method);
        if (retry && attempt < maxAttempts) {
            attempt++;
            const retryAfter = res.headers.get("Retry-After");
            await sleepFn(computeBackoffMs(attempt, retryAfter));
            continue;
        }

        // リトライ不可 or 上限到達。ErrorScheme に正規化して throw。
        let errJson: { message?: string; code?: string; details?: unknown } | null = null;
        try {
            errJson = await res.json();
        } catch {
            // non-JSON body はスキップ
        }
        // Retry-After を err に乗せて UI 側で cooldown 表示に使えるようにする
        // (内部 retry で使い切らなかった / 上限到達時に意味を持つ)
        const retryAfterHeader = res.headers.get("Retry-After");
        let retryAfterMs: number | undefined;
        if (retryAfterHeader) {
            const secs = Number(retryAfterHeader);
            if (Number.isFinite(secs) && secs >= 0) {
                retryAfterMs = secs * 1000;
            }
        }
        throw {
            message: errJson?.message || `HTTP ${res.status}`,
            code: errJson?.code || (res.status === 429 ? "RATE_LIMITED" : "HTTP_ERROR"),
            status: res.status,
            details: errJson?.details,
            retryAfterMs,
        } as ErrorScheme & { status: number; retryAfterMs?: number };
    }
}

export async function requestToServerWithJson<T>(
    url: string,
    method: HttpMethod = "GET",
    obj?: object,
): Promise<T | null> {
    const params: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    };

    if (obj && method !== "GET") {
        params.body = JSON.stringify(obj);
    }

    startProgress();

    try {
        return await fetchWithRetry<T>(url, method, params);
    } catch (error) {
        // fetchWithRetry は ErrorScheme か TypeError を投げる。
        // 想定外の JS 例外はここで整形する。
        if (error instanceof TypeError) {
            throw {
                message: "ネットワークエラーが発生しました。",
                code: "NETWORK_ERROR",
            } as ErrorScheme;
        }
        throw toErrorScheme(error);
    } finally {
        stopProgress();
    }
}

/* ------------------------
   ラッパー関数群
------------------------- */

export async function postDataToServerWithJson<T>(
    url: string,
    obj: object,
): Promise<T | null> {
    return requestToServerWithJson<T>(url, "POST", obj);
}

export async function getDataFromServerWithJson<T>(url: string): Promise<T | null> {
    return requestToServerWithJson<T>(url, "GET");
}

export async function patchDataToServerWithJson<T>(
    url: string,
    obj: object,
): Promise<T | null> {
    return requestToServerWithJson<T>(url, "PATCH", obj);
}

export async function putDataToServerWithJson<T>(
    url: string,
    obj: object,
): Promise<T | null> {
    return requestToServerWithJson<T>(url, "PUT", obj);
}

export async function deleteDataToServerWithJson<T>(url: string): Promise<T | null> {
    return requestToServerWithJson<T>(url, "DELETE");
}
