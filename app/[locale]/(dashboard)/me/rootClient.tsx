'use client'

import { useState } from 'react'
import { userStore } from '@/lib/client/stores/userStore'
import { getDataFromServerWithJson } from '@/lib/client/helpers'
import UserProfileHeader from './_components/templates/userProfileHeader'
import UserProfileContent from './_components/templates/userProfileContent'
import { Tab } from './_components/ingredients/tabNavigation'
import { Route } from '@/lib/client/types'
import { CursorResponse, useInfiniteScroll } from '@/lib/client/hooks/useInfiniteScroll'

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
  } = useInfiniteScroll<ViewRecord, Route>({
    fetcher: (cursor) => {
      const url = `/api/v1/views?route=true&take=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
      return getDataFromServerWithJson<CursorResponse<ViewRecord>>(url)
    },
    mapItem: (v) => v.route ?? null,
    deps: [userId],
    enabled,
  })

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
      />
    </div>
  )
}
