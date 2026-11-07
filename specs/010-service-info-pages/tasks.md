---

description: "Task list for 010-service-info-pages"
---

# Tasks: Páginas informativas para cada servicio del menú "Services"

**Input**: Design documents from `/specs/010-service-info-pages/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Tests**: La spec no pide pruebas automatizadas y el proyecto no tiene scripts de pruebas. La validación se hace con [quickstart.md](quickstart.md), `npm run astro -- check`, `npm run build` y revisando el HTML generado en `dist/client/`.

**Organization**: Tareas agrupadas por historia de usuario (US1–US4 de la spec). El contenido de las 5 páginas va en la fase fundacional porque lo usan US1 (páginas) y US2 (menú). US3 y US4 son revisiones del contenido ya cargado.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede hacer en paralelo (otro archivo, sin depender de tareas pendientes)
- **[Story]**: Historia de usuario a la que pertenece (US1–US4)

## Reglas que aplican a todas las tareas

- No tocar `src/pages/index.astro`, `src/components/sections/`, `src/components/service-page/`, `src/components/layout/`, `src/layouts/BaseLayout.astro`, `src/data/movingServicePages.ts` ni las fotos de Moving en `public/images/services/`.
- Sin botones, montos en USD, calificaciones, reseñas, preguntas frecuentes, listas de "qué incluye" ni marcadores de pendiente en las páginas ni en el schema.
- Todo texto visible sale de [contracts/page-content.md](contracts/page-content.md); no se agregan afirmaciones sin fuente.
- Sin JavaScript nuevo en el cliente. `let` solo si se reasigna; nunca `var`.

---

## Phase 1: Setup

**Purpose**: Rama y fotos

- [X] T001 Crear la rama `010-service-info-pages` desde `master` con `git checkout -b 010-service-info-pages` (sin commitear los archivos sin seguimiento que ya existían: `.claude/`, `.kiro/`, `.windsurf/`, `src/bugs/`, `skills-lock.json`).
- [X] T002 Mirar con la herramienta Read las 5 fotos candidatas de [research.md](research.md) R4 en `public/images/library/` (`stacked-boxes-hand-truck-moving-truck.webp`, `wrapped-dresser-storage-bins-truck.webp`, `padded-wrapped-furniture-truck.webp`, `wrapped-doors-moving-truck.webp`, `trailer-boxes-pallet-jack.webp`). Confirmar o reemplazar cada una por otra foto no usada de `library/`, descartando `storage-unit-*`, `warehouse-*`, las 6 usadas por Moving y fotos con marcas de otras mudanzas o personas identificables. Escribir un alt descriptivo en inglés de lo que muestra cada foto. Agregar al final de `specs/010-service-info-pages/research.md` una sección "Imágenes elegidas" con la tabla Página | Foto | Alt.
- [X] T003 Generar las fotos con un script de un solo uso en el scratchpad (no se versiona) que use `sharp` de `node_modules`: para cada página, recortar la foto elegida en T002 a 4:3 (elegir la zona con el sujeto, como en la spec 007) y exportar WebP sin metadatos de 480×360, 720×540 y 960×720 a `public/images/services/<slug>-480.webp`, `-720.webp` y `-960.webp`, con slugs `packing-services`, `installation`, `high-value-items`, `furniture-protection`, `move-coordination`. Ajustar la calidad para que cada archivo de 720 px pese ≲ 60 KB. Listar los 15 archivos con su peso y mirar al menos el de 720 px de cada página para confirmar el recorte. (Depende de T002)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tipos y contenido que usan US1 y US2

**⚠️ CRITICAL**: Ninguna historia empieza antes de terminar esta fase.

- [X] T004 Agregar en `src/types/content.ts`, después del bloque de "Company pages (spec 009)", un bloque `/* ── Service info pages (spec 010) ── */` con:
  - `export type ServiceInfoSlug = "packing-services" | "installation" | "high-value-items" | "furniture-protection" | "move-coordination";`
  - `export interface ServiceInfoPage` con `slug: ServiceInfoSlug`, `label: string` (etiqueta del menú y texto del H1), `href: string` (`/${slug}/`), `meta: { title: string; description: string }`, `hero: { description: string; image: { src480: string; src720: string; src960: string; alt: string; width: number; height: number } }` (comentario: "2 or 3 sentences, specific to this service"), `steps: { title: string; items: [ServiceInfoStep, ServiceInfoStep, ServiceInfoStep] }` (tupla: "Exactamente 3") y `closing: { text: string }` (comentario: "One line ending in →. Always links to /get-a-quote/").
  - `export interface ServiceInfoStep { title: string; description: string }`.
- [X] T005 Crear `src/data/serviceInfoPages.ts` siguiendo el formato de `src/data/movingServicePages.ts`:
  - Comentario de cabecera: contenido de las 5 páginas del menú "Services" (spec 010), 3 secciones, cada afirmación sale de texto ya publicado en el sitio (ver `specs/010-service-info-pages/contracts/page-content.md`); nunca agregar montos, calificaciones, credenciales sin confirmar ni servicios que el sitio no ofrece.
  - Helper `image(slug, alt)` que devuelve `src480/src720/src960` = `/images/services/${slug}-{480,720,960}.webp`, `width: 960`, `height: 720`, con los alt de T002.
  - `export const serviceInfoPages: ServiceInfoPage[]` con las 5 páginas en este orden: Packing Services, Installation, High-Value Items, Furniture Protection, Move Coordination. `label`, `href` y `meta.title` según [contracts/routes.md](contracts/routes.md); `meta.description`, `hero.description`, `steps.title`, los 3 pasos y `closing.text` copiados de [contracts/page-content.md](contracts/page-content.md), **sin** las fuentes entre corchetes ni las notas.
  - `export function getServiceInfoPage(slug: ServiceInfoSlug): ServiceInfoPage` que lanza `Error` si no la encuentra (para que el build falle).
  (Depende de T002 y T004)

**Checkpoint**: `npm run astro -- check` sin errores.

---

## Phase 3: User Story 1 - Visitante que quiere saber cómo manejamos un servicio (Priority: P1) 🎯 MVP

**Goal**: Las 5 páginas existen con sus 3 secciones, SEO por página y entrada en el sitemap.

**Independent Test**: Abrir cualquiera de las 5 rutas en un teléfono: un solo H1, encabezado con 2 o 3 frases y foto sin botones, "How We Do It" con exactamente 3 pasos y una línea de cierre que lleva a `/get-a-quote/` ([quickstart.md](quickstart.md) §2 y §4).

### Implementation for User Story 1

- [X] T006 [P] [US1] Crear `src/components/service-info/ServiceInfoHero.astro` (prop `page: ServiceInfoPage`): copiar la estructura de `src/components/service-page/ServiceHero.astro` (sección `bg-brand-primary` con el mismo padding superior para el navbar fijo, grilla de dos columnas, `<img>` con `srcset` 480/720/960, `sizes={SERVICE_HERO_IMAGE_SIZES}` importado de `src/data/movingServicePages.ts`, `width`/`height`, `loading="eager"`, `fetchpriority="high"`, `aspect-[4/3]`) **quitando** el eyebrow y todo el bloque de botones. Contenido: `<h1 class="type-page-title ...">{page.label}</h1>` y `<p class="type-body-lead ...">{page.hero.description}</p>`.
- [X] T007 [P] [US1] Crear `src/components/service-info/ServiceInfoSteps.astro` (prop `page: ServiceInfoPage`): copiar el marcado de `src/components/sections/MoveSteps.astro` (grilla con encabezado a la izquierda y `<ol>` numerada a la derecha, `data-scroll-reveal`) con eyebrow fijo "How We Do It", `<h2>` = `page.steps.title`, sin subtítulo, y los 3 `<li>` numerados "01"–"03" a partir del índice, cada uno con `<h3>` = `title` y `<p>` = `description`. Usar `id="how-we-do-it"` en la sección.
- [X] T008 [P] [US1] Crear `src/components/service-info/ServiceInfoClosing.astro` (prop `page: ServiceInfoPage`): `<section class="bg-white ...">` con un `<p>` centrado y un único `<a href="/get-a-quote/">` cuyo texto es `page.closing.text` sin la flecha final, más `<span aria-hidden="true">→</span>`. Estilo de enlace de texto (color de marca, `underline-offset-4`, subrayado al pasar el cursor, foco visible), **sin** el componente `Button` ni clases de botón (fondo, borde redondeado tipo píldora, padding de botón). Si `closing.text` ya trae "→" en los datos, quitarlo al renderizar para no duplicarlo.
- [X] T009 [US1] Crear `src/components/service-info/ServiceInfoTemplate.astro` (prop `page: ServiceInfoPage`) a partir de `src/components/service-page/ServicePageTemplate.astro`: mismo JSON-LD `MovingCompany` (name, url, telephone, email, areaServed Miami-Dade County, FL y Broward County, FL, desde `site.ts`, sin address, priceRange, aggregateRating ni review) y `BreadcrumbList` Home → `page.label`, mismo escape `\\u003c`; `BaseLayout` con `title={page.meta.title}`, `description={page.meta.description}`, `image={page.hero.image.src960}`, `ogImageAlt={page.hero.image.alt}` y `preloadImage` con el mismo `srcset`/`sizes` que el `<img>`; dentro de `<main id="main-content">` solo `ServiceInfoHero`, `ServiceInfoSteps` y `ServiceInfoClosing`, en ese orden, entre `Navbar` y `Footer`. (Depende de T006–T008)
- [X] T010 [P] [US1] Crear `src/pages/packing-services.astro` con el mismo formato de 3 líneas que `src/pages/local-moving.astro`, usando `getServiceInfoPage("packing-services")` y `ServiceInfoTemplate`. (Depende de T009)
- [X] T011 [P] [US1] Crear `src/pages/installation.astro` igual que T010 con el slug `"installation"`. (Depende de T009)
- [X] T012 [P] [US1] Crear `src/pages/high-value-items.astro` igual que T010 con el slug `"high-value-items"`. (Depende de T009)
- [X] T013 [P] [US1] Crear `src/pages/furniture-protection.astro` igual que T010 con el slug `"furniture-protection"`. (Depende de T009)
- [X] T014 [P] [US1] Crear `src/pages/move-coordination.astro` igual que T010 con el slug `"move-coordination"`. (Depende de T009)
- [X] T015 [P] [US1] En `src/pages/sitemap.xml.ts`, importar `serviceInfoPages` y agregar `...serviceInfoPages.map((page) => page.href)` a la lista `routes`, después de las páginas de Moving.
- [X] T016 [US1] Ejecutar `npm run build` y revisar en `dist/client/<slug>/index.html` de las 5 rutas: un solo `<h1>`, 3 `<section>` dentro de `<main>`, 3 `<li>` en la lista de pasos, un único enlace a `/get-a-quote/` en el contenido de `<main>` y ningún `tel:` dentro de `<main>`, `<title>` y meta description según contratos, `rel="canonical"`, `rel="preload"` de la foto y los 2 JSON-LD. Confirmar que `dist/client/sitemap.xml` incluye las 5 rutas. (Depende de T010–T015)

**Checkpoint**: Las 5 páginas funcionan accediendo por URL; el menú todavía apunta a `/#included`.

