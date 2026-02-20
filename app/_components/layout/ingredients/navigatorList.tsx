'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdEdit, MdExplore, MdInfo, MdLogin, MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { userStore } from "@/lib/client/stores/userStore";


export default function NavigatorList() {

    const user = userStore(store => store.user);
    const router = useRouter();

    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const menuItems = {
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

    return (
        <div className={'flex items-center flex-1 justify-between'}>
            <div className={'hidden lg:flex items-center gap-8 font-medium'}>
                {(['Explore', 'About'] as const).map((item) => (
                    <div 
                        key={item} 
                        className={'relative'}
                        onMouseEnter={() => setOpenMenu(item)}
                        onMouseLeave={() => setOpenMenu(null)}
                    >
                        <button 
                            onClick={() => router.push(`/${item.toLowerCase()}`)} 
                            className={'flex items-center gap-1 text-foreground-1 hover:text-foreground-0 transition-colors cursor-pointer whitespace-nowrap py-2'}
                        >
                            {item}
                            <MdKeyboardArrowDown className={`transition-transform duration-200 ${openMenu === item ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {openMenu === item && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className={'absolute top-full left-0 min-w-[160px] bg-background-1 border border-grass rounded-xl shadow-lg py-2 z-50'}
                                >
                                    {menuItems[item].map((subItem) => (
                                        <button
                                            key={subItem.name}
                                            onClick={() => router.push(subItem.path)}
                                            className={'w-full text-left px-4 py-2 hover:bg-background-0 transition-colors text-foreground-0 whitespace-nowrap cursor-pointer'}
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

            <div className={'flex items-center gap-6 ml-auto'}>
                <motion.button 
                    onClick={() => router.push('/articles/new')} 
                    className={'bg-accent-1 text-white py-2.5 px-5 lg:px-5 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2'}
                    whileHover={{scale:1.02}}
                    whileTap={{scale:0.98}}
                >
                    <span className={'lg:block hidden'}>Edit Route</span>
                    <AiOutlineEdit className={'text-xl'}/>
                </motion.button>

                {!user ? (
                    <motion.button 
                        onClick={() => router.push('/login')} 
                        className={'bg-background-1 text-foreground-0 py-2.5 px-5 border border-grass rounded-lg font-medium hover:bg-grass transition-colors cursor-pointer hidden lg:block'}
                        whileHover={{scale:1.02}}
                        whileTap={{scale:0.98}}
                    >
                        Log in
                    </motion.button>
                ) : (
                    <motion.button 
                        onClick={() => router.push('/users/me')}
                        className={'flex items-center gap-2 py-1 px-1 lg:pr-3 rounded-full hover:bg-grass transition-colors cursor-pointer hidden lg:flex'}
                        whileHover={{scale:1.02}}
                    >
                        <img className={'w-8 h-8 rounded-full object-cover'} src={user.icon?.url} alt={user.name}/>
                        <span className={'lg:block hidden font-medium'}>
                            {user.name.length > 7 ? `${user.name.slice(0, 7)}...` : user.name}
                        </span>
                    </motion.button>
                )}
            </div>
        </div>
    )
}
