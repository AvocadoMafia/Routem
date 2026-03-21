import Link from "next/link";

type Props = {
    tags: string[];
};

export default function TrendingTagsList({ tags }: Props) {
    return (
        <div className={'w-full flex-1 flex flex-col gap-4'}>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-1">Hot Topics</h2>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link
                        key={tag}
                        href={`/explore?q=${encodeURIComponent(tag)}`}
                        className="px-4 py-2 bg-background-0 hover:bg-accent-0 hover:text-white text-foreground-0 text-sm font-bold rounded-full border border-grass/10 transition-colors duration-300"
                    >
                        #{tag}
                    </Link>
                ))}
                {tags.length === 0 && <p className="text-foreground-1 text-xs">No tags found.</p>}
            </div>
        </div>
    )
}