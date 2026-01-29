'use client'

import {useState} from "react";
import ContentsSelector from "@/app/_components/page/templates/contentsSelector";
import MapViewerOnLaptop from "@/app/_components/page/templates/mapViewerOnLaptop";
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
import {Route, User} from "@/lib/client/types";
import MapViewerOnMobile from "@/app/_components/page/templates/mapViewerOnMobile";

export type selectedType = 'home' | 'photos' | 'interests' | 'recent' | 'trending'

export default function ClientRoot() {

    // Mock routes for demo (this week)
    const mockTopRoutes: Route[] = [
        { id: 'r1', title: 'Kyoto Old Town Walk', user: 'taro', likesThisWeek: 1280, viewsThisWeek: 18200, category: 'History', thumbnailImageSrc: '/mockImages/Kyoto.jpg' },
        { id: 'r2', title: 'Okinawa Beach Hopping', user: 'hanako', likesThisWeek: 990, viewsThisWeek: 15420, category: 'Beach', thumbnailImageSrc: '/mockImages/Okinawa.jpg' },
        { id: 'r3', title: 'Hokkaido Food Trip', user: 'satoshi', likesThisWeek: 1570, viewsThisWeek: 21030, category: 'Food', thumbnailImageSrc: '/mockImages/Hokkaido.jpg' },
        { id: 'r4', title: 'Tokyo Night Lights', user: 'emi', likesThisWeek: 870, viewsThisWeek: 16800, category: 'City', thumbnailImageSrc: '/mockImages/Tokyo.jpg' },
        { id: 'r5', title: 'Nara Temple Circuit', user: 'ken', likesThisWeek: 1430, viewsThisWeek: 19990, category: 'Culture', thumbnailImageSrc: '/mockImages/Nara.jpg' },
        { id: 'r6', title: 'Mount Fuji Scenic Drive', user: 'yuki', likesThisWeek: 760, viewsThisWeek: 14550, category: 'Nature', thumbnailImageSrc: '/mockImages/Fuji.jpg' },
    ]

    // Mock users for demo (this week)
    const mockUsers: User[] = [
        { id: 'u1', name: 'Aki Tanaka', likesThisWeek: 1240, viewsThisWeek: 28120, location: 'Tokyo, JP', bio: 'City explorer and coffee lover.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Nara.jpg' },
        { id: 'u2', name: 'Kenji Sato', likesThisWeek: 980, viewsThisWeek: 19230, location: 'Osaka, JP', bio: 'Runner and ramen hunter in Kansai.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Tokyo.jpg' },
        { id: 'u3', name: 'Serene Jane', likesThisWeek: 1570, viewsThisWeek: 32010, location: 'Kyoto, JP', bio: 'History routes and hidden shrines.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/userProfile.jpg' },
        { id: 'u4', name: 'Yuta Mori', likesThisWeek: 870, viewsThisWeek: 16800, location: 'Sapporo, JP', bio: 'Snowy trails and craft beer enthusiast.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Fuji.jpg' },
        { id: 'u5', name: 'Hana Suzuki', likesThisWeek: 1430, viewsThisWeek: 29990, location: 'Fukuoka, JP', bio: 'Weekend cyclist and bakery map maker from Japan. And Ive Lived in French since last year. Its great and I love here.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Kyoto.jpg' },
        { id: 'u6', name: 'Ren Nakamura', likesThisWeek: 760, viewsThisWeek: 14550, location: 'Nagoya, JP', bio: 'Techie who loves riverfront jogs.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Hokkaido.jpg' },
        { id: 'u7', name: 'Sara Ito', likesThisWeek: 1110, viewsThisWeek: 25040, location: 'Nara, JP', bio: 'Nature walks and deer lover in Nara.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Hokkaido.jpg' },
    ]

    const [selected, setSelected] = useState<selectedType>('home')
    return (
        <div className={'w-full max-w-[1600px] h-fit flex flex-col items-center md:px-8 px-4 md:pb-8 pb-4 gap-8 relative'}>
            <ContentsSelector selected={selected} setSelected={setSelected}/>
            {(() => {
                switch (selected) {
                    case 'home': return (
                        <div className={'w-full h-fit flex flex-col items-center gap-8'}>
                            <MapViewerOnLaptop routes={mockTopRoutes}/>
                            <MapViewerOnMobile routes={mockTopRoutes}/>
                            <TopRoutesList routes={mockTopRoutes} />
                            <TopUsersList users={mockUsers}/>
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
