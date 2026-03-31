import TabNavigation, { Tab } from '../ingredients/tabNavigation'
import ProfileStats from '../ingredients/profileStats'
import RouteCardGraphical from '@/app/_components/common/templates/routeCardGraphical'
import RouteCardGraphicalSkeleton from '@/app/_components/common/ingredients/routeCardGraphicalSkeleton'
import RouteCardWidely from '@/app/_components/common/templates/routeCardWidely'
import RouteCardWidelySkeleton from '@/app/_components/common/ingredients/routeCardWidelySkeleton'
import {MdFavoriteBorder, MdHistory, MdRoute} from 'react-icons/md'
import React, { useEffect, useRef } from 'react'

export default function UserProfileContent({
  activeTab,
  onChangeTab,
  stats,
  routes,
  likedRoutes,
  historyRoutes,
  mode = 'public',
  fetchMore,
  hasMore,
  isFetching,
}: {
  activeTab: Tab
  onChangeTab: (t: Tab) => void
  stats: { routes: number; followers: number | string; following: number | string }
  routes?: any[] | null
  likedRoutes?: any[] | null
  historyRoutes?: any[] | null
  mode?: 'self' | 'public'
  fetchMore?: () => Promise<void>
  hasMore?: boolean
  isFetching?: boolean
}) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fetchMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchMore();
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
  }, [hasMore, fetchMore, isFetching]);

  // ダミーカードの生成（15個）
  const dummyCards = Array.from({ length: 15 }).map((_, i) => (
    <React.Fragment key={`dummy-${i}`}>
      <div className="hidden md:block aspect-[4/5]">
        <RouteCardGraphicalSkeleton 
          isFirst={i === 0}
          observerTarget={observerTarget}
        />
      </div>
      <div className="block md:hidden">
        <RouteCardWidelySkeleton 
          isFirst={i === 0}
          observerTarget={observerTarget}
        />
      </div>
    </React.Fragment>
  ));

  return (
    <div className="w-full h-fit max-w-[1200px] mx-auto px-6">
      <ProfileStats routes={stats.routes} followers={stats.followers} following={stats.following} />
      <TabNavigation activeTab={activeTab} onChange={onChangeTab} mode={mode} />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-3 pb-20">
        {activeTab === 'routes' && (
          routes === null ? (
            dummyCards
          ) : routes && routes.length > 0 ? (
            <>
              {routes.map((route, idx) => (
                <React.Fragment key={idx}>
                  <div className="hidden md:block aspect-[4/5]">
                    <RouteCardGraphical route={route} />
                  </div>
                  <div className="block md:hidden">
                    <RouteCardWidely route={route} />
                  </div>
                </React.Fragment>
              ))}
              {hasMore && dummyCards}
            </>
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-grass rounded-full flex items-center justify-center mx-auto mb-4">
                <MdRoute size={32} className="text-foreground-1" />
              </div>
              <p className="text-foreground-1 font-medium">No liked routes yet.</p>
            </div>
          )
        )}

        {activeTab === 'likes' && (
          likedRoutes === null ? (
            dummyCards
          ) : likedRoutes && likedRoutes.length > 0 ? (
            <>
              {likedRoutes.map((route, idx) => (
                <React.Fragment key={idx}>
                  <div className="hidden md:block aspect-[4/5]">
                    <RouteCardGraphical route={route} />
                  </div>
                  <div className="block md:hidden">
                    <RouteCardWidely route={route} />
                  </div>
                </React.Fragment>
              ))}
              {hasMore && dummyCards}
            </>
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-grass rounded-full flex items-center justify-center mx-auto mb-4">
                <MdFavoriteBorder size={32} className="text-foreground-1" />
              </div>
              <p className="text-foreground-1 font-medium">No liked routes yet.</p>
            </div>
          )
        )}

        {activeTab === 'history' && mode === 'self' && (
          historyRoutes === null ? (
            dummyCards
          ) : historyRoutes && historyRoutes.length > 0 ? (
            <>
              {historyRoutes.map((route, idx) => (
                <React.Fragment key={idx}>
                  <div className="hidden md:block aspect-[4/5]">
                    <RouteCardGraphical route={route} />
                  </div>
                  <div className="block md:hidden">
                    <RouteCardWidely route={route} />
                  </div>
                </React.Fragment>
              ))}
              {hasMore && dummyCards}
            </>
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-grass rounded-full flex items-center justify-center mx-auto mb-4">
                <MdHistory size={32} className="text-foreground-1" />
              </div>
              <p className="text-foreground-1 font-medium">No browsing history yet.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
