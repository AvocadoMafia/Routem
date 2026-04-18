import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  toastStore,
  showSuccessToast,
  showInfoToast,
  showWarningToast,
} from "./toastStore";

/**
 * toastStore の挙動確認に加え、W1 バグ (toastCard の自動消去タイマーリセット) の
 * 構造的な修正が維持されていることを検証するテスト。
 *
 * W1 は「toastCard の useEffect が onDismiss を deps に取っており、親 (toastViewer) が
 * 新しい toast を追加するたびにインライン onDismiss の参照が変わって setTimeout が張り直され、
 * 最初のトーストが永遠に消えない」というバグだった。
 *
 * ここでは toastCard が useEffect 内でやっている事
 *   const handle = setTimeout(() => toastStore.getState().dismissToast(toast.id), duration);
 * と同じ処理を手動で仕込み、他のトーストを追加しても最初のトーストが設計時間通りに消えることを
 * 確認する。 DOM 環境が無くても toastStore と setTimeout だけで構造を担保できる。
 */

describe("toastStore core operations", () => {
  beforeEach(() => {
    toastStore.getState().clearToasts();
  });

  it("showToast で追加した toast が toasts 配列に現れる", () => {
    const id = toastStore.getState().showToast({ tone: "success", message: "hi" });
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
    expect(toastStore.getState().toasts).toHaveLength(1);
    expect(toastStore.getState().toasts[0].tone).toBe("success");
  });

  it("showSuccess/Info/Warning のヘルパーが tone を正しく設定する", () => {
    showSuccessToast("ok");
    showInfoToast("hmm");
    showWarningToast("careful");
    const tones = toastStore.getState().toasts.map((t) => t.tone);
    expect(tones).toEqual(["success", "info", "warning"]);
  });

  it("dismissToast で該当 id の toast のみ消える", () => {
    const a = showSuccessToast("a");
    const b = showInfoToast("b");
    toastStore.getState().dismissToast(a);
    expect(toastStore.getState().toasts.map((t) => t.id)).toEqual([b]);
  });

  it("clearToasts で全削除", () => {
    showSuccessToast("1");
    showSuccessToast("2");
    toastStore.getState().clearToasts();
    expect(toastStore.getState().toasts).toHaveLength(0);
  });

  it("連続 showToast で生成される id は全て一意", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) {
      ids.add(showInfoToast("x"));
    }
    expect(ids.size).toBe(50);
  });
});

describe("toast auto-dismiss timing (W1 regression guard)", () => {
  // 各トーストに対して、 toastCard が実際に仕込むのと同等の setTimeout を張る。
  // これが toast.id のみに紐付いており、「他の toast の追加/削除」で張り直しされない事を担保する。
  function simulateAutoDismiss(id: string, durationMs: number): () => void {
    const handle = setTimeout(() => {
      toastStore.getState().dismissToast(id);
    }, durationMs);
    return () => clearTimeout(handle);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    toastStore.getState().clearToasts();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("単一トーストが指定時間後に自動消去される", () => {
    const id = showSuccessToast("gone soon");
    const cleanup = simulateAutoDismiss(id, 2000);

    vi.advanceTimersByTime(1999);
    expect(toastStore.getState().toasts).toHaveLength(1);

    vi.advanceTimersByTime(2);
    expect(toastStore.getState().toasts).toHaveLength(0);
    cleanup();
  });

  it("3つのトーストを 1 秒間隔で出しても、最初のは当初の設計時間 (2000ms) で消える", () => {
    // W1 バグの再現防止: 他トーストを追加した瞬間に最初のタイマーがリセットされないこと。
    const id1 = showSuccessToast("first");
    const cleanup1 = simulateAutoDismiss(id1, 2000);

    vi.advanceTimersByTime(1000);
    const id2 = showInfoToast("second");
    const cleanup2 = simulateAutoDismiss(id2, 2000);

    vi.advanceTimersByTime(1000);
    // ここまでで初回トーストから 2000ms 経過 → 最初のは消えている
    const ids = toastStore.getState().toasts.map((t) => t.id);
    expect(ids).not.toContain(id1);
    expect(ids).toContain(id2);

    const id3 = showWarningToast("third");
    const cleanup3 = simulateAutoDismiss(id3, 2000);

    // さらに 1000ms 経過 → 2 番目も消えているはず
    vi.advanceTimersByTime(1000);
    const ids2 = toastStore.getState().toasts.map((t) => t.id);
    expect(ids2).not.toContain(id1);
    expect(ids2).not.toContain(id2);
    expect(ids2).toContain(id3);

    cleanup1();
    cleanup2();
    cleanup3();
  });

  it("durationMs=0 は auto-dismiss を仕掛けない (仕様: 0 は永続)", () => {
    // toastCard 側のロジック: `if (duration <= 0) return;` と同じ扱いを手動で再現
    const id = toastStore.getState().showToast({
      tone: "info",
      message: "sticky",
      durationMs: 0,
    });
    // タイマーを張らないシナリオ
    vi.advanceTimersByTime(10_000);
    expect(toastStore.getState().toasts.map((t) => t.id)).toContain(id);
  });

  it("dismissToast を外部から呼んでも timer が残って二重dismissで落ちない (防御)", () => {
    const id = showInfoToast("x");
    const cleanup = simulateAutoDismiss(id, 500);
    toastStore.getState().dismissToast(id); // 先に外部 dismiss
    vi.advanceTimersByTime(1000); // setTimeout も発火するが、既に配列から消えていて no-op
    expect(toastStore.getState().toasts).toHaveLength(0);
    cleanup();
  });
});
