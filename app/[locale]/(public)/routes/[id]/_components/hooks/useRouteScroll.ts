"use client";

import { useState, useRef, useEffect, useCallback, RefObject } from "react";

type UseRouteScrollProps = {
  items: any[];
  isMobile: boolean;
  viewMode: "diagram" | "details" | "map";
  setViewMode: (mode: "diagram" | "details" | "map") => void;
};

export function useRouteScroll({
  items,
  isMobile,
  viewMode,
  setViewMode,
}: UseRouteScrollProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isManualScrolling = useRef(false);

  // ダイアグラムのカードクリック時のスクロール処理
  const handleDiagramClick = useCallback(
    (index: number) => {
      setFocusIndex(index);
      isManualScrolling.current = true;
      const targetElement = itemRefs.current[index];
      const container = scrollContainerRef.current;

      if (targetElement && container) {
        // ダイアグラムをクリックしたとき、モバイルなら詳細ビューに切り替える
        if (isMobile) {
          setViewMode("details");
        }

        // レイアウトが反映されるのを待ってからスクロールを実行
        setTimeout(() => {
          const rect = targetElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // コンテナ内での相対位置を計算
          const relativeTop = rect.top - containerRect.top + container.scrollTop;
          // 画面中央付近にくるように調整（コンテナの高さの1/4程度をオフセット）
          const scrollToTop = relativeTop - containerRect.height / 4;

          container.scrollTo({
            top: Math.max(0, scrollToTop),
            behavior: "smooth",
          });

          // スムーズスクロール終了後にフラグを戻す
          setTimeout(() => {
            isManualScrolling.current = false;
          }, 800);
        }, isMobile ? 150 : 50);
      }
    },
    [isMobile, setViewMode]
  );

  // 右側のスクロールを検知してfocusIndexを更新
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // detailsモード以外、または手動スクロール中は無視
      if (isManualScrolling.current) return;
      if (viewMode !== "details") return;

      const scrollTop = container.scrollTop;

      // 基本的には上端付近なら0番目をフォーカスする
      // RouteHeaderが追加されたため、スクロール位置の閾値を少し上げるか、
      // 最初のアイテムが見えるまで0番目（RouteHeaderにフォーカスを当てるか、最初のWaypointにするか）
      if (scrollTop <= 100) {
        if (focusIndex !== 0) {
          setFocusIndex(0);
        }
        return;
      }

      const containerRect = container.getBoundingClientRect();
      // 判定基準点：コンテナ内の上から1/3の位置
      const containerReferencePoint = containerRect.height / 3;

      let closestIndex = -1;
      let minDistance = Infinity;

      // itemRefsにはitems.length番目に情報エリアが入っている
      itemRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          // rect.top はビューポート上端からの距離。コンテナの上端からの距離に変換する
          const elementPoint = rect.top - containerRect.top;

          const distance = Math.abs(elementPoint - containerReferencePoint);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (closestIndex !== -1 && closestIndex !== focusIndex) {
        setFocusIndex(closestIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [focusIndex, viewMode]);

  return {
    focusIndex,
    setFocusIndex,
    scrollContainerRef,
    itemRefs,
    handleDiagramClick,
  };
}
