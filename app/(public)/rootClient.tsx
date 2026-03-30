'use client'

import {useState} from "react";
import ContentsSelector from "@/app/(public)/_components/templates/contentsSelector";
import HomeSection from "@/app/(public)/_components/(home)/homeSection";
import PhotosSection from "@/app/(public)/_components/(photos)/photosSection";
import TrendingSection from "@/app/(public)/_components/(trending)/trendingSection";
import { useUiStore } from "@/lib/client/stores/uiStore";
import { motion } from "framer-motion";
import LikesSection from "@/app/(public)/_components/(likes)/likesSection";
import FollowingsSection from "@/app/(public)/_components/(followings)/followingsSection";

export type selectedType = 'home' | 'photos' | 'trending' | 'likes' | 'followings'

export default function RootClient() {

    const scrollDirection = useUiStore((state) => state.scrollDirection)

    const [selected, setSelected] = useState<selectedType>('home')
    return (
        <div className={'w-full max-w-[1600px] h-full flex flex-col items-center md:px-8 px-4 relative'}>
            <div className="fixed bottom-8 left-0 w-full flex justify-center z-40 pointer-events-none">
                <motion.div
                    initial={false}
                    animate={{
                        y: scrollDirection === 'down' ? 100 : 0,
                        opacity: scrollDirection === 'down' ? 0 : 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="pointer-events-auto"
                >
                    <ContentsSelector selected={selected} setSelected={setSelected}/>
                </motion.div>
            </div>
            {(() => {
                switch (selected) {
                    case 'home': return (
                        <HomeSection key="home-section" />
                    )
                    case 'photos': return (
                        <PhotosSection />
                    )
                    case 'trending': return (
                        <TrendingSection />
                    )
                    case 'likes': return (
                        <LikesSection />
                    )
                    case 'followings': return (
                        <FollowingsSection/>
                    )
                }
            })()}
        </div>
    )
}
