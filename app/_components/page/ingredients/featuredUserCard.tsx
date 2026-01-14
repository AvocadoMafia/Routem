import React from 'react'
import { HiHeart, HiEye } from 'react-icons/hi2'
import type { MetricType, TopUser } from '@/app/_components/page/ingredients/userCard'
import {BiHash} from "react-icons/bi";

export type FeaturedUserCardProps = {
  user: TopUser
  metric: MetricType
  onClick?: () => void
}

export default function FeaturedUserCard({ user, metric, onClick }: FeaturedUserCardProps) {
  const value = metric === 'likes' ? user.likesThisWeek : user.viewsThisWeek
  const Icon = metric === 'likes' ? HiHeart : HiEye

  return (
    <button
      onClick={onClick}
      className="group relative w-full h-full rounded-2xl shadow-md hover:shadow-lg overflow-hidden"
      aria-label={`Top user: ${user.name}`}
    >
      {/* Background image */}
      <img
        src={user.profileBackgroundImage || "/mockImages/userProfile.jpg"}
        alt="featured background"
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
        <div className={'w-full h-full absolute top-0 left-0 z-10 p-4'}>
            <div className={'flex flex-col items-end absolute bottom-4 right-4 max-w-full'}>
                <p className={'text-xl text-gray-300 font-bold'}>{user.likesThisWeek} new followers</p>
                <div className={'flex items-center gap-2'}>
                    <div className={'flex flex-col items-end'}>
                        <h3 className={'text-4xl text-white font-bold'}>
                            {user.name}
                        </h3>
                        <p className={'text-sm text-gray-300'}>
                            from US・17k followers
                        </p>
                    </div>
                    <img src={user.profileImage || '/mockImages/userIcon_1.jpg'} alt={`${user.name} icon`} className={'w-11 h-11 rounded-full'}/>
                </div>
            </div>
        </div>

    </button>
  )
}
