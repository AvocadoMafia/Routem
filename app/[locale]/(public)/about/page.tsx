'use client'

import AboutBackground from "@/app/[locale]/(public)/about/_components/templates/aboutBackground";
import AboutForeground from "@/app/[locale]/(public)/about/_components/templates/aboutForeground";

export default function Page() {
    return (
        <div className="w-full h-fit scroll-smooth relative">
            <AboutBackground/>
            <AboutForeground/>
        </div>
    )
}