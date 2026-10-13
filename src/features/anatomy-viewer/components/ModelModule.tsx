import { useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { memo, useEffect, useMemo } from 'react'
import type { BufferGeometry, Material, Matrix4, Mesh, Object3D } from 'three'
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'
import { MESH_OWNER, STRUCTURE_BY_ID } from '@/features/anatomy-catalog/catalog'
import type { CategoryId } from '@/features/anatomy-catalog/types'
import { type MaterialSet, createMaterialSet, disposeMaterialSet } from '@/lib/three/materials'
import type { MeshDisplay } from '../sceneState'
import { modelUrl } from '../modelUrl'
import { useViewer } from '../store'

interface MeshEntry {
  id: string
  geometry: BufferGeometry
  matrix: Matrix4
  category: CategoryId
  owner: string
}

interface Props {
  moduleId: string
  display: Map<string, MeshDisplay>
  selectedMeshes: Set<string>
  selectedMaterial: Material
  xrayMaterial: Material
}

const noRaycast = () => undefined
/** Pointer movement (px) above which a click is treated as a camera drag, not a selection. */
const CLICK_TOLERANCE = 6

function ModelModuleImpl({ moduleId, display, selectedMeshes, selectedMaterial, xrayMaterial }: Props) {
  const gltf = useGLTF(modelUrl(moduleId))
  const hovered = useViewer((s) => s.hoveredMeshId)
  const select = useViewer((s) => s.select)
  const setHovered = useViewer((s) => s.setHovered)
  const setModuleStatus = useViewer((s) => s.setModuleStatus)

  const entries = useMemo<MeshEntry[]>(() => {
    gltf.scene.updateMatrixWorld(true)
    const list: MeshEntry[] = []
    gltf.scene.traverse((obj: Object3D) => {
      const mesh = obj as Mesh
      if (!mesh.isMesh) return
      // Node names are the stable mesh ids written by scripts/models/export_zanatomy.py.
      const id = mesh.name
      const owner = MESH_OWNER.get(id)
      const structure = owner ? STRUCTURE_BY_ID.get(owner) : undefined
      if (!owner || !structure) return
      // BVH makes per-triangle picking fast enough for pointer hover on dense meshes.
      if (!mesh.geometry.boundsTree) mesh.geometry.boundsTree = new MeshBVH(mesh.geometry)
      list.push({ id, geometry: mesh.geometry, matrix: mesh.matrixWorld.clone(), category: structure.categories[0]!, owner })
    })
    return list
  }, [gltf])

  const materials = useMemo(() => {
    const map = new Map<CategoryId, MaterialSet>()
    for (const e of entries) if (!map.has(e.category)) map.set(e.category, createMaterialSet(e.category))
    return map
  }, [entries])

  useEffect(() => () => materials.forEach(disposeMaterialSet), [materials])
  useEffect(() => setModuleStatus(moduleId, 'ready'), [moduleId, setModuleStatus])

  const onClick = (e: ThreeEvent<MouseEvent>, entry: MeshEntry) => {
    e.stopPropagation()
    if (e.delta > CLICK_TOLERANCE) return
    // Clicking the selected mesh again toggles the selection off.
    const { selectedId, selectedMeshId } = useViewer.getState()
    if (selectedId === entry.owner && selectedMeshId === entry.id) select(null)
    else select(entry.owner, entry.id)
  }
  const onOver = (e: ThreeEvent<PointerEvent>, id: string) => {
    e.stopPropagation()
    setHovered(id)
  }
  const onOut = (id: string) => {
    if (useViewer.getState().hoveredMeshId === id) setHovered(null)
  }

  return (
    <group name={moduleId}>
      {entries.map((entry) => {
        const d = display.get(entry.id) ?? 'hidden'
        const set = materials.get(entry.category)!
        const selected = selectedMeshes.has(entry.id)
        const material = selected ? selectedMaterial : d === 'ghost' ? set.ghost : hovered === entry.id ? set.hover : set.solid
        return (
          <mesh
            key={entry.id}
            name={entry.id}
            geometry={entry.geometry}
            material={material}
            matrixAutoUpdate={false}
            matrix={entry.matrix}
            visible={d !== 'hidden'}
            renderOrder={d === 'ghost' ? 1 : 0}
            // Ghosted or hidden meshes must not steal clicks from the structures behind them.
            raycast={d === 'solid' ? acceleratedRaycast : noRaycast}
            onClick={(e) => onClick(e, entry)}
            onPointerOver={(e) => onOver(e, entry.id)}
            onPointerOut={() => onOut(entry.id)}
          />
        )
      })}
      {entries
        .filter((e) => selectedMeshes.has(e.id))
        .map((e) => (
          <mesh key={`xray-${e.id}`} geometry={e.geometry} material={xrayMaterial} matrixAutoUpdate={false} matrix={e.matrix} renderOrder={10} raycast={noRaycast} />
        ))}
    </group>
  )
}

export const ModelModule = memo(ModelModuleImpl)
