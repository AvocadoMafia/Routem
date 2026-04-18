"use client";

import { useMemo } from "react";
import { HiShare, HiCheck } from "react-icons/hi2";
import { useTranslations } from "next-intl";
import { useShare } from "@/lib/client/hooks/useShare";
import {
  showSuccessToast,
  showWarningToast,
  toastStore,
} from "@/lib/client/stores/toastStore";

type ShareButtonProps = {
  variant?: "compact" | "large";
};

/**
 * 記事ページの共有ボタン。ロジックは useShare hook に委譲し、
 * このコンポーネントは見た目とフィードバック (トースト) のみを担当する。
 */
export default function ShareButton({ variant = "compact" }: ShareButtonProps) {
  const t = useTranslations("common");
  const tRoutes = useTranslations("routes");

  const { share, lastOutcome, isSharing } = useShare({
    onCopied: () => showSuccessToast(t("linkCopied")),
    // prompt() フォールバックに落ちた場合は URL を本文にして手動コピーを促す
    onManualCopyRequested: (url) =>
      toastStore.getState().showToast({
        tone: "info",
        title: t("shareUrlFallback"),
        message: url,
        durationMs: 8000,
      }),
    onFailed: () => showWarningToast(t("copyFailed")),
  });

  // 直近でコピーが成功してから数秒間はアイコンをチェックに切り替えて「効いた感」を出す。
  // (トーストは別途出るのでこちらは微細な成功演出)
  const justCopied = useMemo(() => {
    return lastOutcome?.kind === "copied" || lastOutcome?.kind === "manual";
  }, [lastOutcome]);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    await share({
      url: window.location.href,
      title: document.title,
    });
  };

  if (variant === "large") {
    return (
      <button
        type="button"
        onClick={handleShare}
        disabled={isSharing}
        className="group flex items-center gap-4 px-8 py-4 bg-background-0 border border-grass rounded-full transition-all shadow-sm hover:shadow-xl hover:shadow-accent-0/10 cursor-pointer hover:border-accent-0 active:scale-[0.98] disabled:opacity-60"
      >
        {justCopied ? (
          <HiCheck className="w-6 h-6 text-accent-0" />
        ) : (
          <HiShare className="w-6 h-6 text-accent-0 group-hover:scale-125 transition-transform" />
        )}
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-0">
          {justCopied ? t("copied") : tRoutes("shareThis")}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isSharing}
      className="flex items-center gap-1.5 text-foreground-1 hover:text-accent-0 transition-colors disabled:opacity-60"
      title={t("share")}
    >
      {justCopied ? (
        <HiCheck className="w-3.5 h-3.5" />
      ) : (
        <HiShare className="w-3.5 h-3.5" />
      )}
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
        {justCopied ? t("copied") : t("share")}
      </span>
    </button>
  );
}
