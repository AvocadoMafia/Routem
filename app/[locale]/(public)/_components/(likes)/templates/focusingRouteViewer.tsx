"use client";

import {Route} from "@/lib/types/domain";
import {useEffect, useRef} from "react";
import {AnimatePresence, motion} from "framer-motion";
import Image from "next/image";
import {HiHeart, HiEye, HiUsers, HiCurrencyDollar, HiArrowRight} from "react-icons/hi2";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Props = {
    routeOnFocus: Route
    focusedRouteIdx: number
    setFocusedRouteIdx: (idx: number) => void
    routesLength: number
}



export default function FocusingRouteViewer({routeOnFocus, focusedRouteIdx, setFocusedRouteIdx, routesLength}: Props) {
    const prevIndexRef = useRef<number>(0);
    const t = useTranslations('common');
    const tRoutes = useTranslations('routes');
    const SCROLL_THRESHOLD = 10;
    const WHEEL_COOLDOWN_MS = 150; // timeout to prevent rapid successive index changes
    const wheelTimeoutRef = useRef<number | null>(null);


    const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
        if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return;
        if (wheelTimeoutRef.current !== null) return; // still in cooldown

        if (e.deltaY > 0 && focusedRouteIdx < routesLength - 1) setFocusedRouteIdx(focusedRouteIdx + 1);
        else if (e.deltaY < 0 && focusedRouteIdx > 0) setFocusedRouteIdx(focusedRouteIdx - 1);

        wheelTimeoutRef.current = window.setTimeout(() => {
            wheelTimeoutRef.current = null;
        }, WHEEL_COOLDOWN_MS);
    }


    useEffect(() => {
        return () => {
            if (wheelTimeoutRef.current !== null) {
                window.clearTimeout(wheelTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        prevIndexRef.current = focusedRouteIdx;
    }, [focusedRouteIdx]);

    //animate direction
    const direction = focusedRouteIdx > prevIndexRef.current ? 'up' : 'down';

    if(!routeOnFocus) return null;


    return (
        <div className="flex-1 h-full overflow-hidden relative flex items-center justify-center">
            <AnimatePresence custom={direction}>
                <motion.div
                    className="aspect-video w-[85%] max-w-[850px] h-auto max-h-[85%] bg-background-0 absolute inset-0 m-auto rounded-3xl p-1.5 overflow-hidden shadow-2xl"
                    onWheel={handleScroll}
                    key={focusedRouteIdx}
                    initial={{
                        y: direction === 'up' ? 600 : -600,
                        opacity: 0,
                        position: "absolute" as const,
                    }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        position: "absolute" as const,
                    }}
                    exit={{
                        y: direction === 'up' ? -600 : 600,
                        opacity: 0,
                        position: "absolute" as const,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="w-full h-full bg-background-1 rounded-[1.25rem] relative overflow-hidden flex flex-row">
                        {/* メイン画像セクション */}
                        <div className="relative w-[55%] h-full shrink-0">
                            <Image
                                src={routeOnFocus.thumbnail?.url ?? '/mockImages/Fuji.jpg'}
                                alt={routeOnFocus.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            {/* グラデーションオーバーレイ */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            
                            <div className="absolute bottom-8 left-8 right-8 z-10">
                                <h2 className="text-3xl font-bold text-white drop-shadow-md leading-tight">
                                    {routeOnFocus.title}
                                </h2>
                            </div>
                        </div>

                        {/* 詳細情報セクション */}
                        <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
                            <div className="flex flex-col gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-background-0 shadow-md">
                                        <Image
                                            src={routeOnFocus.author.icon?.url || "/mockImages/userIcon_2.jpg"}
                                            alt={routeOnFocus.author.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-foreground-0">{routeOnFocus.author.name}</span>
                                        <div className="flex items-center gap-4 mt-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <HiHeart className="w-4 h-4 text-accent-0" />
                                                <span className="text-xs font-bold text-foreground-1">{routeOnFocus.likes?.length ?? 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <HiEye className="w-4 h-4 text-accent-0" />
                                                <span className="text-xs font-bold text-foreground-1">{routeOnFocus.views?.length ?? 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1.5 bg-background-0 rounded-lg flex items-center gap-2 border border-background-2/50">
                                            <HiUsers className="w-4 h-4 text-foreground-1" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-0">{routeOnFocus.routeFor || t('everyone')}</span>
                                        </div>
                                        <div className="px-3 py-1.5 bg-background-0 rounded-lg flex items-center gap-2 border border-background-2/50">
                                            <HiCurrencyDollar className="w-4 h-4 text-foreground-1" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-0">
                                                {routeOnFocus.budget ? `${routeOnFocus.budget.amount.toLocaleString()} ${routeOnFocus.budget.currency}` : t('flexible')}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-foreground-1 text-sm leading-relaxed line-clamp-4">
                                        "{routeOnFocus.description || tRoutes('noDescription')}"
                                    </p>
                                </div>
                            </div>
                            
                            <Link 
                                href={`/routes/${routeOnFocus.id}`}
                                className="w-full mt-6 py-3.5 bg-accent-0 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-accent-1 transition-all shadow-lg shadow-accent-0/20 hover:shadow-accent-0/30 active:scale-[0.98]"
                            >
                                {tRoutes('viewDetailedRoute')} <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
