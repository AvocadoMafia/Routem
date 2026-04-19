'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useLocale, useTranslations } from 'next-intl'
import { MdLogout, MdDelete, MdVpnKey, MdDarkMode, MdLightMode, MdChevronRight, MdArrowBack, MdLanguage, MdSave } from 'react-icons/md'
import { createClient } from '@/lib/auth/supabase/client'
import { userStore } from '@/lib/client/stores/userStore'
import { localeNames } from '@/i18n/config'
import { enumsStore } from '@/lib/client/stores/enumsStore'
import { dbLocaleToAppLocale, deleteDataToServerWithJson } from "@/lib/client/helpers";
import type { User } from '@/lib/types/domain'

export default function RootClient() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const logout = userStore(state => state.logout)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const user = userStore(state => state.user)
  const [locale, setLocale] = useState<string>(user.locale || '')
  const [language, setLanguage] = useState<string>(user.language || '')
  const localeOptions = enumsStore(state => state.locale)
  const languageOptions = enumsStore(state => state.language)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const currentLocale = useLocale()
  const t = useTranslations('settings')
  const tAuth = useTranslations('auth')

  const regionDisplayNames = useMemo(
    () => new Intl.DisplayNames([currentLocale], { type: 'region' }),
    [currentLocale]
  )
  const localeRegionMap: Record<string, string> = {
    JA: 'JP',
    EN: 'US',
    KO: 'KR',
    ZH: 'CN',
  }
  const localeLabel = (value: string) =>
    regionDisplayNames.of(localeRegionMap[value]) ?? localeRegionMap[value]
  const languageLabel = (value: string) => localeNames[dbLocaleToAppLocale(value)]

  useEffect(() => {
    if (user.locale) setLocale(user.locale)
    if (user.language) setLanguage(user.language)
  }, [user.locale, user.language])


  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!locale || !language) {
      setMessage({ type: 'error', text: t('updateFailed') })
      return
    }
    setIsLoading(true)
    const profile = {
      locale: locale as User["locale"],
      language: language as User["language"],
    }
    await userStore.getState().edit(
      profile,
      undefined,
      () => setMessage({ type: 'success', text: t('profileUpdated') }),
      (error) => setMessage({ type: 'error', text: error?.message || t('updateFailed') })
    )
    setIsLoading(false)
  }

  const handleLogout = async () => {
    setIsLoading(true)
    await logout(
      undefined,
      () => router.push('/login'),
      (error) => setMessage({ type: 'error', text: error?.message || t('logoutFailed') })
    )
    setIsLoading(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: tAuth('passwordMismatch') })
      return
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: tAuth('passwordTooShort') })
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setIsLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: t('passwordUpdated') })
      setPassword('')
      setConfirmPassword('')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm(t('deleteAccountConfirm'))) return
    setIsLoading(true)
    try {
      await deleteDataToServerWithJson('/api/v1/users/me')
    } catch {
      setMessage({ type: 'error', text: t('updateFailed') })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-0 text-foreground-0 pb-20">
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-background-1 rounded-full transition-colors"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl font-black">{t('title')}</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-grass text-foreground-1' : 'bg-accent-0/20 text-accent-0'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Settings */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">{t('profileSettings')}</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-grass rounded-xl flex items-center justify-center text-foreground-1">
                    <MdLanguage size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold mb-1">{t('locale')}</div>
                    <select
                      value={locale}
                      onChange={(e) => setLocale(e.target.value)}
                      className="w-full bg-background-2 border border-grass/10 rounded-xl px-4 py-2 focus:outline-none focus:border-grass transition-colors appearance-none"
                    >
                      {localeOptions.map((localeOption) => (
                        <option key={localeOption} value={localeOption}>
                          {localeLabel(localeOption)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-grass rounded-xl flex items-center justify-center text-foreground-1">
                    <MdLanguage size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold mb-1">{t('language')}</div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-background-2 border border-grass/10 rounded-xl px-4 py-2 focus:outline-none focus:border-grass transition-colors appearance-none"
                    >
                      {languageOptions.map((languageOption) => (
                        <option key={languageOption} value={languageOption}>
                          {languageLabel(languageOption)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-foreground-1 text-white font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <MdSave size={20} />
                {t('saveSettings')}
              </button>
            </form>
          </section>

          {/* Theme Section */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">{t('displaySettings')}</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-grass rounded-xl flex items-center justify-center text-foreground-1">
                  {theme === 'dark' ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
                </div>
                <div>
                  <div className="font-bold">{theme === 'dark' ? t('darkMode') : t('lightMode')}</div>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative w-14 h-8 bg-grass rounded-full p-1 transition-colors duration-300 focus:outline-none disabled:opacity-50"
              >
                <div className={`w-6 h-6 bg-foreground-1 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </section>

          {/* Password Section */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">{t('security')}</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-grass rounded-xl flex items-center justify-center text-foreground-1">
                  <MdVpnKey size={24} />
                </div>
                <div>
                  <div className="font-bold">{t('changePassword')}</div>
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder={t('newPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background-2 border border-grass/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-grass transition-colors"
                />
                <input
                  type="password"
                  placeholder={t('confirmNewPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background-2 border border-grass/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-grass transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-foreground-1 text-white font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {t('updatePassword')}
              </button>
            </form>
          </section>

          {/* Account Section */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">{t('accountActions')}</h2>
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 bg-background-2 rounded-2xl hover:bg-background-2/80 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <MdLogout size={24} className="text-foreground-1 group-hover:text-foreground-0" />
                  <span className="font-bold">{tAuth('signOut')}</span>
                </div>
                <MdChevronRight size={24} className="text-foreground-1" />
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 bg-accent-0/10 rounded-2xl hover:bg-accent-0/20 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <MdDelete size={24} className="text-accent-0" />
                  <span className="font-bold text-accent-0">{t('deleteAccount')}</span>
                </div>
                <MdChevronRight size={24} className="text-accent-0" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

