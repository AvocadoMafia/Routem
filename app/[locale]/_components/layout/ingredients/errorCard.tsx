'use client'

import { ErrorScheme } from "@/lib/types/error";
import { MdClose, MdErrorOutline } from "react-icons/md";
import { motion } from "framer-motion";

interface Props {
    error: ErrorScheme;
    onDelete: () => void;
}

export default function ErrorCard({ error, onDelete }: Props) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="w-full max-w-sm bg-background-1 border-l-4 border-accent-warning shadow-lg rounded-r-lg py-4 pl-4 pr-10 flex gap-4 items-start relative pointer-events-auto"
        >
            <div className="bg-accent-warning/10 p-2 rounded-full flex-shrink-0">
                <MdErrorOutline className="text-accent-warning" size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-bold text-foreground-1 uppercase tracking-wider mb-1">
                    {error.code}
                </div>
                <div className="text-sm font-medium text-foreground-0 leading-relaxed break-words">
                    {error.message}
                </div>
                {typeof error.details === 'string' && (
                    <div className="mt-2 text-xs text-foreground-1/60 italic break-words">
                        {error.details}
                    </div>
                )}
            </div>
            <button
                onClick={onDelete}
                className="p-1 hover:bg-grass rounded-full transition-colors cursor-pointer absolute top-2 right-2"
            >
                <MdClose size={20} className="text-foreground-1" />
            </button>
        </motion.div>
    );
}
