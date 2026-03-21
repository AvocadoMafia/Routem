import { create } from 'zustand'

type ScrollDirection = 'up' | 'down' | 'left' | 'right'

interface UiState {
  // スクロール方向
  scrollDirection: ScrollDirection
  setScrollDirection: (direction: ScrollDirection) => void

  // ヘッダー高さ
  headerHeight: number
  setHeaderHeight: (height: number) => void

  // モバイル判定
  isMobile: boolean
  setIsMobile: (isMobile: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  scrollDirection: 'up',
  setScrollDirection: (direction) => set({ scrollDirection: direction }),

  headerHeight: 60,
  setHeaderHeight: (height) => set({ headerHeight: height }),

  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile: isMobile }),
}))
