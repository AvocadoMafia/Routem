import { Link } from "@/i18n/navigation";
import { HiHashtag } from "react-icons/hi2";

type Props = {
    tag: string;
    rank?: number;
    postCount?: number;
}

export default function TrendingTagCard({tag, rank, postCount}: Props) {
    // 投稿数が渡されていない場合はモックデータ（1.2k等）を使用
    const displayCount = postCount !== undefined ? `${postCount}` : `${(Math.random() * 2 + 0.5).toFixed(1)}k`;

    return (
        <Link
            href={`/explore?q=${encodeURIComponent(tag)}`}
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

            {/* Tag Icon (Hashtag) */}
            <div className={'relative h-10 w-10 shrink-0'}>
                <div className="relative h-full w-full rounded-full border border-grass/10 group-hover:border-grass/40 flex items-center justify-center bg-background-0 transition-colors duration-300 overflow-hidden">
                    <HiHashtag className="w-5 h-5 text-grass/60 group-hover:text-grass transition-colors duration-300" />
                    {/* 背景に薄いグラデーションを隠し味 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-grass/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            {/* Tag Info */}
            <div className={'flex-1 min-w-0 flex flex-col z-10'}>
                <h3 className={'text-sm font-bold text-foreground-0 truncate group-hover:text-grass transition-colors'}>
                    {tag}
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground-1/40">
                        {displayCount} posts
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
