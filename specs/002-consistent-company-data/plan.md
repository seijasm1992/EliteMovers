# Implementation Plan: Datos de la empresa coherentes en todo el sitio

**Branch**: `002-consistent-company-data` | **Date**: 2026-11-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-consistent-company-data/spec.md`

## Summary

Los datos de la empresa (marca, nombre legal, teléfono, enlace de llamada, correo y ubicación pública) pasan a vivir solo en `src/data/site.ts`. Se corrigen allí (teléfono nuevo, sin dirección), se amplía su tipo con `legalName` y `location`, y el enlace de llamada se deriva del teléfono para que no puedan separarse. Los archivos que repetían datos a mano (`hero.ts`, `aboutUs.ts`, `faqContent.ts`, `movingServices.ts`, `resend.ts`) pasan a leerlos de `site`, o se corrigen si son texto de marketing. El pie de página y la página de presupuesto cambian la dirección enlazada por "Miami, FL" en texto, el pie añade el correo y la línea del nombre legal. No hay dependencias nuevas ni páginas nuevas.

## Technical Context

**Language/Version**: TypeScript (modo estricto de Astro), Node >= 22.12

**Primary Dependencies**: Astro 6, islas de React 19, Tailwind CSS 4, Resend (envío del formulario). Nada nuevo.

**Storage**: N/A. Los datos son constantes en `src/data/site.ts`.

**Testing**: No hay scripts de test ni de lint. La validación es `npm run astro -- check`, `npm run build` y búsquedas en `src/` y `dist/` (ver [quickstart.md](quickstart.md)).

**Target Platform**: Cloudflare Workers mediante `@astrojs/cloudflare`; páginas estáticas en `dist/client`.

**Project Type**: Sitio web (Astro con islas React y una ruta de API).

**Performance Goals**: Sin cambio. No se añade JavaScript al cliente; las islas que ya importan `site` (`NavMenu`, `Contacto`) siguen igual.

**Constraints**: Texto visible en inglés. Sin dependencias nuevas. Sin cambios de diseño más allá de sustituir la dirección por la ubicación y añadir el correo y la línea legal al pie.

**Scale/Scope**: 1 archivo de datos de la empresa, 1 tipo, 2 componentes de página (pie y presupuesto), 4 archivos de contenido y 1 de envío de correo.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Nota |
|---|---|---|
| I. Precios transparentes | No aplica | |
| II. Honestidad | Cumple | No se añaden cifras, licencias ni reseñas. La línea "Licensed and insured in Florida." queda fuera de alcance (licencias). |
| III. Imágenes reales | No aplica | Solo se corrige el texto alternativo de una imagen. |
| IV. Cero rutas rotas | Cumple | Se quita un enlace externo a un mapa; no se añade ningún destino nuevo salvo `mailto:` y `tel:`. |
| V. SEO orgánico | No aplica | |
| VI. SEO técnico por página | Excepción heredada | Falta el schema MovingCompany en todas las páginas. Ya faltaba y el dueño lo dejó fuera de alcance; este cambio no lo empeora. |
| VII. NAP coherente | Cumple, es el objetivo | Nombre y teléfono únicos; la dirección deja de publicarse, como empresa con zona de servicio. Alinear Google Business Profile es tarea del dueño. |
| VIII. Contenido local | Cumple | Los textos de marketing sobre Miami se mantienen. |
| IX. Rendimiento | Cumple | Sin JS nuevo. |
| X. JS mínimo | Cumple | Solo cambios en datos y en componentes estáticos. |
| XI. Mobile first | Cumple | El enlace de llamada sigue en cabecera, menú, hero y pie, ahora con el número correcto. |
| XII. Simplicidad | Cumple | Solo lo pedido; no se crea una capa de datos nueva. |
| Tecnología y código | Cumple | Astro, React, Tailwind; sin `var`. |
| Idioma y tono | Cumple | Las líneas nuevas del pie están en inglés natural. |

Resultado: pasa. La única excepción (VI) es previa y el dueño la sacó del alcance.

## Project Structure

### Documentation (this feature)

```text
specs/002-consistent-company-data/
├── spec.md
├── plan.md              # Este archivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/
│   └── company-data.md  # Fase 1: dónde y cómo se muestra cada dato
├── checklists/
│   └── requirements.md
└── tasks.md             # Lo crea /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── data/
│   ├── site.ts              # Fuente única: datos corregidos, legalName, location, phoneHref derivado
│   ├── hero.ts              # "Call Now" usa site.phoneHref
│   ├── aboutUs.ts           # Sede en Miami, FL (descripción e insignia); Miami Lakes sigue como zona
│   ├── faqContent.ts        # "We're based in" usa site.location
│   ├── movingServices.ts    # Alt: "ProElite Movers"
│   └── guarantee.ts         # "ProElite" corto → "ProElite Movers"
├── types/
│   └── content.ts           # SiteConfig: + legalName, + location, − address, − addressHref
├── lib/
│   └── resend.ts            # Destino y remitente por defecto desde site
├── components/layout/
│   └── Footer.astro         # Ubicación sin enlace, correo, línea del nombre legal
└── pages/
    └── get-a-quote.astro    # "Location": Miami, FL sin enlace
```

**Structure Decision**: Se mantiene la estructura actual. `src/data/site.ts` ya es la fuente que leen `BaseLayout`, `Footer`, `NavMenu`, `Contacto` y la página de presupuesto; solo se corrige y se completa.

## Complexity Tracking

Sin violaciones que justificar.

## Post-Design Constitution Check

Revisado tras [data-model.md](data-model.md) y [contracts/company-data.md](contracts/company-data.md): el diseño no añade dependencias, JS ni rutas, y no cambia la conclusión anterior. Pasa.
