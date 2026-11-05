# Inventario de recursos públicos

Medido el 2026-11-05, antes de cambiar nada. El repositorio es público, así que este informe indica el tipo de dato sensible y nunca su valor (FR-029). Las versiones de tamaño se agrupan con su imagen base; ninguna WebP tiene metadatos.

## Imágenes

| Archivo | Dónde se usa | Metadatos | Señalamientos | Acción ahora | Propuesta para el montaje |
|---------|--------------|-----------|---------------|--------------|---------------------------|
| `1M.jpg` | Imagen por defecto para compartir: `src/layouts/BaseLayout.astro:14`. También en `src/data/hero.ts:16`, sin uso en las páginas | Ninguno | Parece generada por IA | Retirar y reemplazar (FR-032) | Ya resuelta |
| `2M.jpg` | `src/data/hero.ts:17`, sin uso en las páginas | Ninguno | Parece de banco de imágenes | Ninguna | Retirar |
| `3M.jpg` | `src/data/hero.ts:18`, sin uso en las páginas | Ninguno | Parece generada por IA | Retirar (FR-031) | Ya resuelta |
| `4M.jpg` | `src/data/hero.ts:19`, sin uso en las páginas | XMP e IPTC con marca de IA | Generada por IA, confirmado | Retirar (FR-031) | Ya resuelta |
| `Componente.jpg` | Sin uso en las páginas | EXIF | Maqueta con fotos de otra empresa | Retirar (FR-019) | Ya resuelta |
| `hero-slideshow-poster.jpg` | `src/components/react/HeroSlider.tsx:3`, componente sin importar | Ninguno | `matrícula`, número de unidad de almacenamiento | Ninguna | Retirar |
| `images/brand/proelite-movers-logo.webp` | `src/components/react/NavMenu.tsx:55` | Ninguno | Ninguno | Ninguna | Conservar |
| `images/hero/movers-loading` (3 versiones) | `src/components/react/HeroQuoteExperience.tsx:82-83`, `src/layouts/BaseLayout.astro:57-58`, `src/data/aboutUs.ts:18-19` | Ninguno | Logo añadido; `persona identificable` (de espaldas) | Ninguna | Sustituir |
| `images/included/boxes-loading-ramp` (4 versiones) | `src/data/includedServices.ts:68` | **GPS**, EXIF, IPTC y perfil de color en `.jpeg` | `persona identificable`, vehículo y viviendas cercanos | Limpiar | Sustituir |
| `images/included/crew-loading-wrapped-items` (4 versiones) | `src/data/includedServices.ts:41`, `src/data/aboutUs.ts:62` | EXIF en `.jpeg` | **`moving-shark`** (camiseta, con parte del teléfono), `matrícula` | Limpiar | Sustituir |
| `images/included/storage-unit-loaded` (4 versiones) | `src/data/includedServices.ts:82` | **GPS**, EXIF, IPTC y perfil de color en `.jpeg` | `persona identificable` (de espaldas) | Limpiar | Conservar o sustituir |
| `images/included/truck-loading-ramp` (3 versiones) | `src/data/includedServices.ts:55` | EXIF e IPTC en `.jpeg` | `matrícula` legible, edificio reconocible | Limpiar | Sustituir |
| `images/included/wrapped-furniture-truck` (4 versiones) | `src/data/includedServices.ts:27` | EXIF en `.jpeg` | Ninguno | Limpiar | Conservar |
| `service-business` (4 versiones) | `src/data/movingServices.ts:67` | Ninguno | Ninguno | Ninguna | Conservar |
| `service-long-distance` (4 versiones) | `src/data/movingServices.ts:26` | Ninguno | **`moving-shark`** (camisetas, con teléfono), `persona identificable` (de espaldas) | Ninguna | Sustituir |
| `service-residential` (4 versiones) | `src/data/movingServices.ts:46` | Ninguno | Ninguno | Ninguna | Conservar |
| `favicon.svg`, `favicon.ico` | Icono del sitio | Ninguno | Ninguno | Ninguna | Conservar |

## Videos

Ninguno tiene marcas de ubicación ni muestra Moving Shark o imágenes de la lista de retirada. Se revisaron fotogramas cada 2 segundos, así que un detalle breve entre ellos podría no verse.

| Archivo | Dónde se usa | Metadatos | Señalamientos | Acción ahora | Propuesta para el montaje |
|---------|--------------|-----------|---------------|--------------|---------------------------|
| `images/hero/movers-hero.mp4` | `src/components/react/HeroQuoteExperience.tsx:94`, video del hero | Fecha de creación y programa de codificación, sin GPS | Número de unidad de almacenamiento, identificador del camión, `persona identificable` (lejos) | Ninguna | Sustituir o conservar, a decisión del dueño |
| `hero-slideshow.mp4` | `src/components/react/HeroSlider.tsx:1`, componente sin importar | Programa de codificación, sin GPS | `matrícula`, número de unidad, exterior de vivienda, pertenencias personales | Ninguna | Retirar |
| `hero-slideshow.webm` | `src/components/react/HeroSlider.tsx:2`, componente sin importar | Programa de codificación, sin GPS | Los mismos que el `.mp4` | Ninguna | Retirar |

## Otros archivos

| Archivo | Dónde se usa | Acción ahora |
|---------|--------------|--------------|
| `ProEliteMovers · Design System.pdf` | Sin uso en las páginas | Retirar (FR-019) |
| `fonts/`, `robots.txt`, `_headers` | Infraestructura del sitio | Ninguna |

## Imágenes generadas por IA

Solo `4M.jpg` está confirmada por sus metadatos. `1M.jpg` y `3M.jpg` lo parecen por su aspecto. Ninguna de las demás imágenes revisadas lo parece, pero esto es una valoración visual y no una prueba.
