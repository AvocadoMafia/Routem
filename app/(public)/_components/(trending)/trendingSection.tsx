'use client'

import { useState, useEffect } from "react";
import TrendingRoutesList from "@/app/(public)/_components/(trending)/templates/trendingRoutesList";
import TrendingUsersList from "@/app/(public)/_components/(trending)/templates/trendingUsersList";
import TrendingTagsList from "@/app/(public)/_components/(trending)/templates/trendingTagsList";
import { Route, User } from "@/lib/client/types";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import { motion, AnimatePresence } from "framer-motion";
import { HiFire, HiUsers, HiHashtag } from "react-icons/hi2";
import {CiRoute} from "react-icons/ci";

type TrendingTab = 'routes' | 'users' | 'tags';

export default function TrendingSection() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [users, setUsers] = useState<User[] | null>(null);
    const [tags, setTags] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TrendingTab>('routes');

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            setHasMore(true);
            try {
                const [routesData, usersData, tagsData] = await Promise.all([
                    getDataFromServerWithJson<Route[]>('/api/v1/routes?type=trending&limit=15&offset=0'),
                    getDataFromServerWithJson<User[]>('/api/v1/users?limit=6'),
                    getDataFromServerWithJson<string[]>('/api/v1/tags?limit=10')
                ]);

                if (!cancelled) {
                    setRoutes(routesData || []);
                    setUsers(usersData);
                    setTags(tagsData);
                    if (routesData && routesData.length < 15) setHasMore(false);
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? 'Failed to load trending data');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true };
    }, []);

    const fetchMoreRoutes = async () => {
        if (isFetching || !hasMore || routes.length === 0) return;
        setIsFetching(true);
        try {
            const offset = routes.length;
            const newRoutes = await getDataFromServerWithJson<Route[]>(`/api/v1/routes?type=trending&limit=15&offset=${offset}`);
            
            if (newRoutes && newRoutes.length > 0) {
                setRoutes(prev => {
                    const existingIds = new Set(prev.map(r => r.id));
                    const filtered = newRoutes.filter(r => !existingIds.has(r.id));
                    return [...prev, ...filtered];
                });
                if (newRoutes.length < 15) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.error("Failed to fetch more trending routes:", e);
        } finally {
            setIsFetching(false);
        }
    };

    if (loading) return <div className="w-full h-full flex items-center justify-center">Loading trending...</div>;
    if (error) return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className={'w-full h-full overflow-hidden flex flex-col'}>
            {/* モバイル用 Sticky Header & Tabs */}
            <div className="md:hidden sticky top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 flex flex-col gap-2">
                <div className="px-4 py-3 flex items-center gap-2">
                    <HiFire className="text-accent-0 w-5 h-5" />
                    <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">Trending</h1>
                </div>
                <div className="flex items-center px-4 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('routes')}
                        className={`flex items-center gap-2 px-4 pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === 'routes' ? 'text-accent-0' : 'text-foreground-1'}`}
                    >
                        <CiRoute size={16} />
                        <span>ROUTES</span>
                        {activeTab === 'routes' && <motion.div layoutId="trendingTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === 'users' ? 'text-accent-0' : 'text-foreground-1'}`}
                    >
                        <HiUsers size={16} />
                        <span>USERS</span>
                        {activeTab === 'users' && <motion.div layoutId="trendingTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('tags')}
                        className={`flex items-center gap-2 px-4 pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === 'tags' ? 'text-accent-0' : 'text-foreground-1'}`}
                    >
                        <HiHashtag size={16} />
                        <span>TAGS</span>
                        {activeTab === 'tags' && <motion.div layoutId="trendingTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />}
                    </button>
                </div>
            </div>

            <div className={'flex-1 w-full overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-12'}>
                {/* モバイル表示: アクティブなタブに応じて切り替え */}
                <div className="md:hidden w-full h-full overflow-y-auto no-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="p-4"
                        >
                            {activeTab === 'routes' && <TrendingRoutesList routes={routes} fetchMore={fetchMoreRoutes} hasMore={hasMore} isFetching={isFetching} hideHeader />}
                            {activeTab === 'users' && <TrendingUsersList users={users || []} mobileMode />}
                            {activeTab === 'tags' && <TrendingTagsList tags={tags || []} mobileMode />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* デスクトップ表示: 既存のレイアウト */}
                <div className="hidden md:flex w-full h-full overflow-hidden flex-row gap-8 lg:gap-12">
                    <TrendingRoutesList routes={routes} fetchMore={fetchMoreRoutes} hasMore={hasMore} isFetching={isFetching} />
                    <div className={'md:flex hidden flex-1 h-full flex-col gap-6 overflow-y-auto no-scrollbar py-6 lg:py-12'}>
                        <TrendingUsersList users={users || []} />
                        <TrendingTagsList tags={tags || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
