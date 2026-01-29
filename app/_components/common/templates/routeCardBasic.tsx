import { Route } from "@/lib/client/types"
import React from "react";
import {Icon} from "@mui/material";
import {HiEye, HiHeart} from "react-icons/hi2";

type Props = {
    route: Route
}
export default function RouteCardBasic(props: Props) {
    return (
        <div className={'group w-full h-[300px] overflow-hidden rounded-xl flex shadow-sm hover:shadow-md'}>
            <div className={'flex-1 h-full relative overflow-hidden'}>
                {/* オーバーレイ（視認性向上） */}
                <div className="absolute inset-0 bg-black/40 z-10"/>
                <img src={props.route.thumbnailImageSrc} alt={props.route.title} className={'w-full h-full object-cover group-hover:scale-105 duration-300 ease-out'}/>
                <div className={'absolute left-0 bottom-0 w-full p-3 flex flex-col items-end gap-3 z-15'}>
                    <h2 className={'text-3xl font-bold text-white text-right'}>{props.route.title}</h2>
                    <p className="text-sm text-gray-300">by @{props.route.user.name} ・ {props.route.category}</p>
                </div>
            </div>
            <div className={'w-1/2 h-full min-w-[120px] flex flex-col gap-3 p-5'}>
                <div className="w-full flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <img
                            src={"/mockImages/userIcon_2.jpg"}
                            alt={`user icon`}
                            className="w-8 h-8 rounded-full object-cover bg-accent-0/10"
                        />
                        <h4 className="text-sm font-semibold truncate text-foreground-0">{'lychee'}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-foreground-1">
                        <div className="flex items-center gap-2">
                            <HiHeart className="w-4 h-4" />
                            <span className="text-xs">{'102 likes'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HiEye className="w-4 h-4" />
                            <span className="text-xs">{'562 views'}</span>
                        </div>
                    </div>
                </div>
                <div className="w-full grid grid-cols-2 gap-3 md:text-sm text-xs">
                    <div className="rounded-lg bg-background-0 border border-grass/10 p-1">
                        <span className="block text-foreground-1/40">Duration</span>
                        <span className="font-medium text-foreground-1">2.5 hours</span>
                    </div>
                    <div className="rounded-lg bg-background-0 border border-grass/10 p-1">
                        <span className="block text-foreground-1/40">Expenses</span>
                        <span className="font-medium text-foreground-1">＄200</span>
                    </div>
                </div>
                <div className={'w-full text-foreground-1 line-clamp-7 md:text-sm text-xs'}>
                    This is a one-day travel route in Kyoto.
                    In the morning, start at Fushimi Inari Shrine and walk through the famous red torii gates.
                    Next, go to Kiyomizu-dera Temple and enjoy the view of the city.
                    In the afternoon, visit Gion, a traditional area with old streets and shops.
                    You may see people wearing kimono or geisha on the street.
                    In the evening, go to Arashiyama and walk through the bamboo forest.
                    You can relax and enjoy the beautiful nature before the end of the day.
                </div>
            </div>
        </div>
    )
}

