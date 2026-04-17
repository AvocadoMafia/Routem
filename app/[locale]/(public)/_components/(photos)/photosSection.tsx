'use client'

import PhotoViewer from "@/app/[locale]/(public)/_components/(photos)/templates/photoViewer";
import {useEffect, useRef, useState} from "react";
import {getDataFromServerWithJson} from "@/lib/client/helpers";
import {errorStore} from "@/lib/client/stores/errorStore";

export type Photo = {
    id: string,
    url: string,
    articleId: string,
    articleTitle: string,
    userId: string,
    username: string,
    userIcon: string | null,
    spotName: string | null,
}

type ImageItem = {
    id: string,
    url: string,
    createdAt: string,
    routeNode: {
        id: string,
        spot?: { name: string | null } | null,
        routeDate: {
            route: {
                id: string,
                title: string,
                author: {
                    id: string,
                    name: string,
                    icon: { url: string } | null,
                },
            },
        },
    } | null,
}

type CursorResponse<T> = { items: T[]; nextCursor: string | null };

function mapImageToPhoto(img: ImageItem): Photo | null {
    const route = img.routeNode?.routeDate.route;
    if (!route) return null;
    return {
        id: img.id,
        url: img.url,
        articleId: route.id,
        articleTitle: route.title,
        userId: route.author.id,
        username: route.author.name,
        userIcon: route.author.icon?.url ?? null,
        spotName: img.routeNode?.spot?.name ?? null,
    };
}

export default function PhotosSection() {

    const [photos, setPhotos] = useState<Photo[] | null>(null)
    const [isFetching, setIsFetching] = useState(false)
    const [hasMore, setHasMore] = useState(true);
    const nextCursorRef = useRef<string | null>(null);
    const appendError = errorStore(state => state.appendError);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setHasMore(true);
            nextCursorRef.current = null;
            try {
                const res = await getDataFromServerWithJson<CursorResponse<ImageItem>>('/api/v1/images?limit=15');
                if (!cancelled && res) {
                    const mapped = res.items.map(mapImageToPhoto).filter((p): p is Photo => p !== null);
                    setPhotos(mapped);
                    nextCursorRef.current = res.nextCursor;
                    if (!res.nextCursor) setHasMore(false);
                }
            } catch (e: any) {
                if (!cancelled) {
                    setPhotos([]);
                    appendError(e);
                }
            }
        }
        load();
        return () => { cancelled = true };
    }, []);

    const fetchMore = async () => {
        if (isFetching || !hasMore || !nextCursorRef.current) return;
        setIsFetching(true);
        try {
            const cursor = encodeURIComponent(nextCursorRef.current);
            const res = await getDataFromServerWithJson<CursorResponse<ImageItem>>(`/api/v1/images?limit=15&cursor=${cursor}`);
            if (res && res.items.length > 0) {
                const mapped = res.items.map(mapImageToPhoto).filter((p): p is Photo => p !== null);
                setPhotos(prev => {
                    const existing = new Set((prev ?? []).map(p => p.id));
                    const filtered = mapped.filter(p => !existing.has(p.id));
                    return [...(prev ?? []), ...filtered];
                });
                nextCursorRef.current = res.nextCursor;
                if (!res.nextCursor) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch (e: any) {
            appendError(e);
        } finally {
            setIsFetching(false);
        }
    };

    return (
        <div className={'w-full h-fit py-12'}>
            <PhotoViewer
                photos={photos}
                fetchMore={fetchMore}
                hasMore={hasMore}
                isFetching={isFetching}
            />
        </div>
    );
}
