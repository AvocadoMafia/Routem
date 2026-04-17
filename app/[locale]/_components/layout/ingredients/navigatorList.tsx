'use client'

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MdEdit, MdExplore, MdInfo, MdLogin, MdSearch } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { userStore } from "@/lib/client/stores/userStore";
import { useTranslations } from "next-intl";


type Props = {
    onSearchClick?: () => void;
}

export default function NavigatorList({ onSearchClick }: Props) {
    const t = useTranslations('navigation');
    const tAuth = useTranslations('auth');

    const user = userStore(store => store.user);
    const isLoggedIn = user && user.id !== '';
    const router = useRouter();

    const getMenuLabel = (key: string) => {
        if (key === 'Explore') return t('explore');
        if (key === 'About') return t('about');
        return key;
    };

    return (
        <div className={'flex items-center flex-1 lg:justify-between justify-end'}>
            <div className={'hidden lg:flex items-center gap-8 font-medium'}>
                {(['Explore', 'About'] as const).map((item, idx) => (
                    <div 
                        key={idx} 
                        className={'relative'}
                    >
                        <button
                            onClick={() => router.push(`/${item.toLowerCase()}`)}
                            className={'flex items-center gap-1.5 text-foreground-1 hover:text-foreground-0 transition-colors cursor-pointer whitespace-nowrap py-2'}
                        >
                            {item === 'Explore' ? <MdExplore size={20} /> : <MdInfo size={20} />}
                            {getMenuLabel(item)}
                        </button>
                    </div>
                ))}
            </div>

            <div className={'flex items-center md:gap-6 md:justify-end justify-between'}>
                {isLoggedIn ? (
                    <>
                        <motion.button
                            onClick={() => router.push('/routes/new')}
                            className={'bg-accent-0 md:bg-accent-0 text-white md:py-1.5 md:px-4 p-2 rounded-full md:rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2 md:text-white max-md:bg-transparent max-md:text-foreground-0 max-md:hover:bg-grass'}
                            whileHover={{scale:1.02}}
                            whileTap={{scale:0.98}}
                        >
                            <span className={'md:block hidden'}>{t('createRoute')}</span>
                            <AiOutlineEdit className={'text-2xl md:text-xl'}/>
                        </motion.button>
                        
                        <motion.button
                            onClick={onSearchClick}
                            className={'md:hidden p-2 rounded-full hover:bg-grass transition-colors cursor-pointer text-foreground-0 flex items-center justify-center'}
                            whileHover={{scale:1.02}}
                            whileTap={{scale:0.98}}
                        >
                            <MdSearch size={24} />
                        </motion.button>

                        <motion.button 
                            onClick={() => router.push('/me')}
                            className={'flex items-center gap-2 p-1 md:pr-3 rounded-full hover:bg-grass transition-colors cursor-pointer'}
                            whileHover={{scale:1.02}}
                        >
                            <img className={'w-8 h-8 rounded-full object-cover'} src={user.icon?.url} alt={user.name}/>
                            <span className={'md:block hidden font-medium'}>
                                {user.name.length > 7 ? `${user.name.slice(0, 7)}...` : user.name}
                            </span>
                        </motion.button>
                    </>
                ) : (
                    <motion.button
                        onClick={() => router.push('/login')}
                        className={'bg-background-1 text-foreground-0 py-1.5 px-4 border border-grass rounded-lg font-medium hover:bg-grass transition-colors cursor-pointer'}
                        whileHover={{scale:1.02}}
                        whileTap={{scale:0.98}}
                    >
                        {tAuth('signIn')}
                    </motion.button>
                )}
            </div>
        </div>
    )
}
