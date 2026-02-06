'use client'

import { Route } from "@/lib/client/types";
import { HiHeart } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import 'swiper/css';

type Props = {
    routes: Route[];
};

export default function MapViewerOnMobile(props: Props) {
    return (
        <div className={'w-full h-[700px] md:hidden block'}>
            <Swiper
                slidesPerView={1}
                spaceBetween={16}
                className="w-full h-full rounded-xl overflow-hidden shadow-md text-foreground-0"
            >
                {props.routes.map((route, index) => (
                    <SwiperSlide key={route.id ?? index}>
                        <div className="w-full h-[700px] flex flex-col rounded-xl overflow-hidden">
                            {/* 上部マップ */}
                            <div className="w-full h-[200px] relative">
                                <Image
                                    className="absolute w-full h-full object-cover"
                                    src="/map.png"
                                    alt=""
                                    fill
                                    unoptimized
                                />
                                <div className="absolute z-10 h-full w-1/3 p-1 bg-background-0/50 backdrop-blur-sm right-0">
                                    <Image
                                        className="w-full h-full rounded-lg object-cover border border-background-0 shadow-md"
                                        src={route.thumbnail?.url ?? '/map.png'}
                                        alt=""
                                        fill
                                        unoptimized
                                    />
                                </div>
                            </div>

                            {/* 下部コンテンツ */}
                            <div className="w-full flex-1 flex flex-col p-4 gap-2">
                                <h1 className="text-2xl font-bold line-clamp-2">
                                    {route.title}
                                </h1>

                                <div className="text-lg flex items-center gap-2 text-foreground-1">
                                    <div className="relative w-8 h-8">
                                        <Image
                                            className="rounded-full"
                                            src={route.author.profileImage?.url || "/mockImages/userIcon_1.jpg"}
                                            alt=""
                                            fill
                                            unoptimized
                                        />
                                    </div>
                                    <span>{route.author.name}</span>
                                    <span>・ {route.category}</span>
                                </div>

                                <div className="w-fit flex items-center px-2 py-1 gap-2 text-rose-500 bg-rose-500/10 rounded-full">
                                    <HiHeart />
                                    <span className="text-nowrap">
                                    {route.likesThisWeek} likes
                                </span>
                                </div>

                                <div className="mt-4 flex flex-col gap-3">
                                    <h3 className="text-lg font-semibold text-foreground-1">
                                        Description
                                    </h3>
                                    <p className="text-foreground-1/80 leading-relaxed">
                                        This is a beautiful route through {route.category} focused spots.
                                        Enjoy the amazing views and local culture curated by @{route.author.name}.
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-col gap-3">
                                    <h3 className="text-lg font-semibold text-foreground-1">
                                        Route Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="p-3 rounded-lg bg-background-0 border border-grass/10">
                                        <span className="block text-foreground-1/40">
                                            Distance
                                        </span>
                                            <span className="font-medium text-foreground-1">
                                            5.2 km
                                        </span>
                                        </div>
                                        <div className="p-3 rounded-lg bg-background-0 border border-grass/10">
                                        <span className="block text-foreground-1/40">
                                            Duration
                                        </span>
                                            <span className="font-medium text-foreground-1">
                                            2.5 hours
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
