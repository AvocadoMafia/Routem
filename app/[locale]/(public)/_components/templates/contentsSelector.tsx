'use client'

import { motion } from "framer-motion";
import { HiSparkles, HiFire, HiHeart, HiUsers } from "react-icons/hi2";
import { selectedType } from "@/app/[locale]/(public)/rootClient";
import { HiHome } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { userStore } from "@/lib/stores/userStore";

const SELECTOR_KEYS = [
    { key: 'home', icon: HiHome, selected: 'home'},
    { key: 'photos', icon: HiSparkles, selected: 'photos' },
    { key: 'trending', icon: HiFire, selected: 'trending' },
    { key: 'likes', icon: HiHeart, selected: 'likes' },
    { key: 'followings', icon: HiUsers, selected: 'followings' },
] as const;

type Props = {
    selected: selectedType
    setSelected: (selected: selectedType) => void
}

export default function ContentsSelector(props: Props) {
    const t = useTranslations('tabs');
    const tNav = useTranslations('navigation');
    const user = userStore((state) => state.user);
    const isLoggedIn = !!user.id;

    const getLabel = (key: string) => {
        if (key === 'home') return tNav('home');
        if (key === 'followings') return tNav('following');
        if (key === 'trending') return tNav('trending');
        return t(key as 'photos' | 'likes');
    };

    const visibleKeys = SELECTOR_KEYS.filter(item => {
        if (!isLoggedIn && (item.key === 'likes' || item.key === 'followings')) {
            return false;
        }
        return true;
    });

    return (
        <div className={'shrink-0 w-fit h-fit bg-background-1/80 backdrop-blur-sm flex items-center justify-start md:justify-center gap-1 md:gap-2 px-2 py-2 border border-grass overflow-x-auto no-scrollbar rounded-full shadow-sm'}>
            {visibleKeys.map((item, idx) => {
                const isSelected = props.selected === item.selected;
                return (
                    <button
                        key={idx}
                        className={'relative flex items-center justify-center md:min-w-28 gap-2 px-4 py-2 cursor-pointer group whitespace-nowrap rounded-full transition-colors'}
                        onClick={() => {props.setSelected(item.selected as selectedType)}}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-accent-0 rounded-full shadow-sm z-0"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        
                        <div className="relative z-10 flex items-center gap-2">
                            <item.icon 
                                className={`w-5 h-5 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-accent-0 group-hover:text-accent-0'}`}
                            />
                            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-300 md:block ${isSelected ? 'text-white block' : 'hidden text-foreground-1 group-hover:text-foreground-0'}`}>
                                {getLabel(item.key)}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    )
}
