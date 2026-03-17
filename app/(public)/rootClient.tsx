'use client'

import {useEffect, useMemo, useState} from "react";
import ContentsSelector from "@/app/(public)/_components/templates/contentsSelector";
import MapViewerOnLaptop from "@/app/(public)/_components/templates/mapViewerOnLaptop";
import TopUsersList from "@/app/(public)/_components/templates/topUsersList";
import TopRoutesList from "@/app/(public)/_components/templates/topRoutesList";
import RecommendedRoutesList from "@/app/(public)/_components/templates/recommendedRoutesList";
import PhotoViewer from "@/app/(public)/_components/templates/photoViewer";
import RouteListBasic from "@/app/(public)/_components/templates/routeListBasic";
import {GiGreekTemple} from "react-icons/gi";
import {PiForkKnife, PiMountains} from "react-icons/pi";
import {LuPalette} from "react-icons/lu";
import {FaRunning} from "react-icons/fa";
import {IoIosArrowForward} from "react-icons/io";
import {Route} from "@/lib/client/types";
import MapViewerOnMobile from "@/app/(public)/_components/templates/mapViewerOnMobile";
import type {RouteVisibility} from "@prisma/client";
import { getDataFromServerWithJson } from "@/lib/client/helpers";

export type selectedType = 'home' | 'photos' | 'interests' | 'recent' | 'trending'

export default function RootClient() {

    // Fetch routes from API
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    //記事のfetch処理。fetch関数のwrapperやエラー等のハンドリングについては後ほど実行する。
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await getDataFromServerWithJson<Route[]>('/api/v1/routes?limit=12');
                console.log(data)
                if (!cancelled && data) setRoutes(data);
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
        <div className={'w-full max-w-[1600px] h-fit flex flex-col items-center md:px-8 px-4 md:pb-12 pb-6 gap-12 relative'}>
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
                                    {/* TopUsersList will be rendered only if we have enough unique authors */}
                                    {Array.from(new Map(displayedRoutes.filter(r => r.author).map(r => [r.author!.id, r.author!])).values()).length >= 5 && (
                                        <TopUsersList users={Array.from(new Map(displayedRoutes.filter(r => r.author).map(r => [r.author!.id, r.author!])).values()).slice(0,5) as any} />
                                    )}
                                    <RecommendedRoutesList routes={displayedRoutes}/>
                                </>
                            )}
                        </div>
                    )
                    case 'photos': return (
                        <PhotoViewer/>
                    )
                    case 'interests': return (
                        <div className={'w-full h-fit flex flex-col gap-12'}>
                            <div className={'w-full flex flex-col gap-4'}>
                                <div className={'py-2 flex flex-row justify-between items-center border-b border-grass/10'}>
                                    <div className={'flex flex-row items-center gap-3 text-foreground-0 font-bold'}>
                                        <GiGreekTemple className={'text-2xl'}/>
                                        <h2 className={'text-xl tracking-tight'}>History</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-1.5 text-foreground-1/60 hover:text-accent-0 transition-colors cursor-pointer'}>
                                        <span className={'text-sm font-bold uppercase tracking-widest'}>View More</span>
                                        <IoIosArrowForward className={'text-lg'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={displayedRoutes}/>
                            </div>
                            <div className={'w-full flex flex-col gap-4'}>
                                <div className={'py-2 flex flex-row justify-between items-center border-b border-grass/10'}>
                                    <div className={'flex flex-row items-center gap-3 text-foreground-0 font-bold'}>
                                        <PiMountains className={'text-2xl'}/>
                                        <h2 className={'text-xl tracking-tight'}>Nature</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-1.5 text-foreground-1/60 hover:text-accent-0 transition-colors cursor-pointer'}>
                                        <span className={'text-sm font-bold uppercase tracking-widest'}>View More</span>
                                        <IoIosArrowForward className={'text-lg'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={displayedRoutes}/>
                            </div>
                            <div className={'w-full flex flex-col gap-4'}>
                                <div className={'py-2 flex flex-row justify-between items-center border-b border-grass/10'}>
                                    <div className={'flex flex-row items-center gap-3 text-foreground-0 font-bold'}>
                                        <LuPalette className={'text-2xl'}/>
                                        <h2 className={'text-xl tracking-tight'}>Culture</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-1.5 text-foreground-1/60 hover:text-accent-0 transition-colors cursor-pointer'}>
                                        <span className={'text-sm font-bold uppercase tracking-widest'}>View More</span>
                                        <IoIosArrowForward className={'text-lg'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={displayedRoutes}/>
                            </div>
                            <div className={'w-full flex flex-col gap-4'}>
                                <div className={'py-2 flex flex-row justify-between items-center border-b border-grass/10'}>
                                    <div className={'flex flex-row items-center gap-3 text-foreground-0 font-bold'}>
                                        <PiForkKnife className={'text-2xl'}/>
                                        <h2 className={'text-xl tracking-tight'}>Food</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-1.5 text-foreground-1/60 hover:text-accent-0 transition-colors cursor-pointer'}>
                                        <span className={'text-sm font-bold uppercase tracking-widest'}>View More</span>
                                        <IoIosArrowForward className={'text-lg'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={displayedRoutes}/>
                            </div>
                            <div className={'w-full flex flex-col gap-4'}>
                                <div className={'py-2 flex flex-row justify-between items-center border-b border-grass/10'}>
                                    <div className={'flex flex-row items-center gap-3 text-foreground-0 font-bold'}>
                                        <FaRunning className={'text-2xl'}/>
                                        <h2 className={'text-xl tracking-tight'}>Activity</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-1.5 text-foreground-1/60 hover:text-accent-0 transition-colors cursor-pointer'}>
                                        <span className={'text-sm font-bold uppercase tracking-widest'}>View More</span>
                                        <IoIosArrowForward className={'text-lg'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={displayedRoutes}/>
                            </div>
                        </div>
                    )
                    case 'recent': return <></>
                    case 'trending': return <></>
                }
            })()}
        </div>
    )
}
