'use client'

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {MdEdit, MdExplore, MdInfo, MdLogin} from "react-icons/md";


export default function NavigatorList() {

    const router = useRouter();

    return (
        // ホバー時の背景色のdurationとmotionのスケールアップのアニメーションが共存できていないので後々修正する
        <div className={'flex md:gap-6 gap-2'}>
            <motion.button onClick={() => router.push('/login')} className={'bg-background-1 text-foreground-0 py-1 px-2 box-border rounded-full flex gap-2 text-lg items-center hover:theme-reversed transition-colors duration-150 cursor-pointer'}
            whileHover={{scale:1.05}}
            >
                <MdLogin className={'text-xl'}/>
                <span className={'md:block hidden'}>Login</span>
            </motion.button>
            <motion.button onClick={() => router.push('/explore')} className={'bg-background-1 text-foreground-0 py-1 px-2 box-border rounded-full flex gap-2 text-lg items-center hover:theme-reversed transition-colors duration-150 cursor-pointer'}
            whileHover={{scale:1.05}}
            >
                <MdExplore className={'text-xl'}/>
                <span className={'md:block hidden'}>Explore</span>
            </motion.button>
            <motion.button onClick={() => router.push('/about')} className={'bg-background-1 text-foreground-0 py-1 px-2 box-border rounded-full flex gap-2 text-lg items-center hover:theme-reversed transition-colors duration-150 cursor-pointer'}
            whileHover={{scale:1.05}}
            >
                <MdInfo className={'text-xl'}/>
                <span className={'md:block hidden'}>About</span>
            </motion.button>
            <motion.button onClick={() => router.push('/articles/new')} className={'bg-background-1 text-foreground-0 py-1 px-2 box-border rounded-full flex gap-2 text-lg items-center hover:theme-reversed transition-colors duration-150 cursor-pointer'}
                           whileHover={{scale:1.05}}
            >
                <MdEdit className={'text-xl'}/>
                <span className={'md:block hidden'}>Edit Route</span>
            </motion.button>
            <motion.button>
                {/*<img className={'text-xl'} src={}*/}
            </motion.button>
        </div>
    )
}
