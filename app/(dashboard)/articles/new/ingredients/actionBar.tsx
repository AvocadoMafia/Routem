import { CheckCircle2, AlertCircle, Edit3, Settings } from "lucide-react";

interface ActionBarProps {
    isSettingsComplete: boolean;
    isTitleSet: boolean;
    isBioSet: boolean;
    isThumbnailSet: boolean;
    isWaypointsSet: boolean;
    activeSection: 'edit' | 'settings';
    setActiveSection: (section: 'edit' | 'settings') => void;
    handlePublish: () => void;
    publishing: boolean;
}

export default function ActionBar({
    isSettingsComplete,
    isTitleSet,
    isBioSet,
    isThumbnailSet,
    isWaypointsSet,
    activeSection,
    setActiveSection,
    handlePublish,
    publishing
}: ActionBarProps) {
    return (
        <div className="h-fit flex flex-col border-b border-grass bg-background-1/60 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    {!isSettingsComplete ? (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-full border border-red-200 animate-pulse w-fit">
                                    <AlertCircle size={16} />
                                    <span className="text-xs font-bold tracking-tight italic">Publication Requirements Not Met</span>
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 ml-2">
                                    <span className={`text-[10px] font-medium flex items-center gap-1 ${isTitleSet ? 'text-accent-2' : 'text-foreground-1/50'}`}>
                                        {isTitleSet ? '✓' : '○'} Title
                                    </span>
                                    <span className={`text-[10px] font-medium flex items-center gap-1 ${isBioSet ? 'text-accent-2' : 'text-foreground-1/50'}`}>
                                        {isBioSet ? '✓' : '○'} Bio
                                    </span>
                                    <span className={`text-[10px] font-medium flex items-center gap-1 ${isThumbnailSet ? 'text-accent-2' : 'text-foreground-1/50'}`}>
                                        {isThumbnailSet ? '✓' : '○'} Thumbnail
                                    </span>
                                    <span className={`text-[10px] font-medium flex items-center gap-1 ${isWaypointsSet ? 'text-accent-2' : 'text-foreground-1/50'}`}>
                                        {isWaypointsSet ? '✓' : '○'} 2+ Waypoints
                                    </span>
                                </div>
                            </div>
                    ) : (
                        <div className="flex items-center gap-2 text-accent-2 bg-accent-2/20 px-3 py-1.5 rounded-full border border-accent-2/40 animate-in fade-in slide-in-from-left-2 duration-500">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold tracking-tight">Publication Settings Ready</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-background-0 border border-grass rounded-xl overflow-hidden p-1 shadow-sm">
                        <button
                            onClick={() => setActiveSection('edit')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSection === 'edit' ? 'bg-accent-0 text-white shadow-sm' : 'text-foreground-1 hover:bg-grass/10'}`}
                        >
                            <Edit3 size={14} />
                            Edit Route
                        </button>
                        <button
                            onClick={() => setActiveSection('settings')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSection === 'settings' ? 'bg-accent-0 text-white shadow-sm' : 'text-foreground-1 hover:bg-grass/10'}`}
                        >
                            <Settings size={14} />
                            Settings
                        </button>
                    </div>

                    <button
                        onClick={handlePublish}
                        disabled={publishing || !isSettingsComplete}
                        className={`px-6 py-2 rounded-xl font-bold text-sm text-white shadow-md transition-all active:scale-95 ${publishing || !isSettingsComplete ? 'bg-accent-0/40 cursor-not-allowed grayscale' : 'bg-accent-0 hover:bg-accent-0/90 hover:shadow-lg hover:-translate-y-0.5'} `}
                    >
                        {publishing ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
}
