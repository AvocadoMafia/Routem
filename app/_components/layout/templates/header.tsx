'use client'

import {useAtom} from "jotai";
import {scrollDirectionAtom} from "@/lib/client/atoms";
import { motion } from "framer-motion";
import PageTitle from "@/app/_components/layout/ingredients/pageTitle";
import NavigatorList from "@/app/_components/layout/ingredients/navigatorList";
import {useHeaderHeight} from "@/app/_components/common/hooks/useHeaderHeight";
import {useEffect, useState} from "react";

export default function Header () {
    const [scrollDirection, _] = useAtom(scrollDirectionAtom)
    const headerRef = useHeaderHeight()
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const height = scrollDirection === 'up' ? (isMobile ? 50 : 60) : 0
    const y = scrollDirection === 'up' ? 0 : (isMobile ? -50 : -60)

    return (
        <motion.header className={`block sticky top-0 w-full bg-background-1 box-border z-100`}
                       ref={headerRef}
                       animate={{ y, height }}
                       transition={{duration: 0.2, ease: 'easeInOut'}}
        >
            <div className={'px-4 w-full h-full flex md:justify-around justify-between items-center'}>
                <PageTitle />
                <NavigatorList/>
            </div>
        </motion.header>
    )
}
