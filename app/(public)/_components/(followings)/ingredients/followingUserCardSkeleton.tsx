import React from "react";

export default function FollowingUserCardSkeleton({ isFirst, observerTarget }: { isFirst?: boolean, observerTarget?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={isFirst ? observerTarget : null}
      className="group w-full h-18 rounded-xl flex items-center gap-3 bg-background-1/30 px-3"
    >
      <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden bg-background-0/50 shimmer" />
      <div className="min-w-0 flex-1 flex flex-col gap-2">
        <div className="w-24 h-4 rounded shimmer bg-background-0/50" />
        <div className="w-full h-3 rounded shimmer bg-background-0/30" />
      </div>
      <div className="w-5 h-5 rounded-full shimmer bg-background-0/30" />
    </div>
  );
}
