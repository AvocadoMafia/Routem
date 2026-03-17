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
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('routes')
  const [isInitialized, setIsInitialized] = useState(false)
  const [likedRoutes, setLikedRoutes] = useState<any[]>([])
  const [historyRoutes, setHistoryRoutes] = useState<any[]>([])
  const [isLoadingLikes, setIsLoadingLikes] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

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
    if (isInitialized && currentUser && currentUser.id !== '') {
      const fetchRoutes = async () => {
        setIsLoadingRoutes(true)
        try {
          const res = await getDataFromServerWithJson<any[]>(`/api/v1/routes?authorId=${currentUser.id}&limit=50`)
          if (res) {
            setUserRoutes(res)
          }
        } catch (error) {
          console.error('Failed to fetch my routes:', error)
        } finally {
          setIsLoadingRoutes(false)
        }
      }
      fetchRoutes()
    }
  }, [isInitialized, currentUser])

  const fetchLikes = useCallback(async () => {
    if (!currentUser?.id) return
    setIsLoadingLikes(true)
    try {
      const res = await getDataFromServerWithJson<any[]>(`/api/v1/me/likes`)
      setLikedRoutes(res || [])
    } catch (e) {
      console.error('Failed to fetch liked routes', e)
    } finally {
      setIsLoadingLikes(false)
    }
  }, [currentUser?.id])

  const fetchHistory = useCallback(async () => {
    if (!currentUser?.id) return
    setIsLoadingHistory(true)
    try {
      const res = await getDataFromServerWithJson<any[]>(`/api/v1/me/views`)
      setHistoryRoutes(res || [])
    } catch (e) {
      console.error('Failed to fetch history routes', e)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [currentUser?.id])

  useEffect(() => {
    if (!isInitialized || !currentUser?.id) return
    if (activeTab === 'likes' && likedRoutes.length === 0 && !isLoadingLikes) {
      fetchLikes()
    } else if (activeTab === 'history' && historyRoutes.length === 0 && !isLoadingHistory) {
      fetchHistory()
    }
  }, [activeTab, isInitialized, currentUser?.id, likedRoutes.length, historyRoutes.length, isLoadingLikes, isLoadingHistory, fetchLikes, fetchHistory])

  if (!isInitialized) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grass"></div>
      </div>
    )
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
          routes: userRoutes?.length || 0, 
          followers: '0', 
          following: '0' 
        }}
        routes={userRoutes || []}
        likedRoutes={likedRoutes}
        historyRoutes={historyRoutes}
        mode="self"
      />
    </div>
  )
}
