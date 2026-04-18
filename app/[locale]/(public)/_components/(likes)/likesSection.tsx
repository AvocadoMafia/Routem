import FocusingRouteViewer from "@/app/[locale]/(public)/_components/(likes)/templates/focusingRouteViewer";
import LikedRoutesList from "@/app/[locale]/(public)/_components/(likes)/templates/likedRoutesList";
import SectionErrorState from "@/app/[locale]/_components/common/ingredients/sectionErrorState";
import {useEffect, useRef, useState} from "react";
import {getDataFromServerWithJson} from "@/lib/client/helpers";
import {Route} from "@/lib/types/domain";
import {AnimatePresence, motion} from "framer-motion";
import Image from "next/image";
import FuckingSquid from "@/app/[locale]/_components/common/ingredients/fuckingSquid";
import {HiHeart} from "react-icons/hi2";
import {CursorResponse, useInfiniteScroll} from "@/lib/client/hooks/useInfiniteScroll";

type LikeRecord = { id: string; createdAt: string; route: Route }

export default function LikesSection() {

    const { items: likes, error, retry } = useInfiniteScroll<LikeRecord>({
        fetcher: (cursor) => {
            const url = `/api/v1/likes?route=true&take=30${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
            return getDataFromServerWithJson<CursorResponse<LikeRecord>>(url);
        },
    });

    const routes: Route[] = (likes ?? []).map(l => l.route).filter(Boolean);

    const [focusedRouteIdx, setFocusedRouteIdx] = useState<number>(0);
    const prevIndexRef = useRef<number>(0);

    useEffect(() => {
        prevIndexRef.current = focusedRouteIdx;
    }, [focusedRouteIdx]);

    const routeOnFocus = routes[focusedRouteIdx];
    const direction = focusedRouteIdx > prevIndexRef.current ? 'up' : 'down';

    // --- error: いいね一覧が取れなかった ---
    if (error && (!likes || likes.length === 0)) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-4">
                <div className="w-full md:hidden absolute top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 px-2 py-3 flex items-center gap-2">
                    <HiHeart className="text-accent-0 w-5 h-5" />
                    <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">Likes</h1>
                </div>
                <div className="w-full max-w-md">
                    <SectionErrorState error={error} onRetry={retry}/>
                </div>
            </div>
        )
    }

    if (likes !== null && likes.length === 0) return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative">
            <div className="w-full md:hidden absolute top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 px-2 py-3 flex items-center gap-2">
                <HiHeart className="text-accent-0 w-5 h-5" />
                <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">Likes</h1>
            </div>
            <FuckingSquid className={'w-[300px] h-[300px] text-foreground-1'}/>
            <h2 className={'text-foreground-0 font-bold uppercase text-xl'}>NO LIKED ROUTES FOUND.</h2>
            <p className={'text-foreground-1'}>You haven't liked any routes yet, right?</p>
        </div>
    )

    return (
        <div className={'w-full md:h-full h-fit flex flex-row relative md:overflow-hidden'}>
            {/* 全面背景装飾 */}
            <AnimatePresence custom={direction} initial={false}>
                <motion.div
                    key={focusedRouteIdx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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

            <div className="relative z-10 w-full md:h-full h-fit flex flex-row">
                <LikedRoutesList routes={likes ? routes : undefined} likes={likes ?? undefined} setFocusedRouteIdx={setFocusedRouteIdx} focusedRouteIdx={focusedRouteIdx}/>
                <div className="flex-1 h-full relative md:block hidden">
                    <FocusingRouteViewer routeOnFocus={routeOnFocus} focusedRouteIdx={focusedRouteIdx} setFocusedRouteIdx={setFocusedRouteIdx} routesLength={routes.length}/>
                </div>
            </div>
        </div>
    )
}
