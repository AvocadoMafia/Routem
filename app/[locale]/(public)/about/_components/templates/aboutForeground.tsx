"use client";

import Footer from "@/app/[locale]/_components/layout/templates/footer";
import HeroSection from "./heroSection";
import SolutionSectionLaptop from "./solutionSectionLaptop";
import StepsSection from "./stepsSection";
import TargetSection from "./targetSection";
import StatsSection from "./statsSection";
import CTASection from "./ctaSection";
import SolutionSectionMobile from "@/app/[locale]/(public)/about/_components/templates/solutionSectionMobile";

export default function AboutForeground() {
    return (
        <div className={'absolute w-full h-fit z-[10]'}>
            <HeroSection />
            <SolutionSectionLaptop />
            <SolutionSectionMobile />
            <StepsSection />
            <TargetSection />
            <section className={'w-full h-fit flex flex-col'}>
                <StatsSection />
                <CTASection />
            </section>
            <Footer />
        </div>
    )
}
