'use client'

import {useAtom} from "jotai";
import {scrollDirectionAtom} from "@/lib/client/atoms";
import { motion } from "framer-motion";
import PageTitle from "@/app/_components/layout/ingredients/pageTitle";
import NavigatorList from "@/app/_components/layout/ingredients/navigatorList";
import {useHeaderHeight} from "@/app/_components/common/hooks/useHeaderHeight";

export default function Header () {
    const [scrollDirection, _] = useAtom(scrollDirectionAtom)
    const headerRef = useHeaderHeight()

    return (
        <motion.header className={`block sticky top-0 w-full bg-background-1 box-border`}
                       ref={headerRef}
                       animate={{y: scrollDirection === 'up' ? 0 : -50, height: scrollDirection === 'up' ? 60 : 0}}
                       transition={{duration: 0.2, ease: 'easeInOut'}}
        >
            <div className={'px-4 w-full h-full flex md:justify-around justify-between items-center'}>
                <PageTitle />
                <NavigatorList/>
            </div>
        </motion.header>
    )
}
