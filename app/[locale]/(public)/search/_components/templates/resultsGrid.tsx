'use client';

import { Route, ErrorScheme } from '@/lib/client/types';
import RouteCardBasic from '@/app/[locale]/_components/common/templates/routeCardBasic';
import RouteCardBasicSkeleton from '@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton';
import SectionErrorState from '@/app/[locale]/_components/common/ingredients/sectionErrorState';
import { useTranslations } from 'next-intl';

type Props = {
    routes: Route[];
    isFetching: boolean;
    hasMore: boolean;
    total: number;
    observerTarget: React.RefObject<HTMLDivElement | null>;
    error?: ErrorScheme | null;
    onRetry?: () => Promise<void>;
}

export default function ResultsGrid({ routes, isFetching, hasMore, total, observerTarget, error, onRetry }: Props) {
    const t = useTranslations('routes');
    const showDummy = hasMore && !error;
    const isEmpty = routes.length === 0 && !isFetching && !error;

    // 初回取得失敗: セクション全体を error UI にする
    if (error && routes.length === 0) {
        return (
            <div className="w-full p-6">
                <SectionErrorState onRetry={onRetry} />
            </div>
        );
    }

    return (
        <div className={'w-full p-6'}>
            {isEmpty ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-slate-500 text-lg">{t('noResults')}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 auto-rows-max">
                        {routes.map((route, index) => (
                            <div
                                key={route.id}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both"
                                style={{ animationDelay: `${(index % 6) * 100}ms` }}
                            >
                                <RouteCardBasic route={route} />
                            </div>
                        ))}

                        {showDummy && (
                            <>
                                <div ref={observerTarget}>
                                    <RouteCardBasicSkeleton />
                                </div>
                                <RouteCardBasicSkeleton />
                                <RouteCardBasicSkeleton />
                                <RouteCardBasicSkeleton />
                            </>
                        )}
                    </div>
                    {/* 追加ロード失敗時: リスト末尾に inline retry */}
                    {error && routes.length > 0 && (
                        <div className="mt-6">
                            <SectionErrorState variant="inline" onRetry={onRetry} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
