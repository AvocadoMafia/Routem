"use client";

import { Route } from "@/lib/types/domain";
import { ErrorScheme } from "@/lib/types/error";
import { MessageSquare, BookOpen } from "lucide-react";
import { HiHeart } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, RefObject } from "react";
import { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import RelatedArticles from "./relatedArticles";
import WaypointItem from "../ingredients/waypointItem";
import TransitItem from "../ingredients/transitItem";
import RouteHeader from "../ingredients/routeHeader";
import AuthorSection from "../ingredients/authorSection";
import RouteMetadataSection from "../ingredients/routeMetadataSection";
import CategoryTags from "../ingredients/categoryTags";
import LikeButton from "../ingredients/likeButton";
import { getIsLikedByMe } from "@/lib/hooks/useLike";
import ShareButton from "../ingredients/shareButton";
import ImportButton from "../ingredients/importButton";
import CommentSection from "./commentSection";
import { getTransitIcon } from "../ingredients/transitIcon";

type Props = {
  route: Route;
  items: any[];
  focusIndex: number;
  viewMode: "diagram" | "details" | "map";
  infoTab?: "comments" | "related";
  setInfoTab?: (tab: "comments" | "related") => void;
  isMobile: boolean;
  currentUser?: User | null;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  itemRefs: RefObject<(HTMLDivElement | null)[]>;
  relatedRoutes: Route[];
  relatedLoading: boolean;
  isFetchingRelated: boolean;
  fetchMoreRelated: () => Promise<void>;
  relatedHasMore: boolean;
  relatedError?: ErrorScheme | null;
  retryRelated?: () => Promise<void>;
};

export default function DetailsViewer({
  route,
  items,
  focusIndex,
  viewMode,
  infoTab = "comments",
  setInfoTab,
  isMobile,
  currentUser,
  scrollContainerRef,
  itemRefs,
  relatedRoutes,
  relatedLoading,
  isFetchingRelated,
  fetchMoreRelated,
  relatedHasMore,
  relatedError,
  retryRelated,
}: Props) {
  const t = useTranslations('routes');
  const isLikedByMe = getIsLikedByMe(route.likes, currentUser?.id);

  return (
    <div
      ref={scrollContainerRef}
      className={`w-full h-full overflow-y-scroll px-8 pt-4 pb-40 flex flex-col gap-10 transition-all duration-500 ${
        viewMode === "details"
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12 pointer-events-none invisible max-md:hidden max-md:h-0 max-md:overflow-hidden"
      }`}
    >
      <RouteHeader route={route} currentUser={currentUser} />

      {items.map((item, idx) => (
        <div key={idx} ref={(el) => {
          if (itemRefs.current) {
            itemRefs.current[idx] = el;
          }
        }}>
          {item.type === "day_separator" ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                <div className="text-4xl font-black text-accent-0">Day {item.day}</div>
                <div className="flex-1 h-px bg-accent-0/20" />
              </div>
            </div>
          ) : item.type === "node" ? (
            <WaypointItem
              idx={idx}
              data={item.data}
              isFocused={focusIndex === idx}
            />
          ) : (
            <TransitItem
              data={item.data}
              isFocused={focusIndex === idx}
            />
          )}
        </div>
      ))}
      
      {/* ルートを気に入った場合のいいねボタン */}
      <div className="flex flex-col items-center gap-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground-1">{t('enjoyRoute')}</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <LikeButton 
            routeId={route.id} 
            initialLikesCount={route.likes?.length ?? 0} 
            initialIsLiked={isLikedByMe}
            variant="large"
            className="w-full"
          />
          <ShareButton variant="large" className="w-full" />
          <ImportButton route={route} variant="large" className="w-full" />
        </div>
      </div>

      {/* 情報エリア (投稿者, カテゴリー, タグ, コメント/関連記事) */}
      <div
        ref={(el) => {
          if (itemRefs.current) {
            itemRefs.current[items.length] = el;
          }
        }}
        className={`transition-all duration-700 ease-[0.22, 1, 0.36, 1] border-t pt-16 border-grass ${
          focusIndex === items.length ? "opacity-100" : "opacity-40"
        }`}
      >
        <div className="flex flex-col gap-12">
          <div className="max-w-4xl flex flex-col gap-12">
            <AuthorSection author={route.author} />
            <RouteMetadataSection route={route} />
            <CategoryTags tags={route.tags} />
          </div>

          {/* 下部: タブ切り替えエリア (Comments / Related Articles) */}
          <div className="flex flex-col gap-8 pt-8 border-t border-grass/20">
            {isMobile && (
              <div className="flex items-center gap-8 border-b border-foreground-0/5 max-w-4xl">
                <button
                  onClick={() => setInfoTab?.("related")}
                  className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${
                    infoTab === "related" ? "text-accent-0" : "text-foreground-1 hover:text-foreground-0"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{t('relatedArticles')}</span>
                  </div>
                  {infoTab === "related" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />
                  )}
                </button>
                <button
                  onClick={() => setInfoTab?.("comments")}
                  className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${
                    infoTab === "comments" ? "text-accent-0" : "text-foreground-1 hover:text-foreground-0"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{t('comments')}</span>
                  </div>
                  {infoTab === "comments" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />
                  )}
                </button>
              </div>
            )}

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {isMobile ? (
                  infoTab === "related" ? (
                    <motion.div
                      key="related"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="w-full max-w-4xl"
                    >
                      <RelatedArticles
                        routes={relatedRoutes}
                        loading={relatedLoading}
                        fetchingMore={isFetchingRelated}
                        fetchMore={fetchMoreRelated}
                        hasMore={relatedHasMore}
                        error={relatedError}
                        onRetry={retryRelated}
                      />
                    </motion.div>
                  ) : (
                    <div className="max-w-4xl">
                      <CommentSection key="comments" isMobile={isMobile} routeId={route.id} />
                    </div>
                  )
                ) : (
                  <div key="comments-desktop" className="w-full">
                    <CommentSection isMobile={isMobile} routeId={route.id} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
