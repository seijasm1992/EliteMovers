# Implementation Plan: Revisión de imágenes y reemplazo de las que tengan rastros de Moving Shark

**Branch**: `006-remove-moving-shark-images` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-remove-moving-shark-images/spec.md`

## Summary

Se revisan uno por uno los 58 archivos de imagen y los 3 videos de `public/`, estén en uso o no, con los criterios de FR-003. El resultado es una tabla (`review.md`) que el dueño aprueba antes de tocar nada. Tras la aprobación:

- cada grupo en uso que no cumple se reemplaza por una foto conforme de `public/images/`, generada con las mismas variantes y proporción que el componente ya pide. Solo cambia la ruta en `src/data/`;
- cada archivo sin uso que no cumple se elimina, después de quitar las referencias muertas que lo nombran;
- si un video tiene una escena que no cumple, se retira, y queda la imagen fija que ya está debajo en el hero;
- se eliminan las menciones de "Moving Shark", "Shark" y del 407;
- toda imagen que no esté en WebP o AVIF se convierte o se elimina (FR-014). Hoy son 28 JPG/JPEG: las 18 fotos de `library/`, 5 de `included/`, 3 de Servicios, la og:image, `2M.jpg` y `hero-slideshow-poster.jpg`. `ServiceCard` y `ServiceModal` dejan de pedir un `.jpg` de respaldo.

Las fotos de `library/` aprobadas en la spec 001 no se vuelven a revisar a ojo (aclaración de la spec); solo se convierten.

No se añaden dependencias al proyecto ni componentes nuevos. Las herramientas de un solo uso (`sharp`, ya instalado, y `@ffmpeg-installer/ffmpeg` en una carpeta temporal) se quedan fuera del repositorio ([research.md](research.md), R4 y R8).

## Technical Context

**Language/Version**: TypeScript y Astro 6 en el sitio. Node.js ≥ 22.12 para los scripts de un solo uso.

**Primary Dependencies**: Stack del proyecto (Astro 6, React 19 con islas, Tailwind 4, Cloudflare), sin cambios. `sharp` (ya en `node_modules`) para leer metadatos y generar variantes. `@ffmpeg-installer/ffmpeg` fuera del proyecto para extraer fotogramas.

**Storage**: Archivos estáticos en `public/`. Rutas de imagen en `src/data/*.ts` y `src/layouts/BaseLayout.astro`.

**Testing**: El proyecto no tiene scripts de pruebas. La validación es [quickstart.md](quickstart.md), más `npm run astro -- check` y `npm run build`.

**Target Platform**: Sitio estático en Cloudflare (`proelitemovers.com`). Herramientas en Windows 11.

**Project Type**: Sitio web existente. Cambio de contenido estático, con cambios mínimos de rutas en `src/`.

**Performance Goals**: Sin regresión de Core Web Vitals (principio IX). Los reemplazos pesan lo mismo o menos que lo que sustituyen, y la imagen LCP del hero mantiene su precarga.

**Constraints**:
- Nada cambia antes de que el dueño apruebe la tabla.
- Sin retoques para tapar marcas y sin imágenes generadas.
- Sin metadatos en ningún archivo nuevo.
- Solo WebP o AVIF en producción y en el proyecto, sin JPEG de respaldo (FR-014). Excepción: favicon.
- El repositorio es público: la tabla no transcribe datos privados.

**Scale/Scope**: 58 imágenes (unos 20 grupos de variantes) y 3 videos. 4 páginas: `/`, `/about-us/`, `/get-a-quote/`, `/privacy-policy/`.

### Estado medido (2026-11-07, solo lectura)

| Medición | Resultado |
|----------|-----------|
| Imágenes de `public/` con EXIF, XMP o ICC | 0 de 58 |
| Coincidencias de `shark` o `407` en `src/` | 0 |
| Grupos en uso | Hero (`movers-loading`), video del hero, 5 de Incluidos, 3 de Servicios, logo, favicon, og:image |
| Archivos sin uso | `2M.jpg`, `hero-slideshow.*` (3), `movers-loading.webp`, 4 `.jpeg` de `included/`, 18 fotos de `library/` |
| Referencias en código que no se renderiza | `hero.slides` → `/2M.jpg`; `HeroSlider.tsx` (no se importa) → `hero-slideshow.*` |
| `ffmpeg` o `exiftool` en el sistema | No |
| Imágenes en formatos distintos de WebP/AVIF/SVG en el repositorio | 29: 28 JPG/JPEG y `favicon.ico` |
| Código que pide JPEG | `ServiceCard.tsx` y `ServiceModal.tsx` (respaldo `.jpg`), `aboutUs.ts` (Story, `.jpeg`), `BaseLayout.astro` (og:image `.jpg`) |

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Nota |
|-----------|--------|------|
| I. Transparent Pricing | No aplica | Sin cambios de precios |
| II. Honesty | Cumple | Solo fotos reales del negocio |
| III. Real Images | Cumple y refuerza | No se generan imágenes y se retira cualquiera con apariencia de IA (FR-003, FR-009) |
| IV. Zero Broken Routes | Cumple con justificación | Ninguna página pide un archivo inexistente (FR-011). Las URLs de archivos eliminados responderán 404, pero no tienen enlaces publicados. Ver Complexity Tracking |
| V. Organic SEO | Cumple | Sin cambios de técnica |
| VI. Per-Page Technical SEO | Cumple | Cada reemplazo lleva texto alternativo fiel (FR-005). La og:image sigue existiendo |
| VII. Consistent NAP | Refuerza | Se quita cualquier teléfono distinto de +1 (786) 281-7825 |
| VIII. Local Content | No aplica | Sin contenido nuevo |
| IX. Performance | Cumple | Mismas variantes WebP y mismos anchos; la precarga del hero se actualiza si cambia la foto |
| X. Minimal JavaScript | Cumple o mejora | Si se retira el video, se quita JavaScript del hero |
| XI. Mobile First | Cumple | Sin cambios de interfaz |
| XII. Simplicity | Cumple | Sin componentes ni dependencias nuevas. Los scripts quedan fuera del repositorio |
| Idioma (contenido en inglés) | Cumple | Los textos alternativos nuevos están en inglés |

**Resultado antes de la investigación**: aprobado.

**Resultado después del diseño**: aprobado. El diseño cambia rutas en `src/data/` y `BaseLayout.astro`, quita el respaldo `.jpg` de `ServiceCard` y `ServiceModal`, quita referencias muertas y, si un video no cumple, el `<video>` del hero. Ninguna de estas acciones añade código; todas lo reducen.

## Project Structure

### Documentation (this feature)

```text
specs/006-remove-moving-shark-images/
├── plan.md              # Este archivo
├── research.md          # Decisiones técnicas (R1–R10)
├── data-model.md        # Entidades, campos y transiciones
├── quickstart.md        # Comprobaciones de la entrega
├── contracts/
│   └── review-table.md  # Formato de la tabla que aprueba el dueño
├── review.md            # Se crea al implementar: la tabla de revisión
├── verification.md      # Se crea al implementar: resultado de cada comprobación
└── tasks.md             # Lo crea /speckit-tasks
```

### Source Code (repository root)

Archivos que pueden cambiar, según lo que diga la tabla aprobada:

```text
public/
├── 2M.jpg, hero-slideshow.{mp4,webm}, hero-slideshow-poster.jpg   # Sin uso: se eliminan si no cumplen
├── service-{residential,long-distance,business}{-480,-720,}.webp  # Servicios; los .jpg se eliminan
└── images/
    ├── hero/        # movers-loading-* y movers-hero.mp4
    ├── included/    # 5 grupos de Incluidos; los .jpeg se eliminan
    ├── brand/       # Logo (se revisa, no se reemplaza salvo que no cumpla)
    ├── social/      # og:image, pasa a .webp
    └── library/     # Origen de los reemplazos; los .jpg pasan a .webp

src/
├── data/
│   ├── hero.ts              # hero.slides (referencia muerta a /2M.jpg)
│   ├── aboutUs.ts           # Hero y Story de About (Story deja de usar .jpeg)
│   ├── includedServices.ts  # Rutas de Incluidos
│   └── movingServices.ts    # Rutas de Servicios
├── layouts/BaseLayout.astro           # og:image por defecto (.webp) y precarga del hero
└── components/react/
    ├── ServiceCard.tsx, ServiceModal.tsx  # Quitar el respaldo .jpg; <img> usa la variante WebP de 960
    ├── HeroQuoteExperience.tsx        # Ruta de la imagen del hero y <video> (si se retira)
    └── HeroSlider.tsx                 # Componente sin uso (solo si el dueño aprueba borrarlo)
```

**Structure Decision**: Se conserva la estructura actual. Los reemplazos se generan en la misma carpeta de la sección (`images/hero/`, `images/included/`, raíz para servicios), con el patrón de nombre que ya esperan los componentes, para no tocar su lógica. `package.json` no cambia.

## Orden de ejecución

1. **Inventario (solo lectura)**: lista de archivos, grupos, uso real y metadatos (R1, R2).
2. **Revisión visual**: imágenes a tamaño completo y fotogramas de los videos, con hoja de contacto local (R3, R4).
3. **Búsqueda de texto** en `src/`, `public/` y `dist/` (R6).
4. **Propuesta de reemplazos** con las candidatas conformes de `public/images/` (R5, R10).
5. **Entrega de `review.md`**. **Parada obligatoria**: sin aprobación del dueño no se toca `public/` ni `src/` (FR-004).
6. **Reemplazos**: generar variantes, cambiar rutas y textos alternativos.
7. **Retiradas**: quitar referencias muertas y, si procede, el video; después, eliminar archivos (R9).
8. **Comprobación**: [quickstart.md](quickstart.md), con resultados en `verification.md`.
9. **Revisión del dueño**: tras su visto bueno se hace el commit; el dueño publica.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| El principio IV dice "No route may return a 404", y las URLs de los archivos eliminados responderán 404 | La spec pide que esos archivos dejen de estar accesibles (FR-008a). Según el dueño, el principio se refiere a enlaces publicados, y estos archivos no tienen ninguno: ninguna página los pide (FR-011) | Redirigirlos mantiene accesible la ruta y añade reglas que mantener. Conservarlos deja públicas imágenes con rastros de Moving Shark |
| `favicon.ico` se conserva aunque no es WebP ni AVIF | Los navegadores piden `/favicon.ico` por defecto; quitarlo genera peticiones 404 en cada visita. No es una foto y pesa 1 KB (spec, Assumptions) | Eliminarlo lo decide el dueño en la tabla; si lo aprueba, queda solo `favicon.svg` |
