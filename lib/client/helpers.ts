import { ErrorScheme } from "@/lib/client/types"
import NProgress from "nprogress"
import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config"

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
