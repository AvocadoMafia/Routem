'use client'

import {useCallback, useEffect, useState} from "react";
import {Route} from "@/lib/client/types";
import {getDataFromServerWithJson} from "@/lib/client/helpers";
import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";

// カーソルベースのレスポンス型
type CursorResponse<T> = { items: T[]; nextCursor: string | null };

type Props = {
    q: string
}
export default function RootClient(props: Props) {
    const [routes, setRoutes] = useState<Route[]>([])

    const searchArticles = async (q: string) => {
        const res = await getDataFromServerWithJson<CursorResponse<Route>>(`/api/v1/routes?q=${q}&limit=10`)
        if(!res) return;
        setRoutes(res.items)
    }

    useEffect(() => {
        searchArticles(props.q)
    }, [props]);

    return (
        <div className={'w-full h-full grid grid-cols-3'}>
            {routes.map((route, idx) => <div key={idx}><RouteCardBasic route={route}/></div>)}
        </div>
    )
}
