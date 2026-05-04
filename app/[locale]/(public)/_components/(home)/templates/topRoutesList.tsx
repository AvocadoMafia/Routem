"use client"

import RouteCardGraphical from '@/app/[locale]/_components/common/templates/routeCardGraphical'
import RouteCardGraphicalSkeleton from "@/app/[locale]/_components/common/ingredients/routeCardGraphicalSkeleton";
import FeaturedRouteCard from '@/app/[locale]/(public)/_components/(home)/ingredients/featuredRouteCard'
import FeaturedRouteCardSkeleton from "@/app/[locale]/(public)/_components/(home)/ingredients/featuredRouteCardSkeleton";
import { Route } from "@/lib/types/domain";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getDataFromServerWithJson, toErrorScheme } from "@/lib/api/client";
import { errorStore } from "@/lib/stores/errorStore";

export default function TopRoutesList() {
  const tHome = useTranslations('home');
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const appendError = errorStore(state => state.appendError);

  const fetchRoutes = useCallback(async () => {
    try {
      const res = await getDataFromServerWithJson<{ items: Route[] }>('/api/v1/routes?type=trending&limit=5');
      if (res) setRoutes(res.items);
    } catch (err) {
      console.error("Failed to fetch top routes:", err);
      appendError(toErrorScheme(err));
    }
  }, [appendError]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  // --- empty / 足りない: 静かに非表示 (仕様どおり) ---
  if (routes && routes.length < 5) return null;

  return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex items-center gap-2">
        <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">{tHome('topRoutes')}</h2>
      </div>

      <div className="w-full lg:min-h-[350px] md:min-h-[700px] sm:min-h-[1000px] min-h-[1400px] grid gap-3 xl:grid-rows-1 xl:grid-cols-5 lg:grid-rows-1 lg:grid-cols-4 md:grid-rows-2 md:grid-cols-3 sm:grid-rows-3 sm:grid-cols-2 grid-rows-5 grid-cols-1">
        <div className="sm:col-span-2 col-span-1">
          {routes ? <FeaturedRouteCard route={routes[0]} isLinkCard={true}/> : <FeaturedRouteCardSkeleton />}
        </div>
        <div className="col-span-1 block">
          {routes ? <RouteCardGraphical route={routes[1]} rank={2}/> : <RouteCardGraphicalSkeleton />}
        </div>
        <div className="col-span-1 block">
          {routes ? <RouteCardGraphical route={routes[2]} rank={3}/> : <RouteCardGraphicalSkeleton />}
        </div>
        <div className="col-span-1 sm:col-span-1 md:col-span-2 xl:col-span-1 block lg:hidden xl:block">
          {routes ? <RouteCardGraphical route={routes[3]} rank={4}/> : <RouteCardGraphicalSkeleton />}
        </div>
        <div className="col-span-1 block md:hidden">
          {routes ? <RouteCardGraphical route={routes[4]} rank={5}/> : <RouteCardGraphicalSkeleton />}
        </div>
      </div>
    </div>
  )
}
