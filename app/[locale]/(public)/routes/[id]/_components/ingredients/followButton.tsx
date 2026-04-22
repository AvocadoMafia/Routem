"use client";

import { useState, useEffect } from "react";
import { postDataToServerWithJson } from "@/lib/api/client";
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
  const [isFollowed, setIsFollowed] = useState(initialIsFollowed);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsFollowed(!isFollowed);

    try {
      await postDataToServerWithJson<{ followed: boolean; follower_count: number }>(
        "/api/v1/follows",
        { followingId }
      );
    } catch (e: any) {
      console.error("Failed to toggle follow", e);
      // エラー時は元の状態に戻す
      setIsFollowed(isFollowed);
      appendError(e);
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
      {isFollowed ? t("following") : t("follow")}
    </button>
  );
}
