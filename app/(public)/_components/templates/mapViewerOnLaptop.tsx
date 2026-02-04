'use client'

import {useState} from "react";
import {Map} from "react-map-gl/mapbox-legacy";
import RouteList from "@/app/(public)/_components/ingredients/routeList";
import RouteViewer from "@/app/(public)/_components/ingredients/routeViewer";
import RouteFilter from "@/app/(public)/_components/ingredients/routeFilter";
import {Route} from "@/lib/client/types";
import getClientMapboxAccessToken from "@/lib/config/client";

type Props = {
    routes: Route[]
}

export default function MapViewerOnLaptop(props: Props) {
    const [focusedRouteIndex, setFocusedRouteIndex] = useState<number>(1);

    const mapboxAccessToken = getClientMapboxAccessToken()

    if(!mapboxAccessToken) return (
        <p>マップボックスのアクセストークンが存在しません。</p>
    )


    return (
        <div className={'w-full rounded-2xl h-fit overflow-hidden relative md:block hidden'}>
            <div className={'w-full h-[600px] flex flex-row border-b-1 border-grass/20'}>
                <div className={'flex-1 h-full bg-background-1 relative'} onWheel={e => e.stopPropagation()}>
                    {/* マップ上のオーバーレイなどが必要な場合はここに追加 */}
                    <Map
                        initialViewState={{
                            latitude: 35.6804,
                            longitude: 139.7690,
                            zoom: 12,
                        }}
                        mapStyle="mapbox://styles/mapbox/streets-v12"
                        mapboxAccessToken={mapboxAccessToken}
                        style={{ width: "100%", height: "100%" }}
                    />
                </div>
                <RouteViewer focusedIndex={focusedRouteIndex} routes={props.routes}/>
                <RouteList focusedIndex={focusedRouteIndex} routes={props.routes} setFocusedIndex={setFocusedRouteIndex} />
            </div>
            <RouteFilter/>
        </div>
    )
}
