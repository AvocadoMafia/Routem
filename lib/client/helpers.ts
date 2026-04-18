import { ErrorScheme } from "@/lib/client/types"
import NProgress from "nprogress"
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config"
import { SpotSource, TransitMode } from "@prisma/client"

// nprogress設定
NProgress.configure({
    showSpinner: false,
    minimum: 0.1,
    speed: 300,
    trickleSpeed: 200,
})

// リクエストカウンター（複数リクエストを追跡）
let requestCount = 0

function startProgress() {
    requestCount++
    if (requestCount === 1) {
        NProgress.start()
    }
}

function stopProgress() {
    requestCount--
    if (requestCount <= 0) {
        requestCount = 0
        NProgress.done()
    }
}

export function isErrorScheme(error: any): error is ErrorScheme {
    return (
        typeof error === "object" &&
        error !== null &&
        typeof error.message === "string" &&
        typeof error.code === "string"
    )
}

export function toErrorScheme(error: any): ErrorScheme {
    if (isErrorScheme(error)) return error
    if (error instanceof Error) {
        return { message: error.message, code: error.name }
    }
    return { message: "不明なエラー", code: "UNKNOWN_ERROR" }
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

// -----------------------------------------------------------------------------
// リトライ設定
//
// 本番ではnginxのrate limitや、Redis/Meilisearchの一時的な瞬断などで
// 429 / 5xx が散発的に発生し得る。ユーザー操作のたびに画面が空になるのは
// UX として致命的なので、冪等な GET は指数バックオフでサイレントに再試行し、
// POST/PATCH/DELETE は原則1回の試行に留める (二重作成を避けるため)。
// -----------------------------------------------------------------------------
const MAX_RETRIES_FOR_429 = 3
const MAX_RETRIES_FOR_5XX_GET = 1
const BASE_BACKOFF_MS = 300
const MAX_BACKOFF_MS = 4000

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// exported for unit tests
export function computeBackoffMs(attempt: number, retryAfterHeader: string | null): number {
    // Retry-After が秒数 or HTTP-date。秒数のみ尊重 (HTTP-date は滅多に使われない)
    if (retryAfterHeader) {
        const secs = Number(retryAfterHeader)
        if (Number.isFinite(secs) && secs >= 0) {
            return Math.min(Math.max(secs * 1000, BASE_BACKOFF_MS), MAX_BACKOFF_MS)
        }
    }
    // 指数バックオフ + jitter (0〜100ms)
    const expo = BASE_BACKOFF_MS * 2 ** attempt
    const jitter = Math.floor(Math.random() * 100)
    return Math.min(expo + jitter, MAX_BACKOFF_MS)
}

// exported for unit tests
export function isRetryableStatus(status: number, method: HttpMethod): { retry: boolean; maxAttempts: number } {
    if (status === 429) return { retry: true, maxAttempts: MAX_RETRIES_FOR_429 }
    // 5xx は GET など冪等メソッドのみ1回だけ再試行。POST 等で二重作成するのを避ける。
    if (status >= 500 && method === "GET") return { retry: true, maxAttempts: MAX_RETRIES_FOR_5XX_GET }
    return { retry: false, maxAttempts: 0 }
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
        sleepFn?: (ms: number) => Promise<void>
    } = {},
): Promise<T | null> {
    const sleepFn = deps.sleepFn ?? sleep

    let attempt = 0

    // ループで再試行。成功するか再試行不可になったら抜ける。
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let res: Response
        try {
            res = await fetch(url, params)
        } catch {
            // ネットワーク断。GET のみ1回リトライの価値あり。
            if (method === "GET" && attempt < MAX_RETRIES_FOR_5XX_GET) {
                attempt++
                await sleepFn(computeBackoffMs(attempt, null))
                continue
            }
            throw {
                message: "ネットワークエラーが発生しました。",
                code: "NETWORK_ERROR",
            } as ErrorScheme
        }

        // 2xx: 成功
        if (res.ok) {
            // 204 などボディが空の場合 .json() は失敗するので保険
            const text = await res.text()
            if (!text) return null as T | null
            try {
                return JSON.parse(text) as T
            } catch (parseErr) {
                throw toErrorScheme(parseErr)
            }
        }

        // 再試行判定
        const { retry, maxAttempts } = isRetryableStatus(res.status, method)
        if (retry && attempt < maxAttempts) {
            attempt++
            const retryAfter = res.headers.get("Retry-After")
            await sleepFn(computeBackoffMs(attempt, retryAfter))
            continue
        }

        // リトライ不可 or 上限到達。ErrorScheme に正規化して throw。
        let errJson: any = null
        try {
            errJson = await res.json()
        } catch {
            // non-JSON body はスキップ
        }
        throw {
            message: errJson?.message || `HTTP ${res.status}`,
            code: errJson?.code || (res.status === 429 ? "RATE_LIMITED" : "HTTP_ERROR"),
            status: res.status,
            details: errJson?.details,
        } as ErrorScheme & { status: number }
    }
}

