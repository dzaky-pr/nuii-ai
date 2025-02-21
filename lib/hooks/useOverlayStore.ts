import { create } from 'zustand'

type OverlayType = string

interface OverlayState {
  isOpen: Record<OverlayType, boolean>
  open: (overlayType: OverlayType) => void
  close: (overlayType: OverlayType) => void
}

const useOverlayStore = create<OverlayState>(set => ({
  isOpen: {},
  open: overlayType =>
    set(state => ({
      isOpen: { ...state.isOpen, [overlayType]: true }
    })),
  close: overlayType =>
    set(state => ({
      isOpen: { ...state.isOpen, [overlayType]: false }
    }))
}))

export default useOverlayStore
