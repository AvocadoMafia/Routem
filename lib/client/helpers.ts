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
        const res = await fetch(url, params)
        let json: any
        try {
            json = await res.json()
        } catch (error) {
            throw toErrorScheme(error)
        }

        if (!res.ok) {
            // 後者ロジックを採用
            throw {
                message: json?.message || "不明なエラー",
                code: json?.code || "UNKNOWN_ERROR",
                details: json?.details,
            } as ErrorScheme
        }

        return json as T

    } catch (error) {
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


export function getMonthName(month: number): string {
    const months = [
        "Any month", // 0
        "January",   // 1
        "February",  // 2
        "March",     // 3
        "April",     // 4
        "May",       // 5
        "June",      // 6
        "July",      // 7
        "August",    // 8
        "September", // 9
        "October",   // 10
        "November",  // 11
        "December"   // 12
    ];

    return months[month] ?? "Invalid Month";
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
