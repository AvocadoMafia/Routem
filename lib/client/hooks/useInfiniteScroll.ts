'use client'

import {DependencyList, RefObject, useCallback, useEffect, useRef, useState} from "react"
import {errorStore} from "@/lib/client/stores/errorStore"
import {ErrorScheme} from "@/lib/client/types"
import {toErrorScheme} from "@/lib/client/helpers"

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
     * IntersectionObserverのrootMargin。
     * 例: "0px 0px 200px 0px" で下方向200px手前で発火。
     */
    rootMargin?: string
    /**
     * IntersectionObserverの root に使うスクロールコンテナのref。
     * `overflow-y-scroll` な固定高コンテナ内でセンチネルを監視したい時に必須。
     * 指定なしの場合はviewport基準で監視する。
     */
    root?: RefObject<Element | null>
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
    /**
     * 初回 / 追加取得で発生した直近のエラー。成功で null に戻る。
     * UI 側で「エラー表示＋retryボタン」を出す判断に使う。
     */
    error: ErrorScheme | null
    /** 手動トリガー用 (追加ページを取りに行く) */
    fetchMore: () => Promise<void>
    /** 初期状態に戻して再取得 */
    reload: () => Promise<void>
    /**
     * 直近の失敗を再試行する。初回失敗なら reload 相当、追加取得失敗なら
     * fetchMore 相当で動作する。error UI の retry ボタンから呼ぶ想定。
     */
    retry: () => Promise<void>
    /**
     * リストの終端近くに配置するダミー要素に付与する ref。
     * 交差時に自動でfetchMoreが呼ばれる。
     * ただし error 状態のときは誤って無限再試行しないように自動発火は止まる。
     */
    observerTarget: RefObject<HTMLDivElement | null>
}

const defaultGetId = <T,>(item: T): string => (item as any)?.id ?? ''

/**
 * カーソルページネーション + IntersectionObserver ベースの無限スクロールを提供する。
 *
 * 旧版は失敗時に items=[] / hasMore=false を出してしまい、UI から見ると
 * 「0件」と「失敗」が区別できない問題があった。本版では error state を別途
 * 返し、UI が loading / error / empty / data の4状態を描き分けられるようにする。
 *
 * 典型的な使い方:
 *   const { items, hasMore, isFetching, error, retry, observerTarget } = useInfiniteScroll({
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
        rootMargin,
        root,
        reportErrors = true,
    } = options

    const [items, setItems] = useState<TItem[] | null>(null)
    const [isFetching, setIsFetching] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [error, setError] = useState<ErrorScheme | null>(null)
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
            setError(null)
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
                    // API が null を返したケース: 正常終了扱いで空配列
                    setItems([])
                    setHasMore(false)
                }
            } catch (e: unknown) {
                if (cancelled) return
                const scheme = toErrorScheme(e)
                // items は null のままにしない。呼び出し側が「data なし && error あり」を
                // 見て error UI を出せるように空配列にしておく。hasMore は true のまま
                // にして retry ボタンから再度取りに行けるようにする。
                setItems([])
                setError(scheme)
                if (reportErrorsRef.current) appendError(scheme)
            }
        })()
        return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, mapAndFilter, appendError, ...deps])

    const fetchMore = useCallback(async () => {
        if (isFetching || !hasMore || !nextCursorRef.current) return
        setIsFetching(true)
        setError(null)
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
        } catch (e: unknown) {
            const scheme = toErrorScheme(e)
            setError(scheme)
            if (reportErrorsRef.current) appendError(scheme)
        } finally {
            setIsFetching(false)
        }
    }, [isFetching, hasMore, mapAndFilter, appendError])

    const reload = useCallback(async () => {
        nextCursorRef.current = null
        setHasMore(true)
        setItems(null)
        setError(null)
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
        } catch (e: unknown) {
            const scheme = toErrorScheme(e)
            setItems([])
            setError(scheme)
            if (reportErrorsRef.current) appendError(scheme)
        }
    }, [mapAndFilter, appendError])

    const retry = useCallback(async () => {
        // まだ何も取れていない初回失敗は reload 相当、そうでなければ追加取得の再試行
        if (items === null || items.length === 0) {
            await reload()
        } else {
            await fetchMore()
        }
    }, [items, reload, fetchMore])

    // IntersectionObserver - observerTarget.currentが交差したら追加取得
    // error 状態のときは自動再試行しない。ユーザーの retry 操作に委ねる。
    useEffect(() => {
        if (!enabled || !hasMore || error) return
        const el = observerTarget.current
        if (!el) return
        const rootEl = root?.current ?? null
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching && !error) {
                    fetchMore()
                }
            },
            { threshold, root: rootEl, rootMargin }
        )
        observer.observe(el)
        return () => observer.unobserve(el)
    }, [enabled, hasMore, isFetching, fetchMore, threshold, rootMargin, root, items, error])

    return {items, isFetching, hasMore, error, fetchMore, reload, retry, observerTarget}
}
