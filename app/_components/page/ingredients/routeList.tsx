import RouteCardHorizontal, { RouteCardProps } from '@/app/_components/common/templates/routeCardHorizontal';

// Simple mock data for route cards (replace with API integration as needed)
export const mockRoutes: RouteCardProps[] = [
  { title: 'Kyoto Old Town Walk', user: 'taro', likes: 128, category: 'History', thumbnailSrc: '/mockImages/Kyoto.jpg' },
  { title: 'Okinawa Beach Hopping', user: 'hanako', likes: 256, category: 'Beach', thumbnailSrc: '/mockImages/Okinawa.jpg' },
  { title: 'Hokkaido Food Trip', user: 'satoshi', likes: 93, category: 'Food', thumbnailSrc: '/mockImages/Hokkaido.jpg' },
  { title: 'Tokyo Night Lights', user: 'emi', likes: 174, category: 'City', thumbnailSrc: '/mockImages/Tokyo.jpg' },
  { title: 'Nara Temple Circuit', user: 'ken', likes: 67, category: 'Culture', thumbnailSrc: '/mockImages/Nara.jpg' },
  { title: 'Mount Fuji Scenic Drive', user: 'yuki', likes: 201, category: 'Nature', thumbnailSrc: '/mockImages/Fuji.jpg' },
];

type RouteListProps = {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
};

export default function RouteList({ focusedIndex, setFocusedIndex }: RouteListProps) {
  return (
    <div
      className="flex w-[400px] h-full flex-col gap-3 backdrop-blur-xs overflow-y-scroll overscroll-contain p-3"
      tabIndex={0}
      role="region"
      aria-label="Route list"
      onWheelCapture={(e) => {
        // Keep scrolling within the list and prevent wheel from bubbling to underlying map
        e.stopPropagation();
      }}
      onTouchMoveCapture={(e) => {
        // Prevent touch scroll/pan from reaching the map beneath
        e.stopPropagation();
      }}
      onKeyDownCapture={(e) => {
        // Contain keyboard scroll events (Arrow keys, PageUp/Down, Space, etc.)
        e.stopPropagation();
      }}
    >
      {mockRoutes.map((route, idx) => (
        <RouteCardHorizontal
          key={`${route.title}-${idx}`}
          {...route}
          isFocused={focusedIndex === idx}
          onClick={() => setFocusedIndex(idx)}
        />
      ))}
    </div>
  );
}
