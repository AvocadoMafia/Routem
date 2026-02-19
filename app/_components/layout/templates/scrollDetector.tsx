'use client'

import {useEffect, useRef} from "react";
import {useAtom} from "jotai";
import {scrollDirectionAtom} from "@/lib/client/atoms";

export default function ScrollDetector() {
    const [, setScrollDirection] = useAtom(scrollDirectionAtom)
    const touchStart = useRef<{ x: number, y: number } | null>(null)
    const lastScrollY = useRef(0)
    const lastScrollDirection = useRef<'up' | 'down' | 'left' | 'right'>('up')
    const lastToggleTime = useRef(0)
    const COOLDOWN_MS = 500

    useEffect(() => {
        const canToggle = (nextDirection: 'up' | 'down') => {
            if (nextDirection === lastScrollDirection.current) return true

            const now = Date.now()
            if (now - lastToggleTime.current > COOLDOWN_MS) {
                lastToggleTime.current = now
                lastScrollDirection.current = nextDirection
                return true
            }
            return false
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY
            const diff = currentScrollY - lastScrollY.current
            const threshold = 5 // 微小なスクロールでのチャタリング防止

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    if (canToggle('down')) setScrollDirection('down')
                } else {
                    if (canToggle('up')) setScrollDirection('up')
                }
                lastScrollY.current = currentScrollY
            }
        }

        const handleWheel = (e: WheelEvent) => {
            // 特定の要素内（マップなど）でのスクロールは無視する
            if (e.target instanceof Element && e.target.closest('[data-ignore-scroll-detector]')) {
                return;
            }

            // 水平スクロールの優先判定
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                if (e.deltaX > 0) {
                    setScrollDirection('right')
                    lastScrollDirection.current = 'right'
                } else if (e.deltaX < 0) {
                    setScrollDirection('left')
                    lastScrollDirection.current = 'left'
                }
                return
            }

            if (e.deltaY > 0) {
                if (canToggle('down')) setScrollDirection('down')
            } else if (e.deltaY < 0) {
                if (canToggle('up')) setScrollDirection('up')
            }
        }

        const handleTouchStart = (e: TouchEvent) => {
            // 特定の要素内（マップなど）でのタッチは無視する
            if (e.target instanceof Element && e.target.closest('[data-ignore-scroll-detector]')) {
                touchStart.current = null;
                return;
            }

            touchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            }
        }

        const handleTouchEnd = (e: TouchEvent) => {
            if (!touchStart.current) return

            const touchEnd = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            }

            const dx = touchEnd.x - touchStart.current.x
            const dy = touchEnd.y - touchStart.current.y

            // スワイプ判定の閾値
            const threshold = 30

            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > threshold) {
                    if (dx > 0) {
                        setScrollDirection('right')
                        lastScrollDirection.current = 'right'
                    } else {
                        setScrollDirection('left')
                        lastScrollDirection.current = 'left'
                    }
                }
            } else {
                if (Math.abs(dy) > threshold) {
                    if (dy > 0) {
                        if (canToggle('up')) setScrollDirection('up') // 下にスワイプ = 上にスクロール
                    } else {
                        if (canToggle('down')) setScrollDirection('down') // 上にスワイプ = 下にスクロール
                    }
                }
            }

            touchStart.current = null
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('wheel', handleWheel, { passive: true })
        window.addEventListener('touchstart', handleTouchStart, { passive: true })
        window.addEventListener('touchend', handleTouchEnd, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('wheel', handleWheel)
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchend', handleTouchEnd)
        }
    }, [setScrollDirection])

    return null
}
