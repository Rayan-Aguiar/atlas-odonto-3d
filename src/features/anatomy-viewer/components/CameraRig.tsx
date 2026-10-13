import { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { meshIdsDeep, nearestAncestorIn3D } from '@/features/anatomy-catalog/catalog'
import { HEAD_BOUNDS, HEAD_CENTER, boundsOfMeshes, ensureMinSize } from '@/lib/three/bounds'
import { safeStorage } from '@/lib/storage/safeStorage'
import { useViewer } from '../store'
import { VIEW_DIRECTIONS, type ViewName } from '../views'


const CUSTOM_VIEW_KEY = 'atlas-odonto:custom-view'

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function CameraRig() {
  const controls = useRef<CameraControls>(null)
  const size = useThree((s) => s.size)
  const command = useViewer((s) => s.cameraCommand)

  const viewDistance = useCallback(() => {
    const aspect = size.width / Math.max(size.height, 1)
    return 0.62 * Math.max(1, 0.8 / aspect)
  }, [size])

  const goToView = useCallback(
    (view: ViewName, smooth: boolean) => {
      const c = controls.current
      if (!c) return
      const dir = new Vector3(...VIEW_DIRECTIONS[view]).normalize().multiplyScalar(viewDistance())
      const pos = HEAD_CENTER.clone().add(dir)
      void c.setLookAt(pos.x, pos.y, pos.z, HEAD_CENTER.x, HEAD_CENTER.y, HEAD_CENTER.z, smooth)
    },
    [viewDistance],
  )

  // Initial framing.
  useEffect(() => {
    goToView('oblique', false)
  }, [goToView])

  useEffect(() => {
    const c = controls.current
    if (!c || !command) return
    const smooth = !prefersReducedMotion()
    switch (command.type) {
      case 'view':
        goToView(command.view, smooth)
        break
      case 'reset':
        goToView('oblique', smooth)
        break
      case 'fit':
        void c.fitToBox(HEAD_BOUNDS, smooth, { paddingTop: 0.03, paddingBottom: 0.03, paddingLeft: 0.03, paddingRight: 0.03 })
        break
      case 'focus': {
        let meshes = meshIdsDeep(command.structureId)
        if (meshes.length === 0) {
          const ancestor = nearestAncestorIn3D(command.structureId)
          meshes = ancestor ? meshIdsDeep(ancestor.id) : []
        }
        const box = boundsOfMeshes(meshes)
        if (box) void c.fitToBox(ensureMinSize(box, 0.07), smooth, { paddingTop: 0.035, paddingBottom: 0.035, paddingLeft: 0.035, paddingRight: 0.035 })
        break
      }
      case 'custom-save': {
        const p = c.getPosition(new Vector3())
        const t = c.getTarget(new Vector3())
        safeStorage.setItem(CUSTOM_VIEW_KEY, JSON.stringify([...p.toArray(), ...t.toArray()]))
        break
      }
      case 'custom-restore': {
        try {
          const raw = safeStorage.getItem(CUSTOM_VIEW_KEY)
          const v = raw ? (JSON.parse(String(raw)) as number[]) : null
          if (v && v.length === 6) void c.setLookAt(v[0]!, v[1]!, v[2]!, v[3]!, v[4]!, v[5]!, smooth)
        } catch {
          /* corrupted saved view: ignore */
        }
        break
      }
    }
  }, [command, goToView])

  // Keyboard navigation when the canvas wrapper has focus (dispatched from Viewer).
  useEffect(() => {
    const onKey = (e: Event) => {
      const c = controls.current
      const key = (e as CustomEvent<string>).detail
      if (!c) return
      const step = 0.12
      const smooth = !prefersReducedMotion()
      if (key === 'ArrowLeft') void c.rotate(step, 0, smooth)
      if (key === 'ArrowRight') void c.rotate(-step, 0, smooth)
      if (key === 'ArrowUp') void c.rotate(0, step, smooth)
      if (key === 'ArrowDown') void c.rotate(0, -step, smooth)
      if (key === 'ShiftArrowLeft') void c.truck(-0.01, 0, smooth)
      if (key === 'ShiftArrowRight') void c.truck(0.01, 0, smooth)
      if (key === 'ShiftArrowUp') void c.truck(0, -0.01, smooth)
      if (key === 'ShiftArrowDown') void c.truck(0, 0.01, smooth)
      if (key === '+' || key === '=') void c.dolly(0.04, smooth)
      if (key === '-') void c.dolly(-0.04, smooth)
    }
    window.addEventListener('atlas:camera-key', onKey)
    return () => window.removeEventListener('atlas:camera-key', onKey)
  }, [])

  return (
    <CameraControls
      ref={controls}
      makeDefault
      minDistance={0.03}
      maxDistance={2.2}
      smoothTime={0.28}
      draggingSmoothTime={0.08}
      dollyToCursor
    />
  )
}
