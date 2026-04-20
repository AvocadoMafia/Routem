'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

export default function CoverImage({ url }: { url?: string }) {
  const tCommon = useTranslations('common')
  return (
    <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden">
      <img
        src={url || 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1600'}
        alt={tCommon('coverAlt')}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
    </div>
  )
}
