/** Mesh ids end with `__r` / `__l` for paired structures (anatomical right / left). */
export function sideOfMesh(meshId: string): 'direito' | 'esquerdo' | null {
  if (meshId.endsWith('__r')) return 'direito'
  if (meshId.endsWith('__l')) return 'esquerdo'
  return null
}
