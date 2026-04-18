"use client";

import { AnimatePresence } from "framer-motion";
import { toastStore } from "@/lib/client/stores/toastStore";
import ToastCard from "@/app/[locale]/_components/layout/ingredients/toastCard";

/**
 * ToastViewer は成功/情報/警告トーストを画面右下に積み上げる軽量ビューア。
 * エラー専用の ErrorViewer とは独立しており、それよりも少し上に並ぶ。
 */
export default function ToastViewer() {
  // ToastCard 側で toastStore から直接 dismiss を呼ぶため、ここでは購読のみで十分。
  // (onDismiss を props で渡すとインライン関数の ref が毎回変わり、 setTimeout が張り直されて
  //  自動消去が働かないバグがあった。W1 修正)
  const toasts = toastStore((state) => state.toasts);

  return (
    <div
      // bottom-20 で ErrorViewer (bottom-4) の上に重ならないよう確保
      className="fixed bottom-20 right-4 z-[999] flex flex-col gap-3 items-end pointer-events-none w-fit max-w-[calc(100vw-2rem)]"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
