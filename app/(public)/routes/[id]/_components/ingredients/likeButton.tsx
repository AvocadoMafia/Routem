"use client";

import { HiHeart } from "react-icons/hi2";

type LikeButtonProps = {
  likesCount: number;
  variant?: "compact" | "large";
  onClick?: () => void;
};

export default function LikeButton({ likesCount, variant = "compact", onClick }: LikeButtonProps) {
  if (variant === "large") {
    return (
      <button 
        onClick={onClick}
        className="group flex items-center gap-4 px-8 py-4 bg-background-0 border border-grass rounded-full hover:border-accent-0 transition-all shadow-sm hover:shadow-xl hover:shadow-accent-0/10 cursor-pointer"
      >
        <HiHeart className="w-6 h-6 text-accent-0 group-hover:scale-125 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-0">Like this route</span>
        <div className="w-px h-4 bg-grass" />
        <span className="text-sm font-bold text-foreground-1 tabular-nums">{likesCount}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center text-foreground-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
        {likesCount} likes
      </span>
    </div>
  );
}
