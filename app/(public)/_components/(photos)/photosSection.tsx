'use client'

import PhotoViewer from "@/app/(public)/_components/(photos)/templates/photoViewer";

export default function PhotosSection() {
    return (
        <div className={'w-full h-fit py-12'}>
            <PhotoViewer/>
        </div>
    );
}
