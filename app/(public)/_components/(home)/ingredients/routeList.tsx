import RouteCardHorizontal from '@/app/(public)/_components/(home)/ingredients/routeCardHorizontal';
import RouteCardHorizontalSkeleton from '@/app/(public)/_components/(home)/ingredients/routeCardHorizontalSkeleton';
import {Route} from "@/lib/client/types";
import {useEffect, useRef} from "react";


type Props = {
  routes: Route[]
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
    fetchMore: () => Promise<void>;
    hasMore: boolean;
    isFetching?: boolean;
};

export default function RouteList(props: Props) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && props.hasMore && !props.isFetching) {
            props.fetchMore();
          }
        },
        { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [props.hasMore, props.fetchMore, props.isFetching]);

  // ダミーカードの生成（30個）
  const dummyCards = Array.from({ length: 30 }).map((_, i) => (
      <RouteCardHorizontalSkeleton
          key={`dummy-${i}`}
          isFirst={i === 0}
          observerTarget={observerTarget}
      />
  ));

  return (
    <div
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
            key={idx}
            route={route}
            isFocused={idx === props.focusedIndex}
            onClick={() => {props.setFocusedIndex(idx)}}
        />
      ))}
      {props.hasMore && dummyCards}
    </div>
  );
}
