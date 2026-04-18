"use client";

import { motion, AnimatePresence } from "framer-motion";
import RelatedArticles from "./relatedArticles";
import DiagramCard from "../ingredients/diagramCard";
import { ErrorScheme } from "@/lib/client/types";

type DiagramItem = {
  type: "node" | "transit" | "day_separator";
  data?: any;
  day?: number;
  id: string;
  index: number;
};

type Props = {
  items: DiagramItem[];
  focusIndex: number;
  viewMode: "diagram" | "details" | "map";
  isMobile: boolean;
  onItemClick: (index: number) => void;
  relatedRoutes: any[]; // Or properly import Route type
  relatedLoading: boolean;
  isFetchingRelated: boolean;
  fetchMoreRelated: () => Promise<void>;
  relatedHasMore: boolean;
  relatedError?: ErrorScheme | null;
  retryRelated?: () => Promise<void>;
};

export default function DiagramViewer({
  items,
  focusIndex,
  viewMode,
  isMobile,
  onItemClick,
  relatedRoutes,
  relatedLoading,
  isFetchingRelated,
  fetchMoreRelated,
  relatedHasMore,
  relatedError,
  retryRelated,
}: Props) {
  const isInfoAreaFocused = !isMobile && viewMode !== "map" && focusIndex >= items.length;

  return (
    <div
      className={`w-full h-full overflow-y-scroll no-scrollbar p-6 backdrop-blur-2xl z-10 transition-all duration-500 ${
        viewMode === "diagram"
          ? "opacity-100 translate-x-0"
          : "max-md:hidden max-md:opacity-0 max-md:-translate-x-full"
      } ${viewMode === "map" ? "md:border-l" : "md:border-r"} border-grass`}
    >
      <AnimatePresence mode="wait">
        {!isInfoAreaFocused ? (
          <motion.div
            key="diagram"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative space-y-4"
          >
            {/* 背景の垂直線 */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-accent-0/20 pointer-events-none" />

            {items.map((item, idx) => {
              if (item.type === "day_separator") {
                return (
                  <div key={idx} className="relative z-10 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent-0" />
                      </div>
                      <h3 className="text-lg font-black text-foreground-0">Day {item.day}</h3>
                      <div className="flex-1 h-px bg-accent-0/20" />
                    </div>
                  </div>
                );
              }
              return (
                <DiagramCard
                  key={idx}
                  item={item as any}
                  idx={idx}
                  isFocused={focusIndex === idx}
                  onItemClick={onItemClick}
                />
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="related"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <RelatedArticles
              routes={relatedRoutes}
              loading={relatedLoading}
              fetchingMore={isFetchingRelated}
              fetchMore={fetchMoreRelated}
              hasMore={relatedHasMore}
              error={relatedError}
              onRetry={retryRelated}
              compact
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
