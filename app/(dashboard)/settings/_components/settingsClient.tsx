'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { MdLogout, MdDelete, MdVpnKey, MdDarkMode, MdLightMode, MdChevronRight, MdArrowBack } from 'react-icons/md'
import { createClient } from '@/lib/auth/supabase/client'
import { userStore } from '@/lib/client/stores/userStore'

export default function SettingsClient() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, login, logout } = userStore()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    if (!user || user.id === '') {
      login(undefined, (u) => {
        if (!u) router.push('/login')
      })
    }
  }, [user, login, router])

  if (!mounted) return null

  const handleLogout = async () => {
    setIsLoading(true)
    await logout(
      undefined,
      () => router.push('/login'),
      (error) => setMessage({ type: 'error', text: error?.message || 'ログアウトに失敗しました' })
    )
    setIsLoading(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'パスワードが一致しません' })
      return
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'パスワードは6文字以上である必要があります' })
      return
    }

    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setIsLoading(false)

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'パスワードを更新しました' })
      setPassword('')
      setConfirmPassword('')
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/v1/users/me', { method: 'DELETE' })
      if (res.ok) {
        await logout(undefined, () => router.push('/login'))
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'アカウントの削除に失敗しました' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'エラーが発生しました' })
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
          <h1 className="text-2xl font-black">設定</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-grass/20 text-grass' : 'bg-red-500/20 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Theme Section */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">表示設定</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-grass/10 rounded-xl flex items-center justify-center text-grass">
                  {theme === 'dark' ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
                </div>
                <div>
                  <div className="font-bold">ダークモード</div>
                  <div className="text-xs text-foreground-1">アプリの見た目を切り替えます</div>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative w-14 h-8 bg-background-2 rounded-full p-1 transition-colors duration-300 focus:outline-none"
              >
                <div className={`w-6 h-6 bg-grass rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </section>

          {/* Password Section */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">セキュリティ</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-grass/10 rounded-xl flex items-center justify-center text-grass">
                  <MdVpnKey size={24} />
                </div>
                <div>
                  <div className="font-bold">パスワード変更</div>
                  <div className="text-xs text-foreground-1">新しいパスワードを設定します</div>
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="新しいパスワード"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background-2 border border-grass/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-grass transition-colors"
                />
                <input
                  type="password"
                  placeholder="新しいパスワード（確認）"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background-2 border border-grass/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-grass transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-grass text-white font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                パスワードを更新
              </button>
            </form>
          </section>

          {/* Account Section */}
          <section className="bg-background-1 rounded-3xl p-6 border border-grass/10">
            <h2 className="text-sm font-black text-foreground-1 mb-4 uppercase tracking-wider">アカウント操作</h2>
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 bg-background-2 rounded-2xl hover:bg-background-2/80 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <MdLogout size={24} className="text-foreground-1 group-hover:text-foreground-0" />
                  <span className="font-bold">ログアウト</span>
                </div>
                <MdChevronRight size={24} className="text-foreground-1" />
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-4 bg-red-500/10 rounded-2xl hover:bg-red-500/20 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <MdDelete size={24} className="text-red-500" />
                  <span className="font-bold text-red-500">アカウント削除</span>
                </div>
                <MdChevronRight size={24} className="text-red-500" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
