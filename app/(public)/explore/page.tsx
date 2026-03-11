"use client";


import ExploreCard from "@/app/(public)/explore/_components/templates/exploreCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";
import { Route } from "@/lib/client/types";

// モックデータ
const MOCK_ROUTES: any[] = [
    {
        id: "1",
        title: "富士山を望む絶景ドライブ",
        description: "山中湖から河口湖にかけて、富士山の絶景ポイントを巡る贅沢なドライブコースです。温泉も楽しめます。",
        authorId: "user1",
        author: {
            id: "user1",
            name: "YamaWalker",
            icon: { id: "icon1", url: "/mockImages/userIcon_1.jpg", createdAt: new Date(), updatedAt: new Date() },
        },
        thumbnail: { id: "thumb1", url: "/mockImages/mountain.jpg", createdAt: new Date(), updatedAt: new Date() },
        categoryId: "cat1",
        category: { id: "cat1", name: "Drive" },
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: [],
        views: [],
        routeNodes: [],
        visibility: "PUBLIC",
    },
    {
        id: "2",
        title: "千葉・房総の海鮮満喫ツアー",
        description: "館山で新鮮な海の幸を堪能し、夕日は野島崎灯台で。心もお腹も満たされる1日旅。",
        authorId: "user2",
        author: {
            id: "user2",
            name: "SeaLover",
            icon: { id: "icon2", url: "/mockImages/userIcon_2.jpg", createdAt: new Date(), updatedAt: new Date() },
        },
        thumbnail: { id: "thumb2", url: "/mockImages/ocean.jpg", createdAt: new Date(), updatedAt: new Date() },
        categoryId: "cat2",
        category: { id: "cat2", name: "Food" },
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: [{}, {}] as any,
        views: [{}, {}, {}, {}] as any,
        routeNodes: [],
        visibility: "PUBLIC",
    }
];

function ExploreContent() {
    const searchParams = useSearchParams();
    const hasParams = Array.from(searchParams.keys()).length > 0;

    return (
        <div className="w-full h-full relative overflow-hidden flex flex-row">
            {/* 背景画像 */}
            <AnimatePresence>
                {!hasParams && (
                    <motion.div 
                        key="background-image"
                        className="absolute inset-0 z-0"
                        initial={{ opacity: 1, y: "0%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ 
                            y: "-100%",
                            opacity: 0
                        }}
                        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    >

                        {/* クレジット */}
                        <div className="absolute bottom-12 left-12 flex items-center gap-3 group z-20">
                            <div className="w-12 h-[1px] bg-white/50 group-hover:w-20 transition-all duration-700" />
                            <span className="text-[10px] text-white/40 tracking-[0.5em] uppercase font-bold">
                                Captured by @lychee / Mt. Fuji
                            </span>
                        </div>

                        {/* 画像 */}
                        <img
                            className="w-full h-full object-cover"
                            src="/mockImages/mountain.jpg"
                            alt="background"
                        />
                        <div
                            className="absolute inset-0 z-10 pointer-events-none"
                            style={{
                                backdropFilter: "blur(6px)",
                                WebkitBackdropFilter: "blur(6px)",

                                /* 黒グラデーション（下のみ） */
                                background: `
              linear-gradient(
                to top,
                rgba(0,0,0,0.65) 0%,
                rgba(0,0,0,0.35) 25%,
                rgba(0,0,0,0.15) 40%,
                transparent 55%
              )
            `,

                                /* 🔥 上55%は完全に透明（＝ブラーなし） */
                                maskImage: `
              linear-gradient(
                to bottom,
                transparent 0%,
                transparent 55%,
                rgba(0,0,0,0.4) 70%,
                black 100%
              )
            `,
                                WebkitMaskImage: `
              linear-gradient(
                to bottom,
                transparent 0%,
                transparent 55%,
                rgba(0,0,0,0.4) 70%,
                black 100%
              )
            `,
                            }}
                        />

                    </motion.div>
                )}
            </AnimatePresence>

            {/* コンテンツレイアウト */}
            <motion.div 
                layout
                className={`relative w-full h-full flex flex-col md:flex-row ${hasParams ? 'justify-start' : 'items-center justify-center'}`}
                transition={{
                    layout: { duration: 0.8, ease: [0.32, 0.72, 0, 1] }
                }}
            >
                {/* 検索カード - layout propにより位置とサイズ変更をアニメーション化 */}
                <ExploreCard isSidebar={hasParams} />

                {/* 検索結果エリア */}
                <AnimatePresence mode="wait">
                    {hasParams && (
                        <motion.div
                            key="results-container"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.6, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                            className="flex-1 h-full p-4 md:p-12 pt-24 overflow-y-auto bg-background-0"
                        >
                            <div className="max-w-5xl mx-auto flex flex-col gap-8 md:gap-16">
                                <div className="flex flex-col gap-4 md:gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-8 md:h-10 w-1 bg-accent-0 rounded-full" />
                                        <h2 className="text-3xl md:text-5xl font-bold text-foreground-0 tracking-tight">
                                            Discovery
                                        </h2>
                                    </div>
                                    <p className="text-foreground-1 text-xs md:text-sm tracking-[0.1em] font-medium ml-5">
                                        Showing results for <span className="text-accent-0 font-bold">"{searchParams.get('where')}"</span> — {MOCK_ROUTES.length} routes found
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-6 md:gap-12 pb-24 md:pb-0">
                                    {MOCK_ROUTES.map((route, index) => (
                                        <motion.div
                                            key={route.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + (index * 0.1), duration: 0.6, ease: "easeOut" }}
                                        >
                                            <RouteCardBasic route={route} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExploreContent />
        </Suspense>
    );
}