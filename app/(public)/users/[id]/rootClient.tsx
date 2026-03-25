'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { userStore } from '@/lib/client/stores/userStore'
import { User } from '@/lib/client/types'
import { getDataFromServerWithJson } from '@/lib/client/helpers'
import UserProfileHeader from '@/features/users/components/templates/userProfileHeader'
import UserProfileContent from '@/features/users/components/templates/userProfileContent'
import { Tab } from '@/features/users/components/ingredients/tabNavigation'

export default function RootClient({ id }: { id: string }) {
  const router = useRouter()
  const { user: currentUser } = userStore()
  const [targetUser, setTargetUser] = useState<User | null>(null)
  const [userRoutes, setUserRoutes] = useState<any[]>([])
  const [likedRoutes, setLikedRoutes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [hasMoreRoutes, setHasMoreRoutes] = useState(true)
  const [hasMoreLikes, setHasMoreLikes] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('routes')

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
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id, currentUser, router])

  // 初期フェッチ（タブ切り替え時）
  useEffect(() => {
    const fetchInitialData = async () => {
      // 既にデータがある場合は再取得しない（初回のみ）
      if (activeTab === 'routes' && userRoutes.length > 0) return
      if (activeTab === 'likes' && likedRoutes.length > 0) return

      setIsLoadingRoutes(true)
      if (activeTab === 'routes') {
        try {
          const res = await getDataFromServerWithJson<any[]>(`/api/v1/routes?authorId=${id}&limit=12&offset=0&type=user_posts`)
          setUserRoutes(res || [])
          setHasMoreRoutes((res || []).length === 12)
        } catch (error) {
          console.error('Failed to fetch user routes:', error)
        }
      } else if (activeTab === 'likes') {
        try {
          const res = await getDataFromServerWithJson<any[]>(`/api/v1/likes?userId=${id}&route=true&take=12&offset=0`)
          // /api/v1/likes returns Like records. Map to routes.
          const routes = (res || []).map((l: any) => l.route).filter(Boolean)
          setLikedRoutes(routes)
          setHasMoreLikes((res || []).length === 12)
        } catch (error) {
          console.error('Failed to fetch user likes:', error)
        }
      }
      setIsLoadingRoutes(false)
    }

    fetchInitialData()
  }, [id, activeTab, userRoutes.length, likedRoutes.length])

  const fetchMore = async () => {
    if (isFetching) return
    
    if (activeTab === 'routes' && hasMoreRoutes) {
      setIsFetching(true)
      try {
        const offset = userRoutes.length
        const res = await getDataFromServerWithJson<any[]>(`/api/v1/routes?authorId=${id}&limit=12&offset=${offset}&type=user_posts`)
        if (res && res.length > 0) {
          setUserRoutes(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const filtered = res.filter(r => !existingIds.has(r.id));
            return [...prev, ...filtered];
          })
          setHasMoreRoutes(res.length === 12)
        } else {
          setHasMoreRoutes(false)
        }
      } catch (error) {
        console.error('Failed to fetch more user routes:', error)
      } finally {
        setIsFetching(false)
      }
    } else if (activeTab === 'likes' && hasMoreLikes) {
      setIsFetching(true)
      try {
        const offset = likedRoutes.length
        const res = await getDataFromServerWithJson<any[]>(`/api/v1/likes?userId=${id}&route=true&take=12&offset=${offset}`)
        if (res && res.length > 0) {
          const newRoutes = (res || []).map((l: any) => l.route).filter(Boolean)
          setLikedRoutes(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const filtered = newRoutes.filter(r => !existingIds.has(r.id));
            return [...prev, ...filtered];
          })
          setHasMoreLikes(res.length === 12)
        } else {
          setHasMoreLikes(false)
        }
      } catch (error) {
        console.error('Failed to fetch more user likes:', error)
      } finally {
        setIsFetching(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grass"></div>
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
        routes={userRoutes}
        likedRoutes={likedRoutes}
        mode="public"
        fetchMore={fetchMore}
        hasMore={activeTab === 'routes' ? hasMoreRoutes : hasMoreLikes}
        isFetching={isFetching}
      />
    </div>
  )
}
