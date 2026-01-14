import React from 'react'
import { HiHeart, HiEye } from 'react-icons/hi2'
import {Route} from "@/lib/client/types";

export type RouteMetricType = 'likes' | 'views'

export type RouteRankCardProps = {
  route: Route
  rank: number
  metric?: RouteMetricType
  onClick?: () => void
}

export default function RouteRankCard({ route, rank, metric = 'likes', onClick }: RouteRankCardProps) {
  const value = metric === 'likes' ? route.likesThisWeek : (route.viewsThisWeek ?? 0)
  const Icon = metric === 'likes' ? HiHeart : HiEye

  return (
    <button
      onClick={onClick}
      className="group relative w-full h-full text-left"
      aria-label={`Rank ${rank}: ${route.title}`}
    >
      {/* Card container matching UserCard structure */}
      <div className="w-full h-full rounded-xl shadow-sm hover:shadow-md overflow-hidden flex flex-col">
        {/* Top section: thumbnail header image */}
        <div className="relative h-32">
          <img
            src={route.thumbnailImageSrc || '/mockImages/Kyoto.jpg'}
            alt={`${route.title} header`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Middle section: rank, title, metric */}
        <div className="p-3 flex items-center gap-3">
          {/* Small square placeholder that could be a route avatar/icon if needed */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-grass/20 text-foreground-1">#{rank}</span>
              <h4 className="text-sm font-semibold truncate text-foreground-0">{route.title}</h4>
            </div>
            <div className="mt-1 flex items-center gap-2 text-foreground-1">
              <Icon className="w-4 h-4" />
              <span className="text-xs tabular-nums">{value.toLocaleString()} {metric}</span>
            </div>
          </div>
        </div>

        {/* Bottom section: meta info (author & category) */}
        <div className="flex-1 bg-background-1 p-3">
          <p className="text-xs text-foreground-1 truncate">@{route.user} ・ {route.category}</p>
        </div>
      </div>
    </button>
  )
}
