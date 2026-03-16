'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
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
        mode="self"
      />
    </div>
  )
}
