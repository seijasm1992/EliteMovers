# Research: Revisión de imágenes y reemplazo de las que tengan rastros de Moving Shark

Decisiones técnicas de la fase 0. Todas las mediciones son del 2026-11-07, en solo lectura.

## R1. Inventario: cómo saber qué archivos están en uso

- **Decision**: Un archivo está "en uso" si lo pide alguna página renderizada. Se determina en dos pasos:
  1. Rastrear desde `src/pages/` los componentes que se renderizan de verdad, y anotar cada ruta de imagen o video que piden, incluidas las variantes `-480`, `-720` y `-960` que construyen `IncludedAccordion`, `ServiceCard` y `ServiceModal`, y el `.jpg` de respaldo de las tarjetas de servicio.
  2. Confirmarlo con el sitio generado: extraer de `dist/` todas las rutas de `/images/...` y de archivos de `public/` que aparecen en el HTML y en los bundles de JavaScript.
- **Rationale**: Una ruta escrita en `src/` no siempre se muestra. Hoy `HeroSlider.tsx` no se importa en ningún sitio, y `hero.slides` (`/2M.jpg`) está en los datos pero ningún componente lo pinta. Solo con el paso 1 se marcarían como en uso sin estarlo.
- **Alternatives considered**: Buscar solo con `grep` en `src/`. Se descartó por el falso positivo anterior.

### Estado medido

| Grupo | Archivos | En uso | Dónde |
|-------|----------|--------|-------|
| Hero de la home | `images/hero/movers-loading-480.webp`, `-720.webp` | Sí | Portada del hero (`HeroQuoteExperience`), precarga en `BaseLayout`, hero de About |
| Video del hero | `images/hero/movers-hero.mp4` | Sí, solo escritorio y sin movimiento reducido | `HeroQuoteExperience` |
| Incluidos | `images/included/*-480/-720/-960.webp` (5 fotos; `truck-loading-ramp` sin `-960`) | Sí | `IncludedAccordion` en la home |
| Incluidos JPEG | `images/included/crew-loading-wrapped-items.jpeg` | Sí | Tarjeta "How We Think" en About (`AboutStory`) |
| Incluidos JPEG | Los otros 4 `.jpeg` de `included/` | No (solo como nombre base en los datos) | — |
| Servicios | `service-*-480/-720.webp`, `service-*.webp`, `service-*.jpg` | Sí | `ServiceCard` y `ServiceModal` en la home |
| Marca | `images/brand/proelite-movers-logo.webp`, `favicon.svg`, `favicon.ico` | Sí | Todas las páginas |
| Compartir | `images/social/green-wrapped-furniture-truck.jpg` | Sí | og:image por defecto en `BaseLayout` |
| Sin uso | `2M.jpg`, `hero-slideshow.mp4`, `hero-slideshow.webm`, `hero-slideshow-poster.jpg`, `images/hero/movers-loading.webp`, las 18 fotos de `images/library/` | No | `2M.jpg` y `hero-slideshow.*` siguen nombrados en código sin renderizar |

Total: 58 archivos de imagen y 3 videos en `public/`.

## R2. Metadatos y GPS

- **Decision**: Leer los metadatos de cada imagen con `sharp` (EXIF, XMP, ICC, IPTC) y de cada video buscando las marcas de ubicación del contenedor (`©xyz`, `location`, `ISO6709`, `com.apple.quicktime`). Toda imagen nueva se genera sin metadatos: `sharp` los descarta por defecto si no se llama a `withMetadata()`.
- **Rationale**: Hoy ninguna imagen de `public/` tiene EXIF, XMP ni perfil ICC (la spec 001 los quitó). La comprobación se repite porque es un criterio de FR-003 y porque se van a crear archivos.
- **Alternatives considered**: `exiftool`. No está instalado, y `sharp` ya está en `node_modules`.

## R3. Revisión visual de las imágenes

- **Decision**: Revisar a ojo cada archivo a tamaño completo, salvo las fotos de `library/` ya aprobadas en la spec 001, y en una hoja de contacto HTML local para el dueño (fuera del repositorio). Para cada uno se anota qué muestra y se comprueban los criterios de FR-003 en este orden: Moving Shark (cualquier rastro, también parcial), teléfonos, logos añadidos o retocados, apariencia de IA, matrículas, números de casa, clientes o terceros identificables. Si hay duda, el archivo queda como "dudosa".
- **Señales de IA que se buscan**: texto deformado o ilegible en cajas y camiones, manos o caras deformes, geometría imposible, texturas demasiado lisas, iluminación incoherente, y marcas en los metadatos (C2PA, "Generated", nombres de herramientas).
- **Rationale**: Ninguna herramienta automática detecta logos de Moving Shark o imágenes de IA con fiabilidad suficiente. La decisión final es del dueño (FR-004).
- **Alternatives considered**: Un detector de IA en línea. Se descartó porque obliga a subir las fotos a un tercero y sus resultados no son fiables.

