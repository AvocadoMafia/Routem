"use client";

import { BookOpen } from "lucide-react";
import RouteCardWidely from "@/app/[locale]/_components/common/templates/routeCardWidely";
import RouteCardWidelySkeleton from "@/app/[locale]/_components/common/ingredients/routeCardWidelySkeleton";
import SectionErrorState from "@/app/[locale]/_components/common/ingredients/sectionErrorState";
import { Route } from "@/lib/types/domain";
import { ErrorScheme } from "@/lib/types/error";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

type Props = {
  routes: Route[];
  loading: boolean;
  fetchingMore?: boolean;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
  compact?: boolean;
  error?: ErrorScheme | null;
  onRetry?: () => Promise<void>;
};

export default function RelatedArticles({
  routes,
  loading,
  fetchingMore: isFetching,
  fetchMore,
  hasMore,
  compact = false,
  error,
  onRetry,
}: Props) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const t = useTranslations('routes');

  // error 状態では自動 fetchMore を止める。retry ボタンで明示的に。
  useEffect(() => {
    if (error) return;
    const target = observerTarget.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !loading) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.unobserve(target);
  }, [hasMore, fetchMore, isFetching, loading, error]);

  const dummyCards = Array.from({ length: 15 }).map((_, i) => (
    <RouteCardWidelySkeleton
      key={`dummy-${i}`}
      isFirst={i === 0}
      observerTarget={observerTarget}
    />
  ));

  // --- error 初回 (まだ1件も無い) ---
  if (error && routes.length === 0 && !loading) {
    return (
      <div className="flex flex-col gap-8 w-full">
        <div className="flex-col gap-2 px-1 hidden md:flex">
          <div className="flex items-center gap-2 text-accent-0">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">{t('relatedArticles')}</span>
          </div>
        </div>
        <SectionErrorState error={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex-col gap-2 px-1 hidden md:flex">
        <div className="flex items-center gap-2 text-accent-0">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-[0.2em]">{t('relatedArticles')}</span>
        </div>
      </div>

      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'}`}>
        {routes.map((route, idx) => (
          <RouteCardWidely key={route.id ?? idx} route={route} isLinkCard={true} />
        ))}
        {hasMore && !error && dummyCards}
      </div>

      {/* 追加ロード失敗 */}
      {error && routes.length > 0 && (
        <SectionErrorState variant="inline" error={error} onRetry={onRetry} />
      )}

      {!loading && !error && routes.length === 0 && (
        <div className="w-full py-10 text-center text-foreground-1/50 italic">
          {t('noRelatedArticles')}
        </div>
      )}
    </div>
  );
}
