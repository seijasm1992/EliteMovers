# Implementation Plan: Páginas propias para cada servicio del menú "Moving"

**Branch**: `007-moving-service-pages` | **Date**: 2026-11-07 (revisado tras la reducción de alcance) | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/007-moving-service-pages/spec.md`

## Summary

La spec se redujo de 8 secciones a 2 por página: **encabezado** (nombre, párrafo de 2 a 3 frases, foto, "Get a Quote" y "Call Now") y **"Qué incluye"** (3 a 5 puntos). La primera versión ya está implementada en la rama, así que este plan es una **reducción del código existente**, no una construcción desde cero.

Se conserva lo que sigue en alcance: las 6 rutas en la raíz, el archivo de datos `movingServicePages.ts`, los enlaces del menú "Moving" en navbar y footer, el sitemap, las fotos de `public/images/services/`, la precarga de la foto en `BaseLayout`, los componentes `ServiceHero` y `ServiceIncluded`, y el JSON-LD `MovingCompany` y `BreadcrumbList`.

Se elimina lo que pasó a fuera de alcance: 6 componentes de sección (proceso, precios, garantías, reseñas, preguntas frecuentes y enlaces a otros servicios con el llamado final), el JSON-LD `FAQPage`, los archivos `pricing.ts` y `reviews.ts` (sin uso después del cambio), los tipos que solo ellos usan y los campos de contenido sin sección (`process`, `pricingNote`, `faq`, `relatedIntro`, `included.intro`).

El contenido actual ya cumple los nuevos límites: los 6 párrafos del encabezado tienen 2 frases y las listas tienen 4 o 5 puntos ([research.md](research.md), R12).

## Technical Context

**Language/Version**: TypeScript y Astro 6. Node.js ≥ 22.12.

**Primary Dependencies**: Stack del proyecto sin cambios (Astro 6, React 19 solo en la isla del navbar, Tailwind 4, adaptador de Cloudflare). No se agregan dependencias.

**Storage**: Contenido en `src/data/movingServicePages.ts`, tipado en `src/types/content.ts`. Fotos estáticas en `public/images/services/` (ya generadas).

**Testing**: El proyecto no tiene scripts de pruebas. Se valida con [quickstart.md](quickstart.md), `npm run astro -- check`, `npm run build` y una revisión del HTML generado en `dist/client/`.

**Target Platform**: Sitio en Cloudflare (`proelitemovers.com`). Las 6 páginas se prerenderizan como HTML estático.

**Project Type**: Sitio web existente. Reducción de páginas estáticas ya creadas.

**Performance Goals**: Core Web Vitals en verde en móvil (principio IX): LCP < 2.5 s, INP < 200 ms y CLS < 0.1. Con menos secciones el HTML pesa menos, pero el LCP de laboratorio (3.5–3.7 s) depende de un retraso de renderizado compartido por todo el sitio ([verification.md](verification.md)), que esta reducción no resuelve.

**Constraints**:
- Sin montos en USD, calificaciones ni licencia afirmada en ninguna página ni en el schema.
- No se tocan el home, los menús Services, Locations y Company, ni el diseño del navbar.
- Contenido visible en inglés y propio de cada servicio.
- Sin JavaScript nuevo en el cliente.

**Scale/Scope**: 6 páginas existentes. Se borran 8 archivos (6 componentes y 2 de datos) y se editan 4 (`ServicePageTemplate.astro`, `ServiceIncluded.astro`, `movingServicePages.ts` y `content.ts`).

### Estado medido (2026-11-07, antes de reducir)

| Medición | Resultado |
|----------|-----------|
| Secciones por página | 7 visibles (`top`, `included`, `how-it-works`, `pricing`, `guarantees`, `faq`, `more-services`) más `reviews` condicional |
| Frases del párrafo del encabezado | 2 en las 6 páginas |
| Puntos en "Qué incluye" | 5 en 5 páginas y 4 en Small Moves |
| JSON-LD por página | `MovingCompany`, `BreadcrumbList` y `FAQPage` |
| Quién usa `pricing.ts` | `ServicePricing.astro` y `ServiceGuarantees.astro`, nada más |
| Quién usa `reviews.ts` | `ServiceReviews.astro`, nada más |
| Menú, sitemap, fotos y precarga | Ya cumplen la spec revisada |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cómo se cumple | Estado |
|-----------|----------------|--------|
| I. Precios transparentes | Ninguna página habla de precios; la sección de cobro quedó fuera de alcance. No se afirma ningún precio ni se ocultan costos. | ✅ |
| II. Honestidad | Sin reseñas, calificaciones ni licencia. Los puntos de "Qué incluye" usan solo datos del sitio (FR-010). | ✅ |
| III. Imágenes reales | Fotos de `library/` ya aprobadas, solo recortadas. | ✅ |
| IV. Cero rutas rotas | Las 6 rutas siguen existiendo. Al quitar la sección de enlaces cruzados desaparecen enlaces, no se rompe ninguno. Los botones van a `/get-a-quote/` y `tel:`. | ✅ |
| V. SEO orgánico | Texto propio por servicio, sin relleno. **Riesgo**: con 2 a 3 frases y 3 a 5 puntos, las páginas son cortas y Google puede verlas como contenido escaso. No viola el principio, pero limita su alcance orgánico. Es una decisión del dueño (aclaración de la spec). | ⚠️ Riesgo aceptado |
| VI. SEO técnico por página | Título y descripción únicos, 1 H1, canónica, sitemap, `alt` y `MovingCompany` coherente con lo visible. `FAQPage` se quita porque ya no hay preguntas visibles. | ✅ |
| VII. NAP consistente | Teléfono, nombre y correo desde `site.ts`. | ✅ |
| VIII. Contenido local | Los párrafos hablan de Miami, Miami-Dade, Broward y Florida. | ✅ |
| IX. Rendimiento | Menos HTML y CSS por página. El LCP queda pendiente por una causa de todo el sitio (ver Technical Context). | ⚠️ Pendiente heredado |
| X. JS mínimo | Sin JS nuevo; la única isla sigue siendo la del navbar. | ✅ |
| XI. Mobile first | "Get a Quote" y "Call Now" en el encabezado, visibles sin desplazarse a 360 px. | ✅ |
| XII. Simplicidad | Se borra el código sin uso (componentes, datos y tipos) en lugar de dejarlo inactivo. | ✅ |
| Idioma y tono | Inglés natural. | ✅ |

**Re-check después de la fase 1**: Sin cambios. Ninguna violación; quedan dos avisos, el riesgo de contenido escaso (V), aceptado por el dueño, y el LCP heredado (IX), que se mide en producción.

## Project Structure

### Documentation (this feature)

```text
specs/007-moving-service-pages/
├── plan.md              # Este archivo (revisado)
├── research.md          # R1–R11 originales y R12–R14 de la revisión
├── data-model.md        # Revisado: solo MovingServicePage y registro de pendientes
├── quickstart.md        # Revisado: validación de 2 secciones
├── contracts/
│   ├── routes.md        # Sin cambios de fondo
│   └── page-sections.md # Revisado: 2 secciones y 2 bloques JSON-LD
├── verification.md      # Resultados de la primera versión; se reescribe al implementar
├── checklists/
│   └── requirements.md
└── tasks.md             # Se regenera con /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── local-moving.astro ... large-moves.astro   # sin cambios
│   └── sitemap.xml.ts                             # sin cambios
├── components/service-page/
│   ├── ServicePageTemplate.astro   # editado: solo Hero + Included; JSON-LD sin FAQPage
│   ├── ServiceHero.astro           # sin cambios
│   ├── ServiceIncluded.astro       # editado: sin intro
│   ├── ServiceProcess.astro        # se borra
│   ├── ServicePricing.astro        # se borra
│   ├── ServiceGuarantees.astro     # se borra
│   ├── ServiceReviews.astro        # se borra
│   ├── ServiceFaq.astro            # se borra
│   └── ServiceRelated.astro        # se borra
├── data/
│   ├── movingServicePages.ts       # editado: sin process, pricingNote, faq, relatedIntro ni included.intro
│   ├── pricing.ts                  # se borra
│   ├── reviews.ts                  # se borra
│   └── navigation.ts               # sin cambios
├── layouts/BaseLayout.astro        # sin cambios (preloadImage y ogImageAlt se quedan)
└── types/content.ts                # editado: MovingServicePage reducido; sin PricingFacts, Credentials ni Review

public/images/services/             # sin cambios
```

**Structure Decision**: Se mantiene la estructura de la primera versión (6 páginas explícitas, una plantilla y un archivo de datos) y se borran los archivos que ya no tienen uso. Volver a armar las secciones retiradas más adelante es más limpio desde el historial de git que manteniendo código inactivo ([research.md](research.md), R13).

## Complexity Tracking

Sin violaciones de la constitución que justificar.
