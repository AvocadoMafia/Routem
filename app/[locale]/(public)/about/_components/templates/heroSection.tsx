"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const images = [
    "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/lp%2FLP1.webp",
    "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/lp%2FLP2.webp",
    "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/lp%2FLP3.webp",
    "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/lp%2FLP4.webp",
    "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/lp%2FLP5.webp",
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
    const t = useTranslations('about');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative w-full h-screen overflow-hidden">
            {/* Background: horizontal slide */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence initial={false}>
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>
                {/* Directional overlays: darken the two corners where text sits */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/15 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tl from-black/70 via-black/15 to-transparent" />
            </div>

            {/* Center divider */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-white/10 z-10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 w-full h-full grid grid-rows-2">

                {/* Top half — left-aligned */}
                <div className="flex justify-start items-start p-8 md:p-14">
                    <motion.h1
                        className="font-black font-syne tracking-tighter leading-[1.0] text-white lg:text-8xl md:text-6xl text-4xl"
                        initial={{ opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.1 }}
                    >
                        {t.rich('heroLine1a', {
                            accent: (chunks) => <span className="text-accent-0">{chunks}</span>,
                        })}
                        <br />
                        {t('heroLine1b')}
                    </motion.h1>
                </div>

                {/* Bottom half — right-aligned */}
                <div className="flex justify-end items-end p-8 md:p-14">
                    <motion.h1
                        className="font-black font-syne tracking-tighter leading-[1.0] text-white lg:text-8xl md:text-6xl text-4xl text-right"
                        initial={{ opacity: 0, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease, delay: 0.25 }}
                    >
                        {t.rich('heroLine2a', {
                            accent: (chunks) => <span className="text-accent-1">{chunks}</span>,
                        })}
                        <br />
                        {t('heroLine2b')}
                    </motion.h1>
                </div>
            </div>
        </section>
    );
}
