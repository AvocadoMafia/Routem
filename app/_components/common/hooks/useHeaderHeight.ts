'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useSetAtom } from 'jotai'
import { headerHeightAtom } from '@/lib/client/atoms'

export const useHeaderHeight = () => {
    const setHeaderHeight = useSetAtom(headerHeightAtom)
    const observer = useRef<ResizeObserver | null>(null)

    const ref = useCallback((node: HTMLElement | null) => {
        if (observer.current) {
            observer.current.disconnect()
            observer.current = null
        }

        if (node) {
            observer.current = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setHeaderHeight(entry.contentRect.height)
                }
            })
            observer.current.observe(node)
        }
    }, [setHeaderHeight])

    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
        }
    }, [])

    return ref
}
