import RouteCardHorizontal from '@/app/_components/common/templates/routeCardHorizontal';
import {Route} from "@/lib/client/types";


type Props = {
    routes: Route[]
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
};

export default function RouteList(props: Props) {
  return (
    <div
      className="flex w-[400px] h-full flex-col gap-3 backdrop-blur-xs overflow-y-scroll p-3"
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
    </div>
  );
}
