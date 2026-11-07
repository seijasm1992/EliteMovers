---

description: "Task list for 007-moving-service-pages (revisión: 2 secciones)"
---

# Tasks: Páginas propias para cada servicio del menú "Moving"

**Input**: Design documents from `/specs/007-moving-service-pages/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md)

**Contexto**: La primera versión (8 secciones) ya está implementada en la rama. Esta lista la **reduce** a las 2 secciones de la spec revisada: encabezado y "Qué incluye". La lista anterior de 36 tareas queda reemplazada.

**Tests**: La spec no pide pruebas automatizadas y el proyecto no tiene scripts de pruebas. La validación se hace con [quickstart.md](quickstart.md), `npm run astro -- check` y `npm run build`.

**Organization**: Tareas agrupadas por historia de usuario de la spec revisada (US1–US3). US2 y US3 ya están cubiertas por el código actual y solo necesitan verificación.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede hacer en paralelo (otro archivo, sin depender de tareas pendientes)
- **[Story]**: Historia de usuario a la que pertenece (US1–US3)

## Reglas que aplican a todas las tareas

- No tocar `src/pages/index.astro`, `src/components/sections/`, `src/components/layout/`, `src/data/navigation.ts`, `src/pages/sitemap.xml.ts`, `src/layouts/BaseLayout.astro` ni `public/images/services/`. Ya cumplen la spec revisada.
- No reescribir el texto de los párrafos ni de los puntos: ya cumplen los límites ([research.md](research.md), R12).
- Sin montos, calificaciones, licencia ni marcadores de pendiente en ninguna página ni en el schema.

---

## Phase 1: Setup

**Purpose**: Guardar la versión de 8 secciones antes de borrar código.

- [X] T001 Pedir aprobación al dueño y, si la da, hacer un commit en la rama `007-moving-service-pages` con el estado actual (versión de 8 secciones), para que las secciones retiradas se puedan recuperar del historial ([research.md](research.md), R13). El mensaje de commit termina con la línea de atribución del proyecto. Si el dueño no aprueba el commit, copiar `src/components/service-page/`, `src/data/pricing.ts`, `src/data/reviews.ts` y `src/data/movingServicePages.ts` a una carpeta de respaldo en el scratchpad de la sesión y anotar la ruta en `specs/007-moving-service-pages/verification.md`. **No continuar sin uno de los dos respaldos.**

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reducir los tipos y los datos que comparten las 6 páginas.

**⚠️ CRITICAL**: T002 y T003 van juntas: al cambiar el tipo, el archivo de datos deja de compilar hasta quitar sus campos.

- [X] T002 En `src/types/content.ts`, reducir `MovingServicePage` a los campos de [data-model.md](data-model.md): `slug`, `label`, `href`, `meta { title; description }`, `hero { eyebrow; title; description; image { src480; src720; src960; alt; width; height } }` e `included { title; items: { title; description }[] }`. Quitar `included.intro`, `process`, `pricingNote`, `faq` y `relatedIntro`. Borrar las interfaces `PricingFacts`, `Credentials` y `Review`. Conservar `MovingServiceSlug`.
- [X] T003 En `src/data/movingServicePages.ts`, quitar de las 6 entradas los campos `included.intro`, `process`, `pricingNote`, `faq` y `relatedIntro`, sin cambiar el texto de `hero.description` ni de `included.items`. Actualizar el comentario del archivo para que diga que la página tiene 2 secciones (spec revisada). Conservar `SERVICE_HERO_IMAGE_SIZES` y `getMovingServicePage`.

**Checkpoint**: Tipos y datos describen solo las 2 secciones.

---

## Phase 3: User Story 1 - Visitante que conoce un servicio y pide cotización (Priority: P1) 🎯 MVP

**Goal**: Cada página muestra solo el encabezado y "Qué incluye".

**Independent Test**: `npm run build` y, en `dist/client/local-moving/index.html`, comprobar que `<main>` tiene exactamente 2 `<section>` (`top` e `included`), 1 `<h1>`, "Get a Quote" → `/get-a-quote/` y "Call Now" → `tel:` en el encabezado ([quickstart.md](quickstart.md), pasos 3 y 5).

- [X] T004 [US1] En `src/components/service-page/ServicePageTemplate.astro`, dejar dentro de `<main id="main-content">` solo `<ServiceHero page={page} />` y `<ServiceIncluded page={page} />`. Quitar los imports de `ServiceProcess`, `ServicePricing`, `ServiceGuarantees`, `ServiceReviews`, `ServiceFaq` y `ServiceRelated`. Quitar el objeto `FAQPage` del arreglo `schemas`, de modo que solo queden `MovingCompany` y `BreadcrumbList` ([contracts/page-sections.md](contracts/page-sections.md), [research.md](research.md), R14).
- [X] T005 [P] [US1] En `src/components/service-page/ServiceIncluded.astro`, quitar el `subtitle={included.intro}` del `SectionHeader`. Mantener el eyebrow "What's Included", el título `included.title` y la lista de puntos.
- [X] T006 [P] [US1] Borrar `src/components/service-page/ServiceProcess.astro`, `src/components/service-page/ServicePricing.astro`, `src/components/service-page/ServiceGuarantees.astro`, `src/components/service-page/ServiceReviews.astro`, `src/components/service-page/ServiceFaq.astro` y `src/components/service-page/ServiceRelated.astro`. Depende de T004.
- [X] T007 [P] [US1] Borrar `src/data/pricing.ts` y `src/data/reviews.ts`, después de confirmar con una búsqueda en `src/` que nada más los importa. Depende de T006.
- [X] T008 [US1] Comprobar en `src/data/movingServicePages.ts` que cada `hero.description` es un "párrafo propio de **2 a 3 frases**" y que cada `included.items` tiene "**de 3 a 5 puntos**" ([data-model.md](data-model.md)). Si alguna entrada no cumple, ajustarla sin agregar datos de negocio nuevos.

**Checkpoint**: Las 6 páginas tienen solo 2 secciones y compilan.

---

## Phase 4: User Story 2 - Visitante que llega desde el menú (Priority: P1)

**Goal**: Los 6 enlaces de "Moving" del navbar y del footer siguen llevando a su página.

**Independent Test**: [quickstart.md](quickstart.md), paso 5.

- [X] T009 [US2] Sin cambiar código, verificar en `dist/client/index.html` que el navbar y el footer enlazan las 6 páginas (`/local-moving/` … `/large-moves/`), que no quedan `/#residential-moving`, `/#long-distance-moving` ni `/#business-moving` en el footer, que los grupos Locations, Services y Company no cambiaron y que `dist/client/sitemap.xml` lista 10 URLs.

