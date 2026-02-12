'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useAtomValue } from "jotai";
import { scrollDirectionAtom } from "@/lib/client/atoms";
import { useEffect, useState } from "react";
import { Route } from "@/lib/client/types";
import Image from "next/image";

export default function InitialModal({ route }: { route: Route }) {
    const [isVisible, setIsVisible] = useState(true);
    const scrollDirection = useAtomValue(scrollDirectionAtom);

    useEffect(() => {
        if (scrollDirection === 'down' && isVisible) {
            setIsVisible(false);
        }
    }, [scrollDirection, isVisible, setIsVisible]);

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
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={'absolute inset-0 w-full h-screen z-200 overflow-hidden'}
                >
                    {/* 背景画像 */}
                    <Image
                        src={route.thumbnail?.url || '/mockImages/Kyoto.jpg'}
                        alt={route.title}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                    />
                    {/* オーバーレイ */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* コンテンツ */}
                    <div className="relative h-full flex flex-col items-center justify-center text-white px-4 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-bold mb-6"
                        >
                            {route.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl md:text-2xl mb-8 text-gray-200"
                        >
                            by @{route.author.name}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                            className="absolute bottom-10 flex flex-col items-center gap-2"
                        >
                            <span className="text-sm font-medium tracking-widest uppercase">Scroll Down</span>
                            <div className="w-px h-12 bg-white/50" />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
