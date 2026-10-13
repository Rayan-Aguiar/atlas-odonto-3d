import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeStorage } from '@/lib/storage/safeStorage'

const HISTORY_LIMIT = 30

interface StudyState {
  favorites: string[]
  history: string[]
  notes: Record<string, string>
  /** Structures whose details were opened at least once. */
  studied: string[]
  quiz: { answered: number; correct: number; byStructure: Record<string, { right: number; wrong: number }> }

  toggleFavorite: (id: string) => void
  recordVisit: (id: string) => void
  setNote: (id: string, text: string) => void
  recordAnswer: (id: string, correct: boolean) => void
  clearHistory: () => void
  resetProgress: () => void
}

export const useStudy = create<StudyState>()(
  persist(
    (set) => ({
      favorites: [],
      history: [],
      notes: {},
      studied: [],
      quiz: { answered: 0, correct: 0, byStructure: {} },

      toggleFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [id, ...s.favorites] })),
      recordVisit: (id) =>
        set((s) => ({
          history: [id, ...s.history.filter((h) => h !== id)].slice(0, HISTORY_LIMIT),
          studied: s.studied.includes(id) ? s.studied : [...s.studied, id],
        })),
      setNote: (id, text) =>
        set((s) => {
          const notes = { ...s.notes }
          if (text.trim()) notes[id] = text
          else delete notes[id]
          return { notes }
        }),
      recordAnswer: (id, correct) =>
        set((s) => {
          const prev = s.quiz.byStructure[id] ?? { right: 0, wrong: 0 }
          return {
            quiz: {
              answered: s.quiz.answered + 1,
              correct: s.quiz.correct + (correct ? 1 : 0),
              byStructure: { ...s.quiz.byStructure, [id]: correct ? { ...prev, right: prev.right + 1 } : { ...prev, wrong: prev.wrong + 1 } },
            },
          }
        }),
      clearHistory: () => set({ history: [] }),
      resetProgress: () => set({ studied: [], quiz: { answered: 0, correct: 0, byStructure: {} }, history: [] }),
    }),
    { name: 'atlas-odonto:study', version: 1, storage: createJSONStorage(() => safeStorage) },
  ),
)
