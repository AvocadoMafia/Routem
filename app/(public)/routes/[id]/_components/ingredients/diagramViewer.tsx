"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { ReactNode } from "react";

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
  getTransitIcon: (mode: string) => ReactNode;
};

export default function DiagramViewer({
  items,
  focusIndex,
  viewMode,
  isMobile,
  onItemClick,
  getTransitIcon,
}: Props) {
  return (
    <div
      className={`w-full h-full overflow-y-scroll p-6  backdrop-blur-2xl z-10 transition-all duration-500 ${
        viewMode === "diagram"
          ? "opacity-100 translate-x-0"
          : "max-md:hidden max-md:opacity-0 max-md:-translate-x-full"
      } ${viewMode === "map" ? "md:border-l" : "md:border-r"} border-foreground-0/5`}
    >
      <div className="relative space-y-4">
        {/* 背景の垂直線 */}
        <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-accent-0/20 pointer-events-none" />

        {items.map((item, idx) => (
          <div key={item.id} className="relative z-10 flex items-center gap-4">
            {/* アイコン部分 (Node風) */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  focusIndex === idx
                    ? "bg-accent-0 border-accent-0 text-white shadow-lg shadow-accent-0/20 scale-110"
                    : "bg-background-0 border-accent-0/20 text-accent-0/40"
                }`}
              >
                {item.type === "node" ? (
                  <MapPin className="w-5 h-5" />
                ) : (
                  getTransitIcon(item.data.mode)
                )}
              </div>
            </div>

            {/* カード部分 */}
            <motion.button
              onClick={() => onItemClick(idx)}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={`flex-1 p-4 rounded-2xl transition-all text-left relative overflow-hidden group ${
                focusIndex === idx
                  ? "border border-accent-0 shadow-md"
                  : "border border-foreground-0/5 hover:border-accent-0/30"
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                    focusIndex === idx ? "text-accent-0" : "text-foreground-1/60"
                  }`}
                >
                  {item.type === "node"
                    ? `Waypoint ${Math.floor(idx / 2) + 1}`
                    : item.data.mode}
                </span>
                <p
                  className={`font-bold truncate text-sm tracking-tight ${
                    focusIndex === idx ? "text-foreground-0" : "text-foreground-1"
                  }`}
                >
                  {item.type === "node"
                    ? item.data.spot?.name || "Waypoint"
                    : `${item.data.duration || "0"} min`}
                </p>
              </div>
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
}
