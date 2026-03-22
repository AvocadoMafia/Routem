import FocusingRouteViewer from "@/app/(public)/_components/(likes)/templates/focusingRouteViewer";
import LikedRoutesList from "@/app/(public)/_components/(likes)/templates/likedRoutesList";
import {useEffect, useState} from "react";
import {getDataFromServerWithJson} from "@/lib/client/helpers";
import {Route} from "@/lib/types/domain";

export default function LikesSection() {

    const [routes, setRoutes] = useState<Route[]>([]);

    const [focusedRouteIdx, setFocusedRouteIdx] = useState<number>(0);


    useEffect(() => {
        getDataFromServerWithJson<Route[]>('/api/v1/routes?limit=10').then(
            (routes) => setRoutes(routes || [])
        )
    }, [])

    const routeOnFocus = routes[focusedRouteIdx];




    return (
        <div className={'w-full h-full flex flex-row'}>
            <LikedRoutesList routes={routes} setFocusedRouteIdx={setFocusedRouteIdx} focusedRouteIdx={focusedRouteIdx}/>
            <FocusingRouteViewer routeOnFocus={routeOnFocus} focusedRouteIdx={focusedRouteIdx} setFocusedRouteIdx={setFocusedRouteIdx} routesLength={routes.length}/>
        </div>
    )
}
