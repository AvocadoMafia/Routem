"use client";

import { motion } from "framer-motion";
import {FaGoogle} from "react-icons/fa";
import {useState} from "react";
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/auth/supabase/client";
import { getClientAuthRedirectUrl } from "@/lib/auth/redirectUrl";

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
          <div className={'absolute inset-0 w-full h-full'}>
              <img className={'w-full h-full'} src={'/mockImages/mountain.jpg'}/>
          </div>

        {/* 右側：フォーム */}
        <div
            className="absolute md:w-1/2 w-full h-full md:top-0 md:right-0 z-10 p-6">
          <div className="w-full h-full flex justify-center items-center bg-background-1/80 rounded-2xl border-1.5 border-background-1 p-3 backdrop-blur-sm">
            <div className="w-full max-w-sm space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground-0">{t('signIn')}</h2>
                <p className="mt-2 text-sm text-foreground-1">{t('pleaseEnterDetails')}</p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-foreground-0/80">
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
                        className="mt-1 block w-full px-3 py-2 border border-foreground-1/30 rounded-md shadow-sm focus:outline-none focus:ring-foreground-0 focus:border-foreground-0 sm:text-sm"
                        placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" id="password-label" className="block text-sm font-medium text-foreground-0/80">
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
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background-1 bg-accent-0 hover:bg-accent-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground-0 transition-colors"
                  >
                    {t('signIn')}
                  </button>

                  <div className="md:hidden text-center">
                    <span className="text-sm text-foreground-1">{t('noAccount')} </span>
                    <Link href="/signup" className="text-sm font-medium text-foreground-0 hover:underline">
                      {t('signUp')}
                    </Link>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-foreground-1/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background-1 text-foreground-0/80">{t('continueWith')}</span>
                    </div>
                  </div>

                  <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-foreground-1/30 rounded-md shadow-sm text-sm font-medium text-foreground-0 bg-background-1 hover:bg-background-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground-0 transition-colors"
                  >
                    <FaGoogle className="w-5 h-5 text-accent-warning" />
                    <span>Google</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
  );
}
