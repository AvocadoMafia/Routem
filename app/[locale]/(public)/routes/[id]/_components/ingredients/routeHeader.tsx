"use client";

import { useState } from "react";
import { Route } from "@/lib/client/types";
import Image from "next/image";
import {
  HiEye,
  HiClock,
  HiBanknotes,
  HiPencilSquare,
  HiTrash,
  HiShare,
  HiCheck,
  HiClipboard,
  HiLockClosed,
  HiGlobeAlt,
  HiUser,
  HiUsers,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import LikeButton from "./likeButton";
import ShareButton from "./shareButton";
import ImportButton from "./importButton";
import { Link } from "@/i18n/navigation";
import { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { useLocalizedBudget } from "@/lib/client/hooks/useLocalizedBudget";
import {MdInfo} from "react-icons/md";

type RouteHeaderProps = {
  route: Route;
  currentUser?: User | null;
};

export default function RouteHeader({ route, currentUser }: RouteHeaderProps) {
  const t = useTranslations("routes");
  const tCommon = useTranslations("common");
  const tEditor = useTranslations("routeEditor");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const localizedBudget = useLocalizedBudget(route.budget?.amount, route.budget?.localCurrencyCode, "3,500");

  const routeDate = route.date ? new Date(route.date) : null;
  const daysCount = route.routeDates.length;
  const formattedDuration = `${daysCount} ${t("daysUnit")}`;

  const author = route.author;
  const isAuthor = currentUser?.id === route.authorId;
  const isCollaborator = route.collaborators?.some((c) => c.userId === currentUser?.id);
  const canEdit = isAuthor || (isCollaborator && route.collaboratorPolicy === "CAN_EDIT");

  const handleGenerateInvite = async () => {
    try {
      const res = await fetch(`/api/v1/routes/${route.id}/invite`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate invite");
      const data = await res.json();
      const url = `${window.location.origin}/invites/${data.token}`;
      setInviteUrl(url);
    } catch (error) {
      console.error(error);
      alert(t("failedToInvite"));
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/v1/routes?id=${route.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete route");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert(t("failedToDelete"));
    }
  };

  return (
    <div className="flex flex-col border-b py-8 border-grass">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full md:w-2/5 aspect-video md:aspect-[16/10] rounded-2xl overflow-hidden shadow-xl shrink-0"
        >
          <Image
            src={route.thumbnail?.url || "/mockImages/Kyoto.jpg"}
            alt={route.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </motion.div>

        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground-0">
            <div className="flex items-center gap-2">
              {t("forWho")}
              <span className="text-xs font-bold text-accent-0 uppercase tracking-[0.3em]">
                {route.routeFor || tEditor("targetEveryone")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {t("inMonth")}
              <span className="text-xs font-bold text-accent-0 uppercase tracking-[0.3em]">
                {routeDate
                  ? routeDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {t("createdAt")}
              <span className="text-xs font-bold text-accent-0 uppercase tracking-[0.3em]">
                {new Date(route.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground-0 tracking-tight leading-tight uppercase line-clamp-2">
            {route.title}
          </h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <LikeButton routeId={route.id} initialLikesCount={route.likes?.length ?? 0} />
              <div className="flex items-center text-foreground-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                  {route.views?.length ?? 0} {t("views")}
                </span>
              </div>
            </div>
            <span className="text-foreground-1/20">&#8226;</span>
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-accent-0/20">
                <Image
                  src={author.icon?.url || "/default-avatar.png"}
                  alt={author.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="text-xs font-bold text-foreground-1 normal-case tracking-normal">{author.name}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-foreground-0/5 rounded-lg border border-foreground-0/5">
              <HiClock className="w-3.5 h-3.5 text-accent-0" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground-1">
                {formattedDuration}
              </span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-foreground-0/5 rounded-lg border border-foreground-0/5">
              <HiBanknotes className="w-3.5 h-3.5 text-accent-0" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground-1">
                {localizedBudget}
              </span>
            </div>
          </div>

          <p className="text-sm md:text-base text-foreground-1 leading-relaxed mt-1 line-clamp-3">
            "{route.description}"
          </p>
        </div>
      </div>

      {(isAuthor || isCollaborator) && (
        <div className="mt-8 flex flex-col gap-6 w-full">
          <div className="text-xl font-bold text-foreground-1 flex items-center gap-2">
            <MdInfo className={'w-6 h-6'}/>
            {isAuthor ? t("roleMessageOwner") : t("roleMessageCollaborator")}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 w-full">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-foreground-0/5 rounded-full text-[10px] md:text-xs font-medium text-foreground-1 border border-foreground-0/5">
                {route.visibility === "PUBLIC" ? (
                  <>
                    <HiGlobeAlt className="w-3.5 h-3.5 text-accent-0" /> {t("visibility")}: {tCommon("public")}
                  </>
                ) : (
                  <>
                    <HiLockClosed className="w-3.5 h-3.5 text-accent-0" /> {t("visibility")}: {tCommon("private")}
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {route.collaboratorPolicy !== "DISABLED" && (isAuthor || isCollaborator) && (
                <div className="flex items-center gap-2 h-9">
                  {!inviteUrl ? (
                    <button
                      onClick={handleGenerateInvite}
                      className="flex items-center gap-2 px-4 h-full bg-background-1 text-foreground-0 border border-accent-0 rounded-full transition-all active:scale-95 text-xs font-bold uppercase tracking-wider"
                    >
                      <HiShare className="w-4 h-4 text-accent-0" />
                      {t("inviteLink")}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 pl-4 pr-1 h-full bg-background-1 rounded-full border border-accent-0">
                      <span className="text-[10px] text-foreground-0 font-mono truncate max-w-[120px] md:max-w-[200px]">
                        {inviteUrl}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-foreground-0/10 rounded-full transition-colors text-accent-0"
                        title="Copy link"
                      >
                        {isCopying ? <HiCheck className="w-4 h-4" /> : <HiClipboard className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {canEdit && (
                <Link
                  href={`/routes/${route.id}/edit`}
                  className="flex items-center gap-2 px-4 h-9 bg-background-1 text-foreground-0 border border-accent-0 rounded-full transition-all active:scale-95 text-xs font-bold uppercase tracking-wider"
                >
                  <HiPencilSquare className="w-4 h-4 text-accent-0" />
                  {tCommon("edit")}
                </Link>
              )}

              {isAuthor && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 h-9 bg-background-1 text-foreground-0 border border-accent-0 rounded-full transition-all active:scale-95 text-xs font-bold uppercase tracking-wider"
                >
                  <HiTrash className="w-4 h-4 text-accent-0" />
                  {tCommon("delete")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
