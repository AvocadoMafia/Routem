'use client'

import {useState, useEffect} from "react";
import {Route} from "@/lib/client/types";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import 'swiper/css';
import { HiHeart } from "react-icons/hi2";

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
                {props.routes.map((route, idx) => (
                    <SwiperSlide key={idx}>
                        <div className="w-full h-[700px] flex flex-col rounded-xl overflow-hidden">
                            {/* 上部マップ (静止画像に置き換え) */}
                            <div className="w-full h-[200px] relative">
                                <Image
                                    className="absolute w-full h-full object-cover"
                                    src="/map.jpg"
                                    alt="Map preview"
                                    fill
                                />
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
                                            src={route.author.icon?.url || "/mockImages/userIcon_1.jpg"}
                                            alt=""
                                            fill
                                        />
                                    </div>
                                    <span>{route.author.name}</span>
                                    <span>・ {route.routeFor}</span>
                                </div>

                                <div className="w-fit flex items-center px-2 py-1 gap-2 text-accent-0 bg-accent-0/10 rounded-full">
                                    <HiHeart />
                                    <span className="text-nowrap">
                                    {route.likes?.length ?? 0} likes
                                </span>
                                </div>

                                <div className="mt-4 flex flex-col gap-3">
                                    <h3 className="text-lg font-semibold text-foreground-1">
                                        Description
                                    </h3>
                                    <p className="text-foreground-1/80 leading-relaxed line-clamp-3">
                                        {route.description}
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-col gap-3">
                                    <h3 className="text-lg font-semibold text-foreground-1">
                                        Route Info
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="p-3 rounded-lg bg-background-0 border border-grass/10">
                                        <span className="block text-foreground-1/40 text-xs">
                                            Created
                                        </span>
                                            <span className="font-medium text-foreground-1">
                                            {new Date(route.createdAt).toLocaleDateString()}
                                        </span>
                                        </div>
                                        <div className="p-3 rounded-lg bg-background-0 border border-grass/10">
                                        <span className="block text-foreground-1/40 text-xs">
                                            Waypoints
                                        </span>
                                            <span className="font-medium text-foreground-1">
                                            {route.routeNodes.length} stops
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
