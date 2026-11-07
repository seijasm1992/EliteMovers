# Verificación

## Fase 1-3 (2026-11-07)

| Tarea | Resultado |
|-------|-----------|
| T001 | Rama `006-remove-moving-shark-images` creada desde `master` |
| T002 | `@ffmpeg-installer/ffmpeg` (build 20181217) instalado en la carpeta temporal de la sesión, fuera del proyecto. `package.json` sin cambios |
| T003 | `sharp` 0.34.5 (libvips 8.17.3) del proyecto, cargado desde los scripts temporales |
| T004 | 58 imágenes y 3 videos en `public/`, agrupados en 33 grupos (ver `review.md`) |
| T005 | Uso rastreado desde `src/pages/`. Sin uso: `2M.jpg` (`hero.slides` no se renderiza), `hero-slideshow.*` (`HeroSlider.tsx` no se importa), `movers-loading.webp` (768 px), las 18 fotos de `library/`, y como archivos servidos, los `.jpeg` de `included/` (salvo `crew-loading-wrapped-items.jpeg`, que usa About) y los `.jpg` de Servicios solo como respaldo |
| T006 | Build con `ENABLE_TURNSTILE=false` (no hay `.env` local): 27 rutas de imagen o video en `dist/client`, 0 sin archivo. Coincide con T005; los `.jpeg` de `included/` aparecen en el HTML solo como datos serializados del componente |
| T007 | 58 imágenes con `metadata = none` (sin EXIF, XMP, ICC, IPTC ni GPS). 3 videos sin marcas de ubicación (`©xyz`, `location`, `ISO6709`, `com.apple.quicktime`, `GPS`) |
| T008 | 15 vistas previas sin metadatos y `contact-sheet.html`, en la carpeta temporal |
| T009 | Fotogramas: `movers-hero.mp4` 13 (4 por segundo, dura 3,3 s), `hero-slideshow.mp4` 10, `hero-slideshow.webm` 10 |
| T010-T011 | Revisión visual: 6 grupos no cumplen (ver `review.md`, secciones 2 y 3) |
| T012 | 0 coincidencias de `shark` ni del teléfono. 2 coincidencias de `407` en `dist/`, ajenas al teléfono |
| T013-T016 | Acciones, 5 reemplazos, recortes revisados en `crops/` y código afectado en `review.md` |
| T017-T018 | `review.md` con las 6 secciones y 61 archivos. `git status`: sin cambios en `public/` ni en `src/` |
| T019 | Tabla entregada al dueño |

## Fase 4-6 (2026-11-07, tras la aprobación del dueño)

| Tarea | Resultado |
|-------|-----------|
| T020 | Aprobación registrada en `review.md` (36 filas): tabla completa, 5 reemplazos, borrar `HeroSlider.tsx`, conservar el favicon |
| T021-T026 | 13 archivos WebP de sección y 18 conversiones de la biblioteca, todos generados con `sharp` sin `withMetadata()` |
| T027 | No aplica: ningún WebP tenía metadatos |
| T028 | Todos los archivos nuevos son WebP con `metadata = none`. Cada variante de sección pesa menos que la que sustituye (por ejemplo, hero 720: 76 → 60 KB; Labor 720: 136 → 92 KB; Larga distancia 960: 105 → 88 KB). La biblioteca se volvió a codificar con calidad 79–85 para que cada WebP pese lo mismo o menos que su JPG (con calidad 90 pesaba más) |
| T029-T034 | Rutas y textos alternativos actualizados. `ServiceCard` y `ServiceModal` sin respaldo `.jpg`. `IncludedAccordion` sin el caso especial de `truck-loading-ramp`; los datos de Incluidos guardan el nombre base sin extensión para no dejar en el HTML rutas a archivos que no existen |
| Ajuste | La tarjeta Story de About es una franja baja: con la foto vertical centrada solo se veía cartón. Se generó un recorte horizontal 960×400 de la misma foto (`wrapped-dresser-storage-bins-truck-wide.webp`) y se retiró la variante `-720` |
| T035 | No aplica: `movers-hero.mp4` cumple y se conserva |
| T036 | `hero.slides` y el tipo `HeroSlide` eliminados; `HeroSlider.tsx` borrado |
| T037 | 42 archivos eliminados de `public/`, sin ninguna referencia en `src/` (lista en la carpeta temporal, `deleted.txt`, para T047) |
| T038 | No aplica: no había menciones que corregir |
| T039 | 0 coincidencias de `shark`, `984-9218` o `9849218` en `src/`, `public/`, `dist/` y la configuración. `407` solo aparece en un código de error de React, en una coordenada SVG y dentro de los datos binarios comprimidos de un WebP; nada es texto ni se refiere al teléfono |
| T040 | `npm run build`: correcto. `npm run astro -- check`: 3 errores, todos en `astro.config.mjs` ("Cannot find name 'process'"), un archivo que esta feature no modifica; ya existían antes de los cambios. 0 errores en archivos tocados |
| T041 | Build limpio (se borró `dist/` antes): 20 rutas de imagen o video, 0 sin archivo |
| T042 | Edge sin interfaz sobre `npm run preview`, a 390 y 1440 px, en las 4 páginas, abriendo cada ítem del acordeón y cada modal de servicio: 0 peticiones de imagen o video fallidas y 0 imágenes rotas. El servidor sirvió con 200 todas las variantes `-480`, `-720` y `-960`. Las 42 URLs eliminadas ya no devuelven imagen en local |
| T043 | Archivos nuevos revisados a ojo (recortes en la carpeta temporal `crops/`, capturas en `shots/`): todos cumplen |
| T044 | 0 archivos JPG/JPEG/PNG/GIF/HEIC en el repositorio, en `public/` y en `dist/`; 0 rutas a esos formatos en `src/` y `dist/`. Solo quedan `favicon.svg` y `favicon.ico` fuera de WebP |
| T045 | Este documento |

### Quickstart

| Paso | Resultado |
|------|-----------|
| 1. Tabla completa | 61 archivos, 33 grupos, todos con decisión y aprobación |
| 2. Nada antes de la aprobación | Ningún cambio en `public/` ni `src/` hasta T020 |
| 3. Build y tipos | Build correcto; 3 errores de tipos anteriores en `astro.config.mjs` |
| 4. Cero imágenes rotas | 0 |
| 5. Ninguna sección sin imagen | Correcto: hero (home y About), Story, 3 servicios, 5 incluidos, logo, og:image |
| 6. Reemplazos conformes | 5 reemplazos, solo WebP, sin metadatos, con texto alternativo nuevo, sin repetir en la misma página |
| 7. Ningún archivo incumple | Correcto |
| 8. Sin menciones | Correcto |
| 9. Eliminados sin referencias | 0 referencias |
| 9a. Solo WebP o AVIF | Correcto (salvo el favicon) |
| 10. Producción | Pendiente de que el dueño publique (T047) |
