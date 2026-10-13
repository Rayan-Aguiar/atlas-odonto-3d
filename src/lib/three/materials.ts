import { Color, DoubleSide, FrontSide, MeshStandardMaterial } from 'three'
import type { CategoryId } from '@/features/anatomy-catalog/types'
import { CATEGORY_COLORS } from '@/lib/categoryColors'


const ROUGHNESS: Partial<Record<CategoryId, number>> = { bones: 0.82, teeth: 0.35, nerves: 0.55, arteries: 0.5, veins: 0.5 }

export interface MaterialSet {
  solid: MeshStandardMaterial
  hover: MeshStandardMaterial
  ghost: MeshStandardMaterial
}

export function createMaterialSet(category: CategoryId): MaterialSet {
  const color = new Color(CATEGORY_COLORS[category])
  const roughness = ROUGHNESS[category] ?? 0.68
  const solid = new MeshStandardMaterial({ color, roughness, metalness: 0, side: DoubleSide })
  const hover = solid.clone()
  hover.emissive = new Color('#1f5c57')
  hover.emissiveIntensity = 0.55
  const ghost = new MeshStandardMaterial({
    color,
    roughness,
    metalness: 0,
    transparent: true,
    opacity: 0.13,
    depthWrite: false,
    side: FrontSide,
  })
  return { solid, hover, ghost }
}

export function createSelectedMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: new Color('#5fe6d2'),
    emissive: new Color('#0d6f63'),
    emissiveIntensity: 0.75,
    roughness: 0.45,
    metalness: 0,
    side: DoubleSide,
  })
}

export function disposeMaterialSet(set: MaterialSet) {
  set.solid.dispose()
  set.hover.dispose()
  set.ghost.dispose()
}

/** Faint see-through copy of the selection, drawn on top so buried structures (nerves in bone) stay visible. */
export function createSelectionXrayMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: new Color('#5fe6d2'),
    emissive: new Color('#5fe6d2'),
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.55,
    depthTest: false,
    depthWrite: false,
  })
}
