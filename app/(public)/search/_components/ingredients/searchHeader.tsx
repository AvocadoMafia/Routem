type Props = {
    query: string;
    total: number;
    showFilters: boolean;
    onToggleFilters: () => void;
}

export default function SearchHeader({ query, total, showFilters, onToggleFilters }: Props) {
    return (
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            「{query}」の検索結果
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            全 <span className="font-semibold text-slate-900">{total}</span> 件
                        </p>
                    </div>
                    <button
                        onClick={onToggleFilters}
                        className="md:hidden px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                    >
                        {showFilters ? "フィルター ✕" : "フィルター ⊕"}
                    </button>
                </div>
            </div>
        </div>
    );
}
