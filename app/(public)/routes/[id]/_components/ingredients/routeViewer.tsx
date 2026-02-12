"use client";

import { Route } from "@/lib/client/types";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Clock,
  Footprints,
  TrainFront,
  Bus,
  Car,
  List,
  Map as MapIcon,
} from "lucide-react";
import Image from "next/image";
import MapView from "./mapView";

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
  const [viewMode, setViewMode] = useState<"details" | "map">("details");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isManualScrolling = useRef(false);

  // ダイアグラムのカードクリック時のスクロール処理
  const handleDiagramClick = (index: number) => {
    setFocusIndex(index);
    isManualScrolling.current = true;
    const targetElement = itemRefs.current[index];
    const container = scrollContainerRef.current;
    
    if (targetElement && container) {
      // ターゲット要素のコンテナ内での位置を計算
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      // コンテナの上端からの相対位置 + 現在のスクロール量
      const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
      
      // 画面中央と上部の間（上から1/4の位置）に要素の「上端」が来るように調整
      // targetTop - (containerHeight / 4)
      const scrollToTop = relativeTop - (containerRect.height / 4);
      
      container.scrollTo({
        top: Math.max(0, scrollToTop),
        behavior: "smooth"
      });

      // スムーズスクロール終了後にフラグを戻す（簡易的）
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 600);
    }
  };

  // 右側のスクロールを検知してfocusIndexを更新
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isManualScrolling.current || viewMode !== "details") return;

      const scrollTop = container.scrollTop;
      if (scrollTop <= 10) {
        if (focusIndex !== 0) {
          setFocusIndex(0);
        }
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const containerReferencePoint = containerRect.top + containerRect.height / 4;

      let closestIndex = 0;
      let minDistance = Infinity;

      itemRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const distance = Math.abs(rect.top - containerReferencePoint);
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
  }, [focusIndex, viewMode]);

  // モード切り替え時にスクロール位置を復元（削除済み：常時マウントにより不要）

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
    <div className={`flex h-screen w-full overflow-hidden bg-background-0 relative transition-all duration-500 ${viewMode === 'map' ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* 画面上部の切り替えボタン */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-background-1/80 backdrop-blur-xl border border-foreground-0/5 rounded-full p-1 shadow-2xl shadow-black/5">
        <button
          onClick={() => setViewMode("details")}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all ${
            viewMode === "details"
              ? "bg-accent-0 text-white shadow-lg shadow-accent-0/20"
              : "text-foreground-1 hover:text-foreground-0"
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>DETAILS</span>
        </button>
        <button
          onClick={() => setViewMode("map")}
          className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all ${
            viewMode === "map"
              ? "bg-accent-0 text-white shadow-lg shadow-accent-0/20"
              : "text-foreground-1 hover:text-foreground-0"
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>MAP VIEW</span>
        </button>
      </div>

      {/* ダイアグラム (w-1/4 or fixed width) */}
      <motion.div 
        layout
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`w-1/4 min-w-[320px] p-6 overflow-y-auto no-scrollbar bg-background-1/30 backdrop-blur-2xl z-10 ${
          viewMode === "map" ? "border-l border-foreground-0/5" : "border-r border-foreground-0/5"
        }`}
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
                      : "bg-background-1 border-accent-0/20 text-accent-0/40"
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
                onClick={() => handleDiagramClick(idx)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`flex-1 p-4 rounded-2xl transition-all text-left relative overflow-hidden group ${
                  focusIndex === idx
                    ? "bg-background-1 border border-accent-0 shadow-md"
                    : "bg-background-1/50 border border-foreground-0/5 hover:border-accent-0/30 hover:bg-background-1"
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      focusIndex === idx ? "text-accent-0" : "text-foreground-1/60"
                    }`}
                  >
                    {item.type === "node" ? `Waypoint ${Math.floor(idx / 2) + 1}` : item.data.mode}
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
      </motion.div>

      {/* 詳細コンテンツ または マップ */}
      <motion.div 
        layout
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 relative overflow-hidden"
      >
        {/* DETAILS VIEW */}
        <div
          ref={scrollContainerRef}
          className={`absolute inset-0 overflow-y-auto p-8 md:p-16 lg:p-24 space-y-40 scroll-smooth bg-background-0 transition-all duration-500 ease-[0.22, 1, 0.36, 1] ${
            viewMode === "details" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none invisible"
          }`}
        >
          {items.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className={`transition-all duration-500 ease-[0.22, 1, 0.36, 1] transform ${
                focusIndex === idx
                  ? "opacity-100 translate-y-0"
                  : "opacity-40 translate-y-12"
              }`}
            >
              {item.type === "node" ? (
                <div className="max-w-4xl">
                  <div className="flex flex-col gap-4 mb-16">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-accent-0" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
                        Waypoint {Math.floor(idx / 2) + 1}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-medium text-foreground-0 tracking-[0.05em] uppercase leading-tight">
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
                    <p className="text-lg md:text-xl leading-relaxed text-foreground-0/80 font-normal whitespace-pre-wrap">
                      {item.data.details || "No description provided."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl">
                  <div className="flex items-center gap-12 py-12 border-y border-foreground-0/10">
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
                    {item.data.memo && (
                      <p className="flex-1 text-sm text-foreground-1 font-medium italic text-right">
                        {item.data.memo}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* 最後の余白 */}
          <div className="h-[50vh]" />
        </div>

        {/* MAP VIEW */}
        <div 
          className={`absolute inset-0 bg-background-1 transition-all duration-500 ease-[0.22, 1, 0.36, 1] ${
            viewMode === "map" ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none invisible"
          }`}
        >
          <MapView route={route} focusIndex={focusIndex} items={items} />
        </div>
      </motion.div>
    </div>
  );
}