---

## Phase 4: User Story 2 - Visitante que llega desde el menú "Services" (Priority: P1)

**Goal**: Los 5 enlaces del menú "Services" llevan a sus páginas y "Storage Solutions" desaparece, en navbar y footer.

**Independent Test**: Pulsar los 5 enlaces de "Services" en navbar (escritorio y móvil) y footer; cada uno abre su página y "Storage Solutions" no aparece ([quickstart.md](quickstart.md) §3).

### Implementation for User Story 2

- [X] T017 [US2] En `src/data/navigation.ts`, importar `serviceInfoPages` y reemplazar los 6 `children` fijos del grupo "Services" por `serviceInfoPages.map(({ label, href }) => ({ label, href }))`, con el comentario `// Each Services link opens its own page; Storage Solutions was removed (spec 010).` Mantener `label: "Services"` y `href: "/#included"` del padre. No tocar los grupos Moving, Locations y Company. (Depende de T016: las rutas deben existir antes de enlazarlas, principio IV)
- [X] T018 [US2] Verificar: en `src/components/react/NavMenu.tsx` no hay nada que dependa de 6 hijos en "Services" (cantidad fija, alturas o columnas); después de `npm run build`, buscar "Storage Solutions" en `dist/client/` (0 resultados) y `href="/#included"` en los enlaces hijos del menú (0 resultados; el padre puede seguir); con `npm run preview`, abrir el menú "Services" en escritorio y a 360 px, y pulsar los 5 enlaces del navbar y del footer. (Depende de T017)