---

## Phase 5: User Story 3 - Visitante que compara tipos de mudanza (Priority: P2)

**Goal**: El párrafo y los puntos de cada página son propios.

**Independent Test**: [quickstart.md](quickstart.md), paso 6.

- [X] T010 [US3] Comparar entre las 6 entradas de `src/data/movingServicePages.ts` cada frase de `hero.description` y de `included.items` (5 o más palabras, sin contar el nombre del servicio). Resultado esperado: 0 frases repetidas. Revisar a mano los pares Office/Commercial y Small/Large.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T011 `npm run astro -- check` (solo se aceptan los 3 errores previos de `astro.config.mjs`) y `npm run build` (`ENABLE_TURNSTILE=false`) sin errores.
- [X] T012 [P] Ejecutar el paso 2 de [quickstart.md](quickstart.md) sobre `src/`: en `src/components/service-page/` solo quedan `ServicePageTemplate.astro`, `ServiceHero.astro` y `ServiceIncluded.astro`; `src/data/pricing.ts` y `src/data/reviews.ts` no existen; 0 coincidencias de `pricingNote`, `relatedIntro`, `PricingFacts`, `Credentials`, `Review`, `.faq` y `.process`.
- [X] T013 [P] Verificar en el HTML generado de las 6 páginas en `dist/client/<slug>/index.html` los pasos 3 y 4 de [quickstart.md](quickstart.md): 2 secciones en orden, 1 `<h1>`, 2 bloques JSON-LD sin `FAQPage` y `MovingCompany` sin `address`, `priceRange`, `aggregateRating` ni `review`; título y descripción únicos; canónica correcta; `alt` en todas las `<img>`; 0 datos prohibidos; 0 enlaces, `src` o `srcset` rotos.
- [X] T014 Lighthouse móvil sobre `npm run preview` para las 6 páginas (LCP, CLS, TBT) y una captura a 360 px con emulación móvil: el H1, el párrafo, "Get a Quote" y "Call Now" se ven sin desplazarse y sin scroll horizontal (SC-003, SC-008).
- [X] T015 Reescribir `specs/007-moving-service-pages/verification.md` con los resultados de T009–T014 para la versión de 2 secciones. Conservar el diagnóstico del LCP de todo el sitio y la lista de pendientes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001)**: Bloquea todo. No se borra nada sin respaldo.
- **Foundational (T002 → T003)**: Depende de T001. Bloquea US1.
- **US1**: T004 y T005 en paralelo; T006 después de T004; T007 después de T006; T008 en cualquier momento después de T003.
- **US2 (T009)** y **US3 (T010)**: Solo verifican. T009 necesita un build (T011); T010 se puede hacer apenas termina T003.
- **Polish**: T011 después de US1. T012 y T013 en paralelo después de T011. T014 después de T013. T015 al final.

### User Story Dependencies

```text
T001 ─► T002 ─► T003 ─► US1 (T004–T008) ─► T011 ─┬─► US2 (T009)
                  │                               ├─► T012, T013 ─► T014 ─► T015
                  └─► US3 (T010)                  
```

## Parallel Example: User Story 1

```text
# Archivos distintos:
T004 ServicePageTemplate.astro    T005 ServiceIncluded.astro

# Después de T004:
T006 borrar 6 componentes  →  T007 borrar pricing.ts y reviews.ts
```

## Implementation Strategy

### MVP (US1)

1. T001: respaldo.
2. T002–T003: tipos y datos.
3. T004–T008: plantilla de 2 secciones y borrado de lo retirado.
4. **Parar y validar**: build y pasos 3 y 5 de [quickstart.md](quickstart.md).

### Después

1. US2 y US3: verificaciones sin cambios de código.
2. Polish: limpieza confirmada, HTML, Lighthouse y `verification.md`.
