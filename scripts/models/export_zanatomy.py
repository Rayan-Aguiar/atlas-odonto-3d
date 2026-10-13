"""Export head & neck subset of Z-Anatomy Startup.blend into per-module GLB files.

Usage: blender -b --disable-autoexec --factory-startup Startup.blend --python export.py -- OUT_DIR [--dry]
"""
import bpy, bmesh, json, re, sys, os
from mathutils import Vector
from mathutils.bvhtree import BVHTree

args = sys.argv[sys.argv.index('--') + 1:]
OUT = args[0]
DRY = '--dry' in args
os.makedirs(OUT, exist_ok=True)

SIDE = re.compile(r'\.(l|r)$')
SKIP_SUFFIX = re.compile(r'\.(j|t|g|ol|or|el|er|o\d?[lr]|e\d?[lr])$')
NUM = re.compile(r'\.\d{3}$')

CEREBRAL = re.compile(r'cerebral|cerebell|gyrus|sulcus|callos|striate|frontobasal|parietal|precentral|postcentral|'
                      r'prefrontal|pontine|temporo-occipital|insular|medial occipital artery|lateral occipital artery|'
                      r'parieto-occipital|communicating|basilar artery|spinal artery|temporal branch(es)? of middle|'
                      r'anterior temporal branch|posterior temporal branch|choroid|\?x', re.I)
MUSCLE_EXCL = re.compile(r'bursa|fascia|aponeurosis|tarsus|tendinous ring|acromi|interspinales|multifidus|spinalis colli|'
                         r'ascending part of trapezius|transverse part of trapezius', re.I)
BONE_EXCL = re.compile(r'clavicle|scapula|acromi|Vertebra T\d|Sternum|Rib|manubri', re.I)
NERVE_INCL = re.compile(r'nerve|chorda tympani|root of trigeminal|ganglion|plexus', re.I)
NERVE_EXCL = re.compile(r'nucleus|brachial|dorsal scapular|ciliary body|choroid', re.I)
JOINT_EXCL = re.compile(r'intervertebral|nucleus pulposus', re.I)

# Parts traceable to "Anatomy of the Inner Ear" (Univ. of Dundee, CC BY-NC-SA 4.0): ossicles and the
# cochlear/vestibular divisions of VIII. Excluded so the GLBs stay CC BY-SA 4.0 without a non-commercial clause.
NC_EXCL = re.compile(r'^(malleus|incus|stapes|cochlear nerve|vestibular nerve)$', re.I)

TEETH = re.compile(r'(incisor|canine|premolar|molar)', re.I)
SINUS = re.compile(r'sinus of|cells of ethmoid', re.I)


def top_system(o):
    for top in bpy.context.scene.collection.children:
        if re.match(r'^[1-9]:', top.name) and o.name in top.all_objects:
            return top.name[0]
    return None


def world_bbox(o):
    pts = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return [min(p[i] for p in pts) for i in range(3)], [max(p[i] for p in pts) for i in range(3)]


def classify(o):
    if o.type not in ('MESH', 'CURVE'):
        return None
    name = NUM.sub('', o.name)
    if NC_EXCL.match(SIDE.sub('', name)):
        return None
    if SKIP_SUFFIX.search(name):
        return None
    s = top_system(o)
    if not s:
        return None
    mn, mx = world_bbox(o)
    head_neck = mx[2] > 1.47 and mn[2] > 1.25
    base = SIDE.sub('', name)
    if s == '1':
        if mn[2] <= 1.40 or BONE_EXCL.search(base):
            return None
        if TEETH.search(base) and 'tooth' in base.lower() or re.search(r'(incisor|canine|premolar)$', base, re.I):
            return 'teeth'
        return 'bones'
    if s == '4':
        return 'muscles' if head_neck and not MUSCLE_EXCL.search(base) else None
    if s == '5':
        return 'vessels' if head_neck and not CEREBRAL.search(base) else None
    if s == '7':
        return 'nerves' if head_neck and NERVE_INCL.search(base) and not NERVE_EXCL.search(base) else None
    if s == '8':
        return 'viscera' if head_neck and not re.search(r'pineal|hypophysis', base, re.I) else None
    if s == '3':
        return 'joints' if head_neck and not JOINT_EXCL.search(base) else None
    if s == '6':
        return 'lymph' if head_neck else None
    return None


