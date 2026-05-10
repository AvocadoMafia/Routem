"use client";

import { useState, useEffect } from "react";
import { postDataToServerWithJson, getDataFromServerWithJson, toErrorScheme } from "@/lib/api/client";
import { useTranslations } from "next-intl";
import { errorStore } from "@/lib/stores/errorStore";

type FollowButtonProps = {
  followingId: string;
  initialIsFollowed?: boolean;
  currentUser?: { id: string } | null;
};

export default function FollowButton({
  followingId,
  initialIsFollowed = false,
  currentUser,
}: FollowButtonProps) {
  const t = useTranslations("profile");
  const appendError = errorStore((state) => state.appendError);
  const [optimisticIsFollowed, setOptimisticIsFollowed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFollowed = optimisticIsFollowed ?? initialIsFollowed;

  useEffect(() => {
    if (!currentUser?.id || !followingId) return;
    getDataFromServerWithJson<{ items: { id: string }[]; nextCursor: string | null }>(
      `/api/v1/follows?type=following&targetId=${followingId}`
    )
      .then((data) => {
        if ((data?.items?.length ?? 0) > 0) {
          setOptimisticIsFollowed(true);
        }
      })
      .catch(() => {});
  }, [currentUser?.id, followingId]);

  // 自分のページでは表示しない、またはログインしていない場合は無効化
  const isOwnAccount = currentUser?.id === followingId;

  if (isOwnAccount) return null;

  const onToggleFollow = async () => {
    if (!currentUser) {
      // ログインしていない場合の処理（通常はログインモーダルなどを出すが、ここでは簡易的に）
      return;
    }
    
    setIsLoading(true);
    // 楽観的アップデート
    const nextIsFollowed = !isFollowed;
    setOptimisticIsFollowed(nextIsFollowed);

    try {
      await postDataToServerWithJson<{ followed: boolean; follower_count: number }>(
        "/api/v1/follows",
        { followingId }
      );
    } catch (e: unknown) {
      console.error("Failed to toggle follow", e);
      // エラー時は元の状態に戻す
      setOptimisticIsFollowed(isFollowed);
      appendError(toErrorScheme(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onToggleFollow}
      disabled={isLoading || !currentUser}
      className={`flex items-center justify-center px-6 py-2 rounded-full font-bold transition-all cursor-pointer shadow-lg active:scale-95 text-sm shrink-0 disabled:opacity-50 ${
        isFollowed
          ? "bg-background-1 text-foreground-0 border border-foreground-1/10 hover:bg-foreground-1/5"
          : "bg-foreground-0 text-background-1 hover:opacity-90"
      }`}
    >
      {isFollowed ? t("unfollow") : t("follow")}
    </button>
  );
}
