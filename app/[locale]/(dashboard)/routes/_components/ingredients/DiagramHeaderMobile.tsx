import { Edit3, Settings as SettingsIcon, Rocket, Loader2, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
    onOpenEdit?: () => void;
    onOpenSettings: () => void;
    onPublish: () => void;
    publishing: boolean;
    isSettingsComplete: boolean;
    waypointCount: number;
}

export default function DiagramHeaderMobile({
    onOpenEdit,
    onOpenSettings,
    onPublish,
    publishing,
    isSettingsComplete,
    waypointCount
}: Props) {
    const t = useTranslations('common');
    const tRouteEditor = useTranslations('routeEditor');

    return (
        <div className="bg-background-1/80 backdrop-blur-md border-b border-grass px-4 md:px-5 py-3 md:hidden flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                <button
                    onClick={onOpenEdit}
                    className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-90 bg-background-0 text-foreground-1 border-grass"
                    aria-label={tRouteEditor('editRoute')}
                >
                    <Edit3 size={18} />
                </button>

                <div className="shrink-0 text-grass">
                    <ChevronRight size={14} />
                </div>

                <button
                    onClick={onOpenSettings}
                    className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition-all active:scale-90 bg-background-0 text-foreground-1 border-grass"
                    aria-label={tRouteEditor('routeSettings')}
                >
                    <SettingsIcon size={18} />
                </button>

                <div className="shrink-0 text-grass">
                    <ChevronRight size={14} />
                </div>

                <button
                    onClick={onPublish}
                    disabled={publishing}
                    className={`shrink-0 px-4 h-10 rounded-xl font-bold text-sm text-white flex items-center gap-2 active:scale-90 shadow-md transition-all ${(!isSettingsComplete || publishing) ? 'bg-foreground-1/40 grayscale' : 'bg-accent-0 hover:bg-accent-0/90'}`}
                    aria-label={t('publish')}
                >
                    {publishing ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <Rocket size={16} className={isSettingsComplete ? 'animate-bounce' : ''} />
                    )}
                    <span>{publishing ? t('publishing') : t('publish')}</span>
                </button>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-grass/30 ml-2">
                <span className="shrink-0 text-[10px] font-black px-2 py-1 bg-accent-0/10 text-accent-0 rounded-lg border border-accent-0/20">
                    {waypointCount}W
                </span>
            </div>
        </div>
    );
}
