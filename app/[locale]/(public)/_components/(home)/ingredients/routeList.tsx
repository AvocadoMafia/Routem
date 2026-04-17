import RouteCardHorizontal from '@/app/[locale]/(public)/_components/(home)/ingredients/routeCardHorizontal';
import RouteCardHorizontalSkeleton from '@/app/[locale]/(public)/_components/(home)/ingredients/routeCardHorizontalSkeleton';
import {Route} from "@/lib/client/types";
import {useEffect, useRef} from "react";


type Props = {
  routes?: Route[]
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  fetchMore?: () => Promise<void>;
  hasMore?: boolean;
  isFetching?: boolean;
};

export default function RouteList(props: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // このコンポーネントは固定高のoverflow-y-scrollコンテナ内にセンチネルを持つため、
  // デフォルトのviewport基準ではリスト内スクロールで交差を正しく検知できない。
  // rootをスクロールコンテナ自身に指定することで、コンテナ内スクロール時に発火させる。
  useEffect(() => {
    if (!props.fetchMore || !props.hasMore) return;
    const rootEl = scrollContainerRef.current;
    const target = observerTarget.current;
    if (!rootEl || !target) return;

    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && props.hasMore && !props.isFetching) {
            props.fetchMore?.();
          }
        },
        { root: rootEl, threshold: 0.1, rootMargin: "0px 0px 200px 0px" }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [props.hasMore, props.fetchMore, props.isFetching, props.routes?.length]);

  // ダミーカードの生成（15個）
  const dummyCards = Array.from({ length: 15 }).map((_, i) => (
      <RouteCardHorizontalSkeleton
          key={`dummy-${i}`}
          isFirst={i === 0}
          observerTarget={observerTarget}
      />
  ));

  if (!props.routes) {
    return (
        <div
            ref={scrollContainerRef}
            className="flex xl:w-[400px] lg:w-[330px] w-1/2 h-full flex-col gap-3 backdrop-blur-xs overflow-y-scroll p-3 no-scrollbar"
        >
            {Array.from({ length: 6 }).map((_, i) => (
                <RouteCardHorizontalSkeleton key={i} />
            ))}
        </div>
    )
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex xl:w-[400px] lg:w-[330px] w-1/2 h-full flex-col gap-3 backdrop-blur-xs overflow-y-scroll p-3 no-scrollbar"
      tabIndex={0}
      role="region"
      aria-label="Route list"
      onWheel={(e) => {
        // Keep scrolling within the list and prevent wheel from bubbling to underlying map
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        // Prevent touch scroll/pan from reaching the map beneath
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        // Contain keyboard scroll events (Arrow keys, PageUp/Down, Space, etc.)
        e.stopPropagation();
      }}
    >
      {props.routes.map((route, idx) => (
        <RouteCardHorizontal
            key={route.id ?? idx}
            route={route}
            isFocused={idx === props.focusedIndex}
            onClick={() => {props.setFocusedIndex(idx)}}
        />
      ))}
      {props.hasMore && dummyCards}
    </div>
  );
}
