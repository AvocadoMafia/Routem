"use client";

import { motion } from "framer-motion";
import { List, Map as MapIcon } from "lucide-react";

type Props = {
  viewMode: "diagram" | "details" | "map";
  setViewMode: (mode: "diagram" | "details" | "map") => void;
  isMobile: boolean;
  scrollDirection: "up" | "down" | "left" | "right";
  yOffset: number;
};

export default function ViewModeSelector({
  viewMode,
  setViewMode,
  isMobile,
  scrollDirection,
  yOffset,
}: Props) {
  return (
    <motion.div
      animate={{
        bottom: isMobile ? (scrollDirection === "down" ? 24 : yOffset + 24) : "auto",
        top: !isMobile ? 24 : "auto",
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className="md:absolute fixed w-fit h-fit left-1/2 -translate-x-1/2 z-50 flex items-center backdrop-blur-xl border border-foreground-0/5 rounded-full p-1 shadow-2xl shadow-black/5 max-w-[95vw] overflow-x-auto no-scrollbar overflow-y-hidden"
    >
      <button
        onClick={() => setViewMode("diagram")}
        className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
          viewMode === "diagram"
            ? "bg-accent-1 text-white shadow-lg shadow-accent-1/20"
            : "text-foreground-1 hover:text-foreground-0"
        } ${!isMobile && "hidden"}`}
      >
        <List className="w-3.5 h-3.5" />
        <span>DIAGRAM</span>
      </button>
      <button
        onClick={() => setViewMode("details")}
        className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
          viewMode === "details"
            ? "bg-accent-1 text-white shadow-lg shadow-accent-1/20"
            : "text-foreground-1 hover:text-foreground-0"
        }`}
      >
        <List className="w-3.5 h-3.5" />
        <span>DETAILS</span>
      </button>
      <button
        onClick={() => setViewMode("map")}
        className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
          viewMode === "map"
            ? "bg-accent-1 text-white shadow-lg shadow-accent-1/20"
            : "text-foreground-1 hover:text-foreground-0"
        }`}
      >
        <MapIcon className="w-3.5 h-3.5" />
        <span>MAP VIEW</span>
      </button>
    </motion.div>
  );
}
