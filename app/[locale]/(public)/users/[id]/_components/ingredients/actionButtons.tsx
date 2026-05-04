'use client'

import { MdSettings, MdInfoOutline, MdDarkMode, MdLightMode } from 'react-icons/md'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import UserProfileEditModal from '../templates/userProfileEditModal'
import { postDataToServerWithJson, toErrorScheme } from '@/lib/api/client'
import { useTranslations } from 'next-intl'
import { errorStore } from '@/lib/stores/errorStore'

export type ProfileMode = 'self' | 'public'

export default function ActionButtons({ mode, followingId }: { mode: ProfileMode, followingId?: string }) {
  const t = useTranslations('profile')
  const tErrors = useTranslations('errors')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const appendError = errorStore(state => state.appendError)
  const isOwnPage = mode === 'self'

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const onToggleFollow = async () => {
    if (!followingId) return
    setIsLoading(true)
    try {
      const res = await postDataToServerWithJson<{ followed: boolean; follower_count: number }>(
        '/api/v1/follows',
        { followingId }
      )
      // Note: isFollowed is not managed here, but this component is replaced by parent anyway?
      // Actually, ActionButtons seems to be used in UserProfileHeader which is used in RootClient.
      // But RootClient in public/users/[id] passes onFollowToggle to UserProfileHeader.
      // Wait, let's check where ActionButtons is used.
    } catch (e: unknown) {
      console.error('Failed to toggle follow', e)
      appendError(toErrorScheme(e))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 pb-2">
      {isOwnPage ? (
        <></>
      ) : (
        <>
          <button
            onClick={onToggleFollow}
            disabled={!followingId || isLoading}
            className={`px-8 py-2.5 rounded-xl font-bold transition-opacity cursor-pointer shadow-md shadow-accent-0/20 bg-accent-0 text-background-1 disabled:opacity-50`}
          >
            {t('follow')}
          </button>
        </>
      )}
    </div>
  )
}
