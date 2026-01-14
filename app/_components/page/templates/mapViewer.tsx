'use client'

import {useState} from "react";
import {Map} from "react-map-gl/mapbox-legacy";
import RouteList from "@/app/_components/page/ingredients/routeList";
import RouteViewer from "@/app/_components/page/ingredients/routeViewer";
import RouteFilter from "@/app/_components/page/ingredients/routeFilter";

export default function MapViewer() {
    const [focusedRouteIndex, setFocusedRouteIndex] = useState<number>(1);

    return (
        <div className={'w-full rounded-2xl h-fit overflow-hidden relative'}>
            <div className={'w-full h-[600px] flex flex-row border-b-1 border-grass/20'}>
                {/*まだマップのシークレットがないので一旦コメントアウトし、ダミーとして画像を表示*/}
                {/*<Map*/}
                {/*    initialViewState={{*/}
                {/*        latitude: 35.6804,*/}
                {/*        longitude: 139.7690,*/}
                {/*        zoom: 12,*/}
                {/*    }}*/}
                {/*    mapStyle="mapbox://styles/mapbox/streets-v12"*/}
                {/*    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}*/}
                {/*    style={{ width: "100%", height: "100%" }}*/}
                {/*/>*/}
                <div className={'flex-1 h-full bg-background-1 relative'}>
                    <img src={'/map.png'} alt={'map'} className={'w-full h-full object-cover'}/>
                    {/* マップ上のオーバーレイなどが必要な場合はここに追加 */}
                </div>
                <RouteViewer focusedIndex={focusedRouteIndex} />
                <RouteList focusedIndex={focusedRouteIndex} setFocusedIndex={setFocusedRouteIndex} />
            </div>
            <RouteFilter/>
        </div>
    )
}
