import { useTranslations } from "next-intl";
import TrendingUserCard from "@/app/[locale]/(public)/_components/(trending)/ingredients/trendingUserCard";
import TrendingUserCardSkeleton from "@/app/[locale]/(public)/_components/(trending)/ingredients/trendingUserCardSkeleton";
import { TrendingUser } from "@/app/[locale]/(public)/_components/(trending)/trendingSection";

type Props = {
    users?: TrendingUser[];
};

export default function TrendingUsersList({ users }: Props) {
    const tHome = useTranslations('home');
    const tEmpty = useTranslations('empty');

    if (!users) {
        return (
            <div className={`w-full h-fit p-1.5 md:bg-background-0 md:rounded-2xl md:shadow-md`}>
                <div className={`w-full flex flex-col gap-4 md:bg-background-1 md:rounded-xl md:p-6`}>
                    <h2 className="md:block hidden text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">{tHome('topTravelers')}</h2>
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TrendingUserCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`w-full h-fit p-1.5 md:bg-background-0 md:rounded-2xl md:shadow-md`}>
            <div className={`w-full flex flex-col gap-4 md:bg-background-1 md:rounded-xl md:p-6`}>
                <h2 className="md:block hidden text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">{tHome('topTravelers')}</h2>
                <div className="flex flex-col gap-3">
                    {users.map((user, idx) => (
                        <TrendingUserCard key={user.id} user={user} rank={idx + 1} />
                    ))}
                    {users.length === 0 && (
                        <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-grass/5 rounded-3xl">
                            <p className="text-foreground-1/40 text-[10px] font-bold uppercase tracking-widest">{tEmpty('noTravelers')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
