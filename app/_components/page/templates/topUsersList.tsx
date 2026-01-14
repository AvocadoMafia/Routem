'use client'

import {useEffect, useMemo, useState} from 'react'
import FeaturedUserCard from '@/app/_components/page/ingredients/featuredUserCard'
import { MetricType, TopUser, UserCard } from '@/app/_components/page/ingredients/userCard'
import { HiHeart, HiEye } from 'react-icons/hi2'

// Mock users for demo (this week)
const mockUsers: TopUser[] = [
  { id: 'u1', name: 'Aki Tanaka', likesThisWeek: 1240, viewsThisWeek: 28120, location: 'Tokyo, JP', bio: 'City explorer and coffee lover.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Nara.jpg' },
  { id: 'u2', name: 'Kenji Sato', likesThisWeek: 980, viewsThisWeek: 19230, location: 'Osaka, JP', bio: 'Runner and ramen hunter in Kansai.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Tokyo.jpg' },
  { id: 'u3', name: 'Serene Jane', likesThisWeek: 1570, viewsThisWeek: 32010, location: 'Kyoto, JP', bio: 'History routes and hidden shrines.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/userProfile.jpg' },
  { id: 'u4', name: 'Yuta Mori', likesThisWeek: 870, viewsThisWeek: 16800, location: 'Sapporo, JP', bio: 'Snowy trails and craft beer enthusiast.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Fuji.jpg' },
  { id: 'u5', name: 'Hana Suzuki', likesThisWeek: 1430, viewsThisWeek: 29990, location: 'Fukuoka, JP', bio: 'Weekend cyclist and bakery map maker from Japan. And Ive Lived in French since last year. Its great and I love here.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Kyoto.jpg' },
  { id: 'u6', name: 'Ren Nakamura', likesThisWeek: 760, viewsThisWeek: 14550, location: 'Nagoya, JP', bio: 'Techie who loves riverfront jogs.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Hokkaido.jpg' },
  { id: 'u7', name: 'Sara Ito', likesThisWeek: 1110, viewsThisWeek: 25040, location: 'Nara, JP', bio: 'Nature walks and deer lover in Nara.', profileImage: '/mockImages/userIcon_1.jpg', profileBackgroundImage: '/mockImages/Hokkaido.jpg' },
]

// Simple hook to match Tailwind's md breakpoint (min-width: 768px)
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler as any)
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler as any)
    }
  }, [query])
  return matches
}

export default function TopUsersList() {
  const [metric, setMetric] = useState<MetricType>('likes')

  const sorted = useMemo(() => {
    const arr = [...mockUsers]
    arr.sort((a, b) => {
      const av = metric === 'likes' ? a.likesThisWeek : a.viewsThisWeek
      const bv = metric === 'likes' ? b.likesThisWeek : b.viewsThisWeek
      return bv - av
    })
    return arr
  }, [metric])

  // Determine how many columns we have and limit visible users accordingly
  const isMdUp = useMediaQuery('(min-width: 768px)')
  const cols = isMdUp ? 6 : 1
  const visibleCount = cols >= 2 ? Math.min(sorted.length, 1 + (cols - 2)) : Math.min(sorted.length, 1)

  const visible = sorted.slice(0, visibleCount)
  const top = visible[0]
  const rest = visible.slice(1)

  return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex flex-row-reverse items-center gap-2">
        <h2 className="text-sm font-semibold text-foreground-0">Top Users — This week</h2>
      </div>
      <div className="w-full h-[300px] grid grid-cols-1 md:grid-cols-6 gap-3 md:[direction:rtl]">
        {top && (
          <div className="md:col-span-2 [direction:ltr]">
            <FeaturedUserCard user={top} metric={metric} />
          </div>
        )}
        {rest.map((u, idx) => (
          <div key={u.id} className="col-span-1 [direction:ltr]">
            <UserCard user={u} rank={idx + 2} metric={metric} />
          </div>
        ))}
      </div>
    </div>
  )
}