**Checkpoint**: US1 y US2 completas: las páginas se encuentran desde el menú.

---

## Phase 5: User Story 3 - Visitante con artículos de alto valor (Priority: P2)

**Goal**: La página de High-Value Items describe solo cuidados ya publicados en el sitio.

**Independent Test**: Leer `/high-value-items/` y comprobar que cada cuidado tiene fuente y que no menciona servicios que el sitio no ofrece.

### Implementation for User Story 3

- [X] T019 [US3] Revisar la entrada `high-value-items` de `src/data/serviceInfoPages.ts` contra [contracts/page-content.md](contracts/page-content.md): solo envoltura de muebles, protección de pisos, puertas y esquinas, revisión antes de cargar, equipo con verificación de antecedentes y el aviso al cotizar (FAQ). Buscar en `dist/client/high-value-items/index.html` (sin distinguir mayúsculas) `crate`, `custom`, `insurance`, `insured`, `full value`, `apprais`, `piano` y `white glove`: 0 resultados. Corregir los datos si algo aparece.

---

## Phase 6: User Story 4 - Visitante que compara servicios (Priority: P3)

**Goal**: Cada página tiene texto propio.

**Independent Test**: Ningún par de páginas comparte frases, pasos o líneas de cierre idénticos o que solo cambien el nombre.

