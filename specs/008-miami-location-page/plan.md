# Implementation Plan: Página de Miami del menú "Locations"

**Branch**: `008-miami-location-page` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-miami-location-page/spec.md`

## Summary

Crear la página estática `/location/` con el mismo contenido que la sección "Service Area" del home (texto, mapa y teléfono), con título y meta description propios, canónica, entrada en el sitemap y JSON-LD `MovingCompany` y `BreadcrumbList`. El enlace "Miami" del menú "Locations" pasa de `/#quote` a `/location/` en navbar y footer.

Enfoque: reutilizar `QuoteSection.astro` en la página nueva para que el contenido sea idéntico por construcción. Se le añade una prop `headingLevel` (por defecto `h2`) para que en `/location/` el título sea el único H1 sin cambiar el home. La URL, el título y la meta description viven en un archivo de datos nuevo, `locationPages.ts`, que leen la página, el menú y el sitemap ([research.md](research.md)).

## Technical Context

**Language/Version**: TypeScript y Astro 6. Node.js ≥ 22.12.

**Primary Dependencies**: Stack del proyecto sin cambios (Astro 6, React 19 solo en la isla del navbar, Tailwind 4, adaptador de Cloudflare). No se agregan dependencias.

**Storage**: `src/data/locationPages.ts` (nuevo), tipado en `src/types/content.ts`. El contenido visible sigue en `QuoteSection.astro`.

**Testing**: El proyecto no tiene scripts de pruebas. Se valida con [quickstart.md](quickstart.md), `npm run astro -- check`, `npm run build` y revisión del HTML de `dist/client/`.

**Target Platform**: Sitio en Cloudflare (`proelitemovers.com`). La página se prerenderiza como HTML estático.

**Project Type**: Sitio web existente. Una página estática nueva.

**Performance Goals**: Core Web Vitals en verde en móvil (principio IX): LCP < 2.5 s, INP < 200 ms, CLS < 0.1. Sin imagen de LCP; el mapa carga en diferido.

**Constraints**:
- Sin contenido nuevo aparte del título y la meta description (FR-005).
- El HTML del home no cambia (SC-007).
- Solo cambia el enlace "Miami"; Moving, Services y Company quedan igual.
- Sin JavaScript nuevo en el cliente.

**Scale/Scope**: 2 archivos nuevos (`src/pages/location.astro`, `src/data/locationPages.ts`) y 4 editados (`QuoteSection.astro`, `navigation.ts`, `sitemap.xml.ts`, `content.ts`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cómo se cumple | Estado |
|-----------|----------------|--------|
| I. Precios transparentes | No se muestran precios. El texto reutilizado habla de "hourly rate estimate", coherente con el cobro por hora. | ✅ |
| II. Honestidad | Sin cifras, reseñas ni credenciales nuevas. Solo el texto existente. | ✅ |
| III. Imágenes reales | Sin imágenes nuevas; solo el mapa de Google ya existente. | ✅ |
| IV. Cero rutas rotas | `/location/` existe antes de que el menú la enlace; la URL sale de una sola fuente. `/#quote` sigue funcionando. | ✅ |
| V. SEO orgánico | **Riesgo**: la página es corta y repite el texto del home, así que Google puede darle poco peso. No viola reglas de Google (texto breve, canónica propia). Es lo que pidió el dueño ("no se agrega contenido nuevo"). | ⚠️ Riesgo aceptado |
| VI. SEO técnico por página | Título y descripción únicos, 1 H1, canónica, sitemap, `title` en el iframe del mapa (no hay imágenes) y `MovingCompany` coherente con lo visible. | ✅ |
| VII. NAP consistente | Teléfono, nombre y correo desde `site.ts`, también en la meta description. | ✅ |
| VIII. Contenido local | Todo el contenido trata de Miami, Miami-Dade, Broward y Florida. | ✅ |
| IX. Rendimiento | Página ligera sin imagen de LCP; mapa diferido. Se mide en el paso 9 del quickstart. | ✅ |
| X. JS mínimo | Sin JS nuevo. | ✅ |
| XI. Mobile first | El enlace "Questions? Call" permite llamar con un toque; el navbar mantiene su acceso a cotizar. | ✅ |
| XII. Simplicidad | Se reutiliza el componente existente con una sola prop; sin arreglo de ciudades ni generador de schema compartido. | ✅ |
| Idioma y tono | Texto existente en inglés; título y meta description en inglés. | ✅ |

**Re-check después de la fase 1**: Sin cambios. Ninguna violación; queda el aviso de contenido escaso (V), aceptado por el dueño en la spec.

## Project Structure

### Documentation (this feature)

```text
specs/008-miami-location-page/
├── plan.md              # Este archivo
├── research.md          # R1–R8
├── data-model.md        # LocationPage y prop headingLevel
├── quickstart.md        # Validación
├── contracts/
│   └── routes.md        # Ruta, enlaces, estructura y <head> de /location/
├── checklists/
│   └── requirements.md
└── tasks.md             # Lo genera /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── location.astro                 # nuevo: BaseLayout + Navbar + QuoteSection(h1) + Footer + JSON-LD
│   └── sitemap.xml.ts              # editado: añade miamiPage.href
├── components/sections/
│   └── QuoteSection.astro          # editado: prop headingLevel ("h2" por defecto)
├── data/
│   ├── locationPages.ts            # nuevo: miamiPage (label, href, meta)
│   └── navigation.ts               # editado: hijo "Miami" → miamiPage.href
└── types/content.ts                # editado: interfaz LocationPage
```

**Structure Decision**: Una página explícita en `src/pages/`, igual que las de Moving, y un archivo de datos pequeño como fuente única de la URL y los metadatos. No se crea plantilla de ciudad porque otras ciudades están fuera de alcance.

## Complexity Tracking

Sin violaciones de la constitución que justificar.
