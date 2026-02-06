import { CheckCircle2, AlertCircle, Edit3, Settings } from "lucide-react";

interface ActionBarProps {
    isSettingsComplete: boolean;
    activeSection: 'edit' | 'settings';
    setActiveSection: (section: 'edit' | 'settings') => void;
    handlePublish: () => void;
    publishing: boolean;
}

export default function ActionBar({
    isSettingsComplete,
    activeSection,
    setActiveSection,
    handlePublish,
    publishing
}: ActionBarProps) {
    return (
        <div className="h-fit flex flex-col border-b border-grass bg-background-1/60 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    {isSettingsComplete ? (
                        <div className="flex items-center gap-2 text-accent-2 bg-accent-2/20 px-3 py-1.5 rounded-full border border-accent-2/40 animate-in fade-in slide-in-from-left-2 duration-500">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold tracking-tight">Publication Settings Ready</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-accent-1 bg-accent-1/20 px-3 py-1.5 rounded-full border border-accent-1/40 animate-pulse">
                            <AlertCircle size={16} />
                            <span className="text-xs font-bold tracking-tight italic">Please complete Route Settings to publish</span>
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
