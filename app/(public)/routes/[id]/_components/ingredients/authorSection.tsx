"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { Route } from "@/lib/client/types";

type AuthorSectionProps = {
  author: Route["author"];
};

export default function AuthorSection({ author }: AuthorSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <User className="w-4 h-4 text-accent-0" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
          Author
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent-0/20">
          <Image
            src={author.icon?.url || "/default-avatar.png"}
            alt={author.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground-0">@{author.name}</h3>
          <p className="text-sm text-foreground-1">{author.bio || "No bio provided."}</p>
        </div>
      </div>
    </div>
  );
}
