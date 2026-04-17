import PhotoContainer from "@/app/[locale]/(public)/_components/(photos)/ingredients/photoContainer";
import PhotoContainerSkeleton from "@/app/[locale]/(public)/_components/(photos)/ingredients/photoContainerSkeleton";
import Masonry from "react-masonry-css";
import {Photo} from "@/app/[locale]/(public)/_components/(photos)/photosSection";
import {useEffect, useRef} from "react";


type Props = {
    photos: Photo[] | null,
    fetchMore?: () => Promise<void>,
    hasMore?: boolean,
    isFetching?: boolean,
}

export default function PhotoViewer({photos, fetchMore, hasMore, isFetching}: Props) {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!fetchMore || !hasMore) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching) {
                    fetchMore();
                }
            },
            { threshold: 0.1 }
        );

        const el = observerTarget.current;
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [hasMore, fetchMore, isFetching]);

    const breakpoints = {
        default: 3,
        1280: 2,
    };

    const dummyCount = 15;

    // 初回ロード中（photosが未取得）
    if (photos === null) {
        return (
            <Masonry
                breakpointCols={breakpoints}
                className="flex md:gap-2 gap-1"
                columnClassName="flex flex-col md:gap-2 gap-1"
            >
                {Array.from({ length: dummyCount }).map((_, i) => (
                    <PhotoContainerSkeleton
                        key={`initial-skeleton-${i}`}
                        isFirst={i === 0}
                        observerTarget={observerTarget}
                    />
                ))}
            </Masonry>
        );
    }

    return (
        <Masonry
            breakpointCols={breakpoints}
            className="flex md:gap-2 gap-1"
            columnClassName="flex flex-col md:gap-2 gap-1"
        >
            {photos.map((photo) => (
                <PhotoContainer key={photo.id} photo={photo}/>
            ))}
            {hasMore && Array.from({ length: dummyCount }).map((_, i) => (
                <PhotoContainerSkeleton
                    key={`more-skeleton-${i}`}
                    isFirst={i === 0}
                    observerTarget={observerTarget}
                />
            ))}
        </Masonry>
    )
}
