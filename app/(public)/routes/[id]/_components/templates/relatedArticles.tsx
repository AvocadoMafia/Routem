"use client";

import { BookOpen, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const RELATED_ARTICLES_MOCK = [
  {
    id: "1",
    title: "京都の隠れた名所を巡る旅",
    thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=300",
    author: "TravelerA",
  },
  {
    id: "2",
    title: "週末で行ける温泉街ガイド",
    thumbnail: "https://images.unsplash.com/photo-1540206395-6880f94933af?auto=format&fit=crop&q=80&w=300",
    author: "HotSpringLover",
  },
  {
    id: "3",
    title: "カフェ好きに贈る都内散策ルート",
    thumbnail: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=300",
    author: "CafeMaster",
  },
];

type Props = {
  compact?: boolean;
};

export default function RelatedArticles({ compact = false }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2 px-1 hidden md:flex">
        <div className="flex items-center gap-2 text-accent-0">
          < BookOpen className="w-4 h-4" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Related Articles</span>
        </div>
        <h2 className={`font-bold text-foreground-0 ${compact ? 'text-xl' : 'text-2xl md:text-3xl'}`}>
          おすすめの記事
        </h2>
      </div>

      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {RELATED_ARTICLES_MOCK.map((article) => (
          <Link key={article.id} href={`/routes/${article.id}`} className="group">
            <div className={`flex gap-4 p-4 rounded-2xl border border-foreground-0/5 hover:border-accent-0/30 transition-all hover:bg-accent-0/5 h-full ${!compact && 'bg-white/50 backdrop-blur-sm shadow-sm'}`}>
              <div className={`relative ${compact ? 'w-20 h-20' : 'w-24 h-24 md:w-32 md:h-32'} rounded-xl overflow-hidden flex-shrink-0`}>
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h3 className={`${compact ? 'text-sm' : 'text-base md:text-lg'} font-bold text-foreground-0 line-clamp-2 leading-tight mb-1`}>
                  {article.title}
                </h3>
                <p className="text-[10px] md:text-xs text-foreground-1 font-medium italic opacity-70">
                  by @{article.author}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
