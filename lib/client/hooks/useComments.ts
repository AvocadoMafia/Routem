"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDataFromServerWithJson,
  postDataToServerWithJson,
  requestToServerWithJson,
  toErrorScheme,
} from "@/lib/client/helpers";
import type { Comment } from "@/lib/client/types";
import { userStore } from "@/lib/client/stores/userStore";
import { errorStore } from "@/lib/client/stores/errorStore";
import { showWarningToast } from "@/lib/client/stores/toastStore";
import { isAuthError } from "@/lib/client/hooks/useLike";

/**
 * useComments: ルート詳細ページのコメント取得 / 投稿 / 無限スクロールのロジック hook。
 *
 * サーバー側:
 *   GET  /api/v1/comments?routeId=..&take=..&cursor=..  -> { items, nextCursor } (認証不要)
 *   POST /api/v1/comments { routeId, text }             -> Comment (認証必須)
 *
 * UI 側の責務は「IntersectionObserver の target を渡す」「fetchMore を呼ぶ」「ログイン誘導 UI を出し分ける」のみ。
 *
 * 楽観 UI:
 *  - 投稿時に即 dummy を先頭挿入 (id は "optimistic-xxx")
 *  - 成功で実コメントに置換、失敗で dummy を削除
 *  - 認証エラー (401) 時はログインを促すトースト
 */

export type CursorResponse<T> = { items: T[]; nextCursor: string | null };

export type UseCommentsOptions = {
  routeId: string;
  take?: number;
  /** 一覧取得失敗時のラベル等。hook 内部では errorStore に合流させる */
  fetchFailureMessage?: string;
  /** 投稿失敗時にトーストで出すメッセージ */
  postFailureMessage?: string;
  /** 401 トーストに出すメッセージ */
  loginRequiredMessage?: string;
  loginButtonLabel?: string;
};

export type UseCommentsResult = {
  comments: Comment[];
  loading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  postComment: (text: string) => Promise<boolean>;
  /**
   * コメント削除。自分のコメントのみ許容 (サーバー側でも検証されるが、UI 側でも事前チェック)。
   * 権限が無い / 失敗時は false を返す。
   */
  deleteComment: (commentId: string) => Promise<boolean>;
  /**
   * 指定コメントを現在ログイン中ユーザーが削除できるか。
   * UI で hover 時の削除ボタンを出すかどうかの判定に使う。
   */
  canDelete: (comment: Comment) => boolean;
  isLoggedIn: boolean;
};

const DEFAULT_TAKE = 15;
const OPTIMISTIC_PREFIX = "optimistic-";

/** 楽観的ダミーコメントを作る pure function (テスト可能)。 */
export function buildOptimisticComment(params: {
  text: string;
  routeId: string;
  user: { id?: string; name?: string; icon?: { url: string } | null };
}): Comment {
  const rand = Math.random().toString(36).substring(2, 11);
  return {
    id: `${OPTIMISTIC_PREFIX}${rand}`,
    text: params.text,
    userId: params.user.id || "optimistic",
    routeId: params.routeId,
    createdAt: new Date(),
    user: {
      id: params.user.id || "optimistic",
      name: params.user.name || "Anonymous",
      icon: params.user.icon ?? null,
    } as any,
    likes: [],
  };
}

/** 重複排除付きでコメント配列を追記する pure function。 */
export function mergeComments(existing: Comment[], incoming: Comment[]): Comment[] {
  if (incoming.length === 0) return existing;
  const seen = new Set(existing.map((c) => c.id));
  const filtered = incoming.filter((c) => !seen.has(c.id));
  if (filtered.length === 0) return existing;
  return [...existing, ...filtered];
}

