import React from 'react';
import {User} from "@/lib/client/types";
import {IoPersonAdd} from "react-icons/io5";
import { HiUserGroup, HiBookOpen } from 'react-icons/hi2';
import Image from 'next/image';

export type Props = {
  user: User;
  rank?: number;
  onClick?: () => void;
};

export function UserCardGraphical(props: Props) {
  return (
    <button
      onClick={props.onClick}
      className="group relative block w-full h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-background-0 p-2 text-left"
      aria-label={props.rank ? `Rank ${props.rank}: ${props.user.name}` : props.user.name}
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

          {/* Bottom section: User Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-black/10 shrink-0 shadow-lg">
                <Image
                  src={props.user.icon?.url || "/mockImages/userIcon_1.jpg"}
                  alt={`${props.user.name} icon`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-lg font-bold leading-tight drop-shadow-sm truncate">
                  {props.user.name}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <IoPersonAdd className="w-3.5 h-3.5 text-accent-0" />
                  <span className="font-medium">17k followers</span>
                </div>
              </div>
            </div>

            {/* Profile info area (Button-like) */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-accent-1/40 backdrop-blur-md rounded-full border border-accent-1/60 shadow-inner group-hover:bg-accent-1/20 transition-colors">
                <HiUserGroup className="w-4 h-4 text-accent-1 shrink-0" />
                <span className="text-[11px] font-bold tracking-tight truncate">Follow</span>
              </div>
              <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-accent-0/40 backdrop-blur-md rounded-full border border-accent-0/60 shadow-inner group-hover:bg-accent-0/20 transition-colors">
                <HiBookOpen className="w-4 h-4 text-accent-0 shrink-0" />
                <span className="text-[11px] font-bold tracking-tight truncate">Bio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
