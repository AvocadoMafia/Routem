'use client';

import { useUiStore } from '@/lib/client/stores/uiStore';
import {motion} from "framer-motion";
import Header from "@/app/[locale]/_components/layout/templates/header";

type Props = {
    children: React.ReactNode;
    hiddenUnderMd?: boolean;
    onBackgroundClick?: () => void;
}

export default function ModalFullSize({ children, hiddenUnderMd, onBackgroundClick }: Props) {

    const scrollDirection = useUiStore((state) => state.scrollDirection)
    const headerHeight = useUiStore((state) => state.headerHeight)

    return (
        <motion.div
            initial={false}
            animate={{
                y: scrollDirection === 'down' ? 0 : headerHeight,
                height: scrollDirection === 'down' ? '100%' : `calc(100% - ${headerHeight}px)`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed top-0 left-0 w-full z-500 overflow-y-scroll ${hiddenUnderMd ? 'md:hidden' : ''}`}
        >
            {children}
        </motion.div>
    );
}
