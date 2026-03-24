import FocusingRouteViewer from "@/app/(public)/_components/(likes)/templates/focusingRouteViewer";
import LikedRoutesList from "@/app/(public)/_components/(likes)/templates/likedRoutesList";
import {useEffect, useState, useRef} from "react";
import {getDataFromServerWithJson} from "@/lib/client/helpers";
import {Route} from "@/lib/types/domain";
import {AnimatePresence, motion} from "framer-motion";
import Image from "next/image";

export default function LikesSection() {

    type LikeRecord = { id: string; createdAt: string; route: Route }

    const [likes, setLikes] = useState<LikeRecord[]>([]);
    const routes: Route[] = likes.map(l => l.route);

    const [focusedRouteIdx, setFocusedRouteIdx] = useState<number>(0);
    const prevIndexRef = useRef<number>(0);


    useEffect(() => {
        getDataFromServerWithJson<LikeRecord[]>('/api/v1/likes?route=true&take=30').then(
            (items) => setLikes((items || []).filter((it: any) => it.route))
        )
    }, [])

    useEffect(() => {
        prevIndexRef.current = focusedRouteIdx;
    }, [focusedRouteIdx]);

    const routeOnFocus = routes[focusedRouteIdx];
    const direction = focusedRouteIdx > prevIndexRef.current ? 'up' : 'down';


    return (
        <div className={'w-full h-full flex flex-row relative overflow-hidden'}>
            {/* 全面背景装飾 */}
            <AnimatePresence custom={direction} initial={false}>
                <motion.div
                    key={focusedRouteIdx}
                    custom={direction}
                    variants={{
                        enter: { opacity: 0 },
                        center: { opacity: 1 },
                        exit: { opacity: 0 },
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-0 overflow-hidden pointer-events-none md:block hidden"
                >
                    {routeOnFocus && (
                        <Image
                            src={routeOnFocus.thumbnail?.url ?? '/mockImages/Fuji.jpg'}
                            alt=""
                            fill
                            className="object-cover blur-sm opacity-50 scale-110"
                            unoptimized
                        />
                    )}
                </motion.div>
            </AnimatePresence>
            
            <div className="fixed inset-0 bg-black/50 pointer-events-none z-1 md:block hidden" />

            <div className="relative z-10 w-full h-full flex flex-row">
                <LikedRoutesList routes={routes} likes={likes} setFocusedRouteIdx={setFocusedRouteIdx} focusedRouteIdx={focusedRouteIdx}/>
                <div className="flex-1 h-full relative md:block hidden">
                    <FocusingRouteViewer routeOnFocus={routeOnFocus} focusedRouteIdx={focusedRouteIdx} setFocusedRouteIdx={setFocusedRouteIdx} routesLength={routes.length}/>
                </div>
            </div>
        </div>
    )
}
