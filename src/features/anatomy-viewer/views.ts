import type { ViewName } from './store'

export type { ViewName }

/** Directions in model space: face looks to +Z, anatomical left is +X, up is +Y. */
export const VIEW_DIRECTIONS: Record<ViewName, [number, number, number]> = {
  anterior: [0, 0, 1],
  posterior: [0, 0, -1],
  right: [-1, 0, 0],
  left: [1, 0, 0],
  superior: [0, 1, 0.0001],
  inferior: [0, -1, 0.0001],
  oblique: [-0.68, 0.28, 0.68],
}
