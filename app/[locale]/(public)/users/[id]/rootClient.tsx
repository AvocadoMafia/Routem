'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { userStore } from '@/lib/client/stores/userStore'
import { Route, User } from '@/lib/client/types'
import { getDataFromServerWithJson } from '@/lib/client/helpers'
import { errorStore } from '@/lib/client/stores/errorStore'
import UserProfileHeader from './_components/templates/userProfileHeader'
import UserProfileContent from './_components/templates/userProfileContent'
import { Tab } from './_components/ingredients/tabNavigation'
import { CursorResponse, useInfiniteScroll } from '@/lib/client/hooks/useInfiniteScroll'

type LikeRecord = { id: string; createdAt: string; route: Route }

export default function RootClient({ id }: { id: string }) {
  const router = useRouter()
  const currentUser = userStore(state => state.user)
  const [targetUser, setTargetUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('routes')
  const appendError = errorStore(state => state.appendError)

  useEffect(() => {
    if (currentUser?.id === id) {
      router.replace('/me')
      return
    }

    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const res = await getDataFromServerWithJson<{ user: User }>(`/api/v1/users/${id}`)
        if (res && res.user) {
          setTargetUser(res.user)
        }
      } catch (error: any) {
        console.error('Failed to fetch user:', error)
        appendError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id, currentUser, router, appendError])

  // ユーザー投稿ルート（カーソル）
  const {
    items: userRoutes,
    hasMore: hasMoreRoutes,
    isFetching: isFetchingRoutes,
    fetchMore: fetchMoreRoutes,
    observerTarget: observerTargetRoutes,
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
  } = useInfiniteScroll<LikeRecord, Route>({
    fetcher: (cursor) => {
      const url = `/api/v1/likes?userId=${id}&route=true&take=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
      return getDataFromServerWithJson<CursorResponse<LikeRecord>>(url)
    },
    mapItem: (lr) => lr.route ?? null,
    deps: [id],
  })

  const fetchMore = activeTab === 'routes' ? fetchMoreRoutes : fetchMoreLikes
  const hasMore = activeTab === 'routes' ? hasMoreRoutes : hasMoreLikes
  const isFetching = activeTab === 'routes' ? isFetchingRoutes : isFetchingLikes
  const observerTarget = activeTab === 'routes' ? observerTargetRoutes : observerTargetLikes

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grass"></div>
        <p className="text-foreground-1 font-bold uppercase tracking-[0.2em] animate-pulse">LOADING...</p>
      </div>
    )
  }

  if (!targetUser) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl font-bold">User not found</p>
      </div>
    )
  }

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
      />
    </div>
  )
}
