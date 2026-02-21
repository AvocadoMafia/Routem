import React from 'react'
import { HiHeart, HiEye, HiClock, HiBanknotes } from 'react-icons/hi2'
import {Route} from "@/lib/client/types";
import Image from 'next/image';
import Link from "next/link";


export type Props = {
  route: Route
  rank?: number
  onClick?: () => void
}

export default function RouteCardGraphical(props: Props) {

  return (
    <Link
      href={`/routes/${props.route.id}`}
      onClick={props.onClick}
      className="group relative block w-full h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-background-0 p-2"
      aria-label={props.rank ? `Rank ${props.rank}: ${props.route.title}` : props.route.title}
    >
      {/* Background Thumbnail Image with Margin (via container padding) */}
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src={props.route.thumbnail?.url || '/mockImages/Kyoto.jpg'}
          alt={`${props.route.title} thumbnail`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          unoptimized
        />

        {/* Gradient Mask Overlay (Top to Bottom) with Smooth Blur - Inside the image container */}
        <div className="absolute inset-0 rounded-lg
      backdrop-blur-2xl bg-black/50
      [mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]
      [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]" />

        {/* Content Container (Padding around edges) - Inside the image container */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          {/* Top section: Rank on the right */}
          <div className="flex justify-end items-start">
            {props.rank && (
              <span className="theme-reversed w-8 h-8 flex items-center justify-center rounded-full bg-background-1 text-foreground-0 text-xs font-bold border border-black/10 shadow-sm">
                #{props.rank}
              </span>
            )}
          </div>

          {/* Bottom section: Title and Meta Info */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="text-lg font-bold leading-tight drop-shadow-sm line-clamp-2">
                {props.route.title}
              </h4>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 truncate mr-2">
                  <span className="truncate">@{props.route.author.name}</span>
                  <span className="opacity-60">•</span>
                  <span className="truncate">{props.route.category.name}</span>
                </div>
                
                <div className="flex items-center gap-1 shrink-0">
                  <HiHeart className="w-4 h-4 text-accent-0" />
                  <span className="tabular-nums font-semibold">{props.route.likes?.length ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Duration and Cost area (Button-like) */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-accent-1/40 backdrop-blur-md rounded-full border border-accent-1/60 shadow-inner group-hover:bg-accent-1/20 transition-colors">
                <HiClock className="w-4 h-4 text-accent-1" />
                <span className="text-[11px] font-bold tracking-tight">2.5h</span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-accent-0/40 backdrop-blur-md rounded-full border border-accent-0/60 shadow-inner group-hover:bg-accent-0/20 transition-colors">
                <HiBanknotes className="w-4 h-4 text-accent-0" />
                <span className="text-[11px] font-bold tracking-tight">¥3,500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
