import React from 'react'
import { BiHash } from 'react-icons/bi'
import {HiHeart} from 'react-icons/hi2'
import {Route} from "@/lib/client/types";
import Image from 'next/image';

export type Props = {
  route: Route
  onClick?: () => void
}

export default function FeaturedRouteCard(props: Props) {

  return (
    <button
      onClick={props.onClick}
      className="group relative w-full h-full rounded-2xl shadow-md hover:shadow-lg overflow-hidden"
      aria-label={`Top route: ${props.route.title}`}
    >
      {/* Background image */}
      <Image
        src={props.route.thumbnail?.url || '/mockImages/Kyoto.jpg'}
        alt={`${props.route.title} background`}
        fill
        className="object-cover group-hover:scale-105 duration-300 ease-out"
        unoptimized
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
            <HiHeart className="w-5 h-5" />
            <span className="tabular-nums">{props.route.likesThisWeek}</span>
            <span className="opacity-80">likes this week</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <h3 className="md:text-4xl text-2xl text-white font-bold">{props.route.title}</h3>
              <p className="text-sm text-gray-300">by @{props.route.author.name} ・ {props.route.category}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
