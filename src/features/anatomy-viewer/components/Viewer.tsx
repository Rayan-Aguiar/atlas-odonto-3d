import { useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Component, type ReactNode, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createSelectedMaterial, createSelectionXrayMaterial } from '@/lib/three/materials'
import { useSceneState } from '../hooks/useSceneState'
import { useViewer } from '../store'
import { CameraRig } from './CameraRig'
import { HoverLabel } from './HoverLabel'
import { modelUrl } from '../modelUrl'
import { ModelModule } from './ModelModule'
import { ViewerOverlay } from './ViewerOverlay'

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

class ModuleBoundary extends Component<{ moduleId: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    useViewer.getState().setModuleStatus(this.props.moduleId, 'error', message)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function ModuleLoading({ moduleId }: { moduleId: string }) {
  const setModuleStatus = useViewer((s) => s.setModuleStatus)
  useEffect(() => setModuleStatus(moduleId, 'loading'), [moduleId, setModuleStatus])
  return null
}

function Scene() {
  const retryNonce = useViewer((s) => s.retryNonce)
  const scene = useSceneState()
  const selectedMaterial = useMemo(() => createSelectedMaterial(), [])
  const xrayMaterial = useMemo(() => createSelectionXrayMaterial(), [])
  useEffect(
    () => () => {
      selectedMaterial.dispose()
      xrayMaterial.dispose()
    },
    [selectedMaterial, xrayMaterial],
  )
  // Modules load on demand when one of their structures becomes visible; the GLTF cache keeps them for later.
  const mounted = [...scene.modules]

  return (
    <>
      <hemisphereLight args={['#f3f1ec', '#2a3236', 1.1]} />
      <directionalLight position={[0.6, 2.4, 1.4]} intensity={1.6} />
      <directionalLight position={[-1.2, 1.2, -0.8]} intensity={0.45} />
      <CameraRig />
      {mounted.map((moduleId) => (
        <ModuleBoundary key={`${moduleId}:${retryNonce[moduleId] ?? 0}`} moduleId={moduleId}>
          <Suspense fallback={<ModuleLoading moduleId={moduleId} />}>
            <ModelModule moduleId={moduleId} display={scene.display} selectedMeshes={scene.selectedMeshes} selectedMaterial={selectedMaterial} xrayMaterial={xrayMaterial} />
          </Suspense>
        </ModuleBoundary>
      ))}
    </>
  )
}

const CAMERA_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-'])

export function Viewer() {
  const [webgl] = useState(hasWebGL)
  const [contextLost, setContextLost] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)
  const retryModule = useViewer((s) => s.retryModule)
  const moduleStatus = useViewer((s) => s.moduleStatus)
  const hovering = useViewer((s) => s.hoveredMeshId !== null)

  // A failed module is cleared from the loader cache before retrying.
  useEffect(() => {
    for (const [id, status] of Object.entries(moduleStatus)) if (status === 'error') useGLTF.clear(modelUrl(id))
  }, [moduleStatus])

  if (!webgl) {
    return (
      <div role="alert" className="grid h-full place-items-center p-6 text-center">
        <div className="max-w-sm space-y-2">
          <p className="font-specimen text-xl">Este navegador não oferece WebGL</p>
          <p className="text-ink-muted">
            O visualizador 3D precisa de WebGL. Atualize o navegador ou ative a aceleração de hardware. A pesquisa e as fichas das estruturas continuam
            disponíveis.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={wrapper}
      className={`viewer-stage relative h-full w-full touch-none select-none outline-none ${hovering ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
      tabIndex={0}
      role="application"
      aria-roledescription="visualizador 3D"
      aria-label="Modelo anatômico 3D. Arraste para girar, use a roda ou pinça para zoom e o botão direito ou dois dedos para mover. Com o foco aqui, as setas giram, Shift+setas deslocam e + ou − aproximam."
      onKeyDown={(e) => {
        const key = e.shiftKey && e.key.startsWith('Arrow') ? `Shift${e.key}` : e.key
        if (CAMERA_KEYS.has(e.key)) {
          e.preventDefault()
          window.dispatchEvent(new CustomEvent('atlas:camera-key', { detail: key }))
        }
      }}
    >
      <Canvas
        frameloop="demand"
        dpr={[1, typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches ? 1.5 : 2]}
        camera={{ fov: 35, near: 0.005, far: 20, position: [0, 1.6, 0.7] }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        // A click on empty space (R3F already ignores drags) clears the selection.
        onPointerMissed={(e) => {
          if (e.type === 'click' && useViewer.getState().selectedId) useViewer.getState().select(null)
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            setContextLost(true)
          })
          gl.domElement.addEventListener('webglcontextrestored', () => setContextLost(false))
        }}
      >
        <Scene />
      </Canvas>
      <HoverLabel container={wrapper} />
      <ViewerOverlay onRetry={retryModule} />
      {contextLost && (
        <div role="alert" className="absolute inset-0 z-(--z-canvas-overlay) grid place-items-center bg-bg/80 p-6 text-center">
          <div className="max-w-sm space-y-3">
            <p className="font-specimen text-xl">O contexto gráfico foi perdido</p>
            <p className="text-ink-muted">Isso pode acontecer quando o dispositivo libera memória de vídeo. Recarregue a página para restaurar o modelo.</p>
            <button type="button" onClick={() => window.location.reload()} className="rounded-control bg-primary px-4 py-2 font-medium text-primary-ink">
              Recarregar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
