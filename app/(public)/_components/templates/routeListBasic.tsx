import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";
import {Route} from "@/lib/client/types";

type Props = {
    routes: Route[]
}

export default function RouteListBasic(props: Props) {

    return (
        <div className={'w-full grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3'}>
            {props.routes.map((r, idx) => (
                <RouteCardBasic route={r} key={idx}/>
            ))}
        </div>
    )
}
