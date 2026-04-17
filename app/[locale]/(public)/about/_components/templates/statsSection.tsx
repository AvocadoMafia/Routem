"use client";

import { useTranslations } from "next-intl";

export default function StatsSection() {
    const t = useTranslations('about');

    return (
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
    );
}
