# Implementation Plan: Selección de imágenes reales y limpieza de metadatos

**Branch**: `001-replace-site-images` | **Date**: 2026-11-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-replace-site-images/spec.md`

## Summary

Este trabajo tiene dos partes separadas por una aprobación del dueño:

1. **Revisión y selección**: revisar los 73 archivos de foto de la carpeta de originales y entregar hasta 15 candidatas. La lista aprobada se guarda sin fotos.
2. **Limpieza invisible**: quitar los metadatos de las 5 imágenes que los tienen y siguen publicadas; retirar `Componente.jpg`, el PDF del Design System y las imágenes generadas por IA que no se muestran en las páginas (`3M.jpg`, `4M.jpg`, y `1M.jpg` según FR-032).

Las páginas se siguen viendo igual. En `src/` solo se quitan las referencias a lo retirado. No se añaden dependencias al proyecto, y la única foto nueva en `public/` es la que el dueño elija para compartir en redes (FR-032). Los metadatos se quitan sin recomprimir, para que la imagen quede idéntica ([research.md](research.md), R1).

## Technical Context

**Language/Version**: Node.js 22.18 (cumple `>=22.12` del proyecto). Scripts de un solo uso, fuera del repositorio.

**Primary Dependencies**: Stack del proyecto según `AGENTS.md` y `CLAUDE.md` (Astro 6, React 19 con islas, Tailwind 4, Cloudflare). Este trabajo no modifica nada de ese stack. `sharp` 0.34.5, ya presente en `node_modules`, se usa solo para leer metadatos y generar vistas previas. Zustand aparece en `AGENTS.md`, pero no está instalado y no se añade.

**Storage**: Archivos. Los informes van en `specs/001-replace-site-images/`. Las vistas previas y los manifiestos quedan fuera del repositorio.

**Testing**: El proyecto no tiene scripts de pruebas. La validación son las comprobaciones de [quickstart.md](quickstart.md), más `npm run astro -- check` y `npm run build`.

**Target Platform**: Sitio en Cloudflare (`proelitemovers.com`). Herramientas ejecutadas en Windows 11.

**Project Type**: Sitio web existente; cambio de contenido estático, sin código de aplicación.

**Performance Goals**: Sin regresión. Las imágenes conservan contenido y dimensiones, y pesan lo mismo o menos.

**Constraints**: Originales intactos; ninguna foto elegida en el proyecto; 0 diferencias visibles; el repositorio es público, así que los informes no transcriben datos privados (FR-029).

**Scale/Scope**: 73 archivos de foto y 21 videos ignorados en los originales. 41 imágenes y 3 videos publicados.

### Estado medido (2026-11-05, solo lectura)

| Medición | Resultado |
|----------|-----------|
| Imágenes publicadas con GPS | 2: `boxes-loading-ramp.jpeg`, `storage-unit-loaded.jpeg` |
| Otras imágenes con metadatos | 5: `truck-loading-ramp.jpeg`, `crew-loading-wrapped-items.jpeg`, `wrapped-furniture-truck.jpeg`, `4M.jpg`, `Componente.jpg` (esta última se retira) |
| Imágenes con orientación distinta de la normal | 0 |
| Imágenes con perfil de color | 2: las mismas con GPS |
| WebP con metadatos | 0 |
| Videos publicados con marcas conocidas de ubicación | 0 de 3 |
| Referencias a `Componente.jpg` o al PDF en el proyecto | 0 |
| Originales con GPS | 50 de 73 (23 `.jpeg`, 27 `.HEIC`) |
| HEIC que `sharp` puede decodificar | 0 de 28 |
| Duplicados exactos entre originales | 0; tampoco coinciden los nombres entre `original/` y las copias convertidas |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Nota |
|-----------|--------|------|
| I. Transparent Pricing | No aplica | Sin cambios de precios |
| II. Honesty | Cumple | FR-013 no permite inventar datos |
| III. Real Images | Corrige un incumplimiento | No se generan imágenes, el dueño aprueba cada una y se retiran las generadas por IA (FR-031, FR-032) |
| IV. Zero Broken Routes | Cumple con justificación | Ver Complexity Tracking |
| V. Organic SEO | Cumple | Sin cambios |
| VI. Per-Page Technical SEO | Cumple | Rutas y textos alternativos no cambian |
| VII. Consistent NAP | No aplica | Fuera de alcance |
| VIII. Local Content | No aplica | Sin contenido nuevo |
| IX. Performance | Cumple | Mismas imágenes, con igual o menor peso |
| X. Minimal JavaScript | Cumple | Sin JavaScript nuevo en el sitio |
| XI. Mobile First | Cumple | Sin cambios de interfaz |
| XII. Simplicity | Cumple | Sin código ni dependencias nuevas en el proyecto |

**Resultado antes de la investigación**: aprobado.

**Resultado después del diseño**: aprobado. El diseño no añade código al sitio, y el paquete temporal para HEIC ([research.md](research.md), R3) se queda fuera del proyecto.

## Project Structure

### Documentation (this feature)

```text
specs/001-replace-site-images/
├── plan.md              # Este archivo
├── research.md          # Decisiones técnicas
├── data-model.md        # Entidades y estados
├── quickstart.md        # Comprobaciones de la entrega
├── contracts/
│   └── reports.md       # Formato de los informes
├── inventory.md         # Se crea al implementar: recursos públicos
├── selection.md         # Se crea al implementar: lista aprobada, sin fotos
├── verification.md      # Se crea al implementar: resultado de cada comprobación
└── tasks.md             # Lo crea /speckit-tasks
```

### Source Code (repository root)

```text
public/
├── 1M.jpg                                      # Se retira y se reemplaza (FR-032)
├── 3M.jpg                                      # Se retira
├── 4M.jpg                                      # Se retira (generada por IA, confirmado)
├── Componente.jpg                              # Se retira
├── ProEliteMovers · Design System.pdf          # Se retira
└── images/
    ├── library/                                # Nueva: copias optimizadas de las fotos aprobadas (FR-009)
    ├── social/                                 # Nueva: foto para compartir (FR-032)
    └── included/
    ├── boxes-loading-ramp.jpeg                 # Sin metadatos (tenía GPS)
    ├── storage-unit-loaded.jpeg                # Sin metadatos (tenía GPS)
    ├── truck-loading-ramp.jpeg                 # Sin metadatos
    ├── crew-loading-wrapped-items.jpeg         # Sin metadatos
    └── wrapped-furniture-truck.jpeg            # Sin metadatos

