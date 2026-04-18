'use client'

import { HiExclamationTriangle, HiArrowPath } from "react-icons/hi2"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { ErrorScheme } from "@/lib/client/types"

type Variant = 'inline' | 'block'

type Props = {
    /**
     * 直近の ErrorScheme。code="RATE_LIMITED" の場合はメッセージを
     * errors.rateLimited に自動で切り替える。明示 message が優先される。
     */
    error?: ErrorScheme | null
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
 * a11y:
 *  - container: role="alert" でスクリーンリーダーに即通知
 *  - button: aria-busy で retry 進行中を読み上げ、disabled とセット
 *  - spinner アイコン / icon 装飾は aria-hidden
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

    const handleRetry = async () => {
        if (!onRetry || retrying) return
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
        ?? (error?.code === 'RATE_LIMITED' ? tErrors('rateLimited') : tErrors('loadFailed'))
    const retryLabel = tCommon('retry')

    if (variant === 'inline') {
        return (
            <div
                role="alert"
                aria-live="polite"
                className="w-full flex items-center justify-center gap-3 py-6 text-foreground-1"
            >
                <HiExclamationTriangle className="w-4 h-4 text-accent-0 shrink-0" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    {resolvedMessage}
                </span>
                {onRetry && (
                    <button
                        type="button"
                        onClick={handleRetry}
                        disabled={retrying}
                        aria-busy={retrying}
                        aria-label={retryLabel}
                        className={[
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                            'text-[10px] font-bold uppercase tracking-[0.2em]',
                            'border border-accent-0 text-foreground-0 bg-background-1',
                            'transition-all duration-200',
                            'hover:bg-accent-0/10 active:scale-95',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background-0',
                            'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
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
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-foreground-0 text-center">
                {resolvedMessage}
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={handleRetry}
                    disabled={retrying}
                    aria-busy={retrying}
                    aria-label={retryLabel}
                    className={[
                        'mt-1 flex items-center gap-2 px-5 h-10 rounded-full',
                        'text-xs font-bold uppercase tracking-[0.2em]',
                        'border border-accent-0 text-foreground-0 bg-background-1',
                        'transition-all duration-200',
                        'hover:bg-accent-0/10 active:scale-95',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background-0',
                        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
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
