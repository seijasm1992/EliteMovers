---

description: "Lista de tareas: revisión de imágenes y reemplazo de las que tengan rastros de Moving Shark"
---

# Tasks: Revisión de imágenes y reemplazo de las que tengan rastros de Moving Shark

**Input**: Documentos de diseño en `specs/006-remove-moving-shark-images/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/review-table.md](contracts/review-table.md), [quickstart.md](quickstart.md)

**Tests**: La spec no pide pruebas automáticas y el proyecto no tiene scripts de pruebas. La validación son las comprobaciones de [quickstart.md](quickstart.md).

**Organization**: Por historia de usuario. US2 (tabla aprobada) va antes que US1 aunque las dos son P1, porque FR-004 prohíbe cualquier cambio sin aprobación.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario (US1, US2, US3)
- `$TOOLS`: carpeta temporal fuera del repositorio para scripts, vistas previas y fotogramas (R8). Nada de `$TOOLS` se sube al repositorio.

## Reglas para todas las tareas

- Ninguna tarea de las fases 4, 5 y 6 se empieza sin la aprobación registrada en `review.md` (T020).
- Las tareas condicionadas ("si la tabla aprobada dice…") se marcan como hechas con la nota "no aplica" cuando la tabla no lo pide.
- La tabla nunca transcribe el valor de un dato privado, solo su tipo (contrato, "Reglas generales").
- No se retoca ninguna foto para tapar marcas, ni se genera ninguna imagen (FR-009).

---

## Phase 1: Setup

**Purpose**: Rama de trabajo y herramientas de un solo uso, fuera del proyecto.

- [X] T001 Crear la rama `006-remove-moving-shark-images` desde `master` sin incluir los archivos sin seguimiento ajenos a esta feature (`.claude/`, `.kiro/`, `.windsurf/`, `src/bugs/`, `skills-lock.json`)
- [X] T002 [P] Crear `$TOOLS` e instalar allí `@ffmpeg-installer/ffmpeg` (`npm init -y && npm install @ffmpeg-installer/ffmpeg`), sin tocar el `package.json` del proyecto (research.md, R4)
- [X] T003 [P] Comprobar que `sharp` del proyecto carga desde un script en `$TOOLS` (importándolo por ruta absoluta a `node_modules/sharp`) y anotar su versión en `specs/006-remove-moving-shark-images/verification.md`

---

## Phase 2: Foundational (inventario)

**Purpose**: Saber qué archivos hay, cuáles se usan y dónde. Lo necesitan todas las historias.

**⚠️ CRITICAL**: Ninguna historia empieza sin esta fase.

- [X] T004 Escribir `$TOOLS/inventory.mjs`: lista todos los archivos de imagen y video de `public/` (58 imágenes y 3 videos esperados) y los agrupa por foto (`group`: variantes `-480`, `-720`, `-960` y respaldos `.jpg`/`.jpeg` del mismo nombre base), según data-model.md, "Archivo revisado"
- [X] T005 Rastrear el uso real desde `src/pages/` (`index.astro`, `about-us.astro`, `get-a-quote.astro`, `privacy-policy.astro`) siguiendo los componentes renderizados, y anotar `usedIn` (página › sección) y `referencedBy` para cada grupo. Incluir las variantes que construyen por código `src/components/react/IncludedAccordion.tsx`, `ServiceCard.tsx` y `ServiceModal.tsx`, la precarga y la og:image de `src/layouts/BaseLayout.astro`, y marcar como **sin uso** `/2M.jpg` (`hero.slides` en `src/data/hero.ts`, no se renderiza) y `hero-slideshow.*` (`src/components/react/HeroSlider.tsx`, no se importa) (research.md, R1)
- [X] T006 Ejecutar `npm run build` y extraer de `dist/` todas las rutas de imagen y video (HTML, `srcset`, `imagesrcset`, `og:image`, bundles JS) para confirmar el `inUse` de T005. Anotar cualquier discrepancia en `specs/006-remove-moving-shark-images/verification.md`
- [X] T007 [P] Escribir y ejecutar `$TOOLS/metadata.mjs` con `sharp`: para cada imagen, registrar `metadata` como `none` | `exif` | `xmp` | `icc` | `gps`; para cada video, buscar en el contenedor `©xyz`, `location`, `ISO6709` y `com.apple.quicktime`, y con ffmpeg (`-f ffmetadata`) volcar sus metadatos (research.md, R2)

**Checkpoint**: Inventario completo, con uso y metadatos de cada grupo.

---

## Phase 3: User Story 2 - Dueño que aprueba la revisión antes de cualquier cambio (Priority: P1)

**Goal**: Entregar `review.md` con todos los archivos de `public/` y obtener la aprobación del dueño.

**Independent Test**: `review.md` incluye cada archivo de imagen y video de `public/` con estado y acción, y `git status` no muestra cambios en `public/` ni en `src/` hasta que el dueño aprueba.

### Revisión

- [X] T008 [P] [US2] Generar en `$TOOLS/previews/` vistas previas sin metadatos de una variante por grupo (la de mayor tamaño) y una hoja de contacto local `$TOOLS/contact-sheet.html` con la ruta de cada foto (research.md, R3)
- [X] T009 [P] [US2] Extraer con ffmpeg un fotograma por segundo de `public/images/hero/movers-hero.mp4`, `public/hero-slideshow.mp4` y `public/hero-slideshow.webm` en `$TOOLS/frames/<video>/`, anotar la duración de cada video y añadir los fotogramas a una hoja de contacto `$TOOLS/frames.html`. Si ffmpeg falla, anotarlo para que el dueño vea los videos completos (research.md, R4)
- [X] T010 [US2] Revisar a tamaño completo cada grupo de imágenes en `public/` **excepto las 18 fotos de `public/images/library/`, ya aprobadas en la spec 001, que se registran como "Cumple (revisada en 001)" sin revisión visual** (incluidas `public/images/brand/proelite-movers-logo.webp`, `public/favicon.svg`, `public/favicon.ico` y `public/images/social/green-wrapped-furniture-truck.jpg`). Comprobar en este orden los motivos `moving-shark` (cualquier rastro, también parcial o pequeño), `otro-telefono` (distinto de +1 (786) 281-7825), `logo-añadido`, `apariencia-ia` (texto deformado, manos o caras deformes, geometría imposible, texturas demasiado lisas), `matricula`, `numero-casa`, `cliente-identificable` (los empleados de ProElite Movers no cuentan) y `gps`. Anotar `shows` y asignar `status`: `cumple` | `no cumple` | `dudosa` (spec FR-003; research.md, R3)
- [X] T011 [US2] Revisar todos los fotogramas de T009 con los mismos criterios y registrar para cada video el segundo y el motivo de cada escena que no cumple. Si alguna escena no cumple, la acción del video es `Eliminar` (sin uso) o retirada del hero con imagen fija (en uso) (FR-012)
- [X] T012 [P] [US2] Buscar sin distinguir mayúsculas `shark`, `984-9218`, `9849218`, `984 9218` y `407` en `src/`, `public/` (nombres de archivo, contenido de `favicon.svg`, metadatos de T007), `astro.config.mjs`, `wrangler.jsonc`, `package.json`, `.env.example` y `dist/`. Registrar cada coincidencia con `location`, `match`, `refersToOldCompany` (si es `no`, explicar: hash, medida, color) y `action` (research.md, R6)
- [X] T013 [US2] Asignar a cada grupo una `action`: `conservar` | `reemplazar` | `eliminar` | `limpiar metadatos` | `convertir a WebP`, con estas reglas de data-model.md: "`reemplazar` solo si `inUse = sí`; `eliminar` si `inUse = no` y `status = no cumple` (FR-008a), o si `format` no es WebP/AVIF y ya existen sus variantes WebP; `convertir a WebP` si cumple, `format` no es WebP/AVIF y hace falta conservarla (FR-014)". Aplicar la tabla de research.md, R5a, a los 28 JPG/JPEG. Un grupo que cumple a la vista pero tiene metadatos queda en `limpiar metadatos`. Para `favicon.ico`, proponer "Conservar" y preguntar en la tabla si el dueño prefiere eliminarlo

### Propuesta de reemplazos

- [X] T014 [US2] Para cada grupo con `action = reemplazar`, elegir una candidata entre los archivos de `public/images/` con `status = cumple` que encaje con el contenido de la sección. Comprobar FR-006 por página (home: Hero → Servicios → Incluidos; About: Hero → Story): no repetir una foto en la misma página. Si no queda ninguna conforme sin repetir, repetir una y marcar `repeated = sí` con la sección donde ya se usa (research.md, R10)
- [X] T015 [US2] Para cada reemplazo, definir `newBase` (nombre descriptivo nuevo en la carpeta de la sección), el recorte (hero e Incluidos 3:4 vertical, Servicios 4:3 horizontal, og:image 1200×630), las variantes según research.md, R5, y un texto alternativo en inglés fiel a lo que muestra el recorte. Comprobar con una vista previa en `$TOOLS/crops/` que el recorte no se usa para ocultar ninguna marca (FR-009)
- [X] T016 [US2] Si la tabla propone retirar `public/images/hero/movers-hero.mp4`, anotar en la sección "Código afectado" el `<video>`, `videoEnabled` y los efectos asociados de `src/components/react/HeroQuoteExperience.tsx`. Si propone eliminar `hero-slideshow.*`, preguntar en la tabla si se borra `src/components/react/HeroSlider.tsx` (research.md, R9)

### Entrega y aprobación

- [X] T017 [US2] Escribir `specs/006-remove-moving-shark-images/review.md` con las 6 secciones de [contracts/review-table.md](contracts/review-table.md): Resumen, Archivos, Videos, Reemplazos, Menciones de texto y Código afectado. Una fila por grupo, columna "Aprobado" vacía
- [X] T018 [US2] Comprobar que `review.md` cubre el 100 % de los archivos de T004 (SC-001), que cada fila con estado distinto de `cumple` tiene motivos, que ningún valor privado aparece transcrito y que `git status` no muestra cambios en `public/` ni en `src/`
- [X] T019 [US2] Entregar al dueño `review.md` y las hojas de contacto locales (`$TOOLS/contact-sheet.html`, `$TOOLS/frames.html`, `$TOOLS/crops/`). **PARADA**: esperar su respuesta
- [X] T020 [US2] Registrar las respuestas del dueño en la columna "Aprobado" de `review.md`, resolver cada `dudosa` según su decisión, y añadir la línea `Aprobado por el dueño el AAAA-MM-DD`. Si rechaza un reemplazo, volver a T014 para esa fila y pedir de nuevo la aprobación

**Checkpoint**: `review.md` aprobado. A partir de aquí se puede tocar `public/` y `src/`.

---

## Phase 4: User Story 1 - Cliente que solo ve fotos reales de ProElite Movers (Priority: P1) 🎯 MVP

**Goal**: Ninguna imagen visible ni la og:image incumple FR-003, y cada sección sigue teniendo imagen.

**Independent Test**: Abrir las 4 páginas en móvil y escritorio, y compartir un enlace: ninguna imagen muestra Moving Shark, otro teléfono, un logo añadido ni apariencia de IA; no hay imágenes rotas (quickstart.md, pasos 4–7 y 9a).

### Generar y convertir imágenes (solo WebP)

- [X] T021 [US1] Escribir `$TOOLS/generate.mjs` con `sharp`: recibe la foto de origen, el recorte, el nombre base y las variantes, y genera solo archivos `.webp` sin llamar a `withMetadata()`. Calidad 78–82 para las variantes de sección y 90 para la conversión de la biblioteca (research.md, R5 y R5a). No genera ningún JPEG ni PNG (FR-014)
- [X] T022 [P] [US1] Si la tabla aprobada reemplaza el hero: generar `-480.webp` (480×640) y `-720.webp` (720×960) en `public/images/hero/`
- [X] T023 [P] [US1] Si la tabla aprobada reemplaza fotos de Incluidos o la foto de Story de About: generar `-480.webp`, `-720.webp` y `-960.webp` (3:4) en `public/images/included/` por cada foto
- [X] T024 [P] [US1] Si la tabla aprobada reemplaza fotos de Servicios: generar `-480.webp` (480×360), `-720.webp` (720×540) y `.webp` (960×720) en `public/` por cada servicio
- [X] T025 [P] [US1] Generar la og:image en WebP de 1200×630 en `public/images/social/`, a partir de la foto actual o del reemplazo que apruebe la tabla
- [X] T026 [P] [US1] Convertir las 18 fotos de `public/images/library/*.jpg` a `.webp` del mismo tamaño (calidad 90, sin metadatos), con el mismo nombre base, en `public/images/library/` (research.md, R5a). Las que la tabla marque como no conformes no se convierten: se eliminan en T037
- [X] T027 [P] [US1] Si la tabla aprobada dice `limpiar metadatos` en algún grupo WebP: volver a guardarlo sin metadatos y comprobar que conserva dimensiones y orientación
- [X] T028 [US1] Comprobar con `$TOOLS/metadata.mjs` que todos los archivos de T022–T027 son WebP, tienen `metadata = none` y pesan lo mismo o menos que el archivo que sustituyen. Anotar el resultado en `specs/006-remove-moving-shark-images/verification.md`

### Cambiar las rutas y quitar los JPEG del código

- [X] T029 [US1] Si cambió el hero: actualizar la ruta y el `srcSet` de la imagen en `src/components/react/HeroQuoteExperience.tsx`, la precarga (`href` e `imagesrcset`) en `src/layouts/BaseLayout.astro` y `hero.image` (`src480`, `src720`, `alt`) en `src/data/aboutUs.ts`
- [X] T030 [P] [US1] En `src/data/includedServices.ts`, cambiar el `image` de los 5 ítems al nombre base con `.webp` (por ejemplo `/images/included/wrapped-furniture-truck.webp`) y, si la tabla reemplazó alguna foto, su nueva ruta e `imageAlt`. Si la foto nueva de `truck-loading-ramp` tiene `-960`, o la sustituta de otra foto no lo tiene, ajustar la lista de anchos de `responsiveImage` en `src/components/react/IncludedAccordion.tsx`
- [X] T031 [US1] En `src/data/aboutUs.ts`, cambiar `story.cards[how-we-think].image.src` de `/images/included/crew-loading-wrapped-items.jpeg` a su variante `-720.webp` (o a la del reemplazo aprobado) y ajustar `alt` si cambió la foto. Hacerlo después de T029, que toca el mismo archivo
- [X] T032 [P] [US1] Si cambiaron fotos de Servicios: actualizar `image` e `imageAlt` en `src/data/movingServices.ts`
- [X] T033 [US1] En `src/layouts/BaseLayout.astro`, cambiar el valor por defecto de `image` a la og:image `.webp` de T025 y actualizar `og:image:alt` si cambió la foto. Hacerlo después de T029, que toca el mismo archivo
- [X] T034 [P] [US1] En `src/components/react/ServiceCard.tsx` y `src/components/react/ServiceModal.tsx`, quitar `fallbackImage` (que pide `.jpg`) y hacer que el `<img>` use `service.image` (WebP de 960), cambiando el menor número de líneas posible (research.md, R5). Ejecutar `npm run astro -- check`

### Videos

- [X] T035 [US1] Si la tabla aprobada retira `movers-hero.mp4`: quitar de `src/components/react/HeroQuoteExperience.tsx` el elemento `<video>`, el estado `videoEnabled`, el `videoRef` y los `useEffect` que solo sirven al video, dejando la imagen fija del hero intacta. Ejecutar `npm run astro -- check`

### Retirar y eliminar

- [X] T036 [US1] Quitar las referencias muertas aprobadas: si se elimina `/2M.jpg`, vaciar o quitar `hero.slides` en `src/data/hero.ts` y ajustar `HeroContent` en `src/types/content.ts` si el campo deja de existir; si se eliminan `hero-slideshow.*` y el dueño aprobó borrar `src/components/react/HeroSlider.tsx`, borrarlo (research.md, R9)
- [X] T037 [US1] Eliminar de `public/`: los archivos con acción `Eliminar`, los sustituidos por un reemplazo, todos los JPG/JPEG que quedan tras T026 (18 `library/*.jpg`, 5 `included/*.jpeg`, 3 `service-*.jpg`, `social/green-wrapped-furniture-truck.jpg`, `2M.jpg`, `hero-slideshow-poster.jpg`) y `favicon.ico` solo si el dueño lo aprobó. Antes de borrar cada uno, buscar su nombre en `src/` y, tras `npm run build`, en `dist/`; si hay alguna coincidencia, corregir la referencia primero (FR-008, FR-008a, FR-014). Guardar la lista de URLs eliminadas para T047

**Checkpoint**: Ninguna imagen ni video que no cumple sigue en `public/`, no queda ninguna imagen que no sea WebP (salvo el favicon) y todas las secciones tienen imagen.

---

## Phase 5: User Story 3 - Visitante protegido por un sitio sin restos de la empresa anterior (Priority: P2)

**Goal**: El texto, el código y los metadatos no mencionan Moving Shark ni el 407.

**Independent Test**: La búsqueda del paso 8 de quickstart.md devuelve 0 coincidencias de `shark` y del teléfono, y las de `407` restantes están justificadas en `review.md`.

- [X] T038 [US3] Aplicar cada acción aprobada de la sección "Menciones de texto" de `review.md` (`eliminar` o `corregir`) en el archivo y la línea indicados. Si la sección dice "Sin coincidencias", marcar como "no aplica"
- [X] T039 [US3] Ejecutar `npm run build` y repetir la búsqueda de T012 sobre `src/`, `public/` y `dist/`. Anotar en `specs/006-remove-moving-shark-images/verification.md` las coincidencias de `407` que queden y la justificación de cada una

**Checkpoint**: Sin menciones de la empresa anterior.

---

## Phase 6: Polish & Verification

**Purpose**: Comprobaciones finales de [quickstart.md](quickstart.md) y entrega.

- [X] T040 Ejecutar `npm run astro -- check` y `npm run build`; ambos sin errores (SC-006)
- [X] T041 Escribir y ejecutar `$TOOLS/check-routes.mjs` sobre `dist/`: cada ruta de imagen o video del HTML, de `srcset`, de `imagesrcset`, de `og:image` y de los bundles JS existe en `dist/`, incluidas las variantes `-480`, `-720` y `-960` que construyen los componentes (research.md, R7). Esperado: 0 rutas sin archivo
- [X] T042 Con `npm run preview`, abrir `/`, `/about-us/`, `/get-a-quote/` y `/privacy-policy/` a 390 px y 1440 px, abrir cada acordeón de Incluidos y cada modal de servicio, y confirmar 0 peticiones de imagen o video fallidas y ninguna sección sin imagen (FR-007, FR-011, SC-003, SC-007)
- [X] T043 Repetir la revisión visual de T010 sobre los archivos nuevos o reemplazados de `public/`: todos `cumple` (SC-001a, SC-004)
- [X] T044 Ejecutar las búsquedas del paso 9a de [quickstart.md](quickstart.md): 0 archivos JPG/JPEG/PNG/GIF/HEIC en el repositorio y en `dist/`, y 0 rutas a esos formatos en `src/` y `dist/` (FR-014, SC-009)
- [X] T045 Completar `specs/006-remove-moving-shark-images/verification.md` con el resultado de los pasos 1–9a de [quickstart.md](quickstart.md) (el paso 10 se completa en T047)
- [ ] T046 Entregar al dueño el resumen de cambios para su revisión visual. Tras su visto bueno, hacer el commit en la rama `006-remove-moving-shark-images` añadiendo solo las rutas de la feature (`public/`, `src/`, `specs/006-remove-moving-shark-images/`), nunca con `git add -A`, y sin nada de `$TOOLS`; el dueño publica por su cuenta y avisa
- [ ] T047 Cuando el dueño avise de que publicó, solicitar cada URL eliminada (lista de T037) en `https://proelitemovers.com` y `https://www.proelitemovers.com`, y confirmar que ninguna devuelve el archivo. Si alguna responde desde la caché, anotarlo, pedir al dueño que purgue la caché de Cloudflare y repetir. Anotar el resultado en `specs/006-remove-moving-shark-images/verification.md` (FR-013, SC-008)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup. Bloquea todas las historias.
- **US2 (Phase 3)**: depende de Foundational. **Bloquea US1 y US3** por FR-004 (T020).
- **US1 (Phase 4)**: depende de T020.
- **US3 (Phase 5)**: depende de T020. Puede hacerse en paralelo con US1, salvo T039, que debe ir después de T037 para buscar sobre el build final.
- **Polish (Phase 6)**: depende de US1 y US3.

### Within Each Story

- US2: T008, T009 y T012 en paralelo → T010 y T011 → T013 → T014 → T015 → T016 → T017 → T018 → T019 → T020.
- US1: T021 → T022–T027 en paralelo → T028 → T029 → T030–T034 (T031 y T033 después de T029) → T035 → T036 → T037.
- US3: T038 → T039.

### Parallel Opportunities

- T002 y T003 en Setup.
- T007 con T004–T006.
- T008, T009 y T012 al empezar US2.
- T022–T027: carpetas o archivos de salida distintos.
- T030, T032 y T034: archivos distintos.

---

## Parallel Example: User Story 1

```bash
# Tras T021, generar y convertir a la vez:
Task: "Generar variantes del hero en public/images/hero/"
Task: "Generar variantes de Incluidos en public/images/included/"
Task: "Generar variantes de Servicios en public/"
Task: "Generar la og:image .webp en public/images/social/"
Task: "Convertir public/images/library/*.jpg a .webp"

# Después de T029, cambiar las rutas en archivos distintos:
Task: "Actualizar src/data/includedServices.ts"
Task: "Actualizar src/data/movingServices.ts"
Task: "Quitar el respaldo .jpg en ServiceCard.tsx y ServiceModal.tsx"
```

---

## Implementation Strategy

### MVP

1. Phase 1 y Phase 2.
2. Phase 3 (US2) hasta T020: tabla aprobada. Es el primer entregable y no cambia el sitio.
3. Phase 4 (US1): reemplazos y retiradas. **Validar** con quickstart.md, pasos 4–7.
4. El MVP es US2 + US1: el cliente ya no ve nada de Moving Shark.

### Incremental Delivery

1. Tabla aprobada (US2) → el dueño ya sabe qué hay y qué cambia.
2. Imágenes conformes (US1) → validar → revisión del dueño.
3. Texto sin menciones (US3) → validar.
4. Phase 6 → commit tras el visto bueno del dueño.

---

## Notes

- Nada de `$TOOLS` entra en el repositorio, y `package.json` no cambia.
- El commit se hace solo tras el visto bueno del dueño (T046).
- Si en T010 aparece un archivo que no encaja en ningún grupo o una sección que no estaba en el inventario, se añade a `review.md` antes de pedir la aprobación.
