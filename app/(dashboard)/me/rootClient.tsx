'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useRef } from 'react'
import { userStore } from '@/lib/client/stores/userStore'
import { getDataFromServerWithJson } from '@/lib/client/helpers'
import UserProfileHeader from './_components/templates/userProfileHeader'
import UserProfileContent from './_components/templates/userProfileContent'
import { Tab } from './_components/ingredients/tabNavigation'

// カーソルベースのレスポンス型
type CursorResponse<T> = { items: T[]; nextCursor: string | null };

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

  // カーソル管理
  const routesCursorRef = useRef<string | null>(null)
  const likesCursorRef = useRef<string | null>(null)
  const historyCursorRef = useRef<string | null>(null)

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
          const res = await getDataFromServerWithJson<CursorResponse<any>>(`/api/v1/routes?authorId=${currentUser.id}&limit=15&type=user_posts`)
          if (res) {
            setUserRoutes(res.items)
            routesCursorRef.current = res.nextCursor
            setHasMoreRoutes(!!res.nextCursor)
          }
        } else if (activeTab === 'likes') {
          const res = await getDataFromServerWithJson<CursorResponse<any>>(`/api/v1/likes?route=true&take=15`)
          if (res) {
            setLikes(res.items)
            likesCursorRef.current = res.nextCursor
            setHasMoreLikes(!!res.nextCursor)
          }
        } else if (activeTab === 'history') {
          const res = await getDataFromServerWithJson<CursorResponse<any>>(`/api/v1/views?route=true&take=15`)
          if (res) {
            setHistory(res.items)
            historyCursorRef.current = res.nextCursor
            setHasMoreHistory(!!res.nextCursor)
          }
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

    if (activeTab === 'routes' && hasMoreRoutes && routesCursorRef.current) {
      setIsFetching(true)
      try {
        const cursor = encodeURIComponent(routesCursorRef.current)
        const res = await getDataFromServerWithJson<CursorResponse<any>>(`/api/v1/routes?authorId=${currentUser.id}&limit=15&cursor=${cursor}&type=user_posts`)
        if (res && res.items.length > 0) {
          setUserRoutes(prev => {
            const existingIds = new Set(prev.map(r => r.id));
            const filtered = res.items.filter(r => !existingIds.has(r.id));
            return [...prev, ...filtered];
          })
          routesCursorRef.current = res.nextCursor
          setHasMoreRoutes(!!res.nextCursor)
        } else {
          setHasMoreRoutes(false)
        }
      } catch (error) {
        console.error('Failed to fetch more routes:', error)
      } finally {
        setIsFetching(false)
      }
    } else if (activeTab === 'likes' && hasMoreLikes && likesCursorRef.current) {
      setIsFetching(true)
      try {
        const cursor = encodeURIComponent(likesCursorRef.current)
        const res = await getDataFromServerWithJson<CursorResponse<any>>(`/api/v1/likes?route=true&take=15&cursor=${cursor}`)
        if (res && res.items.length > 0) {
          setLikes(prev => {
            const existingIds = new Set(prev.map(l => l.id));
            const filtered = res.items.filter(l => !existingIds.has(l.id));
            return [...prev, ...filtered];
          })
          likesCursorRef.current = res.nextCursor
          setHasMoreLikes(!!res.nextCursor)
        } else {
          setHasMoreLikes(false)
        }
      } catch (error) {
        console.error('Failed to fetch more likes:', error)
      } finally {
        setIsFetching(false)
      }
    } else if (activeTab === 'history' && hasMoreHistory && historyCursorRef.current) {
      setIsFetching(true)
      try {
        const cursor = encodeURIComponent(historyCursorRef.current)
        const res = await getDataFromServerWithJson<CursorResponse<any>>(`/api/v1/views?route=true&take=15&cursor=${cursor}`)
        if (res && res.items.length > 0) {
          setHistory(prev => {
            const existingIds = new Set(prev.map(v => v.id));
            const filtered = res.items.filter(v => !existingIds.has(v.id));
            return [...prev, ...filtered];
          })
          historyCursorRef.current = res.nextCursor
          setHasMoreHistory(!!res.nextCursor)
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
