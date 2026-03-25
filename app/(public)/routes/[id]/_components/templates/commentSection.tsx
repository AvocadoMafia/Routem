"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Loader2 } from "lucide-react";
import CommentInput from "../ingredients/commentInput";
import CommentItem from "../ingredients/commentItem";
import CommentItemSkeleton from "../ingredients/commentItemSkeleton";
import { getDataFromServerWithJson, postDataToServerWithJson } from "@/lib/client/helpers";
import { Comment } from "@/lib/client/types";

type CommentSectionProps = {
  isMobile: boolean;
  routeId: string;
};

export default function CommentSection({ isMobile, routeId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDataFromServerWithJson<Comment[]>(`/api/v1/comments?routeId=${routeId}&limit=15&offset=0`);
      if (data) {
        setComments(data);
        setHasMore(data.length === 15);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [routeId]);

  const fetchMore = async () => {
    if (isFetching || !hasMore || comments.length === 0) return;
    setIsFetching(true);
    try {
      const offset = comments.length;
      const data = await getDataFromServerWithJson<Comment[]>(`/api/v1/comments?routeId=${routeId}&limit=15&offset=${offset}`);
      if (data && data.length > 0) {
        setComments(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const filtered = data.filter(c => !existingIds.has(c.id));
          return [...prev, ...filtered];
        });
        setHasMore(data.length === 15);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error("Failed to fetch more comments:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !loading) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, comments.length, isFetching, loading]);

  const handlePostComment = async (text: string) => {
    try {
      await postDataToServerWithJson("/api/v1/comments", {
        routeId,
        text,
      });
      // 再取得して一覧を更新
      await fetchComments();
    } catch (err: any) {
      alert(err.message || "Failed to post comment");
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
              Comments
            </span>
          </div>
          <h2 className="text-2xl font-bold text-foreground-0">Discussion</h2>
        </div>
      )}

      {/* コメント投稿フォーム */}
      <CommentInput onPost={handlePostComment} />

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-accent-0" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center py-10">{error}</div>
        ) : comments.length > 0 ? (
          <>
            {comments.map((comment, idx) => (
              <CommentItem key={idx} comment={comment} />
            ))}
            {hasMore && Array.from({ length: 15 }).map((_, i) => (
              <CommentItemSkeleton 
                key={`dummy-${i}`} 
                isFirst={i === 0}
                observerTarget={observerTarget}
              />
            ))}
          </>
        ) : (
          <div className="text-foreground-1 text-sm text-center py-10 italic">No comments yet.</div>
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
