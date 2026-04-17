import PhotoContainer from "@/app/[locale]/(public)/_components/(photos)/ingredients/photoContainer";
import Masonry from "react-masonry-css";
import {Photo} from "@/app/[locale]/(public)/_components/(photos)/photosSection";
import {useEffect, useRef, useState} from "react";


export default function PhotoViewer(props: {photos: Photo[]}) {
    const mockArray = Array.from({length: 30})
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching && !loading) {
                    fetchMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, fetchMore, isFetching, loading]);

    const breakpoints = {
        default: 3,
        1280: 2,
    };

    return (
        <Masonry
            breakpointCols={breakpoints}
            className="flex md:gap-2 gap-1"
            columnClassName="flex flex-col md:gap-2 gap-1"
        >
            {mockArray.map((_, i) => (
                <PhotoContainer key={i} test={Math.floor(Math.random() * 3)}/>
            ))}
        </Masonry>
    )
}
