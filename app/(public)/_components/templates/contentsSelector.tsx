'use client'

import { HiMap, HiSparkles, HiFlag, HiClock, HiFire } from "react-icons/hi2";
import {selectedType} from "@/app/(public)/rootClient";
import {HiHome} from "react-icons/hi";

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
        <div className={'w-[100svw] h-fit sticky top-0 z-40 bg-background-0 backdrop-blur-sm flex items-center justify-start md:justify-center gap-2 md:gap-8 px-4 py-2 border-b border-grass/20 overflow-x-auto no-scrollbar'}>
            {SELECTOR_ITEMS.map((item) => (
                <button
                    key={item.label}
                    className={`flex items-center justify-center md:w-28 gap-1.5 px-3 py-2 transition-colors cursor-pointer group whitespace-nowrap rounded-full  ${props.selected === item.selected ? 'bg-accent-1' : ''}`}
                    onClick={() => {props.setSelected(item.selected as selectedType)}}
                >
                    <item.icon className={`w-5 h-5 text-accent-0`} />
                    <span className={`text-sm font-bold text-foreground-0 transition-colors ${props.selected === item.selected ? 'theme-reversed' : ''}`}>
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    )
}
