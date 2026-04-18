'use client'

import {Route} from '@/lib/client/types'
import {getDataFromServerWithJson} from '@/lib/client/helpers'
import RouteCardBasic from '@/app/[locale]/_components/common/templates/routeCardBasic'
import FollowingUserCard from '@/app/[locale]/(public)/_components/(followings)/ingredients/followingUserCard'
import FollowingUserCardSkeleton from '@/app/[locale]/(public)/_components/(followings)/ingredients/followingUserCardSkeleton'
import SectionErrorState from '@/app/[locale]/_components/common/ingredients/sectionErrorState'
import {HiUsers} from "react-icons/hi2";
import RouteCardBasicSkeleton from '@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton'
import FuckingOctopus from "@/app/[locale]/_components/common/ingredients/fuckingOctopus";
import {CursorResponse, useInfiniteScroll} from "@/lib/client/hooks/useInfiniteScroll";

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

    // データ到着前 かつ エラーもまだ無い場合を loading と判定
    const routesLoading = routes === null && !routesError
    const followingsLoading = followings === null && !followingsError
    const loading = routesLoading || followingsLoading

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

    if (loading) return (
        <div className="w-full md:h-full h-fit md:overflow-hidden flex md:flex-row flex-col">
            <div className={'md:w-[400px] py-6 px-3 w-full h-full flex flex-col gap-3'}>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 hidden md:block">Followings</h2>
                {Array.from({length: 10}).map((_, i) => (
                    <FollowingUserCardSkeleton key={i}/>
                ))}
            </div>
            <div className={'md:block hidden flex-1 h-full flex flex-col py-6 px-3'}>
                <h2 className="h-fit text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 mb-4">New Routes By Followings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                    {Array.from({length: 6}).map((_, i) => (
                        <RouteCardBasicSkeleton key={i}/>
                    ))}
                </div>
            </div>
        </div>
    )

    // followings 初回取得失敗: セクション全体をエラーにして retry させる
    // (followings 無しで routes 単独を見せても意味が薄いため)
    if (followingsError && (!followings || followings.length === 0)) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-4">
                <div className="w-full md:hidden sticky top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 px-2 py-3 flex items-center gap-2">
                    <HiUsers className="text-accent-0 w-5 h-5"/>
                    <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">Followings</h1>
                </div>
                <div className="w-full max-w-md">
                    <SectionErrorState error={followingsError} onRetry={async () => {
                        await Promise.all([retryFollowings(), retryRoutes()])
                    }}/>
                </div>
            </div>
        )
    }

    if (!followings || followings.length === 0) return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative">
            <div className="w-full md:hidden absolute top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 px-2 py-3 flex items-center gap-2">
                <HiUsers className="text-accent-0 w-5 h-5"/>
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
                <HiUsers className="text-accent-0 w-5 h-5"/>
                <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">Followings</h1>
            </div>


            <div className={'md:w-[400px] py-6 px-3 w-full md:h-full h-fit md:overflow-y-scroll'}>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 hidden md:block">Followings</h2>
                {followings.map((u, idx) => (
                    <FollowingUserCard key={u.id ?? idx} user={u}/>
                ))}
                {hasMoreFollowings && !followingsError && followingDummyCards}
                {followingsError && followings.length > 0 && (
                    <SectionErrorState variant="inline" error={followingsError} onRetry={retryFollowings}/>
                )}
            </div>


            <div className={'md:block hidden flex-1 h-full md:overflow-y-scroll flex flex-col py-6 px-3'}>
                <h2 className="h-fit text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 mb-4">New Routes By Followings</h2>
                {routesError && (!routes || routes.length === 0) ? (
                    <SectionErrorState error={routesError} onRetry={retryRoutes}/>
                ) : routes && routes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                        {routes.map((route) => (
                            <div key={route.id}>
                                <RouteCardBasic route={route}/>
                            </div>
                        ))}
                        {hasMoreRoutes && !routesError && routeDummyCards}
                        {routesError && (
                            <div className="col-span-full">
                                <SectionErrorState variant="inline" error={routesError} onRetry={retryRoutes}/>
                            </div>
                        )}
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
