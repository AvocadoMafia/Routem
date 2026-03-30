'use client'

import MapViewerOnLaptop from "@/app/(public)/_components/(home)/templates/mapViewerOnLaptop";
import MapViewerOnMobile from "@/app/(public)/_components/(home)/templates/mapViewerOnMobile";
import TopRoutesList from "@/app/(public)/_components/(home)/templates/topRoutesList";
import TopUsersList from "@/app/(public)/_components/(home)/templates/topUsersList";
import RecommendedRoutesList from "@/app/(public)/_components/(home)/templates/recommendedRoutesList";
import { Route, User } from "@/lib/client/types";
import { useState, useEffect, useRef } from "react";
import { useUiStore } from "@/lib/client/stores/uiStore";
import { userStore } from "@/lib/client/stores/userStore";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import RouteCardHorizontalSkeleton from "@/app/(public)/_components/(home)/ingredients/routeCardHorizontalSkeleton";
import RouteCardBasicSkeleton from "@/app/_components/common/ingredients/routeCardBasicSkeleton";
import { HiFire } from "react-icons/hi2";

// カーソルベースのレスポンス型
type CursorResponse<T> = { items: T[]; nextCursor: string | null };

export default function HomeSection() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const nextCursorRef = useRef<string | null>(null);

    const [isClient, setIsClient] = useState(false);
    const isMobile = useUiStore((state) => state.isMobile);
    const user = userStore((state) => state.user);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // 記事のfetch処理
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            setHasMore(true);
            nextCursorRef.current = null;
            try {
                const isUserLoggedIn = user && user.id !== "";
                const routesUrl = isUserLoggedIn
                    ? '/api/v1/routes?limit=15&type=user_recommend'
                    : '/api/v1/routes?limit=15';

                const routesRes = await getDataFromServerWithJson<CursorResponse<Route>>(routesUrl);

                if (!cancelled) {
                    if (routesRes) {
                        setRoutes(routesRes.items);
                        nextCursorRef.current = routesRes.nextCursor;
                        if (!routesRes.nextCursor) setHasMore(false);
                    }
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? 'Failed to load routes');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true };
    }, [user?.id]);

    const fetchMoreRoutes = async () => {
        if (isFetching || !hasMore || routes.length === 0 || !nextCursorRef.current) return;
        setIsFetching(true);
        try {
            const isUserLoggedIn = user && user.id !== "";
            const cursor = encodeURIComponent(nextCursorRef.current);
            const routesUrl = isUserLoggedIn
                ? `/api/v1/routes?limit=15&type=user_recommend&cursor=${cursor}`
                : `/api/v1/routes?limit=15&cursor=${cursor}`;

            const res = await getDataFromServerWithJson<CursorResponse<Route>>(routesUrl);

            if (res && res.items.length > 0) {
                setRoutes(prev => {
                    const existingIds = new Set(prev.map(r => r.id));
                    const filtered = res.items.filter(r => !existingIds.has(r.id));
                    return [...prev, ...filtered];
                });
                nextCursorRef.current = res.nextCursor;
                if (!res.nextCursor) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error("Failed to fetch more routes:", e);
        } finally {
            setIsFetching(false);
        }
    };

    if (error) return (
        <div className="w-full h-full flex flex-col items-center gap-20 py-12">
            <div className={'w-full text-red-500 text-sm'}>{error}</div>
        </div>
    )

    return (
        <div className="w-full h-full flex flex-col items-center gap-20 py-12">
            {isClient && (
                <>
                    {isMobile ? (
                        <MapViewerOnMobile routes={loading ? undefined : routes} fetchMore={fetchMoreRoutes} hasMore={hasMore} isFetching={isFetching}/>
                    ) : (
                        <MapViewerOnLaptop routes={loading ? undefined : routes} fetchMore={fetchMoreRoutes} hasMore={hasMore} isFetching={isFetching}/>
                    )}
                </>
            )}
            <TopRoutesList />
            <TopUsersList />
            <RecommendedRoutesList routes={loading ? undefined : routes} fetchMore={fetchMoreRoutes} hasMore={hasMore} isFetching={isFetching}/>
        </div>
    );
}
