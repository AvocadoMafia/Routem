"use client";

import { userStore } from "@/lib/client/stores/userStore";
import { useRouter } from "next/navigation";
import Footer from "@/app/_components/layout/templates/footer";
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
            <section className={'w-full h-screen flex justify-center py-4'}>
                <div className={'flex flex-col items-center'}>
                    <h1 className={'md:text-[5vw] text-2xl font-syne font-extrabold text-foreground-0'}>{t('planTogether')}</h1>
                    <h1 className={'md:text-[5vw] text-2xl font-syne font-extrabold text-accent-0'}>{t('travelSmarter')}</h1>
                </div>
            </section>
            <section className={'w-full h-fit p-12 bg-background-0/75 backdrop-blur-sm flex justify-center'}>
                <div className={'w-full max-w-[1000px] flex flex-col gap-12 border-t-1 border-foreground-1/60 py-6'}>
                    <p className={'h-fit text-2xl text-foreground-1'}>{t('heroQuote')}</p>
                    <div className={'w-full h-fit flex gap-12'}>
                        <ul className={'w-fit h-fit'}>
                            <li className={'px-3 py-6 border-t-1 border-foreground-0/30 flex gap-6 items-center'}>
                                <span className={'text-4xl font-syne font-extrabold text-foreground-1'}>{t('languages')}</span>
                                <span className={'text-lg text-foreground-1/60'}>{t('languagesDesc')}</span>
                            </li>
                            <li className={'px-3 py-6 border-t-1 border-foreground-0/30 flex gap-6 items-center'}>
                                <span className={'text-4xl font-syne font-extrabold text-foreground-1'}>Web + App</span>
                                <span className={'text-lg text-foreground-1/60'}>{t('platforms')}</span>
                            </li>
                            <li className={'px-3 py-6 border-t-1 border-foreground-0/30 flex gap-6 items-center'}>
                                <span className={'text-4xl font-syne font-extrabold text-foreground-1'}>{t('mapSns')}</span>
                                <span className={'text-lg text-foreground-1/60'}>{t('connectPosts')}</span>
                            </li>
                        </ul>
                        <div className={'flex-1 h-fit flex flex-col gap-3'}>
                            <span className={'text-foreground-1/60 text-sm italic'}>{t('aboutRoutem')}</span>
                            <p className={'text-foreground-1'}>{t('aboutDescription')}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={'w-full h-fit p-12 bg-background-0 flex justify-center'}>
                <div className={'w-full max-w-[1000px] flex flex-col gap-12'}>
                    <h2 className={'px-3 py-2 border-l-4 border-accent-0 text-4xl font-bold text-foreground-0'}>{t('problemTitle')}</h2>
                    <div className={'w-full h-fit grid grid-cols-2 gap-12'}>
                        <p className={'text-foreground-1'}>{t('problemDesc1')}</p>
                        <p className={'text-foreground-1'}>{t('problemDesc2')}</p>
                    </div>
                    <div className={'w-full h-fit grid grid-cols-2 gap-12 border-t-1 border-foreground-0/30'}>
                        <div className={'p-3 flex flex-col gap-3'}>
                            <span className={'text-sm text-foreground-1/60'}>{t('editorsNote')}</span>
                            <div className={'bg-foreground-1/15 w-full h-fit p-6 rounded-xl flex flex-col gap-3'}>
                                <span className={'font-syne text-4xl font-extrabold text-foreground-1/30'}>{t('statPercent')}</span>
                                <p className={'text-foreground-1/60 text-sm'}>{t('statDesc')}</p>
                            </div>
                        </div>
                        <div className={'p-3 flex flex-col gap-3'}>
                            <span className={'text-sm text-foreground-1/60'}>{t('solution')}</span>
                            <p className={'text-foreground-0 text-lg font-bold'}>{t('solutionTitle')}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={'w-full h-fit flex flex-col'}>
                <div className={'w-full h-fit flex justify-center bg-accent-0 py-12'}>
                    <div className={'w-full max-w-[1000px] h-fit flex gap-12'}>
                        <h2 className={'text-5xl text-white font-bold leading-relaxed'}>{t('featureTitle')}</h2>
                        <div className={'flex-1 border-l-1 border-white/50 p-6'}>
                            <p className={'text-white/75 leading-relaxed'}>{t('featureDesc')}</p>
                        </div>
                    </div>
                </div>
                <div className={'w-full h-fit flex justify-center bg-background-0/75 backdrop-blur-sm'}>
                    <ul className={'w-full max-w-[1000px] h-fit space-y-3 py-6'}>
                        <li className={'w-full max-w-[1000px] h-32 flex gap-12 p-6 border-t-1 border-foreground-0/30'}>
                            <p className={'w-32 h-fit text-accent-0 tracking-widest'}>{t('routeCreation')}</p>
                            <p className={'w-48 h-fit text-2xl text-foreground-0 font-semibold'}>{t('routeCreationTitle')}</p>
                            <p className={'flex-1 h-fit text-foreground-1'}>{t('routeCreationDesc')}</p>
                        </li>
                        <li className={'w-full max-w-[1000px] h-32 flex gap-12 p-6 border-t-1 border-foreground-0/30'}>
                            <p className={'w-32 h-fit text-accent-0 tracking-widest'}>{t('smartSearch')}</p>
                            <p className={'w-48 h-fit text-2xl text-foreground-0 font-semibold'}>{t('smartSearchTitle')}</p>
                            <p className={'flex-1 h-fit text-foreground-1'}>{t('smartSearchDesc')}</p>
                        </li>
                        <li className={'w-full max-w-[1000px] h-32 flex gap-12 p-6 border-t-1 border-foreground-0/30'}>
                            <p className={'w-32 h-fit text-accent-0 tracking-widest'}>{t('copyEdit')}</p>
                            <p className={'w-48 h-fit text-2xl text-foreground-0 font-semibold'}>{t('copyEditTitle')}</p>
                            <p className={'flex-1 h-fit text-foreground-1'}>{t('copyEditDesc')}</p>
                        </li>
                        <li className={'w-full max-w-[1000px] h-32 flex gap-12 p-6 border-t-1 border-foreground-0/30'}>
                            <p className={'w-32 h-fit text-accent-0 tracking-widest'}>{t('community')}</p>
                            <p className={'w-48 h-fit text-2xl text-foreground-0 font-semibold'}>{t('communityTitle')}</p>
                            <p className={'flex-1 h-fit text-foreground-1'}>{t('communityDesc')}</p>
                        </li>
                    </ul>
                </div>
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
