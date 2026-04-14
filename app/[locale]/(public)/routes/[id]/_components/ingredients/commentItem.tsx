"use client";
import { useState } from "react";
import { Comment } from "@/lib/client/types";
import Image from "next/image";
import { HiHeart } from "react-icons/hi2";
import { postDataToServerWithJson } from "@/lib/client/helpers";
import {userStore} from "@/lib/client/stores/userStore";
import { useTranslations } from "next-intl";

type CommentItemProps = {
  comment: Comment;
};

export default function CommentItem({ comment }: CommentItemProps) {
  const t = useTranslations("comments");
  const currentUser = userStore((state) => state.user);
  
  const [likesCount, setLikesCount] = useState(comment.likes?.length ?? 0);
  const [isLiked, setIsLiked] = useState(
    comment.likes?.some((like) => like.userId === currentUser?.id) ?? false
  );
  const [loading, setLoading] = useState(false);

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleToggleLike = async () => {
    if (!currentUser?.id || loading) return;
    setLoading(true);
    try {
      const res = await postDataToServerWithJson<{ liked: boolean; like_count: number }>(
        "/api/v1/likes",
        {
          target: "COMMENT",
          commentId: comment.id,
        }
      );
      if (res) {
        setIsLiked(res.liked);
        setLikesCount(res.like_count);
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-background-1 rounded-3xl w-full border border-foreground-0/10 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      {/* コメント本文 */}
      <p className="text-lg text-foreground-0 leading-relaxed">
        {comment.text}
      </p>

      <div className="flex items-center justify-between mt-2">
        {/* ユーザー情報 */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-0/20">
            <Image
              src={comment.user?.icon?.url || "/default-avatar.png"}
              alt={comment.user?.name || "User"}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground-0">
              @{comment.user?.name || "Anonymous"}
            </span>
            <span className="text-[10px] text-foreground-1/40 font-medium">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* いいねボタン */}
        <button
          onClick={handleToggleLike}
          disabled={loading || !currentUser?.id}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95 ${
            isLiked
              ? "bg-accent-0/10 text-accent-0 border border-accent-0/20"
              : "bg-foreground-0/5 text-foreground-1 border border-transparent hover:bg-foreground-0/10"
          }`}
        >
          <HiHeart
            className={`w-4 h-4 ${isLiked ? "fill-accent-0" : ""}`}
          />
          <span className="text-xs font-bold tabular-nums">
            {likesCount}
          </span>
        </button>
      </div>
    </div>
  );
}
