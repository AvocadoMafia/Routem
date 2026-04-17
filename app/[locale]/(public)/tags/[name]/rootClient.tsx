'use client'

import { useEffect, useRef, useState } from "react";
import { Route } from "@/lib/client/types";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import { errorStore } from "@/lib/client/stores/errorStore";
import { HiHashtag } from "react-icons/hi2";
import RouteCardBasic from "@/app/[locale]/_components/common/templates/routeCardBasic";
import RouteCardBasicSkeleton from "@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton";

type CursorResponse<T> = { items: T[]; nextCursor: string | null; totalCount?: number };

export default function RootClient({ name }: { name: string }) {
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const nextCursorRef = useRef<string | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);
    const appendError = errorStore(state => state.appendError);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setRoutes(null);
            setTotalCount(null);
            setHasMore(true);
            nextCursorRef.current = null;
            try {
                const url = `/api/v1/routes?tag=${encodeURIComponent(name)}&limit=15`;
                const res = await getDataFromServerWithJson<CursorResponse<Route>>(url);
                if (!cancelled && res) {
                    setRoutes(res.items);
                    setTotalCount(res.totalCount ?? res.items.length);
                    nextCursorRef.current = res.nextCursor;
                    if (!res.nextCursor) setHasMore(false);
                }
            } catch (e: any) {
                if (!cancelled) {
                    setRoutes([]);
                    setTotalCount(0);
                    appendError(e);
                }
            }
        }
        load();
        return () => { cancelled = true };
    }, [name]);

    const fetchMore = async () => {
        if (isFetching || !hasMore || !nextCursorRef.current) return;
        setIsFetching(true);
        try {
            const cursor = encodeURIComponent(nextCursorRef.current);
            const url = `/api/v1/routes?tag=${encodeURIComponent(name)}&limit=15&cursor=${cursor}`;
            const res = await getDataFromServerWithJson<CursorResponse<Route>>(url);
            if (res && res.items.length > 0) {
                setRoutes(prev => {
                    const existing = new Set((prev ?? []).map(r => r.id));
                    const filtered = res.items.filter(r => !existing.has(r.id));
                    return [...(prev ?? []), ...filtered];
                });
                nextCursorRef.current = res.nextCursor;
                if (!res.nextCursor) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (e: any) {
            appendError(e);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (!hasMore) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching) {
                    fetchMore();
                }
            },
            { threshold: 0.1 }
        );
        const el = observerTarget.current;
        if (el) observer.observe(el);
        return () => {
            if (el) observer.unobserve(el);
        };
    }, [hasMore, isFetching]);

    return (
        <div className={'w-full max-w-[1600px] h-full flex flex-col items-center md:px-8 px-4 py-8 gap-8'}>
            <header className={'w-full flex flex-col gap-2 items-start'}>
                <div className={'flex items-center gap-3'}>
                    <div className={'w-12 h-12 rounded-full bg-background-1 flex items-center justify-center border border-grass/20'}>
                        <HiHashtag className={'w-6 h-6 text-grass'}/>
                    </div>
                    <h1 className={'text-3xl md:text-4xl font-black text-foreground-0 break-all'}>{name}</h1>
                </div>
                <p className={'text-xs font-bold uppercase tracking-[0.2em] text-foreground-1/60 pl-15'}>
                    {totalCount === null
                        ? 'LOADING...'
                        : `${totalCount.toLocaleString()} ${totalCount === 1 ? 'POST' : 'POSTS'}`}
                </p>
            </header>

            <section className={'w-full h-fit flex flex-col gap-3'}>
                {routes === null ? (
                    <div className={'w-full grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <RouteCardBasicSkeleton key={`initial-${i}`} />
                        ))}
                    </div>
                ) : routes.length === 0 ? (
                    <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-grass/10 rounded-3xl">
                        <p className="text-foreground-1/60 text-sm font-bold uppercase tracking-widest">No routes found for this tag.</p>
                    </div>
                ) : (
                    <div className={'w-full grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'}>
                        {routes.map((r) => (
                            <RouteCardBasic route={r} key={r.id} />
                        ))}
                        {hasMore && Array.from({ length: 6 }).map((_, i) => (
                            <RouteCardBasicSkeleton
                                key={`more-${i}`}
                                isFirst={i === 0}
                                observerTarget={observerTarget}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
