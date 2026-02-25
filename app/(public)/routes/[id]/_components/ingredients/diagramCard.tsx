"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import TransitIcon from "./transitIcon";

type DiagramCardProps = {
  item: {
    type: "node" | "transit";
    data: any;
    index: number;
  };
  idx: number;
  isFocused: boolean;
  onItemClick: (index: number) => void;
};

export default function DiagramCard({
  item,
  idx,
  isFocused,
  onItemClick,
}: DiagramCardProps) {
  return (
    <div className="relative z-10 flex items-center gap-4">
      {/* アイコン部分 (Node風) */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
            isFocused
              ? "bg-accent-0 border-accent-0 text-white shadow-lg shadow-accent-0/20 scale-110"
              : "bg-background-0 border-accent-0/20 text-accent-0/40"
          }`}
        >
          {item.type === "node" ? (
            <MapPin className="w-5 h-5" />
          ) : (
            <TransitIcon mode={item.data.mode} />
          )}
        </div>
      </div>

      {/* カード部分 */}
      <motion.button
        onClick={() => onItemClick(idx)}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`flex-1 p-4 rounded-2xl transition-all text-left relative overflow-hidden group ${
          isFocused
            ? "border border-accent-0 shadow-md"
            : "border border-foreground-0/5 hover:border-accent-0/30"
        }`}
      >
        <div className="flex flex-col min-w-0">
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-1 ${
              isFocused ? "text-accent-0" : "text-foreground-1/60"
            }`}
          >
            {item.type === "node"
              ? `Waypoint ${Math.floor(idx / 2) + 1}`
              : item.data.mode}
          </span>
          <p
            className={`font-bold truncate text-sm tracking-tight ${
              isFocused ? "text-foreground-0" : "text-foreground-1"
            }`}
          >
            {item.type === "node"
              ? item.data.spot?.name || "Waypoint"
              : `${item.data.duration || "0"} min`}
          </p>
        </div>
      </motion.button>
    </div>
  );
}
