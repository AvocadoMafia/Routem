import { MdSettings, MdInfoOutline, MdDarkMode, MdLightMode } from 'react-icons/md'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import UserProfileEditModal from '../templates/userProfileEditModal'
import { postDataToServerWithJson } from '@/lib/client/helpers'

export type ProfileMode = 'self' | 'public'

export default function ActionButtons({ mode, followingId }: { mode: ProfileMode, followingId?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
  const [isLoadingFollow, setIsLoadingFollow] = useState(false)
  const isOwnPage = mode === 'self'

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const onToggleFollow = async () => {
    if (!followingId) return
    try {
      setIsLoadingFollow(true)
      // optimistic toggle
      setIsFollowing(prev => (prev === null ? true : !prev))
      const res = await postDataToServerWithJson<{ followed: boolean; follower_count: number }>(
        '/api/v1/follows',
        { followingId }
      )
      if (res) {
        setIsFollowing(res.followed)
      }
    } catch (e) {
      // rollback optimistic change
      setIsFollowing(prev => (prev === null ? null : !prev))
      console.error('Failed to toggle follow', e)
      alert('Failed to follow. Please try again.')
    } finally {
      setIsLoadingFollow(false)
    }
  }

  return (
    <div className="flex items-center gap-3 pb-2">
      {mounted && isOwnPage && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 bg-background-1 border border-grass rounded-xl hover:bg-grass transition-colors cursor-pointer shadow-sm flex items-center justify-center"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <MdLightMode size={22} className="text-foreground-0" />
          ) : (
            <MdDarkMode size={22} className="text-foreground-0" />
          )}
        </button>
      )}
      {isOwnPage ? (
        <>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 bg-background-1 border border-grass px-4 py-2 rounded-xl font-bold hover:bg-grass transition-colors cursor-pointer shadow-sm"
          >
            <MdSettings size={20} />
            <span>Edit Profile</span>
          </button>
          <UserProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
        </>
      ) : (
        <>
          <button
            onClick={onToggleFollow}
            disabled={!followingId || isLoadingFollow}
            className={`px-8 py-2.5 rounded-xl font-bold transition-opacity cursor-pointer shadow-md shadow-accent-0/20 ${
              isFollowing ? 'bg-background-1 text-foreground-0 border border-grass' : 'bg-accent-0 text-background-1'
            } disabled:opacity-50`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </>
      )}
    </div>
  )
}
