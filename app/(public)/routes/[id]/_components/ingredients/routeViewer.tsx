"use client";

import { Route } from "@/lib/client/types";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Clock,
  Footprints,
  TrainFront,
  Bus,
  Car,
  ArrowDown,
} from "lucide-react";
import Image from "next/image";

type Props = {
  route: Route;
};

// RouteItemのフラット化された配列を作成するヘルパー
function getFlattenedItems(route: Route) {
  const items: any[] = [];
  route.routeNodes.forEach((node, index) => {
    // 経由地
    items.push({
      type: "node",
      data: node,
      id: `node-${node.id}`,
      index: items.length,
    });

    // 交通手段（経由地間の移動）
    if (node.transitSteps && node.transitSteps.length > 0) {
      node.transitSteps.forEach((step) => {
        items.push({
          type: "transit",
          data: step,
          id: `transit-${step.id}`,
          index: items.length,
        });
      });
    }
  });
  return items;
}

export default function RouteViewer({ route }: Props) {
  const items = useMemo(() => getFlattenedItems(route), [route]);
  const [focusIndex, setFocusIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isManualScrolling = useRef(false);

  // ダイアグラムのカードクリック時のスクロール処理
  const handleDiagramClick = (index: number) => {
    setFocusIndex(index);
    isManualScrolling.current = true;
    const targetElement = itemRefs.current[index];
    if (targetElement && scrollContainerRef.current) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      // スムーズスクロール終了後にフラグを戻す（簡易的）
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 1000);
    }
  };

  // 右側のスクロールを検知してfocusIndexを更新
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const scrollTop = container.scrollTop;
      if (scrollTop <= 10) {
        if (focusIndex !== 0) {
          setFocusIndex(0);
        }
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 3;

      let closestIndex = 0;
      let minDistance = Infinity;

      itemRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const distance = Math.abs(rect.top - containerCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (closestIndex !== focusIndex) {
        setFocusIndex(closestIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [focusIndex]);

  const getTransitIcon = (mode: string) => {
    switch (mode) {
      case "WALK":
        return <Footprints className="w-5 h-5" />;
      case "TRAIN":
        return <TrainFront className="w-5 h-5" />;
      case "BUS":
        return <Bus className="w-5 h-5" />;
      case "CAR":
        return <Car className="w-5 h-5" />;
      default:
        return <Navigation className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* 左側：ダイアグラム (w-1/3 or fixed width) */}
      <div className="w-1/4 min-w-[300px] border-r border-black/5 p-6 overflow-y-auto no-scrollbar flex flex-col items-center bg-background-1">
        <div className="space-y-4 w-full max-w-xs">
          {items.map((item, idx) => (
            <div key={item.id} className="flex flex-col items-center w-full">
              <motion.button
                onClick={() => handleDiagramClick(idx)}
                animate={{
                  scale: focusIndex === idx ? 1.05 : 1,
                  boxShadow:
                    focusIndex === idx
                      ? "0 4px 20px rgba(0,0,0,0.1)"
                      : "0 2px 4px rgba(0,0,0,0.05)",
                }}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  focusIndex === idx
                    ? "bg-background-1 border-accent-0 border-2"
                    : "bg-background-1 border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 ${focusIndex === idx ? "bg-accent-0 text-white" : "bg-grass text-foreground-1"}`}
                  >
                    {item.type === "node" ? (
                      <MapPin className="w-5 h-5" />
                    ) : (
                      getTransitIcon(item.data.mode)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-bold truncate text-sm md:text-base ${focusIndex === idx ? "text-accent-0" : "text-foreground-0"}`}
                    >
                      {item.type === "node"
                        ? item.data.spot?.name || "Waypoint"
                        : item.data.mode}
                    </p>
                    {item.type === "transit" && item.data.duration && (
                      <p className="text-xs text-foreground-1">
                        {item.data.duration} min
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>

              {/* アイテム間の矢印/線 */}
              {idx < items.length - 1 && (
                <div className="h-4 w-px bg-black/10 my-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 右側：詳細コンテンツ (メモ、画像) */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-12 space-y-24 scroll-smooth"
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            className={`transition-opacity duration-500 ${focusIndex === idx ? "opacity-100" : "opacity-40"}`}
          >
            {item.type === "node" ? (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-accent-0/10 text-accent-0 rounded-2xl">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl font-bold text-foreground-0">
                    {item.data.spot?.name || "Waypoint"}
                  </h2>
                </div>

                {item.data.images && item.data.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {item.data.images.map((img: any) => (
                      <div
                        key={img.id}
                        className="relative aspect-video rounded-2xl overflow-hidden shadow-lg"
                      >
                        <Image
                          src={img.url}
                          alt="spot image"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-background-1 p-8 rounded-3xl shadow-sm border border-black/5">
                  <p className="text-xl leading-relaxed text-foreground-1 whitespace-pre-wrap">
                    {item.data.details || "メモはありません"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-accent-1/10 text-accent-1 rounded-2xl">
                    {getTransitIcon(item.data.mode)}
                  </div>
                  <h2 className="text-4xl font-bold text-foreground-0">
                    移動: {item.data.mode}
                  </h2>
                  {item.data.duration && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-grass rounded-full text-foreground-1 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{item.data.duration} min</span>
                    </div>
                  )}
                </div>

                <div className="bg-background-1 p-8 rounded-3xl shadow-sm border border-black/5 italic border-l-4 border-l-accent-1">
                  <p className="text-xl leading-relaxed text-foreground-1 whitespace-pre-wrap">
                    {item.data.memo || "移動メモはありません"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* 最後の余白 */}
        <div className="h-[50vh]" />
      </div>
    </div>
  );
}
