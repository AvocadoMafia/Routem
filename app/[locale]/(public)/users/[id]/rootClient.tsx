'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Route, User } from '@/lib/client/types'
import { getDataFromServerWithJson } from '@/lib/client/helpers'
import UserProfileHeader from './_components/templates/userProfileHeader'
import UserProfileContent from './_components/templates/userProfileContent'
import { Tab } from './_components/ingredients/tabNavigation'
import { CursorResponse, useInfiniteScroll } from '@/lib/client/hooks/useInfiniteScroll'

import { User as SupabaseUser } from '@supabase/supabase-js'

type LikeRecord = { id: string; createdAt: string; route: Route }

type Props = {
  targetUser: User
  currentUser: SupabaseUser | null
}

export default function RootClient({ targetUser, currentUser }: Props) {
  const id = targetUser.id
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('routes')

  // ユーザー投稿ルート（カーソル）
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
      const url = `/api/v1/routes?authorId=${id}&limit=15&type=user_posts${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
      return getDataFromServerWithJson<CursorResponse<Route>>(url)
    },
    deps: [id],
  })

  // いいね済みルート（カーソル）
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
      const url = `/api/v1/likes?userId=${id}&route=true&take=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
      return getDataFromServerWithJson<CursorResponse<LikeRecord>>(url)
    },
    mapItem: (lr) => lr.route ?? null,
    deps: [id],
  })

  // activeTab に応じて派生値を一元化
  const fetchMore = activeTab === 'routes' ? fetchMoreRoutes : fetchMoreLikes
  const hasMore = activeTab === 'routes' ? hasMoreRoutes : hasMoreLikes
  const isFetching = activeTab === 'routes' ? isFetchingRoutes : isFetchingLikes
  const observerTarget = activeTab === 'routes' ? observerTargetRoutes : observerTargetLikes
  const error = activeTab === 'routes' ? errorRoutes : errorLikes
  const onRetry = activeTab === 'routes' ? retryRoutes : retryLikes

  useEffect(() => {
    if (currentUser?.id === id) {
      router.replace('/me')
    }
  }, [id, currentUser?.id, router])

  return (
    <div className="w-full h-fit">
      <UserProfileHeader
        name={targetUser.name}
        bio={targetUser.bio as string}
        iconUrl={targetUser.icon?.url}
        bgUrl={targetUser.background?.url}
        mode="public"
        followingId={targetUser.id}
      />

      <UserProfileContent
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        stats={{
          routes: targetUser._count?.routes ?? 0,
          followers: '0',
          following: '0'
        }}
        routes={userRoutes ?? null}
        likedRoutes={likedRoutes ?? null}
        mode="public"
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
