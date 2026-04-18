'use client'

import PhotoViewer from "@/app/[locale]/(public)/_components/(photos)/templates/photoViewer";
import SectionErrorState from "@/app/[locale]/_components/common/ingredients/sectionErrorState";
import {getDataFromServerWithJson} from "@/lib/client/helpers";
import {CursorResponse, useInfiniteScroll} from "@/lib/client/hooks/useInfiniteScroll";

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

    const {items: photos, hasMore, observerTarget, error, retry} = useInfiniteScroll<ImageItem, Photo>({
        fetcher: (cursor) => getDataFromServerWithJson<CursorResponse<ImageItem>>(
            `/api/v1/images?limit=15${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
        ),
        mapItem: mapImageToPhoto,
    })

    // --- error: 初回取得失敗 (写真リスト全体が出ない) ---
    if (error && (!photos || photos.length === 0)) {
        return (
            <div className={'w-full h-fit py-12'}>
                <SectionErrorState onRetry={retry}/>
            </div>
        )
    }

    return (
        <div className={'w-full h-fit py-12'}>
            <PhotoViewer
                photos={photos}
                hasMore={hasMore}
                observerTarget={observerTarget}
            />
            {/* 追加ロード失敗: 末尾にinline retry */}
            {error && photos && photos.length > 0 && (
                <div className="mt-6">
                    <SectionErrorState variant="inline" onRetry={retry}/>
                </div>
            )}
        </div>
    );
}
