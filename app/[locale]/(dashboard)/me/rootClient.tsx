'use client'

import { getDataFromServerWithJson } from '@/lib/api/client'
import { CursorResponse, useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll'
import { useUiStore } from "@/lib/stores/uiStore"
import { userStore } from '@/lib/stores/userStore'
import { Route } from '@/lib/types/domain'
import { useState } from 'react'
import { Tab } from './_components/ingredients/tabNavigation'
import UserProfileContent from './_components/templates/userProfileContent'
import UserProfileHeader from './_components/templates/userProfileHeader'

type LikeRecord = { id: string; createdAt: string; route: Route }
type ViewRecord = { id: string; createdAt: string; route: Route }

export default function RootClient() {
  const currentUser = userStore(state => state.user)
  const userId = currentUser?.id
  const enabled = !!userId
  const [activeTab, setActiveTab] = useState<Tab>('routes')
  const [loadedTabs, setLoadedTabs] = useState<Record<Tab, boolean>>({
    routes: true,
    likes: false,
    history: false,
  })

  const scrollDirection = useUiStore((state) => state.scrollDirection)
  const headerHeight = useUiStore((state) => state.headerHeight)

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setLoadedTabs((prev) => (
      prev[tab] ? prev : { ...prev, [tab]: true }
    ))
  }

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
    enabled: enabled && loadedTabs.routes,
  })

  const {
    items: likedRoutes,
    hasMore: hasMoreLikes,
    isFetching: isFetchingLikes,
    fetchMore: fetchMoreLikes,
    observerTarget: observerTargetLikes,
    error: errorLikes,
    retry: retryLikes,
  } = useInfiniteScroll<LikeRecord>({
    fetcher: (cursor) => {
      const url = `/api/v1/likes?route=true&take=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
      return getDataFromServerWithJson<CursorResponse<LikeRecord>>(url)
    },
    deps: [userId],
    enabled: enabled && loadedTabs.likes,
  })

  const {
    items: historyRoutes,
    hasMore: hasMoreHistory,
    isFetching: isFetchingHistory,
    fetchMore: fetchMoreHistory,
    observerTarget: observerTargetHistory,
    error: errorHistory,
    retry: retryHistory,
  } = useInfiniteScroll<ViewRecord>({
    fetcher: (cursor) => {
      const url = `/api/v1/views?route=true&take=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
      return getDataFromServerWithJson<CursorResponse<ViewRecord>>(url)
    },
    deps: [userId],
    enabled: enabled && loadedTabs.history,
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

  if (!currentUser) return null

  return (
    <div className="w-full h-fit relative bg-background-1">
      <UserProfileHeader
        name={currentUser.name}
        bio={currentUser.bio　|| ""}
        iconUrl={currentUser.icon?.url}
        bgUrl={currentUser.background?.url}
        mode="self"
        routesCount={currentUser._count?.routes ?? 0}
        followersCount={currentUser._count?.followers ?? 0}
        followingCount={currentUser._count?.followings ?? 0}
      />
      <div className="relative w-full h-fit z-20 flex flex-col bg-background-1">
        <UserProfileContent
          activeTab={activeTab}
          onChangeTab={handleTabChange}
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
    </div>
  )
}
