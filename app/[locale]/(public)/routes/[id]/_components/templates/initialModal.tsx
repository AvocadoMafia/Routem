'use client'

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Route } from "@/lib/types/domain";
import Image from "next/image";
import { useInitialModal } from "../hooks/useInitialModal";
import { useTranslations } from "next-intl";

export default function InitialModal({ route }: { route: Route }) {
    const t = useTranslations('routes');
    const { isVisible } = useInitialModal();
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <AnimatePresence>
            {isVisible && (
                <Suspense fallback={<div className="absolute inset-0 bg-neutral-950 z-200" />}>
                    <motion.div
                        initial={{ y: 0 }}
                    animate={{ y: 0 }}
                    exit={{ 
                        y: '-100%',
                        transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className={'absolute inset-0 w-full h-screen z-200 overflow-hidden'}
                >
                    {/* 背景画像 */}
                    <motion.div 
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        {/* 読み込み中のプレースホルダー */}
                        {!isImageLoaded && (
                            <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
                        )}
                        <Image
                            src={route.thumbnail?.url || 'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp'}
                            alt={route.title}
                            fill
                            className={`object-cover transition-opacity duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            priority
                            unoptimized
                            onLoad={() => setIsImageLoaded(true)}
                        />
                    </motion.div>
                    
                    {/* オーバーレイ - より洗練されたグラデーション */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 backdrop-blur-[2px]" />

                    {/* コンテンツ */}
                    <div className="relative h-full flex flex-col items-center justify-center text-white px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-4xl"
                        >
                            <span className="inline-block px-3 py-1 mb-8 border border-white/20 rounded-sm text-[10px] font-bold tracking-[0.4em] uppercase backdrop-blur-md">
                                {route.routeFor || "EVERYONE"}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-10 tracking-[0.1em] leading-tight uppercase">
                                {route.title}
                            </h1>
                            <div className="flex items-center justify-center gap-6">
                                <div className="h-px w-12 bg-white/20" />
                                <p className="text-[10px] font-bold tracking-[0.3em] text-white/80 uppercase">
                                    {t('createdBy', { name: route.author.name })}
                                </p>
                                <div className="h-px w-12 bg-white/20" />
                            </div>
                        </motion.div>

                        {/* Scroll Down Indicator - よりミニマルに */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="absolute bottom-16 flex flex-col items-center gap-6"
                        >
                            <span className="text-[9px] font-medium tracking-[0.5em] uppercase text-white/40">{t('discover')}</span>
                            <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
                        </motion.div>
                    </div>
                </motion.div>
                </Suspense>
            )}
        </AnimatePresence>
    )
}
