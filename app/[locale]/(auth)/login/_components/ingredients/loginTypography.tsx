"use client";

import { motion } from "framer-motion";

export default function LoginTypography() {
  return (
    <div className="absolute xl:left-20 lg:left-15 left-10 xl:bottom-20 lg:bottom-15 bottom-10 z-20 text-white pointer-events-none hidden md:block">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex flex-col gap-3"
      >
          <div className={'flex items-center gap-6'}><img className={'xl:w-24 ld:w-16 h-12 xl:h-24 ld:h-16 h-12'} src={'/logoMono.svg'}/><h1 className={'xl:text-7xl ld:text-6xl text-4xl font-extrabold font-syne text-white'}>Routem</h1></div>
          <p className={'font-bold text-white flex flex-col gap-3'}>
              <span className={'fon-syne lg:text-4xl text-2xl lg:max-w-[500px] max-w-[380px]'}>share, and discover travel itineraries with ease.</span>
              <span className={'text-white/75 lg:text-2xl text-xl font-thin lg:max-w-[400px] max-w-[300px]'}>Routem is a travel itinerary sharing platform where you can create trip plans, collaborate with friends, and explore routes shared by other travelers around the world.</span>
          </p>
      </motion.div>
    </div>
  );
}
