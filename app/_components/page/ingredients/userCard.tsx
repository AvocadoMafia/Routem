import React from 'react';
import { HiHeart, HiEye } from 'react-icons/hi2';

export type MetricType = 'likes' | 'views';

export type TopUser = {
  id: string;
  name: string;
  likesThisWeek: number;
  viewsThisWeek: number;
  bio?: string;
  location?: string;
  /** URL of the user's profile icon image */
  profileImage?: string;
  /** URL of the user's profile background image */
  profileBackgroundImage?: string;
};

export type UserCardProps = {
  user: TopUser;
  rank: number;
  metric: MetricType;
  onClick?: () => void;
};

export function UserCard({ user, rank, metric, onClick }: UserCardProps) {
  const value = metric === 'likes' ? user.likesThisWeek : user.viewsThisWeek;
  const Icon = metric === 'likes' ? HiHeart : HiEye;
  return (
    <button
      onClick={onClick}
      className="group relative w-full h-full text-left"
      aria-label={`Rank ${rank}: ${user.name}`}
    >
      {/* Card container with top fixed header and bottom bio area */}
      <div className="w-full h-full rounded-xl shadow-sm hover:shadow-md overflow-hidden flex flex-col">
        {/* Top section: profile background image only */}
        <div className="relative h-32">
          <img
            src={user.profileBackgroundImage || "/mockImages/userProfile.jpg"}
            alt="user header background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Middle section: icon, rank, name, metric */}
        <div className=" p-3 flex items-center gap-3">
          <img
            src={user.profileImage || "/mockImages/userIcon_1.jpg"}
            alt={`${user.name} icon`}
            className="w-11 h-11 rounded-full object-cover bg-accent-0/10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-grass/20 text-foreground-1">#{rank}</span>
              <h4 className="text-sm font-semibold truncate text-foreground-0">{user.name}</h4>
            </div>
            <div className="mt-1 flex items-center gap-2 text-foreground-1">
              <Icon className="w-4 h-4" />
              <span className="text-xs">{value.toLocaleString()} {metric}</span>
            </div>
          </div>
        </div>

        {/* Bottom section: bio */}
        <div className="flex-1 bg-background-1 p-3">
          <p className="text-xs text-foreground-1 line-clamp-4">
            {user.bio || 'No bio provided.'}
          </p>
        </div>
      </div>
    </button>
  );
}
