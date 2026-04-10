'use client'

import { useTranslations } from 'next-intl'

export default function ProfileStats({ routes, followers, following }: { routes: number; followers: number | string; following: number | string }) {
  const t = useTranslations('profile')

  return (
    <div className="flex items-center gap-8 mb-10 py-4">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-foreground-0">{routes}</span>
        <span className="text-foreground-1">{t('routes')}</span>
      </div>
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
        <span className="text-xl font-bold text-foreground-0">{followers}</span>
        <span className="text-foreground-1">{t('followers')}</span>
      </div>
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
        <span className="text-xl font-bold text-foreground-0">{following}</span>
        <span className="text-foreground-1">{t('following')}</span>
      </div>
    </div>
  )
}
