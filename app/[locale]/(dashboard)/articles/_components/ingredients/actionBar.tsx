"use client";

import { CheckCircle2, AlertCircle, Edit3, Settings, ChevronRight, Rocket, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ActionBarProps {
    isSettingsComplete: boolean;
    isTitleSet: boolean;
    isDescriptionSet: boolean;
    isThumbnailSet: boolean;
    isWaypointsSet: boolean;
    activeSection: 'edit' | 'settings';
    setActiveSection: (section: 'edit' | 'settings') => void;
    handlePublish: () => void;
    publishing: boolean;
    message: string | null;
    onClearMessage: () => void;
}

export default function ActionBar({
    isSettingsComplete,
    isTitleSet,
    isDescriptionSet,
    isThumbnailSet,
    isWaypointsSet,
    activeSection,
    setActiveSection,
    handlePublish,
    publishing,
    message,
    onClearMessage
}: ActionBarProps) {
    const t = useTranslations('routeEditor');
    const tCommon = useTranslations('common');
    const tNav = useTranslations('navigation');

    return (
        <div className="h-fit flex flex-col border-b border-grass bg-background-1/60 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {message ? (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border animate-in fade-in slide-in-from-left-2 duration-300 max-w-full group ${message.includes('fail') || message.includes('error') || message.includes('required') ? 'bg-transparent text-red-600 border-red-500/50' : 'bg-transparent text-accent-0 border-accent-0/50'}`}>
                            {message.includes('fail') || message.includes('error') || message.includes('required') ? <AlertCircle size={14} className="shrink-0" /> : <CheckCircle2 size={14} className="shrink-0" />}
                            <span className="text-[11px] font-bold tracking-tight truncate">{message}</span>
                            <button
                                onClick={onClearMessage}
                                className="ml-1 p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                                aria-label="Clear message"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : isSettingsComplete ? (
                        <div className="flex items-center gap-2 text-accent-0 bg-accent-0/20 px-3 py-1.5 rounded-full border border-accent-0/40 animate-in fade-in slide-in-from-left-2 duration-500">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold tracking-tight">{t('publicationReady')}</span>
                        </div>
                    ) : null}
                </div>

                {/* Flow Navigation */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-background-0 border border-grass rounded-2xl overflow-hidden p-1 shadow-sm">
                        {/* Step 1: Edit */}
                        <button
                            onClick={() => setActiveSection('edit')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSection === 'edit' ? 'bg-accent-0 text-white shadow-md' : 'text-foreground-1 hover:bg-grass/10'}`}
                        >
                            <Edit3 size={14} />
                            <span>{t('editRoute')}</span>
                        </button>

                        <div className="px-1 text-foreground-1">
                            <ChevronRight size={16} />
                        </div>

                        {/* Step 2: Settings */}
                        <button
                            onClick={() => setActiveSection('settings')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSection === 'settings' ? 'bg-accent-0 text-white shadow-md' : 'text-foreground-1 hover:bg-grass/10'}`}
                        >
                            <Settings size={14} />
                            <span>{tNav('settings')}</span>
                        </button>
                    </div>

                    <div className="px-1 text-foreground-1">
                        <ChevronRight size={16} />
                    </div>

                    {/* Step 3: Publish */}
                    <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className={`group relative flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-sm text-white shadow-lg transition-all active:scale-95 overflow-hidden ${(!isSettingsComplete || publishing) ? 'bg-foreground-1/40 grayscale cursor-pointer' : 'bg-accent-0 hover:bg-accent-0/90 hover:shadow-accent-0/20 hover:-translate-y-0.5'} `}
                    >
                        {isSettingsComplete && !publishing && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                        )}
                        <Rocket size={16} className={isSettingsComplete && !publishing ? 'animate-bounce' : ''} />
                        <span>{publishing ? tCommon('publishing') : tCommon('publish')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
