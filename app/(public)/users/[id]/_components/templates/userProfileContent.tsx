import TabNavigation from '../ingredients/tabNavigation'
import ProfileStats from '../ingredients/profileStats'
import RouteCardGraphical from '@/app/_components/common/templates/routeCardGraphical'
import { MdFavoriteBorder } from 'react-icons/md'
import React from 'react'

type Tab = 'routes' | 'likes'

export default function UserProfileContent({
  activeTab,
  onChangeTab,
  stats,
  routes,
}: {
  activeTab: Tab
  onChangeTab: (t: Tab) => void
  stats: { routes: number; followers: number | string; following: number | string }
  routes: any[]
}) {
  return (
    <div className="w-full h-fit max-w-[1200px] mx-auto px-6">
      <ProfileStats routes={stats.routes} followers={stats.followers} following={stats.following} />
      <TabNavigation activeTab={activeTab} onChange={onChangeTab} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {activeTab === 'routes' && routes.map((route) => (
          <div key={route.id} className="aspect-[4/5]">
            <RouteCardGraphical route={route} />
          </div>
        ))}

        {activeTab === 'likes' && (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-grass rounded-full flex items-center justify-center mx-auto mb-4">
              <MdFavoriteBorder size={32} className="text-foreground-1" />
            </div>
            <p className="text-foreground-1 font-medium">No liked routes yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
