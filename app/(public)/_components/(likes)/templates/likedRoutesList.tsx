import RouteCardOnLikesList from "@/app/(public)/_components/(likes)/ingredients/routeCardOnLikesList";
import {Route} from "@/lib/types/domain";
import {useEffect, useRef} from "react";

type Props = {
    routes: Route[]
    focusedRouteIdx: number;
    setFocusedRouteIdx: (idx: number) => void;
}

export default function LikedRoutesList({routes, focusedRouteIdx, setFocusedRouteIdx}: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const target = itemRefs.current.get(focusedRouteIdx);
        if (target) {
            const containerHeight = container.clientHeight;
            const targetHeight = target.offsetHeight;
            const targetTop = target.offsetTop;
            const scrollTop = targetTop - (containerHeight / 2) + (targetHeight / 2);

            // Using requestAnimationFrame to ensure the DOM is stable before scrolling
            requestAnimationFrame(() => {
                container.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
            });
        }
    }, [focusedRouteIdx]);

    return (
        <div ref={containerRef} className={'w-1/3 min-w-[340px] h-full overflow-y-scroll p-4 flex flex-col gap-4 no-scrollbar backdrop-blur-sm'}>
            {routes.map((route, idx) => (
                <div key={idx} ref={(el) => {
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
    )
}
