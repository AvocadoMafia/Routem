import React from "react";

export default function RouteCardGraphicalSkeleton({ isFirst, observerTarget }: { isFirst?: boolean, observerTarget?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={isFirst ? observerTarget : null}
      className="group relative block w-full h-full rounded-2xl overflow-hidden shadow-sm bg-background-0 p-1.5"
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-background-1 shimmer">
        {/* Overlay to match the style */}
        <div className="absolute inset-0 rounded-lg
          backdrop-blur-2xl bg-black/50
          [mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]
          [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]" />

        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex justify-end items-start">
            {/* Rank placeholder if needed */}
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              {/* Title shimmer */}
              <div className="w-3/4 h-5 rounded shimmer bg-white/20" />
              <div className="flex items-center gap-2">
                {/* Author shimmer */}
                <div className="w-20 h-3 rounded shimmer bg-white/15" />
                <span className="text-white/20">•</span>
                {/* For shimmer */}
                <div className="w-16 h-3 rounded shimmer bg-white/15" />
              </div>
              <div className="flex items-center gap-3">
                {/* Stats shimmer */}
                <div className="w-12 h-4 rounded-full shimmer bg-white/10" />
                <div className="w-12 h-4 rounded-full shimmer bg-white/10" />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 h-8 rounded-full shimmer bg-white/10" />
              <div className="flex-1 h-8 rounded-full shimmer bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
