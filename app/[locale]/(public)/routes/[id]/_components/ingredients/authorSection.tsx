"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { Route } from "@/lib/types/domain";
import { Link } from "@/i18n/navigation";
import FollowButton from "./followButton";
import { User as SupabaseUser } from "@supabase/supabase-js";

type AuthorSectionProps = {
  author: Route["author"];
  currentUser?: SupabaseUser | null;
};

export default function AuthorSection({ author, currentUser }: AuthorSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <User className="w-4 h-4 text-accent-0" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
          Author
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/users/${author.id}`}
          className="flex items-center gap-4 hover:opacity-80 transition-opacity flex-1 min-w-0"
        >
          <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-accent-0/20">
            <Image
              src={author.icon?.url || 'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-profile.webp'}
              alt={author.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-foreground-0">{author.name}</h3>
            <p className="text-sm text-foreground-1 truncate">{author.bio || "No bio provided."}</p>
          </div>
        </Link>
        <FollowButton followingId={author.id} currentUser={currentUser} />
      </div>
    </div>
  );
}