import {ErrorScheme} from "@/lib/client/types";


export async function postDataToServerWithJson<T>(url: string, obj: object): Promise<T | null> {
    const params = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include' as const,
        body: JSON.stringify(obj)
    }

    try {
        const res = await fetch(url, params)
        let json
        try {
            json = await res.json()
        } catch (error) {
            if (error instanceof Error) throw {message: error.message, code: error.name}
            else throw {message: '不明なエラー', code: 'UNKNOWN_ERROR'}
        }
        if (!res.ok) {
            throw {message: json.error?.message || '不明なエラー', code: json.error?.code || 'UNKNOWN_ERROR'}
        }


        if (!!json) {
            const {error, ...jsonWithOutError} = json
            return jsonWithOutError as T
        }
        return null
    } catch (error) {
        if (error instanceof TypeError) {
            throw {message: 'ネットワークエラーが発生しました。', code: 'NETWORK_ERROR'} as ErrorScheme
        }
        throw error as ErrorScheme
    } finally {
    }
}

export async function getDataFromServerWithJson<T>(url: string): Promise<T | null> {
    const params = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include' as const,
    }

    try {
        const res = await fetch(url, params)
        let json
        try {
            json = await res.json()
        } catch (error) {
            if (error instanceof Error) throw {message: error.message, code: error.name}
            else throw {message: '不明なエラー', code: 'UNKNOWN_ERROR'}
        }
        if (!res.ok) {
            throw {message: json.error?.message || '不明なエラー', code: json.error?.code || 'UNKNOWN_ERROR'}
        }


        if (!!json) {
            const {error, ...jsonWithOutError} = json
            return jsonWithOutError as T
        }
        return null
    } catch (error) {
        if (error instanceof TypeError) {
            throw {message: 'ネットワークエラーが発生しました。', code: 'NETWORK_ERROR'} as ErrorScheme
        }
        throw error as ErrorScheme
    } finally {
    }
}
