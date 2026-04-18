/**
 * 相対時間表示ユーティリティ。
 *
 * - `Intl.RelativeTimeFormat` をベースに、現在から過去/未来の相対ラベルを生成する
 * - 1 分未満は "just now" 相当のラベルを返す (locale ごと)
 * - 7 日以上前は絶対日付にフォールバック (相対表記が直感的でなくなるため)
 *
 * UI 側 (コメント等) が `new Date().toLocaleDateString(...)` をベタ書きしていたのを
 * ここに集約することで、locale を尊重した見た目と、テスト可能な「now」注入を両立する。
 */

const LOCALE_FALLBACK = "en";

const JUST_NOW_LABELS: Record<string, string> = {
  ja: "たった今",
  en: "just now",
  ko: "방금",
  zh: "刚刚",
};

function pickJustNow(locale: string): string {
  const key = locale.toLowerCase().split("-")[0];
  return JUST_NOW_LABELS[key] ?? JUST_NOW_LABELS[LOCALE_FALLBACK];
}

type Unit = "second" | "minute" | "hour" | "day";

const UNIT_STEPS: Array<{ unit: Unit; ms: number }> = [
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
  { unit: "second", ms: 1000 },
];

/**
 * 引数 `target` と `now` の差分を人間が読みやすい相対文字列に変換する。
 * 入力が不正な場合は空文字を返す (UI 側で壊れないよう保険)。
 */
export function formatRelativeTime(
  target: Date | string | number,
  opts: { locale?: string; now?: Date } = {},
): string {
  const locale = opts.locale ?? LOCALE_FALLBACK;
  const now = opts.now ?? new Date();
  const d = target instanceof Date ? target : new Date(target);
  if (Number.isNaN(d.getTime())) return "";

  const diffMs = d.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);

  // 1 分未満は "just now"
  if (absMs < 60_000) {
    return pickJustNow(locale);
  }

  // 7 日以上離れていれば絶対日付にフォールバック (短く)
  if (absMs >= 7 * UNIT_STEPS[0].ms) {
    try {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(d);
    } catch {
      return d.toISOString().slice(0, 10);
    }
  }

  // 適切な単位を選ぶ
  for (const step of UNIT_STEPS) {
    if (absMs >= step.ms) {
      const value = Math.round(diffMs / step.ms);
      try {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
        return rtf.format(value, step.unit);
      } catch {
        // Intl が使えない環境の保険 (古いブラウザ等)
        const absValue = Math.abs(value);
        return value < 0 ? `${absValue} ${step.unit}s ago` : `in ${absValue} ${step.unit}s`;
      }
    }
  }

  return pickJustNow(locale);
}
