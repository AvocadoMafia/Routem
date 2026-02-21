'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdSearch, MdArrowBack } from 'react-icons/md'

const MOCK_SUGGESTIONS = [
  'Best driving routes in Tokyo',
  'Scenic coastal roads in Chiba',
  'Mountain passes in Nagano',
  'Cycling paths around Lake Biwa',
  'Historic trails in Kyoto'
]

interface SearchBarProps {
  onBack?: () => void
  isMobileOnly?: boolean
}

export default function SearchBar({ onBack, isMobileOnly = false }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className={`flex flex-row gap-4 items-center relative w-full ${isMobileOnly ? '' : 'lg:w-[300px]'}`}>
        {onBack && (
            <button onClick={onBack} className="lg:hidden p-1 -ml-2 hover:bg-grass rounded-full transition-colors cursor-pointer">
                <MdArrowBack size={20} className="text-foreground-0" />
            </button>
        )}
      <div 
        className={`flex-1 p-[1px] rounded-full transition-all ${isFocused ? 'bg-linear-to-r from-accent-0 to-accent-1 shadow-sm' : 'bg-transparent'}`}
      >
        <div className={`flex items-center gap-2 bg-background-0 px-4 py-2 rounded-full w-full h-full ${isFocused ? 'bg-background-1' : ''}`}>
          <MdSearch className={'text-xl text-foreground-1'} />
          <input
            type="text"
            placeholder="Search routes..."
            className={'bg-transparent border-none outline-none w-full text-foreground-0 placeholder:text-foreground-1'}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={'absolute top-[calc(100%+8px)] left-0 w-full bg-background-1 border border-grass rounded-xl shadow-lg py-2 z-50 overflow-hidden'}
          >
            <div className={'px-4 py-2 text-xs font-bold text-foreground-1 uppercase tracking-wider'}>
              Suggestions
            </div>
            {MOCK_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                className={'w-full text-left px-4 py-2.5 hover:bg-background-0 transition-colors text-foreground-0 flex items-center gap-3 cursor-pointer'}
                onClick={() => setSearchValue(suggestion)}
              >
                <MdSearch className={'text-lg text-foreground-1'} />
                <span>{suggestion}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
