import React from 'react'
import {BiHash} from "react-icons/bi";
import {User} from "@/lib/client/types";
import Image from 'next/image';
import {IoPersonAdd} from "react-icons/io5";

export type Props = {
  user: User
  onClick?: () => void
}

export default function FeaturedUserCard(props: Props) {

  return (
    <button
      onClick={props.onClick}
      className="group relative block w-full h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-background-0 p-2 text-left"
      aria-label={`Top user: ${props.user.name}`}
    >
      {/* Background Image with Margin (via container padding) */}
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src={props.user.background?.url || "/mockImages/userProfile.jpg"}
          alt={`${props.user.name} background`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          unoptimized
        />

        {/* Gradient Mask Overlay (Top to Bottom) with Smooth Blur - Inside the image container */}
        <div className="absolute inset-0 rounded-lg
      backdrop-blur-2xl bg-black/50
      [mask-image:linear-gradient(to_bottom,transparent_10%,black_90%)]
      [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,black_90%)]" />

        {/* Content Container (Padding around edges) - Inside the image container */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          {/* Top section: Rank on the right */}
          <div className="flex justify-end items-start">
            <div className="theme-reversed flex items-center justify-center w-10 h-10 bg-background-1 text-foreground-0 text-xs font-bold rounded-full border border-black/10 shadow-sm">
              1st
            </div>
          </div>

          {/* Bottom section: User Info */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="md:text-3xl text-xl font-bold leading-tight drop-shadow-sm truncate">
                {props.user.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-white/80">
                <IoPersonAdd className="w-4 h-4 text-accent-0" />
                <span className="text-sm">17k followers</span>
                <span className="opacity-60">・</span>
                <span className="text-sm">from US</span>
              </div>
              {props.user.bio && (
                <p className="text-xs text-white/60 line-clamp-2 mt-2 leading-relaxed max-w-md">
                  {props.user.bio}
                </p>
              )}
            </div>

            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-black/10 shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Image
                src={props.user.icon?.url || "/mockImages/userIcon_1.jpg"}
                alt={`${props.user.name} icon`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}
