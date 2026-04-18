'use client'

import {Route} from "@/lib/client/types";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import 'swiper/css';
import { HiHeart } from "react-icons/hi2";
import { useLocalizedBudget } from "@/lib/client/hooks/useLocalizedBudget";
import { useTranslations } from "next-intl";

type Props = {
    routes?: Route[];
    fetchMore?: () => Promise<void>;
    hasMore?: boolean;
    isFetching?: boolean;
};

export default function MapViewerOnMobile(props: Props) {
    const t = useTranslations('routes');
    const tCommon = useTranslations('common');
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
        <div className={'w-full sm:h-[700px] h-[600px] md:hidden block p-2 rounded-2xl bg-background-0 shadow-lg'}>
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
                    <SwiperSlide key={route.id ?? idx}>
                        <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden bg-background-1">
                            {/* 上部マップ (静止画像に置き換え) */}
                            <div className="w-full h-[275px] relative">
                                <Image
                                    className="absolute w-full h-full object-cover rounded-xl"
                                    src="/map.jpg"
                                    alt={tCommon('mapPreviewAlt')}
                                    fill
                                />
                            </div>

                            {/* 下部コンテンツ */}
                            <div className="w-full flex-1 flex flex-col p-6 gap-2">
                                <h1 className="text-2xl font-bold line-clamp-2">
                                    {route.title}
                                </h1>

                                <div className="text-lg flex items-center gap-2 text-foreground-1">
                                    <div className="relative w-8 h-8">
                                        <Image
                                            className="rounded-full"
                                            src={route.author.icon?.url || "/mockImages/userIcon_1.jpg"}
                                            alt=""
                                            fill
                                        />
                                    </div>
                                    <span>{route.author.name}</span>
                                </div>

                                <div className="w-fit flex items-center px-2 py-1 gap-2 text-accent-0 bg-accent-0/10 rounded-full">
                                    <HiHeart />
                                    <span className="text-nowrap">
                                    {route.likes?.length ?? 0} likes
                                </span>
                                </div>

                                <div className="mt-4 flex flex-col gap-3">
                                    <h3 className="text-lg font-semibold text-foreground-1">
                                        {t('description')}
                                    </h3>
                                    <p className="text-foreground-1/80 leading-relaxed line-clamp-3">
                                        {route.description}
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-col gap-3">
                                    <h3 className="text-lg font-semibold text-foreground-1">
                                        {t('routeInfo')}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="p-3 rounded-lg bg-background-0 border border-grass/10">
                                            <span className="block text-foreground-1/40 text-xs">
                                                {t('budget')}
                                            </span>
                                            <span className="font-medium text-foreground-1">
                                                <RouteBudgetText route={route} />
                                            </span>
                                        </div>
                                        <div className="p-3 rounded-lg bg-background-0 border border-grass/10">
                                            <span className="block text-foreground-1/40 text-xs">
                                                {t('days')}
                                            </span>
                                            <span className="font-medium text-foreground-1">
                                                {route.routeDates.length} {t('daysUnit')}
                                            </span>
                                        </div>
                                    </div>
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
