'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { scrollDirectionAtom } from "@/lib/client/atoms";
import { useEffect, useState } from "react";
import { Route } from "@/lib/client/types";
import Image from "next/image";

export default function InitialModal({ route }: { route: Route }) {
    const [isVisible, setIsVisible] = useState(true);
    const [canClose, setCanClose] = useState(false);
    const [scrollDirection, setScrollDirection] = useAtom(scrollDirectionAtom);

    useEffect(() => {
        // マウント時にスクロール方向をリセット
        setScrollDirection('up');

        // マウント時に少し待ってからスクロール検知を開始する
        // または、マウント直後の scrollDirection === 'down' を無視する
        const timer = setTimeout(() => {
            setCanClose(true);
        }, 500); // 500ms程度に短縮（リセットしているのでこれくらいで十分なはず）
        return () => clearTimeout(timer);
    }, [setScrollDirection]);

    useEffect(() => {
        if (canClose && scrollDirection === 'down' && isVisible) {
            setIsVisible(false);
        }
    }, [scrollDirection, isVisible, canClose]);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
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
                        <Image
                            src={route.thumbnail?.url || '/mockImages/Kyoto.jpg'}
                            alt={route.title}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
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
                            <span className="inline-block px-3 py-1 mb-8 border border-white/20 rounded-sm text-[10px] font-medium tracking-[0.4em] uppercase backdrop-blur-md">
                                {route.category?.name || "Travel Route"}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-10 tracking-[0.1em] leading-tight uppercase">
                                {route.title}
                            </h1>
                            <div className="flex items-center justify-center gap-6">
                                <div className="h-px w-12 bg-white/20" />
                                <p className="text-sm md:text-base font-normal tracking-widest text-white/80 uppercase">
                                    Curated by {route.author.name}
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
                            <span className="text-[9px] font-medium tracking-[0.5em] uppercase text-white/40">Discover</span>
                            <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
