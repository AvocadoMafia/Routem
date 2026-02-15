"use client";

import { Route } from "@/lib/client/types";
import { useState, useRef, useEffect, useMemo, ReactNode } from "react";
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
import MapViewer from "./_components/ingredients/mapViewer";
import DiagramViewer from "./_components/ingredients/diagramViewer";
import DetailsViewer from "./_components/ingredients/detailsViewer";
import InitialModal from "./_components/templates/initialModal";
import { motion } from "framer-motion";

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

export default function RootClient({ route }: Props) {
  const items = useMemo(() => getFlattenedItems(route), [route]);
  const [focusIndex, setFocusIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"diagram" | "details" | "map">("details");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isManualScrolling = useRef(false);

  // ダイアグラムのカードクリック時のスクロール処理
  const handleDiagramClick = (index: number) => {
    setFocusIndex(index);
    isManualScrolling.current = true;
    const targetElement = itemRefs.current[index];
    const container = scrollContainerRef.current;
    
    if (targetElement) {
      // ダイアグラムをクリックしたとき、モバイルなら詳細ビューに切り替える
      if (isMobile) {
        setViewMode("details");
      }

      // レイアウトが反映されるのを少し待ってからスクロールを実行
      setTimeout(() => {
        const targetRect = targetElement.getBoundingClientRect();
        
        if (isMobile) {
          // モバイル（windowスクロール）の場合
          // ヘッダーの高さを考慮（概算で60px程度だが、余裕を持って調整）
          // また、DetailsViewerが表示される際のアニメーション（translate-y-12）の影響を避けるため、
          // getBoundingClientRectのタイミングを遅らせるか、オフセットを慎重に計算する。
          const headerOffset = 100;
          const scrollTarget = window.scrollY + targetRect.top - headerOffset;
          
          window.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: "smooth"
          });
        } else {
          // デスクトップ（コンテナスクロール）の場合
          const container = scrollContainerRef.current;
          if (container) {
            const containerRect = container.getBoundingClientRect();
            const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
            const scrollToTop = relativeTop - (containerRect.height / 4);
            
            container.scrollTo({
              top: Math.max(0, scrollToTop),
              behavior: "smooth"
            });
          }
        }

        // スムーズスクロール終了後にフラグを戻す
        setTimeout(() => {
          isManualScrolling.current = false;
        }, 800);
      }, isMobile ? 100 : 0);
    }
  };

  // 右側のスクロールを検知してfocusIndexを更新
  useEffect(() => {
    const handleScroll = () => {
      // detailsモード以外、または手動スクロール中は無視
      if (isManualScrolling.current || (isMobile && viewMode !== "details")) return;
      if (!isMobile && viewMode === "map") return;

      const container = isMobile ? window : scrollContainerRef.current;
      if (!container) return;

      const scrollTop = isMobile ? window.scrollY : (container as HTMLDivElement).scrollTop;
      
      // モバイルの場合、ヘッダー分などのオフセットを考慮する必要があるかもしれないが、
      // 基本的には上端付近なら0番目をフォーカスする
      if (scrollTop <= 20) {
        if (focusIndex !== 0) {
          setFocusIndex(0);
        }
        return;
      }

      const containerRect = isMobile 
        ? { top: 0, height: window.innerHeight } 
        : (container as HTMLDivElement).getBoundingClientRect();
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

    if (isMobile) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
      }
    }
  }, [focusIndex, viewMode, isMobile]);

  const getTransitIcon = (mode: string): ReactNode => {
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
    <div className="w-full md:h-screen h-fit relative overflow-x-hidden max-w-full">
      <InitialModal route={route} />
      
      <div className={`flex md:h-full h-fit w-full md:overflow-hidden relative flex-col md:flex-row overflow-x-hidden max-w-full`}>
        {/* 画面上部の切り替えボタン */}
        <div className="md:absolute fixed w-fit h-fit md:top-6 bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center backdrop-blur-xl border border-foreground-0/5 rounded-full p-1 shadow-2xl shadow-black/5 max-w-[95vw] overflow-x-auto no-scrollbar overflow-y-hidden">
          <button
            onClick={() => setViewMode("diagram")}
            className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${
              viewMode === "diagram"
                ? "bg-accent-0 text-white shadow-lg shadow-accent-0/20"
                : "text-foreground-1 hover:text-foreground-0"
            } ${!isMobile && 'hidden'}`}
          >
            <List className="w-3.5 h-3.5" />
            <span>DIAGRAM</span>
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
            <span>DETAILS</span>
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
            <span>MAP VIEW</span>
          </button>
        </div>

        {/* ダイアグラム (w-1/4 or fixed width) */}
        <motion.div
          layout
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`w-full md:w-1/4 md:min-w-[320px] h-full ${viewMode === 'map' ? 'md:order-2' : 'md:order-1'}`}
        >
          <DiagramViewer 
            items={items}
            focusIndex={focusIndex}
            viewMode={viewMode}
            isMobile={isMobile}
            onItemClick={handleDiagramClick}
            getTransitIcon={getTransitIcon}
          />
        </motion.div>

        {/* 詳細コンテンツ または マップ */}
        <motion.div 
          layout
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`flex-1 relative md:overflow-hidden min-h-screen ${viewMode === "diagram" ? "max-md:hidden" : ""} ${viewMode === 'map' ? 'md:order-1' : 'md:order-2'}`}
        >
          {/* DETAILS VIEW */}
          <DetailsViewer 
            items={items}
            focusIndex={focusIndex}
            viewMode={viewMode}
            scrollContainerRef={scrollContainerRef as React.RefObject<HTMLDivElement>}
            itemRefs={itemRefs}
            getTransitIcon={getTransitIcon}
          />

          {/* MAP VIEW */}
          <div 
            className={`md:absolute md:inset-0 max-md:fixed max-md:inset-0 h-screen transition-all duration-500 ease-[0.22, 1, 0.36, 1] ${
              viewMode === "map" ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none invisible"
            }`}
          >
            <MapViewer route={route} focusIndex={focusIndex} items={items} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
