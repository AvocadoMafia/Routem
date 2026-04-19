"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { HiHeart, HiTrash } from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Comment } from "@/lib/types/domain";
import { userStore } from "@/lib/client/stores/userStore";
import { useLike } from "@/lib/client/hooks/useLike";
import { formatRelativeTime } from "@/lib/client/relativeTime";

type CommentItemProps = {
  comment: Comment;
  /** 親 (useComments.canDelete) が判定した削除可否。未指定は false。 */
  canDelete?: boolean;
  /** 削除ボタン押下時に呼ぶ。親の useComments.deleteComment をそのまま渡す想定。 */
  onDelete?: () => Promise<boolean> | void;
};

export default function CommentItem({ comment, canDelete = false, onDelete }: CommentItemProps) {
  const t = useTranslations("comments");
  const tCommon = useTranslations("common");
  const tRoutes = useTranslations("routes");
  const locale = useLocale();
  const currentUser = userStore((state) => state.user);

  const initialIsLiked = useMemo(
    () => comment.likes?.some((l) => l.userId === currentUser?.id) ?? false,
    [comment.likes, currentUser?.id],
  );
  const initialLikesCount = comment.likes?.length ?? 0;

  const { isLiked, likeCount, pending, toggle } = useLike({
    target: "COMMENT",
    commentId: comment.id,
    initialIsLiked,
    initialLikeCount: initialLikesCount,
    loginRequiredMessage: tRoutes("loginToLike"),
    loginButtonLabel: tCommon("goToLogin"),
    failureMessage: tRoutes("failedToLike"),
  });

  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDelete = async () => {
    if (!onDelete || deleting) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      // 3 秒以内に再タップしないと確認は解除
      window.setTimeout(() => setConfirmingDelete(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      // DOM が消えるので state 更新は不要なことが多いが、エラー時の復帰のために戻す
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  const relativeTime = useMemo(
    () => formatRelativeTime(comment.createdAt, { locale }),
    [comment.createdAt, locale],
  );

  const isOptimistic = comment.id.startsWith("optimistic-");

  return (
    <div
      className={`group relative p-6 bg-background-1 rounded-3xl w-full border border-foreground-0/10 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow ${
        isOptimistic ? "opacity-70" : ""
      }`}
    >
      {/* コメント本文 */}
      <p className="text-lg text-foreground-0 leading-relaxed whitespace-pre-wrap break-words">
        {comment.text}
      </p>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-0/20">
            <Image
              src={comment.user?.icon?.url || "/default-avatar.png"}
              alt={comment.user?.name || tCommon("user")}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground-0">
              @{comment.user?.name || tCommon("anonymous")}
            </span>
            <span className="text-[10px] text-foreground-1/40 font-medium" title={new Date(comment.createdAt).toISOString()}>
              {relativeTime}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 削除ボタン: canDelete かつ hover 時に表示 (確認モード中は常時表示) */}
          {canDelete && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              aria-label={t("deleteComment")}
              title={confirmingDelete ? t("deleteConfirm") : t("deleteComment")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all active:scale-95 disabled:opacity-50 ${
                confirmingDelete
                  ? "bg-accent-warning/15 text-accent-warning border border-accent-warning/30 opacity-100"
                  : "bg-foreground-0/5 text-foreground-1 border border-transparent opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-accent-warning/10 hover:text-accent-warning"
              }`}
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <HiTrash className="w-3.5 h-3.5" />
              )}
              {confirmingDelete && (
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {tCommon("confirm")}
                </span>
              )}
            </button>
          )}

          {/* Like ボタン */}
          <button
            type="button"
            onClick={toggle}
            disabled={pending || isOptimistic}
            aria-pressed={isLiked}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95 disabled:opacity-50 ${
              isLiked
                ? "bg-accent-0/10 text-accent-0 border border-accent-0/20"
                : "bg-foreground-0/5 text-foreground-1 border border-transparent hover:bg-foreground-0/10"
            }`}
            title={isLiked ? t("likedComment") : t("likeComment")}
          >
            <HiHeart className={`w-4 h-4 ${isLiked ? "fill-accent-0" : ""}`} />
            <span className="text-xs font-bold tabular-nums">{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
