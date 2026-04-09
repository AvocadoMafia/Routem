'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { MdLogout, MdDelete, MdVpnKey, MdDarkMode, MdLightMode, MdChevronRight, MdArrowBack, MdLanguage, MdLocationOn, MdSave } from 'react-icons/md'
import { createClient } from '@/lib/auth/supabase/client'
import { userStore } from '@/lib/client/stores/userStore'
import { patchDataToServerWithJson } from '@/lib/client/helpers'

export default function SettingsClient() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, login, logout } = userStore()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [language, setLanguage] = useState('')
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    if (!user || user.id === '') {
      login(undefined, (u) => {
        if (!u) {
          router.push('/login')
        } else {
          setLanguage(u.language || 'ja')
          setLocation(u.location || '')
        }
      })
    } else {
      setLanguage(user.language || 'ja')
      setLocation(user.location || '')
    }
  }, [user, login, router])

  if (!mounted) return null

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const profile = {
      language,
      location: location || null
    }
    await userStore.getState().edit(
      profile,
      undefined,
      () => setMessage({ type: 'success', text: 'Profile updated successfully' }),
      (error) => setMessage({ type: 'error', text: error?.message || 'Failed to update profile' })
    )
    setIsLoading(false)
  }

  const handleLogout = async () => {
    setIsLoading(true)
    await logout(
      undefined,
      () => router.push('/login'),
      (error) => setMessage({ type: 'error', text: error?.message || 'Failed to logout' })
    )
    setIsLoading(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' })
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setIsLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully' })
      setPassword('')
      setConfirmPassword('')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/v1/users/me', { method: 'DELETE' })
      if (res.ok) {
        await logout(undefined, () => router.push('/login'))
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to delete account' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
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
          <h1 className="text-2xl font-black">Settings</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-grass text-foreground-1' : 'bg-accent-0/20 text-accent-0'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Settings */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">Profile Settings</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-grass rounded-xl flex items-center justify-center text-foreground-1">
                    <MdLanguage size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold mb-1">Language</div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-background-2 border border-grass/10 rounded-xl px-4 py-2 focus:outline-none focus:border-grass transition-colors appearance-none"
                    >
                      <option value="ja">Japanese (日本語)</option>
                      <option value="en">English</option>
                      <option value="ko">Korean (한국어)</option>
                      <option value="zh">Chinese (中文)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-grass rounded-xl flex items-center justify-center text-foreground-1">
                    <MdLocationOn size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold mb-1">Location</div>
                    <input
                      type="text"
                      placeholder="e.g. Tokyo, Japan"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-background-2 border border-grass/10 rounded-xl px-4 py-2 focus:outline-none focus:border-grass transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-foreground-1 text-white font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <MdSave size={20} />
                Save Settings
              </button>
            </form>
          </section>

          {/* Theme Section */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">Appearance</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-grass rounded-xl flex items-center justify-center text-foreground-1">
                  {theme === 'dark' ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
                </div>
                <div>
                  <div className="font-bold">Dark Mode</div>
                  <div className="text-xs text-foreground-1">Toggle app appearance</div>
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
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">Security</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-grass rounded-xl flex items-center justify-center text-foreground-1">
                  <MdVpnKey size={24} />
                </div>
                <div>
                  <div className="font-bold">Change Password</div>
                  <div className="text-xs text-foreground-1">Set a new password for your account</div>
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background-2 border border-grass/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-grass transition-colors"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
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
                Update Password
              </button>
            </form>
          </section>

          {/* Account Section */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">Account Actions</h2>
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 bg-background-2 rounded-2xl hover:bg-background-2/80 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <MdLogout size={24} className="text-foreground-1 group-hover:text-foreground-0" />
                  <span className="font-bold">Logout</span>
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
                  <span className="font-bold text-accent-0">Delete Account</span>
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
