"use client";

import { useState } from "react";
import { postDataToServerWithJson, toErrorScheme } from "@/lib/api/client";
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
      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
        isFollowed
          ? "bg-foreground-2 text-background-1"
          : "bg-accent-0 text-background-1 shadow-md shadow-accent-0/20 hover:opacity-90"
      } disabled:opacity-50`}
    >
      {isFollowed ? t("unfollow") : t("follow")}
    </button>
  );
}
