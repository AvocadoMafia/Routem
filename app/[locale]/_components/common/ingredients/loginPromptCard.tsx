"use client";

import { MdLockOutline } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";

type Props = {
  /** カード上部に表示する短いメッセージ (何故ログインが要るかを1行で) */
  title: string;
  /** ボタンラベル (例: "Sign in") */
  ctaLabel: string;
  /**
   * ログインボタンのリンク先。未指定時は現在ページ pathname を `redirectTo` に積んだ
   * `/{locale}/login?redirectTo=...` を自動生成する (ログイン後にユーザーを元ページに戻す)。
   */
  href?: string;
  /** タイトル下の補足文 (任意) */
  description?: string;
};

/**
 * 機能ロック時のログイン誘導カード。コメント欄等、閲覧はできるが書き込みはログイン必須という
 * パターンで使う。見た目は既存 ErrorCard / ToastCard と揃えた control 系カード。
 *
 * デフォルトの href は「現在ページに戻るための `redirectTo` を含んだ /login URL」を自動生成する。
 * これにより commentSection などで呼び出し側が毎回 pathname を気にせず済む。
 */
export default function LoginPromptCard({
  title,
  ctaLabel,
  href,
  description,
}: Props) {
  const pathname = usePathname();
  const locale = useLocale();

  // 自動 redirect URL: Link コンポーネントは locale prefix を足してくれるが、
  // pathname は既に `/{locale}/...` を含んでいるため、 next-intl の Link に渡す時は
  // locale prefix を剥がす必要がある。 usePathname は next/navigation のもので
  // locale prefix が付いた状態で返る。
  const pathWithoutLocale = pathname.startsWith(`/${locale}/`)
    ? pathname.slice(locale.length + 1)
    : pathname === `/${locale}`
      ? "/"
      : pathname;
  const resolvedHref =
    href ?? `/login?redirectTo=${encodeURIComponent(pathWithoutLocale)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-4 px-6 py-5 rounded-3xl bg-background-1 border border-foreground-0/10 shadow-sm"
    >
      <div className="bg-accent-0/10 p-3 rounded-full flex-shrink-0">
        <MdLockOutline size={22} className="text-accent-0" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground-0 leading-relaxed break-words">
          {title}
        </div>
        {description && (
          <div className="mt-1 text-xs text-foreground-1/70 leading-relaxed">
            {description}
          </div>
        )}
      </div>
      <Link
        href={resolvedHref}
        className="shrink-0 px-5 py-2 rounded-full bg-accent-0 text-white text-[10px] font-bold uppercase hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent-0/20 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-accent-0 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {ctaLabel}
      </Link>
    </motion.div>
  );
}
