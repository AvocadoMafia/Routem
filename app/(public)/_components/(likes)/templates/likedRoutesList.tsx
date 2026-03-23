import RouteCardOnLikesList from "@/app/(public)/_components/(likes)/ingredients/routeCardOnLikesList";
import {Route} from "@/lib/types/domain";
import {useEffect, useMemo, useRef} from "react";
import Link from "next/link";
import { formatDateToYmdInTz } from "@/lib/datetime/format";

// Likeレコード（バックエンドから返却される素体）
type LikeRecord = { id: string; createdAt: string | Date; route: Route }

type Props = {
    routes: Route[]
    likes: LikeRecord[]
    focusedRouteIdx: number;
    setFocusedRouteIdx: (idx: number) => void;
}

export default function LikedRoutesList({routes, likes, focusedRouteIdx, setFocusedRouteIdx}: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

    // md以上（デスクトップ）でのフォーカススクロール制御
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const target = itemRefs.current.get(focusedRouteIdx);
        if (target) {
            const containerHeight = container.clientHeight;
            const targetHeight = target.offsetHeight;
            const targetTop = target.offsetTop;
            const scrollTop = targetTop - (containerHeight / 2) + (targetHeight / 2);
            requestAnimationFrame(() => {
                container.scrollTo({ top: scrollTop, behavior: 'smooth' });
            });
        }
    }, [focusedRouteIdx]);

    // モバイル（md以下）: いいね日（yyyy/mm/dd, JST）でグルーピング
    const groupedByDate = useMemo(() => {
        const map = new Map<string, LikeRecord[]>();
        likes.forEach(like => {
            const key = formatDateToYmdInTz(new Date(like.createdAt as any));
            const arr = map.get(key) ?? [];
            arr.push(like);
            map.set(key, arr);
        });
        // preserve order by first appearance in likes (already desc by createdAt from API)
        return Array.from(map.entries());
    }, [likes]);

    return (
        <div className={'md:w-1/3 w-full min-w-[340px] h-full p-4 backdrop-blur-sm'}>
            {/* デスクトップ: フォーカス可能な縦スクロールリスト */}
            <div ref={containerRef} className={'hidden md:flex flex-col gap-4 h-full overflow-y-scroll no-scrollbar'}>
                {routes.map((route, idx) => (
                    <div key={route.id ?? idx} ref={(el) => {
                        if (el) {
                            itemRefs.current.set(idx, el);
                        } else {
                            itemRefs.current.delete(idx);
                        }
                    }}>
                        <RouteCardOnLikesList route={route} myIdx={idx} focusedRouteIdx={focusedRouteIdx} onClick={() => setFocusedRouteIdx(idx)}/>
                    </div>
                ))}
            </div>

            {/* モバイル: いいね日ごとにグルーピングしたシンプルな縦リスト */}
            <div className={'md:hidden flex flex-col gap-6'}>
                {groupedByDate.map(([date, items]) => (
                    <div key={date} className={'flex flex-col gap-2'}>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-1/80 px-1">{date}</div>
                        <div className={'flex flex-col gap-3'}>
                            {items.map((like) => (
                                <Link key={like.id} href={`/routes/${like.route.id}`} className={'block'}>
                                    <RouteCardOnLikesList route={like.route} myIdx={-1} />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
