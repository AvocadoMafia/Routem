import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { postDataToServerWithJson, toErrorScheme } from "@/lib/api/client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { errorStore } from "@/lib/stores/errorStore";
import { MdClose } from "react-icons/md";

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
  const t = useTranslations("profile");
  const appendError = errorStore((state) => state.appendError);
  const [isUnfollowed, setIsUnfollowed] = useState(false);
  const [isUnfollowing, setIsUnfollowing] = useState(false);

  const onUnfollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(t("confirmUnfollow", { name: user.name }))) return;

    setIsUnfollowing(true);
    try {
      await postDataToServerWithJson("/api/v1/follows", {
        followingId: user.id,
      });
      setIsUnfollowed(true);
    } catch (e: unknown) {
      console.error("Failed to unfollow", e);
      appendError(toErrorScheme(e));
    } finally {
      setIsUnfollowing(false);
    }
  };

  if (isUnfollowed) return null;

  return (
    <div className="relative group">
      <Link
        href={`/users/${user.id}`}
        className={`group/link w-full h-18 rounded-xl flex items-center gap-3 hover:bg-background-1/60 transition-colors ${
          active ? "bg-background-1/60" : ""
        }`}
      >
        <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-foreground-2/10 group-hover/link:border-accent-0/40 transition-colors">
          <Image
            src={user.icon?.url || "https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-profile.webp"}
            alt={user.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-md font-bold text-foreground-0 truncate group-hover/link:text-accent-0 transition-colors">
            {user.name}
          </p>
          {user.bio && (
            <p className="text-[10px] text-foreground-1/70 truncate">{user.bio}</p>
          )}
        </div>
      </Link>
      
      <button
        onClick={onUnfollow}
        disabled={isUnfollowing}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-foreground-1/10 text-foreground-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title={t("unfollow")}
      >
        <MdClose size={20} />
      </button>
    </div>
  );
}
