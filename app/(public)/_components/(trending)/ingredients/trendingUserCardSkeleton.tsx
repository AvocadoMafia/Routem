import React from "react";

export default function TrendingUserCardSkeleton() {
    return (
        <div className="group relative w-full h-16 flex flex-row items-center gap-4 px-4 bg-background-1/30 rounded-xl">
            <div className="w-4 h-4 rounded-full shimmer bg-background-0/30 flex-shrink-0" />
            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-background-0/50 shimmer" />
            <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="w-24 h-4 rounded shimmer bg-background-0/50" />
                <div className="w-16 h-3 rounded shimmer bg-background-0/30" />
            </div>
        </div>
    );
}
