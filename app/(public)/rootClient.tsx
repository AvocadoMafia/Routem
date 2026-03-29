'use client'

import {useEffect, useMemo, useState, useRef} from "react";
import ContentsSelector from "@/app/(public)/_components/templates/contentsSelector";
import {Route, User} from "@/lib/client/types";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import HomeSection from "@/app/(public)/_components/(home)/homeSection";
import PhotosSection from "@/app/(public)/_components/(photos)/photosSection";
import TrendingSection from "@/app/(public)/_components/(trending)/trendingSection";
import { useUiStore } from "@/lib/client/stores/uiStore";
import { userStore } from "@/lib/client/stores/userStore";
import { motion } from "framer-motion";
import LikesSection from "@/app/(public)/_components/(likes)/likesSection";
import FollowingsSection from "@/app/(public)/_components/(followings)/followingsSection";

// カーソルベースのレスポンス型
type CursorResponse<T> = { items: T[]; nextCursor: string | null };

export type selectedType = 'home' | 'photos' | 'trending' | 'likes' | 'followings'

export default function RootClient() {

    // Fetch routes from API
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const nextCursorRef = useRef<string | null>(null);
    const user = userStore((state) => state.user);

    //記事のfetch処理
    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            setHasMore(true);
            nextCursorRef.current = null;
            try {
                const isUserLoggedIn = user && user.id !== "";
                const routesUrl = isUserLoggedIn
                    ? '/api/v1/routes?limit=15&type=user_recommend'
                    : '/api/v1/routes?limit=15';

                const [routesRes, usersData] = await Promise.all([
                    getDataFromServerWithJson<CursorResponse<Route>>(routesUrl),
                    getDataFromServerWithJson<User[]>('/api/v1/users?limit=5')
                ]);

                if (!cancelled) {
                    if (routesRes) {
                        setRoutes(routesRes.items);
                        nextCursorRef.current = routesRes.nextCursor;
                        if (!routesRes.nextCursor) setHasMore(false);
                    }
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
    }, [user?.id]);

    const fetchMoreRoutes = async () => {
        if (isFetching || !hasMore || !routes || !nextCursorRef.current) return;
        setIsFetching(true);
        try {
            const isUserLoggedIn = user && user.id !== "";
            const cursor = encodeURIComponent(nextCursorRef.current);
            const routesUrl = isUserLoggedIn
                ? `/api/v1/routes?limit=15&type=user_recommend&cursor=${cursor}`
                : `/api/v1/routes?limit=15&cursor=${cursor}`;

            const res = await getDataFromServerWithJson<CursorResponse<Route>>(routesUrl);
            console.log("res", res);

            if (res && res.items.length > 0) {
                setRoutes(prev => {
                    if (!prev) return res.items;
                    // 重複排除
                    const existingIds = new Set(prev.map(r => r.id));
                    const filtered = res.items.filter(r => !existingIds.has(r.id));
                    return [...prev, ...filtered];
                });
                nextCursorRef.current = res.nextCursor;
                if (!res.nextCursor) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error("Failed to fetch more routes:", e);
        } finally {
            setIsFetching(false);
        }
    };

    // 取得したroutesをそのまま利用
    const displayedRoutes = useMemo<Route[]>(() => {
        return Array.isArray(routes) ? routes : [];
    }, [routes]);

    const scrollDirection = useUiStore((state) => state.scrollDirection)

    const [selected, setSelected] = useState<selectedType>('home')
    return (
        <div className={'w-full max-w-[1600px] h-full flex flex-col items-center md:px-8 px-4 relative'}>
            <div className="fixed bottom-8 left-0 w-full flex justify-center z-40 pointer-events-none">
                <motion.div
                    initial={false}
                    animate={{
                        y: scrollDirection === 'down' ? 100 : 0,
                        opacity: scrollDirection === 'down' ? 0 : 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="pointer-events-auto"
                >
                    <ContentsSelector selected={selected} setSelected={setSelected}/>
                </motion.div>
            </div>
            {(() => {
                switch (selected) {
                    case 'home': return (
                        <HomeSection 
                            key="home-section"
                            routes={displayedRoutes} 
                            users={users} 
                            loading={loading} 
                            isFetching={isFetching}
                            error={error} 
                            fetchMore={fetchMoreRoutes}
                            hasMore={hasMore}
                        />
                    )
                    case 'photos': return (
                        <PhotosSection />
                    )
                    case 'trending': return (
                        <TrendingSection />
                    )
                    case 'likes': return (
                        <LikesSection />
                    )
                    case 'followings': return (
                        <FollowingsSection/>
                    )
                }
            })()}
        </div>
    )
}
