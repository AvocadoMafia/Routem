"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const images = [
    "/lp/slideshow/LP1.jpg",
    "/lp/slideshow/LP2.jpg",
    "/lp/slideshow/LP3.jpg",
    "/lp/slideshow/LP4.jpg",
    "/lp/slideshow/LP5.jpg",
];

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className={'relative w-full h-screen overflow-hidden'}>
            <div className={'absolute inset-0 z-0'}>
                <AnimatePresence initial={false}>
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className={'absolute inset-0 w-full h-full object-cover'}
                    />
                </AnimatePresence>
                <div className={'absolute inset-0 bg-black/20'} />
            </div>

            <div className={'relative z-10 w-full h-full grid grid-rows-2 grid-cols-1'}>
                <div className={'flex justify-start items-start p-16'}>
                    <h1 className={'w-fit lg:text-8xl md:text-6xl text-5xl font-bold tracking-wide font-syne text-white'}>
                        <span className={'text-accent-0'}>誰か</span>の旅を、<br/>あなたの旅に。
                    </h1>
                </div>
                <div className={'flex justify-end items-end p-16'}>
                    <h1 className={'w-fit lg:text-8xl md:text-6xl text-5xl font-bold tracking-wide font-syne text-white'}>
                        <span className={'text-accent-1'}>あなた</span>の旅を、<br/>誰かの旅に。
                    </h1>
                </div>
            </div>
        </section>
    );
}
