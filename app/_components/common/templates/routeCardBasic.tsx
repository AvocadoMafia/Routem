import { Route } from "@/lib/client/types"
import React from "react";
import {Icon} from "@mui/material";
import {HiEye, HiHeart} from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";

type Props = {
    route: Route
}
export default function RouteCardBasic(props: Props) {
    return (
        <Link href={`/routes/${props.route.id}`} className={'group w-full h-[300px] overflow-hidden rounded-xl flex shadow-sm hover:shadow-md transition-shadow'}>
            <div className={'flex-1 h-full relative overflow-hidden'}>
                {/* オーバーレイ（視認性向上） */}
                <div className="absolute inset-0 bg-black/40 z-10"/>
                <Image
                    src={props.route.thumbnail?.url ?? '/map.png'}
                    alt={props.route.title}
                    fill
                    className={'object-cover group-hover:scale-105 duration-300 ease-out'}
                    unoptimized
                />
                <div className={'absolute left-0 bottom-0 w-full p-3 flex flex-col items-end gap-3 z-15'}>
                    <h2 className={'text-3xl font-bold text-white text-right'}>{props.route.title}</h2>
                    <p className="text-sm text-gray-300">by @{props.route.author.name} ・ {props.route.category?.name}</p>
                </div>
            </div>
            <div className={'w-1/2 h-full min-w-[120px] flex flex-col gap-3 p-5'}>
                <div className="w-full flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8">
                            <Image
                                src={props.route.author.icon?.url || "/mockImages/userIcon_2.jpg"}
                                alt={props.route.author.name}
                                fill
                                className="rounded-full object-cover bg-accent-0/10"
                                unoptimized
                            />
                        </div>
                        <h4 className="text-sm font-semibold truncate text-foreground-0">{props.route.author.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <HiHeart className="w-4 h-4 text-accent-0" />
                            <span className="text-xs text-foreground-1">{props.route.likes?.length ?? 0} likes</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <HiEye className="w-4 h-4 text-accent-1" />
                            <span className="text-xs text-foreground-1">{props.route.views?.length ?? 0} views</span>
                        </div>
                    </div>
                </div>
                <div className="w-full grid grid-cols-2 gap-3 md:text-sm text-xs">
                    <div className="rounded-lg bg-background-0 border border-grass/10 p-1 flex flex-col justify-center px-2">
                        <span className="block text-foreground-1/40 text-[10px]">Stops</span>
                        <span className="font-medium text-foreground-1 truncate">{props.route.routeNodes.length} pts</span>
                    </div>
                    <div className="rounded-lg bg-background-0 border border-grass/10 p-1 flex flex-col justify-center px-2">
                        <span className="block text-foreground-1/40 text-[10px]">Category</span>
                        <span className="font-medium text-foreground-1 truncate">{props.route.category?.name}</span>
                    </div>
                </div>
                <div className={'w-full text-foreground-1 line-clamp-7 md:text-sm text-xs whitespace-pre-wrap'}>
                    {props.route.description}
                </div>
            </div>
        </Link>
    )
}

