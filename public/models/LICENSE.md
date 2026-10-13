# Licença dos modelos 3D

Os arquivos `*.glb` deste diretório são uma **obra derivada** (subconjunto de cabeça e pescoço, malhas convertidas, renomeadas, simplificadas e comprimidas com meshopt) de:

- **Z-Anatomy — The libre 3D atlas of anatomy** (Startup.blend), por Gauthier Kervyn, Marcin Zielinski, Lluis Vinent et al. — CC BY-SA 4.0 — https://github.com/Z-Anatomy/Models-of-human-anatomy
- que inclui e adapta **BodyParts3D, © The Database Center for Life Science** — atualmente CC BY 4.0 (https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html; o Z-Anatomy cita a licença original CC BY-SA 2.1 Japão)
- e, segundo o Z-Anatomy, referências adaptadas de "Cranial Nerves and Foramina — University of Dundee, CAHID" (CC BY 4.0).

Componentes do Z-Anatomy com licença não comercial **não** foram incluídos: rim (CC BY-NC 4.0) e o conteúdo de "Anatomy of the Inner Ear — University of Dundee School of Medicine" (CC BY-NC-SA 4.0). Este último cobre labirinto ósseo, membrana timpânica, ossículos e o sistema vestibular (https://www.dundee.ac.uk/tilt/medical-illustration/anatomy-inner-ear). Por isso, ficaram fora da exportação: cóclea, vestíbulo e canais semicirculares, membrana timpânica, martelo, bigorna, estribo e os nervos coclear e vestibular. O filtro `NC_EXCL` de `scripts/models/export_zanatomy.py` garante essa exclusão em novas exportações.

Estes arquivos são distribuídos sob a mesma licença: **Creative Commons Attribution-ShareAlike 4.0 International** — https://creativecommons.org/licenses/by-sa/4.0/

Data da extração: 2026-10-13. Script: `scripts/models/export_zanatomy.py`.
