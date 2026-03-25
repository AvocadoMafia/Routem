import React from "react";

export default function CommentItemSkeleton({ isFirst, observerTarget }: { isFirst?: boolean, observerTarget?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={isFirst ? observerTarget : null}
      className="p-6 bg-background-1 rounded-3xl w-full border border-foreground-0/10 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <div className="w-full h-4 rounded shimmer bg-background-0/50" />
        <div className="w-3/4 h-4 rounded shimmer bg-background-0/50" />
      </div>
      <div className="flex items-center justify-between">
        <div className="w-20 h-3 rounded shimmer bg-background-0/30" />
        <div className="w-16 h-2 rounded shimmer bg-background-0/20" />
      </div>
    </div>
  );
}
