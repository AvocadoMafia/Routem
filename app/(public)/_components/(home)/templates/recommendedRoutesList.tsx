import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";
import RouteCardBasicSkeleton from "@/app/_components/common/ingredients/routeCardBasicSkeleton";
import {Route} from "@/lib/client/types";
import {useEffect, useRef} from "react";

type Props = {
    routes: Route[]
    fetchMore: () => Promise<void>
    hasMore: boolean
    isFetching?: boolean
}

export default function RecommendedRoutesList(props: Props) {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && props.hasMore && !props.isFetching) {
                    props.fetchMore();
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
    }, [props.hasMore, props.fetchMore, props.isFetching]);

    // ダミーカードの生成（30個）
    const dummyCards = Array.from({ length: 30 }).map((_, i) => (
        <RouteCardBasicSkeleton 
            key={`dummy-${i}`} 
            isFirst={i === 0}
            observerTarget={observerTarget}
        />
    ));

    return (
        <div className={'w-full h-fit flex flex-col gap-3'}>
            <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">Recommended For You</h2>
            <div className={'w-full grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'}>
                {props.routes.map((r, idx) => (
                    <RouteCardBasic route={r} key={idx} />
                ))}
                {props.hasMore && dummyCards}
            </div>
        </div>
    )
}