def mesh_id(orig):
    """Stable ASCII id that survives three.js PropertyBinding.sanitizeNodeName."""
    m = SIDE.search(orig)
    base = SIDE.sub('', orig)
    slug = re.sub(r'[^a-z0-9]+', '-', base.lower()).strip('-')
    return f'{slug}__{m.group(1)}' if m else slug


def to_gltf(v):
    # Blender Z-up -> glTF Y-up
    return [round(v.x, 5), round(v.z, 5), round(-v.y, 5)]


modules = {}
for o in bpy.data.objects:
    m = classify(o)
    if m:
        modules.setdefault(m, []).append(o)

# ---- landmarks (.j leader lines of skeletal system) ----
bone_objs = modules.get('bones', []) + modules.get('teeth', [])
dg = bpy.context.evaluated_depsgraph_get()
bvhs = []
for b in bone_objs:
    if b.type != 'MESH':
        continue
    bm = bmesh.new()
    bm.from_object(b, dg)
    bm.transform(b.matrix_world)
    bvhs.append((b.name, BVHTree.FromBMesh(bm)))
    bm.free()

landmarks = []
for o in bpy.data.objects:
    if o.type != 'MESH' or not o.name.endswith('.j') or top_system(o) != '1' or len(o.data.vertices) != 2:
        continue
    a, b = (o.matrix_world @ v.co for v in o.data.vertices)
    if min(a.z, b.z) <= 1.40:
        continue
    best = None
    for p in (a, b):
        for bname, t in bvhs:
            hit = t.find_nearest(p)
            if hit[0] is not None and (best is None or hit[3] < best[2]):
                best = (p, bname, hit[3])
    if best is None or best[2] > 0.012:
        continue
    landmarks.append({'name': o.name[:-2], 'position': to_gltf(best[0]), 'nearestBone': NUM.sub('', best[1]),
                      'distance': round(best[2], 4)})

summary = {}
for m, objs in sorted(modules.items()):
    verts = sum(len(o.data.vertices) for o in objs if o.type == 'MESH')
    summary[m] = {'objects': len(objs), 'meshVerts': verts,
                  'curves': sum(1 for o in objs if o.type == 'CURVE')}
print('SUMMARY', json.dumps(summary))
print('LANDMARKS', len(landmarks))
json.dump(landmarks, open(os.path.join(OUT, 'landmarks.json'), 'w'), indent=1, ensure_ascii=False)
json.dump({m: sorted([mesh_id(NUM.sub('', o.name)), NUM.sub('', o.name)] for o in objs) for m, objs in modules.items()},
          open(os.path.join(OUT, 'selection.json'), 'w'), indent=1)
if DRY:
    sys.exit(0)

# ---- export: build a fresh scene per module with evaluated mesh copies ----
MAX_VERTS = 2500
for m, objs in modules.items():
    scene = bpy.data.scenes.new('export_' + m)
    used = set()
    for o in objs:
        ev = o.evaluated_get(dg)
        try:
            me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=False, depsgraph=dg)
        except RuntimeError:
            continue
        if me is None or len(me.vertices) == 0:
            continue
        me.transform(o.matrix_world)
        orig = NUM.sub('', o.name)
        name = mesh_id(orig)
        if name in used:
            k = 2
            while f'{name}-{k}' in used:
                k += 1
            name = f'{name}-{k}'
        used.add(name)
        me.materials.clear()
        me.name = name
        ob = bpy.data.objects.new(name, me)
        ob['zanatomyName'] = orig
        scene.collection.objects.link(ob)
        if len(me.vertices) > MAX_VERTS:
            mod = ob.modifiers.new('dec', 'DECIMATE')
            mod.ratio = MAX_VERTS / len(me.vertices)
    bpy.context.window.scene = scene if bpy.context.window else None
    for ob in bpy.data.objects:
        ob.select_set(False) if ob.name in bpy.context.view_layer.objects else None
    with bpy.context.temp_override(scene=scene, view_layer=scene.view_layers[0]):
        bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, f'{m}.glb'), export_format='GLB',
                                  use_active_scene=True, export_apply=True, export_materials='NONE',
                                  export_normals=True, export_texcoords=False, export_cameras=False,
                                  export_lights=False, export_yup=True, export_extras=True)
    print('EXPORTED', m, len(used))
