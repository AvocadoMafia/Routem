"use client";

import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Link } from "@/i18n/navigation";
import {createClient} from "@/lib/auth/supabase/client";
import {getClientAuthRedirectUrl} from "@/lib/config/client";
import { Turnstile } from '@marsidev/react-turnstile';

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const supabase = createClient();

  const t = useTranslations('auth');

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if(!captchaToken) {
      setError(t('captchaRequired'));
      return;
    }

    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: username,
        },
        emailRedirectTo: getClientAuthRedirectUrl(),
        captchaToken,
      }
    })

    if(error) {
      console.log(error)
      setError(error.message);
      return;
    }

    setIsSubmitted(data.user?.identities?.length === 0 ? false : true);
    // Supabase returns an empty identities array if user already exists
    // but we can just set it to true if no error occurred for simplicity in this flow
    setIsSubmitted(true);
  }

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
      className="absolute md:w-1/2 w-full h-full md:top-0 md:left-0 z-10 p-6"
    >
      <div className="w-full h-full flex justify-center items-center p-3">
        <div className="w-full max-w-sm space-y-8">
          {!isSubmitted ? (
            <>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                className="text-center flex flex-col gap-3"
              >
                <h2 className="text-5xl font-syne font-bold text-white">{t('signUp')}</h2>
                <p className="text-md font-semibold opacity-90 text-white/75">start your journey today.</p>
              </motion.div>

              <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                className="mt-8 space-y-6"
                onSubmit={handleSignup}
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
                  >
                    <label htmlFor="username" className="block text-sm font-bold text-white">
                      {t('username')}
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 block w-full px-6 py-3 rounded-full backdrop-blur-md sm:text-sm text-white border-1 border-white/40 focus:outline-none focus:border-white transition-all"
                      placeholder={t('usernamePlaceholder')}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                  >
                    <label htmlFor="email-address" className="block text-sm font-bold text-white">
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
                      className="mt-1 block w-full px-6 py-3 rounded-full backdrop-blur-md sm:text-sm text-white border-1 border-white/40 focus:outline-none focus:border-white transition-all"
                      placeholder={t('emailPlaceholder')}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
                  >
                    <label htmlFor="password" id="password-label" className="block text-sm font-bold text-white">
                      {t('password')}
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full px-6 py-3 rounded-full backdrop-blur-md sm:text-sm text-white border-1 border-white/40 focus:outline-none focus:border-white transition-all"
                      placeholder="••••••••"
                    />
                  </motion.div>
                </div>

                {error && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 1.0 }}
                    className="text-accent-warning text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.05, ease: "easeOut" }}
                    className="flex justify-center"
                  >
                    <Turnstile
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                      onSuccess={(token) => {
                        console.log('captcha token:', token)
                        setCaptchaToken(token)
                      }}
                      onExpire={() => setCaptchaToken(null)}
                      onError={() => setCaptchaToken(null)}
                    />
                  </motion.div>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full flex justify-center py-3 px-6 bg-background-1 border-1 border-background-1 backdrop-blur-sm rounded-full font-bold hover:border-white transition-colors"
                  >
                    {t('signUp')}
                  </motion.button>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                    className="text-center"
                  >
                    <span className="text-sm text-white/75">{t('hasAccount')} </span>
                    <Link href="/login" className="text-sm font-medium text-white hover:underline hover:text-accent-0">
                      {t('signIn')}
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.3, ease: "easeOut" }}
                    className="relative"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-foreground-1/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 text-white/90 font-bold">{t('continueWith')}</span>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4, ease: "easeOut" }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    className="w-full flex justify-center gap-3 py-3 px-6 border-1 border-white/40 backdrop-blur-sm rounded-full font-bold hover:border-white transition-colors"
                    onClick={handleGoogleLogin}
                  >
                    <FaGoogle className="w-5 h-5 text-accent-0" />
                    <span className={'text-white'}>{t('google')}</span>
                  </motion.button>
                </div>
              </motion.form>
            </>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center space-y-6"
            >
              <div className="space-y-3">
                <h2 className="text-4xl font-syne font-bold text-white">{t('checkEmail')}</h2>
                <p className="text-md font-medium opacity-90 leading-relaxed">
                  {t('checkEmailDescription')}
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex justify-center py-3 px-8 bg-background-1 border-1 border-background-1 backdrop-blur-sm rounded-full font-bold hover:border-white transition-colors"
                >
                  {t('backToSignIn')}
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
