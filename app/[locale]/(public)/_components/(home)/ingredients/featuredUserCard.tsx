import React from 'react'
import {BiHash} from "react-icons/bi";
import {User} from "@/lib/types/domain";
import Image from 'next/image';
import {IoPersonAdd} from "react-icons/io5";
import { Link } from "@/i18n/navigation";

export type Props = {
  user: User
    isLinkCard?: boolean,
  onClick?: () => void
}

export default function FeaturedUserCard(props: Props) {

  const content = (
    <div
      onClick={props.onClick}
      className="group relative block w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 bg-background-0 p-1.5 text-left cursor-pointer"
      aria-label={`Top user: ${props.user.name}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          props.onClick?.();
        }
      }}
    >
      {/* Background Image with Margin (via container padding) */}
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <Image
          src={props.user.background?.url || "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp"}
          alt={`${props.user.name} background`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          unoptimized
        />

        {/* Gradient Mask Overlay (Top to Bottom) with Smooth Blur - Inside the image container */}
        <div className="absolute inset-0 rounded-lg overflow-hidden
      backdrop-blur-2xl bg-black/50
      [mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]
      [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]" />

        {/* Content Container (Padding around edges) - Inside the image container */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          {/* Top section: Follow button on the left, Rank on the right */}
          <div className="flex justify-start items-start">
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
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">17k followers</span>
                <span className="opacity-60">・</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">from US</span>
              </div>
              {props.user.bio && (
                <p className="text-xs text-white/60 line-clamp-2 mt-2 leading-relaxed max-w-md">
                  {props.user.bio}
                </p>
              )}
            </div>

            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-black/10 shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
              <Image
                src={props.user.icon?.url || "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-profile.webp"}
                alt={`${props.user.name} icon`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

    if (props.isLinkCard) {
        return (
            <Link href={`/users/${props.user.id}`} className="block w-full h-full">
                {content}
            </Link>
        )
    }

    return content;
}
