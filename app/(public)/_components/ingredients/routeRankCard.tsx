import React from 'react'
import { HiHeart, HiEye } from 'react-icons/hi2'
import {Route} from "@/lib/client/types";
import Image from 'next/image';


export type Props = {
  route: Route
  rank: number
  onClick?: () => void
}

export default function RouteRankCard(props: Props) {

  return (
    <button
      onClick={props.onClick}
      className="group relative w-full h-full text-left"
      aria-label={`Rank ${props.rank}: ${props.route.title}`}
    >
      {/* Card container matching UserCard structure */}
      <div className="w-full h-full rounded-xl shadow-sm hover:shadow-md overflow-hidden flex flex-col">
        {/* Top section: thumbnail header image */}
        <div className="relative h-32 overflow-hidden">
          <Image
            src={props.route.thumbnail?.url || '/mockImages/Kyoto.jpg'}
            alt={`${props.route.title} header`}
            fill
            className="object-cover group-hover:scale-105 duration-300 ease-out"
            unoptimized
          />
        </div>

        {/* Middle section: rank, title, metric */}
        <div className="md:p-3 p-1.5 flex items-center md:gap-3 gap-1.5">
          {/* Small square placeholder that could be a route avatar/icon if needed */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-grass/20 text-foreground-1">#{props.rank}</span>
              <h4 className="text-sm font-semibold truncate text-foreground-0">{props.route.title}</h4>
            </div>
            <div className="mt-1 flex items-center gap-2 text-foreground-1">
              <HiHeart className="w-4 h-4" />
              <span className="text-xs tabular-nums">{props.route.likesThisWeek} likes</span>
            </div>
          </div>
        </div>

        {/* Bottom section: meta info (author & category) */}
        <div className="flex-1 bg-background-1 p-3">
          <p className="text-xs text-foreground-1 truncate">@{props.route.author.name} ・ {props.route.category}</p>
        </div>
      </div>
    </button>
  )
}
