"use client";

import Footer from "@/app/[locale]/_components/layout/templates/footer";
import HeroSection from "./heroSection";
import UsageSection from "./usageSection";
import StatsSection from "./statsSection";
import CTASection from "./ctaSection";

export default function AboutForeground() {
    return (
        <div className="absolute w-full h-fit z-[10]">
            <HeroSection />
            <UsageSection />
            <StatsSection />
            <CTASection />
            <Footer />
        </div>
    );
}
