"use client";

import { userStore } from "@/lib/client/stores/userStore";
import { useRouter } from "next/navigation";
import Footer from "@/app/[locale]/_components/layout/templates/footer";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AboutForeground() {
    const user = userStore(store => store.user);
    const isLoggedIn = user && user.id !== '';
    const router = useRouter();
    const t = useTranslations('about');
    const tAuth = useTranslations('auth');
    const tFooter = useTranslations('footer');

    return (
        <div className={'absolute w-full h-fit z-[10]'}>
            <section className={'w-full h-screen grid grid-rows-2 grid-cols-1'}>
                <div className={'flex justify-start items-start p-16'}>
                    <h1 className={'w-fit text-8xl font-bold tracking-wide font-syne'}><span className={'text-accent-0'}>誰か</span>の旅を、<br/>あなたの旅に。</h1>
                </div>
                <div className={'flex justify-end items-end p-16'}>
                    <h1 className={'w-fit text-8xl font-bold tracking-wide font-syne'}><span className={'text-accent-1'}>あなた</span>の旅を、<br/>誰かの旅に。</h1>
                </div>
            </section>


            <section className={'w-full h-fit bg-background-0/75 backdrop-blur-sm flex justify-center relative @container'}>
                <img className={'w-full object-cover'} src={'/lp/map.svg'}/>
                <img className={'absolute w-[6cqw] top-[14cqw] left-[16cqw]'} src={'/lp/pinBig.svg'}/>
                <img className={'absolute w-[6cqw] top-[9.5cqw] left-[53.8cqw]'} src={'/lp/pinBig.svg'}/>
            </section>


            <section className={'w-full h-fit p-12 bg-foreground-1/15 backdrop-blur-sm flex justify-center'}>
                <div className={'w-full max-w-[1000px] h-fit flex flex-col gap-6'}>
                    <h2 className={'text-5xl text-foreground-0 text-center font-bold leading-relaxed border-y border-foreground-0/30 w-full py-3'}>{t('stepsTitle')}</h2>
                    <div className={'w-full h-fit grid grid-cols-4'}>
                        <div className={'w-full flex flex-col gap-3 p-6 border-r border-foreground-0/30'}>
                            <p className={'text-accent-0'}>{t('step1')}</p>
                            <p className={'text-foreground-0 text-xl font-semibold'}>{t('step1Title')}</p>
                            <p className={'text-foreground-1 text-md'}>{t('step1Desc')}</p>
                        </div>
                        <div className={'w-full flex flex-col gap-3 p-6 border-r border-foreground-0/30'}>
                            <p className={'text-accent-0'}>{t('step2')}</p>
                            <p className={'text-foreground-0 text-xl font-semibold'}>{t('step2Title')}</p>
                            <p className={'text-foreground-1 text-md'}>{t('step2Desc')}</p>
                        </div>
                        <div className={'w-full flex flex-col gap-3 p-6 border-r border-foreground-0/30'}>
                            <p className={'text-accent-0'}>{t('step3')}</p>
                            <p className={'text-foreground-0 text-xl font-semibold'}>{t('step3Title')}</p>
                            <p className={'text-foreground-1 text-md'}>{t('step3Desc')}</p>
                        </div>
                        <div className={'w-full flex flex-col gap-3 p-6'}>
                            <p className={'text-accent-0'}>{t('step4')}</p>
                            <p className={'text-foreground-0 text-xl font-semibold'}>{t('step4Title')}</p>
                            <p className={'text-foreground-1 text-md'}>{t('step4Desc')}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={'w-full h-fit p-12 bg-background-0/75 backdrop-blur-sm flex justify-center'}>
                <div className={'w-full max-w-[1000px] h-fit grid grid-cols-2 rounded-lg border-1 border-foreground-0/30 overflow-hidden'}>
                    <div className={'w-full h-[400px] p-6 bg-foreground-0/15 flex flex-col justify-between gap-3'}>
                        <p className={'w-fit h-fit text-foreground-0/30'}>{t('readerA')}</p>
                        <div className={'w-full h-fit flex flex-col gap-3'}>
                            <h2 className={'text-foreground-0/30 text-6xl font-syne font-extrabold'}>{t('reader20s')}</h2>
                            <p className={'text-foreground-0 text-2xl font-syne font-semibold'}>{t('reader20sTitle')}</p>
                            <p className={'text-foreground-1 text-sm'}>{t('reader20sDesc')}</p>
                        </div>
                        <p className={'w-full h-fit border-t border-foreground-0/30 text-foreground-0 py-3 italic'}>{t('reader20sQuote')}</p>
                    </div>
                    <div className={'w-full h-[400px] p-6 flex flex-col justify-between gap-3'}>
                        <p className={'w-fit h-fit text-foreground-0/30'}>{t('readerB')}</p>
                        <div className={'w-full h-fit flex flex-col gap-3'}>
                            <h2 className={'text-foreground-0/30 text-6xl font-syne font-extrabold'}>{t('readerIn')}</h2>
                            <p className={'text-foreground-0 text-2xl font-syne font-semibold'}>{t('readerInTitle')}</p>
                            <p className={'text-foreground-1 text-sm'}>{t('readerInDesc')}</p>
                        </div>
                        <p className={'w-full h-fit border-t border-foreground-0/30 text-foreground-0 py-3 italic'}>{t('readerInQuote')}</p>
                    </div>
                </div>
            </section>
            <section className={'w-full h-fit flex flex-col'}>
                <div className={'w-full theme-reversed bg-background-0 flex justify-center'}>
                    <div className={'w-full max-w-[1000px] py-16 grid grid-cols-3'}>
                        <div className={'w-full h-fit flex flex-col gap-3 border-r border-foreground-0/30 p-3'}>
                            <h2 className={'text-3xl font-syne font-extrabold text-foreground-0'}>2026.04</h2>
                            <p className={'text-foreground-1'}>{t('launchDate')}</p>
                        </div>
                        <div className={'w-full h-fit flex flex-col gap-3 border-r border-foreground-0/30 p-3'}>
                            <h2 className={'text-3xl font-syne font-extrabold text-foreground-0'}>Web+App</h2>
                            <p className={'text-foreground-1'}>{t('platforms')}</p>
                        </div>
                        <div className={'w-full h-fit flex flex-col gap-3 border-foreground-0/30 p-3'}>
                            <h2 className={'text-3xl font-syne font-extrabold text-foreground-0'}>4</h2>
                            <p className={'text-foreground-1'}>{t('languages')}</p>
                        </div>
                    </div>
                </div>
                <div className={'w-full bg-background-0 flex justify-center'}>
                    <div className={'w-full max-w-[1000px] py-16 flex flex-col items-center gap-6'}>
                        <p className={'text-foreground-1 text-sm'}>― {t('endMatter')} ―</p>
                        <h2 className={'text-6xl font-syne font-extrabold text-foreground-0 pl-6'}>{t('startNow')}</h2>
                        <div className={'w-20 h-1 bg-accent-0 rounded-full'} />
                        <p className={'text-foreground-1 italic'}>{tFooter('tagline')}</p>
                        <div className={'flex gap-4 mt-6'}>
                            {isLoggedIn ? (
                                <>
                                    <motion.button
                                        onClick={() => router.push('/articles/new')}
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
            </section>
            <Footer />
        </div>
    )
}
