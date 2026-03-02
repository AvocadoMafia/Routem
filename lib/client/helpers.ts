import { ErrorScheme } from "@/lib/client/types"

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