### Implementation for User Story 4

- [X] T020 [US4] Comparar las 5 entradas de `src/data/serviceInfoPages.ts`: `hero.description`, los 15 pasos (`title` y `description`) y las 5 `closing.text` son distintos y no son el mismo texto con otro nombre; prestar atención a Furniture Protection frente a High-Value Items. Comprobar que los 5 `meta.title` y `meta.description` no se repiten con ninguna otra página del sitio, extrayendo `<title>` y `<meta name="description">` de todos los `dist/client/**/index.html`. Corregir los datos si hay repeticiones, sin agregar afirmaciones sin fuente.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T021 Ejecutar `npm run astro -- check` (0 errores) y `npm run build` (sin errores ni advertencias nuevas).
- [X] T022 Ejecutar las secciones 5 y 6 de [quickstart.md](quickstart.md): contenido contra sus fuentes, "when the service is available" en Move Coordination, 5 fotos distintas con alt, 360 px sin scroll horizontal, Lighthouse móvil en una página (CLS < 0.1, LCP registrado con la salvedad de la spec 007) y ningún enlace a 404 en las 5 páginas. Registrar los resultados en `specs/010-service-info-pages/verification.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 → T002 → T003.
- **Foundational (Phase 2)**: T004 → T005 (T005 necesita los alt de T002). Bloquea todas las historias.
- **US1 (Phase 3)**: depende de Phase 2 y de T003 (las fotos deben existir para que T016 no encuentre imágenes rotas).
- **US2 (Phase 4)**: depende de US1 (T016). Enlazar el menú antes de que existan las páginas rompería el principio IV.
- **US3 y US4 (Phases 5–6)**: dependen de T005 para revisar los datos y de un build para revisar el HTML; se pueden hacer en paralelo entre sí.
- **Polish (Phase 7)**: después de todas las historias.

### Within User Story 1

- T006, T007 y T008 en paralelo → T009 → T010–T014 en paralelo → T016.
- T015 es independiente de T006–T014.

### Parallel Opportunities

- T006, T007, T008 y T015 (archivos distintos).
- T010–T014 (un archivo por página).
- T019 y T020 (solo revisan; si corrigen, tocan entradas distintas del mismo archivo y conviene hacerlas en serie).

---

## Parallel Example: User Story 1

```text
Task: "Crear src/components/service-info/ServiceInfoHero.astro"
Task: "Crear src/components/service-info/ServiceInfoSteps.astro"
Task: "Crear src/components/service-info/ServiceInfoClosing.astro"
Task: "Agregar serviceInfoPages a src/pages/sitemap.xml.ts"

# Después de T009:
Task: "Crear src/pages/packing-services.astro"
Task: "Crear src/pages/installation.astro"
Task: "Crear src/pages/high-value-items.astro"
Task: "Crear src/pages/furniture-protection.astro"
Task: "Crear src/pages/move-coordination.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 y Phase 2.
2. Phase 3 (US1): las 5 páginas accesibles por URL.
3. **Validar** con T016 antes de tocar el menú.

### Incremental Delivery

1. US1 → páginas publicadas pero sin enlaces desde el menú (no hay rutas rotas).
2. US2 → el menú "Services" las enlaza y se quita "Storage Solutions".
3. US3 y US4 → revisión de honestidad y unicidad del contenido.
4. Polish → verificación completa y registro en `verification.md`.

---

## Notes

- 22 tareas. Commit sugerido después de cada fase, con el formato de los commits anteriores (por ejemplo, `feat: add info pages for the Services menu`).
- Si una foto candidata no sirve y no hay reemplazo adecuado en `library/`, parar y preguntar al dueño en lugar de usar una foto que sugiera almacenamiento o un servicio que no ofrecemos.
