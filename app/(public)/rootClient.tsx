'use client'

import {useEffect, useMemo, useState} from "react";
import ContentsSelector from "@/app/(public)/_components/templates/contentsSelector";
import {Route, User} from "@/lib/client/types";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import HomeSection from "@/app/(public)/_components/(home)/homeSection";
import PhotosSection from "@/app/(public)/_components/(photos)/photosSection";
import TrendingSection from "@/app/(public)/_components/(trending)/trendingSection";
import { useUiStore } from "@/lib/client/stores/uiStore";
import { motion } from "framer-motion";

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
                            routes={displayedRoutes} 
                            users={users} 
                            loading={loading} 
                            error={error} 
                        />
                    )
                    case 'photos': return (
                        <PhotosSection />
                    )
                    case 'trending': return (
                        <TrendingSection />
                    )
                    case 'likes': return <></>
                    case 'followers': return <></>
                }
            })()}
        </div>
    )
}
