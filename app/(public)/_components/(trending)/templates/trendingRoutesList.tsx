import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";
import {Route} from "@/lib/client/types";
import { HiFire } from "react-icons/hi2";

type Props = {
    routes: Route[];
};

export default function TrendingRoutesList({ routes }: Props) {
    return (
        <div className={'w-[900px] h-full overflow-y-auto no-scrollbar flex flex-col gap-6 py-6'}>
            <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-foreground-0 mb-2 flex items-center gap-3">
                <HiFire className="text-accent-0 w-6 h-6" />
                Trending Routes
            </h2>
            {routes.map((route) => (
                <div key={route.id} className={'w-full h-[400px]'}>
                    <RouteCardBasic key={route.id} route={route} />
                </div>
            ))}
            {routes.length === 0 && <p className="text-foreground-1">No routes found.</p>}
        </div>
    )
}
