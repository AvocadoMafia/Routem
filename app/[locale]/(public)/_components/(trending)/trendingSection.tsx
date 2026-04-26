'use client'

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import TrendingRoutesList from "@/app/[locale]/(public)/_components/(trending)/templates/trendingRoutesList";
import TrendingUsersList from "@/app/[locale]/(public)/_components/(trending)/templates/trendingUsersList";
import TrendingTagsList from "@/app/[locale]/(public)/_components/(trending)/templates/trendingTagsList";
import SectionErrorState from "@/app/[locale]/_components/common/ingredients/sectionErrorState";
import { Route, User } from "@/lib/types/domain";
import { ErrorScheme } from "@/lib/types/error";
import { getDataFromServerWithJson, toErrorScheme } from "@/lib/api/client";
import { errorStore } from "@/lib/stores/errorStore";
import { motion, AnimatePresence } from "framer-motion";
import { HiFire, HiUsers, HiHashtag } from "react-icons/hi2";
import {MdRoute} from "react-icons/md";
import { CursorResponse, useInfiniteScroll } from "@/lib/hooks/useInfiniteScroll";

type TrendingTab = 'routes' | 'users' | 'tags';

export type TrendingUser = Pick<User, 'id' | 'name' | 'bio' | 'icon'> & {
    _count?: { followers: number; followings: number; routes: number };
};

export type TrendingTag = { name: string; postCount: number };

export default function TrendingSection() {
    const t = useTranslations('home');
    const [users, setUsers] = useState<TrendingUser[] | null>(null);
    const [tags, setTags] = useState<TrendingTag[] | null>(null);
    const [usersTagsError, setUsersTagsError] = useState<ErrorScheme | null>(null);
    const appendError = errorStore(state => state.appendError);
    const [activeTab, setActiveTab] = useState<TrendingTab>('routes');

    // トレンドのユーザー・タグ（10件制限、ページネーション不要）
    const fetchUsersAndTags = useCallback(async () => {
        setUsersTagsError(null);
        try {
            const [usersData, tagsData] = await Promise.all([
                getDataFromServerWithJson<TrendingUser[]>('/api/v1/users?limit=10&type=trending'),
                getDataFromServerWithJson<TrendingTag[]>('/api/v1/tags?limit=10&type=trending'),
            ]);
            setUsers(usersData);
            setTags(tagsData);
        } catch (e: unknown) {
            const scheme = toErrorScheme(e);
            setUsersTagsError(scheme);
            appendError(scheme);
        }
    }, [appendError]);

    useEffect(() => {
        fetchUsersAndTags();
    }, [fetchUsersAndTags]);

    // トレンドのルート（カーソル無限スクロール）
    const {
        items: routes,
        hasMore,
        isFetching,
        fetchMore,
        error: routesError,
        retry: retryRoutes,
        observerTarget,
    } = useInfiniteScroll<Route>({
        fetcher: (cursor) => {
            const url = `/api/v1/routes?type=trending&limit=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
            return getDataFromServerWithJson<CursorResponse<Route>>(url);
        },
    });

    // users/tags は UI 的に1つのエラー表示でまとめてよい (タブ切り替えで出る)
    const usersError = usersTagsError && !users ? usersTagsError : null;
    const tagsError = usersTagsError && !tags ? usersTagsError : null;

    return (
        <div className={'w-full md:h-full h-fit'}>
            {/* モバイル用 Sticky Header & Tabs */}
            <div className="md:hidden sticky top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 flex flex-col gap-2">
                <div className="px-2 py-3 flex items-center gap-2">
                    <HiFire className="text-accent-0 w-5 h-5" />
                    <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">{t('trending')}</h1>
                </div>
                <div className="flex items-center px-2 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('routes')}
                        className={`flex items-center gap-2 px-4 pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === 'routes' ? 'text-accent-0' : 'text-foreground-1'}`}
                    >
                        <MdRoute size={16} />
                        <span className="uppercase">{t('routes')}</span>
                        {activeTab === 'routes' && <motion.div layoutId="trendingTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === 'users' ? 'text-accent-0' : 'text-foreground-1'}`}
                    >
                        <HiUsers size={16} />
                        <span className="uppercase">{t('travelers')}</span>
                        {activeTab === 'users' && <motion.div layoutId="trendingTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('tags')}
                        className={`flex items-center gap-2 px-4 pb-3 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === 'tags' ? 'text-accent-0' : 'text-foreground-1'}`}
                    >
                        <HiHashtag size={16} />
                        <span className="uppercase">{t('tags')}</span>
                        {activeTab === 'tags' && <motion.div layoutId="trendingTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />}
                    </button>
                </div>
            </div>

            {/* モバイル表示: アクティブなタブに応じて切り替え */}
            <div className="md:hidden w-full h-fit md:px-4 px-0 py-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'routes' && (
                            <TrendingRoutesList
                                routes={routes ?? undefined}
                                fetchMore={fetchMore}
                                hasMore={hasMore}
                                isFetching={isFetching}
                                observerTarget={observerTarget}
                                error={routesError}
                                onRetry={retryRoutes}
                            />
                        )}
                        {activeTab === 'users' && (
                            usersError
                                ? <SectionErrorState error={usersTagsError} onRetry={fetchUsersAndTags} />
                                : <TrendingUsersList users={users ?? undefined}  />
                        )}
                        {activeTab === 'tags' && (
                            tagsError
                                ? <SectionErrorState error={usersTagsError} onRetry={fetchUsersAndTags} />
                                : <TrendingTagsList tags={tags ?? undefined} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* デスクトップ表示: 既存のレイアウト */}
            <div className="hidden md:flex w-full h-full overflow-hidden flex-row gap-8 lg:gap-12">
                <TrendingRoutesList
                    routes={routes ?? undefined}
                    fetchMore={fetchMore}
                    hasMore={hasMore}
                    isFetching={isFetching}
                    observerTarget={observerTarget}
                    error={routesError}
                    onRetry={retryRoutes}
                />
                <div className={'md:flex hidden flex-1 h-full flex-col gap-6 overflow-y-auto no-scrollbar py-6 lg:py-12'}>
                    {usersError
                        ? <SectionErrorState error={usersTagsError} onRetry={fetchUsersAndTags} />
                        : <TrendingUsersList users={users ?? undefined} />}
                    {tagsError
                        ? null /* 同じエラーが2度出るのを防止: users 側で既に出している */
                        : <TrendingTagsList tags={tags ?? undefined} />}
                </div>
            </div>
        </div>
    );
}
