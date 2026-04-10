import React from "react";

export default function RouteCardHorizontalSkeleton({ isFirst, observerTarget }: { isFirst?: boolean, observerTarget?: React.RefObject<HTMLDivElement | null> }) {
    return (
        <div
            ref={isFirst ? observerTarget : null}
            className="relative w-full max-w-2xl overflow-hidden rounded-lg border-2 border-transparent bg-background-1 shadow-sm shrink-0"
            style={{ minHeight: '96px' }}
        >
            <div className="relative flex items-center justify-between gap-3 p-3">
                <div className="min-w-0 flex-1 flex flex-col gap-2">
                    {/* Title shimmer */}
                    <div className="w-2/3 h-4 rounded shimmer bg-background-0/50" />
                    <div className="flex items-center gap-2">
                        {/* Author name shimmer */}
                        <div className="w-20 h-3 rounded shimmer bg-background-0/30" />
                        <span className="text-foreground-1/30">•</span>
                        {/* RouteFor shimmer */}
                        <div className="w-16 h-3 rounded shimmer bg-background-0/30" />
                    </div>
                </div>
                {/* Likes count shimmer */}
                <div className="shrink-0 w-12 h-6 rounded-full shimmer bg-background-0/50" />
            </div>
        </div>
    );
}
