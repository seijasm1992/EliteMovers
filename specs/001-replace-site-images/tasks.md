---

description: "Task list for image selection and invisible metadata cleanup"
---

# Tasks: Selección de imágenes reales y limpieza de metadatos

**Input**: Design documents from `/specs/001-replace-site-images/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/reports.md](contracts/reports.md), [quickstart.md](quickstart.md)

**Tests**: No se generan pruebas automatizadas, porque la especificación no las pide y el proyecto no tiene scripts de pruebas. Las comprobaciones de [quickstart.md](quickstart.md) sí son obligatorias (FR-026) y aparecen como tareas.

**Organization**: Las tareas se agrupan por historia de usuario. Las historias van en orden fijo, porque FR-007 impide tocar el sitio antes de la aprobación del dueño.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario a la que pertenece (US1, US2, US3)

## Path Conventions

- **`$WORK`**: `C:\Users\SEIJAS~1\AppData\Local\Temp\claude\f61a85bb1cfd9cca\53102ddc-97b4-40f8-991f-64112727f4db\scratchpad\image-review`. Si la carpeta de esta sesión ya no existe, usar otra carpeta temporal fuera del repositorio. Nada de `$WORK` entra al repositorio.
- **`$ORIGINALS`**: `C:\Users\Seijas A\Downloads\ProverImages`. Solo lectura.
- **`$FEATURE`**: `specs/001-replace-site-images`.

## Reglas para todas las tareas

- Los originales MUST NOT modificarse, moverse, borrarse ni copiarse al repositorio (FR-008).
- Ningún informe guardado en el repositorio transcribe matrículas, direcciones, nombres ni datos de clientes; solo el tipo de elemento (FR-029).
- No se modifica `package.json` ni se ejecuta `npm install` en el proyecto. En `src/` solo se quitan referencias a archivos retirados (T041, T042, T043).
- No hay commit antes de T035 (FR-025).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar el área de trabajo y las herramientas temporales fuera del proyecto

- [X] T001 Confirmar con `git branch --show-current` que la rama es `001-replace-site-images`, y guardar el último commit y `git status --short` en `$WORK/baseline.txt`
- [X] T002 Crear `$WORK/scripts/`, `$WORK/manifests/`, `$WORK/previews/` y `$WORK/tools/`, y confirmar que `$WORK` está fuera del repositorio
- [X] T003 [P] Instalar `heic-convert` con `npm install heic-convert --ignore-scripts --prefix` en `$WORK/tools/heic/` y probarlo con un HEIC, escribiendo el resultado en `$WORK/previews/`; si falla, anotarlo en `$WORK/baseline.txt` y tratar los 28 HEIC como no compatibles (research R3)
- [X] T004 [P] Instalar `@ffmpeg-installer/ffmpeg` con `npm install --ignore-scripts --prefix` en `$WORK/tools/ffmpeg/` y comprobar que el binario responde; si falla, anotarlo en `$WORK/baseline.txt` y pedir al dueño que vea los videos en T010 (research R6)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Línea base e inventario, antes de cambiar nada (FR-014)

**⚠️ CRITICAL**: Ninguna historia empieza hasta terminar esta fase

- [X] T005 Escribir `$WORK/scripts/manifest.cjs` y generar `$WORK/manifests/originals-before.json` con ruta, tamaño y SHA-256 de todos los archivos de `$ORIGINALS`, videos incluidos; abrir los archivos solo en lectura
- [X] T006 Escribir `$WORK/scripts/audit.cjs` y generar `$WORK/manifests/public-audit-before.json`: recorrer los segmentos JPEG (APPn, COM) y los bloques WebP (EXIF, XMP, ICCP), detectar GPS, revisar `public/favicon.svg` y `public/favicon.ico`, y buscar en los videos `©xyz`, `location`, `ISO6709` y `com.apple.quicktime`, más los metadatos del contenedor si T004 funcionó. El script acepta cualquier carpeta, porque se reutiliza en T025 y T038
- [X] T007 Escribir `$WORK/scripts/image-hash.cjs` y generar `$WORK/manifests/public-before.json` con dimensiones y huella de cada imagen y video de `public/`: en JPEG, la huella cubre los datos desde el marcador SOS hasta el final; en los demás formatos, el archivo completo
- [X] T008 Crear `$FEATURE/inventory.md` con las columnas de `contracts/reports.md`, cubriendo las 41 imágenes y los 3 videos: localizar los usos en `src/`, incluidas las variantes que construyen `src/components/react/ServiceCard.tsx`, `src/components/react/ServiceModal.tsx` e `src/components/react/IncludedAccordion.tsx`, y marcar `sin uso en las páginas` donde corresponda (`HeroSlider` no tiene importaciones y hay que confirmar si se usa `hero.slides` de `src/data/hero.ts`)
- [X] T009 Revisar visualmente las imágenes públicas, usando vistas previas en `$WORK/previews/public/`, y completar en `$FEATURE/inventory.md` los señalamientos con estos tipos: `moving-shark`, `matrícula`, `dirección`, `persona identificable` o `datos de cliente`. Incluir las matrículas de `boxes-loading-ramp.jpeg` y `storage-unit-loaded.jpeg` (FR-017) y proponer `conservar`, `sustituir` o `retirar` para cada una (FR-016). Anotar también las imágenes que parezcan generadas por IA, para que el dueño las confirme en T017 (FR-031)
- [X] T010 Extraer fotogramas a `$WORK/previews/videos/` de `public/hero-slideshow.mp4`, `public/hero-slideshow.webm` y `public/images/hero/movers-hero.mp4`, revisarlos y anotar en `$FEATURE/inventory.md` si muestran Moving Shark, información privada o imágenes de la lista de retirada. No se retira ningún video ahora (FR-018)

**Checkpoint**: Inventario completo y línea base guardada; `public/` sin cambios

---

## Phase 3: User Story 1 - Dueño que elige las fotos (Priority: P1) 🎯 MVP

**Goal**: Entregar una selección razonada y dejar registrada la lista aprobada, sin fotos en el proyecto

**Independent Test**: El informe se entrega con totales, candidatas y señalamientos; `public/` no cambia y los originales coinciden con `$WORK/manifests/originals-before.json`

- [X] T011 [US1] Escribir `$WORK/scripts/review-originals.cjs` y generar `$WORK/manifests/originals-review.json` con el total de fotos, el total por subcarpeta y el estado de cada archivo (`legible`, `no compatible` o `no se pudo abrir`), ignorando los videos (FR-001, FR-002)
- [X] T012 [US1] Generar en `$WORK/previews/originals/` una vista previa reducida y sin metadatos de cada foto legible, usando `sharp` y la herramienta de T003 para los HEIC (research R5)
- [X] T013 [US1] Agrupar las fotos casi iguales con una huella visual reducida, usar la fecha de captura como apoyo y guardar los grupos en `$WORK/manifests/duplicates.json` (research R4)
- [X] T014 [US1] Revisar cada vista previa, confirmar los grupos de duplicados y elegir la mejor versión de cada uno. Guardar en `$WORK/manifests/review-notes.json` los señalamientos con los tipos de T009, más las marcas de terceros como observaciones que no bloquean (FR-005, FR-006, research R10)
- [X] T015 [US1] Elegir hasta 15 candidatas, más alternativas si una sección las necesita, y guardarlas en `$WORK/manifests/candidates.json` con ruta original, sección propuesta (orientativa), nombre descriptivo ("Minúsculas y guiones, único en la lista") y texto alternativo ("En inglés; describe solo lo que se ve"). Una foto con Moving Shark solo entra con un recorte previsto que quite la marca. No inventar ciudades, servicios, fechas ni datos de clientes (FR-003, FR-004, FR-005, FR-013)
- [X] T016 [US1] Crear la hoja de contacto local `$WORK/previews/contact-sheet.html` con las candidatas y las fotos señaladas, sin recursos externos y sin publicarla en línea (research R5)
- [X] T017 [US1] Entregar al dueño el informe de selección con el contenido de `contracts/reports.md`, indicando la ruta absoluta de la hoja de contacto y las secciones sin candidata adecuada, y pidiendo al dueño que elija la foto para compartir en redes (FR-032). **DETENERSE y esperar la aprobación (FR-007)**
- [X] T018 [US1] Tras la aprobación, crear `$FEATURE/selection.md` con las columnas de `contracts/reports.md`, solo con candidatas `aprobada` o `aprobada con recorte previsto`. Si un nombre de archivo contiene datos privados, no guardar esa ruta e indicarla aparte al dueño (FR-029, FR-030)
- [X] T044 [US1] Copiar las fotos aprobadas a `public/images/library/` con su nombre descriptivo: decodificar, aplicar la orientación, limitar el lado largo a 2048 px y guardar en JPEG optimizado sin metadatos. Los originales no se tocan (FR-008, FR-009)
- [X] T045 [US1] Revisar la segunda tanda en `C:\Users\Seijas A\Downloads\IMG` con el mismo proceso (T011–T015), comparar duplicados también con la primera tanda y entregar el informe al dueño. **DETENERSE y esperar la aprobación**
- [X] T046 [US1] Copiar las fotos aprobadas de la segunda tanda a `public/images/library/` igual que en T044, y añadirlas a `$FEATURE/selection.md`
- [X] T019 [US1] Comprobar SC-001 y SC-002: `$FEATURE/selection.md` coincide con la aprobación, todas las subcarpetas están contadas y `git status --short public/` solo muestra las copias de `public/images/library/`, porque la foto para compartir entra después, en T043. Anotar los resultados en `$WORK/manifests/checks.md`

**Checkpoint**: Lista aprobada guardada. Sin esta aprobación no empieza ninguna tarea posterior

---

## Phase 4: User Story 2 - Cliente y terceros protegidos (Priority: P1)

**Goal**: Quitar los metadatos de lo publicado y retirar los 2 archivos, sin recomprimir ninguna imagen

**Independent Test**: La auditoría de `public/` da 0 imágenes con metadatos y 0 videos con GPS; no quedan referencias a los archivos retirados

- [X] T020 [US2] Leer la descripción del perfil de color de `public/images/included/boxes-loading-ramp.jpeg` y `public/images/included/storage-unit-loaded.jpeg`, y guardarla en `$WORK/manifests/icc.json`. Si no es sRGB, comparar el resultado sin perfil e informar al dueño si el cambio se nota (research R2)
- [X] T021 [US2] Escribir `$WORK/scripts/strip-jpeg.cjs`: eliminar los segmentos APP1 a APP15 excepto APP14, y COM; conservar APP0 y APP14, sin recomprimir. Debe escribir primero a un archivo temporal y validar la estructura antes de reemplazar, y abortar si no entiende el archivo (research R1)
- [X] T022 [US2] Ejecutar `$WORK/scripts/strip-jpeg.cjs` sobre `public/images/included/boxes-loading-ramp.jpeg`, `public/images/included/storage-unit-loaded.jpeg`, `public/images/included/truck-loading-ramp.jpeg`, `public/images/included/crew-loading-wrapped-items.jpeg`, `public/images/included/wrapped-furniture-truck.jpeg` y cualquier otro JPEG con metadatos que haya detectado T006, excepto los archivos que se retiran: `public/Componente.jpg`, `public/1M.jpg`, `public/3M.jpg`, `public/4M.jpg` y los confirmados en T017
- [X] T023 [P] [US2] Eliminar `public/Componente.jpg` (FR-019)
- [X] T024 [P] [US2] Eliminar `public/ProEliteMovers · Design System.pdf` (FR-019)
- [X] T041 [US2] Eliminar `public/3M.jpg` y `public/4M.jpg`, y quitar sus entradas de `hero.slides` en `src/data/hero.ts`, tras confirmar en T008 que ninguna página usa `hero.slides` (FR-031)
- [X] T042 [US2] Para cada imagen o video confirmado como generado por IA en T017: si ninguna página lo muestra, eliminarlo de `public/` y quitar sus referencias en `src/`; si alguna lo muestra, no retirarlo e informar al dueño para que decida cómo reemplazarlo (FR-031)
- [X] T043 [US2] Procesar la foto para compartir elegida en T017: sin metadatos, sin retoques, con su nombre descriptivo y ancho máximo de 1200 px, en `public/images/social/`. Después, eliminar `public/1M.jpg`, quitar su entrada de `src/data/hero.ts` y actualizar en `src/layouts/BaseLayout.astro` la imagen por defecto y el texto de `og:image:alt`, para que coincida con lo que muestra la foto (FR-032)
- [X] T025 [US2] Ejecutar `$WORK/scripts/audit.cjs` sobre `public/` y guardar `$WORK/manifests/public-audit-after.json`. Debe dar 0 imágenes con metadatos y 0 videos con GPS (SC-003). Si aparecen en un WebP o un video, **detenerse e informar al dueño** (research R6)
- [X] T026 [US2] Buscar `Componente`, `Design System`, `1M.jpg`, `3M.jpg`, `4M.jpg` y los demás archivos retirados en todo el repositorio, excluyendo `specs/`, `node_modules/`, `dist/` y `.astro/`: debe dar 0 referencias (FR-022, SC-005)

**Checkpoint**: Limpieza hecha en local; las comprobaciones de producción quedan para la Fase final

---

## Phase 5: User Story 3 - Visitante que usa el sitio (Priority: P2)

**Goal**: Demostrar que el sitio se ve igual después de la limpieza

**Independent Test**: Las huellas coinciden, el build funciona y el dueño no ve cambios en móvil ni en escritorio

- [X] T027 [US3] Regenerar con `$WORK/scripts/image-hash.cjs` el archivo `$WORK/manifests/public-after.json` y compararlo con `$WORK/manifests/public-before.json`: mismas dimensiones y huellas en todos los archivos, salvo los retirados (FR-028, SC-010)
- [X] T028 [P] [US3] Ejecutar `npm run astro -- check` y anotar el resultado en `$WORK/manifests/checks.md`, distinguiendo los errores previos de los nuevos (SC-007)
- [X] T029 [P] [US3] Ejecutar `npm run build`, confirmando antes que `PUBLIC_TURNSTILE_SITE_KEY` existe en `.env`, y anotar el resultado en `$WORK/manifests/checks.md` (SC-007)
- [X] T030 [US3] Comprobar que cada imagen referenciada en `src/`, incluidas sus variantes `-480`, `-720`, `-960` y las de respaldo `.jpg`, exista en `dist/`, y anotar los faltantes en `$WORK/manifests/checks.md`: debe dar 0 (SC-007)
- [ ] T031 [US3] Pedir al dueño que abra todas las páginas con `npm run preview`, en móvil y escritorio, y anotar en `$WORK/manifests/checks.md` si hay imágenes rotas o cambios visibles (SC-007, SC-010)

**Checkpoint**: Sitio comprobado en local

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Entrega, revisión del dueño y comprobación en producción

- [X] T032 Regenerar el manifiesto de `$ORIGINALS` en `$WORK/manifests/originals-after.json` y compararlo con `$WORK/manifests/originals-before.json`: misma cantidad de archivos y mismas huellas (SC-008)
- [X] T033 Crear `$FEATURE/verification.md` con las columnas de `contracts/reports.md` y una fila por cada criterio de SC-001 a SC-010; SC-006 queda `pendiente` (FR-026)
- [X] T034 Entregar al dueño `$FEATURE/verification.md` y el resultado de `git status`. **DETENERSE y esperar su visto bueno (FR-025)**
- [X] T035 Tras el visto bueno, hacer el commit incluyendo solo los cambios de `public/`, `src/data/hero.ts`, `src/layouts/BaseLayout.astro`, otras referencias quitadas en T042 y `$FEATURE/`. Dejar fuera `.claude/`, `.kiro/`, `.windsurf/`, `.specify/`, `CLAUDE.md` y `skills-lock.json`, salvo que el dueño pida incluirlos
- [ ] T036 Avisar al dueño de que puede publicar. **DETENERSE hasta que avise que publicó (FR-027)**. No publicar por cuenta propia
- [ ] T037 Solicitar `/Componente.jpg`, `/ProEliteMovers%20%C2%B7%20Design%20System.pdf`, `/1M.jpg`, `/3M.jpg`, `/4M.jpg` y las URLs de los demás archivos retirados en `proelitemovers.com` y `www.proelitemovers.com`, y anotar en `$FEATURE/verification.md` que ya no entregan el archivo; un 404 es válido (FR-023, SC-006)
- [ ] T038 Descargar a `$WORK/production/` las imágenes públicas listadas en `$FEATURE/inventory.md` y ejecutar `$WORK/scripts/audit.cjs` sobre esa carpeta: debe dar 0 con GPS. Si responde una copia antigua, repetir T037 y T038 cuando se limpie la caché o caduque (SC-006)
- [ ] T039 Completar `$FEATURE/verification.md` con los 10 criterios y entregar el resultado al dueño. Si el archivo cambia después del commit, consultar antes de hacer otro (SC-009)
- [ ] T040 Borrar `$WORK/previews/` y `$WORK/production/`, porque contienen vistas previas de fotos privadas, después de confirmar que `$FEATURE/selection.md` está completo

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: Sin dependencias
- **Foundational (Fase 2)**: Depende de Setup y bloquea todas las historias
- **US1 (Fase 3)**: Depende de Foundational
- **US2 (Fase 4)**: Depende de la aprobación del dueño en T017, por FR-007
- **US3 (Fase 5)**: Depende de US2, porque comprueba su resultado
- **Polish (Fase 6)**: Depende de todas las historias

### User Story Dependencies

- **US1**: Se puede entregar sola; es el MVP
- **US2**: No usa la lista aprobada, pero FR-007 exige esperar la aprobación
- **US3**: Solo tiene sentido después de US2

### Paradas obligatorias del dueño

| Tarea | Qué se espera |
|-------|---------------|
| T017 | Aprobación de la selección |
| T031 | Revisión visual en móvil y escritorio |
| T034 | Visto bueno para el commit |
| T036 | Aviso de que publicó |

### Parallel Opportunities

- T003 y T004: herramientas temporales independientes
- T023 y T024: archivos distintos
- T028 y T029: comprobaciones de solo lectura sobre el código

---

## Parallel Example: User Story 2

```text
Task: "Eliminar public/Componente.jpg"
Task: "Eliminar public/ProEliteMovers · Design System.pdf"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar las Fases 1 y 2.
2. Completar la Fase 3 hasta T019.
3. **Validar**: el dueño tiene su lista aprobada y el sitio no cambió.

### Incremental Delivery

1. US1 entrega la lista aprobada para el montaje posterior.
2. US2 elimina el GPS de lo publicado y retira los 2 archivos.
3. US3 demuestra que el sitio se ve igual.
4. La Fase 6 lleva el resultado a producción, a cargo del dueño, y lo comprueba.

---

## Notes

- T041 a T043 se añadieron después de generar la lista y van antes de T025; conservan esos números para no alterar las referencias existentes.
- Sustituir las fotos que se muestran en las páginas queda para el montaje posterior ([spec.md](spec.md), Assumptions).
- Moving Shark sigue visible hasta entonces; este trabajo solo lo señala (SC-004).
- Este trabajo no limpia el historial público de Git.
