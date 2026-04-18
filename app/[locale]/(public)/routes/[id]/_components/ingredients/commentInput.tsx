"use client";

import { useState, type KeyboardEvent } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CommentInputProps {
  /** 送信成功で true、失敗/空送信で false を返す。親の hook (useComments.postComment) を渡す想定。 */
  onPost: (text: string) => Promise<boolean>;
}

const MAX_LENGTH = 1000;

/**
 * コメント入力フィールド。責務は「テキスト保持」「Enter送信」「二重送信ガード」の3つに限定し、
 * エラー表示や楽観 UI は親 hook (useComments) に任せる。
 *
 * UX 方針:
 *  - Enter で送信、Shift+Enter で改行 (誤送信を避けるため Shift を要求)
 *  - 空白のみは送信しない (クライアント側バリデーション)
 *  - 送信中はテキストエリア/ボタンを disabled にして多重送信を防ぐ
 *  - 送信成功時のみ入力をクリア (失敗時はユーザーの入力を保持)
 */
export default function CommentInput({ onPost }: CommentInputProps) {
  const t = useTranslations("comments");
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = text.trim().length > 0 && !submitting;

  const handlePost = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const ok = await onPost(text);
      if (ok) {
        setText("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 単独 → 送信。Shift+Enter → 改行 (デフォルトのまま)。
    // IME 変換中 (isComposing) は確定 Enter なので送信しない。
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div
      className={`p-[1px] rounded-3xl transition-all duration-300 ${
        isFocused ? "bg-linear-to-r from-accent-0 to-accent-0 shadow-sm" : "bg-foreground-0/10"
      }`}
    >
      <div className="flex flex-col gap-4 p-6 rounded-[23px] w-full bg-background-1">
        <textarea
          placeholder={t("commentPlaceholder")}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none text-foreground-0 placeholder:text-foreground-1/40 resize-none min-h-[120px] text-lg leading-relaxed"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={submitting}
          maxLength={MAX_LENGTH}
          aria-label={t("addComment")}
        />
        <div className="flex items-center justify-between gap-4">
          {/* 文字数カウンタ: 上限接近時だけ表示 */}
          <span
            className={`text-[10px] font-medium tabular-nums ${
              text.length > MAX_LENGTH * 0.85 ? "text-accent-warning" : "text-foreground-1/40"
            }`}
            aria-live="polite"
          >
            {text.length > MAX_LENGTH * 0.5 ? `${text.length}/${MAX_LENGTH}` : ""}
          </span>
          <button
            type="button"
            onClick={handlePost}
            disabled={!canSubmit}
            className="px-6 py-2 bg-accent-0 text-white text-[10px] font-bold uppercase rounded-full hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent-0/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent-0 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {submitting && <Loader2 className="w-3 h-3 animate-spin" />}
            {submitting ? t("posting") : t("postComment")}
          </button>
        </div>
      </div>
    </div>
  );
}
