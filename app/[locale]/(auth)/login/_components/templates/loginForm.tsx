"use client";

import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/auth/supabase/client";
import { getClientAuthRedirectUrl } from "@/lib/auth/redirectUrl";
import {useRouter} from "next/navigation";
import { Turnstile } from '@marsidev/react-turnstile';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const router = useRouter();

  const t = useTranslations('auth');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError(t('captchaRequired'));
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken,
      }
    })

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/');

  };

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        //login成功したらredirectUrlに遷移
        redirectTo: getClientAuthRedirectUrl(),
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="absolute md:w-1/2 w-full h-full md:top-0 md:right-0 m-auto z-10 p-6"
    >
      <div className="w-full h-full flex justify-center items-center p-3">
        <div className="w-full max-w-sm space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="text-center flex flex-col gap-2"
          >
            <h2 className="text-5xl font-syne font-bold text-foreground-0">Sign In</h2>
            <p className={'text-md font-semibold'}>welcome back, traveler.</p>
          </motion.div>

          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="mt-8 space-y-6"
            onSubmit={handleLogin}
          >
            <div className="space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
              >
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
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
              >
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
                  className="mt-1 block w-full px-6 py-3 rounded-full backdrop-blur-md sm:text-sm text-white border-1 border-white/20 bg-background-1/30 focus:outline-none focus:border-white transition-colors"
                  placeholder="••••••••"
                />
              </motion.div>
            </div>

            {error && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.85 }}
                className="text-accent-warning text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.88, ease: "easeOut" }}
                className="flex justify-center"
              >
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onSuccess={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  onError={() => setCaptchaToken(null)}
                />
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full flex justify-center py-3 px-6 bg-background-1 backdrop-blur-sm rounded-full font-bold border-1 border-background-1 hover:border-white transition-colors"
              >
                {t('signIn')}
              </motion.button>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
                className="text-center"
              >
                <span className="text-sm text-foreground-0/90">{t('noAccount')} </span>
                <Link href="/signup" className="text-sm font-medium text-foreground-0 hover:underline hover:text-accent-0">
                  {t('signUp')}
                </Link>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-foreground-1/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-foreground-0/90 font-bold">{t('continueWith')}</span>
                </div>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex justify-center gap-3 py-3 px-6 border-1 border-white/20 backdrop-blur-sm rounded-full font-bold hover:border-white transition-colors"
              >
                <FaGoogle className="w-5 h-5 text-accent-0" />
                <span>{t('google')}</span>
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
}
