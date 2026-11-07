# Implementation Plan: Páginas informativas para cada servicio del menú "Services"

**Branch**: `010-service-info-pages` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/010-service-info-pages/spec.md`

## Summary

Se crean 5 páginas estáticas en la raíz (`/packing-services/`, `/installation/`, `/high-value-items/`, `/furniture-protection/`, `/move-coordination/`), cada una con 3 secciones: **encabezado** sin botones (H1, 2 o 3 frases y foto), **"How we do it"** con 3 pasos y una **línea de cierre** con enlace de texto a `/get-a-quote/`.

Se sigue el patrón de la spec 007: un archivo de datos tipado con las 5 páginas en el orden del menú, un componente de plantilla, un archivo `.astro` por ruta, fotos de `public/images/library/` recortadas en 4:3 a 480, 720 y 960 px, precarga de la foto con la prop `preloadImage` de `BaseLayout`, y JSON-LD `MovingCompany` y `BreadcrumbList`.

El menú "Services" de `navigation.ts` pasa a derivarse del archivo de datos. Así los 5 enlaces apuntan a sus páginas y "Storage Solutions" desaparece. El footer lee `navigation`, así que cambia solo. El sitemap suma las 5 rutas.

El texto de las 5 páginas está redactado en [contracts/page-content.md](contracts/page-content.md), con la fuente del sitio de cada afirmación. Ese archivo es la referencia para revisar que no haya datos inventados (SC-004).

## Technical Context

**Language/Version**: TypeScript y Astro 6. Node.js ≥ 22.12.

**Primary Dependencies**: Stack del proyecto sin cambios. No se agregan dependencias. `sharp` ya está en `node_modules` (lo trae Astro) y se usa solo como herramienta de un solo uso para generar las fotos, como en las specs 006 y 007.

**Storage**: Contenido en `src/data/serviceInfoPages.ts`, tipado en `src/types/content.ts`. Fotos en `public/images/services/<slug>-{480,720,960}.webp`.

**Testing**: El proyecto no tiene scripts de pruebas. Se valida con [quickstart.md](quickstart.md), `npm run astro -- check`, `npm run build` y una revisión del HTML generado.

**Target Platform**: Cloudflare (`proelitemovers.com`). Las 5 páginas se prerenderizan como HTML estático.

**Project Type**: Sitio web existente; se agregan páginas estáticas.

**Performance Goals**: Core Web Vitals en verde en móvil (principio IX). La foto del encabezado es el probable elemento LCP: se sirve en WebP de 480/720/960 px con `srcset` y se precarga. El retraso de renderizado compartido por todo el sitio que registró la spec 007 ([verification.md](../007-moving-service-pages/verification.md)) no se resuelve aquí.

**Constraints**:
- Sin botones, precios, montos, reseñas, preguntas frecuentes ni listas de "qué incluye" en el contenido de las páginas.
- Cada afirmación sale de un texto ya publicado en el sitio ([research.md](research.md), R3).
- No se tocan el home, los menús Moving, Locations y Company, ni el diseño del navbar.
- Sin JavaScript nuevo en el cliente.
- Contenido visible en inglés, informativo y no de venta.

**Scale/Scope**: 5 rutas nuevas, 4 componentes nuevos, 1 archivo de datos nuevo, 15 imágenes nuevas. Se editan `navigation.ts`, `sitemap.xml.ts` y `content.ts`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cómo se cumple | Estado |
|-----------|----------------|--------|
| I. Precio transparente | No se muestran tarifas ni montos. Packing menciona "billed by the hour, three-hour minimum", ya publicado en el FAQ. | ✅ |
| II. Honestidad | Cada afirmación tiene su fuente en el sitio ([contracts/page-content.md](contracts/page-content.md)). Sin reseñas, licencias ni cifras nuevas. High-Value Items no ofrece cajas a medida ni seguro adicional. | ✅ |
| III. Imágenes reales | Fotos de `library/`, ya aprobadas; solo se recortan y se redimensionan. | ✅ |
| IV. Cero rutas rotas | Las 5 rutas existen antes de que el menú las enlace; el cierre lleva a `/get-a-quote/`, que existe. Se elimina "Storage Solutions", que no tenía destino propio. | ✅ |
| V. SEO orgánico | Texto propio por página, sin relleno de palabras clave. | ✅ |
| VI. SEO técnico por página | Título y meta description únicos, un H1, alt, canónica (la pone `BaseLayout`), sitemap y schema `MovingCompany` sin datos no visibles. | ✅ |
| VII. NAP consistente | El schema usa `site.ts`, la fuente única. | ✅ |
| VIII. Contenido local | Texto escrito para clientes de Miami y el sur de Florida. | ✅ |
| IX. Rendimiento | Fotos responsive con precarga; sin JS nuevo. | ✅ (con la salvedad compartida de la spec 007) |
| X. JS mínimo | Páginas 100 % estáticas. | ✅ |
| XI. Mobile first, cotizar o llamar | Sin botones en el contenido por pedido del dueño. El navbar (teléfono y menú) y el footer (teléfono) están en todas las páginas, y la línea de cierre lleva a la cotización con un toque. | ✅ |
| XII. Simplicidad | Se reutilizan `BaseLayout`, `SERVICE_HERO_IMAGE_SIZES` y el patrón de la spec 007. No se refactorizan los componentes existentes. | ✅ |

**Re-check post-design**: sin cambios. Ninguna violación que justificar.

## Project Structure

### Documentation (this feature)

```text
specs/010-service-info-pages/
├── spec.md
├── plan.md              # Este archivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/
│   ├── routes.md        # Rutas, menú y SEO por página
│   └── page-content.md  # Texto de las 5 páginas con sus fuentes
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── types/content.ts                         # + ServiceInfoSlug, ServiceInfoPage
├── data/
│   ├── serviceInfoPages.ts                  # NUEVO: 5 páginas en orden de menú + getter
│   └── navigation.ts                        # Services → derivado de serviceInfoPages
├── components/service-info/                 # NUEVO
│   ├── ServiceInfoTemplate.astro            # Layout, schema y las 3 secciones
│   ├── ServiceInfoHero.astro                # H1, frases y foto, sin botones
│   ├── ServiceInfoSteps.astro               # 3 pasos
│   └── ServiceInfoClosing.astro             # Línea con enlace a /get-a-quote/
└── pages/
    ├── packing-services.astro               # NUEVO
    ├── installation.astro                   # NUEVO
    ├── high-value-items.astro               # NUEVO
    ├── furniture-protection.astro           # NUEVO
    ├── move-coordination.astro              # NUEVO
    └── sitemap.xml.ts                       # + 5 rutas

public/images/services/
└── <slug>-{480,720,960}.webp                # NUEVO: 15 archivos
```

**Structure Decision**: Componentes propios en `src/components/service-info/` en lugar de modificar `src/components/service-page/` (spec 007). El encabezado de Moving tiene botones y un eyebrow, y su tipo incluye "What's Included"; adaptarlo con props condicionales tocaría páginas ya publicadas para ahorrar unas 40 líneas de marcado ([research.md](research.md), R2).

## Complexity Tracking

Sin violaciones de la constitución que justificar.
