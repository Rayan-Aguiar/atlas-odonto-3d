// @vitest-environment node
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptDecoder } from 'meshoptimizer'
import { existsSync, statSync } from 'node:fs'
import { beforeAll, describe, expect, it } from 'vitest'
import { MESH_OWNER } from '@/features/anatomy-catalog/catalog'
import { MODEL_MANIFEST } from '@/features/anatomy-catalog/data/build'

const nodeNames = new Map<string, string[]>()

beforeAll(async () => {
  await MeshoptDecoder.ready
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder })
  for (const moduleId of Object.keys(MODEL_MANIFEST)) {
    const doc = await io.read(`public/models/${moduleId}.glb`)
    nodeNames.set(
      moduleId,
      doc
        .getRoot()
        .listNodes()
        .filter((n) => n.getMesh())
        .map((n) => n.getName()),
    )
  }
}, 60_000)

describe('modelos GLB servidos', () => {
  it('todo módulo do manifesto existe em public/models e cabe no orçamento de rede', () => {
    for (const moduleId of Object.keys(MODEL_MANIFEST)) {
      const path = `public/models/${moduleId}.glb`
      expect(existsSync(path), path).toBe(true)
      expect(statSync(path).size).toBeLessThan(2_500_000)
    }
  })

  it('os nós dos GLB correspondem exatamente ao manifesto', () => {
    for (const [moduleId, meshes] of Object.entries(MODEL_MANIFEST)) {
      expect([...(nodeNames.get(moduleId) ?? [])].sort()).toEqual(Object.keys(meshes).sort())
    }
  })

  it('toda malha carregável pertence a um registro anatômico', () => {
    for (const names of nodeNames.values()) for (const n of names) expect(MESH_OWNER.has(n), n).toBe(true)
  })

  it('os ids das malhas sobrevivem à sanitização de nomes do three.js', () => {
    // three.js PropertyBinding.sanitizeNodeName removes [ ] . : / and turns whitespace into "_".
    for (const names of nodeNames.values()) for (const n of names) expect(n).toMatch(/^[a-z0-9_-]+$/)
  })
})
