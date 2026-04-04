import { MdSettings, MdInfoOutline, MdDarkMode, MdLightMode } from 'react-icons/md'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import UserProfileEditModal from '../templates/userProfileEditModal'
import { postDataToServerWithJson } from '@/lib/client/helpers'

export type ProfileMode = 'self' | 'public'

export default function ActionButtons({ mode, followingId }: { mode: ProfileMode, followingId?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isOwnPage = mode === 'self'

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const onToggleFollow = async () => {
    if (!followingId) return
    try {
      const res = await postDataToServerWithJson<{ followed: boolean; follower_count: number }>(
        '/api/v1/follows',
        { followingId }
      )
    } catch (e) {
      console.error('Failed to toggle follow', e)
      alert('Failed to follow. Please try again.')
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
            disabled={!followingId}
            className={`px-8 py-2.5 rounded-xl font-bold transition-opacity cursor-pointer shadow-md shadow-accent-0/20 bg-accent-0 text-background-1 disabled:opacity-50`}
          >
            {'Follow'}
          </button>
        </>
      )}
    </div>
  )
}
