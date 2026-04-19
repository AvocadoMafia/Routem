"use client";

import { Route } from "@/lib/types/domain";
import { User } from "@supabase/supabase-js";
import { useState, useEffect, useMemo, useCallback } from "react";
import MapViewer from "./_components/templates/mapViewer";
import DiagramViewer from "./_components/templates/diagramViewer";
import DetailsViewer from "./_components/templates/detailsViewer";
import InitialModal from "./_components/templates/initialModal";
import ViewModeSelector from "./_components/ingredients/viewModeSelector";
import { useUiStore } from "@/lib/client/stores/uiStore";
import { useRouteScroll } from "./_components/hooks/useRouteScroll";
import { motion } from "framer-motion";
import { postDataToServerWithJson, getDataFromServerWithJson } from "@/lib/client/helpers";
import { CursorResponse, useInfiniteScroll } from "@/lib/client/hooks/useInfiniteScroll";

type Props = {
  route: Route;
  currentUser?: User | null;
};

// RouteItemのフラット化された配列を作成するヘルパー
function getFlattenedItems(route: Route) {
  const items: any[] = [];

  if (route.routeDates && route.routeDates.length > 0) {
    route.routeDates.forEach((date) => {
      // 日付セパレーター
      items.push({
        type: "day_separator",
        day: date.day,
        id: `day-${date.id}`,
        index: items.length,
      });

      date.routeNodes.forEach((node) => {
        // 経由地
        items.push({
          type: "node",
          data: node,
          id: `node-${node.id}`,
          index: items.length,
        });

        // 交通手段（経由地間の移動）
        if (node.transitSteps && node.transitSteps.length > 0) {
          node.transitSteps.forEach((step) => {
            items.push({
              type: "transit",
              data: step,
              id: `transit-${step.id}`,
              index: items.length,
            });
          });
        }
      });
    });
  } else if ((route as any).routeNodes) {
    // 旧データ用フォールバック
    (route as any).routeNodes.forEach((node: any) => {
      items.push({
        type: "node",
        data: node,
        id: `node-${node.id}`,
        index: items.length,
      });
      if (node.transitSteps && node.transitSteps.length > 0) {
        node.transitSteps.forEach((step: any) => {
          items.push({
            type: "transit",
            data: step,
            id: `transit-${step.id}`,
            index: items.length,
          });
        });
      }
    });
  }
  return items;
}

export default function RootClient({ route, currentUser }: Props) {
    const items = useMemo(() => getFlattenedItems(route), [route.id]);
  const [viewMode, setViewMode] = useState<"diagram" | "details" | "map">("details");
  const [infoTab, setInfoTab] = useState<"comments" | "related">("comments");
  const [isMobile, setIsMobile] = useState(false);

  // 関連記事 (Related Routes) — 共通フック経由で error/retry 込みの無限スクロール
  const {
    items: relatedRoutes,
    isFetching: isFetchingRelated,
    hasMore: relatedHasMore,
    error: relatedError,
    fetchMore: fetchMoreRelated,
    retry: retryRelated,
  } = useInfiniteScroll<Route>({
    fetcher: (cursor) => {
      if (!route.id) return Promise.resolve(null);
      const url = cursor
        ? `/api/v1/routes?type=related&targetId=${route.id}&limit=15&cursor=${encodeURIComponent(cursor)}`
        : `/api/v1/routes?type=related&targetId=${route.id}&limit=15`;
      return getDataFromServerWithJson<CursorResponse<Route>>(url);
    },
    deps: [route.id],
  });
  const relatedLoading = relatedRoutes === null && !relatedError;

  const scrollDirection = useUiStore((state) => state.scrollDirection);
  const [yOffset, setYOffset] = useState(0);

  const {
    focusIndex,
    scrollContainerRef,
    itemRefs,
    handleDiagramClick,
  } = useRouteScroll({
    items,
    isMobile,
    viewMode,
    setViewMode,
  });

  const updateOffset = useCallback(() => {
    if (window.innerWidth >= 768) {
      setYOffset(0);
    } else {
      setYOffset(50);
    }
  }, []);

  useEffect(() => {
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [updateOffset]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Minimal view tracking: post once per session when page opens
  useEffect(() => {
    if (!currentUser?.id) return; // only for logged-in users
    if (!route?.id) return;
    const key = `viewed:${route.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    postDataToServerWithJson(`/api/v1/views`, { routeId: route.id }).catch(() => {
      // ignore errors; UI shouldn't break
    });
  }, [currentUser?.id, route?.id]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <InitialModal route={route} />

      <div className={`flex h-full w-full overflow-hidden relative flex-col md:flex-row`}>
        <ViewModeSelector
          viewMode={viewMode}
          setViewMode={setViewMode}
          isMobile={isMobile}
          scrollDirection={scrollDirection}
          yOffset={yOffset}
        />

        {/* ダイアグラム (w-1/4 or fixed width) */}
        <motion.div
          layout
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full md:w-1/4 md:min-w-[320px] h-full ${viewMode === 'map' ? 'md:order-2' : 'md:order-1'}`}
        >
          <DiagramViewer
            items={items}
            focusIndex={focusIndex}
            viewMode={viewMode}
            isMobile={isMobile}
            onItemClick={handleDiagramClick}
            relatedRoutes={relatedRoutes ?? []}
            relatedLoading={relatedLoading}
            isFetchingRelated={isFetchingRelated}
            fetchMoreRelated={fetchMoreRelated}
            relatedHasMore={relatedHasMore}
            relatedError={relatedError}
            retryRelated={retryRelated}
          />
        </motion.div>

        {/* 詳細コンテンツ または マップ */}
        <motion.div
          layout
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`flex-1 relative md:overflow-hidden min-h-screen ${viewMode === "diagram" ? "max-md:hidden" : ""} ${viewMode === 'map' ? 'md:order-1' : 'md:order-2'}`}
        >
          {/* DETAILS VIEW */}
          <DetailsViewer
            route={route}
            currentUser={currentUser}
            items={items}
            focusIndex={focusIndex}
            viewMode={viewMode}
            infoTab={infoTab}
            setInfoTab={setInfoTab}
            isMobile={isMobile}
            scrollContainerRef={scrollContainerRef}
            itemRefs={itemRefs}
            relatedRoutes={relatedRoutes ?? []}
            relatedLoading={relatedLoading}
            isFetchingRelated={isFetchingRelated}
            fetchMoreRelated={fetchMoreRelated}
            relatedHasMore={relatedHasMore}
            relatedError={relatedError}
            retryRelated={retryRelated}
          />

          {/* MAP VIEW */}
          <div
            className={`md:absolute md:inset-0 max-md:fixed max-md:inset-0 h-screen transition-all duration-500 ease-[0.22, 1, 0.36, 1] ${
              viewMode === "map" ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none invisible"
            }`}
          >
            <MapViewer route={route} focusIndex={focusIndex} items={items} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
