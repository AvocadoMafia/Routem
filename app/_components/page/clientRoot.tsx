'use client'

import {useState} from "react";
import ContentsSelector from "@/app/_components/page/templates/contentsSelector";
import MapViewer from "@/app/_components/page/templates/mapViewer";

export type selectedType = 'map' | 'activity' | 'interests' | 'recent' | 'trending'

export default function ClientRoot() {
    const [selected, setSelected] = useState<selectedType>('map')
    return (
        <div className={'w-full h-fit'}>
            <ContentsSelector selected={selected} setSelected={setSelected}/>
            <MapViewer/>
        </div>
    )
}
