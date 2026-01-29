import {Route} from "@/lib/client/types";
import {useState} from "react";

type Props = {
    routes: Route[]
}

export default function MapViewerOnMobile(props: Props) {
    const [focusedRouteIndex, setFocusedRouteIndex] = useState<number>(1);
    return (
        <div className={'w-full h-[600px] flex flex-col rounded-lg overflow-hidden block md:hidden text-foreground-1'}>
            <img className={'w-full h-1/2 object-cover'} src={'/map.png'} />
            <div className={'w-full flex-1 flex flex-col p-2'}>
                <h1 className={'text-3xl font-bold'}>{props.routes[focusedRouteIndex].title}</h1>
                <div className={'text-2xl flex flex-row gap-2'}>
                    <span>@ {props.routes[focusedRouteIndex].user}</span>
                </div>
            </div>
        </div>
    )
}
