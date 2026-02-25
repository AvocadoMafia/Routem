"use client";

import { Tag, Hash } from "lucide-react";
import { Route } from "@/lib/client/types";

type CategoryTagsProps = {
  category: Route["category"];
};

export default function CategoryTags({ category }: CategoryTagsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Tag className="w-4 h-4 text-accent-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
            Category
          </span>
        </div>
        <div className="inline-block px-4 py-2 bg-accent-0/10 border border-accent-0/20 rounded-xl w-fit">
          <span className="text-[10px] font-bold text-accent-0 uppercase tracking-[0.3em]">
            {category.name}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Hash className="w-4 h-4 text-accent-0" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
            Tags
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Travel", "Nature", "Photography", "Weekend"].map((tag) => (
            <span key={tag} className="text-[10px] font-bold text-foreground-1 px-3 py-1 bg-foreground-0/5 rounded-full uppercase tracking-[0.2em]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
