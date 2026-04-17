"use client";

import { useTranslations } from "next-intl";

export default function TargetSection() {
    const t = useTranslations('about');

    return (
        <section className={'w-full h-fit p-6 md:p-12 bg-background-0/75 backdrop-blur-sm flex justify-center'}>
            <div className={'w-full max-w-[1000px] h-fit grid grid-cols-1 md:grid-cols-2 rounded-lg border-1 border-foreground-0/30 overflow-hidden'}>
                <div className={'w-full h-fit md:h-[400px] p-6 bg-foreground-0/15 flex flex-col justify-between gap-3'}>
                    <p className={'w-fit h-fit text-foreground-0/30'}>{t('readerA')}</p>
                    <div className={'w-full h-fit flex flex-col gap-3'}>
                        <h2 className={'text-foreground-0/30 text-4xl md:text-6xl font-syne font-extrabold'}>{t('reader20s')}</h2>
                        <p className={'text-foreground-0 text-xl md:text-2xl font-syne font-semibold'}>{t('reader20sTitle')}</p>
                        <p className={'text-foreground-1 text-sm'}>{t('reader20sDesc')}</p>
                    </div>
                    <p className={'w-full h-fit border-t border-foreground-0/30 text-foreground-0 py-3 italic mt-4 md:mt-0'}>{t('reader20sQuote')}</p>
                </div>
                <div className={'w-full h-fit md:h-[400px] p-6 flex flex-col justify-between gap-3'}>
                    <p className={'w-fit h-fit text-foreground-0/30'}>{t('readerB')}</p>
                    <div className={'w-full h-fit flex flex-col gap-3'}>
                        <h2 className={'text-foreground-0/30 text-4xl md:text-6xl font-syne font-extrabold'}>{t('readerIn')}</h2>
                        <p className={'text-foreground-0 text-xl md:text-2xl font-syne font-semibold'}>{t('readerInTitle')}</p>
                        <p className={'text-foreground-1 text-sm'}>{t('readerInDesc')}</p>
                    </div>
                    <p className={'w-full h-fit border-t border-foreground-0/30 text-foreground-0 py-3 italic mt-4 md:mt-0'}>{t('readerInQuote')}</p>
                </div>
            </div>
        </section>
    );
}
