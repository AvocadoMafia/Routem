import { motion } from 'framer-motion'

export default function UserAvatar({ url, name }: { url?: string; name?: string }) {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-32 h-32 md:w-40 md:h-40 rounded-full p-[4px] bg-linear-to-r from-accent-0 to-accent-1"
    >
      <div className="w-full h-full rounded-full bg-background-1">
        <img 
          src={url || 'https://i.pravatar.cc/150?u=fallback'} 
          alt={name || 'user'} 
          className="w-full h-full rounded-full object-cover"
        />
      </div>
    </motion.div>
  )
}
