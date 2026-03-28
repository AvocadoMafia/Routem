'use client';

import { Route } from '@/lib/client/types';
import RouteCardBasic from '@/app/_components/common/templates/routeCardBasic';
import RouteCardBasicSkeleton from '@/app/_components/common/ingredients/routeCardBasicSkeleton';

type Props = {
    routes: Route[];
    isFetching: boolean;
    hasMore: boolean;
    total: number;
    observerTarget: React.RefObject<HTMLDivElement | null>;
}

export default function ResultsGrid({ routes, isFetching, hasMore, total, observerTarget }: Props) {
    const showDummy =  hasMore;
    const isEmpty = routes.length === 0 && !isFetching;

    return (
        <div className={'w-full p-6'}>
            {isEmpty ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-slate-500 text-lg">結果が見つかりませんでした</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-max">
                        {routes.map((route) => (
                            <div
                                key={route.id}
                                className="animate-fadeIn"
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
                </>
            )}
        </div>
    );
}
