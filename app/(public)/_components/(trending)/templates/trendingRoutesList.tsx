import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";
import {Route} from "@/lib/client/types";

type Props = {
    routes: Route[];
};

export default function TrendingRoutesList({ routes }: Props) {
    return (
        <div className={'w-[1000px] h-full overflow-y-auto no-scrollbar flex flex-col gap-4 pb-10'}>
            <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-foreground-0 mb-2">Trending Routes</h2>
            {routes.map((route) => (
                <div className={'w-full h-[400px]'}>
                    <RouteCardBasic key={route.id} route={route} />
                </div>
            ))}
            {routes.length === 0 && <p className="text-foreground-1">No routes found.</p>}
        </div>
    )
}
