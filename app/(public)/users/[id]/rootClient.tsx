'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { userStore } from '@/lib/client/stores/userStore'
import UserProfileHeader from './_components/templates/userProfileHeader'
import UserProfileContent from './_components/templates/userProfileContent'

// モックデータ: 投稿されたルート用
const MOCK_ROUTES = [
  { id: '1', title: 'Summer Coastal Drive', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', likes: 120, views: 1500, category: 'Driving' },
  { id: '2', title: 'Kyoto Hidden Temples', thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', likes: 85, views: 920, category: 'Walking' },
  { id: '3', title: 'Nagano Mountain Pass', thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', likes: 230, views: 3400, category: 'Cycling' },
  { id: '4', title: 'Tokyo Night Walk', thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800', likes: 45, views: 600, category: 'Walking' },
  { id: '5', title: 'Hokkaido Flower Fields', thumbnail: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800', likes: 310, views: 4200, category: 'Touring' },
  { id: '6', title: 'Osaka Street Food Map', thumbnail: 'https://images.unsplash.com/photo-1590244921278-db049a2ef398?w=800', likes: 156, views: 2100, category: 'Food' },
]

export default function RootClient({ id }: { id: string }) {
  const router = useRouter()
  const currentUser = userStore(state => state.user)
  const [activeTab, setActiveTab] = useState<'routes' | 'likes'>('routes')

  // users/me にアクセスした場合、実際のユーザーIDにリダイレクトする
  useEffect(() => {
    if (id === 'me') {
      if (currentUser?.id && currentUser.id !== '') {
        router.replace(`/users/${currentUser.id}`)
      }
    }
  }, [id, currentUser, router])

  // 本来はIDに基づいてユーザー情報を取得するが、ここではログインユーザーまたはモックを表示
  const isOwnPage = currentUser?.id === id || (id as string) === 'me'
  const displayUser = isOwnPage ? currentUser : {
    name: 'Travel Enthusiast',
    bio: 'Exploring the world one route at a time. Photography & Nature lover.',
    icon: { url: 'https://i.pravatar.cc/150?u=user_page_mock' },
    background: { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600' },
  }

  return (
    <div className="w-full h-fit pb-20">
      <UserProfileHeader 
        name={displayUser?.name}
        bio={displayUser?.bio as string}
        iconUrl={displayUser?.icon?.url}
        bgUrl={displayUser?.background?.url}
        isOwnPage={!!isOwnPage}
      />

      <UserProfileContent 
        activeTab={activeTab} 
        onChangeTab={setActiveTab}
        stats={{ routes: 12, followers: '1.2k', following: '450' }}
        routes={MOCK_ROUTES}
      />
    </div>
  )
}
