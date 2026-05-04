import React from 'react'

export default function FeaturedUserCardSkeleton() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm bg-background-0 p-1.5 animate-pulse">
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-background-1">
        {/* Overlay to match FeaturedUserCard style */}
        <div className="absolute inset-0 rounded-lg
          backdrop-blur-2xl bg-black/50
          [mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]
          [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]" />

        {/* Content Container */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top section: Rank placeholder */}
          <div className="flex justify-start items-start">
            <div className="w-10 h-10 rounded-full bg-white/10" />
          </div>

          {/* Bottom section: User Info */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              <div className="w-3/4 h-8 rounded bg-white/20" />
              <div className="flex items-center gap-2">
                <div className="w-24 h-4 rounded bg-white/15" />
                <span className="text-white/20">・</span>
                <div className="w-20 h-4 rounded bg-white/15" />
              </div>
              {/* Bio shimmer */}
              <div className="space-y-2">
                <div className="w-full h-3 rounded bg-white/10" />
                <div className="w-4/5 h-3 rounded bg-white/10" />
              </div>
            </div>

            <div className="w-16 h-16 rounded-full bg-white/20 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
