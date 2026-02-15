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
import {RouteVisibility} from "@prisma/client";

export type selectedType = 'home' | 'photos' | 'interests' | 'recent' | 'trending'

export default function ClientRoot() {

    // Mock users for demo (this week)
    const mockUsers: User[] = [
        { id: 'u1', name: 'Aki Tanaka', location: 'Tokyo, JP', bio: 'City explorer and coffee lover.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Nara.jpg' },
        { id: 'u2', name: 'Kenji Sato', location: 'Osaka, JP', bio: 'Runner and ramen hunter in Kansai.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Tokyo.jpg' },
        { id: 'u3', name: 'Serene Jane', location: 'Kyoto, JP', bio: 'History routes and hidden shrines.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/userProfile.jpg' },
        { id: 'u4', name: 'Yuta Mori', location: 'Sapporo, JP', bio: 'Snowy trails and craft beer enthusiast.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Fuji.jpg' },
        { id: 'u5', name: 'Hana Suzuki', location: 'Fukuoka, JP', bio: 'Weekend cyclist and bakery map maker from Japan. And Ive Lived in French since last year. Its great and I love here.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Kyoto.jpg' },
        { id: 'u6', name: 'Ren Nakamura', location: 'Nagoya, JP', bio: 'Techie who loves riverfront jogs.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Hokkaido.jpg' },
        { id: 'u7', name: 'Sara Ito', location: 'Nara, JP', bio: 'Nature walks and deer lover in Nara.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Hokkaido.jpg' },
    ]

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
                const res = await fetch('/api/v1/routes?limit=12', { cache: 'no-store' });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || 'Failed to load routes');
                if (!cancelled) setRoutes(data as Route[]);
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? 'Failed to load');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true };
    }, []);

    // UIのエラーを回避するためにモック記事をfetchしたroutesに追加する
    const paddedRoutes = useMemo<Route[]>(() => {
        const base: Route[] = routes ?? [];
        if (base.length >= 6) return base;
        // pad with placeholders
        const placeholdersNeeded = 6 - base.length;
        const placeholders: Route[] = Array.from({ length: Math.max(0, placeholdersNeeded) }).map((_, i) => ({
            id: `placeholder-${i}`,
            title: `Sample Route ${i + 1}`,
            description: 'This is a sample description for the placeholder route.',
            visibility: RouteVisibility.PUBLIC,
            authorId: mockUsers[i % mockUsers.length].id,
            author: {
                ...mockUsers[i % mockUsers.length],
                profileImage: mockUsers[i % mockUsers.length].profileImage ? { id: `img-u-${i}`, url: mockUsers[i % mockUsers.length].profileImage, type: 'USER_PROFILE', status: 'ADOPTED', createdAt: new Date(), updatedAt: new Date(), uploaderId: mockUsers[i % mockUsers.length].id, routeNodeId: null, userProfileId: mockUsers[i % mockUsers.length].id, routeThumbId: null } : null,
                gender: null,
                age: null,
            } as any,
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 1,
            category: { id: 1, name: 'General' },
            thumbnail: { id: `thumb-${i}`, url: '/mockImages/Kyoto.jpg', type: 'ROUTE_THUMBNAIL', status: 'ADOPTED', createdAt: new Date(), updatedAt: new Date(), uploaderId: mockUsers[i % mockUsers.length].id, routeNodeId: null, userProfileId: null, routeThumbId: `placeholder-${i}` } as any,
            likes: Array.from({ length: 10 + i * 5 }).map((_, j) => ({ id: `like-${i}-${j}`, createdAt: new Date(), target: 'ROUTE', routeId: `placeholder-${i}`, userId: `u${(j % 7) + 1}` })),
            views: Array.from({ length: 100 + i * 20 }).map((_, j) => ({ id: `view-${i}-${j}`, createdAt: new Date(), target: 'ROUTE', routeId: `placeholder-${i}`, userId: null })),
            routeNodes: [
                {
                    id: `node-${i}-1`,
                    routeId: `placeholder-${i}`,
                    spotId: 'kyoto-station',
                    details: 'Start from Kyoto Station',
                    spot: {
                        id: 'kyoto-station',
                        name: 'Kyoto Station',
                        longitude: 135.7588,
                        latitude: 34.9858,
                        source: 'mock'
                    }
                },
                {
                    id: `node-${i}-2`,
                    routeId: `placeholder-${i}`,
                    spotId: 'nara-park',
                    details: 'Visit Nara Park',
                    spot: {
                        id: 'nara-park',
                        name: 'Nara Park',
                        longitude: 135.8430,
                        latitude: 34.6851,
                        source: 'mock'
                    }
                }
            ] as any
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
