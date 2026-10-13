import { Box3, Vector3 } from 'three'
import { MODEL_MANIFEST } from '@/features/anatomy-catalog/data/build'
import { MESH_MODULE } from '@/features/anatomy-catalog/catalog'

export function boundsOfMeshes(meshIds: string[]): Box3 | null {
  const box = new Box3()
  let any = false
  for (const id of meshIds) {
    const module = MESH_MODULE.get(id)
    const info = module ? MODEL_MANIFEST[module]?.[id] : undefined
    if (!info) continue
    box.expandByPoint(new Vector3(...info.min))
    box.expandByPoint(new Vector3(...info.max))
    any = true
  }
  return any ? box : null
}

/** Bounding box of the skull and cervical skeleton — the framing reference for anatomical views. */
export const HEAD_BOUNDS: Box3 = boundsOfMeshes(Object.keys(MODEL_MANIFEST.bones ?? {})) ?? new Box3(new Vector3(-0.1, 1.4, -0.1), new Vector3(0.1, 1.75, 0.12))
export const HEAD_CENTER: Vector3 = HEAD_BOUNDS.getCenter(new Vector3())

/** Expands tiny boxes (nerve branches, ducts) so the camera does not zoom absurdly close. */
export function ensureMinSize(box: Box3, min = 0.05): Box3 {
  const size = box.getSize(new Vector3())
  const center = box.getCenter(new Vector3())
  const half = new Vector3(Math.max(size.x, min) / 2, Math.max(size.y, min) / 2, Math.max(size.z, min) / 2)
  return new Box3(center.clone().sub(half), center.clone().add(half))
}
