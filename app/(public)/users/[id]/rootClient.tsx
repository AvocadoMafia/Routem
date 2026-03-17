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
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)
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

    const fetchRoutes = async () => {
      setIsLoadingRoutes(true)
      try {
        const res = await getDataFromServerWithJson<any[]>(`/api/v1/routes?authorId=${id}&limit=50&visibility=PUBLIC`)
        if (res) {
          setUserRoutes(res)
        }
      } catch (error) {
        console.error('Failed to fetch user routes:', error)
      } finally {
        setIsLoadingRoutes(false)
      }
    }

    fetchUser()
    fetchRoutes()
  }, [id, currentUser, router])

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
          routes: userRoutes?.length || 0, 
          followers: '0', 
          following: '0' 
        }}
        routes={userRoutes || []}
        mode="public"
      />
    </div>
  )
}
