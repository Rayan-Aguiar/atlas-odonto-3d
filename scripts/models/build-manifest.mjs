// Reads optimized GLBs in public/models and writes src/data/model-manifest.json
// (mesh ids, original Z-Anatomy names and world-space bounding boxes per module).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/core';
import { MeshoptDecoder } from 'meshoptimizer';
import { readdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const MODELS = 'public/models';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const round = (v) => v.map((x) => Math.round(x * 1e4) / 1e4);

const modules = {};
for (const file of readdirSync(MODELS).filter((f) => f.endsWith('.glb')).sort()) {
  const doc = await io.read(join(MODELS, file));
  const meshes = {};
  for (const node of doc.getRoot().listNodes()) {
    if (!node.getMesh()) continue;
    const { min, max } = getBounds(node);
    meshes[node.getName()] = { source: node.getExtras().zanatomyName ?? null, min: round(min), max: round(max) };
  }
  modules[file.replace('.glb', '')] = meshes;
}
writeFileSync('src/data/model-manifest.json', JSON.stringify(modules, null, 1));
console.log(Object.fromEntries(Object.entries(modules).map(([k, v]) => [k, Object.keys(v).length])));
