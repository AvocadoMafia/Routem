'use client';

import { useUiStore } from '@/lib/client/stores/uiStore';
import {motion} from "framer-motion";
import Header from "@/app/_components/layout/templates/header";

type Props = {
    children: React.ReactNode;
    onBackgroundClick?: () => void;
}

export default function ModalFullSize({ children, onBackgroundClick }: Props) {

    const scrollDirection = useUiStore((state) => state.scrollDirection)
    const headerHeight = useUiStore((state) => state.headerHeight)

    return (
        <motion.div
            initial={false}
            animate={{
                y: scrollDirection === 'down' ? 0 : headerHeight,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full h-full z-50"
        >
            {children}
        </motion.div>
    );
}
