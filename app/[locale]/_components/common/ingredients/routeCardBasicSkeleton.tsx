import React from "react";

export default function RouteCardBasicSkeleton({ isFirst, observerTarget }: { isFirst?: boolean, observerTarget?: React.RefObject<HTMLDivElement | null> }) {
    return (
        <div
            ref={isFirst ? observerTarget : null}
            className={'w-full h-[440px] sm:h-[320px] overflow-hidden rounded-2xl flex flex-col sm:flex-row shadow-sm bg-background-0 p-1.5 border border-foreground-1/10'}
        >
            {/* 画像部分のスケルトン */}
            <div className={'flex-1 min-h-[240px] sm:h-full relative overflow-hidden sm:rounded-l-xl rounded-t-xl bg-background-1 shimmer'}>
            </div>

            {/* コンテンツ部分のスケルトン */}
            <div className={'w-full sm:w-[45%] h-full min-w-[160px] flex flex-col gap-4 px-6 sm:py-6 py-3 bg-background-1 sm:rounded-r-xl rounded-b-xl'}>
                {/* 上部: For と Budget */}
                <div className="w-full flex items-center gap-2 flex-wrap">
                    <div className="w-20 h-5 rounded-full shimmer bg-background-0/80" />
                    <div className="w-24 h-5 rounded-full shimmer bg-background-0/80" />
                </div>

                {/* 中段: description */}
                <div className="flex flex-col gap-2">
                    <div className="w-full h-3 rounded shimmer bg-background-0/50" />
                    <div className="w-full h-3 rounded shimmer bg-background-0/50" />
                    <div className="w-2/3 h-3 rounded shimmer bg-background-0/50" />
                </div>

                {/* 下部: 作成者 */}
                <div className="mt-auto w-full flex items-center justify-end gap-3">
                    <div className="flex flex-col items-end gap-1">
                        <div className="w-20 h-3 rounded shimmer bg-background-0/50" />
                    </div>
                    <div className="sm:w-10 w-7 aspect-square rounded-full shimmer bg-background-0/50" />
                </div>
            </div>
        </div>
    );
}
