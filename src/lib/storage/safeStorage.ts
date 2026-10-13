import type { StateStorage } from 'zustand/middleware'

/** localStorage wrapper that never throws (private mode, blocked storage, quota). */
export const safeStorage: StateStorage = {
  getItem(name) {
    try {
      return globalThis.localStorage?.getItem(name) ?? null
    } catch {
      return null
    }
  },
  setItem(name, value) {
    try {
      globalThis.localStorage?.setItem(name, value)
    } catch {
      /* storage unavailable: preferences simply won't persist */
    }
  },
  removeItem(name) {
    try {
      globalThis.localStorage?.removeItem(name)
    } catch {
      /* ignore */
    }
  },
}
