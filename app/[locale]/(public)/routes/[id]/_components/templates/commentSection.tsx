"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import CommentInput from "../ingredients/commentInput";
import CommentItem from "../ingredients/commentItem";
import CommentItemSkeleton from "../ingredients/commentItemSkeleton";
import LoginPromptCard from "@/app/[locale]/_components/common/ingredients/loginPromptCard";
import { useTranslations } from "next-intl";
import { DEFAULT_TAKE as COMMENTS_PAGE_SIZE, useComments } from "@/lib/hooks/useComments";

type CommentSectionProps = {
  isMobile: boolean;
  routeId: string;
};

/**
 * コメントセクションのテンプレート。
 * 取得/投稿/削除/無限スクロールは useComments hook に委譲し、
 * このコンポーネントは並びと状態別の UI (loading / empty / login prompt) のみ責務を持つ。
 */
export default function CommentSection({ isMobile, routeId }: CommentSectionProps) {
  const t = useTranslations("comments");
  const tRoutes = useTranslations("routes");
  const tCommon = useTranslations("common");

  const {
    comments,
    loading,
    isFetchingMore,
    hasMore,
    fetchMore,
    postComment,
    deleteComment,
    canDelete,
    isLoggedIn,
  } = useComments({
    routeId,
    take: COMMENTS_PAGE_SIZE,
    loginRequiredMessage: t("loginToComment"),
    loginButtonLabel: tCommon("goToLogin"),
    postFailureMessage: t("postFailed"),
  });

  // 無限スクロール用の observer target。skeleton 行に連動させる。
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isFetchingMore || loading) return;
    const target = observerTarget.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, loading, fetchMore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8 w-full"
    >
      {/* コメントセクションのタイトル - モバイルではタブがあるため非表示 */}
      {!isMobile && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-accent-0" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1">
              {tRoutes("comments")}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-foreground-0">{tRoutes("comments")}</h2>
        </div>
      )}

      {/* 投稿欄: 未ログインはログイン誘導カード、ログイン済みは入力欄 */}
      {isLoggedIn ? (
        <CommentInput onPost={postComment} />
      ) : (
        <LoginPromptCard
          title={t("loginToComment")}
          ctaLabel={tCommon("goToLogin")}
        />
      )}

      <div className="flex flex-col gap-6">
        {/* 初回ロード中は skeleton を数行並べる */}
        {loading ? (
          <>
            <CommentItemSkeleton isFirst />
            <CommentItemSkeleton />
            <CommentItemSkeleton />
          </>
        ) : comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                canDelete={canDelete(comment)}
                onDelete={() => deleteComment(comment.id)}
              />
            ))}
            {hasMore && (
              <CommentItemSkeleton isFirst observerTarget={observerTarget} />
            )}
          </>
        ) : (
          <div className="text-foreground-1 text-sm text-center py-10 italic">
            {t("noComments")}
          </div>
        )}
      </div>

      {!loading && !hasMore && comments.length > COMMENTS_PAGE_SIZE && (
        <div className="w-full text-center py-4">
          <span className="text-[10px] font-bold text-foreground-1/40 uppercase">
            {t("endOfDiscussion")}
          </span>
        </div>
      )}
    </motion.div>
  );
}
