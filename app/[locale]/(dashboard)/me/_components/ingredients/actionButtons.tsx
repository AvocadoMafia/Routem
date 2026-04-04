import { MdSettings, MdDarkMode, MdLightMode, MdEdit } from 'react-icons/md'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import UserProfileEditModal from '../templates/userProfileEditModal'
import { Link } from "@/i18n/navigation"
import { useTranslations } from 'next-intl'

export default function ActionButtons() {
  const t = useTranslations('profile')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center gap-3 pb-2">
      <Link
        href="/settings"
        className="p-2.5 bg-background-1 border border-grass rounded-xl hover:bg-grass transition-colors cursor-pointer shadow-sm flex items-center justify-center"
        title={t('settings')}
      >
        <MdSettings size={22} className="text-foreground-0" />
      </Link>
      <>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 bg-background-1 border border-grass px-4 py-2 rounded-xl font-bold hover:bg-grass transition-colors cursor-pointer shadow-sm"
        >
          <MdEdit size={20} />
          <span>{t('editProfile')}</span>
        </button>
        <UserProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </>
    </div>
  )
}
