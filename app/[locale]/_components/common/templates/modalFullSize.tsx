'use client';

import { motion } from "framer-motion";

type Props = {
    children: React.ReactNode;
    hiddenUnderMd?: boolean;
    onBackgroundClick?: () => void;
}

export default function ModalFullSize({ children, hiddenUnderMd, onBackgroundClick }: Props) {
    return (
        <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className={`fixed inset-0 z-1000 overflow-y-scroll overscroll-contain ${hiddenUnderMd ? 'md:hidden' : ''}`}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
        >
            {children}
        </motion.div>
    );
}
