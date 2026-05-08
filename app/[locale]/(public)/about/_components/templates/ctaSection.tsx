"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { userStore } from "@/lib/stores/userStore";

export default function CTASection() {
    const user = userStore(store => store.user);
    const isLoggedIn = user && user.id !== '';
    const router = useRouter();
    const t = useTranslations('about');

    return (
        <div className="theme-reversed w-full bg-background-0 flex justify-center">
            <motion.div
                className="w-full max-w-[1200px] px-6 md:px-16 py-24 flex flex-col items-start gap-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="flex flex-col gap-5">
                    <span className="text-foreground-1/40 text-[11px] font-mono uppercase tracking-[0.14em]">
                        ― {t('endMatter')} ―
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground-0 font-syne leading-[1.0] tracking-tight">
                        {t('startNow')}
                    </h2>
                    <div className="w-16 h-0.5 bg-accent-0 rounded-full" />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {isLoggedIn ? (
                        <>
                            <motion.button
                                onClick={() => router.push('/routes/new')}
                                className="bg-accent-0 text-white py-3 px-8 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {t('createRoute')}
                            </motion.button>
                            <motion.button
                                onClick={() => router.push('/explore')}
                                className="bg-transparent text-foreground-0 py-3 px-8 border border-grass rounded-lg font-bold text-sm hover:bg-grass/30 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {t('exploreRoutes')}
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <motion.button
                                onClick={() => router.push('/login')}
                                className="bg-accent-0 text-white py-3 px-8 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {t('login')}
                            </motion.button>
                            <motion.button
                                onClick={() => router.push('/explore')}
                                className="bg-transparent text-foreground-0 py-3 px-8 border border-grass rounded-lg font-bold text-sm hover:bg-grass/30 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {t('exploreRoutes')}
                            </motion.button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
