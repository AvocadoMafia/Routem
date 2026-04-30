'use client'

import {useState} from "react";
import ContentsSelector from "@/app/[locale]/(public)/_components/templates/contentsSelector";
import HomeSection from "@/app/[locale]/(public)/_components/(home)/homeSection";
import PhotosSection from "@/app/[locale]/(public)/_components/(photos)/photosSection";
import TrendingSection from "@/app/[locale]/(public)/_components/(trending)/trendingSection";
import { useUiStore } from "@/lib/stores/uiStore";
import { motion } from "framer-motion";
import LikesSection from "@/app/[locale]/(public)/_components/(likes)/likesSection";
import FollowingsSection from "@/app/[locale]/(public)/_components/(followings)/followingsSection";
import { userStore } from "@/lib/stores/userStore";

export type selectedType = 'home' | 'photos' | 'trending' | 'likes' | 'followings'


export default function RootClient() {

    const user = userStore((state) => state.user)
    const isLoggedIn = !!user.id

    const [selected, setSelected] = useState<selectedType>('home')
    const activeSelected = !isLoggedIn && (selected === 'likes' || selected === 'followings')
        ? 'home'
        : selected

    return (
        <div className={'w-full max-w-[1600px] h-full flex flex-col items-center md:px-8 px-4 relative'}>
            <ContentsSelector selected={activeSelected} setSelected={setSelected}/>
            {(() => {
                switch (activeSelected) {
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
