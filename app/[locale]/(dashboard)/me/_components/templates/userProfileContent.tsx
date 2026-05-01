'use client'

import RouteCardGraphicalSkeleton from '@/app/[locale]/_components/common/ingredients/routeCardGraphicalSkeleton'
import RouteCardWidelySkeleton from '@/app/[locale]/_components/common/ingredients/routeCardWidelySkeleton'
import SectionErrorState from '@/app/[locale]/_components/common/ingredients/sectionErrorState'
import RouteCardGraphical from '@/app/[locale]/_components/common/templates/routeCardGraphical'
import RouteCardWidely from '@/app/[locale]/_components/common/templates/routeCardWidely'
import { Route } from '@/lib/types/domain'
import { ErrorScheme } from '@/lib/types/error'
import { groupItemsByDate } from '@/lib/utils/groupByDate'
import { useTranslations } from 'next-intl'
import { RefObject, useMemo } from 'react'
import { MdFavoriteBorder, MdHistory, MdRoute } from 'react-icons/md'
import TabNavigation, { Tab } from '../ingredients/tabNavigation'

type LikeRecord = { id: string; createdAt: string; route: Route }
type ViewRecord = { id: string; createdAt: string; route: Route }

export default function UserProfileContent({
  activeTab,
  onChangeTab,
  routes,
  likedRoutes,
  historyRoutes,
  mode = 'public',
  hasMore,
  observerTarget,
  error,
  onRetry,
}: {
  activeTab: Tab
  onChangeTab: (t: Tab) => void
  routes?: any[] | null
  likedRoutes?: (LikeRecord | any)[] | null
  historyRoutes?: (ViewRecord | any)[] | null
  mode?: 'self' | 'public'
  fetchMore?: () => Promise<void>
  hasMore?: boolean
  isFetching?: boolean
  observerTarget?: RefObject<HTMLDivElement | null>
  /**
   * 現在アクティブな tab のフェッチでエラーが起きている場合に渡す。
   * parent 側で activeTab に応じて error/onRetry を切り替えるのが前提。
   */
  error?: ErrorScheme | null
  onRetry?: () => Promise<void>
}) {
  const t = useTranslations('profile')

  // グルーピングロジック
  const groupedLikes = useMemo(() => groupItemsByDate(likedRoutes), [likedRoutes])
  const groupedHistory = useMemo(() => groupItemsByDate(historyRoutes), [historyRoutes])

  // ダミーカードの生成関数（毎回新しいコンポーネント配列を作成）
  const generateDummyCards = (refTarget?: RefObject<HTMLDivElement | null>) => {
    return Array.from({ length: 15 }).map((_, i) => (
      <div key={`dummy-${i}`} className="md:aspect-[4/5]" ref={i === 0 ? refTarget : null}>
        <div className="hidden md:block h-full">
          <RouteCardGraphicalSkeleton />
        </div>
        <div className="block md:hidden">
          <RouteCardWidelySkeleton />
        </div>
      </div>
    ))
  }

  return (
    <div className="w-full h-fit max-w-[1200px] mx-auto px-6">
      <TabNavigation activeTab={activeTab} onChange={onChangeTab} mode={mode} />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-3 pb-20">
        {activeTab === 'routes' && (
          error && (!routes || routes.length === 0) ? (
            <div className="col-span-full">
              <SectionErrorState error={error} onRetry={onRetry} />
            </div>
          ) : routes === null ? (
            generateDummyCards(observerTarget)
          ) : routes && routes.length > 0 ? (
            <>
              {routes.map((route, idx) => (
                <div key={idx} className="md:aspect-[4/5]">
                  <div className="hidden md:block h-full">
                    <RouteCardGraphical route={route} />
                  </div>
                  <div className="block md:hidden">
                    <RouteCardWidely route={route} />
                  </div>
                </div>
              ))}
              {hasMore && !error && generateDummyCards(observerTarget)}
              {error && (
                <div className="col-span-full">
                  <SectionErrorState variant="inline" error={error} onRetry={onRetry} />
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-grass rounded-full flex items-center justify-center mx-auto mb-4">
                <MdRoute size={32} className="text-foreground-1" />
              </div>
              <p className="text-foreground-1 font-medium">{t('noRoutes')}</p>
            </div>
          )
        )}

        {activeTab === 'likes' && (
          error && (!likedRoutes || likedRoutes.length === 0) ? (
            <div className="col-span-full">
              <SectionErrorState error={error} onRetry={onRetry} />
            </div>
          ) : likedRoutes === null ? (
            generateDummyCards(observerTarget)
          ) : likedRoutes && likedRoutes.length > 0 ? (
            <div className="col-span-full">
              <div className="flex flex-col gap-8">
                {groupedLikes.map(([date, items], groupIdx) => (
                  <div key={date} className="flex flex-col gap-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-foreground-1/70 px-1 sticky top-0 bg-background-1/80 backdrop-blur-sm py-2">
                      {date}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-3">
                      {items.map((item, idx) => {
                        const route = (item as LikeRecord).route || item
                        return (
                          <div key={`${date}-${idx}`} className="md:aspect-[4/5]">
                            <div className="hidden md:block h-full">
                              <RouteCardGraphical route={route} />
                            </div>
                            <div className="block md:hidden">
                              <RouteCardWidely route={route} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {hasMore && !error && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-3">
                    {generateDummyCards(observerTarget)}
                  </div>
                )}
              </div>
              {error && (
                <div className="col-span-full mt-6">
                  <SectionErrorState variant="inline" error={error} onRetry={onRetry} />
                </div>
              )}
            </div>
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-grass rounded-full flex items-center justify-center mx-auto mb-4">
                <MdFavoriteBorder size={32} className="text-foreground-1" />
              </div>
              <p className="text-foreground-1 font-medium">{t('noLikedRoutes')}</p>
            </div>
          )
        )}

        {activeTab === 'history' && mode === 'self' && (
          error && (!historyRoutes || historyRoutes.length === 0) ? (
            <div className="col-span-full">
              <SectionErrorState error={error} onRetry={onRetry} />
            </div>
          ) : historyRoutes === null ? (
            generateDummyCards(observerTarget)
          ) : historyRoutes && historyRoutes.length > 0 ? (
            <div className="col-span-full">
              <div className="flex flex-col gap-8">
                {groupedHistory.map(([date, items], groupIdx) => (
                  <div key={date} className="flex flex-col gap-4">
                    <div className="text-xs font-bold uppercase tracking-widest text-foreground-1/70 px-1 sticky top-0 bg-background-1/80 backdrop-blur-sm py-2">
                      {date}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-3">
                      {items.map((item, idx) => {
                        const route = (item as ViewRecord).route || item
                        return (
                          <div key={`${date}-${idx}`} className="md:aspect-[4/5]">
                            <div className="hidden md:block h-full">
                              <RouteCardGraphical route={route} />
                            </div>
                            <div className="block md:hidden">
                              <RouteCardWidely route={route} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {hasMore && !error && (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-3">
                    {generateDummyCards(observerTarget)}
                  </div>
                )}
              </div>
              {error && (
                <div className="col-span-full mt-6">
                  <SectionErrorState variant="inline" error={error} onRetry={onRetry} />
                </div>
              )}
            </div>
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-grass rounded-full flex items-center justify-center mx-auto mb-4">
                <MdHistory size={32} className="text-foreground-1" />
              </div>
              <p className="text-foreground-1 font-medium">{t('noHistory')}</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
