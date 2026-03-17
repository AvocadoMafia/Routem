'use client'

import {useCallback, useEffect, useState} from "react";
import {Route} from "@/lib/client/types";
import {getDataFromServerWithJson} from "@/lib/client/helpers";
import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";

type Props = {
    q: string
}
export default function RootClient(props: Props) {
    const [routes, setRoutes] = useState<Route[]>([])

    const searchArticles = async (q: string) => {
        const routes = await getDataFromServerWithJson<Route[]>(`/api/v1/routes?q=${q}&limit=10`)
        if(!routes) return;
        setRoutes(routes)
    }

    useEffect(() => {
        searchArticles(props.q)
    }, [props]);

    return (
        <div className={'w-full h-full grid grid-cols-3'}>
            {routes.map(route => <div key={route.id}><RouteCardBasic route={route}/></div>)}
        </div>
    )
}
