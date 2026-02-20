'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { MdClose, MdPersonAdd, MdKeyboardArrowDown } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { userStore } from '@/lib/client/stores/userStore'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
}

const MOCK_FOLLOWING = [
    { id: '1', name: 'Alex Johnson', handle: '@alex_j', icon: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Sarah Miller', handle: '@sarahm', icon: 'https://i.pravatar.cc/150?u=2' },
    { id: '3', name: 'Mike Ross', handle: '@miker', icon: 'https://i.pravatar.cc/150?u=3' },
    { id: '4', name: 'Elena Gilbert', handle: '@elenag', icon: 'https://i.pravatar.cc/150?u=4' },
    { id: '5', name: 'Chris Evans', handle: '@chrise', icon: 'https://i.pravatar.cc/150?u=5' },
]

const MENU_ITEMS = {
    Explore: [
        { name: 'Popular', path: '/explore/popular' },
        { name: 'Recent', path: '/explore/recent' },
        { name: 'Trending', path: '/explore/trending' },
    ],
    About: [
        { name: 'Our Story', path: '/about/story' },
        { name: 'Team', path: '/about/team' },
        { name: 'Contact', path: '/about/contact' },
    ]
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const user = userStore(store => store.user)
    const router = useRouter()
    const [openAccordion, setOpenAccordion] = useState<string | null>(null)

    const handleNavigate = (path: string) => {
        router.push(path)
        onClose()
    }

    const toggleAccordion = (item: string) => {
        setOpenAccordion(openAccordion === item ? null : item)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className={'fixed inset-0 bg-black/50 z-[200]'}
                        onWheel={(e) => e.stopPropagation()}
                    />
                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={'fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-background-1 z-[201] shadow-xl flex flex-col h-[100svh]'}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <div className={'p-4 flex items-center justify-between border-b border-grass flex-shrink-0'}>
                            <div className={'flex items-center gap-2'}>
                                <img className={'h-8 w-8'} src={'/logo.svg'} alt={'Routem'}/>
                                <div className={'w-fit h-fit flex flex-col'}>
                                    <span className={'text-xl font-bold'}>Routem</span>
                                    <span className={'text-xs text-foreground-1/80'}>ver. 1.0β</span>
                                </div>
                            </div>
                            <button onClick={onClose} className={'p-2 hover:bg-grass rounded-full transition-colors cursor-pointer'}>
                                <MdClose size={24} className={'text-foreground-0'} />
                            </button>
                        </div>

                        <div className={'flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar overscroll-contain'}>
                            {/* User Info Card */}
                            <div className={'bg-transparent rounded-2xl p-0'}>
                                {user ? (
                                    <div className={'space-y-4'}>
                                        <div 
                                            className={'flex items-center gap-4 cursor-pointer hover:bg-background-0 rounded-xl p-2 transition-colors'}
                                            onClick={() => handleNavigate('/users/me')}
                                        >
                                            <img className={'w-16 h-16 rounded-full object-cover'} src={user.icon?.url} alt={user.name}/>
                                            <div className={'flex flex-col'}>
                                                <span className={'font-bold text-xl text-foreground-0'}>{user.name}</span>
                                                <button 
                                                    onClick={() => handleNavigate('/users/me')}
                                                    className={'text-sm text-accent-1 text-left hover:underline'}
                                                >
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                        <div className={'flex gap-6 pt-2'}>
                                            <div className={'flex items-center gap-1.5'}>
                                                <span className={'font-bold text-foreground-0'}>124</span>
                                                <span className={'text-sm text-foreground-1'}>Following</span>
                                            </div>
                                            <div className={'flex items-center gap-1.5'}>
                                                <span className={'font-bold text-foreground-0'}>850</span>
                                                <span className={'text-sm text-foreground-1'}>Followers</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={'py-2'}>
                                        <p className={'text-foreground-1 text-sm mb-4'}>Log in to see your profile and routes.</p>
                                        <button 
                                            onClick={() => handleNavigate('/login')}
                                            className={'w-full bg-accent-1 text-background-1 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-accent-1/20'}
                                        >
                                            Log in
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Links (Accordion) */}
                            <div className={'space-y-2'}>
                                {(['Explore', 'About'] as const).map((item) => (
                                    <div key={item} className={'space-y-1'}>
                                        <button 
                                            onClick={() => toggleAccordion(item)}
                                            className={'w-full flex items-center justify-between p-3 hover:bg-background-0 rounded-xl transition-colors font-bold text-foreground-0 cursor-pointer'}
                                        >
                                            <span>{item}</span>
                                            <MdKeyboardArrowDown 
                                                size={24} 
                                                className={`text-foreground-1 transition-transform duration-200 ${openAccordion === item ? 'rotate-180' : ''}`} 
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {openAccordion === item && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className={'overflow-hidden pl-4 space-y-1'}
                                                >
                                                    {MENU_ITEMS[item].map((subItem) => (
                                                        <button
                                                            key={subItem.name}
                                                            onClick={() => handleNavigate(subItem.path)}
                                                            className={'w-full text-left p-3 text-foreground-1 hover:text-accent-1 transition-colors cursor-pointer'}
                                                        >
                                                            {subItem.name}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {/* Following Users List */}
                            <div className={'space-y-4 pt-4'}>
                                <div className={'flex items-center justify-between px-1'}>
                                    <h3 className={'font-bold text-foreground-0 uppercase text-xs tracking-wider'}>Following</h3>
                                    <button className={'text-accent-1 text-xs font-bold hover:underline'}>View All</button>
                                </div>
                                <div className={'space-y-1'}>
                                    {MOCK_FOLLOWING.map((followedUser) => (
                                        <button
                                            key={followedUser.id}
                                            className={'w-full flex items-center justify-between p-2 hover:bg-background-0 rounded-xl transition-colors group cursor-pointer'}
                                        >
                                            <div className={'flex items-center gap-3'}>
                                                <img className={'w-10 h-10 rounded-full object-cover'} src={followedUser.icon} alt={followedUser.name}/>
                                                <div className={'flex flex-col text-left'}>
                                                    <span className={'font-medium text-foreground-0 group-hover:text-accent-1 transition-colors'}>{followedUser.name}</span>
                                                    <span className={'text-xs text-foreground-1'}>{followedUser.handle}</span>
                                                </div>
                                            </div>
                                            <MdPersonAdd size={20} className={'text-foreground-1 group-hover:text-accent-1 transition-colors'} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {user && (
                            <div className={'p-4 border-t border-grass flex-shrink-0'}>
                                <button 
                                    className={'w-full flex items-center justify-center gap-2 py-3 text-foreground-1 hover:text-accent-warning font-medium transition-colors cursor-pointer'}
                                >
                                    Log out
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
