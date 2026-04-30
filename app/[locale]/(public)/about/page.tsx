'use client'

import AboutForeground from "@/app/[locale]/(public)/about/_components/templates/aboutForeground";

export default function Page() {
    return (
        <div className="w-full h-fit scroll-smooth relative bg-background-0">
            <AboutForeground/>
        </div>
    )
}