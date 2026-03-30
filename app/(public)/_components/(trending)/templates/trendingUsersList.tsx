import { User } from "@/lib/client/types";
import TrendingUserCard from "@/app/(public)/_components/(trending)/ingredients/trendingUserCard";
import TrendingUserCardSkeleton from "@/app/(public)/_components/(trending)/ingredients/trendingUserCardSkeleton";

type Props = {
    users?: User[];
};

export default function TrendingUsersList({ users }: Props) {

    if (!users) {
        return (
            <div className={`w-full h-fit p-1.5 md:bg-background-0 md:rounded-2xl md:shadow-md`}>
                <div className={`w-full flex flex-col gap-4 md:bg-background-1 md:rounded-xl md:p-6`}>
                    <h2 className="md:block hidden text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">Top Travelers</h2>
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
                <h2 className="md:block hidden text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">Top Travelers</h2>
                <div className="flex flex-col gap-3">
                    {users.map((user, idx) => (
                        <TrendingUserCard key={user.id} user={user} rank={idx + 1} />
                    ))}
                    {users.length === 0 && (
                        <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-grass/5 rounded-3xl">
                            <p className="text-foreground-1/40 text-[10px] font-bold uppercase tracking-widest">No travelers found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