export function useComments(opts: UseCommentsOptions): UseCommentsResult {
  const {
    routeId,
    take = DEFAULT_TAKE,
    postFailureMessage,
    loginRequiredMessage,
    loginButtonLabel,
  } = opts;

  const router = useRouter();
  const user = userStore((state) => state.user);
  const appendError = errorStore((state) => state.appendError);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);

  // 同一 routeId で多重 fetch しないよう、進行中フラグを ref でも持つ
  const inflightRef = useRef(false);

  // 初回 / routeId 変更時の取得
  useEffect(() => {
    let cancelled = false;
    async function loadInitial() {
      if (!routeId) return;
      inflightRef.current = true;
      setLoading(true);
      setComments([]);
      setCursor(null);
      setHasMore(true);
      try {
        const data = await getDataFromServerWithJson<CursorResponse<Comment>>(
          `/api/v1/comments?routeId=${encodeURIComponent(routeId)}&take=${take}`,
        );
        if (cancelled) return;
        if (data) {
          setComments(data.items);
          setCursor(data.nextCursor);
          setHasMore(!!data.nextCursor);
        }
      } catch (err) {
        if (!cancelled) appendError(toErrorScheme(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
          inflightRef.current = false;
        }
      }
    }
    loadInitial();
    return () => {
      cancelled = true;
    };
  }, [routeId, take, appendError]);

  const fetchMore = useCallback(async () => {
    if (isFetchingMore || !hasMore || !cursor || inflightRef.current) return;
    inflightRef.current = true;
    setIsFetchingMore(true);
    try {
      const url = `/api/v1/comments?routeId=${encodeURIComponent(routeId)}&take=${take}&cursor=${encodeURIComponent(cursor)}`;
      const data = await getDataFromServerWithJson<CursorResponse<Comment>>(url);
      if (data && data.items.length > 0) {
        setComments((prev) => mergeComments(prev, data.items));
        setCursor(data.nextCursor);
        setHasMore(!!data.nextCursor);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      appendError(toErrorScheme(err));
    } finally {
      setIsFetchingMore(false);
      inflightRef.current = false;
    }
  }, [isFetchingMore, hasMore, cursor, routeId, take, appendError]);

  const postComment = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed) return false;

      // 未認証ガード: トーストを出して即 false を返す (楽観挿入しない)
      if (!user?.id) {
        showWarningToast(loginRequiredMessage ?? "Please sign in to continue", {
          action: {
            label: loginButtonLabel ?? "Sign in",
            onClick: () => router.push("/login"),
          },
          durationMs: 6000,
        });
        return false;
      }

      const dummy = buildOptimisticComment({
        text: trimmed,
        routeId,
        user: {
          id: user.id,
          name: user.name,
          icon: user.icon ?? null,
        },
      });
      // 先頭に挿入 (新しい順表示のため)
      setComments((prev) => [dummy, ...prev]);

      try {
        const actual = await postDataToServerWithJson<Comment>("/api/v1/comments", {
          routeId,
          text: trimmed,
        });

        if (actual) {
          setComments((prev) =>
            prev.map((c) =>
              c.id === dummy.id
                ? {
                    ...actual,
                    // サーバーは user を返さない場合があるので dummy の user を尊重
                    user: (actual as any).user ?? dummy.user,
                    likes: (actual as any).likes ?? [],
                  }
                : c,
            ),
          );
        }
        return true;
      } catch (err) {
        // 失敗: dummy を除去
        setComments((prev) => prev.filter((c) => c.id !== dummy.id));

        if (isAuthError(err)) {
          showWarningToast(loginRequiredMessage ?? "Please sign in to continue", {
            action: {
              label: loginButtonLabel ?? "Sign in",
              onClick: () => router.push("/login"),
            },
            durationMs: 6000,
          });
        } else {
          appendError(toErrorScheme(err));
          if (postFailureMessage) {
            showWarningToast(postFailureMessage);
          }
        }
        return false;
      }
    },
    [
      routeId,
      user?.id,
      user?.name,
      user?.icon,
      router,
      appendError,
      postFailureMessage,
      loginRequiredMessage,
      loginButtonLabel,
    ],
  );

  const canDelete = useCallback(
    (comment: Comment): boolean => {
      if (!user?.id) return false;
      // 楽観挿入中のダミーは削除不可
      if (comment.id.startsWith(OPTIMISTIC_PREFIX)) return false;
      return comment.userId === user.id;
    },
    [user?.id],
  );

  const deleteComment = useCallback(
    async (commentId: string): Promise<boolean> => {
      if (!user?.id) {
        showWarningToast(loginRequiredMessage ?? "Please sign in to continue", {
          action: {
            label: loginButtonLabel ?? "Sign in",
            onClick: () => router.push("/login"),
          },
          durationMs: 6000,
        });
        return false;
      }

      const target = comments.find((c) => c.id === commentId);
      if (!target) return false;
      // 権限チェック (サーバー側でも検証するが UI 側でも先に弾く)
      if (target.userId !== user.id) return false;

      // 楽観 UI: 先にローカルから除去し、失敗時に戻す
      const prev = comments;
      setComments((curr) => curr.filter((c) => c.id !== commentId));

      try {
        // DELETE /api/v1/comments にボディ { id } が必要。deleteDataToServerWithJson は
        // body を送れないため、低レベル関数を使う。
        await requestToServerWithJson<unknown>("/api/v1/comments", "DELETE", {
          id: commentId,
        });
        return true;
      } catch (err) {
        // ロールバック
        setComments(prev);

        if (isAuthError(err)) {
          showWarningToast(loginRequiredMessage ?? "Please sign in to continue", {
            action: {
              label: loginButtonLabel ?? "Sign in",
              onClick: () => router.push("/login"),
            },
            durationMs: 6000,
          });
        } else {
          appendError(toErrorScheme(err));
        }
        return false;
      }
    },
    [
      user?.id,
      comments,
      router,
      appendError,
      loginRequiredMessage,
      loginButtonLabel,
    ],
  );

  return {
    comments,
    loading,
    isFetchingMore,
    hasMore,
    fetchMore,
    postComment,
    deleteComment,
    canDelete,
    isLoggedIn: !!user?.id,
  };
}
