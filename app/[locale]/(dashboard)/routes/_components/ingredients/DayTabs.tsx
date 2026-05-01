import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { RouteItem } from "@/lib/types/domain";

interface Props {
    allDaysItems: RouteItem[][];
    currentDayIndex: number;
    onSelectDay: (idx: number) => void;
    onRemoveDay: (idx: number) => void;
    onAddDay: () => void;
}

export default function DayTabs({
    allDaysItems,
    currentDayIndex,
    onSelectDay,
    onRemoveDay,
    onAddDay
}: Props) {
    const tRouteEditor = useTranslations('routeEditor');

    return (
        <div className="sticky top-0 z-20 h-fit flex items-center gap-0 px-2 pt-2 border-b border-grass overflow-x-auto no-scrollbar bg-background-1 shrink-0">
            {allDaysItems.map((_, idx) => (
                <div
                    key={idx}
                    className={`relative group shrink-0 flex items-center h-10 px-4 transition-all cursor-pointer rounded-t-xl border-t border-x ${
                        currentDayIndex === idx
                            ? "bg-background-0 text-accent-0 border-grass shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10"
                            : "bg-transparent border-transparent text-foreground-1/40 hover:text-foreground-1/60 hover:bg-background-0/20"
                    }`}
                    onClick={() => onSelectDay(idx)}
                >
                    {currentDayIndex === idx && (
                        <div className="absolute -bottom-px left-0 right-0 h-px bg-background-0 z-20" />
                    )}
                    <p className="font-black text-sm pt-[2px] uppercase tracking-widest whitespace-nowrap select-none">
                        Day {idx + 1}
                    </p>
                    {allDaysItems.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveDay(idx);
                            }}
                            className={`ml-2 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                                currentDayIndex === idx
                                    ? "opacity-100 text-accent-0/40 hover:bg-accent-0/10 hover:text-accent-0"
                                    : "opacity-0 group-hover:opacity-100 text-foreground-1/20 hover:bg-foreground-1/10 hover:text-foreground-1"
                            }`}
                            aria-label={tRouteEditor('removeDay')}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            ))}
            {allDaysItems.length < 10 && (
                <button
                    onClick={onAddDay}
                    className="ml-4 p-1.5 h-7 w-7 flex items-center justify-center rounded-lg bg-background-0/50 text-foreground-1/40 hover:text-accent-0 hover:bg-background-0 border border-dashed border-grass transition-all"
                    aria-label={tRouteEditor('addDay')}
                >
                    <Plus size={16} />
                </button>
            )}
        </div>
    );
}
