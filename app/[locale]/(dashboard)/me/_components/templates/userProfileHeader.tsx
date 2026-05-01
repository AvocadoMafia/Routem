'use client'

import { useState } from 'react'
import { MdEdit, MdSettings } from 'react-icons/md'
import UserProfileEditModal from './userProfileEditModal'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function UserProfileHeader({
  name,
  bio,
  iconUrl,
  bgUrl,
  mode = 'public',
  routesCount = 0,
  followersCount = 0,
  followingCount = 0,
  isFollowing = false,
  onFollowToggle,
}: {
  name?: string
  bio?: string
  iconUrl?: string
  bgUrl?: string
  mode?: 'self' | 'public'
  routesCount?: number
  followersCount?: number | string
  followingCount?: number | string
  isFollowing?: boolean
  onFollowToggle?: () => void
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const t = useTranslations('profile')

  return (
    <div className="w-full h-fit relative bg-background-1">
      {/* Background Image Area */}
      <div className="sticky w-full h-52 md:h-64 lg:h-80 z-0 top-0 overflow-hidden">
        <img
          className="w-full h-full object-cover opacity-90"
          src={bgUrl || 'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-thumbnail.webp'}
          alt="Background"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background-1/20" />
      </div>

      {/* Profile Header Content */}
      <div className="relative w-full h-fit z-20 flex flex-col bg-background-1 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 w-full relative">
          {/* Icon - Overlapping Twitter Style */}
          <div className="absolute -top-12 md:-top-16 lg:-top-24 left-2 md:left-4 lg:left-6 shrink-0 z-30">
            <div className="w-24 h-24 md:w-32 lg:w-40 md:h-32 lg:h-40 rounded-3xl overflow-hidden bg-background-1 shadow-2xl border-[6px] border-background-1">
              <img
                src={iconUrl || 'https://objectstorage.ap-tokyo-1.oraclecloud.com/n/nrsgvi73cynt/b/routem-image-bucket/o/initial-profile.webp'}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="pt-16 md:pt-20 pb-8 flex flex-col gap-5 md:gap-6">
            {/* Top Row: Name and Actions (Desktop) / Name (Mobile) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-5xl font-black text-foreground-0 tracking-tighter break-words leading-none md:leading-tight">
                  {name || 'User'}
                </h1>
              </div>

              {/* Actions - Hidden on mobile, moved below bio */}
              {mode === 'self' ? (
                <div className="hidden md:flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-foreground-0 text-background-1 px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-all cursor-pointer shadow-lg active:scale-95 text-sm"
                  >
                    <MdEdit size={20} />
                    <span>{t('editProfile')}</span>
                  </button>
                  <Link
                    href="/settings"
                    className="p-2.5 bg-background-1 border border-foreground-1/10 rounded-full hover:bg-foreground-1/5 transition-colors shadow-md"
                    title={t('settings')}
                  >
                    <MdSettings size={22} className="text-foreground-1" />
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3 shrink-0">
                  <button
                    onClick={onFollowToggle}
                    className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-bold transition-all cursor-pointer shadow-lg active:scale-95 text-sm ${
                      isFollowing 
                        ? 'bg-background-1 text-foreground-0 border border-foreground-1/10 hover:bg-foreground-1/5' 
                        : 'bg-foreground-0 text-background-1 hover:opacity-90'
                    }`}
                  >
                    <span>{isFollowing ? t('unfollow') : t('follow')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bio and Actions (Mobile) */}
            <div className="flex flex-col gap-3 md:gap-4">
              {/* Bio */}
              <div className="max-w-3xl">
                {bio ? (
                  <p className="text-foreground-1 text-sm md:text-lg leading-snug md:leading-relaxed whitespace-pre-wrap break-words">
                    {bio}
                  </p>
                ) : mode === 'self' ? (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-foreground-1/30 text-sm italic hover:text-foreground-1/50 transition-colors"
                  >
                    + Add a bio to tell people about yourself
                  </button>
                ) : null}
              </div>

              {/* Actions - Visible only on mobile here */}
              {mode === 'self' ? (
                <div className="flex md:hidden items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-foreground-0 text-background-1 px-4 py-2 rounded-full font-bold hover:opacity-90 transition-all cursor-pointer shadow-lg active:scale-95 text-xs"
                  >
                    <MdEdit size={16} />
                    <span>{t('editProfile')}</span>
                  </button>
                  <Link
                    href="/settings"
                    className="p-2 bg-background-1 border border-foreground-1/10 rounded-full hover:bg-foreground-1/5 transition-colors shadow-md"
                    title={t('settings')}
                  >
                    <MdSettings size={18} className="text-foreground-1" />
                  </Link>
                </div>
              ) : (
                <div className="flex md:hidden items-center gap-2 shrink-0">
                  <button
                    onClick={onFollowToggle}
                    className={`flex items-center justify-center gap-2 px-6 py-2 rounded-full font-bold transition-all cursor-pointer shadow-lg active:scale-95 text-xs ${
                      isFollowing 
                        ? 'bg-background-1 text-foreground-0 border border-foreground-1/10' 
                        : 'bg-foreground-0 text-background-1'
                    }`}
                  >
                    <span>{isFollowing ? t('unfollow') : t('follow')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5 md:gap-8">
              <div className="flex items-baseline gap-1 md:gap-1.5">
                <span className="text-lg md:text-2xl font-black text-foreground-0">{routesCount}</span>
                <span className="text-[10px] md:text-xs text-foreground-1 uppercase tracking-widest font-bold">{t('routes')}</span>
              </div>
              <div className="flex items-baseline gap-1 md:gap-1.5 cursor-pointer hover:opacity-70 transition-opacity">
                <span className="text-lg md:text-2xl font-black text-foreground-0">{followersCount}</span>
                <span className="text-[10px] md:text-xs text-foreground-1 uppercase tracking-widest font-bold">{t('followers')}</span>
              </div>
              <div className="flex items-baseline gap-1 md:gap-1.5 cursor-pointer hover:opacity-70 transition-opacity">
                <span className="text-lg md:text-2xl font-black text-foreground-0">{followingCount}</span>
                <span className="text-[10px] md:text-xs text-foreground-1 uppercase tracking-widest font-bold">{t('following')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}
