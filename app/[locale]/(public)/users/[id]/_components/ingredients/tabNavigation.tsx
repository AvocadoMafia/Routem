'use client'

import { motion } from 'framer-motion'
import { MdGridOn, MdFavoriteBorder, MdHistory } from 'react-icons/md'
import { useTranslations } from 'next-intl'

export type Tab = 'routes' | 'likes' | 'history'

export default function TabNavigation({
  activeTab,
  onChange,
  mode = 'public'
}: {
  activeTab: Tab;
  onChange: (t: Tab) => void;
  mode?: 'self' | 'public';
}) {
  const t = useTranslations('tabs')

  return (
    <div className="flex items-center gap-8 border-b border-grass mb-8">
      <button
        onClick={() => onChange('routes')}
        className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'routes' ? 'text-accent-0' : 'text-foreground-1 hover:text-foreground-0'}`}
      >
        <MdGridOn size={18} />
        <span>{t('routes').toUpperCase()}</span>
        {activeTab === 'routes' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />}
      </button>

      {mode === 'self' && (
        <button
          onClick={() => onChange('likes')}
          className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'likes' ? 'text-accent-0' : 'text-foreground-1 hover:text-foreground-0'}`}
        >
          <MdFavoriteBorder size={18} />
          <span>{t('likes').toUpperCase()}</span>
          {activeTab === 'likes' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />}
        </button>
      )}

      {mode === 'self' && (
        <button
          onClick={() => onChange('history')}
          className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'history' ? 'text-accent-0' : 'text-foreground-1 hover:text-foreground-0'}`}
        >
          <MdHistory size={18} />
          <span>{t('history').toUpperCase()}</span>
          {activeTab === 'history' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-0" />}
        </button>
      )}
    </div>
  )
}
