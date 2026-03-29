import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";
import RouteCardBasicSkeleton from "@/app/_components/common/ingredients/routeCardBasicSkeleton";
import {Route} from "@/lib/client/types";
import { HiFire } from "react-icons/hi2";
import { useEffect, useRef } from "react";

type Props = {
    routes: Route[];
    fetchMore?: () => Promise<void>;
    hasMore?: boolean;
    isFetching?: boolean;
};

export default function TrendingRoutesList({ routes, fetchMore, hasMore, isFetching }: Props) {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!fetchMore || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching) {
                    fetchMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, fetchMore, isFetching]);

    // ダミーカードの生成（15個）
    const dummyCards = Array.from({ length: 15 }).map((_, i) => (
        <RouteCardBasicSkeleton 
            key={`dummy-${i}`} 
            isFirst={i === 0}
            observerTarget={observerTarget}
        />
    ));

    return (
        <div className={`w-full lg:w-[900px] md:h-full md:overflow-y-scroll h-fit flex flex-col gap-6 md:py-16 py-2 no-scrollbar`}>
            <h2 className="md:flex hidden text-base font-bold uppercase tracking-[0.3em] text-foreground-0 mb-2 items-center gap-2">
                <HiFire className="text-accent-0 w-5 h-5" />
                Trending Routes
            </h2>
            {routes.map((route, idx) => (
                <div key={route.id ?? idx} className={'w-full h-fit lg:h-[400px]'}>
                    <RouteCardBasic route={route} />
                </div>
            ))}
            {hasMore && dummyCards}
            {routes.length === 0 && !hasMore && <p className="text-foreground-1">No routes found.</p>}
        </div>
    )
}
