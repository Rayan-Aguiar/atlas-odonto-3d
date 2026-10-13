import { create } from 'zustand'

export type RightMode = 'details' | 'study' | 'library'
export type MobileSheet = null | 'filters' | 'search' | 'details' | 'study' | 'library'

interface UiState {
  leftOpen: boolean
  rightOpen: boolean
  rightMode: RightMode
  mobileSheet: MobileSheet
  aboutOpen: boolean
  /** While a study session runs, names are hidden from hover labels and the details panel. */
  studyActive: boolean
  setLeftOpen: (v: boolean) => void
  setRightOpen: (v: boolean) => void
  openRight: (mode: RightMode) => void
  setMobileSheet: (s: MobileSheet) => void
  setAboutOpen: (v: boolean) => void
  setStudyActive: (v: boolean) => void
}

export const useUi = create<UiState>()((set) => ({
  leftOpen: true,
  rightOpen: true,
  rightMode: 'details',
  mobileSheet: null,
  aboutOpen: false,
  studyActive: false,
  setLeftOpen: (leftOpen) => set({ leftOpen }),
  setRightOpen: (rightOpen) => set({ rightOpen }),
  openRight: (rightMode) => set({ rightMode, rightOpen: true }),
  setMobileSheet: (mobileSheet) => set({ mobileSheet }),
  setAboutOpen: (aboutOpen) => set({ aboutOpen }),
  setStudyActive: (studyActive) => set({ studyActive }),
}))
