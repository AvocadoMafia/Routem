'use client'

import {useEffect, useState} from 'react'
import {Route} from '@/lib/client/types'
import {getDataFromServerWithJson} from '@/lib/client/helpers'
import RouteCardBasic from '@/app/_components/common/templates/routeCardBasic'
import FollowingUserCard from '@/app/(public)/_components/(followings)/ingredients/followingUserCard'
import {HiUsers} from "react-icons/hi2";

// 軽量ユーザー型（ユーザー表示用）
type LightUser = {
    id: string
    name: string
    bio?: string | null
    icon?: { url: string } | null
}

// Followレコード（バックから返すフォローそのもの）
type FollowRecord = { id: string; createdAt: string; following: LightUser }

export default function FollowingsSection() {
    const [routes, setRoutes] = useState<Route[] | null>(null)
    const [followings, setFollowings] = useState<LightUser[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        async function load() {
            setLoading(true)
            setError(null)
            try {
                const [routesData, followRecords] = await Promise.all([
                    getDataFromServerWithJson<Route[]>('/api/v1/routes?limit=12'),
                    getDataFromServerWithJson<FollowRecord[]>('/api/v1/followings?following=true&take=20'),
                ])
                if (!cancelled) {
                    setRoutes(routesData ?? [])
                    setFollowings((followRecords ?? []).map(fr => fr.following))
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? 'Failed to load followings feed')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [])

    if (loading) return <div className="w-full h-full flex items-center justify-center">Loading...</div>
    if (error) return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>

    return (
        <div className="w-full h-full overflow-hidden">
            <div className="w-full h-full overflow-hidden flex flex-col lg:flex-row gap-6 lg:gap-10">

                {/* 右サイドバー: フォロー中リスト（縦） */}
                <div
                    className="w-full lg:w-[360px] p-6 flex-shrink-0 h-fit lg:h-full">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">Followings</h2>
                    <div className="flex flex-col gap-2 max-h-full overflow-y-auto no-scrollbar py-3">
                        {followings && followings.length > 0 ? (
                            followings.map((u) => (
                                <FollowingUserCard key={u.id} user={u}/>
                            ))
                        ) : (
                            <div
                                className="w-full py-24 flex flex-col items-center justify-center gap-6">
                                <div className={'w-fit h-fit p-4 bg-foreground-1/20 rounded-full'}>
                                    <HiUsers className={'text-foreground-1/80 w-8 h-8'} />
                                </div>
                                <p className="text-foreground-1 text-md font-semibold tracking-widest">No
                                    followings yet.</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* メイン: 新着ルート */}
                <div className="md:block hidden flex-1 h-full overflow-y-auto no-scrollbar p-6">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1 mb-4">New Routes By Followings</h2>
                    {routes && routes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                            {routes.map((route) => (
                                <div key={route.id}>
                                    <RouteCardBasic route={route}/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-foreground-2/10 rounded-2xl">
                            <p className="text-foreground-1/60 text-[10px] font-bold uppercase tracking-widest">No
                                routes found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
