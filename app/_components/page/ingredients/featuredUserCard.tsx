import React from 'react'
import {BiHash} from "react-icons/bi";
import {User} from "@/lib/client/types";

export type Props = {
  user: User
  onClick?: () => void
}

export default function FeaturedUserCard(props: Props) {

  return (
    <button
      onClick={props.onClick}
      className="group relative w-full h-full rounded-2xl shadow-md hover:shadow-lg overflow-hidden"
      aria-label={`Top user: ${props.user.name}`}
    >
      {/* Background image */}
      <img
        src={props.user.profileBackgroundImage || "/mockImages/userProfile.jpg"}
        alt="featured background"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-300 ease-out"
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
                <p className={'text-xl text-gray-300 font-bold'}>{props.user.likesThisWeek} new followers</p>
                <div className={'flex items-center gap-2'}>
                    <div className={'flex flex-col items-end'}>
                        <h3 className={'md:text-4xl text-2xl text-white font-bold'}>
                            {props.user.name}
                        </h3>
                        <p className={'text-sm text-gray-300'}>
                            from US・17k followers
                        </p>
                    </div>
                    <img src={props.user.profileImage || '/mockImages/userIcon_1.jpg'} alt={`${props.user.name} icon`} className={'w-11 h-11 rounded-full'}/>
                </div>
            </div>
        </div>

    </button>
  )
}
