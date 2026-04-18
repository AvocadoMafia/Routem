'use client'

import { HiExclamationTriangle, HiArrowPath } from "react-icons/hi2"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { ErrorScheme } from "@/lib/client/types"

type Variant = 'inline' | 'block'

// helpers.ts 側で RATE_LIMITED 時に付与される追加フィールド。
// ErrorScheme 本体の型を汚さないよう、ここでローカルに declaration merging 的に扱う。
type ErrorWithRetryAfter = ErrorScheme & { retryAfterMs?: number }

// RATE_LIMITED 時に retry ボタンを一時的に disable するクールダウン秒数。
// error.retryAfterMs があればそれを優先。無ければこの既定値を使う。
const DEFAULT_RATE_LIMIT_COOLDOWN_SEC = 30

type Props = {
    /**
     * 直近の ErrorScheme。code="RATE_LIMITED" の場合:
     *   - メッセージを errors.rateLimited に自動で切り替える
     *   - retry ボタンを error.retryAfterMs 秒 (無ければ 30 秒) disable し、
     *     カウントダウンを表示する (「N秒後に再試行」)
     * 明示 message が優先される。
     */
    error?: ErrorWithRetryAfter | null
    /**
     * 単一行の簡潔な説明文。未指定なら errors.loadFailed を使う (error.code が
     * RATE_LIMITED の場合は errors.rateLimited に自動切替)。
     */
    message?: string
    /**
     * retry ボタンのクリックハンドラ。await 可能な promise を返すと
     * 再試行中に自動で disable / spinner 表示する。
     */
    onRetry?: () => Promise<void> | void
    /**
     * inline: セクション内の1行表示 (リスト末尾などに埋め込む用)
     * block : 縦長のカード風プレースホルダ (セクション本体に差し込む用)
     */
    variant?: Variant
    /**
     * block variant のときのコンテナクラス上書き。高さ調整等に。
     */
    className?: string
}

/**
 * フェッチ失敗時にセクション内で表示する共通 UI。
 *
 * useInfiniteScroll の `error` と `retry` を受けて「無言の空セクション」を廃止し、
 * ユーザーに状況と再試行手段を明示する。プロダクトの既存 Card スタイル
 * (rounded-2xl + 1.5px border + bg-background-1) に合わせてある。
 *
 * RATE_LIMITED の扱い (Tester_1 発見の UX regression 対策):
 *   - 429 の直後に retry を連打すると再び 429 が返り悪循環になる
 *   - 本実装では error.retryAfterMs (fetch 層が Retry-After ヘッダから伝達)
 *     または既定 30 秒のクールダウンで retry を disable
 *   - ボタン表記を「N秒後に再試行」カウントダウンに切り替え、残秒が 0 で
 *     通常の「再試行」に復帰
 *
 * a11y:
 *  - container: role="alert" + aria-live="polite" でスクリーンリーダーに通知
 *  - button: aria-busy で retry 進行中、disabled でクールダウン中、
 *    aria-label でボタン意図を確実に伝える
 *  - spinner アイコン / icon 装飾は aria-hidden
 *
 * 多言語対応:
 *  - 翻訳テキスト (CJK を含む) には極端な letter-spacing / uppercase を使わない。
 *    日本語・韓国語・中国語で tracking-[0.2em] は非常に見苦しいため、
 *    本コンポーネント内ではメッセージ本文は tracking を normal 寄りに抑える。
 */
