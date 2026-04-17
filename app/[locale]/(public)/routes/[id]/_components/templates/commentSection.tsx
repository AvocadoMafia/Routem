"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Loader2 } from "lucide-react";
import CommentInput from "../ingredients/commentInput";
import CommentItem from "../ingredients/commentItem";
import CommentItemSkeleton from "../ingredients/commentItemSkeleton";
import { getDataFromServerWithJson, postDataToServerWithJson } from "@/lib/client/helpers";
import { Comment } from "@/lib/client/types";
import { useTranslations } from "next-intl";
import { userStore } from "@/lib/client/stores/userStore";
import { errorStore } from "@/lib/client/stores/errorStore";

type CommentSectionProps = {
  isMobile: boolean;
  routeId: string;
};

export default function CommentSection({ isMobile, routeId }: CommentSectionProps) {
  const t = useTranslations('comments');
  const tRoutes = useTranslations('routes');
  const user = userStore((state) => state.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const appendError = errorStore(state => state.appendError);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getDataFromServerWithJson<{ items: Comment[]; nextCursor: string | null }>(
        `/api/v1/comments?routeId=${routeId}&take=15`
      );
      if (data) {
        setComments(data.items);
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      }
    } catch (err: any) {
      appendError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [routeId]);

  const fetchMore = async () => {
    if (isFetching || !hasMore || !cursor) return;
    setIsFetching(true);
    try {
      const data = await getDataFromServerWithJson<{ items: Comment[]; nextCursor: string | null }>(
        `/api/v1/comments?routeId=${routeId}&take=15&cursor=${cursor}`
      );
      if (data && data.items.length > 0) {
        setComments((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const filtered = data.items.filter((c) => !existingIds.has(c.id));
          return [...prev, ...filtered];
        });
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Failed to fetch more comments:", err);
      appendError(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!hasMore || isFetching || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, cursor, isFetching, loading]);

  const handlePostComment = async (text: string) => {
    // 楽観的更新のためのダミーデータ作成
    const dummyComment: Comment = {
      id: "optimistic-" + Math.random().toString(36).substring(2, 11),
      text,
      userId: user.id || "optimistic",
      routeId,
      createdAt: new Date(),
      user: {
        id: user.id || "optimistic",
        name: user.name || "Anonymous",
        icon: user.icon || null,
      } as any,
      likes: [],
    };

    // 楽観的に追加
    setComments((prev) => [dummyComment, ...prev]);

    try {
      const actualComment = await postDataToServerWithJson<Comment>("/api/v1/comments", {
        routeId,
        text,
      });

      if (actualComment) {
        // ダミーを実際のものに置き換える
        setComments((prev) =>
          prev.map((c) => (c.id === dummyComment.id ? { ...actualComment, user: dummyComment.user, likes: [] } : c))
        );
      }
    } catch (err: any) {
      // 失敗した場合はダミーを削除
      setComments((prev) => prev.filter((c) => c.id !== dummyComment.id));
      appendError(err);
    }
  };

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
              {tRoutes('comments')}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-foreground-0">{tRoutes('comments')}</h2>
        </div>
      )}

      {/* コメント投稿フォーム */}
      <CommentInput onPost={handlePostComment} />

      <div className="flex flex-col gap-6">
        {comments.length > 0 ? (
          <>
            {comments.map((comment, idx) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            {hasMore && (
              <CommentItemSkeleton 
                isFirst={true}
                observerTarget={observerTarget}
              />
            )}
          </>
        ) : (
          <div className="text-foreground-1 text-sm text-center py-10 italic">{t('noComments')}</div>
        )}
      </div>

      {!loading && hasMore === false && comments.length > 15 && (
        <div className="w-full text-center py-4">
          <span className="text-[10px] font-bold text-foreground-1/40 uppercase tracking-[0.3em]">End of discussion</span>
        </div>
      )}
    </motion.div>
  );
}
