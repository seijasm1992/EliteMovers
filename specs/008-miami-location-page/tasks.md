---

description: "Lista de tareas: página de Miami del menú Locations"
---

# Tasks: Página de Miami del menú "Locations"

**Input**: Design documents from `/specs/008-miami-location-page/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/routes.md](contracts/routes.md), [quickstart.md](quickstart.md)

**Tests**: La spec no pide pruebas automáticas y el proyecto no tiene scripts de pruebas. Cada historia se valida con los pasos de [quickstart.md](quickstart.md).

**Organization**: Tareas agrupadas por historia de usuario.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede hacer en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de la spec (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Confirmar la rama y guardar una referencia del home para comprobar después que no cambió (SC-007).

- [X] T001 Confirmar que la rama activa es `008-miami-location-page` y que parte de `master` (`297708b`). Ejecutar `npm run build` y copiar `dist/client/index.html` y `dist/client/sitemap.xml` al scratchpad de la sesión como referencia "antes"

---

## Phase 2: Foundational

**Purpose**: Tipos, datos y la prop del componente compartido. Bloquea todas las historias.

- [X] T002 [P] Añadir en `src/types/content.ts`, al final y con un comentario `/* ── Location pages (spec 008) ── */`, la interfaz `LocationPage` con `label: string`, `href: string` y `meta: { title: string; description: string }` (ver [data-model.md](data-model.md))
- [X] T003 Crear `src/data/locationPages.ts` que exporte `miamiPage: LocationPage` con `label: "Miami"`, `href: "/location/"` (ruta en la raíz con barra final), `meta.title: "Miami & South Florida Service Area | ProElite Movers"` (≤ 60 caracteres, único en el sitio) y `meta.description` construida como `` `${site.name} handles moves in Miami-Dade, Broward, and throughout Florida, with crews based in Miami. Questions? Call ${site.phone}.` `` (≤ 160 caracteres; teléfono desde `site.phone`, principio VII). Añadir un comentario breve que diga que es la fuente única de la URL para página, menú y sitemap (depende de T002)
- [X] T004 [P] En `src/components/sections/QuoteSection.astro`, añadir `interface Props { headingLevel?: "h1" | "h2" }` con valor por defecto `"h2"` y renderizar el título "Miami and South Florida" con esa etiqueta (`const Heading = headingLevel;` y `<Heading class="type-section-title mt-4 text-text-strong">`), sin cambiar clases, textos, `id="quote"`, mapa ni teléfono. `src/pages/index.astro` no se toca

**Checkpoint**: `npm run astro -- check` sin errores; el home sigue renderizando el título como `<h2>`.

---

## Phase 3: User Story 1 - Visitante que quiere saber si atienden su zona (Priority: P1) 🎯 MVP

**Goal**: La página `/location/` muestra el texto, el mapa y el teléfono de la sección "Service Area" del home.

**Independent Test**: Abrir `/location/` en un teléfono: se ven el rótulo, el H1 "Miami and South Florida", el párrafo, "Crews based in Miami", el enlace "Questions? Call" y el mapa; el teléfono abre la llamada.

- [X] T005 [US1] Crear `src/pages/location.astro` con `BaseLayout` (`title={miamiPage.meta.title}`, `description={miamiPage.meta.description}`, sin `preloadImage` ni imagen propia), `<Navbar />`, `<main id="main-content"><QuoteSection headingLevel="h1" /></main>` y `<Footer />`, siguiendo el patrón de `src/pages/about-us.astro`. Sin secciones, textos ni botones adicionales (FR-005)
- [X] T006 [US1] Ejecutar `npm run build` y comprobar en `dist/client/location/index.html`: exactamente 1 `<h1>` con el texto "Miami and South Florida"; el texto visible de la sección coincide palabra por palabra con el de la sección `id="quote"` de `dist/client/index.html` (SC-002); el enlace `tel:` usa el teléfono de `site.ts` (quickstart pasos 2, 4 y 5)

**Checkpoint**: US1 funciona por URL directa aunque el menú todavía no la enlace.

---

## Phase 4: User Story 2 - Visitante que llega desde el menú (Priority: P1)

**Goal**: El enlace "Miami" del navbar (escritorio y móvil) y del footer lleva a `/location/`.

**Independent Test**: Pulsar "Miami" en el navbar de escritorio, en el menú móvil y en el footer: los tres abren `/location/`.

**Depende de**: US1 (la página debe existir antes de enlazarla, principio IV).

- [X] T007 [US2] En `src/data/navigation.ts`, importar `miamiPage` desde `./locationPages` y cambiar el hijo de "Locations" de `{ label: "Miami", href: "/#quote" }` a `{ label: miamiPage.label, href: miamiPage.href }`, con un comentario `// Opens the Miami page (spec 008).`. El `href` del grupo "Locations" (`/#quote`) y los grupos Moving, Services y Company no cambian (FR-007)
- [X] T008 [US2] Ejecutar `npm run build` y comprobar en el HTML generado que el enlace "Miami" apunta a `/location/` en navbar y footer, que ningún enlace "Miami" apunta a `/#quote`, y que `git diff src/data/navigation.ts` solo muestra el cambio del hijo "Miami" y su import (quickstart paso 7, SC-001)

