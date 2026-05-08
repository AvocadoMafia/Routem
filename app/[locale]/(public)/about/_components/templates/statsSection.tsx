"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function StatsSection() {
    const t = useTranslations('about');

    return (
        <div className="w-full flex justify-center bg-background-0">
            <motion.div
                className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-3 border-t border-grass"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="flex flex-col gap-2 px-6 md:px-16 py-12 border-b md:border-b-0 md:border-r border-grass">
                    <p className="text-accent-0 text-4xl xl:text-5xl lg:text-3xl md:text-2xl font-syne font-black tracking-tight">
                        2026.04
                    </p>
                    <p className="text-foreground-1 text-sm">{t('launchDate')}</p>
                </div>
                <div className="flex flex-col gap-2 px-6 md:px-16 py-12 border-b md:border-b-0 md:border-r border-grass">
                    <p className="text-accent-1 text-4xl xl:text-5xl lg:text-3xl md:text-2xl font-syne font-black tracking-tight">
                        {t('mapSns')}
                    </p>
                    <p className="text-foreground-1 text-sm">{t('connectPosts')}</p>
                </div>
                <div className="flex flex-col gap-2 px-6 md:px-16 py-12">
                    <p className="text-foreground-0 text-4xl xl:text-5xl lg:text-3xl md:text-2xl font-syne font-black tracking-tight">
                        4 Lang
                    </p>
                    <p className="text-foreground-1 text-sm">{t('languagesDesc')}</p>
                </div>
            </motion.div>
        </div>
    );
}
