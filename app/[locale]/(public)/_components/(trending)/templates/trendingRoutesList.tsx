import RouteCardBasicSkeleton from "@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton";
import RouteCardBasic from "@/app/[locale]/_components/common/templates/routeCardBasic";
import { Route } from "@/lib/types/domain";
import { useTranslations } from "next-intl";
import {RefObject, useEffect} from "react";
import { HiFire } from "react-icons/hi2";
import {CursorResponse, useInfiniteScroll} from "@/lib/hooks/useInfiniteScroll";
import {getDataFromServerWithJson} from "@/lib/api/client";
import {errorStore} from "@/lib/stores/errorStore";


export default function TrendingRoutesList() {
    const tHome = useTranslations('home');
    const tEmpty = useTranslations('empty');

    const appendError = errorStore(state => state.appendError);
    // トレンドのルート（カーソル無限スクロール）
    const {
        items: routes,
        hasMore,
        error: routesError,
        observerTarget,
    } = useInfiniteScroll<Route>({
        fetcher: (cursor) => {
            const url = `/api/v1/routes?type=trending&limit=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
            return getDataFromServerWithJson<CursorResponse<Route>>(url);
        },
    });

    // routesErrorが発生したら自動的にerrorStoreに追加
    useEffect(() => {
        if (routesError) {
            appendError(routesError);
        }
    }, [routesError, appendError]);

    // ダミーカードの生成（15個）
    const dummyCards = Array.from({ length: 15 }).map((_, i) => (
        <RouteCardBasicSkeleton
            key={`dummy-${i}`}
            isFirst={i === 0}
            observerTarget={i === 14 ? observerTarget : undefined}
        />
    ));


    return (
        <div className={`w-full md:w-[55vw] md:max-w-[900px] md:h-full md:overflow-y-scroll h-fit flex flex-col gap-6 md:py-16 py-2 no-scrollbar`}>
            <h2 className="md:flex hidden text-base font-bold uppercase tracking-[0.3em] text-foreground-0 mb-2 items-center gap-2">
                <HiFire className="text-accent-0 w-5 h-5" />
                {tHome('trendingRoutes')}
            </h2>
            {routes?.map((route, idx) => (
                <div key={route.id ?? idx} className={'w-full h-[440px] sm:h-[320px]'}>
                    <RouteCardBasic route={route} />
                </div>
            ))}
            {hasMore && dummyCards}
            {routes?.length === 0 && <p className="text-foreground-1">{tEmpty('noRoutes')}</p>}
        </div>
    )
}
