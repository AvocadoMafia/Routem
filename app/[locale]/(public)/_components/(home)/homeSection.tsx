'use client'

import MapViewerOnLaptop from "@/app/[locale]/(public)/_components/(home)/templates/mapViewerOnLaptop";
import MapViewerOnMobile from "@/app/[locale]/(public)/_components/(home)/templates/mapViewerOnMobile";
import TopRoutesList from "@/app/[locale]/(public)/_components/(home)/templates/topRoutesList";
import TopUsersList from "@/app/[locale]/(public)/_components/(home)/templates/topUsersList";
import RecommendedRoutesList from "@/app/[locale]/(public)/_components/(home)/templates/recommendedRoutesList";
import { Route } from "@/lib/client/types";
import { useEffect, useState } from "react";
import { useUiStore } from "@/lib/client/stores/uiStore";
import { userStore } from "@/lib/client/stores/userStore";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import { CursorResponse, useInfiniteScroll } from "@/lib/client/hooks/useInfiniteScroll";

export default function HomeSection() {
    const [isClient, setIsClient] = useState(false);
    const isMobile = useUiStore((state) => state.isMobile);
    const user = userStore((state) => state.user);
    const isUserLoggedIn = !!user?.id;

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { items: routes, hasMore, isFetching, fetchMore, error, retry, observerTarget } = useInfiniteScroll<Route>({
        fetcher: (cursor) => {
            const base = isUserLoggedIn
                ? '/api/v1/routes?limit=15&type=user_recommend'
                : '/api/v1/routes?limit=15';
            const url = cursor ? `${base}&cursor=${encodeURIComponent(cursor)}` : base;
            return getDataFromServerWithJson<CursorResponse<Route>>(url);
        },
        deps: [user?.id],
    });

    return (
        <div className="w-full h-full flex flex-col items-center gap-20 py-12">
            {isClient && (
                <>
                    {isMobile ? (
                        <MapViewerOnMobile routes={routes ?? undefined} fetchMore={fetchMore} hasMore={hasMore} isFetching={isFetching}/>
                    ) : (
                        <MapViewerOnLaptop routes={routes ?? undefined} fetchMore={fetchMore} hasMore={hasMore} isFetching={isFetching}/>
                    )}
                </>
            )}
            <TopRoutesList />
            <TopUsersList />
            <RecommendedRoutesList
                routes={routes ?? undefined}
                fetchMore={fetchMore}
                hasMore={hasMore}
                isFetching={isFetching}
                observerTarget={observerTarget}
                error={error}
                onRetry={retry}
            />
        </div>
    );
}
