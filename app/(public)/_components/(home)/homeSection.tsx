'use client'

import MapViewerOnLaptop from "@/app/(public)/_components/(home)/templates/mapViewerOnLaptop";
import MapViewerOnMobile from "@/app/(public)/_components/(home)/templates/mapViewerOnMobile";
import TopRoutesList from "@/app/(public)/_components/(home)/templates/topRoutesList";
import TopUsersList from "@/app/(public)/_components/(home)/templates/topUsersList";
import RecommendedRoutesList from "@/app/(public)/_components/(home)/templates/recommendedRoutesList";
import { Route, User } from "@/lib/client/types";
import { useState, useEffect } from "react";
import { useUiStore } from "@/lib/client/stores/uiStore";

type Props = {
    routes: Route[];
    users: User[] | null;
    loading: boolean;
    error: string | null;
    fetchMore: () => Promise<void>;
    hasMore: boolean;
    isFetching?: boolean;
};

export default function HomeSection({ routes, users, loading, error, fetchMore, hasMore, isFetching }: Props) {
    const [isClient, setIsClient] = useState(false);
    const isMobile = useUiStore((state) => state.isMobile);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center gap-20 py-12">
            {error && <div className={'w-full text-red-500 text-sm'}>{error}</div>}
            {loading && routes.length === 0 ? (
                <div className={'w-full text-foreground-1 text-sm'}>Loading routes...</div>
            ) : (
                <>
                    {isClient && (
                        <>
                            {isMobile ? (
                                <MapViewerOnMobile routes={routes}/>
                            ) : (
                                <MapViewerOnLaptop routes={routes} fetchMore={fetchMore} hasMore={hasMore} isFetching={isFetching}/>
                            )}
                        </>
                    )}
                    <TopRoutesList routes={routes} />
                    {/* TopUsersList */}
                    {users && users.length >= 5 && (
                        <TopUsersList users={users} />
                    )}
                    <RecommendedRoutesList routes={routes} fetchMore={fetchMore} hasMore={hasMore} isFetching={isFetching}/>
                </>
            )}
        </div>
    );
}
