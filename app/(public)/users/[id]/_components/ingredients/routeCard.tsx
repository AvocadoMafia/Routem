import { motion } from 'framer-motion'
import { MdFavoriteBorder, MdGridOn } from 'react-icons/md'

export type RouteItem = {
  id: string
  title: string
  thumbnail: string
  likes: number
  views: number
  category: string
}

export default function RouteCard({ route }: { route: RouteItem }) {
  return (
    <motion.div 
      key={route.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-3 shadow-sm group-hover:shadow-xl transition-all duration-300">
        <img src={route.thumbnail} alt={route.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full">
            {route.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-4 text-white font-bold">
            <div className="flex items-center gap-1">
              <MdFavoriteBorder size={20} />
              <span>{route.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MdGridOn size={20} />
              <span>{route.views}</span>
            </div>
          </div>
        </div>
      </div>
      <h3 className="font-bold text-foreground-0 group-hover:text-accent-1 transition-colors">{route.title}</h3>
    </motion.div>
  )
}
