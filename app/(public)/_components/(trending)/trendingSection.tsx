'use client'

import { useState, useEffect } from "react";
import TrendingRoutesList from "@/app/(public)/_components/(trending)/templates/trendingRoutesList";
import TrendingUsersList from "@/app/(public)/_components/(trending)/templates/trendingUsersList";
import TrendingTagsList from "@/app/(public)/_components/(trending)/templates/trendingTagsList";
import { Route, User } from "@/lib/client/types";
import { getDataFromServerWithJson } from "@/lib/client/helpers";

export default function TrendingSection() {
    const [routes, setRoutes] = useState<Route[] | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);
    const [tags, setTags] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [routesData, usersData, tagsData] = await Promise.all([
                    getDataFromServerWithJson<Route[]>('/api/v1/routes?limit=10'),
                    getDataFromServerWithJson<User[]>('/api/v1/users?limit=6'),
                    getDataFromServerWithJson<string[]>('/api/v1/tags?limit=10')
                ]);

                if (!cancelled) {
                    setRoutes(routesData);
                    setUsers(usersData);
                    setTags(tagsData);
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

    if (loading) return <div className="w-full h-full flex items-center justify-center">Loading trending...</div>;
    if (error) return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className={'w-full h-full overflow-hidden'}>
            <div className={'w-full h-full overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-12'}>
                <TrendingRoutesList routes={routes || []} />
                <div className={'md:flex hidden flex-1 h-full flex-col gap-6 overflow-y-auto no-scrollbar py-6 lg:py-12'}>
                    <TrendingUsersList users={users || []} />
                    <TrendingTagsList tags={tags || []} />
                </div>
            </div>
        </div>
    );
}
