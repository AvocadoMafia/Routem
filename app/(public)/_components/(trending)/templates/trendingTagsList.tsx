import Link from "next/link";
import TrendingTagCard from "@/app/(public)/_components/(trending)/ingredients/trendingTagCard";

type Props = {
    tags: string[];
    mobileMode?: boolean;
};

export default function TrendingTagsList({ tags, mobileMode }: Props) {
    return (
        <div className={`w-full h-fit ${mobileMode ? '' : 'p-1.5 bg-background-0 rounded-2xl shadow-md'}`}>
            <div className={`w-full flex flex-col gap-4 ${mobileMode ? '' : 'bg-background-1 rounded-xl p-6'}`}>
                {!mobileMode && <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">Trending Tags</h2>}
                <div className="flex flex-col gap-3">
                    {tags.map((tag, idx) => (
                        <TrendingTagCard key={tag} tag={tag} rank={idx + 1} />
                    ))}
                    {tags.length === 0 && (
                        <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-grass/5 rounded-3xl">
                            <p className="text-foreground-1/40 text-[10px] font-bold uppercase tracking-widest">No tags found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}