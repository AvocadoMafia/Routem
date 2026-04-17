'use client'

import PhotoViewer from "@/app/[locale]/(public)/_components/(photos)/templates/photoViewer";
import {useState} from "react";

export type Photo = {
    articleId: string,
    articleTitle: string,
    userId: string,
    username: string,
    userIcon: string,
    imageUrls: string[],
}

export default function PhotosSection() {

    const [photos, setPhotos] = useState<Photo[]>([])
    const [fetching, setFetching] = useState(false)
    const [hasMore, setHasMore] = useState(true);








    return (
        <div className={'w-full h-fit py-12'}>
            <PhotoViewer photos={photos}/>
        </div>
    );
}
