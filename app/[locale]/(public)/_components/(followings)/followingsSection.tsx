'use client'

import {Route} from '@/lib/types/domain'
import {getDataFromServerWithJson} from '@/lib/api/client'
import RouteCardBasic from '@/app/[locale]/_components/common/templates/routeCardBasic'
import FollowingUserCard from '@/app/[locale]/(public)/_components/(followings)/ingredients/followingUserCard'
import FollowingUserCardSkeleton from '@/app/[locale]/(public)/_components/(followings)/ingredients/followingUserCardSkeleton'
import {HiUsers} from "react-icons/hi2";
import {useTranslations} from "next-intl";
import RouteCardBasicSkeleton from '@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton'
import FuckingOctopus from "@/app/[locale]/_components/common/ingredients/fuckingOctopus";
import {CursorResponse, useInfiniteScroll} from "@/lib/hooks/useInfiniteScroll";

// 軽量ユーザー型（ユーザー表示用）
type LightUser = {
    id: string
    name: string
    bio?: string | null
    icon?: { url: string } | null
}

// Followレコード（バックから返すフォローそのもの）
type FollowRecord = { id: string; createdAt: string; target: LightUser }

export default function FollowingsSection() {
    const tHome = useTranslations('home');
    const tProfile = useTranslations('profile');
    const tEmpty = useTranslations('empty');
    const {
        items: routes,
        hasMore: hasMoreRoutes,
        observerTarget: observerTargetRoutes,
        error: routesError,
        retry: retryRoutes,
    } = useInfiniteScroll<Route>({
        fetcher: (cursor) => {
            const url = `/api/v1/routes?type=followings&limit=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
            return getDataFromServerWithJson<CursorResponse<Route>>(url);
        },
    });

    const {
        items: followings,
        hasMore: hasMoreFollowings,
        observerTarget: observerTargetFollowings,
        error: followingsError,
        retry: retryFollowings,
    } = useInfiniteScroll<FollowRecord, LightUser>({
        fetcher: (cursor) => {
            const url = `/api/v1/follows?type=following&take=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
            return getDataFromServerWithJson<CursorResponse<FollowRecord>>(url);
        },
        mapItem: (fr) => fr.target,
    });

    const isEmpty = followings !== null && followings.length === 0;

    const routeDummyCards = Array.from({length: 15}).map((_, i) => (
        <RouteCardBasicSkeleton
            key={`dummy-route-${i}`}
            isFirst={i === 0}
            observerTarget={observerTargetRoutes}
        />
    ));

    const followingDummyCards = Array.from({length: 15}).map((_, i) => (
        <FollowingUserCardSkeleton
            key={`dummy-following-${i}`}
            isFirst={i === 0}
            observerTarget={observerTargetFollowings}
        />
    ));

    return (
        <div className="w-full h-full md:h-full h-fit flex flex-col md:flex-row relative">
            {/* Mobile Header (Fixed) */}
            <div className="md:hidden sticky top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 px-2 py-3 flex items-center gap-2 w-full">
                <span className="text-accent-0 w-5 h-5 flex items-center justify-center"><HiUsers className="w-5 h-5" /></span>
                <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">{tHome('followings')}</h1>
            </div>

            {isEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <FuckingOctopus className={'w-[300px] h-[300px] text-foreground-1'}/>
                    <h2 className={'text-foreground-0 font-bold uppercase text-xl'}>{tProfile('noFollowingsTitle')}</h2>
                    <p className={'text-foreground-1'}>{tProfile('noFollowingsDesc')}</p>
                </div>
            ) : (
                <>
                    <div className={'md:w-[400px] py-6 px-3 w-full md:h-full h-fit md:overflow-y-scroll'}>
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 hidden md:block">{tHome('followings')}</h2>
                        {followings === null && !followingsError ? (
                            Array.from({length: 10}).map((_, i) => (
                                <FollowingUserCardSkeleton key={i}/>
                            ))
                        ) : (
                            <>
                                {followings?.map((u, idx) => (
                                    <FollowingUserCard key={u.id ?? idx} user={u}/>
                                ))}
                                {hasMoreFollowings && !followingsError && followingDummyCards}
                            </>
                        )}
                    </div>

                    <div className={'md:block hidden flex-1 h-full md:overflow-y-scroll flex flex-col py-6 px-3'}>
                        <h2 className="h-fit text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 mb-4">{tHome('newRoutesByFollowings')}</h2>
                        {routes === null && !routesError ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                                {Array.from({length: 6}).map((_, i) => (
                                    <RouteCardBasicSkeleton key={i}/>
                                ))}
                            </div>
                        ) : routes && routes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                                {routes.map((route) => (
                                    <div key={route.id}>
                                        <RouteCardBasic route={route}/>
                                    </div>
                                ))}
                                {hasMoreRoutes && !routesError && routeDummyCards}
                            </div>
                        ) : (
                            <div
                                className="h-fit w-full flex flex-col items-center pt-[23svh]">
                                <FuckingOctopus className={'w-[300px] h-[300px] text-foreground-1'}/>
                                <p className={'text-foreground-1 uppercase'}>{tEmpty('noRoutes')}</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
