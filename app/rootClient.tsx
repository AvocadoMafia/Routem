'use client'

import ScrollDetector from "@/app/_components/layout/templates/scrollDetector";
import Header from "@/app/_components/layout/templates/header";
import Main from "@/app/_components/layout/templates/main";
import {scrollDirectionAtom} from "@/lib/client/atoms";
import {useAtomValue} from "jotai";
import {motion} from "framer-motion";
import {useCallback, useEffect, useState} from "react";


export default function RootClient({children}: Readonly<{children: React.ReactNode}>) {

    const scrollDirection = useAtomValue(scrollDirectionAtom)
    const [yOffset, setYOffset] = useState(0)

    const updateOffset = useCallback(() => {
        if (window.innerWidth >= 768) {
            setYOffset(-60)
        } else {
            setYOffset(-50)
        }
    }, [])

    useEffect(() => {
        updateOffset()
        window.addEventListener('resize', updateOffset)
        return () => window.removeEventListener('resize', updateOffset)
    }, [updateOffset])

    return (
        <div className={'w-full h-[100svh] overflow-hidden overscroll-none'}>
            <motion.div
                className={[
                    "w-full flex flex-col overflow-hidden text-foreground will-change-transform",
                    "h-[calc(100svh+50px)] md:h-[calc(100svh+60px)]",
                ].join(" ")}
                animate={{
                    y: scrollDirection === 'down' ? yOffset : 0
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
            >
                <ScrollDetector/>
                <Header/>
                <Main>{children}</Main>
            </motion.div>
        </div>

    )
}