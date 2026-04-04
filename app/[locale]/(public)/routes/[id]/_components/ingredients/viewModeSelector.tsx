"use client";

import { motion } from "framer-motion";
import { List, Map as MapIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  viewMode: "diagram" | "details" | "map";
  setViewMode: (mode: "diagram" | "details" | "map") => void;
  isMobile: boolean;
  scrollDirection?: "up" | "down" | "left" | "right";
  yOffset?: number;
};

export default function ViewModeSelector({
  viewMode,
  setViewMode,
  isMobile,
  scrollDirection,
  yOffset,
}: Props) {
  const t = useTranslations('viewMode');

  return (
    <motion.div
      animate={{
        y: isMobile ? (scrollDirection === "down" ? 100 : 0) : 0,
        opacity: isMobile ? (scrollDirection === "down" ? 0 : 1) : 1,
      }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="md:absolute fixed bottom-6 md:top-6 w-fit h-fit left-1/2 -translate-x-1/2 z-50 flex items-center backdrop-blur-xl border border-foreground-0/5 rounded-full p-1 shadow-2xl shadow-black/5 max-w-[95vw] overflow-x-auto no-scrollbar overflow-y-hidden"
    >
      <button
        onClick={() => setViewMode("diagram")}
        className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
          viewMode === "diagram"
            ? "bg-accent-0 text-white shadow-lg shadow-accent-0/20"
            : "text-foreground-1 hover:text-foreground-0"
        } ${!isMobile && "hidden"}`}
      >
        <List className="w-3.5 h-3.5" />
        <span>{t('diagram').toUpperCase()}</span>
      </button>
      <button
        onClick={() => setViewMode("details")}
        className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
          viewMode === "details"
            ? "bg-accent-0 text-white shadow-lg shadow-accent-0/20"
            : "text-foreground-1 hover:text-foreground-0"
        }`}
      >
        <List className="w-3.5 h-3.5" />
        <span>{t('details').toUpperCase()}</span>
      </button>
      <button
        onClick={() => setViewMode("map")}
        className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
          viewMode === "map"
            ? "bg-accent-0 text-white shadow-lg shadow-accent-0/20"
            : "text-foreground-1 hover:text-foreground-0"
        }`}
      >
        <MapIcon className="w-3.5 h-3.5" />
        <span>{t('mapView').toUpperCase()}</span>
      </button>
    </motion.div>
  );
}