## R4. Revisión de los videos

- **Decision**: Extraer un fotograma cada segundo de cada video con `@ffmpeg-installer/ffmpeg`, instalado en una carpeta temporal fuera del proyecto, y revisarlos en una hoja de contacto con los mismos criterios. Si algún fotograma no cumple, el video se retira (FR-012). Si la herramienta falla, el dueño ve los videos completos y la tabla lo indica.
- **Rationale**: No hay `ffmpeg` en el sistema. Un fotograma por segundo detecta cualquier escena visible el tiempo suficiente como para notarse. Es la misma solución que usó la spec 001.
- **Si se retira `movers-hero.mp4`**: se quitan del hero el elemento `<video>` y la lógica que lo activa, y queda la imagen fija del hero, que ya existe debajo. No se añade código.
- **Alternatives considered**: Editar los videos para quitar escenas. Está prohibido por FR-012.

## R5. Formato de los reemplazos

- **Decision**: Cada reemplazo se genera desde la foto elegida de `public/images/` con `sharp`, con los mismos nombres de variante, anchos y proporción que el componente ya pide:

  | Sección | Proporción | Archivos que se generan |
  |---------|------------|-------------------------|
  | Hero (home y About) | 3:4 vertical | `-480.webp`, `-720.webp` |
  | Incluidos (home) y Story (About) | 3:4 vertical | `-480.webp`, `-720.webp`, `-960.webp` |
  | Servicios | 4:3 horizontal | `-480.webp`, `-720.webp`, `.webp` (960) |
  | og:image | 1200×630 | `.webp` |

  El recorte se centra en el contenido principal. Nunca se usa para ocultar una marca (FR-009): si la única forma de quitar una marca es recortarla, la foto no sirve.
- **Rationale**: Las secciones ya piden estos nombres de variante, así que solo cambia la ruta en `src/data/` y no aparecen 404 por variantes que falten. La calidad WebP es 78–82, en línea con el peso actual de los archivos. Se elige WebP y no AVIF porque todos los navegadores actuales lo muestran y `sharp` lo codifica rápido; AVIF queda permitido por la spec, pero no aporta lo suficiente para mantener dos formatos.
- **Sin JPEG (FR-014)**:
  - `ServiceCard` y `ServiceModal`: se quita `fallbackImage`, que pide `.jpg`; el `<img>` usa `service.image` (la variante WebP de 960). El `<source type="image/webp">` se puede conservar o integrar en el `<img>` con `srcSet`; se elige lo que cambie menos líneas.
  - Story de About: `aboutUs.ts` apunta a `-720.webp` en lugar del `.jpeg`.
  - `includedServices.ts`: `image` usa el nombre base con `.webp` (por ejemplo `/images/included/wrapped-furniture-truck.webp`). `responsiveImage` ya quita `.webp` y solo pide las variantes, así que el archivo sin sufijo no hace falta. R7 confirma que nadie lo pide.
  - og:image en WebP: Facebook, LinkedIn, X, WhatsApp y Slack muestran WebP en las vistas previas. Si algún cliente antiguo no lo muestra, el enlace se comparte igual sin imagen; es un riesgo aceptado por la regla del dueño.
- **Alternatives considered**: Usar `astro:assets` para generar las variantes. Obliga a mover las fotos fuera de `public/` y cambiar varios componentes, lo que sería un rediseño fuera de alcance.

## R5a. Conversión de las imágenes existentes que no son WebP

- **Decision**: Para cada imagen JPG/JPEG que queda tras la revisión:

  | Archivo | Acción |
  |---------|--------|
  | 18 fotos de `images/library/*.jpg` | Convertir a `.webp` del mismo tamaño, sin metadatos, con la calidad más alta (entre 79 y 85) que no pese más que el JPG, y eliminar el `.jpg`. Se probó primero calidad 90, pero pesaba más que el original |
  | `images/included/*.jpeg` (5) | Eliminar: ya existen sus variantes WebP. La foto de Story pasa a `-720.webp` |
  | `service-*.jpg` (3) | Eliminar tras quitar el respaldo en los componentes: ya existen sus variantes WebP |
  | `images/social/green-wrapped-furniture-truck.jpg` | Convertir a `.webp` de 1200×630 (o al reemplazo que apruebe el dueño) y eliminar el `.jpg` |
  | `2M.jpg`, `hero-slideshow-poster.jpg` | Sin uso: eliminar tras quitar sus referencias muertas (R9). No se convierten porque nadie las usa |