**Checkpoint**: US1 y US2 completas: la página existe y se encuentra desde el menú.

---

## Phase 5: User Story 3 - Búsqueda en Google de mudanzas en Miami (Priority: P2)

**Goal**: La página tiene los datos técnicos de SEO del principio VI.

**Independent Test**: El `<head>` de `/location/` tiene título y meta description únicos, canónica, JSON-LD `MovingCompany` y `BreadcrumbList`, y el sitemap incluye `/location/`.

- [X] T009 [US3] En `src/pages/location.astro`, añadir dos bloques JSON-LD con el mismo patrón que `src/components/service-page/ServicePageTemplate.astro` (`JSON.stringify(...).replace(/</g, "\\u003c")` y `<script type="application/ld+json" is:inline set:html={json} />`): `MovingCompany` con `name: site.name`, `url: "https://proelitemovers.com/"`, `telephone: site.phone`, `email: site.email` y `areaServed` = `AdministrativeArea` "Miami-Dade County, FL", `AdministrativeArea` "Broward County, FL" y `State` "Florida"; y `BreadcrumbList` Home (`https://proelitemovers.com/`) → `miamiPage.label` (`https://proelitemovers.com${miamiPage.href}`). Sin `address`, `priceRange`, `aggregateRating` ni `review` (FR-010)
- [X] T010 [P] [US3] En `src/pages/sitemap.xml.ts`, importar `miamiPage` desde `../data/locationPages` y añadir `miamiPage.href` al arreglo `routes`, después de las páginas de Moving (FR-009)
- [X] T011 [US3] Ejecutar `npm run build` y comprobar: canónica `https://proelitemovers.com/location/` en `dist/client/location/index.html`; título y meta description distintos a los de `dist/client/index.html` y de las 6 páginas de Moving (`grep -h "<title>" dist/client/**/index.html`); los 2 JSON-LD sin campos prohibidos; `dist/client/sitemap.xml` contiene `https://proelitemovers.com/location/` (quickstart pasos 3 y 6, SC-004)

**Checkpoint**: Las 3 historias completas.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T012 Ejecutar `npm run astro -- check` → 0 errores (quickstart paso 1)
- [X] T013 Comparar `dist/client/index.html` con la copia "antes" de T001: la única diferencia permitida es el `href` del enlace "Miami" (navbar y footer); la sección `id="quote"` y su `<h2>` quedan idénticos (SC-007). Comparar también `sitemap.xml`: solo se añade `/location/`
- [X] T014 Con `npm run preview`, revisar en el navegador (quickstart paso 8): los 3 enlaces "Miami" abren `/location/`; a 360 px de ancho no hay scroll horizontal y se ven el texto, el teléfono y el mapa; el enlace del teléfono abre `tel:+17862817825`; con el mapa bloqueado, el texto y el teléfono siguen visibles; el home se ve igual
- [X] T015 Ejecutar Lighthouse móvil sobre `/location/` en `npm run preview` y anotar LCP y CLS; objetivo LCP < 2.5 s y CLS < 0.1 (quickstart paso 9, SC-006). Si no se cumple, anotar la causa y no cambiar código fuera del alcance
- [X] T016 Crear `specs/008-miami-location-page/verification.md` con el resultado de cada paso de [quickstart.md](quickstart.md) y de T013–T015
- [X] T017 Entregar al dueño el resumen de cambios para su revisión. Tras su visto bueno, hacer el commit en la rama `008-miami-location-page` añadiendo solo las rutas de la feature (`src/pages/location.astro`, `src/data/locationPages.ts`, `src/data/navigation.ts`, `src/pages/sitemap.xml.ts`, `src/components/sections/QuoteSection.astro`, `src/types/content.ts`, `specs/008-miami-location-page/`), nunca con `git add -A`. El push y el merge a `master` solo se hacen si el dueño lo pide

---

## Dependencies & Execution Order

- **Setup (T001)** → **Foundational (T002–T004)** → historias.
- **T003** depende de T002. **T002** y **T004** son independientes entre sí.
- **US1 (T005–T006)** depende de T003 y T004.
- **US2 (T007–T008)** depende de US1: el menú no debe enlazar una ruta que aún no existe (principio IV).
- **US3 (T009–T011)**: T009 depende de T005 (mismo archivo); T010 solo depende de T003.
- **Polish (T012–T017)** después de las 3 historias.

## Parallel Example

```text
# Foundational
T002 src/types/content.ts   ‖   T004 src/components/sections/QuoteSection.astro

# Tras US1
T007 src/data/navigation.ts   ‖   T010 src/pages/sitemap.xml.ts   ‖   T009 src/pages/location.astro
```

## Implementation Strategy

- **MVP**: Phases 1–3 (US1). La página existe por URL directa con el contenido idéntico al home.
- **Incremento 2**: US2 enlaza la página desde navbar y footer. Con US1 y US2 la feature ya es útil para el visitante.
- **Incremento 3**: US3 completa el SEO técnico. Como el principio VI exige estos datos en toda página, la feature no se da por terminada (T017) sin US3.
