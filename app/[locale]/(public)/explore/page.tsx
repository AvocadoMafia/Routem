"use client";

import ExploreCard from "@/app/[locale]/(public)/explore/_components/templates/exploreCard";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RouteCardBasic from "@/app/[locale]/_components/common/templates/routeCardBasic";
import RouteCardBasicSkeleton from "@/app/[locale]/_components/common/ingredients/routeCardBasicSkeleton";
import { Route } from "@/lib/types/domain";
import { ErrorScheme } from "@/lib/types/error";
import { getDataFromServerWithJson, toErrorScheme } from "@/lib/api/client";
import { useTranslations } from "next-intl";
import { errorStore } from "@/lib/stores/errorStore";
import SectionErrorState from "@/app/[locale]/_components/common/ingredients/sectionErrorState";

type ExploreResponse = {
  items: Route[];
  nextOffset: number | null;
};

const LIMIT = 20;

function ExploreContent() {
  const t = useTranslations("explore");
  const tCommon = useTranslations("common");
  const searchParams = useSearchParams();
  const hasParams = Array.from(searchParams.keys()).length > 0;

  const [routes, setRoutes] = useState<Route[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<ErrorScheme | null>(null);
  const appendError = errorStore(state => state.appendError);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  // retry 用: 直近どの offset で失敗したか
  const lastOffsetRef = useRef<number>(0);

  const queryString = useMemo(() => searchParams.toString(), [searchParams]);

  const buildApiUrl = (offset: number) => {
      const currentParams = new URLSearchParams(queryString);
      const params = new URLSearchParams();
      const q = currentParams.get("q");
      const lat = currentParams.get("lat");
      const lng = currentParams.get("lng");
      const when = currentParams.get("when");
      const days = currentParams.get("days");
      const who = currentParams.get("who");
      const currencyCode = currentParams.get("currencyCode");
      const minAmount = currentParams.get("minAmount");
      const maxAmount = currentParams.get("maxAmount");

      if (q) params.set("q", q);
      if (lat && lng) {
        params.set("lat", lat);
        params.set("lng", lng);
      }
      if (when) params.set("when", when);
      if (days) params.set("days", days);
      if (who) params.set("who", who);
      if (currencyCode) params.set("currencyCode", currencyCode);
      if (minAmount) params.set("minAmount", minAmount);
      if (maxAmount) params.set("maxAmount", maxAmount);
      params.set("limit", String(LIMIT));
      params.set("offset", String(offset));

      return `/api/v1/routes/explore?${params.toString()}`;
  };

  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const fetchExploreResults = useCallback(async (offset: number) => {
    if (isFetchingRef.current || !hasMoreRef.current) return;
    lastOffsetRef.current = offset;
    setIsFetching(true);
    setError(null);
    try {
      const res = await getDataFromServerWithJson<ExploreResponse>(buildApiUrl(offset));
      if (!res) return;

      if (offset === 0) {
        setRoutes(res.items ?? []);
      } else {
        setRoutes((prev) => {
          const ids = new Set(prev.map((r) => r.id));
          const merged = (res.items ?? []).filter((r) => !ids.has(r.id));
          return [...prev, ...merged];
        });
      }
      setHasMore(res.nextOffset !== null);
    } catch (e: unknown) {
      const scheme = toErrorScheme(e);
      setError(scheme);
      appendError(scheme);
    } finally {
      setIsFetching(false);
    }
  }, [queryString, appendError]);

  const retry = useCallback(async () => {
    // 直近失敗した offset からやり直し
    await fetchExploreResults(lastOffsetRef.current);
  }, [fetchExploreResults]);

  useEffect(() => {
    if (!hasParams) {
      setRoutes([]);
      setHasMore(true);
      hasMoreRef.current = true;
      setError(null);
      return;
    }

    setRoutes([]);
    setHasMore(true);
    hasMoreRef.current = true;
    setError(null);
    fetchExploreResults(0);
  }, [hasParams, queryString, fetchExploreResults]);

  // error 状態の時は自動 fetchMore を止める (無限再試行ループ防止)
  useEffect(() => {
    if (error) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !isFetchingRef.current && !error) {
          fetchExploreResults(routes.length);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [routes.length, fetchExploreResults, error]);

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-row">
      <AnimatePresence>
        {!hasParams && (
          <motion.div
            key="background-image"
            className="absolute inset-0 z-0"
            initial={{ opacity: 1, y: "0%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >

            <img className="w-full h-full object-cover" src="https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/explore-bg.webp" alt="background" />
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.15) 40%, transparent 55%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(0,0,0,0.4) 70%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(0,0,0,0.4) 70%, black 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className={`relative w-full h-full flex flex-col md:flex-row md:p-0 p-4 ${hasParams ? "justify-start" : "items-center justify-center"}`}
        transition={{ layout: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } }}
      >
        <ExploreCard isSidebar={hasParams} />

        <AnimatePresence mode="wait">
          {hasParams && (
            <motion.div
              key="results-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 h-full md:p-6 p-0 overflow-y-auto"
            >
              <div className="max-w-5xl mx-auto flex flex-col gap-8 md:gap-16">
                <div className="flex flex-col gap-4 md:gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-8 md:h-10 w-1 bg-accent-0 rounded-full" />
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground-0 tracking-tight">
                      {t("discovery")}
                    </h2>
                  </div>
                  <p className="text-foreground-1 text-xs md:text-sm tracking-[0.1em] font-medium ml-5">
                    {t("showingResultsFor")} <span className="text-accent-0 font-bold">"{searchParams.get("what") || searchParams.get("where") || searchParams.get("q") || "-"}"</span> - {t("routesFound", { count: routes.length })}
                  </p>
                </div>

                {/* 初回取得失敗: セクション全体を error UI に差し替え */}
                {error && routes.length === 0 && (
                  <SectionErrorState error={error} onRetry={retry} />
                )}

                {!error && isFetching && routes.length === 0 && <p className="text-foreground-1">{tCommon("loading")}</p>}
                {!error && !isFetching && routes.length === 0 && (
                  <p className="text-foreground-1">{t("routesFound", { count: 0 })}</p>
                )}

                {routes.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 md:gap-12 pb-24 md:pb-0">
                    {routes.map((route, idx) => (
                      <motion.div
                        key={route.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.05, duration: 0.4, ease: "easeOut" }}
                      >
                        <RouteCardBasic route={route} />
                      </motion.div>
                    ))}

                    {hasMore && !error && (
                      <>
                        {Array.from({ length: 30 }).map((_, idx) => (
                          <RouteCardBasicSkeleton
                            key={`explore-skeleton-${idx}`}
                            isFirst={idx === 0}
                            observerTarget={observerTarget}
                          />
                        ))}
                      </>
                    )}

                    {/* 追加ロード失敗: リスト末尾に inline retry */}
                    {error && (
                      <SectionErrorState variant="inline" error={error} onRetry={retry} />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function ExplorePageFallback() {
  const t = useTranslations("common");
  return <div>{t("loading")}</div>;
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageFallback />}>
      <ExploreContent />
    </Suspense>
  );
}
