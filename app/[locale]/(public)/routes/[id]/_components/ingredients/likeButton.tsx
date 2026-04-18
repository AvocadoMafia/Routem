"use client";

import { HiHeart } from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLike } from "@/lib/client/hooks/useLike";

type LikeButtonProps = {
  routeId: string;
  initialLikesCount: number;
  initialIsLiked?: boolean;
  variant?: "compact" | "large";
};

/**
 * ルート向け Like ボタン。ロジックは useLike hook に委譲し、
 * このコンポーネントは押し心地と見た目だけ担当する。
 *
 * - 押下で 即反転 (楽観 UI) → API レスポンスの { liked, like_count } で確定
 * - 未認証クリックはログイン誘導トーストを出す (楽観更新はしない)
 * - 失敗時はロールバックして errorStore にエラー表示
 */
export default function LikeButton({
  routeId,
  initialLikesCount,
  initialIsLiked = false,
  variant = "compact",
}: LikeButtonProps) {
  const t = useTranslations("routes");
  const tCommon = useTranslations("common");

  const { isLiked, likeCount, pending, toggle } = useLike({
    target: "ROUTE",
    routeId,
    initialIsLiked,
    initialLikeCount: initialLikesCount,
    loginRequiredMessage: t("loginToLike"),
    loginButtonLabel: tCommon("goToLogin"),
    failureMessage: t("failedToLike"),
  });

  if (variant === "large") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={isLiked}
        className={`group flex items-center gap-4 px-8 py-4 bg-background-0 border rounded-full transition-all shadow-sm hover:shadow-xl hover:shadow-accent-0/10 cursor-pointer active:scale-[0.98] disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-accent-0 focus-visible:ring-offset-2 focus-visible:outline-none ${
          isLiked ? "border-accent-0 ring-1 ring-accent-0/20" : "border-grass hover:border-accent-0"
        }`}
      >
        {pending ? (
          <Loader2 className="w-6 h-6 text-accent-0 animate-spin" />
        ) : (
          <HiHeart
            className={`w-6 h-6 group-hover:scale-125 transition-transform ${
              isLiked ? "text-accent-0 fill-accent-0" : "text-accent-0"
            }`}
          />
        )}
        <span className="text-sm font-bold uppercase text-foreground-0">
          {isLiked ? t("liked") : t("likeThis")}
        </span>
        <div className="w-px h-4 bg-grass" />
        <span className="text-sm font-bold text-foreground-1 tabular-nums">{likeCount}</span>
      </button>
    );
  }

  // compact variant は「数だけ」の旧実装を温存 (header内で数字だけ表示するのが役割)。
  // ただし将来クリッカブルにする余地を残すため button 要素にする。
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={isLiked}
      className="flex items-center gap-1 text-foreground-1 hover:text-accent-0 active:scale-95 transition-all disabled:opacity-60 cursor-pointer rounded focus-visible:ring-2 focus-visible:ring-accent-0 focus-visible:ring-offset-2 focus-visible:outline-none"
      title={isLiked ? t("liked") : t("likeThis")}
    >
      <HiHeart
        className={`w-3.5 h-3.5 transition-transform ${
          isLiked ? "text-accent-0 fill-accent-0" : ""
        }`}
      />
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] tabular-nums">
        {likeCount} {t("likes")}
      </span>
    </button>
  );
}
