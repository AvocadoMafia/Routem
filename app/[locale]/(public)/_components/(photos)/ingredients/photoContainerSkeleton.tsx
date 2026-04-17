import React from "react";

export default function PhotoContainerSkeleton({ isFirst, observerTarget }: { isFirst?: boolean, observerTarget?: React.RefObject<HTMLDivElement | null> }) {
    return (
        <div className={'w-full aspect-video shimmer'}  ref={isFirst ? observerTarget : null}/>
    )
}