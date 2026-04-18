import { useTranslations } from "next-intl";
import TrendingTagCard from "@/app/[locale]/(public)/_components/(trending)/ingredients/trendingTagCard";
import { TrendingTag } from "@/app/[locale]/(public)/_components/(trending)/trendingSection";

type Props = {
    tags?: TrendingTag[];
};

export default function TrendingTagsList({tags}: Props) {
    const tHome = useTranslations('home');
    const tEmpty = useTranslations('empty');

    if (!tags) {
        return (
            <div className={`w-full h-fit md:p-1.5 md:bg-background-0 md:rounded-2xl md:shadow-md`}>
                <div className={`w-full flex flex-col gap-4 md:bg-background-1 md:rounded-xl md:p-6`}>
                    <h2 className="md:block hidden text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">{tHome('trendingTags')}</h2>
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-full h-16 bg-background-1/30 rounded-xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`w-full h-fit md:p-1.5 md:bg-background-0 md:rounded-2xl md:shadow-md`}>
            <div className={`w-full flex flex-col gap-4 md:bg-background-1 md:rounded-xl md:p-6`}>
                <h2 className="md:block hidden text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">{tHome('trendingTags')}</h2>
                <div className="flex flex-col gap-3">
                    {tags.map((tag, idx) => (
                        <TrendingTagCard key={tag.name} tag={tag.name} postCount={tag.postCount} rank={idx + 1} />
                    ))}
                    {tags.length === 0 && (
                        <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-grass/5 rounded-3xl">
                            <p className="text-foreground-1/40 text-[10px] font-bold uppercase tracking-widest">{tEmpty('noTags')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
