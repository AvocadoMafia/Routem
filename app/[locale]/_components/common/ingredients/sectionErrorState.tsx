'use client'

import { HiExclamationTriangle, HiArrowPath } from "react-icons/hi2"
import { useTranslations } from "next-intl"
import { useState } from "react"

type Variant = 'inline' | 'block'

type Props = {
    /**
     * 単一行の簡潔な説明文。未指定なら common.errors.loadFailed を使う。
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
 */
export default function SectionErrorState({
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

    const fallbackMessage = tErrors('loadFailed')
    const retryLabel = tCommon('retry')

    if (variant === 'inline') {
        return (
            <div
                role="alert"
                className="w-full flex items-center justify-center gap-3 py-6 text-foreground-1"
            >
                <HiExclamationTriangle className="w-4 h-4 text-accent-0 shrink-0" aria-hidden />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                    {message ?? fallbackMessage}
                </span>
                {onRetry && (
                    <button
                        type="button"
                        onClick={handleRetry}
                        disabled={retrying}
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
                {message ?? fallbackMessage}
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={handleRetry}
                    disabled={retrying}
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
