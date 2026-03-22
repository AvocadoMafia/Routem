import {Route} from "@/lib/types/domain";


type Props = {
    route: Route,
    myIdx: number,
    onClick? : () => void,
    focusedRouteIdx?: number,
}


export default function RouteCardOnLikesList({route, myIdx, focusedRouteIdx, onClick}: Props) {

    const isFocusing = focusedRouteIdx === myIdx;

    return (
        <div className={`w-full h-32 bg-background-0 rounded-lg p-2 shadow-md ${isFocusing? 'theme-reversed' : ''}`} onClick={onClick}>
            <div className={'w-full h-full flex flex-row bg-background-1 rounded-lg'}>
                <img className={'h-full aspect-square object-cover rounded-sm'} src={'/mockImages/Fuji.jpg'} />
                <div className={'flex-1 h-full'}>
                    <h2>{route.title}</h2>
                </div>
            </div>
        </div>
    )
}
