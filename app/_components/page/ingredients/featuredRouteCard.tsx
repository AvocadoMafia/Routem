import React from 'react'
import { BiHash } from 'react-icons/bi'
import { HiHeart, HiEye } from 'react-icons/hi2'

export type RouteMetricType = 'likes' | 'views'

export type TopRoute = {
  id: string
  title: string
  user: string
  likesThisWeek: number
  viewsThisWeek?: number
  category: string
  /** Background image for the route */
  thumbnailImageSrc?: string
}

export type FeaturedRouteCardProps = {
  route: TopRoute
  metric?: RouteMetricType
  onClick?: () => void
}

export default function FeaturedRouteCard({ route, metric = 'likes', onClick }: FeaturedRouteCardProps) {
  const value = metric === 'likes' ? route.likesThisWeek : (route.viewsThisWeek ?? 0)
  const Icon = metric === 'likes' ? HiHeart : HiEye

  return (
    <button
      onClick={onClick}
      className="group relative w-full h-full rounded-2xl shadow-md hover:shadow-lg overflow-hidden"
      aria-label={`Top route: ${route.title}`}
    >
      {/* Background image */}
      <img
        src={route.thumbnailImageSrc || '/mockImages/Kyoto.jpg'}
        alt={`${route.title} background`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Rank badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-1 px-2.5 py-1.5 text-white text-sm font-medium rounded-full backdrop-blur-md bg-white/10 ring-1 ring-white/15 shadow-sm">
          <BiHash className="opacity-90" />
          <span>1st</span>
        </div>
      </div>

      {/* Content */}
      <div className="w-full h-full absolute top-0 left-0 z-10 p-4">
        <div className="flex flex-col items-end absolute bottom-4 right-4 max-w-full">
          <p className="text-xl text-gray-300 font-bold flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <span className="tabular-nums">{value.toLocaleString()}</span>
            <span className="opacity-80">{metric} this week</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <h3 className="text-4xl text-white font-bold">{route.title}</h3>
              <p className="text-sm text-gray-300">by @{route.user} ・ {route.category}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
