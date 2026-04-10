import React from "react";

export default function RouteCardWidelySkeleton({ isFirst, observerTarget }: { isFirst?: boolean, observerTarget?: React.RefObject<HTMLDivElement | null> }) {
    return (
        <div
            ref={isFirst ? observerTarget : null}
            className="w-full h-32 bg-background-0 rounded-2xl p-1.5 shadow-sm border border-foreground-1/10"
        >
            <div className="w-full h-full flex flex-row rounded-xl overflow-hidden bg-background-1">
                {/* 画像部分のスケルトン */}
                <div className="h-full aspect-square bg-background-0/50 shimmer" />
                
                {/* コンテンツ部分のスケルトン */}
                <div className="flex-1 h-full px-4 py-3 flex flex-col justify-between overflow-hidden">
                    <div className="flex flex-col gap-2">
                        {/* タイトルのスケルトン */}
                        <div className="w-full h-4 rounded shimmer bg-background-0/50" />
                        <div className="w-3/4 h-4 rounded shimmer bg-background-0/50" />
                        
                        {/* 投稿者名のスケルトン */}
                        <div className="w-1/3 h-3 rounded mt-1 shimmer bg-background-0/30" />
                    </div>
                    
                    {/* メタ情報のスケルトン */}
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-3 rounded shimmer bg-background-0/30" />
                        <div className="w-10 h-3 rounded shimmer bg-background-0/30" />
                    </div>
                </div>
            </div>
        </div>
    );
}
