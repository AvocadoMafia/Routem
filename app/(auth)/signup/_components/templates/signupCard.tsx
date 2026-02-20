"use client";

import { motion } from "framer-motion";
import {FaGoogle} from "react-icons/fa";
import {useState} from "react";
import Link from "next/link";

export default function SignupCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {}

  return (
      <motion.div
          initial={{x: -300, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="w-full h-full flex flex-col md:flex-row-reverse items-center justify-center rounded-2xl text-foreground-0 relative"
      >
        {/* 右側（入れ替え後：左側）：画像 + ロゴ + 見出し */}
        <div className="w-full md:w-1/2 md:min-w-[500px] h-full md:h-auto p-3 overflow-hidden flex flex-col justify-center items-center gap-6 md:block hidden @container relative z-10 opacity-100 backdrop-blur-xs">
          <h2 className={'text-[4cqw] text-foreground-0/80 text-center'}>Routem, Travel Itinerary Sharing Platform</h2>
          <h1 className={'text-[10cqw] text-foreground-0 leading-snug text-center font-bold'}>Start your new <br /> adventure with us today.</h1>
          <div className={'flex flex-col gap-4 items-center'}>
            <h3 className={'text-2xl w-fit text-foreground-0/60 font-bold'}>Already Have Account?</h3>
            <Link href="/login">
              <h3 className={'text-2xl w-fit text-foreground-0 pb-1 px-2 border-b-2 border-foreground-0 hover:opacity-80 transition-opacity'}>Sign in →</h3>
            </Link>
          </div>
        </div>

        {/*背景画像*/}
        <div className={'flex w-full md:min-w-[500px] md:w-1/2 h-full md:h-fit absolute inset-0 md:inset-auto md:top-0 md:bottom-0 md:right-0 md:m-auto items-center justify-center z-0 md:z-auto opacity-20 md:opacity-100'}>
          <img className={'lg:w-4/5 w-full aspect-video'} src={'/brushStroke_3.png'}/>
        </div>

        {/* 左側（入れ替え後：右側）：フォーム */}
        <div
            className="w-full md:w-auto md:flex-1 md:h-full h-fit box-border p-6 overflow-hidden relative grid place-items-center @container z-10">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground-0">Sign up</h2>
              <p className="mt-2 text-sm text-foreground-1">Please enter your details to create an account.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-foreground-0/80">
                    Email address
                  </label>
                  <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-foreground-1/30 rounded-md shadow-sm focus:outline-none focus:ring-foreground-0 focus:border-foreground-0 sm:text-sm"
                      placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" id="password-label" className="block text-sm font-medium text-foreground-0/80">
                    Password
                  </label>
                  <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-foreground-1/30 rounded-md shadow-sm focus:outline-none focus:ring-foreground-0 focus:border-foreground-0 sm:text-sm"
                      placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                  <div className="text-accent-warning text-sm text-center">
                    {error}
                  </div>
              )}

              <div className="space-y-4">
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background-1 bg-accent-0 hover:bg-accent-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground-0 transition-colors"
                >
                  Sign up
                </button>

                <div className="md:hidden text-center">
                  <span className="text-sm text-foreground-1">Already have an account? </span>
                  <Link href="/login" className="text-sm font-medium text-foreground-0 hover:underline">
                    Sign in
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-foreground-1/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background-1 text-foreground-0/80">Or continue with</span>
                  </div>
                </div>

                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-foreground-1/30 rounded-md shadow-sm text-sm font-medium text-foreground-0 bg-background-1 hover:bg-background-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground-0 transition-colors"
                >
                  <FaGoogle className="w-5 h-5 text-accent-warning" />
                  <span>Google</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
  );
}
