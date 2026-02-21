import Link from 'next/link';
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
    <Link
      href={`/routes/${props.route.id}`}
      onClick={props.onClick}
      className="group relative block w-full h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-background-0 p-2"
      aria-label={`Top route: ${props.route.title}`}
    >
      {/* Background Image with Margin (via container padding) */}
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src={props.route.thumbnail?.url || '/mockImages/Kyoto.jpg'}
          alt={`${props.route.title} background`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          unoptimized
        />

        {/* Gradient Mask Overlay (Top to Bottom) with Smooth Blur - Inside the image container */}
        <div className="absolute inset-0 rounded-lg
      backdrop-blur-2xl bg-black/20
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

          {/* Bottom section: Title and Meta Info */}
          <div className="space-y-2 flex flex-col items-end">
            <div className="flex items-center gap-2 drop-shadow-sm">
              <HiHeart className="w-5 h-5 text-accent-0" />
              <span className="text-xl font-bold tabular-nums">{props.route.likes?.length ?? 0}</span>
              <span className="text-sm text-white/80">likes</span>
            </div>
            
            <div className="text-right">
              <h3 className="md:text-3xl text-xl font-bold leading-tight drop-shadow-sm line-clamp-2 text-white">
                {props.route.title}
              </h3>
              <p className="text-sm text-white/70 mt-1">
                by @{props.route.author.name} <span className="opacity-60">・</span> {props.route.category?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
