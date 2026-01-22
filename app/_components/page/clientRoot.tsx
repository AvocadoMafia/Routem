'use client'

import {useState} from "react";
import ContentsSelector from "@/app/_components/page/templates/contentsSelector";
import MapViewer from "@/app/_components/page/templates/mapViewer";
import TopUsersList from "@/app/_components/page/templates/topUsersList";
import TopRoutesList from "@/app/_components/page/templates/topRoutesList";
import RecommendedRoutesList from "@/app/_components/page/templates/recommendedRoutesList";
import PhotoViewer from "@/app/_components/page/templates/photoViewer";
import RouteListBasic from "@/app/_components/page/templates/routeListBasic";
import {GiGreekTemple, GiPaintBrush} from "react-icons/gi";
import {PiForkKnife, PiMountains} from "react-icons/pi";
import {LuPalette} from "react-icons/lu";
import {FaRunning} from "react-icons/fa";
import {IoIosArrowForward} from "react-icons/io";

export type selectedType = 'home' | 'photos' | 'interests' | 'recent' | 'trending'

export default function ClientRoot() {
    const [selected, setSelected] = useState<selectedType>('home')
    return (
        <div className={'w-full max-w-[1600px] h-fit flex flex-col items-center px-8 pb-8 gap-8 relative'}>
            <ContentsSelector selected={selected} setSelected={setSelected}/>
            {(() => {
                switch (selected) {
                    case 'home': return (
                        <div className={'w-full h-fit flex flex-col items-center gap-8'}>
                            <MapViewer/>
                            <TopRoutesList/>
                            <TopUsersList/>
                            <RecommendedRoutesList/>
                        </div>
                    )
                    case 'photos': return (
                        <PhotoViewer/>
                    )
                    case 'interests': return (
                        <div className={'w-full h-fit flex flex-col gap-8'}>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-0 font-bold'}>
                                        <GiGreekTemple className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>History</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic/>
                            </div>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-0 font-bold'}>
                                        <PiMountains className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>Nature</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic/>
                            </div>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-0 font-bold'}>
                                        <LuPalette className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>Culture</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic/>
                            </div>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-0 font-bold'}>
                                        <PiForkKnife className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>Food</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic/>
                            </div>
                            <div className={'w-full flex flex-col gap-2'}>
                                <div className={'py-4 flex flex-row justify-between items-center'}>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-0 font-bold'}>
                                        <FaRunning className={'text-3xl'}/>
                                        <h2 className={'text-2xl'}>Activity</h2>
                                    </div>
                                    <div className={'flex flex-row items-center gap-2 text-foreground-1 cursor-pointer'}>
                                        <h2 className={'text-lg'}>View More</h2>
                                        <IoIosArrowForward className={'text-xl'}/>
                                    </div>
                                </div>
                                <RouteListBasic/>
                            </div>
                        </div>
                    )
                    case 'recent': return <></>
                    case 'trending': return <></>
                }
            })()}
        </div>
    )
}
