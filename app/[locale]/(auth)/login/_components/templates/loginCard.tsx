"use client";

import { motion } from "framer-motion";
import {FaGoogle} from "react-icons/fa";
import {useState} from "react";
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/auth/supabase/client";
import { getClientAuthRedirectUrl } from "@/lib/auth/redirectUrl";
import LoginBackground from "../ingredients/loginBackground";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const t = useTranslations('auth');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {}

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getClientAuthRedirectUrl(),
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
      <motion.div
          initial={{x: 300, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="w-full h-full flex flex-col md:flex-row rounded-2xl items-center justify-center text-foreground-0 relative"
      >


          {/*背景画像*/}
          <LoginBackground />

        {/* 右側：フォーム */}
        <div
            className="absolute md:w-1/2 w-full h-full md:top-0 md:right-0 m-auto z-10 p-6">
          <div className="w-full h-full flex justify-center items-center p-3">
            <div className="w-full max-w-sm space-y-8">
              <div className="text-center flex flex-col gap-2">
                <h2 className="text-5xl font-syne font-bold text-foreground-0">Sign In</h2>
                <p className={'text-md font-semibold'}>welcome back, traveler.</p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-bold text-foreground-0">
                      {t('email')}
                    </label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-6 py-3 rounded-full backdrop-blur-md sm:text-sm text-white border-1 border-white/20 bg-background-1/30 focus:outline-none focus:border-white transition-all"
                        placeholder={t('emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" id="password-label" className="block text-sm font-bold text-foreground-0">
                      {t('password')}
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-6 py-3 rounded-full backdrop-blur-md sm:text-sm text-white border-1 border-white/20 bg-background-1/30 focus:outline-none focus:border-white transition-all"
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
                      className="w-full flex justify-center py-3 px-6 bg-background-1 backdrop-blur-sm rounded-full font-bold border-1 border-background-1 hover:border-white transition-all"
                  >
                    {t('signIn')}
                  </button>

                  <div className="text-center">
                    <span className="text-sm text-foreground-0/90">{t('noAccount')} </span>
                    <Link href="/signup" className="text-sm font-medium text-foreground-0 hover:underline hover:text-accent-0">
                      {t('signUp')}
                    </Link>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-foreground-1/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 text-foreground-0/90 font-bold">{t('continueWith')}</span>
                    </div>
                  </div>

                  <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full flex justify-center gap-3 py-3 px-6 border-1 border-white/20 backdrop-blur-sm rounded-full font-bold hover:border-white transition-all"
                  >
                    <FaGoogle className="w-5 h-5 text-accent-0" />
                    <span>{t('google')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
  );
}
