import RouteCardBasic from "@/app/_components/common/templates/routeCardBasic";
import {Route} from "@/lib/client/types";
import { HiFire } from "react-icons/hi2";

type Props = {
    routes: Route[];
    hideHeader?: boolean;
};

export default function TrendingRoutesList({ routes, hideHeader }: Props) {
    return (
        <div className={`w-full lg:w-[900px] ${hideHeader ? 'h-fit' : 'h-full overflow-y-auto'} no-scrollbar flex flex-col gap-6 ${hideHeader ? 'py-2' : 'py-6 lg:py-12'}`}>
            {!hideHeader && (
                <h2 className="text-base font-bold uppercase tracking-[0.3em] text-foreground-0 mb-2 flex items-center gap-2">
                    <HiFire className="text-accent-0 w-5 h-5" />
                    Trending Routes
                </h2>
            )}
            {routes.map((route) => (
                <div key={route.id} className={'w-full h-fit lg:h-[400px]'}>
                    <RouteCardBasic key={route.id} route={route} />
                </div>
            ))}
            {routes.length === 0 && <p className="text-foreground-1">No routes found.</p>}
        </div>
    )
}
