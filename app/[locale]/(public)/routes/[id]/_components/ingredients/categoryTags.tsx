"use client";

import { Hash } from "lucide-react";
import { Route } from "@/lib/types/domain";

type CategoryTagsProps = {
  tags: Route["tags"];
};

export default function CategoryTags({ tags }: CategoryTagsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Hash className="w-4 h-4 text-accent-0" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
          Tags
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <span key={tag.id} className="text-[10px] font-bold text-foreground-1 px-3 py-1 bg-foreground-0/5 rounded-full uppercase tracking-[0.2em]">
            #{tag.name}
          </span>
        ))}
        {(!tags || tags.length === 0) && (
          <span className="text-[10px] font-medium text-foreground-1/40 uppercase tracking-[0.2em]">
            No tags
          </span>
        )}
      </div>
    </div>
  );
}