export default function SectionErrorState({
    error,
    message,
    onRetry,
    variant = 'block',
    className,
}: Props) {
    const tCommon = useTranslations('common')
    const tErrors = useTranslations('errors')
    const [retrying, setRetrying] = useState(false)
    const [cooldownSec, setCooldownSec] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const isRateLimited = error?.code === 'RATE_LIMITED'

    // RATE_LIMITED になった瞬間にクールダウンを開始し、毎秒減算する。
    // error オブジェクトが差し替わる (再試行して別エラーになった等) まで維持。
    useEffect(() => {
        if (!isRateLimited) {
            // RATE_LIMITED を抜けたら即時 0 に戻してボタンを復活
            setCooldownSec(0)
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            return
        }

        const retryAfterMs = error?.retryAfterMs
        const initialSec = retryAfterMs && retryAfterMs > 0
            ? Math.ceil(retryAfterMs / 1000)
            : DEFAULT_RATE_LIMIT_COOLDOWN_SEC

        setCooldownSec(initialSec)

        // 既存 interval をクリアしてから張り直し (error が複数回更新された場合の保険)
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            setCooldownSec((prev) => {
                if (prev <= 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current)
                        intervalRef.current = null
                    }
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isRateLimited, error?.retryAfterMs])

    const isCoolingDown = cooldownSec > 0
    const buttonDisabled = retrying || isCoolingDown

    const handleRetry = async () => {
        if (!onRetry || buttonDisabled) return
        setRetrying(true)
        try {
            await onRetry()
        } finally {
            // onRetry 側で成功すれば親が再描画されアンマウントされる前提だが、
            // 残ったケースに備えて必ず false に戻す。
            setRetrying(false)
        }
    }

    // error.code に応じて最適なメッセージを選択。
    // 明示された message prop が最優先、次に RATE_LIMITED の場合は
    // errors.rateLimited、それ以外は errors.loadFailed。
    const resolvedMessage = message
        ?? (isRateLimited ? tErrors('rateLimited') : tErrors('loadFailed'))

    // ボタンラベルもクールダウン中は「N秒後に再試行」に切り替え。
    const retryLabel = isCoolingDown
        ? tErrors('retryInSeconds', { seconds: cooldownSec })
        : tCommon('retry')

    if (variant === 'inline') {
        return (
            <div
                role="alert"
                aria-live="polite"
                className="w-full flex items-center justify-center gap-3 py-6 text-foreground-1"
            >
                <HiExclamationTriangle className="w-4 h-4 text-accent-0 shrink-0" aria-hidden />
                <span className="text-xs font-semibold text-center">
                    {resolvedMessage}
                </span>
                {onRetry && (
                    <button
                        type="button"
                        onClick={handleRetry}
                        disabled={buttonDisabled}
                        aria-busy={retrying}
                        aria-label={retryLabel}
                        className={[
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                            'text-[10px] font-bold',
                            'border border-accent-0 text-foreground-0 bg-background-1',
                            'transition-all duration-200',
                            'hover:bg-accent-0/10 active:scale-95',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background-0',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
                            // tabular-nums でカウントダウン値のガタつきを抑える
                            'tabular-nums',
                        ].join(' ')}
                    >
                        <HiArrowPath
                            className={`w-3.5 h-3.5 text-accent-0 ${retrying ? 'animate-spin' : ''}`}
                            aria-hidden
                        />
                        {retryLabel}
                    </button>
                )}
            </div>
        )
    }

    // block variant
    return (
        <div
            role="alert"
            aria-live="polite"
            className={[
                'w-full flex flex-col items-center justify-center gap-4',
                'px-6 py-12 sm:py-16',
                'rounded-2xl border border-dashed border-grass/20 bg-background-1/40',
                className ?? '',
            ].join(' ')}
        >
            <div className="w-12 h-12 rounded-full bg-accent-0/10 flex items-center justify-center">
                <HiExclamationTriangle className="w-6 h-6 text-accent-0" aria-hidden />
            </div>
            <p className="text-sm font-semibold text-foreground-0 text-center leading-relaxed max-w-md">
                {resolvedMessage}
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={handleRetry}
                    disabled={buttonDisabled}
                    aria-busy={retrying}
                    aria-label={retryLabel}
                    className={[
                        'mt-1 flex items-center gap-2 px-5 h-10 rounded-full',
                        'text-xs font-bold',
                        'border border-accent-0 text-foreground-0 bg-background-1',
                        'transition-all duration-200',
                        'hover:bg-accent-0/10 active:scale-95',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background-0',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
                        'tabular-nums',
                    ].join(' ')}
                >
                    <HiArrowPath
                        className={`w-4 h-4 text-accent-0 ${retrying ? 'animate-spin' : ''}`}
                        aria-hidden
                    />
                    {retryLabel}
                </button>
            )}
        </div>
    )
}
