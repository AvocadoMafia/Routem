"use client"

import { useEffect } from "react"
import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { userStore } from "@/lib/stores/userStore"
import { dbLocaleToAppLocale } from "@/lib/client/helpers"
import Cookies from "js-cookie"

export default function LocaleSync() {
  const user = userStore((state) => state.user)
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user.id) return

    const preferredLocale = dbLocaleToAppLocale(user.language)

    if (currentLocale !== preferredLocale) {
      Cookies.set("NEXT_LOCALE", preferredLocale, {
        expires: 365,
        path: "/",
        sameSite: "lax",
      })

      router.replace(pathname, { locale: preferredLocale })
    }
  }, [user.id, user.language, currentLocale, router, pathname])

  return null
}
