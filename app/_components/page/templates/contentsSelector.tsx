'use client'

import {headerHeightAtom} from "@/lib/client/atoms";
import {useAtomValue} from "jotai";
import { HiMap, HiSparkles, HiFlag, HiClock, HiFire } from "react-icons/hi2";
import {selectedType} from "@/app/_components/page/clientRoot";

const SELECTOR_ITEMS = [
    { label: 'Map', icon: HiMap, selected: 'map'},
    { label: 'Activity', icon: HiSparkles, selected: 'activity' },
    { label: 'Interests', icon: HiFlag, selected: 'interests' },
    { label: 'Recent', icon: HiClock, selected: 'recent' },
    { label: 'Trending', icon: HiFire, selected: 'trending' },
];

type Props = {
    selected: selectedType
    setSelected: (selected: selectedType) => void
}

export default function ContentsSelector(props: Props) {
    const headerHeight = useAtomValue(headerHeightAtom)

    return (
        <div className={'w-full h-14 sticky z-40 bg-background-1 flex items-center justify-start md:justify-center gap-2 md:gap-8 px-4 border-b border-grass/20 overflow-x-auto no-scrollbar'} style={{ top: `${headerHeight}px` }}>
            {SELECTOR_ITEMS.map((item) => (
                <button
                    key={item.label}
                    className={`flex items-center justify-center md:w-28 gap-1.5 px-3 py-2 hover:bg-background-0 transition-colors cursor-pointer group whitespace-nowrap border-b-2 border-background-1 ${props.selected === item.selected ? 'border-foreground-1' : ''}`}
                    onClick={() => {props.setSelected(item.selected as selectedType)}}
                >
                    <item.icon className={'w-5 h-5 text-foreground-1'} />
                    <span className={'text-sm font-medium text-foreground-1 group-hover:text-foreground-0 transition-colors'}>
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    )
}
