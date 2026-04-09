import {User} from "@/lib/client/types";
import {IoPersonAdd} from "react-icons/io5";
import {HiBookOpen} from "react-icons/hi2";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
    user: User;
    rank?: number;
}

export default function TrendingUserCard({user, rank}: Props) {
    return (
        <Link
            href={`/users/${user.id}`}
            className={'group relative w-full h-16 flex flex-row items-center gap-4 px-4 hover:bg-background-1/50 rounded-xl transition-all duration-200'}
        >
            {/* Rank Indicator */}
            {rank && (
                <div className="w-4 flex-shrink-0 flex items-center justify-center">
                    <span className="text-xs font-black text-foreground-1/30 group-hover:text-grass/70 transition-colors">
                        {rank}
                    </span>
                </div>
            )}

            {/* User Icon */}
            <div className={'relative h-10 w-10 shrink-0'}>
                <div className="relative h-full w-full rounded-full border border-grass/10 group-hover:border-grass/40 overflow-hidden transition-colors duration-300">
                    <Image
                        className={'h-full w-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500'}
                        src={user.icon?.url || '/mockImages/userIcon_1.jpg'}
                        alt={user.name}
                        fill
                        unoptimized
                    />
                </div>
            </div>

            {/* User Info */}
            <div className={'flex-1 min-w-0 flex flex-col z-10'}>
                <h3 className={'text-sm font-bold text-foreground-0 truncate group-hover:text-grass transition-colors'}>
                    {user.name}
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-1/40">
                        {user.likes?.length ? `${user.likes.length}k` : '1.2k'} followers
                    </span>
                </div>
            </div>

            {/* Subtle Right Arrow */}
            <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <svg className="w-3.5 h-3.5 text-grass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    )
}
