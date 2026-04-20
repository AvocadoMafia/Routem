'use client'

import ScrollDetector from "@/app/[locale]/_components/layout/templates/scrollDetector";
import {useCallback, useEffect} from "react";
import { useUiStore } from "@/lib/stores/uiStore";
import { motion } from "framer-motion";
import Header from "@/app/[locale]/_components/layout/templates/header";
import Main from "@/app/[locale]/_components/layout/templates/main";
import ErrorViewer from "@/app/[locale]/_components/layout/templates/errorViewer";
import ToastViewer from "@/app/[locale]/_components/layout/templates/toastViewer";

export default function RootClient({ children }: { children: React.ReactNode }) {

    const scrollDirection = useUiStore((state) => state.scrollDirection)
    const setIsMobile = useUiStore((state) => state.setIsMobile)
    const headerHeight = useUiStore((state) => state.headerHeight)
    const setHeaderHeight = useUiStore((state) => state.setHeaderHeight)

    const updateHeight = useCallback(() => {
        const isMobile = window.innerWidth < 768;
        setIsMobile(isMobile);
        setHeaderHeight(isMobile ? 50 : 60)
    }, [setIsMobile, setHeaderHeight])

    useEffect(() => {
        updateHeight()
        window.addEventListener('resize', updateHeight)
        return () => window.removeEventListener('resize', updateHeight)
    }, [updateHeight])

    return (
        <main className="w-full h-full overflow-hidden bg-background-1">
            <ErrorViewer />
            <ToastViewer />
            <ScrollDetector />

            {/* Header */}
            <motion.div
                initial={false}
                animate={{
                    y: scrollDirection === 'down' ? -headerHeight : 0,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed top-0 left-0 w-full z-50"
            >
                <Header />
            </motion.div>

            {/* 👇 ここが唯一のスクロール要素 */}
            <motion.div
                initial={false}
                id="main-scroll-container"
                animate={{
                    paddingTop: scrollDirection === 'down' ? 0 : headerHeight,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full overflow-y-auto box-border"
            >
                <Main>{children}</Main>
            </motion.div>
        </main>
    )
}