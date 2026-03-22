import {Route} from "@/lib/types/domain";
import {useEffect, useRef} from "react";

type Props = {
    routeOnFocus: Route
    focusedRouteIdx: number
    setFocusedRouteIdx: (idx: number) => void
    routesLength: number
}



export default function FocusingRouteViewer({routeOnFocus, focusedRouteIdx, setFocusedRouteIdx, routesLength}: Props) {
    const SCROLL_THRESHOLD = 10;
    const WHEEL_COOLDOWN_MS = 300; // timeout to prevent rapid successive index changes
    const wheelTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (wheelTimeoutRef.current !== null) {
                window.clearTimeout(wheelTimeoutRef.current);
            }
        };
    }, []);

    const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
        if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;
        if (wheelTimeoutRef.current !== null) return; // still in cooldown

        if (e.deltaY > 0 && focusedRouteIdx < routesLength - 1) setFocusedRouteIdx(focusedRouteIdx + 1);
        else if (e.deltaY < 0 && focusedRouteIdx > 0) setFocusedRouteIdx(focusedRouteIdx - 1);

        wheelTimeoutRef.current = window.setTimeout(() => {
            wheelTimeoutRef.current = null;
        }, WHEEL_COOLDOWN_MS);
    }

    if(!routeOnFocus) return null;


    return (
        <div className={'flex-1 h-full bg-blue-400 overflow-hidden relative'}>
        {/*card*/}
            <div className={'aspect-video w-[95%] max-w-[900px] bg-background-0 absolute inset-0 m-auto rounded-xl p-2'}
                 onWheel={handleScroll}
            >
                <div className={'w-full h-full bg-background-1 rounded-xl'}>
                    <h2>{routeOnFocus.title}</h2>
                </div>
            </div>
        </div>
    )
}
