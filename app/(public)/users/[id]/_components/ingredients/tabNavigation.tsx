import { motion } from 'framer-motion'
import { MdGridOn, MdFavoriteBorder } from 'react-icons/md'

type Tab = 'routes' | 'likes'

export default function TabNavigation({ activeTab, onChange }: { activeTab: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="flex items-center gap-8 border-b border-grass mb-8">
      <button 
        onClick={() => onChange('routes')}
        className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'routes' ? 'text-accent-1' : 'text-foreground-1 hover:text-foreground-0'}`}
      >
        <MdGridOn size={18} />
        <span>ROUTES</span>
        {activeTab === 'routes' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-1" />}
      </button>
      <button 
        onClick={() => onChange('likes')}
        className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'likes' ? 'text-accent-1' : 'text-foreground-1 hover:text-foreground-0'}`}
      >
        <MdFavoriteBorder size={18} />
        <span>LIKES</span>
        {activeTab === 'likes' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-1" />}
      </button>
    </div>
  )
}
