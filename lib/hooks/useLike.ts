"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { postDataToServerWithJson } from "@/lib/api/client";
import { userStore } from "@/lib/stores/userStore";
import { errorStore } from "@/lib/stores/errorStore";
import { showWarningToast } from "@/lib/stores/toastStore";
import { toErrorScheme } from "@/lib/api/client";

/**
 * useLike: Route / Comment いいねのトグル UI を駆動する hook。
 *
 * ポリシー:
 *  - 楽観 UI: クリック時に即 isLiked / count を動かし、押し心地を良くする
 *  - API レスポンスの { liked, like_count } を Single Source of Truth として確定反映
 *  - 失敗時は元状態にロールバック + エラーを errorStore / toast で可視化
 *  - 未認証 (401) 時はログイン誘導トーストを出し、ボタンは元状態に戻す
 *
 * サーバー側: POST /api/v1/likes
 *   body: { target: "ROUTE" | "COMMENT", routeId?, commentId? }
 *   response: { liked: boolean, like_count: number }
 */

export type LikeTarget = "ROUTE" | "COMMENT";

export type UseLikeOptions = {
  target: LikeTarget;
  /** target に応じて routeId か commentId のどちらかを渡す */
  routeId?: string;
  commentId?: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
  /** 未認証時トーストに出すメッセージ。ページ文脈に応じて切り替えたい場合に使う */
  loginRequiredMessage?: string;
  /** 401 時のログインボタンラベル */
  loginButtonLabel?: string;
  /** 失敗時トーストに出すメッセージ (401 以外の失敗用) */
  failureMessage?: string;
};

export type LikeApiResponse = {
  liked: boolean;
  like_count: number;
};

/**
 * 楽観 UI のための state 計算 pure function。テスト可能に独立。
 * 「押したら反転」「count は +/-1」というシンプルな規則。
 */
export function computeOptimisticLikeState(prev: {
  isLiked: boolean;
  likeCount: number;
}): { isLiked: boolean; likeCount: number } {
  const nextLiked = !prev.isLiked;
  const delta = nextLiked ? 1 : -1;
  return {
    isLiked: nextLiked,
    likeCount: Math.max(0, prev.likeCount + delta),
  };
}

/** API レスポンスをローカル state に反映するための pure function。 */
export function reduceLikeApiResponse(res: LikeApiResponse): {
  isLiked: boolean;
  likeCount: number;
} {
  return {
    isLiked: !!res.liked,
    likeCount: Math.max(0, Number.isFinite(res.like_count) ? res.like_count : 0),
  };
}

/**
 * 対象 (route / comment) の likes 配列から「現在ユーザーが既にいいね済みか」を判定する純関数。
 *
 * 呼び出し元 (routeHeader / detailsViewer / commentItem) で都度書かれていた計算を集約する。
 * likes が undefined / null でも安全に false を返す。 userId が空なら未ログインとみなし false。
 */
export function getIsLikedByMe(
  likes: ReadonlyArray<{ userId: string }> | null | undefined,
  userId: string | null | undefined,
): boolean {
  if (!userId) return false;
  if (!likes || likes.length === 0) return false;
  return likes.some((l) => l.userId === userId);
}

/**
 * エラーが「認証必須 (401/Unauthorized)」を意味するかを判定する pure function。
 *
 * 判定基準 (優先順):
 *  1. status === 401
 *  2. code === "UNAUTHORIZED" (サーバーの handleError.ts が返す正規化コード)
 *  3. message が "unauthorized" (大文字小文字無視) — 旧実装との後方互換用
 *
 * helpers.ts が HTTP エラーを ErrorScheme に正規化する際に status も付与するため、
 * 基本は (1) か (2) で拾える。 (3) は過去データ / 手書き throw への保険。
 */
export function isAuthError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const anyErr = err as { message?: unknown; code?: unknown; status?: unknown };
  if (anyErr.status === 401) return true;
  if (typeof anyErr.code === "string" && anyErr.code.toUpperCase() === "UNAUTHORIZED") {
    return true;
  }
  if (typeof anyErr.message === "string" && anyErr.message.trim().toLowerCase() === "unauthorized") {
    return true;
  }
  return false;
}

export function useLike(opts: UseLikeOptions) {
  const {
    target,
    routeId,
    commentId,
    initialIsLiked,
    initialLikeCount,
    loginRequiredMessage,
    loginButtonLabel,
    failureMessage,
  } = opts;
  const router = useRouter();
  const user = userStore((state) => state.user);
  const appendError = errorStore((state) => state.appendError);

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [pending, setPending] = useState(false);

  const toggle = useCallback(async () => {
    // 多重クリック防止
    if (pending) return;

    // 未認証は最初から止めてログイン誘導。楽観 UI も動かさない。
    if (!user?.id) {
      showWarningToast(loginRequiredMessage ?? "Please sign in to continue", {
        action: {
          label: loginButtonLabel ?? "Sign in",
          onClick: () => router.push("/login"),
        },
        durationMs: 6000,
      });
      return;
    }

    // 楽観 UI 反転
    const before = { isLiked, likeCount };
    const optimistic = computeOptimisticLikeState(before);
    setIsLiked(optimistic.isLiked);
    setLikeCount(optimistic.likeCount);
    setPending(true);

    try {
      const body: Record<string, unknown> = { target };
      if (target === "ROUTE") body.routeId = routeId;
      if (target === "COMMENT") body.commentId = commentId;

      const res = await postDataToServerWithJson<LikeApiResponse>(
        "/api/v1/likes",
        body,
      );

      if (res && typeof res.liked === "boolean" && typeof res.like_count === "number") {
        const confirmed = reduceLikeApiResponse(res);
        setIsLiked(confirmed.isLiked);
        setLikeCount(confirmed.likeCount);
      }
      // レスポンスが想定外形式の場合は楽観 UI のまま放置 (ロールバックしない)
    } catch (err) {
      // 失敗: 楽観 UI をロールバック
      setIsLiked(before.isLiked);
      setLikeCount(before.likeCount);

      if (isAuthError(err)) {
        showWarningToast(loginRequiredMessage ?? "Please sign in to continue", {
          action: {
            label: loginButtonLabel ?? "Sign in",
            onClick: () => router.push("/login"),
          },
          durationMs: 6000,
        });
      } else {
        // 一般的な失敗は errorStore で可視化 (既存のエラー表示レーンに合流させる)
        appendError(toErrorScheme(err));
        if (failureMessage) {
          showWarningToast(failureMessage);
        }
      }
    } finally {
      setPending(false);
    }
  }, [
    pending,
    user?.id,
    isLiked,
    likeCount,
    target,
    routeId,
    commentId,
    router,
    appendError,
    loginRequiredMessage,
    loginButtonLabel,
    failureMessage,
  ]);

  return {
    isLiked,
    likeCount,
    pending,
    toggle,
  };
}
