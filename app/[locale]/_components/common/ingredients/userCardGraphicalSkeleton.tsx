import React from 'react'

export default function UserCardGraphicalSkeleton() {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm bg-background-0 p-1.5 animate-pulse">
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-background-1">
        {/* Overlay to match UserCardGraphical style */}
        <div className="absolute inset-0 rounded-lg
          backdrop-blur-2xl bg-black/50
          [mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]
          [-webkit-mask-image:linear-gradient(to_bottom,transparent_10%,black_80%)]" />

        {/* Content Container */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top section: Rank placeholder */}
          <div className="flex justify-start items-start">
            <div className="w-8 h-8 rounded-full bg-white/10" />
          </div>

          {/* Bottom section: User Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="w-2/3 h-5 rounded bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-3 rounded bg-white/15" />
                  <span className="text-white/20">・</span>
                  <div className="w-12 h-3 rounded bg-white/15" />
                </div>
              </div>
            </div>
            {/* Bio shimmer */}
            <div className="space-y-1">
              <div className="w-full h-3 rounded bg-white/10" />
              <div className="w-4/5 h-3 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
