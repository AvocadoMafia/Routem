import { useTranslations } from "next-intl";
import RouteCardBasic from "@/app/[locale]/_components/common/templates/routeCardBasic";
import RouteCardBasicSkeleton from "@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton";
import SectionErrorState from "@/app/[locale]/_components/common/ingredients/sectionErrorState";
import {Route} from "@/lib/types/domain";
import {ErrorScheme} from "@/lib/types/error";
import { HiFire } from "react-icons/hi2";
import { RefObject } from "react";

type Props = {
    routes?: Route[];
    fetchMore?: () => Promise<void>;
    hasMore?: boolean;
    isFetching?: boolean;
    observerTarget?: RefObject<HTMLDivElement | null>;
    error?: ErrorScheme | null;
    onRetry?: () => Promise<void>;
};

export default function TrendingRoutesList({ routes, hasMore, observerTarget, error, onRetry }: Props) {
    const tHome = useTranslations('home');
    const tEmpty = useTranslations('empty');
    const tCommon = useTranslations('common');

    // ダミーカードの生成（15個）
    const dummyCards = Array.from({ length: 15 }).map((_, i) => (
        <RouteCardBasicSkeleton
            key={`dummy-${i}`}
            isFirst={i === 0}
            observerTarget={observerTarget}
        />
    ));

    // --- error (初回失敗: 取得データが無い) ---
    if (error && (!routes || routes.length === 0)) {
        return (
            <div className={`w-full md:w-[55vw] md:max-w-[900px] md:h-full md:overflow-y-scroll h-fit flex flex-col gap-6 md:py-16 py-2 no-scrollbar`}>
                <h2 className="md:flex hidden text-base font-bold uppercase tracking-[0.3em] text-foreground-0 mb-2 items-center gap-2">
                    <HiFire className="text-accent-0 w-5 h-5" />
                    {tHome('trendingRoutes')}
                </h2>
                <SectionErrorState error={error} onRetry={onRetry} />
            </div>
        );
    }

    // --- loading ---
    if (!routes) {
        return (
            <div className={`w-full md:w-[55vw] md:max-w-[900px] md:h-full md:overflow-y-scroll h-fit flex flex-col gap-6 md:py-16 py-2 no-scrollbar`}>
                <h2 className="md:flex hidden text-base font-bold uppercase tracking-[0.3em] text-foreground-0 mb-2 items-center gap-2">
                    <HiFire className="text-accent-0 w-5 h-5" />
                    {tHome('trendingRoutes')}
                </h2>
                {Array.from({ length: 3 }).map((_, i) => (
                    <RouteCardBasicSkeleton key={i} />
                ))}
                <div className="flex items-center justify-center py-10">
                    <p className="text-foreground-1 font-bold uppercase tracking-[0.2em] animate-pulse">{tCommon('loading')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`w-full md:w-[55vw] md:max-w-[900px] md:h-full md:overflow-y-scroll h-fit flex flex-col gap-6 md:py-16 py-2 no-scrollbar`}>
            <h2 className="md:flex hidden text-base font-bold uppercase tracking-[0.3em] text-foreground-0 mb-2 items-center gap-2">
                <HiFire className="text-accent-0 w-5 h-5" />
                {tHome('trendingRoutes')}
            </h2>
            {routes.map((route, idx) => (
                <div key={route.id ?? idx} className={'w-full h-fit lg:h-[400px]'}>
                    <RouteCardBasic route={route} />
                </div>
            ))}
            {hasMore && !error && dummyCards}
            {routes.length === 0 && !hasMore && <p className="text-foreground-1">{tEmpty('noRoutes')}</p>}
            {/* 追加ロード失敗時はリスト末尾に再試行ボタンを */}
            {error && routes.length > 0 && (
                <SectionErrorState variant="inline" error={error} onRetry={onRetry} />
            )}
        </div>
    )
}
