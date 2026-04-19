'use client'

import { useState } from 'react'
import { userStore } from '@/lib/stores/userStore'
import { getDataFromServerWithJson } from '@/lib/api/client'
import UserProfileHeader from './_components/templates/userProfileHeader'
import UserProfileContent from './_components/templates/userProfileContent'
import { Tab } from './_components/ingredients/tabNavigation'
import { Route } from '@/lib/types/domain'
import { CursorResponse, useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll'

type LikeRecord = { id: string; createdAt: string; route: Route }
type ViewRecord = { id: string; updatedAt: string; route: Route }

export default function RootClient() {
  const currentUser = userStore(state => state.user)
  const userId = currentUser?.id
  const enabled = !!userId
  const [activeTab, setActiveTab] = useState<Tab>('routes')

  const {
    items: userRoutes,
    hasMore: hasMoreRoutes,
    isFetching: isFetchingRoutes,
    fetchMore: fetchMoreRoutes,
    observerTarget: observerTargetRoutes,
    error: errorRoutes,
    retry: retryRoutes,
  } = useInfiniteScroll<Route>({
    fetcher: (cursor) => {
      const url = `/api/v1/routes?authorId=${userId}&limit=15&type=user_posts${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
      return getDataFromServerWithJson<CursorResponse<Route>>(url)
    },
    deps: [userId],
    enabled,
  })

  const {
    items: likedRoutes,
    hasMore: hasMoreLikes,
    isFetching: isFetchingLikes,
    fetchMore: fetchMoreLikes,
    observerTarget: observerTargetLikes,
    error: errorLikes,
    retry: retryLikes,
  } = useInfiniteScroll<LikeRecord, Route>({
    fetcher: (cursor) => {
      const url = `/api/v1/likes?route=true&take=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
      return getDataFromServerWithJson<CursorResponse<LikeRecord>>(url)
    },
    mapItem: (l) => l.route ?? null,
    deps: [userId],
    enabled,
  })

  const {
    items: historyRoutes,
    hasMore: hasMoreHistory,
    isFetching: isFetchingHistory,
    fetchMore: fetchMoreHistory,
    observerTarget: observerTargetHistory,
    error: errorHistory,
    retry: retryHistory,
  } = useInfiniteScroll<ViewRecord, Route>({
    fetcher: (cursor) => {
      const url = `/api/v1/views?route=true&take=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
      return getDataFromServerWithJson<CursorResponse<ViewRecord>>(url)
    },
    mapItem: (v) => v.route ?? null,
    deps: [userId],
    enabled,
  })

  // activeTab に応じて UserProfileContent に渡す派生値を一元化。
  // error / retry も tab ごとに切り替えることで、UserProfileContent 側は
  // 「アクティブな tab で起きたエラー」だけを描画すればよくなる。
  const fetchMore =
    activeTab === 'routes' ? fetchMoreRoutes :
    activeTab === 'likes' ? fetchMoreLikes :
    fetchMoreHistory
  const hasMore =
    activeTab === 'routes' ? hasMoreRoutes :
    activeTab === 'likes' ? hasMoreLikes :
    hasMoreHistory
  const isFetching =
    activeTab === 'routes' ? isFetchingRoutes :
    activeTab === 'likes' ? isFetchingLikes :
    isFetchingHistory
  const observerTarget =
    activeTab === 'routes' ? observerTargetRoutes :
    activeTab === 'likes' ? observerTargetLikes :
    observerTargetHistory
  const error =
    activeTab === 'routes' ? errorRoutes :
    activeTab === 'likes' ? errorLikes :
    errorHistory
  const onRetry =
    activeTab === 'routes' ? retryRoutes :
    activeTab === 'likes' ? retryLikes :
    retryHistory

  return (
    <div className="w-full h-fit flex flex-col">
      <UserProfileHeader
        name={currentUser.name}
        bio={currentUser.bio as string}
        iconUrl={currentUser.icon?.url}
        bgUrl={currentUser.background?.url}
      />

      <UserProfileContent
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        stats={{
          routes: currentUser._count?.routes ?? 0,
          followers: '0',
          following: '0'
        }}
        routes={userRoutes ?? null}
        likedRoutes={likedRoutes ?? null}
        historyRoutes={historyRoutes ?? null}
        mode="self"
        fetchMore={fetchMore}
        hasMore={hasMore}
        isFetching={isFetching}
        observerTarget={observerTarget}
        error={error}
        onRetry={onRetry}
      />
    </div>
  )
}
