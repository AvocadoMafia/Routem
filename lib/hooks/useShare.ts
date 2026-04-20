"use client";

import { useCallback, useState } from "react";

/**
 * useShare: ルート記事ページなどから URL / タイトルを共有するための hook。
 *
 * 本番が HTTPS に上がるまで (= Secure Context になるまで) 以下のいずれも確実には使えない:
 *   - navigator.share
 *   - navigator.clipboard.writeText
 * そのため「段階的に落とす」戦略を取り、最終的には prompt() での手動コピーまで確保する。
 *
 * 戦略優先度:
 *   1. `navigator.share`  (ネイティブシェア、Web Share API)
 *   2. `navigator.clipboard.writeText`  (モダンな Clipboard API, Secure Context 必須)
 *   3. `document.execCommand("copy")` + 隠し textarea  (legacy フォールバック、HTTP でも動く)
 *   4. `prompt()` で URL を表示してユーザーに手動選択コピーしてもらう
 *
 * 呼び出し側は onSuccess/onFallbackCopy/onFailure を指定でき、UI 側でトーストを出すなどの
 * フィードバックを必ず実行する想定。無言 console.error で握りつぶさない。
 */

export type ShareStrategy =
  | "webShare"
  | "clipboard"
  | "execCommand"
  | "prompt"
  | "unavailable";

export type ShareOutcome =
  | { kind: "shared"; strategy: "webShare" }
  | { kind: "copied"; strategy: "clipboard" | "execCommand" }
  | { kind: "manual"; strategy: "prompt" }
  | { kind: "cancelled"; strategy: ShareStrategy }
  | { kind: "failed"; strategy: ShareStrategy; error: unknown };

export type ShareInput = {
  url: string;
  title?: string;
  text?: string;
};

export type UseShareOptions = {
  onShared?: () => void;
  onCopied?: () => void;
  /** prompt() フォールバック時、自動コピーは発生しないので明示的に通知する */
  onManualCopyRequested?: (url: string) => void;
  onFailed?: (error: unknown) => void;
};

/**
 * 共有戦略を選ぶ pure function。 hook/テストから参照できるよう export。
 *
 * ポイント:
 *  - window.isSecureContext が false / 不明なら clipboard API は信用しない
 *  - navigator.share でも同様に isSecureContext を要求する
 *  - execCommand は document に生える DOM API なので window===undefined (SSR) の場合は unavailable
 */
export function pickShareStrategy(env: {
  hasWindow: boolean;
  isSecureContext: boolean;
  hasNavigatorShare: boolean;
  hasClipboard: boolean;
  hasExecCommand: boolean;
}): ShareStrategy {
  if (!env.hasWindow) return "unavailable";
  if (env.isSecureContext && env.hasNavigatorShare) return "webShare";
  if (env.isSecureContext && env.hasClipboard) return "clipboard";
  if (env.hasExecCommand) return "execCommand";
  return "prompt";
}

/** 現在のブラウザ環境から ShareStrategy を決定する */
export function detectShareStrategy(): ShareStrategy {
  if (typeof window === "undefined") {
    return "unavailable";
  }
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  return pickShareStrategy({
    hasWindow: true,
    // isSecureContext は古い環境で undefined 返すことがあるので falsy として扱う
    isSecureContext: Boolean(window.isSecureContext),
    hasNavigatorShare: !!(nav && typeof nav.share === "function"),
    hasClipboard: !!(nav && nav.clipboard && typeof nav.clipboard.writeText === "function"),
    hasExecCommand:
      typeof document !== "undefined" && typeof document.execCommand === "function",
  });
}

/**
 * 隠し textarea + execCommand("copy") によるクリップボードコピー。
 * HTTP 配信などの非 Secure Context でも動くラストリゾート。
 */
function legacyCopyToClipboard(text: string): boolean {
  if (typeof document === "undefined") return false;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  // 画面外に飛ばして視覚的に無害化
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);

  // iOS Safari 対策: 選択範囲を明示的に指定
  const previouslyFocused = document.activeElement as HTMLElement | null;
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  // フォーカスを戻す (タブ順序等への副作用を避ける)
  previouslyFocused?.focus?.();
  return ok;
}

export function useShare(options: UseShareOptions = {}) {
  const [lastOutcome, setLastOutcome] = useState<ShareOutcome | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const share = useCallback(
    async (input: ShareInput): Promise<ShareOutcome> => {
      const finish = (outcome: ShareOutcome): ShareOutcome => {
        setLastOutcome(outcome);
        setIsSharing(false);
        return outcome;
      };

      setIsSharing(true);
      const strategy = detectShareStrategy();

      // 1) Web Share API
      if (strategy === "webShare") {
        try {
          await navigator.share({
            title: input.title,
            text: input.text,
            url: input.url,
          });
          options.onShared?.();
          return finish({ kind: "shared", strategy: "webShare" });
        } catch (err) {
          // AbortError = ユーザーキャンセル。これは失敗として扱わず、他のフォールバックも走らせない。
          const isAbort =
            err instanceof DOMException
              ? err.name === "AbortError"
              : (err as any)?.name === "AbortError";
          if (isAbort) {
            return finish({ kind: "cancelled", strategy: "webShare" });
          }
          // それ以外のエラー (NotAllowedError 等) はフォールバックへ
        }
      }

      // 2) Clipboard API
      if (strategy === "webShare" || strategy === "clipboard") {
        if (
          typeof navigator !== "undefined" &&
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === "function"
        ) {
          try {
            await navigator.clipboard.writeText(input.url);
            options.onCopied?.();
            return finish({ kind: "copied", strategy: "clipboard" });
          } catch (err) {
            // フォールバックへ
            // NOTE: ここで return せず execCommand を試す
            void err;
          }
        }
      }

      // 3) execCommand("copy") の legacy フォールバック
      if (
        typeof document !== "undefined" &&
        typeof document.execCommand === "function"
      ) {
        const ok = legacyCopyToClipboard(input.url);
        if (ok) {
          options.onCopied?.();
          return finish({ kind: "copied", strategy: "execCommand" });
        }
      }

      // 4) prompt() で URL を見せて手動コピーさせる
      if (typeof window !== "undefined" && typeof window.prompt === "function") {
        try {
          window.prompt(input.title ?? "", input.url);
          options.onManualCopyRequested?.(input.url);
          return finish({ kind: "manual", strategy: "prompt" });
        } catch (err) {
          options.onFailed?.(err);
          return finish({ kind: "failed", strategy: "prompt", error: err });
        }
      }

      const unavailableErr = new Error("No sharing mechanism available");
      options.onFailed?.(unavailableErr);
      return finish({ kind: "failed", strategy: "unavailable", error: unavailableErr });
    },
    [options],
  );

  return {
    share,
    isSharing,
    lastOutcome,
  };
}
