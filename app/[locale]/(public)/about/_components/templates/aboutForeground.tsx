"use client";

import { userStore } from "@/lib/client/stores/userStore";
import { useRouter } from "next/navigation";
import Footer from "@/app/[locale]/_components/layout/templates/footer";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SolutionCard from "@/app/[locale]/(public)/about/_components/ingredients/solutionCard";

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
                <h3 className={'absolute text-[2.5cqw] top-[16cqw] left-[23cqw] rotate-[-2deg] font-extrabold leading-tight text-[#48484e]'}>旅行の計画って<br/>なんか面倒じゃない？</h3>
                <img className={'absolute w-[6cqw] top-[9.5cqw] left-[53.8cqw]'} src={'/lp/pinBig.svg'}/>
                <h3 className={'absolute text-[2.5cqw] top-[12cqw] left-[60cqw] rotate-[-2deg] font-extrabold leading-tight text-[#48484e]'}>とっておきのルート<br/>シェアしてみない？</h3>
                <img className={'absolute w-[8cqw] top-[23cqw] left-[45.5cqw]'} src={'/lp/pinBig.svg'}/>
                <h3 className={'absolute text-[4cqw] top-[25cqw] left-[54cqw] rotate-[-2deg] font-extrabold leading-tight text-accent-0'}>それ全部、<br/>Routemで解決。</h3>
                <div className={'absolute w-full h-fit bg-background-0/75 backdrop-blur-sm z-20 top-[45cqw] flex justify-center'}>
                    <div className={'w-full max-w-[1000px] flex items-center p-6'}>
                        <p className={'flex-1 h-fit text-foreground-0 lg:text-3xl md:text-2xl text-xl font-bold leading-relaxed'}>旅行計画が面倒。<br/>気になるあの子と同じ旅をしたい。<br/>自分のとっておきのルートを共有したい。<br/>これ全部、<span className={'font-josefin-sans uppercase mr-2 text-accent-0 text-[1.1em]'}>Routem</span>で解決してみない？</p>
                        <div className={'lg:w-[400px] md:w-[300px] w-[250px] grid grid-cols-4 grid-rows-1 gap-3 overflow-hidden items-center'}>
                            <div className={' col-span-3'}>
                                <img className={'w-full'} src={'/lp/pc.png'}/>
                            </div>
                            <div className={''}>
                                <img className={'w-full'} src={'/lp/phone.png'}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'w-[20svw] h-[32svw] absolute top-[65cqw] left-[10cqw]'}>
                    <SolutionCard imageSrc={'/mockImages/Fuji.jpg'} title_line1={'地図上で作る、'} title_line2={'地図上で伝える。'} description={'地図上の施設情報を結んでルートを作成。道のり・移動手段を可視化し、写真や感想を各スポットに添付。投稿者はブログ感覚でルートの詳細説明を書くこともできます。'}/>
                </div>

                <div className={'w-[20svw] h-[32svw] absolute top-[70cqw] left-[50cqw]'}>
                    <SolutionCard imageSrc={'/mockImages/Fuji.jpg'} title_line1={'地図上で作る、'} title_line2={'地図上で伝える。'} description={'地図上の施設情報を結んでルートを作成。道のり・移動手段を可視化し、写真や感想を各スポットに添付。投稿者はブログ感覚でルートの詳細説明を書くこともできます。'}/>
                </div>

                <div className={'w-[20svw] h-[32svw] absolute top-[105cqw] left-[25cqw]'}>
                    <SolutionCard imageSrc={'/mockImages/Fuji.jpg'} title_line1={'地図上で作る、'} title_line2={'地図上で伝える。'} description={'地図上の施設情報を結んでルートを作成。道のり・移動手段を可視化し、写真や感想を各スポットに添付。投稿者はブログ感覚でルートの詳細説明を書くこともできます。'}/>
                </div>

                <div className={'w-[20svw] h-[32svw] absolute top-[107cqw] left-[60cqw]'}>
                    <SolutionCard imageSrc={'/mockImages/Fuji.jpg'} title_line1={'地図上で作る、'} title_line2={'地図上で伝える。'} description={'地図上の施設情報を結んでルートを作成。道のり・移動手段を可視化し、写真や感想を各スポットに添付。投稿者はブログ感覚でルートの詳細説明を書くこともできます。'}/>
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
            </section>
            <Footer />
        </div>
    )
}
