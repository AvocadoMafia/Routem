"use client"

import { useEffect } from "react"
import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { userStore } from "@/lib/client/stores/userStore"
import { locales, type Locale } from "@/i18n/config"
import Cookies from "js-cookie"

/**
 * LocaleSync - ユーザーの言語設定とURLロケールを同期
 *
 * ログイン後、user.languageとURLロケールが異なる場合:
 * 1. NEXT_LOCALEクッキーを更新
 * 2. 正しいロケールにリダイレクト
 */
export default function LocaleSync() {
  const user = userStore(state => state.user)
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // ユーザーがログインしていない場合はスキップ
    if (!user.id) return

    const userLanguage = user.language as Locale

    // ユーザーの言語がサポートされているか確認
    if (!locales.includes(userLanguage)) return

    // 現在のロケールとユーザーの言語が異なる場合
    if (currentLocale !== userLanguage) {
      // クッキーを更新（1年間有効）
      Cookies.set("NEXT_LOCALE", userLanguage, {
        expires: 365,
        path: "/",
        sameSite: "lax",
      })

      // 正しいロケールにリダイレクト
      router.replace(pathname, { locale: userLanguage })
    }
  }, [user.id, user.language, currentLocale, router, pathname])

  return null
}
