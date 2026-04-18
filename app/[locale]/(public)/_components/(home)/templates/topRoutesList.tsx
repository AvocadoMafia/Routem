"use client"

import RouteCardGraphical from '@/app/[locale]/_components/common/templates/routeCardGraphical'
import { Route } from "@/lib/client/types";
import FeaturedRouteCard from '@/app/[locale]/(public)/_components/(home)/ingredients/featuredRouteCard'
import SectionErrorState from '@/app/[locale]/_components/common/ingredients/sectionErrorState'
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getDataFromServerWithJson } from "@/lib/client/helpers";
import { ErrorScheme } from "@/lib/client/types";
import { toErrorScheme } from "@/lib/client/helpers";


export default function TopRoutesList() {
  const tHome = useTranslations('home');
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [error, setError] = useState<ErrorScheme | null>(null);

  const fetchRoutes = useCallback(async () => {
    setError(null);
    try {
      const res = await getDataFromServerWithJson<{ items: Route[] }>('/api/v1/routes?type=trending&limit=5');
      if (res) setRoutes(res.items);
    } catch (err) {
      console.error("Failed to fetch top routes:", err);
      setError(toErrorScheme(err));
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  // --- error: 取得に失敗 ---
  if (error && !routes) {
    return (
      <div className="w-full h-fit">
        <div className="w-full mb-3 flex items-center gap-2">
          <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">{tHome('topRoutes')}</h2>
        </div>
        <SectionErrorState error={error} onRetry={fetchRoutes} />
      </div>
    );
  }

  // --- loading: まだ届いていない ---
  if (!routes) return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex items-center gap-2">
        <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">{tHome('topRoutes')}</h2>
      </div>
      <div className="w-full lg:h-[350px] md:h-[700px] sm:h-[1000px] h-[1400px] grid gap-3 xl:grid-rows-1 xl:grid-cols-5 lg:grid-rows-1 lg:grid-cols-4 md:grid-rows-2 md:grid-cols-3 sm:grid-rows-3 sm:grid-cols-2 grid-rows-5 grid-cols-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full h-full bg-background-1 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );

  // --- empty / 足りない: 静かに非表示 (仕様どおり) ---
  if (routes.length < 5) return null;

  return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex items-center gap-2">
        <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">{tHome('topRoutes')}</h2>
      </div>

      <div className="w-full lg:h-[350px] md:h-[700px] sm:h-[1000px] h-[1400px] grid gap-3 xl:grid-rows-1 xl:grid-cols-5 lg:grid-rows-1 lg:grid-cols-4 md:grid-rows-2 md:grid-cols-3 sm:grid-rows-3 sm:grid-cols-2 grid-rows-5 grid-cols-1">
        <div className="sm:col-span-2 col-span-1">
          <FeaturedRouteCard route={routes[0]} isLinkCard={true}/>
        </div>
        <div className="col-span-1 block">
          <RouteCardGraphical route={routes[1]} rank={2}/>
        </div>
        <div className="col-span-1 block">
          <RouteCardGraphical route={routes[2]} rank={3}/>
        </div>
        <div className="col-span-1 sm:col-span-1 md:col-span-2 xl:col-span-1 block lg:hidden xl:block">
          <RouteCardGraphical route={routes[3]} rank={4}/>
        </div>
        <div className="col-span-1 block md:hidden">
          <RouteCardGraphical route={routes[4]} rank={5}/>
        </div>
      </div>
    </div>
  )
}
