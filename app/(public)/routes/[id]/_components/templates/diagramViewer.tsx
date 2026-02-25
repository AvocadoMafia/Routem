"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import RelatedArticles from "./relatedArticles";
import DiagramCard from "../ingredients/diagramCard";

type DiagramItem = {
  type: "node" | "transit";
  data: any;
  id: string;
  index: number;
};

type Props = {
  items: DiagramItem[];
  focusIndex: number;
  viewMode: "diagram" | "details" | "map";
  isMobile: boolean;
  onItemClick: (index: number) => void;
};

export default function DiagramViewer({
  items,
  focusIndex,
  viewMode,
  isMobile,
  onItemClick,
}: Props) {
  const isInfoAreaFocused = !isMobile && viewMode !== "map" && focusIndex >= items.length;

  return (
    <div
      className={`w-full h-full overflow-y-scroll p-6 backdrop-blur-2xl z-10 transition-all duration-500 ${
        viewMode === "diagram"
          ? "opacity-100 translate-x-0"
          : "max-md:hidden max-md:opacity-0 max-md:-translate-x-full"
      } ${viewMode === "map" ? "md:border-l" : "md:border-r"} border-foreground-0/5`}
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

            {items.map((item, idx) => (
              <DiagramCard
                key={item.id}
                item={item}
                idx={idx}
                isFocused={focusIndex === idx}
                onItemClick={onItemClick}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="related"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <RelatedArticles compact />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
