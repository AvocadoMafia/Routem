'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Route, User } from '@/lib/types/domain'
import { postDataToServerWithJson, getDataFromServerWithJson } from '@/lib/api/client'
import UserProfileHeader from '@/app/[locale]/(dashboard)/me/_components/templates/userProfileHeader'
import UserProfileContent from './_components/templates/userProfileContent'
import { Tab } from './_components/ingredients/tabNavigation'
import { CursorResponse, useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll'

import { User as SupabaseUser } from '@supabase/supabase-js'

type LikeRecord = { id: string; createdAt: string; route: Route }

type Props = {
  targetUser: User
  currentUser: SupabaseUser | null
}

export default function RootClient({ targetUser, currentUser }: Props) {
  const id = targetUser.id
  const router = useRouter()
  const initialIsFollowing = (targetUser as User & { isFollowing?: boolean }).isFollowing ?? false
  const [activeTab, setActiveTab] = useState<Tab>('routes')
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [followersCount, setFollowersCount] = useState(targetUser._count?.followers ?? 0)

  const handleFollowToggle = async () => {
    const prevIsFollowing = isFollowing
    const prevFollowersCount = followersCount
    try {
      const nextIsFollowing = !isFollowing
      setIsFollowing(nextIsFollowing)
      setFollowersCount((prev) => Math.max(0, prev + (nextIsFollowing ? 1 : -1)))
      await postDataToServerWithJson<{ followed: boolean; follower_count: number }>(
        '/api/v1/follows',
        { followingId: id }
      )
    } catch {
      // Revert on error
      setIsFollowing(prevIsFollowing)
      setFollowersCount(prevFollowersCount)
    }
  }

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
        routesCount={targetUser._count?.routes ?? 0}
        followersCount={followersCount}
        followingCount={targetUser._count?.followings ?? 0}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
      />

      <UserProfileContent
        activeTab={activeTab}
        onChangeTab={setActiveTab}
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
