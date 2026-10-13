"""Builds src/features/anatomy-catalog/data/ta2-terms.json.

Source: scripts/data/sources/TA2.csv (FIPAT Terminologia Anatomica 2nd ed. term list,
as distributed by the Z-Anatomy project, CC BY-SA 4.0). For every Z-Anatomy mesh in the
model manifest and every extra English term below, stores the TA2 id, English and Latin
terms so catalog latin names can be checked by tests.
"""
import json, re

EXTRA_TERMS = [
    # Parent / grouping structures without their own mesh
    'Masseter', 'Lateral pterygoid muscle', 'Digastric muscle', 'Orbicularis oculi muscle', 'Trigeminal ganglion',
    'Mandibular nerve', 'Thyro-arytenoid muscle', 'Temporomandibular joint', 'Palate',
    # Muscles not modelled
    'Styloglossus muscle', 'Palatoglossus muscle', 'Levator veli palatini', 'Tensor veli palatini', 'Musculus uvulae',
    # Nerves not modelled
    'Infra-orbital nerve', 'Auriculotemporal nerve', 'Nasopalatine nerve', 'Greater palatine nerve',
    'Lesser palatine nerves', 'Masseteric nerve', 'Deep temporal nerves', 'Posterior superior alveolar artery',
    'Posterior superior alveolar foramina', 'Incisive foramina',
    # Vessels not modelled
    'Lingual artery', 'Superior thyroid artery', 'Pterygoid venous plexus', 'Sphenopalatine artery',
    'Posterior auricular artery', 'Common carotid artery',
    # Openings
    'Foramen magnum', 'Foramen ovale', 'Foramen rotundum', 'Foramen spinosum', 'Foramen lacerum',
    'Carotid canal', 'Optic canal', 'Superior orbital fissure', 'Inferior orbital fissure', 'Jugular foramen',
    'Hypoglossal canal', 'Stylomastoid foramen', 'Infra-orbital foramen', 'Supra-orbital foramen',
    'Mental foramen', 'Mandibular canal', 'Incisive canals', 'Incisive fossa',
    'Greater palatine foramen', 'Lesser palatine foramina', 'Nasolacrimal canal', 'Internal acoustic meatus',
    'Pterygoid canal', 'Infra-orbital canal', 'Infra-orbital groove',
    # Bony features
    'Coronoid process of mandible', 'Condylar process', 'Mandibular notch', 'Lingula of mandible', 'Mylohyoid line',
    'Alveolar process', 'Maxillary sinus', 'Mandibular fossa', 'Articular tubercle', 'Styloid process of temporal bone',
    'Mastoid process', 'Pterygoid hamulus', 'Maxillary tuberosity', 'Ramus of mandible', 'Angle of mandible',
    'Body of mandible', 'Pterygomandibular raphe', 'Mental protuberance',
    # Dental
    'Teeth', 'Deciduous teeth', 'Permanent teeth', 'Enamel', 'Dentine', 'Cement', 'Dental pulp',
    'Periodontium', 'Crown of tooth', 'Root of tooth',
    # Other
    'Hard palate', 'Oral cavity', 'Lingual papillae',
    'Submandibular triangle', 'Carotid triangle', 'Pterygopalatine fossa', 'Infratemporal fossa',
    'Sublingual caruncle',
]

def load(path):
    rows = {}
    with open(path, encoding='utf-8-sig') as f:
        next(f)
        for line in f:
            p = line.strip().strip('"').split(';')
            if len(p) >= 6:
                rows.setdefault(p[1].strip().lower(), p)
    return rows

def candidates(name):
    b = name.lower().strip('.')
    yield b
    yield re.sub(r' muscle$', '', b)
    yield re.sub(r'^\((.*)\)$', r'\1', b)
    yield re.sub(r' \([ivx]+\)$', '', b)
    yield b.replace(' tooth', '')
    yield re.sub(r' bone$', '', b)

rows = load('scripts/data/sources/TA2.csv')
manifest = json.load(open('src/data/model-manifest.json'))
names = {re.sub(r'\.(l|r)$', '', v['source']) for meshes in manifest.values() for v in meshes.values()}
names |= set(EXTRA_TERMS)

out, missing = {}, []
for n in sorted(names):
    row = next((rows[c] for c in candidates(n) if c in rows), None)
    if row is None:
        missing.append(n)
        continue
    # Z-Anatomy marks derived terms as '<TA2 id>*<suffix>'; keep the official TA2 id separately.
    out[n] = {'ta2Id': row[0].split('*')[0], 'zanatomyId': row[0], 'en': row[1], 'la': row[2]}
json.dump(out, open('src/features/anatomy-catalog/data/ta2-terms.json', 'w'), indent=1, ensure_ascii=False)
print(len(out), 'terms;', 'missing:', missing)
