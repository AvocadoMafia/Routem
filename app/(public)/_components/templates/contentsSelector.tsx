'use client'

import { motion } from "framer-motion";
import { HiSparkles, HiFlag, HiClock, HiFire } from "react-icons/hi2";
import { selectedType } from "@/app/(public)/rootClient";
import { HiHome } from "react-icons/hi";

const SELECTOR_ITEMS = [
    { label: 'Home', icon: HiHome, selected: 'home'},
    { label: 'Photos', icon: HiSparkles, selected: 'photos' },
    { label: 'Interests', icon: HiFlag, selected: 'interests' },
    { label: 'Recent', icon: HiClock, selected: 'recent' },
    { label: 'Trending', icon: HiFire, selected: 'trending' },
];

type Props = {
    selected: selectedType
    setSelected: (selected: selectedType) => void
}

export default function ContentsSelector(props: Props) {

    return (
        <div className={'w-fit h-fit sticky top-2 z-40 bg-background-1/90 backdrop-blur-sm flex items-center justify-start md:justify-center gap-1 md:gap-2 px-2 py-2 border border-grass overflow-x-auto no-scrollbar rounded-full shadow-sm'}>
            {SELECTOR_ITEMS.map((item) => {
                const isSelected = props.selected === item.selected;
                return (
                    <button
                        key={item.label}
                        className={'relative flex items-center justify-center md:min-w-28 gap-2 px-4 py-2 cursor-pointer group whitespace-nowrap rounded-full transition-colors'}
                        onClick={() => {props.setSelected(item.selected as selectedType)}}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-accent-1 rounded-full shadow-sm z-0"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        
                        <div className="relative z-10 flex items-center gap-2">
                            <item.icon 
                                className={`w-5 h-5 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-accent-0 group-hover:text-accent-1'}`}
                            />
                            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-300 md:block ${isSelected ? 'text-white block' : 'hidden text-foreground-1 group-hover:text-foreground-0'}`}>
                                {item.label}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    )
}
