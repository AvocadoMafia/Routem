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

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const target = container.querySelector(`[data-idx="${focusedRouteIdx}"]`) as HTMLElement | null;
        if (target) {
            target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, [focusedRouteIdx]);

    return (
        <div ref={containerRef} className={'w-1/3 min-w-[300px] h-full overflow-y-scroll bg-red-400 p-2 flex flex-col gap-3'}>
            {routes.map((route, idx) => (
                <div key={idx} data-idx={idx}>
                    <RouteCardOnLikesList route={route} myIdx={idx} focusedRouteIdx={focusedRouteIdx} onClick={() => setFocusedRouteIdx(idx)}/>
                </div>
            ))}
        </div>
    )
}
