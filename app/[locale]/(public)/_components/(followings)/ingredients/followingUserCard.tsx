import Image from "next/image";
import { Link } from "@/i18n/navigation";

type LightUser = {
  id: string;
  name: string;
  bio?: string | null;
  icon?: { url: string } | null;
};

type Props = {
  user: LightUser;
  active?: boolean;
};

export default function FollowingUserCard({ user, active }: Props) {
  return (
    <Link
      href={`/users/${user.id}`}
      className={`group w-full h-18 rounded-xl flex items-center gap-3 hover:bg-background-1/60 transition-colors ${
        active ? "bg-background-1/60" : ""
      }`}
    >
      <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-foreground-2/10 group-hover:border-accent-0/40 transition-colors">
        <Image
          src={user.icon?.url || "/mockImages/userIcon_1.jpg"}
          alt={user.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-md font-bold text-foreground-0 truncate group-hover:text-accent-0 transition-colors">
          {user.name}
        </p>
        {user.bio && (
          <p className="text-[10px] text-foreground-1/70 truncate">{user.bio}</p>
        )}
      </div>
      <svg
        className="w-5 h-5 text-accent-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
