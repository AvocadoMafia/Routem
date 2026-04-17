'use client'

import {useEffect, useState, useRef} from 'react'
import {Route} from '@/lib/client/types'
import {getDataFromServerWithJson} from '@/lib/client/helpers'
import { errorStore } from '@/lib/client/stores/errorStore'
import RouteCardBasic from '@/app/[locale]/_components/common/templates/routeCardBasic'
import FollowingUserCard from '@/app/[locale]/(public)/_components/(followings)/ingredients/followingUserCard'
import FollowingUserCardSkeleton from '@/app/[locale]/(public)/_components/(followings)/ingredients/followingUserCardSkeleton'
import {HiUsers} from "react-icons/hi2";
import RouteCardBasicSkeleton from '@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton'
import FuckingOctopus from "@/app/[locale]/_components/common/ingredients/fuckingOctopus";

// 軽量ユーザー型（ユーザー表示用）
type LightUser = {
    id: string
    name: string
    bio?: string | null
    icon?: { url: string } | null
}

// Followレコード（バックから返すフォローそのもの）
type FollowRecord = { id: string; createdAt: string; target: LightUser }

// カーソルベースのレスポンス型
type CursorResponse<T> = { items: T[]; nextCursor: string | null };

export default function FollowingsSection() {
    const [routes, setRoutes] = useState<Route[]>([])
    const [followings, setFollowings] = useState<LightUser[]>([])
    const [loading, setLoading] = useState(true)
    const [isFetching, setIsFetching] = useState(false)
    const [hasMoreRoutes, setHasMoreRoutes] = useState(true)
    const [hasMoreFollowings, setHasMoreFollowings] = useState(true)
    const appendError = errorStore(state => state.appendError)

    const routesCursorRef = useRef<string | null>(null);
    const followingsCursorRef = useRef<string | null>(null);
    const observerTargetRoutes = useRef<HTMLDivElement>(null);
    const observerTargetFollowings = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false

        async function load() {
            setLoading(true)
            setHasMoreRoutes(true)
            setHasMoreFollowings(true)
            routesCursorRef.current = null;
            followingsCursorRef.current = null;
            try {
                const [routesRes, followRes] = await Promise.all([
                    getDataFromServerWithJson<CursorResponse<Route>>('/api/v1/routes?type=followings&limit=15'),
                    getDataFromServerWithJson<CursorResponse<FollowRecord>>('/api/v1/follows?type=following&take=15'),
                ])
                if (!cancelled) {
                    if (routesRes) {
                        setRoutes(routesRes.items);
                        routesCursorRef.current = routesRes.nextCursor;
                        if (!routesRes.nextCursor) setHasMoreRoutes(false);
                    }
                    if (followRes) {
                        setFollowings(followRes.items.map(fr => fr.target));
                        followingsCursorRef.current = followRes.nextCursor;
                        if (!followRes.nextCursor) setHasMoreFollowings(false);
                    }
                }
            } catch (e: any) {
                if (!cancelled) appendError(e)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [])

    const fetchMoreRoutes = async () => {
        if (isFetching || !hasMoreRoutes || routes.length === 0 || !routesCursorRef.current) return;
        setIsFetching(true);
        try {
            const cursor = encodeURIComponent(routesCursorRef.current);
            const res = await getDataFromServerWithJson<CursorResponse<Route>>(`/api/v1/routes?type=followings&limit=15&cursor=${cursor}`);
            if (res && res.items.length > 0) {
                setRoutes(prev => {
                    const existingIds = new Set(prev.map(r => r.id));
                    const filtered = res.items.filter(r => !existingIds.has(r.id));
                    return [...prev, ...filtered];
                });
                routesCursorRef.current = res.nextCursor;
                if (!res.nextCursor) setHasMoreRoutes(false);
            } else {
                setHasMoreRoutes(false);
            }
        } catch (e) {
            console.error("Failed to fetch more following routes:", e);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchMoreFollowings = async () => {
        if (isFetching || !hasMoreFollowings || followings.length === 0 || !followingsCursorRef.current) return;
        setIsFetching(true);
        try {
            const cursor = encodeURIComponent(followingsCursorRef.current);
            const res = await getDataFromServerWithJson<CursorResponse<FollowRecord>>(`/api/v1/follows?type=following&take=15&cursor=${cursor}`);
            if (res && res.items.length > 0) {
                const newFollowings = res.items.map(fr => fr.target);
                setFollowings(prev => {
                    const existingIds = new Set(prev.map(u => u.id));
                    const filtered = newFollowings.filter(u => !existingIds.has(u.id));
                    return [...prev, ...filtered];
                });
                followingsCursorRef.current = res.nextCursor;
                if (!res.nextCursor) setHasMoreFollowings(false);
            } else {
                setHasMoreFollowings(false);
            }
        } catch (e) {
            console.error("Failed to fetch more followings:", e);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (!hasMoreRoutes) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreRoutes && !isFetching && !loading) {
                    fetchMoreRoutes();
                }
            },
            { threshold: 0.1 }
        );
        if (observerTargetRoutes.current) observer.observe(observerTargetRoutes.current);
        return () => observer.disconnect();
    }, [hasMoreRoutes, routes.length, isFetching, loading]);

    useEffect(() => {
        if (!hasMoreFollowings) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreFollowings && !isFetching && !loading) {
                    fetchMoreFollowings();
                }
            },
            { threshold: 0.1 }
        );
        if (observerTargetFollowings.current) observer.observe(observerTargetFollowings.current);
        return () => observer.disconnect();
    }, [hasMoreFollowings, followings.length, isFetching, loading]);

    const routeDummyCards = Array.from({ length: 15 }).map((_, i) => (
        <RouteCardBasicSkeleton 
            key={`dummy-route-${i}`} 
            isFirst={i === 0}
            observerTarget={observerTargetRoutes}
        />
    ));

    const followingDummyCards = Array.from({ length: 15 }).map((_, i) => (
        <FollowingUserCardSkeleton 
            key={`dummy-following-${i}`} 
            isFirst={i === 0}
            observerTarget={observerTargetFollowings}
        />
    ));

    if (loading) return (
        <div className="w-full md:h-full h-fit md:overflow-hidden flex md:flex-row flex-col">
            <div className={'md:w-[400px] py-6 px-3 w-full h-full flex flex-col gap-3'}>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 hidden md:block">Followings</h2>
                {Array.from({ length: 10 }).map((_, i) => (
                    <FollowingUserCardSkeleton key={i} />
                ))}
            </div>
            <div className={'md:block hidden flex-1 h-full flex flex-col py-6 px-3'}>
                <h2 className="h-fit text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 mb-4">New Routes By Followings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <RouteCardBasicSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    )

    if(!followings || followings.length === 0) return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative">
            <div className="w-full md:hidden absolute top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 px-2 py-3 flex items-center gap-2">
                <HiUsers className="text-accent-0 w-5 h-5" />
                <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">Followings</h1>
            </div>
            <FuckingOctopus className={'w-[300px] h-[300px] text-foreground-1'}/>
            <h2 className={'text-foreground-0 font-bold uppercase text-xl'}>NO FOLLOWINGS FOUND.</h2>
            <p className={'text-foreground-1'}>You’re not following anyone yet, right?</p>
        </div>
    )

    return (
        <div className="w-full md:h-full h-fit md:overflow-hidden flex md:flex-row flex-col">
            {/* モバイル用 Sticky Header */}
            <div className="md:hidden sticky top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 px-2 py-3 flex items-center gap-2">
                <HiUsers className="text-accent-0 w-5 h-5" />
                <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">Followings</h1>
            </div>


            <div className={'md:w-[400px] py-6 px-3 w-full md:h-full h-fit md:overflow-y-scroll'}>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 hidden md:block">Followings</h2>
                {followings.map((u, idx) => (
                    <FollowingUserCard key={idx} user={u}/>
                ))}
                {hasMoreFollowings && followingDummyCards}
            </div>


            <div className={'md:block hidden flex-1 h-full md:overflow-y-scroll flex flex-col py-6 px-3'}>
                <h2 className="h-fit text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 mb-4">New Routes By Followings</h2>
                {routes && routes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                        {routes.map((route, idx) => (
                            <div key={idx}>
                                <RouteCardBasic route={route}/>
                            </div>
                        ))}
                        {hasMoreRoutes && routeDummyCards}
                    </div>
                ) : (
                    <div
                        className="h-fit w-full flex flex-col items-center pt-[23svh]">
                        <FuckingOctopus className={'w-[300px] h-[300px] text-foreground-1'}/>
                        <p className={'text-foreground-1'}>NO ROUTES FOUND</p>
                    </div>
                )}
            </div>
        </div>
    )
}
