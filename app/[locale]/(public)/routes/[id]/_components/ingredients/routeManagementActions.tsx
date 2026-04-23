"use client";

import { useState } from "react";
import { Route } from "@/lib/types/domain";
import { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { errorStore } from "@/lib/stores/errorStore";
import { Link } from "@/i18n/navigation";
import {
  HiGlobeAlt,
  HiLockClosed,
  HiShare,
  HiCheck,
  HiClipboard,
  HiPencilSquare,
  HiTrash,
} from "react-icons/hi2";
import { MdInfo } from "react-icons/md";

type RouteManagementActionsProps = {
  route: Route;
  currentUser?: User | null;
  isAuthor: boolean;
  isCollaborator: boolean;
  canEdit: boolean;
};

export default function RouteManagementActions({
  route,
  currentUser,
  isAuthor,
  isCollaborator,
  canEdit,
}: RouteManagementActionsProps) {
  const t = useTranslations("routes");
  const tCommon = useTranslations("common");
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const appendError = errorStore((state) => state.appendError);

  const handleGenerateInvite = async () => {
    try {
      const res = await fetch(`/api/v1/routes/${route.id}/invite`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate invite");
      const data = await res.json();
      const url = `${window.location.origin}/invites/${data.token}`;
      setInviteUrl(url);
    } catch (error: any) {
      console.error(error);
      appendError(error);
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
      const res = await fetch(`/api/v1/routes?id=${route.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete route");
      window.location.href = "/";
    } catch (error: any) {
      console.error(error);
      appendError(error);
    }
  };

  if (!isAuthor && !isCollaborator) return null;

  return (
    <div className="mt-8 flex flex-col gap-6 w-full">
      <div className="text-xl font-bold text-foreground-1 flex items-center gap-2">
        <MdInfo className={"w-6 h-6"} />
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
                    title={t("copyLink")}
                  >
                    {isCopying ? (
                      <HiCheck className="w-4 h-4" />
                    ) : (
                      <HiClipboard className="w-4 h-4" />
                    )}
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
  );
}
