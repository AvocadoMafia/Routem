"use client"

import FeaturedRouteCard from '@/app/(public)/_components/ingredients/featuredRouteCard'
import RouteRankCard from '@/app/(public)/_components/ingredients/routeRankCard'
import {Route} from "@/lib/client/types";

type Props = {
  routes: Route[];
}

export default function TopRoutesList(props: Props) {
  return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-foreground-0">Top Routes — This week</h2>
      </div>

      <div className="w-full md:h-[300px] sm:h-[800px] h-[900px] grid grid-rows-3 md:grid-rows-1 grid-cols-1 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3">
        <div className="col-span-2">
          <FeaturedRouteCard route={props.routes[0]}/>
        </div>
        <div className="col-span-1 block">
          <RouteRankCard route={props.routes[1]} rank={2}/>
        </div>
        <div className="col-span-1 block">
          <RouteRankCard route={props.routes[2]} rank={3}/>
        </div>
        <div className="col-span-1 block md:hidden lg:block">
          <RouteRankCard route={props.routes[3]} rank={4}/>
        </div>
        <div className="col-span-1 block md:hidden xl:block">
          <RouteRankCard route={props.routes[4]} rank={5}/>
        </div>
      </div>
    </div>
  )
}