- **Rationale**: Convertir solo lo que se usa o sirve de biblioteca, y eliminar lo que ya tiene variantes WebP, deja el proyecto sin JPEG con el menor trabajo posible.
- **Revisión de la biblioteca**: las fotos de `library/` aprobadas en la spec 001 no se vuelven a revisar a ojo (aclaración del dueño). En la tabla aparecen como "Cumple (revisada en 001)".

## R6. Búsqueda de "Moving Shark", "Shark" y 407

- **Decision**: Buscar sin distinguir mayúsculas `shark`, `407`, `984-9218`, `9849218` y `984 9218` en `src/`, `public/` (nombres de archivo, SVG y metadatos), archivos de configuración y en `dist/` después del build. Cada coincidencia se anota con su ubicación. Las de `407` que no son el teléfono (hashes, medidas, códigos de color) se descartan explicando por qué.
- **Estado medido**: `src/` no tiene coincidencias de `shark` ni de `407`. Falta revisar `dist/` y los metadatos de los videos.
- **Rationale**: Los hashes de los bundles generados pueden contener `407` por casualidad, y no deben confundirse con el teléfono.
- **Alternatives considered**: Buscar solo en `src/`. No cubre los textos que se insertan al generar el sitio.

## R7. Comprobación de cero imágenes rotas

- **Decision**: Después de `npm run build`, un script lee todas las rutas de imagen y video de `dist/` (HTML, `srcset`, `imagesrcset`, `og:image` y bundles JS) y comprueba que cada archivo existe en `dist/`. Después, con `npm run preview`, se abren las 4 páginas en móvil y escritorio y se mira que no haya peticiones de imagen fallidas en la pestaña de red, también abriendo cada acordeón y cada modal de servicio.
- **Rationale**: Las variantes se construyen en tiempo de ejecución en React y no aparecen literalmente en el HTML, así que el script solo no basta.
- **Alternatives considered**: Pruebas automáticas con navegador. El proyecto no tiene scripts de pruebas y el principio XII no permite añadirlos sin pedirlo.

## R8. Dónde viven los scripts y la tabla

- **Decision**: Los scripts de inventario, metadatos, fotogramas y generación son de un solo uso y se quedan fuera del repositorio, en la carpeta temporal de la sesión. La tabla de revisión va en `specs/006-remove-moving-shark-images/review.md`, con el formato de [contracts/review-table.md](contracts/review-table.md).
- **Rationale**: El repositorio es público. La tabla describe el tipo de elemento ("matrícula legible"), nunca su valor, igual que en la spec 001.
- **Alternatives considered**: Guardar los scripts en el repositorio. No es código pedido (principio XII).

## R9. Eliminación de archivos y referencias muertas

- **Decision**: Un archivo se borra de `public/` solo cuando (a) el dueño aprobó la tabla y (b) ninguna ruta de `src/` ni de `dist/` lo nombra. Si un archivo sin uso que no cumple está nombrado en código que no se renderiza (`2M.jpg` en `hero.slides`, `hero-slideshow.*` en `HeroSlider.tsx`), primero se quita esa referencia y después el archivo.
- **Rationale**: Cumple FR-008 y FR-008a sin dejar rutas que apunten a archivos inexistentes.
- **Nota sobre `HeroSlider.tsx`**: si sus 3 archivos se eliminan, el componente queda sin recursos. Se borra el archivo del componente solo si el dueño lo aprueba en la tabla. Si no lo aprueba, se deja tal cual y la tabla lo anota como componente muerto.

## R10. Repetición de fotos

- **Decision**: "Secciones cercanas" se comprueba por página: Hero → Servicios → Incluidos en la home, y Hero → Story en About. Una foto no se repite dentro de una misma página. Si hay que repetir (FR-006), la tabla lo marca con "Repetida" y la sección donde ya se usa.
- **Estado medido**: hoy `crew-loading-wrapped-items` aparece en Incluidos (home) y en Story (About). Son páginas distintas, así que no infringe FR-006.
