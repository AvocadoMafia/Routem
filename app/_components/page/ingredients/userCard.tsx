import React from 'react';
import { HiHeart, HiEye } from 'react-icons/hi2';
import {User} from "@/lib/client/types";


export type Props = {
  user: User;
  rank: number;
  onClick?: () => void;
};

export function UserCard(props: Props) {
  return (
    <button
      onClick={props.onClick}
      className="group relative w-full h-full text-left"
      aria-label={`Rank ${props.rank}: ${props.user.name}`}
    >
      {/* Card container with top fixed header and bottom bio area */}
      <div className="w-full h-full rounded-xl shadow-sm hover:shadow-md overflow-hidden flex flex-col">
        {/* Top section: profile background image only */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={props.user.profileBackgroundImage || "/mockImages/userProfile.jpg"}
            alt="user header background"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-300 ease-out"
          />
        </div>

        {/* Middle section: icon, rank, name, metric */}
        <div className=" p-3 flex items-center gap-3">
          <img
            src={props.user.profileImage || "/mockImages/userIcon_1.jpg"}
            alt={`${props.user.name} icon`}
            className="w-11 h-11 rounded-full object-cover bg-accent-0/10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-grass/20 text-foreground-1">#{props.rank}</span>
              <h4 className="text-sm font-semibold truncate text-foreground-0">{props.user.name}</h4>
            </div>
            <div className="mt-1 flex items-center gap-2 text-foreground-1">
              <HiHeart className="w-4 h-4" />
              <span className="text-xs">{props.user.likesThisWeek} new followers</span>
            </div>
          </div>
        </div>

        {/* Bottom section: bio */}
        <div className="flex-1 bg-background-1 p-3">
          <p className="text-xs text-foreground-1 line-clamp-4">
            {props.user.bio || 'No bio provided.'}
          </p>
        </div>
      </div>
    </button>
  );
}
