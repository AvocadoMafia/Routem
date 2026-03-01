import {ErrorScheme} from "@/lib/client/types";


export function isErrorScheme(error: any): error is ErrorScheme {
    return (
        typeof error === 'object' &&
        error !== null &&
        typeof error.message === 'string' &&
        typeof error.code === 'string'
    )
}

export function toErrorScheme(error: any): ErrorScheme {
    if (isErrorScheme(error)) return error
    if (error instanceof Error) return {message: error.message, code: error.name}
    return {message: '不明なエラー', code: 'UNKNOWN_ERROR'}
}


export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export async function requestToServerWithJson<T>(
    url: string,
    method: HttpMethod = 'GET',
    obj?: object
): Promise<T | null> {
    const params: RequestInit = {
        method: method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'include' as const,
    }

    if (obj && method !== 'GET') {
        params.body = JSON.stringify(obj)
    }

    try {
        const res = await fetch(url, params)
        let json
        try {
            json = await res.json()
        } catch (error) {
            throw toErrorScheme(error)
        }
        if (!res.ok) {
            throw {message: json?.error?.message || '不明なエラー', code: json?.error?.code || 'UNKNOWN_ERROR'} as ErrorScheme
        }


        if (json !== undefined && json !== null) {
            const {error, ...jsonWithOutError} = json
            return jsonWithOutError as T
        }
        return null
    } catch (error) {
        if (error instanceof TypeError) {
            throw {message: 'ネットワークエラーが発生しました。', code: 'NETWORK_ERROR'} as ErrorScheme
        }
        throw toErrorScheme(error)
    }
}


export async function postDataToServerWithJson<T>(url: string, obj: object): Promise<T | null> {
    return requestToServerWithJson<T>(url, 'POST', obj)
}

export async function getDataFromServerWithJson<T>(url: string): Promise<T | null> {
    return requestToServerWithJson<T>(url, 'GET')
}

export async function patchDataToServerWithJson<T>(url: string, obj: object): Promise<T | null> {
    return requestToServerWithJson<T>(url, 'PATCH', obj)
}
