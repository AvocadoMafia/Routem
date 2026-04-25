'use client'

import {Route} from "@/lib/types/domain";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import 'swiper/css';
import {HiBanknotes, HiClock, HiCurrencyDollar, HiEye, HiHeart} from "react-icons/hi2";
import { useLocalizedBudget } from "@/lib/hooks/useLocalizedBudget";
import { useTranslations } from "next-intl";
import {MdPeople} from "react-icons/md";
import { useRouter } from "next/navigation";


type Props = {
    routes?: Route[];
    fetchMore?: () => Promise<void>;
    hasMore?: boolean;
    isFetching?: boolean;
};

export default function MapViewerOnMobile(props: Props) {
    const t = useTranslations('routes');
    const tCommon = useTranslations('common');

    const router = useRouter();

    if (!props.routes) {
        return (
            <div className="w-full sm:h-[700px] h-[600px] md:hidden block p-2 rounded-2xl bg-background-0 shadow-lg overflow-hidden">
                <div className="w-full h-full rounded-2xl bg-background-1 flex flex-col">
                    <div className="w-full h-[275px] bg-background-0/50 shimmer" />
                    <div className="p-6 flex flex-col gap-4">
                        <div className="w-3/4 h-8 bg-background-0 rounded shimmer" />
                        <div className="w-1/2 h-6 bg-background-0 rounded shimmer" />
                        <div className="w-full h-20 bg-background-0 rounded shimmer" />
                    </div>
                </div>
            </div>
        )
    }

    const dummySlides = Array.from({ length: 5 }).map((_, i) => (
        <SwiperSlide key={`dummy-${i}`}>
            <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-background-1">
                <div className="w-full h-[275px] bg-background-0/50 shimmer" />
                <div className="p-6 flex flex-col gap-4">
                    <div className="w-3/4 h-8 bg-background-0 rounded shimmer" />
                    <div className="w-1/2 h-6 bg-background-0 rounded shimmer" />
                    <div className="w-full h-20 bg-background-0 rounded shimmer" />
                </div>
            </div>
        </SwiperSlide>
    ));

    return (
        <div className={'w-full h-132 md:hidden block p-2 rounded-2xl bg-background-0 shadow-lg'}>
            <Swiper
                slidesPerView={1}
                spaceBetween={16}
                className="w-full h-full rounded-2xl overflow-hidden text-foreground-0"
                onSlideChange={(swiper) => {
                    if (props.routes && swiper.activeIndex >= props.routes.length - 1 && props.hasMore && !props.isFetching) {
                        props.fetchMore?.();
                    }
                }}
            >
                {props.routes.map((route, idx) => (
                    <SwiperSlide key={route.id ?? idx} className={'h-full'}>
                        <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-background-1">
                            {/* 上部マップ (静止画像に置き換え) */}
                            <img
                                className="w-full h-[200px] object-cover rounded-2xl shrink-0"
                                src={route.thumbnail?.url || 'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp'}
                                alt={tCommon('mapPreviewAlt')}
                            />
                            {/* 下部コンテンツ */}
                            <div className="w-full flex-1 flex flex-col py-3 px-5 gap-3">
                                <div className={'flex gap-2'}>
                                    <div className={'py-1 px-3 bg-background-0 text-foreground-1 flex items-center gap-2 text-xs rounded-full'}>
                                        <HiClock/>
                                        <span>{route.routeDates.length + t("dayUnit")}</span>
                                    </div>
                                    <div className={'py-1 px-3 bg-background-0 text-foreground-1 flex items-center gap-2 text-xs rounded-full'}>
                                        <HiBanknotes/>
                                        <span><RouteBudgetText route={route} /></span>
                                    </div>
                                    <div className={'py-1 px-3 bg-background-0 text-foreground-1 flex items-center gap-2 text-xs rounded-full'}>
                                        <MdPeople/>
                                        <span>{route.routeFor}</span>
                                    </div>
                                </div>
                                <div className={'flex gap-3'}>
                                    <img className={'w-10 h-10 rounded-full'} src={route.author.icon?.url } alt={route.author.name} />
                                    <div className={'flex flex-col gap-1'}>
                                        <h1 className="text-xl font-bold line-clamp-2 text-foreground-0" onClick={() => router.push(`/routes/${route.id}`)}>
                                            {route.title}
                                        </h1>
                                        <div className={'flex items-center gap-2 text-sm line-clamp-5 text-foreground-0/80'}>
                                            <span className={''}>{route.author.name}</span>・
                                            <span className={'flex items-center gap-1'}><HiHeart className={"text-accent-0"}/>{route.likes?.length}</span>
                                            <span className={'flex items-center gap-1'}><HiEye className={"text-accent-0"}/>{route.views?.length}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={'text-foreground-1 px-2'}>
                                    {route.description}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
                {props.hasMore && dummySlides}
            </Swiper>
        </div>
    );
}

function RouteBudgetText({ route }: { route: Route }) {
    const localizedBudget = useLocalizedBudget(route.budget?.amount, route.budget?.localCurrencyCode);
    return <>{localizedBudget}</>;
}
