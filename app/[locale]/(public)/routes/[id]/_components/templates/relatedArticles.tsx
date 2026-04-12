"use client";

import { BookOpen } from "lucide-react";
import RouteCardWidely from "@/app/[locale]/_components/common/templates/routeCardWidely";
import RouteCardWidelySkeleton from "@/app/[locale]/_components/common/ingredients/routeCardWidelySkeleton";
import { Route } from "@/lib/client/types";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

type Props = {
  routes: Route[];
  loading: boolean;
    fetchingMore?: boolean;
    fetchMore: () => Promise<void>;
    hasMore: boolean;
    compact?: boolean;
};

export default function RelatedArticles({
  routes,
  loading,
  fetchingMore: isFetching,
  fetchMore,
  hasMore,
  compact = false
}: Props) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const t = useTranslations('routes');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !loading) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, fetchMore, isFetching, loading]);

  // ダミーカードの生成（15個）
  const dummyCards = Array.from({ length: 15 }).map((_, i) => (
    <RouteCardWidelySkeleton 
      key={`dummy-${i}`} 
      isFirst={i === 0}
      observerTarget={observerTarget}
    />
  ));

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2 px-1 hidden md:flex">
        <div className="flex items-center gap-2 text-accent-0">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-[0.2em]">{t('relatedArticles')}</span>
        </div>
      </div>

      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'}`}>
        {routes.map((route, idx) => (
          <RouteCardWidely key={route.id ?? idx} route={route} isLinkCard={true} />
        ))}
        {hasMore && dummyCards}
      </div>
      
      {!loading && routes.length === 0 && (
        <div className="w-full py-10 text-center text-foreground-1/50 italic">
          {t('noRelatedArticles')}
        </div>
      )}
    </div>
  );
}
