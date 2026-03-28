"use client"

import RouteCardGraphical from '@/app/_components/common/templates/routeCardGraphical'
import {Route} from "@/lib/client/types";
import FeaturedRouteCard from '@/app/(public)/_components/(home)/ingredients/featuredRouteCard'

type Props = {
  routes: Route[];
}

export default function TopRoutesList(props: Props) {
  return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex items-center gap-2">
        <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">Top Routes — This week</h2>
      </div>

      <div className="w-full lg:h-[350px] md:h-[700px] sm:h-[1000px] h-[1400px] grid gap-3 xl:grid-rows-1 xl:grid-cols-5 lg:grid-rows-1 lg:grid-cols-4 md:grid-rows-2 md:grid-cols-3 sm:grid-rows-3 sm:grid-cols-2 grid-rows-5 grid-cols-1">
        <div className="sm:col-span-2 col-span-1">
          <FeaturedRouteCard route={props.routes[0]} isLinkCard={true}/>
        </div>
        <div className="col-span-1 block">
          <RouteCardGraphical route={props.routes[1]} rank={2}/>
        </div>
        <div className="col-span-1 block">
          <RouteCardGraphical route={props.routes[2]} rank={3}/>
        </div>
        <div className="col-span-1 sm:col-span-1 md:col-span-2 xl:col-span-1 block lg:hidden xl:block">
          <RouteCardGraphical route={props.routes[3]} rank={4}/>
        </div>
        <div className="col-span-1 block md:hidden">
          <RouteCardGraphical route={props.routes[4]} rank={5}/>
        </div>
      </div>
    </div>
  )
}
