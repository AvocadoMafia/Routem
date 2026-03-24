import { User } from "@/lib/client/types";
import TrendingUserCard from "@/app/(public)/_components/(trending)/ingredients/trendingUserCard";

type Props = {
    users: User[];
    mobileMode?: boolean;
};

export default function TrendingUsersList({ users, mobileMode }: Props) {

    return (
        <div className={`w-full h-fit ${mobileMode ? '' : 'p-1.5 bg-background-0 rounded-2xl shadow-md'}`}>
            <div className={`w-full flex flex-col gap-4 ${mobileMode ? '' : 'bg-background-1 rounded-xl p-6'}`}>
                {!mobileMode && <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">Top Travelers</h2>}
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
