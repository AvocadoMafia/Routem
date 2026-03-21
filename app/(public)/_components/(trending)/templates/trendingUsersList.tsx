import { UserCardGraphical } from "@/app/_components/common/templates/userCardGraphical";
import { User } from "@/lib/client/types";

type Props = {
    users: User[];
};

export default function TrendingUsersList({ users }: Props) {

    return (
        <div className={'w-full h-fit flex flex-col gap-3'}>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">Top Travelers</h2>
            <div className="flex flex-col gap-2">
                {users.map((user, idx) => (
                    <UserCardGraphical key={user.id} user={user} rank={idx + 1} />
                ))}
                {users.length === 0 && <p className="text-foreground-1 text-xs">No travelers found.</p>}
            </div>
        </div>
    )
}
