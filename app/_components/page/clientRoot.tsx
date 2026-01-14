'use client'

import {useState} from "react";
import ContentsSelector from "@/app/_components/page/templates/contentsSelector";
import MapViewer from "@/app/_components/page/templates/mapViewer";
import TopUsersList from "@/app/_components/page/templates/topUsersList";
import TopRoutesList from "@/app/_components/page/templates/topRoutesList";
import RecommendedArticlesList from "@/app/_components/page/templates/recommendedArticlesList";

export type selectedType = 'map' | 'activity' | 'interests' | 'recent' | 'trending'

export default function ClientRoot() {
    const [selected, setSelected] = useState<selectedType>('map')
    return (
        <div className={'w-full max-w-[1600px] h-fit flex flex-col items-center px-8 pb-8 gap-8 relative'}>
            <ContentsSelector selected={selected} setSelected={setSelected}/>
            <MapViewer/>
            <TopRoutesList/>
            <TopUsersList/>
            <RecommendedArticlesList/>
        </div>
    )
}
