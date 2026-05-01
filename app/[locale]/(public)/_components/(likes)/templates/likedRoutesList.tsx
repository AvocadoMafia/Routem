import RouteCardWidely from "@/app/[locale]/_components/common/templates/routeCardWidely";
import RouteCardWidelySkeleton from "@/app/[locale]/_components/common/ingredients/routeCardWidelySkeleton";
import {Route} from "@/lib/types/domain";
import {useEffect, useMemo, useRef} from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatDateToYmdInTz } from "@/lib/utils/datetime";
import { HiHeart } from "react-icons/hi2";

// Likeレコード（バックエンドから返却される素体）
type LikeRecord = { id: string; createdAt: string | Date; route: Route }

type Props = {
    routes?: Route[]
    likes?: LikeRecord[]
    focusedRouteIdx: number;
    setFocusedRouteIdx: (idx: number) => void;
}

export default function LikedRoutesList({routes, likes, focusedRouteIdx, setFocusedRouteIdx}: Props) {
    const tHome = useTranslations('home');
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
        if (!likes) return [];
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
        <div className={'md:w-1/3 w-full min-w-[340px] md:h-full h-fit md:p-3 no-scrollbar '}>
            {!routes || !likes ? (
                <div className={'flex flex-col gap-4 h-full md:p-3'}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <RouteCardWidelySkeleton key={i} />
                    ))}
                </div>
            ) : (
                <>
                    {/* デスクトップ: フォーカス可能な縦スクロールリスト */}
                    <div ref={containerRef} className={'hidden md:flex flex-col gap-4 h-full overflow-y-scroll md:p-3 no-scrollbar bg-linear-to-br from-grass/60 via-grass/30 to-grass/60 backdrop-blur-md rounded-2xl border-1 border-white/20 shadow-inner'}>
                        {routes.map((route, idx) => (
                            <div key={route.id ?? idx} ref={(el) => {
                                if (el) {
                                    itemRefs.current.set(idx, el);
                                } else {
                                    itemRefs.current.delete(idx);
                                }
                            }}>
                                <RouteCardWidely route={route} isFocused={focusedRouteIdx === idx} onClick={() => setFocusedRouteIdx(idx)} isLinkCard={false}/>
                            </div>
                        ))}
                    </div>

                    {/* モバイル: いいね日ごとにグルーピングしたシンプルな縦リスト */}
                    <div className={'md:hidden flex flex-col gap-6 py-3'}>
                        {groupedByDate.map(([date, items]) => (
                            <div key={date} className={'flex flex-col gap-2'}>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-1/80 px-1">{date}</div>
                                <div className={'flex flex-col gap-3'}>
                                    {items.map((like, idx) => (
                                        <RouteCardWidely key={idx} route={like.route} isFocused={false} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
