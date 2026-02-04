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
import {Route, User} from "@/lib/client/types";
import MapViewerOnMobile from "@/app/(public)/_components/templates/mapViewerOnMobile";

export type selectedType = 'home' | 'photos' | 'interests' | 'recent' | 'trending'

export default function ClientRoot() {

    // Mock users for demo (this week)
    const mockUsers: User[] = [
        { id: 'u1', name: 'Aki Tanaka', likesThisWeek: 1240, viewsThisWeek: 28120, location: 'Tokyo, JP', bio: 'City explorer and coffee lover.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Nara.jpg' },
        { id: 'u2', name: 'Kenji Sato', likesThisWeek: 980, viewsThisWeek: 19230, location: 'Osaka, JP', bio: 'Runner and ramen hunter in Kansai.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Tokyo.jpg' },
        { id: 'u3', name: 'Serene Jane', likesThisWeek: 1570, viewsThisWeek: 32010, location: 'Kyoto, JP', bio: 'History routes and hidden shrines.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/userProfile.jpg' },
        { id: 'u4', name: 'Yuta Mori', likesThisWeek: 870, viewsThisWeek: 16800, location: 'Sapporo, JP', bio: 'Snowy trails and craft beer enthusiast.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Fuji.jpg' },
        { id: 'u5', name: 'Hana Suzuki', likesThisWeek: 1430, viewsThisWeek: 29990, location: 'Fukuoka, JP', bio: 'Weekend cyclist and bakery map maker from Japan. And Ive Lived in French since last year. Its great and I love here.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Kyoto.jpg' },
        { id: 'u6', name: 'Ren Nakamura', likesThisWeek: 760, viewsThisWeek: 14550, location: 'Nagoya, JP', bio: 'Techie who loves riverfront jogs.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Hokkaido.jpg' },
        { id: 'u7', name: 'Sara Ito', likesThisWeek: 1110, viewsThisWeek: 25040, location: 'Nara, JP', bio: 'Nature walks and deer lover in Nara.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Hokkaido.jpg' },
    ]

    // Fetch routes from API
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/v1/routems?take=12', { cache: 'no-store' });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || 'Failed to load routes');
                if (!cancelled) setRoutes(data.routes as Route[]);
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? 'Failed to load');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true };
    }, []);

    // In case there are fewer than expected items, fill to avoid UI index errors.
    const paddedRoutes = useMemo<Route[]>(() => {
        const base: Route[] = routes ?? [];
        if (base.length >= 6) return base;
        // pad with placeholders
        const placeholdersNeeded = 6 - base.length;
        const placeholders: Route[] = Array.from({ length: Math.max(0, placeholdersNeeded) }).map((_, i) => ({
            id: `placeholder-${i}`,
            title: `Sample Route ${i + 1}`,
            user: mockUsers[i % mockUsers.length],
            likesThisWeek: 0,
            viewsThisWeek: 0,
            category: 'General',
            thumbnailImageSrc: '/mockImages/Kyoto.jpg'
        }));
        return [...base, ...placeholders];
    }, [routes]);

    const [selected, setSelected] = useState<selectedType>('home')
    return (
        <div className={'w-full max-w-[1600px] h-fit flex flex-col items-center md:px-8 px-4 md:pb-8 pb-4 gap-8 relative'}>
            <ContentsSelector selected={selected} setSelected={setSelected}/>
            {(() => {
                switch (selected) {
                    case 'home': return (
                        <div className={'w-full h-fit flex flex-col items-center gap-8'}>
                            {error && <div className={'w-full text-red-500 text-sm'}>{error}</div>}
                            {loading ? (
                                <div className={'w-full text-foreground-1 text-sm'}>Loading routes...</div>
                            ) : (
                                <>
                                    <MapViewerOnLaptop routes={paddedRoutes}/>
                                    <MapViewerOnMobile routes={paddedRoutes}/>
                                    <TopRoutesList routes={paddedRoutes} />
                                    <TopUsersList users={mockUsers}/>
                                    <RecommendedRoutesList routes={paddedRoutes}/>
                                </>
                            )}
                        </div>
                    )
                    case 'photos': return (
                        <PhotoViewer/>
                    )
                    case 'interests': return (
                        <div className={'w-full h-fit flex flex-col gap-8'}>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-0 font-bold'}>
                                        <GiGreekTemple className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>History</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={paddedRoutes}/>
                            </div>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-0 font-bold'}>
                                        <PiMountains className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>Nature</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={paddedRoutes}/>
                            </div>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-0 font-bold'}>
                                        <LuPalette className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>Culture</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={paddedRoutes}/>
                            </div>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-0 font-bold'}>
                                        <PiForkKnife className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>Food</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={paddedRoutes}/>
                            </div>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items中心 gap-2 text-foreground-0 font-bold'}>
                                        <FaRunning className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>Activity</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic routes={paddedRoutes}/>
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
