import FocusingRouteViewer from "@/app/[locale]/(public)/_components/(likes)/templates/focusingRouteViewer";
import LikedRoutesList from "@/app/[locale]/(public)/_components/(likes)/templates/likedRoutesList";
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {getDataFromServerWithJson} from "@/lib/api/client";
import {Route} from "@/lib/types/domain";
import {AnimatePresence, motion} from "framer-motion";
import Image from "next/image";
import FuckingSquid from "@/app/[locale]/_components/common/ingredients/fuckingSquid";
import {HiHeart} from "react-icons/hi2";
import {CursorResponse, useInfiniteScroll} from "@/lib/hooks/useInfiniteScroll";

type LikeRecord = { id: string; createdAt: string; route: Route }

export default function LikesSection() {
    const tHome = useTranslations('home');
    const tProfile = useTranslations('profile');

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

    const isEmpty = likes !== null && likes.length === 0;

    return (
        <div className="w-full h-full md:h-full h-fit flex flex-col md:flex-row relative">
            {/* Mobile Header (Fixed) */}
            <div className="md:hidden sticky top-0 z-30 bg-background-1/80 backdrop-blur-sm border-b border-grass/30 px-2 py-3 flex items-center gap-2 w-full">
                <span className="text-accent-0 w-5 h-5 flex items-center justify-center"><HiHeart className="w-5 h-5" /></span>
                <h1 className="text-base font-black tracking-[0.2em] uppercase text-foreground-0">{tHome('likes')}</h1>
            </div>

            {isEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <FuckingSquid className={'w-[300px] h-[300px] text-foreground-1'}/>
                    <h2 className={'text-foreground-0 font-bold uppercase text-xl'}>{tProfile('noLikedRoutesTitle')}</h2>
                    <p className={'text-foreground-1'}>{tProfile('noLikedRoutesDesc')}</p>
                </div>
            ) : (
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
                                    src={routeOnFocus.thumbnail?.url ?? 'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp'}
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
            )}
        </div>
    )
}
