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
                <div className={'flex gap-2 items-center'}>
                    <MdSearch className={'w-7 h-7 text-accent-0'} />
                    <h1 className={'text-2xl font-bold text-foreground-0 tracking-widest'}>Search Result for "{query}"</h1>
                </div>
                <p className={'text-md uppercase text-foreground-1 px-2'}>{total} routes</p>
                <div className={'absolute left-20 top-0 bottom-0 m-auto h-2/3 aspect-square shadow-2xl shadow-accent-0 bg-accent-0/30 blur-3xl rounded-full'}>

                </div>
            </div>

            {/*Filter Open/Close Button*/}
            <button
                onClick={onToggleFilters}
                className="md:hidden px-4 py-3 rounded-lg bg-background-2 hover:bg-background-3 text-foreground-0 font-medium transition-colors border border-grass whitespace-nowrap"
            >
                {showFilters ? "Filters ×" : "Filters"}
            </button>
        </div>
    );
}
