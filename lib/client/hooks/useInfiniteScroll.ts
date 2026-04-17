'use client'

import {DependencyList, RefObject, useCallback, useEffect, useRef, useState} from "react"
import {errorStore} from "@/lib/client/stores/errorStore"

export type CursorResponse<T> = { items: T[]; nextCursor: string | null }

export type UseInfiniteScrollOptions<TRaw, TItem = TRaw> = {
    /**
     * 指定のcursorでページを取得する関数。初回はnullが渡される。
     * レスポンスは { items, nextCursor } 形式でなければならない。
     */
    fetcher: (cursor: string | null) => Promise<CursorResponse<TRaw> | null>
    /**
     * TRawをTItemに変換する任意のマッパー。nullを返すと弾かれる。
     */
    mapItem?: (raw: TRaw) => TItem | null
    /**
     * 重複排除のためのキー抽出器。未指定時は `(item as any).id` を使う。
     */
    getId?: (item: TItem) => string
    /**
     * 値が変わった時に初期状態へリセットして再取得するトリガー。
     */
    deps?: DependencyList
    /**
     * falseのとき取得もobserverも動作しない（初期ロード自体を抑止したい時に）。
     */
    enabled?: boolean
    /**
     * IntersectionObserverのthreshold。
     */
    threshold?: number
    /**
     * エラーをerrorStoreに流すか。デフォルトtrue。
     */
    reportErrors?: boolean
}

export type UseInfiniteScrollResult<TItem> = {
    /** 初期ロード中はnull、以降は配列。ロード失敗時も[] */
    items: TItem[] | null
    /** 追加ロード中 */
    isFetching: boolean
    /** まだページが残っている可能性 */
    hasMore: boolean
    /** 手動トリガー用 */
    fetchMore: () => Promise<void>
    /** 初期状態に戻して再取得 */
    reload: () => Promise<void>
    /**
     * リストの終端近くに配置するダミー要素に付与する ref。
     * 交差時に自動でfetchMoreが呼ばれる。
     */
    observerTarget: RefObject<HTMLDivElement | null>
}

const defaultGetId = <T,>(item: T): string => (item as any)?.id ?? ''

/**
 * カーソルページネーション + IntersectionObserver ベースの無限スクロールを提供する。
 *
 * 典型的な使い方:
 *   const { items, hasMore, isFetching, observerTarget } = useInfiniteScroll({
 *     fetcher: (cursor) => getDataFromServerWithJson<CursorResponse<Route>>(
 *       `/api/v1/routes?limit=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
 *     ),
 *     deps: [userId],
 *   })
 */
export function useInfiniteScroll<TRaw, TItem = TRaw>(
    options: UseInfiniteScrollOptions<TRaw, TItem>
): UseInfiniteScrollResult<TItem> {
    const {
        fetcher,
        mapItem,
        getId = defaultGetId<TItem>,
        deps = [],
        enabled = true,
        threshold = 0.1,
        reportErrors = true,
    } = options

    const [items, setItems] = useState<TItem[] | null>(null)
    const [isFetching, setIsFetching] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const nextCursorRef = useRef<string | null>(null)
    const observerTarget = useRef<HTMLDivElement | null>(null)
    const appendError = errorStore(state => state.appendError)

    // 最新のfetcher/mapItemをrefに保持してコールバックを安定化
    const fetcherRef = useRef(fetcher)
    const mapItemRef = useRef(mapItem)
    const getIdRef = useRef(getId)
    const reportErrorsRef = useRef(reportErrors)
    useEffect(() => { fetcherRef.current = fetcher }, [fetcher])
    useEffect(() => { mapItemRef.current = mapItem }, [mapItem])
    useEffect(() => { getIdRef.current = getId }, [getId])
    useEffect(() => { reportErrorsRef.current = reportErrors }, [reportErrors])

    const mapAndFilter = useCallback((arr: TRaw[]): TItem[] => {
        const m = mapItemRef.current
        if (!m) return arr as unknown as TItem[]
        const out: TItem[] = []
        for (const raw of arr) {
            const v = m(raw)
            if (v !== null && v !== undefined) out.push(v)
        }
        return out
    }, [])

    // 初期ロード（depsに追従）
    useEffect(() => {
        if (!enabled) return
        let cancelled = false
        ;(async () => {
            setItems(null)
            setHasMore(true)
            nextCursorRef.current = null
            try {
                const res = await fetcherRef.current(null)
                if (cancelled) return
                if (res) {
                    const mapped = mapAndFilter(res.items)
                    setItems(mapped)
                    nextCursorRef.current = res.nextCursor
                    if (!res.nextCursor) setHasMore(false)
                } else {
                    setItems([])
                    setHasMore(false)
                }
            } catch (e: any) {
                if (cancelled) return
                setItems([])
                setHasMore(false)
                if (reportErrorsRef.current) appendError(e)
            }
        })()
        return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, mapAndFilter, appendError, ...deps])

    const fetchMore = useCallback(async () => {
        if (isFetching || !hasMore || !nextCursorRef.current) return
        setIsFetching(true)
        try {
            const res = await fetcherRef.current(nextCursorRef.current)
            if (res && res.items.length > 0) {
                const mapped = mapAndFilter(res.items)
                setItems(prev => {
                    const existing = new Set((prev ?? []).map(getIdRef.current))
                    const filtered = mapped.filter(i => !existing.has(getIdRef.current(i)))
                    return [...(prev ?? []), ...filtered]
                })
                nextCursorRef.current = res.nextCursor
                if (!res.nextCursor) setHasMore(false)
            } else {
                setHasMore(false)
            }
        } catch (e: any) {
            if (reportErrorsRef.current) appendError(e)
        } finally {
            setIsFetching(false)
        }
    }, [isFetching, hasMore, mapAndFilter, appendError])

    const reload = useCallback(async () => {
        nextCursorRef.current = null
        setHasMore(true)
        setItems(null)
        try {
            const res = await fetcherRef.current(null)
            if (res) {
                const mapped = mapAndFilter(res.items)
                setItems(mapped)
                nextCursorRef.current = res.nextCursor
                if (!res.nextCursor) setHasMore(false)
            } else {
                setItems([])
                setHasMore(false)
            }
        } catch (e: any) {
            setItems([])
            setHasMore(false)
            if (reportErrorsRef.current) appendError(e)
        }
    }, [mapAndFilter, appendError])

    // IntersectionObserver - observerTarget.currentが交差したら追加取得
    useEffect(() => {
        if (!enabled || !hasMore) return
        const el = observerTarget.current
        if (!el) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching) {
                    fetchMore()
                }
            },
            { threshold }
        )
        observer.observe(el)
        return () => observer.unobserve(el)
    }, [enabled, hasMore, isFetching, fetchMore, threshold, items])

    return {items, isFetching, hasMore, fetchMore, reload, observerTarget}
}