export async function requestToServerWithJson<T>(
    url: string,
    method: HttpMethod = "GET",
    obj?: object
): Promise<T | null> {

    const params: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    }

    if (obj && method !== "GET") {
        params.body = JSON.stringify(obj)
    }

    startProgress()

    try {
        return await fetchWithRetry<T>(url, method, params)
    } catch (error) {
        // fetchWithRetry は ErrorScheme か TypeError を投げる。
        // 想定外の JS 例外はここで整形する。
        if (error instanceof TypeError) {
            throw {
                message: "ネットワークエラーが発生しました。",
                code: "NETWORK_ERROR",
            } as ErrorScheme
        }
        throw toErrorScheme(error)
    } finally {
        stopProgress()
    }
}

/* ------------------------
   ラッパー関数群
------------------------- */

export async function postDataToServerWithJson<T>(
    url: string,
    obj: object
): Promise<T | null> {
    return requestToServerWithJson<T>(url, "POST", obj)
}

export async function getDataFromServerWithJson<T>(
    url: string
): Promise<T | null> {
    return requestToServerWithJson<T>(url, "GET")
}

export async function patchDataToServerWithJson<T>(
    url: string,
    obj: object
): Promise<T | null> {
    return requestToServerWithJson<T>(url, "PATCH", obj)
}

export async function putDataToServerWithJson<T>(
    url: string,
    obj: object
): Promise<T | null> {
    return requestToServerWithJson<T>(url, "PUT", obj)
}

export async function deleteDataToServerWithJson<T>(
    url: string
): Promise<T | null> {
    return requestToServerWithJson<T>(url, "DELETE")
}

export function dbLocaleToAppLocale(value?: string | null): Locale {
    if (!value) return defaultLocale
    const normalized = value.trim().toLowerCase()
    return isValidLocale(normalized) ? normalized : defaultLocale
}

/**
 * 不明な文字列を SpotSource enum に安全に変換する。
 * 値が未設定 / 不正な場合は SpotSource.USER にフォールバック。
 */
export function toSpotSource(value?: string | null): SpotSource {
    if (value && (Object.values(SpotSource) as string[]).includes(value)) {
        return value as SpotSource
    }
    return SpotSource.USER
}

/**
 * 不明な文字列を TransitMode enum に安全に変換する。
 * 値が未設定 / 不正な場合は TransitMode.OTHER にフォールバック。
 */
export function toTransitMode(value?: string | null): TransitMode {
    if (value && (Object.values(TransitMode) as string[]).includes(value)) {
        return value as TransitMode
    }
    return TransitMode.OTHER
}


const localeCurrencyMap: Record<Locale, string> = {
    ja: "JPY",
    en: "USD",
    ko: "KRW",
    zh: "CNY",
}

function isSupportedCurrencyCode(currency: string): boolean {
    return /^[A-Z]{3}$/.test(currency)
}

function convertAmount(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>,
): number | null {
    if (fromCurrency === toCurrency) return amount
    const fromRate = rates[fromCurrency]
    const toRate = rates[toCurrency]
    if (!fromRate || !toRate) return null
    const amountInUsd = amount * fromRate
    return amountInUsd / toRate
}

export function formatBudgetByLocale(params: {
    amount: number
    localCurrencyCode: string
    locale: Locale
    rates: Record<string, number>
}): string {
    const { amount, localCurrencyCode, locale, rates } = params
    const targetCurrency = localeCurrencyMap[locale]
    const converted = convertAmount(amount, localCurrencyCode, targetCurrency, rates)

    if (converted !== null && isSupportedCurrencyCode(targetCurrency)) {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: targetCurrency,
            maximumFractionDigits: 0,
        }).format(converted)
    }

    return `${amount.toLocaleString()} ${localCurrencyCode}`
}


/**
 * Browser-side image conversion to WebP
 */
export async function convertToWebP(file: File, opts?: { quality?: number; maxSide?: number }): Promise<Blob> {
    const quality = opts?.quality ?? 0.85; // 0..1
    const maxSide = opts?.maxSide ?? 2560; // clamp long side

    // Prefer createImageBitmap when available for performance and orientation handling
    let bitmap: ImageBitmap;
    try {
        // Some browsers support orientation from EXIF via imageOrientation option
        // @ts-ignore - imageOrientation may be experimental
        bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
        // Fallback: load via HTMLImageElement
        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
        bitmap = await new Promise<ImageBitmap>((resolve, reject) => {
            const img = new Image();
            img.onload = async () => {
                try {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject(new Error("Canvas not supported"));
                    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
                    const w = Math.max(1, Math.round(img.width * scale));
                    const h = Math.max(1, Math.round(img.height * scale));
                    canvas.width = w;
                    canvas.height = h;
                    ctx.drawImage(img, 0, 0, w, h);
                    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
                    if (!blob) return reject(new Error("Conversion failed"));
                    const wb = await createImageBitmap(blob);
                    resolve(wb);
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = dataUrl;
        });
    }

    // Draw to canvas with resize
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(bitmap, 0, 0, w, h);

    const out = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
    if (!out) throw new Error("Conversion failed");
    return out;
}