src/
├── data/hero.ts                                # Se quitan de hero.slides las imágenes retiradas
└── layouts/BaseLayout.astro                    # Imagen por defecto para compartir y su texto (FR-032)
```

**Structure Decision**: No cambia `package.json`, y `src/` solo cambia para quitar referencias a lo retirado. Los scripts son de un solo uso y se quedan fuera del repositorio (principio XII). La subcarpeta `public/images/services/` que se propuso antes queda para el montaje posterior.

## Orden de ejecución

1. **Línea base (solo lectura)**: manifiesto de huellas de los originales e inventario de los recursos públicos.
2. **Revisión**: decodificar los originales, generar vistas previas fuera del repositorio, revisar y señalar.
3. **Parada obligatoria**: el dueño aprueba la selección (FR-007). Sin esa aprobación no se toca `public/`.
4. **Limpieza**: quitar metadatos y retirar los 2 archivos.
5. **Comprobación local**: [quickstart.md](quickstart.md), sin commit (FR-025).
6. **Revisión del dueño**: tras su visto bueno se hace el commit; el dueño publica y avisa (FR-027).
7. **Comprobación en producción**: resultados finales en `verification.md`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| El principio IV dice "No route may return a 404", y las 2 URLs retiradas pueden responder 404 | El dueño pide que esos archivos dejen de estar accesibles. Según el dueño, el principio significa que ningún enlace publicado puede llevar a un 404. Estos archivos no tienen enlaces publicados (FR-023) | Redirigirlos añade reglas que mantener, y conservarlos no cumple el pedido |
