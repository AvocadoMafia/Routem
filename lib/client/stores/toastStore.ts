import { create } from "zustand";

/**
 * Toast は「エラーではない」軽い通知 (コピー成功、ログイン誘導など) を出すための store。
 * 既存の errorStore は Error にしか使わず、ここでは success/info/warning を明確に分ける。
 */
export type ToastTone = "success" | "info" | "warning";

export type Toast = {
  id: string;
  tone: ToastTone;
  /** 見出しとして強調したい短い文字列 (例: "Copied", "Login required") */
  title?: string;
  /** 本文 */
  message: string;
  /** action ボタン (ログイン誘導などに使う)。click で onClick → dismiss する */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** ms 単位の自動消去時間 ( undefined なら既定値、 0 なら自動消去しない) */
  durationMs?: number;
  /** 作成時刻 (ソートや debug 用) */
  createdAt: number;
};

export type ToastInput = Omit<Toast, "id" | "createdAt">;

type ToastStore = {
  toasts: Toast[];
  /** Toast を追加し、生成された id を返す (手動で dismiss したいとき用) */
  showToast: (input: ToastInput) => string;
  /** 指定 id の Toast を消去する */
  dismissToast: (id: string) => void;
  /** 全て消す (ページ遷移時など) */
  clearToasts: () => void;
};

/**
 * crypto.randomUUID が使えない環境向けのフォールバック付き ID 生成。
 * テスト環境 (Node) や非 Secure Context で crypto が無くても落ちない。
 */
function generateId(): string {
  if (typeof globalThis !== "undefined") {
    const c = (globalThis as any).crypto;
    if (c && typeof c.randomUUID === "function") {
      try {
        return c.randomUUID();
      } catch {
        // fallthrough
      }
    }
  }
  return `toast_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export const toastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  showToast: (input) => {
    const id = generateId();
    const toast: Toast = {
      id,
      createdAt: Date.now(),
      ...input,
    };
    set({ toasts: [...get().toasts, toast] });
    return id;
  },
  dismissToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
  clearToasts: () => set({ toasts: [] }),
}));

// --- convenience helpers ---
// コンポーネントから直接呼び出せるトップレベル関数。hook を使いたくない場面で便利。

export function showSuccessToast(message: string, opts?: Partial<Omit<ToastInput, "message" | "tone">>) {
  return toastStore.getState().showToast({ tone: "success", message, ...opts });
}

export function showInfoToast(message: string, opts?: Partial<Omit<ToastInput, "message" | "tone">>) {
  return toastStore.getState().showToast({ tone: "info", message, ...opts });
}

export function showWarningToast(message: string, opts?: Partial<Omit<ToastInput, "message" | "tone">>) {
  return toastStore.getState().showToast({ tone: "warning", message, ...opts });
}
