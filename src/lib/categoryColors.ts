import type { CategoryId } from '@/features/anatomy-catalog/types'

/** Conventional atlas colours (sRGB). Arteries red, veins blue, nerves yellow. */
export const CATEGORY_COLORS: Record<CategoryId, string> = {
  bones: '#e6dbc3',
  teeth: '#f5f2ea',
  muscles: '#a54a42',
  arteries: '#cf3a33',
  veins: '#4a6dc0',
  nerves: '#e9c84f',
  foramina: '#e6dbc3',
  joints: '#a7b6c4',
  glands: '#d8a48d',
  oral: '#d68c8a',
  tongue: '#c86f6c',
  'pharynx-larynx': '#cc918a',
  lymph: '#8ea65c',
  other: '#c79c96',
}
