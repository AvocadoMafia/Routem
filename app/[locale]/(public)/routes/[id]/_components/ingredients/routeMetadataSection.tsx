"use client";

import { Banknote, Calendar, Users } from "lucide-react";
import { Route } from "@/lib/types/domain";
import { useTranslations } from "next-intl";
import { useLocalizedBudget } from "@/lib/hooks/useLocalizedBudget";

type RouteMetadataSectionProps = {
  route: Route;
};

export default function RouteMetadataSection({ route }: RouteMetadataSectionProps) {
  const t = useTranslations("routes");
  const tEditor = useTranslations("routeEditor");
  
  // 予算のローカライズ表示 (フックを利用)
  const localizedBudget = useLocalizedBudget(
    route.budget?.amount,
    route.budget?.localCurrencyCode,
    "0"
  );

  // 日数の計算
  const daysCount = route.routeDates?.length || 0;
  
  // 対象者 (RouteFor) の翻訳
  const getRouteForLabel = (routeFor: string) => {
    switch (routeFor) {
      case "EVERYONE": return tEditor("targetEveryone");
      case "FAMILY": return tEditor("targetFamily");
      case "FRIENDS": return tEditor("targetFriends");
      case "COUPLE": return tEditor("targetCouple");
      case "SOLO": return tEditor("targetSolo");
      default: return tEditor("targetEveryone");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {/* 予算 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Banknote className="w-4 h-4 text-accent-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
            {t("budget")}
          </span>
        </div>
        <div className="text-xl font-bold text-foreground-0">
          {route.budget ? localizedBudget : "---"}
        </div>
      </div>

      {/* 日数 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-accent-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
            {t("days")}
          </span>
        </div>
        <div className="text-xl font-bold text-foreground-0">
          {daysCount} {t("daysUnit")}
        </div>
      </div>

      {/* 対象者 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-accent-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
            {t("forWho")}
          </span>
        </div>
        <div className="text-xl font-bold text-foreground-0">
          {getRouteForLabel(route.routeFor)}
        </div>
      </div>
    </div>
  );
}
