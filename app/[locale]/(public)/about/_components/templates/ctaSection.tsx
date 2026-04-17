"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { userStore } from "@/lib/client/stores/userStore";

export default function CTASection() {
    const user = userStore(store => store.user);
    const isLoggedIn = user && user.id !== '';
    const router = useRouter();
    const t = useTranslations('about');
    const tFooter = useTranslations('footer');

    return (
        <div className={'w-full bg-background-0 flex justify-center'}>
            <div className={'w-full max-w-[1000px] py-16 px-6 flex flex-col items-center gap-6 text-center'}>
                <p className={'text-foreground-1 text-sm'}>― {t('endMatter')} ―</p>
                <h2 className={'text-4xl md:text-6xl font-syne font-extrabold text-foreground-0'}>{t('startNow')}</h2>
                <div className={'w-20 h-1 bg-accent-0 rounded-full'} />
                <p className={'text-foreground-1 italic'}>{tFooter('tagline')}</p>
                <div className={'flex flex-col md:flex-row gap-4 mt-6 w-full md:w-auto'}>
                    {isLoggedIn ? (
                        <>
                            <motion.button
                                onClick={() => router.push('/routes/new')}
                                className={'bg-accent-0 text-white py-3 px-8 rounded-lg font-bold hover:opacity-90 transition-opacity cursor-pointer'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t('createRoute')}
                            </motion.button>
                            <motion.button
                                onClick={() => router.push('/explore')}
                                className={'bg-background-1 text-foreground-0 py-3 px-8 border border-grass rounded-lg font-bold hover:bg-grass transition-colors cursor-pointer'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t('exploreRoutes')}
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <motion.button
                                onClick={() => router.push('/login')}
                                className={'bg-accent-0 text-white py-3 px-8 rounded-lg font-bold hover:opacity-90 transition-opacity cursor-pointer'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t('login')}
                            </motion.button>
                            <motion.button
                                onClick={() => router.push('/explore')}
                                className={'bg-background-1 text-foreground-0 py-3 px-8 border border-grass rounded-lg font-bold hover:bg-grass transition-colors cursor-pointer'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t('exploreRoutes')}
                            </motion.button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
