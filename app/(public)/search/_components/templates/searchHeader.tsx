import {MdSearch} from "react-icons/md";

type Props = {
    query: string;
    total: number;
    showFilters: boolean;
    onToggleFilters: () => void;
}

export default function SearchHeader({ query, total, showFilters, onToggleFilters }: Props) {
    return (
        <div className="sticky top-0 z-40 border-b border-grass flex backdrop-blur-sm bg-background-1/80 px-3">
            <div className={'w-full flex flex-col p-3 gap-3 relative overflow-hidden'}>
                <div className={'flex gap-3 items-center'}>
                    <div className="p-2 rounded-xl bg-accent-0/10 border border-accent-0/20 backdrop-blur-md">
                        <MdSearch className={'w-6 h-6 text-accent-0'} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className={'text-xl md:text-2xl font-bold text-foreground-0 tracking-tight'}>
                            Results for <span className="text-accent-0">"{query}"</span>
                        </h1>
                        <p className={'text-xs md:text-sm font-medium uppercase text-foreground-1 tracking-[0.2em]'}>
                            {total.toLocaleString()} routes found
                        </p>
                    </div>
                </div>
                <div className={'absolute -right-20 -top-20 w-10 h-10 bg-accent-0/10 blur-xl rounded-full pointer-events-none'}></div>
            </div>

            {/*Filter Open/Close Button*/}
            <div className="md:hidden flex items-center pr-4">
                <button
                    onClick={onToggleFilters}
                    className="px-4 py-2 rounded-full bg-accent-0 text-white text-sm font-bold shadow-lg shadow-accent-0/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                >
                    {showFilters ? "Close Filters" : "Filters"}
                </button>
            </div>
        </div>
    );
}
