"use client";

import { Route } from "@/lib/client/types";
import { MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ReactNode, RefObject } from "react";

type Props = {
  items: any[];
  focusIndex: number;
  viewMode: "diagram" | "details" | "map";
  scrollContainerRef: RefObject<HTMLDivElement>;
  itemRefs: RefObject<(HTMLDivElement | null)[]>;
  getTransitIcon: (mode: string) => ReactNode;
};

export default function DetailsViewer({
  items,
  focusIndex,
  viewMode,
  scrollContainerRef,
  itemRefs,
  getTransitIcon,
}: Props) {
  return (
    <div
      ref={scrollContainerRef}
      className={`w-full h-full overflow-y-scroll px-4 pt-4 pb-40 flex flex-col gap-16 transition-all duration-500 ${
        viewMode === "details"
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-12 pointer-events-none invisible max-md:hidden max-md:h-0 max-md:overflow-hidden"
      }`}
    >
      {items.map((item, idx) => (
        <div
          key={item.id}
          ref={(el) => {
            if (itemRefs.current) {
              itemRefs.current[idx] = el;
            }
          }}
          className={`transition-all duration-700 ease-[0.22, 1, 0.36, 1] ${
            focusIndex === idx
              ? "opacity-100"
              : "opacity-40"
          }`}
        >
          {item.type === "node" ? (
            <div className="max-w-4xl overflow-x-hidden">
              <div className="flex flex-col gap-4 mb-16">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-accent-0" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
                    Waypoint {Math.floor(idx / 2) + 1}
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-medium text-foreground-0 tracking-[0.05em] uppercase leading-tight break-words">
                  {item.data.spot?.name || "Waypoint"}
                </h2>
              </div>

              {item.data.images && item.data.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                  {item.data.images.map((img: any, i: number) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="relative aspect-[16/10] overflow-hidden"
                    >
                      <Image
                        src={img.url}
                        alt="spot image"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="max-w-2xl">
                <p className="text-lg md:text-xl leading-relaxed text-foreground-0/80 font-normal whitespace-pre-wrap break-words">
                  {item.data.details || "No description provided."}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl overflow-x-hidden">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-6 md:gap-12 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="text-accent-0">
                      {getTransitIcon(item.data.mode)}
                    </div>
                    <h2 className="text-xl font-bold text-foreground-0 tracking-widest uppercase">
                      {item.data.mode}
                    </h2>
                  </div>
                  {item.data.duration && (
                    <div className="flex items-center gap-3 text-foreground-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold tracking-tighter">
                        {item.data.duration} min
                      </span>
                    </div>
                  )}
                </div>
                {item.data.memo && (
                  <p className="text-sm text-foreground-1 font-medium italic">
                    {item.data.memo}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      {/* 最後の余白 */}
      <div className="md:h-[50vh]" />
    </div>
  );
}
