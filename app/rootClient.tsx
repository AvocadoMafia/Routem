'use client'

import ScrollDetector from "@/app/_components/layout/templates/scrollDetector";
import {useCallback, useEffect, useState} from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {isMobileAtom, scrollDirectionAtom} from "@/lib/client/atoms";
import { motion } from "framer-motion";
import Header from "@/app/_components/layout/templates/header";
import Main from "@/app/_components/layout/templates/main";

export default function RootClient({ children }: { children: React.ReactNode }) {

    const scrollDirection = useAtomValue(scrollDirectionAtom)
    const setIsMobile = useSetAtom(isMobileAtom)
    const [headerHeight, setHeaderHeight] = useState(50)

    const updateHeight = useCallback(() => {
        const isMobile = window.innerWidth < 768;
        setIsMobile(isMobile);
        setHeaderHeight(isMobile ? 50 : 60)
    }, [setIsMobile])

    useEffect(() => {
        updateHeight()
        window.addEventListener('resize', updateHeight)
        return () => window.removeEventListener('resize', updateHeight)
    }, [updateHeight])

    return (
        <main className="w-full h-full overflow-hidden bg-background-1">

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