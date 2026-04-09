'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('navigation')
  const tFooter = useTranslations('footer')
  const router = useRouter()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="theme-reversed w-full bg-background-1 border-t border-grass/10 py-12 px-6">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <img src="/logo.svg" alt="logo" className="w-6 h-6" />
            <span className="text-xl font-bold text-foreground-0">Routem</span>
          </div>
          <p className="text-sm text-foreground-1">
            {tFooter('tagline')}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-foreground-0">{t('explore')}</h3>
          <ul className="flex flex-col gap-2 text-sm text-foreground-1">
            <li><Link href="/explore/popular" className="hover:text-accent-0 transition-colors">{t('popular')}</Link></li>
            <li><Link href="/explore/trending" className="hover:text-accent-0 transition-colors">{t('trending')}</Link></li>
            <li><Link href="/explore/recent" className="hover:text-accent-0 transition-colors">{t('recent')}</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-foreground-0">{t('about')}</h3>
          <ul className="flex flex-col gap-2 text-sm text-foreground-1">
            <li><Link href="/about" className="hover:text-accent-0 transition-colors">{t('aboutUs')}</Link></li>
            <li><Link href="/about/story" className="hover:text-accent-0 transition-colors">{t('ourStory')}</Link></li>
            <li><Link href="/about/team" className="hover:text-accent-0 transition-colors">{t('team')}</Link></li>
            <li><Link href="/about/contact" className="hover:text-accent-0 transition-colors">{t('contact')}</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-foreground-0">{t('social')}</h3>
          <ul className="flex flex-col gap-2 text-sm text-foreground-1">
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-0 transition-colors">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-0 transition-colors">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto mt-12 pt-8 border-t border-grass/10 flex justify-between items-center">
        <p className="text-xs text-foreground-1/60">
          © {currentYear} Routem. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-foreground-1/60">
          <Link href="/privacy" className="hover:text-foreground-1 transition-colors">{t('privacyPolicy')}</Link>
          <Link href="/terms" className="hover:text-foreground-1 transition-colors">{t('termsOfService')}</Link>
        </div>
      </div>
    </footer>
  )
}
