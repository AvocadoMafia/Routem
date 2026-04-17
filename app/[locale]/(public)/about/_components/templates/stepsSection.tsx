"use client";

import { useTranslations } from "next-intl";

export default function StepsSection() {
    const t = useTranslations('about');

    return (
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
    );
}
