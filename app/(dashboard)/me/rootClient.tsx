'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { userStore } from '@/lib/client/stores/userStore'
import { getDataFromServerWithJson } from '@/lib/client/helpers'
import UserProfileHeader from '@/features/users/components/templates/userProfileHeader'
import UserProfileContent from '@/features/users/components/templates/userProfileContent'
import { Tab } from '@/features/users/components/ingredients/tabNavigation'

export default function RootClient() {
  const router = useRouter()
  const { user: currentUser, login } = userStore()
  const [userRoutes, setUserRoutes] = useState<any[]>([])
  const [likes, setLikes] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [hasMoreRoutes, setHasMoreRoutes] = useState(true)
  const [hasMoreLikes, setHasMoreLikes] = useState(true)
  const [hasMoreHistory, setHasMoreHistory] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('routes')
  const [isInitialized, setIsInitialized] = useState(false)

  const likedRoutes = likes.map(l => l.route).filter(Boolean)
  const historyRoutes = history.map(v => v.route).filter(Boolean)

  useEffect(() => {
    const init = async () => {
      if (!currentUser || currentUser.id === '') {
        login(
          undefined,
          (user) => {
            if (!user) {
              router.push('/login')
            } else {
              setIsInitialized(true)
            }
          },
          () => {
            router.push('/login')
          }
        )
      } else {
        setIsInitialized(true)
      }
    }
    init()
  }, [currentUser, router, login])

  useEffect(() => {
    if (!isInitialized || !currentUser?.id) return

    const fetchInitialData = async () => {
      // 既にデータがある場合は、タブ切り替え時に再取得しない（無限スクロールで追加分がある場合を考慮）
      // ただし、初回は必ず取得する
      if (activeTab === 'routes' && userRoutes.length > 0) return
      if (activeTab === 'likes' && likes.length > 0) return
      if (activeTab === 'history' && history.length > 0) return

      setIsLoadingRoutes(true)
      try {
        if (activeTab === 'routes') {
          const res = await getDataFromServerWithJson<any[]>(`/api/v1/routes?authorId=${currentUser.id}&limit=15&offset=0&type=user_posts`)
          setUserRoutes(res || [])
          setHasMoreRoutes((res || []).length === 15)
        } else if (activeTab === 'likes') {
          const res = await getDataFromServerWithJson<any[]>(`/api/v1/me/likes?limit=15&offset=0`)
          setLikes(res || [])
          setHasMoreLikes((res || []).length === 15)
        } else if (activeTab === 'history') {
          const res = await getDataFromServerWithJson<any[]>(`/api/v1/me/views?limit=15&offset=0`)
          setHistory(res || [])
          setHasMoreHistory((res || []).length === 15)
        }
      } catch (error) {
        console.error(`Failed to fetch ${activeTab}:`, error)
      } finally {
        setIsLoadingRoutes(false)
      }
    }

    fetchInitialData()
  }, [isInitialized, currentUser?.id, activeTab, userRoutes.length, likes.length, history.length])

  const fetchMore = async () => {
    if (isFetching || !currentUser?.id) return
    
    if (activeTab === 'routes' && hasMoreRoutes) {
      setIsFetching(true)
      try {
        const offset = userRoutes.length
        const res = await getDataFromServerWithJson<any[]>(`/api/v1/routes?authorId=${currentUser.id}&limit=15&offset=${offset}&type=user_posts`)
        if (res && res.length > 0) {
          setUserRoutes(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const filtered = res.filter(r => !existingIds.has(r.id));
            return [...prev, ...filtered];
          })
          setHasMoreRoutes(res.length === 15)
        } else {
          setHasMoreRoutes(false)
        }
      } catch (error) {
        console.error('Failed to fetch more routes:', error)
      } finally {
        setIsFetching(false)
      }
    } else if (activeTab === 'likes' && hasMoreLikes) {
      setIsFetching(true)
      try {
        const offset = likes.length
        const res = await getDataFromServerWithJson<any[]>(`/api/v1/me/likes?limit=15&offset=${offset}`)
        if (res && res.length > 0) {
          setLikes(prev => {
            const existingIds = new Set(prev.map(l => l.id));
            const filtered = res.filter(l => !existingIds.has(l.id));
            return [...prev, ...filtered];
          })
          setHasMoreLikes(res.length === 15)
        } else {
          setHasMoreLikes(false)
        }
      } catch (error) {
        console.error('Failed to fetch more likes:', error)
      } finally {
        setIsFetching(false)
      }
    } else if (activeTab === 'history' && hasMoreHistory) {
      setIsFetching(true)
      try {
        const offset = history.length
        const res = await getDataFromServerWithJson<any[]>(`/api/v1/me/views?limit=15&offset=${offset}`)
        if (res && res.length > 0) {
          setHistory(prev => {
            const existingIds = new Set(prev.map(v => v.id));
            const filtered = res.filter(v => !existingIds.has(v.id));
            return [...prev, ...filtered];
          })
          setHasMoreHistory(res.length === 15)
        } else {
          setHasMoreHistory(false)
        }
      } catch (error) {
        console.error('Failed to fetch more history:', error)
      } finally {
        setIsFetching(false)
      }
    }
  }

  if (!isInitialized) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grass"></div>
      </div>
    )
  }

  const getHasMore = () => {
    if (activeTab === 'routes') return hasMoreRoutes
    if (activeTab === 'likes') return hasMoreLikes
    if (activeTab === 'history') return hasMoreHistory
    return false
  }

  return (
    <div className="w-full h-fit">
      <UserProfileHeader
        name={currentUser.name}
        bio={currentUser.bio as string}
        iconUrl={currentUser.icon?.url}
        bgUrl={currentUser.background?.url}
        mode="self"
      />

      <UserProfileContent
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        stats={{ 
          routes: currentUser._count?.routes ?? 0, 
          followers: '0', 
          following: '0' 
        }}
        routes={userRoutes}
        likedRoutes={likedRoutes}
        historyRoutes={historyRoutes}
        mode="self"
        fetchMore={fetchMore}
        hasMore={getHasMore()}
        isFetching={isFetching}
      />
    </div>
  )
}
