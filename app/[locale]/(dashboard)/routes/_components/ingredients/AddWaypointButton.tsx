import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
    onAddWaypoint: () => void;
}

export default function AddWaypointButton({ onAddWaypoint }: Props) {
    const tRoutes = useTranslations('routes');

    return (
        <motion.div
            className="w-full h-fit p-6 bg-background-1/80 backdrop-blur-sm border-t border-grass md:sticky fixed bottom-0 mt-auto z-50"
        >
            <button
                onClick={onAddWaypoint}
                className="w-full py-4 bg-accent-0 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-0/90 active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(45,31,246,0.2)]"
            >
                <Plus size={20} strokeWidth={3} />
                <span>{tRoutes('addWaypoint')}</span>
            </button>
        </motion.div>
    );
}
