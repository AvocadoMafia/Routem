'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {MdClose, MdExplore, MdInfo, MdSettings, MdPostAdd, MdLogout, MdHome} from 'react-icons/md'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { userStore } from '@/lib/stores/userStore'
import { useState } from 'react'
import {AiOutlineEdit} from "react-icons/ai";

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const user = userStore(store => store.user)
    const logout = userStore(store => store.logout)
    const isLoggedIn = user && user.id !== ''
    const router = useRouter()

    const t = useTranslations('navigation')
    const tAuth = useTranslations('auth')
    const tProfile = useTranslations('profile')
    const tCommon = useTranslations('common')

    const handleNavigate = (path: string) => {
        router.push(path)
        onClose()
    }

    const handleLogout = async () => {
        await logout(
            undefined,
            () => {
                router.push('/login')
                onClose()
            }
        )
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className={'fixed top-0 left-0 w-full h-[100svh] bg-black/20 z-[300]'}
                         onWheel={(e) => e.stopPropagation()}
                         onTouchStart={(e) => e.stopPropagation()}
                         onTouchMove={(e) => e.stopPropagation()}
                         onTouchEnd={(e) => e.stopPropagation()}
                    />
                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={'fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-background-1 z-[301] shadow-xl flex flex-col h-[100svh]'}
                        onWheel={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        <div className={'p-4 flex items-center justify-between border-b border-grass flex-shrink-0'}>
                            <div className={'flex items-center gap-2'}>
                                <img className={'h-7 w-7'} src={'/logo.svg'} alt={'Routem'}/>
                                <div className={'w-fit h-fit flex flex-col'}>
                                    <span className={'text-xl font-bold'}>Routem</span>
                                    <span className={'text-xs text-foreground-1/80'}>{tCommon('version')}</span>
                                </div>
                            </div>
                            <button onClick={onClose} className={'p-2 hover:bg-grass rounded-full transition-colors cursor-pointer'}>
                                <MdClose size={24} className={'text-foreground-0'} />
                            </button>
                        </div>

                        <div
                            className={'flex-1 overflow-y-auto p-4 space-y-8 no-scrollbar overscroll-contain'}
                            data-ignore-scroll-detector
                        >
                            {/* User Info Card */}
                            <div className={'bg-transparent rounded-2xl p-0'}>
                                {isLoggedIn ? (
                                    <div className={'space-y-4'} onClick={() => router.push('/me')}>
                                        <div
                                            className={'flex items-center gap-4 cursor-pointer hover:bg-background-0 rounded-xl p-2 transition-colors'}
                                        >
                                            <img className={'w-16 h-16 rounded-full object-cover'} src={user.icon?.url} alt={user.name}/>
                                            <div className={'flex flex-col'}>
                                                <span className={'font-bold text-xl text-foreground-0'}>{user.name}</span>
                                                <span
                                                    className={'text-sm text-accent-0 text-left hover:underline'}
                                                >
                                                    {t('profile')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={'flex gap-6 pt-2'}>
                                            <div className={'flex items-center gap-1.5'}>
                                                <span className={'font-bold text-foreground-0'}>{user._count?.followings ?? 0}</span>
                                                <span className={'text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1'}>{t('following')}</span>
                                            </div>
                                            <div className={'flex items-center gap-1.5'}>
                                                <span className={'font-bold text-foreground-0'}>{user._count?.followers ?? 0}</span>
                                                <span className={'text-[10px] font-bold uppercase tracking-[0.3em] text-foreground-1'}>{tProfile('followers')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={'py-2'}>
                                        <p className={'text-foreground-1 text-sm mb-4'}>{tAuth('pleaseEnterDetails')}</p>
                                        <button
                                            onClick={() => handleNavigate('/login')}
                                            className={'w-full bg-accent-0 text-background-1 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-accent-0/20'}
                                        >
                                            {tAuth('signIn')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Navigation Links */}
                            <div className={'space-y-2'}>
                                {[
                                    { icon: MdHome, label: t('home'), path: '/' },
                                    { icon: MdExplore, label: t('explore'), path: '/explore' },
                                    { icon: MdInfo, label: t('about'), path: '/about' },
                                    { icon: MdSettings, label: t('settings'), path: '/settings' },
                                    { icon: AiOutlineEdit, label: t('createRoute'), path: '/routes/new' },
                                ].map((item, idx) => (
                                    <div key={idx} className={'space-y-1'}>
                                        <button
                                            onClick={() => handleNavigate(item.path)}
                                            className={'w-full flex items-center gap-3 p-3 hover:bg-background-0 rounded-xl transition-colors font-bold text-foreground-0 cursor-pointer'}
                                        >
                                            <item.icon size={24} className={'text-foreground-1'} />
                                            <span>{item.label}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isLoggedIn && (
                            <div className={'p-4 border-t border-grass flex-shrink-0'}>
                                <button
                                    onClick={handleLogout}
                                    className={'w-full flex items-center gap-3 p-3 hover:bg-background-0 rounded-xl transition-colors font-bold text-foreground-0 cursor-pointer'}
                                >
                                    <MdLogout size={24} className={'text-foreground-1'} />
                                    <span>{tAuth('signOut')}</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
