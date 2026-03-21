'use client'

import {useEffect, useMemo, useState} from "react";
import ContentsSelector from "@/app/(public)/_components/templates/contentsSelector";
import MapViewerOnLaptop from "@/app/(public)/_components/templates/mapViewerOnLaptop";
import TopUsersList from "@/app/(public)/_components/templates/topUsersList";
import TopRoutesList from "@/app/(public)/_components/templates/topRoutesList";
import RecommendedRoutesList from "@/app/(public)/_components/templates/recommendedRoutesList";
import PhotoViewer from "@/app/(public)/_components/templates/photoViewer";
import {Route, User} from "@/lib/client/types";
import MapViewerOnMobile from "@/app/(public)/_components/templates/mapViewerOnMobile";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import TrendingRoutesList from "@/app/(public)/_components/templates/trendingRoutesList";
import TrendingUsersList from "@/app/(public)/_components/templates/trendingUsersList";
import TrendingTagsList from "@/app/(public)/_components/templates/trendingTagsList";

export type selectedType = 'home' | 'photos' | 'trending' | 'likes' | 'followers'

export default function RootClient() {

    // Fetch routes from API
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    //記事のfetch処理
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [routesData, usersData] = await Promise.all([
                    getDataFromServerWithJson<Route[]>('/api/v1/routes?limit=12'),
                    getDataFromServerWithJson<User[]>('/api/v1/users?limit=5')
                ]);
                
                if (!cancelled) {
                    if (routesData) setRoutes(routesData);
                    if (usersData) setUsers(usersData);
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? 'Failed to load');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true };
    }, []);

    // 取得したroutesをそのまま利用
    const displayedRoutes = useMemo<Route[]>(() => {
        return Array.isArray(routes) ? routes : [];
    }, [routes]);

    const [selected, setSelected] = useState<selectedType>('home')
    return (
        <div className={'w-full max-w-[1600px] h-full flex flex-col items-center md:px-8 px-4 gap-12 relative'}>
            <ContentsSelector selected={selected} setSelected={setSelected}/>
            {(() => {
                switch (selected) {
                    case 'home': return (
                        <div className={'w-full h-fit flex flex-col items-center gap-20'}>
                            {error && <div className={'w-full text-red-500 text-sm'}>{error}</div>}
                            {loading ? (
                                <div className={'w-full text-foreground-1 text-sm'}>Loading routes...</div>
                            ) : (
                                <>
                                    <MapViewerOnLaptop routes={displayedRoutes}/>
                                    <MapViewerOnMobile routes={displayedRoutes}/>
                                    <TopRoutesList routes={displayedRoutes} />
                                    {/* TopUsersList */}
                                    {users && users.length >= 5 && (
                                        <TopUsersList users={users} />
                                    )}
                                    <RecommendedRoutesList routes={displayedRoutes}/>
                                </>
                            )}
                        </div>
                    )
                    case 'photos': return (
                        <PhotoViewer/>
                    )
                    case 'trending': return (
                        <div className={'w-full h-full overflow-hidden flex flex-row'}>
                            <TrendingRoutesList />
                            <div className={'flex-1 h-full flex flex-col gap-2 overflow-y-scroll'}>
                                <TrendingUsersList/>
                                <TrendingTagsList/>
                            </div>
                        </div>
                    )
                    case 'likes': return <></>
                    case 'followers': return <></>
                }
            })()}
        </div>
    )
}
