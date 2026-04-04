'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Footer() {
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
            Plan Together, Travel Smarter.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-foreground-0">Explore</h3>
          <ul className="flex flex-col gap-2 text-sm text-foreground-1">
            <li><Link href="/explore/popular" className="hover:text-accent-0 transition-colors">Popular</Link></li>
            <li><Link href="/explore/trending" className="hover:text-accent-0 transition-colors">Trending</Link></li>
            <li><Link href="/explore/recent" className="hover:text-accent-0 transition-colors">Recent</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-foreground-0">About</h3>
          <ul className="flex flex-col gap-2 text-sm text-foreground-1">
            <li><Link href="/about" className="hover:text-accent-0 transition-colors">About Us</Link></li>
            <li><Link href="/about/story" className="hover:text-accent-0 transition-colors">Our Story</Link></li>
            <li><Link href="/about/team" className="hover:text-accent-0 transition-colors">Team</Link></li>
            <li><Link href="/about/contact" className="hover:text-accent-0 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-foreground-0">Social</h3>
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
          <Link href="/privacy" className="hover:text-foreground-1 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground-1 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
