import RouteCardBasic from "@/app/[locale]/_components/common/templates/routeCardBasic";
import RouteCardBasicSkeleton from "@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton";
import SectionErrorState from "@/app/[locale]/_components/common/ingredients/sectionErrorState";
import {Route} from "@/lib/client/types";
import {ErrorScheme} from "@/lib/client/types";
import {RefObject} from "react";

type Props = {
    routes?: Route[]
    fetchMore?: () => Promise<void>
    hasMore?: boolean
    isFetching?: boolean
    observerTarget?: RefObject<HTMLDivElement | null>
    error?: ErrorScheme | null
    onRetry?: () => Promise<void>
}

export default function RecommendedRoutesList(props: Props) {
    // ダミーカードの生成（15個）
    const dummyCards = Array.from({ length: 15 }).map((_, i) => (
        <RouteCardBasicSkeleton
            key={`dummy-${i}`}
            isFirst={i === 0}
            observerTarget={props.observerTarget}
        />
    ));

    // --- loading 状態 (初回ロード中: routes=undefined かつ error なし) ---
    if (!props.routes && !props.error) {
        return (
            <div className={'w-full h-fit flex flex-col gap-3'}>
                <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">Recommended For You</h2>
                <div className={'w-full grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <RouteCardBasicSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    // --- error 状態 (初回ロード失敗: 取得済みが空かつ error あり) ---
    if (props.error && (!props.routes || props.routes.length === 0)) {
        return (
            <div className={'w-full h-fit flex flex-col gap-3'}>
                <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">Recommended For You</h2>
                <SectionErrorState error={props.error} onRetry={props.onRetry} />
            </div>
        )
    }

    return (
        <div className={'w-full h-fit flex flex-col gap-3'}>
            <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">Recommended For You</h2>
            <div className={'w-full grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'}>
                {props.routes?.map((r, idx) => (
                    <RouteCardBasic route={r} key={r.id ?? idx} />
                ))}
                {props.hasMore && !props.error && dummyCards}
            </div>
            {/* 追加ロード失敗時は末尾に小さめのエラー行を表示し、再試行させる */}
            {props.error && props.routes && props.routes.length > 0 && (
                <SectionErrorState variant="inline" error={props.error} onRetry={props.onRetry} />
            )}
        </div>
    )
}
