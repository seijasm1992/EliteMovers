# Tabla de revisión de imágenes y videos

Revisión del 2026-11-07, según [contracts/review-table.md](contracts/review-table.md). Nada de `public/` ni de `src/` ha cambiado todavía (FR-004).

Las fotos se ven en la hoja de contacto local `contact-sheet.html` y en las carpetas `previews/` y `frames/` de la carpeta temporal de la sesión. Los datos privados se describen por tipo, nunca por su valor.

## 1. Resumen

| Total grupos | Archivos | En uso | Sin uso | Cumplen | No cumplen | Dudosas | Videos revisados |
|--------------|----------|--------|---------|---------|------------|---------|------------------|
| 33 | 61 (58 imágenes, 3 videos) | 13 grupos | 20 grupos | 27 | 6 | 0 | 3 (33 fotogramas) |

**Lo más importante:**

- **3 imágenes en uso muestran Moving Shark o una huella de Moving Shark**:
  - `service-long-distance`: camisetas con "MOVING SHARK" y el teléfono 407.
  - `crew-loading-wrapped-items`: camiseta con otro logo y un teléfono que termina en "-9218".
  - `movers-loading` (hero de la home y de About): es **la misma foto que `service-long-distance` con el logo de ProElite pegado encima** de las camisetas de Moving Shark. Los logos no siguen los pliegues de la tela.
- **1 imagen en uso muestra una matrícula legible**: `truck-loading-ramp`.
- **2 grupos sin uso no cumplen**: `2M.jpg` (foto de stock, no es del equipo) y `hero-slideshow.*` (matrícula legible).
- **Metadatos**: ninguna imagen tiene EXIF, XMP, ICC ni GPS. Ningún video tiene marcas de ubicación.
- **Texto**: 0 menciones de "Shark" ni del teléfono 407-984-9218 en el código, la configuración, `public/` y el sitio generado (sección 5).

## 2. Archivos

| # | Archivos | Formato | En uso | Dónde se usa | Qué muestra | Metadatos | Estado | Motivos | Acción | Reemplazo propuesto | Aprobado |
|---|----------|---------|--------|--------------|-------------|-----------|--------|---------|--------|---------------------|----------|
| 1 | `images/hero/movers-loading-480.webp`, `-720.webp`, `movers-loading.webp` | webp | Sí (el de 768 px, no) | `/ › Hero` (imagen fija y precarga), `/about-us/ › Hero` | Dos empleados de espaldas cargando muebles envueltos en verde en un camión. Los logos de ProElite de las camisetas están añadidos digitalmente sobre la misma foto de la fila 9, donde las camisetas dicen Moving Shark | none | No cumple | logo-añadido, moving-shark | Reemplazar | `library/mover-walking-boxes-moving-truck` | Sí |
| 2 | `images/included/crew-loading-wrapped-items-480.webp`, `-720.webp`, `-960.webp`, `.jpeg` | webp + jpeg | Sí | `/ › Incluidos › Wall, Floor, and Door Protection`, `/about-us/ › Story › How We Think` (`.jpeg`) | Empleado de espaldas empujando muebles envueltos dentro de un camión, junto a una moto. Su camiseta lleva otro logo con ilustración y un teléfono que termina en "-9218". Matrícula de la moto parcialmente visible | none | No cumple | moving-shark, otro-telefono | Reemplazar (2 secciones) | Incluidos: `library/padded-wrapped-furniture-truck`. Story: `library/wrapped-dresser-storage-bins-truck` | Sí |
| 3 | `images/included/truck-loading-ramp-480.webp`, `-720.webp`, `.jpeg` | webp + jpeg | Sí | `/ › Incluidos › Crew, Truck, and Labor` | Parte trasera de un camión cargado con rampa, frente a edificios | none | No cumple | matricula | Reemplazar | `library/stacked-boxes-hand-truck-moving-truck` | Sí |
| 4 | `images/included/wrapped-furniture-truck-480.webp`, `-720.webp`, `-960.webp`, `.jpeg` | webp + jpeg | Sí | `/ › Incluidos › Furniture Disassembly and Reassembly` | Muebles envueltos en film verde y cajas dentro de un camión. Sin personas | none | Cumple | — | Conservar los WebP. Eliminar el `.jpeg` | — | Sí |
| 5 | `images/included/boxes-loading-ramp-480.webp`, `-720.webp`, `-960.webp`, `.jpeg` | webp + jpeg | Sí | `/ › Incluidos › Live Crew Tracking` | Empleado de perfil con gorra cargando cajas en un tráiler con rampa, en una entrada residencial. Sin matrículas ni números de casa legibles | none | Cumple | — | Conservar los WebP. Eliminar el `.jpeg` | — | Sí |
| 6 | `images/included/storage-unit-loaded-480.webp`, `-720.webp`, `-960.webp`, `.jpeg` | webp + jpeg | Sí | `/ › Incluidos › Move Updates from Booking to Completion` | Empleado de espaldas en un trastero con cajas azules apiladas | none | Cumple | — | Conservar los WebP. Eliminar el `.jpeg` | — | Sí |
| 7 | `service-residential-480.webp`, `-720.webp`, `.webp`, `.jpg` | webp + jpeg | Sí | `/ › Servicios › Residential Moving` (tarjeta y modal) | Cajas, bolsas negras y una maleta en una habitación, junto a muebles con mantas | none | Cumple | — | Conservar los WebP. Eliminar el `.jpg` y su respaldo en el código | — | Sí |
| 8 | `service-business-480.webp`, `-720.webp`, `.webp`, `.jpg` | webp + jpeg | Sí | `/ › Servicios › Business Moving` (tarjeta y modal) | Almacén vacío con estructuras de estanterías y una escalera roja | none | Cumple | — | Conservar los WebP. Eliminar el `.jpg` y su respaldo en el código | — | Sí |
| 9 | `service-long-distance-480.webp`, `-720.webp`, `.webp`, `.jpg` | webp + jpeg | Sí | `/ › Servicios › Long Distance Moving` (tarjeta y modal) | Dos personas de espaldas cargando muebles envueltos. Camisetas con el logo de Moving Shark, "MOVING SHARK" y "407-984-9218" | none | No cumple | moving-shark, otro-telefono | Reemplazar | `library/trailer-boxes-pallet-jack` | Sí |
| 10 | `images/hero/movers-hero.mp4` | mp4 | Sí (escritorio) | `/ › Hero` (video de fondo) | Ver sección 3 | sin marcas | Cumple | — | Conservar | — | Sí |
| 11 | `images/brand/proelite-movers-logo.webp` | webp | Sí | Todas › Navegación | Logo de ProElite Movers | none | Cumple | — | Conservar | — | Sí |
| 12 | `favicon.svg`, `favicon.ico` | svg, ico | Sí | Todas › Icono de la pestaña | **El icono por defecto de Astro**, no el de ProElite. No es Moving Shark | none | Cumple FR-003 (observación) | — | Conservar (excepción de FR-014). Ver pregunta 3 | — | Sí |
| 13 | `images/social/green-wrapped-furniture-truck.jpg` | jpeg | Sí | Todas › og:image | Muebles envueltos en film verde y cajas en un camión (la misma escena que la fila 4) | none | Cumple | — | Convertir a WebP 1200×630 y eliminar el `.jpg` | — | Sí |
| 14 | `2M.jpg` | jpeg | No (nombrada en `hero.slides`, no se renderiza) | — | Foto de stock: dos operarios con uniforme rojo y gris en un salón de estudio. No es del equipo | none | No cumple | apariencia-ia (foto de stock, no real del equipo) | Eliminar y quitar `hero.slides` | — | Sí |
| 15 | `hero-slideshow.mp4`, `hero-slideshow.webm`, `hero-slideshow-poster.jpg` | mp4, webm, jpeg | No (solo `HeroSlider.tsx`, que no se importa) | — | Camión cargado frente a trasteros; interiores de camión; camión en una calle residencial. La portada y los primeros segundos muestran una matrícula legible | none / sin marcas | No cumple | matricula | Eliminar. Ver pregunta 2 sobre `HeroSlider.tsx` | — | Sí |
| 16 | `images/library/box-truck-liftgate-house-driveway.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 17 | `images/library/box-truck-warehouse-dock-door.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 18 | `images/library/condo-room-packed-boxes-bags.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 19 | `images/library/green-wrapped-furniture-truck.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 20 | `images/library/mattress-boxes-strapped-moving-truck.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 21 | `images/library/mover-walking-boxes-moving-truck.jpg` | jpeg | No → Sí | Reemplazo del hero | Empleado de espaldas caminando dentro de un camión hacia cajas apiladas | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 22 | `images/library/padded-wrapped-furniture-truck.jpg` | jpeg | No → Sí | Reemplazo en Incluidos › Protection | Muebles con fundas acolchadas, plástico de burbujas y mantas, en filas dentro de un camión | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 23 | `images/library/stacked-boxes-hand-truck-moving-truck.jpg` | jpeg | No → Sí | Reemplazo en Incluidos › Labor | Filas de cajas apiladas en un camión, con una carretilla roja a la derecha | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 24 | `images/library/stacked-storage-totes-moving-truck.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 25 | `images/library/storage-unit-household-items.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 26 | `images/library/storage-unit-mover-furniture.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 27 | `images/library/storage-unit-stacked-boxes.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 28 | `images/library/trailer-boxes-pallet-jack.jpg` | jpeg | No → Sí | Reemplazo en Servicios › Long Distance | Cajas y bultos envueltos al fondo de un tráiler largo, con una transpaleta amarilla | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 29 | `images/library/warehouse-aisle-forklift-crew.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 30 | `images/library/warehouse-shelving-packed-boxes.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 31 | `images/library/wrapped-doors-moving-truck.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 32 | `images/library/wrapped-dresser-storage-bins-truck.jpg` | jpeg | No → Sí | Reemplazo en About › Story | Muebles envueltos en film junto a cubos de almacenaje apilados, dentro de un camión | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |
| 33 | `images/library/wrapped-furniture-shelving-truck.jpg` | jpeg | No | — | Ver spec 001 | none | Cumple (revisada en 001) | — | Convertir a WebP | — | Sí |

## 3. Videos

| Video | En uso | Duración | Fotogramas revisados | Escenas que no cumplen (segundo y motivo) | Estado | Acción | Aprobado |
|-------|--------|----------|----------------------|-------------------------------------------|--------|--------|----------|
| `images/hero/movers-hero.mp4` | Sí (escritorio, sin movimiento reducido) | 3,3 s | 13 (4 por segundo) | Ninguna. Trasteros y un camión de alquiler con un empleado cargando; la matrícula queda cortada en el borde y no se lee; el número del camión es de la flota de alquiler, no una matrícula | Cumple | Conservar | Sí |
| `hero-slideshow.mp4` | No | 10,4 s | 10 | 0–3 s: matrícula legible en la parte trasera del camión. 7–10 s: camión de alquiler en una calle residencial | No cumple | Eliminar | Sí |
| `hero-slideshow.webm` | No | 10,4 s | 10 | Mismo contenido que el `.mp4` | No cumple | Eliminar | Sí |

## 4. Reemplazos

Todos salen de fotos de `public/images/library/` aprobadas en la spec 001. Solo WebP, sin metadatos.

| Sección | Imagen actual | Foto de reemplazo | Recorte | Variantes generadas | Texto alternativo nuevo | Repetida |
|---------|---------------|-------------------|---------|---------------------|-------------------------|----------|
| `/ › Hero` y `/about-us/ › Hero` | `movers-loading` | `library/mover-walking-boxes-moving-truck` | Ninguno (ya es 3:4) | `images/hero/mover-walking-boxes-truck-480.webp`, `-720.webp` | Home: decorativa (`alt=""`, como ahora). About: "A ProElite Movers crew member walking through a moving truck toward stacked moving boxes" | No (en About, Story usa otra foto) |
| `/ › Incluidos › Protection` | `crew-loading-wrapped-items` | `library/padded-wrapped-furniture-truck` | Ninguno (3:4) | `images/included/padded-wrapped-furniture-truck-480.webp`, `-720.webp`, `-960.webp` | "Furniture protected with padded covers, bubble wrap and moving blankets inside a moving truck" | No |
| `/ › Incluidos › Labor` | `truck-loading-ramp` | `library/stacked-boxes-hand-truck-moving-truck` | Ninguno (3:4) | `images/included/stacked-boxes-hand-truck-480.webp`, `-720.webp`, `-960.webp` | "Rows of stacked moving boxes inside a truck, with a red hand truck ready to load" | No |
| `/about-us/ › Story › How We Think` | `crew-loading-wrapped-items.jpeg` | `library/wrapped-dresser-storage-bins-truck` | Horizontal 960×400 de la parte central (muebles envueltos, cestas y cubo), porque la tarjeta es una franja baja | `images/included/wrapped-dresser-storage-bins-truck-wide.webp` (la tarjeta solo usa una imagen) | "Furniture wrapped in plastic film below storage baskets and beside a gray bin inside a moving truck" | No |
| `/ › Servicios › Long Distance` | `service-long-distance` | `library/trailer-boxes-pallet-jack` | 4:3 horizontal, desde la mitad inferior: carga y transpaleta | `service-long-distance-trailer-480.webp`, `-720.webp`, `.webp` (960) | "Boxes and wrapped items loaded at the end of a long trailer, with a yellow pallet jack in the foreground" | No |
| Todas › og:image | `social/green-wrapped-furniture-truck.jpg` | La misma foto (`library/green-wrapped-furniture-truck`) | 1200×630 centrado en los muebles envueltos | `images/social/green-wrapped-furniture-truck.webp` | Sin cambio | — |

Los reemplazos usan nombres nuevos, en lugar de sobrescribir los archivos actuales, para que ningún navegador ni la caché de Cloudflare sigan sirviendo la foto vieja con el mismo nombre.

## 5. Menciones de texto

| Ubicación | Coincidencia | ¿Empresa anterior? | Acción |
|-----------|--------------|--------------------|--------|
| `dist/client/_astro/client.*.js` | `407` | No: código de error interno de React (`Error(s(407))`) | Ninguna |
| `dist/server/chunks/worker-entry_*.mjs` | `407` | No: coordenada de un trazado SVG (`42.4073`) | Ninguna |

Sin coincidencias de `shark`, `984-9218`, `9849218` ni `984 9218`. Se buscó en `src/`, `public/` (nombres de archivo y contenido de `favicon.svg`), `astro.config.mjs`, `wrangler.jsonc`, `package.json`, `.env.example`, los metadatos de imágenes y videos, y `dist/`.

`src/bugs/IMG_2393.mov` dio una coincidencia binaria de `407`. Es un archivo sin seguimiento en git, ajeno a esta feature, y no forma parte del sitio; no se toca.

## 6. Código afectado

| Archivo | Cambio |
|---------|--------|
| `src/components/react/HeroQuoteExperience.tsx` | Ruta y `srcSet` de la imagen fija del hero |
| `src/layouts/BaseLayout.astro` | Precarga del hero (`href`, `imagesrcset`) y og:image por defecto (`.webp`) |
| `src/data/aboutUs.ts` | `hero.image` (`src480`, `src720`, `alt`) y la imagen de la tarjeta Story |
| `src/data/includedServices.ts` | `image` de los 5 ítems con nombre base `.webp`; ruta e `imageAlt` nuevos en Protection y Labor |
| `src/components/react/IncludedAccordion.tsx` | Quitar el caso especial de `truck-loading-ramp` (sin `-960`), porque la foto nueva tiene las 3 variantes |
| `src/data/movingServices.ts` | `image` e `imageAlt` de Long Distance |
| `src/components/react/ServiceCard.tsx`, `ServiceModal.tsx` | Quitar el respaldo `.jpg` |
| `src/data/hero.ts`, `src/types/content.ts` | Quitar `hero.slides` (solo apuntaba a `2M.jpg`) |
| `src/components/react/HeroSlider.tsx` | Borrar, solo si lo apruebas (pregunta 2) |

## Preguntas para el dueño

1. **¿Apruebas la tabla?** Es decir: los 6 grupos que no cumplen, los 5 reemplazos de la sección 4 y la conversión o eliminación de los JPEG.
2. **`HeroSlider.tsx`**: es un componente que ninguna página usa y que solo sirve para los videos `hero-slideshow.*`. Al eliminar esos videos queda roto. ¿Lo borro? *(Recomendado: sí.)*
3. **Favicon**: el icono de la pestaña es el logo por defecto de Astro, no el de ProElite. No incumple FR-003 y cambiarlo implica crear un icono nuevo, que está fuera del alcance. ¿Lo dejamos para otra tarea? ¿Y conservamos `favicon.ico`? *(Recomendado: sí a las dos.)*

## Aprobación

Aprobado por el dueño el 2026-11-07: la tabla completa, los 5 reemplazos, borrar `HeroSlider.tsx` (pregunta 2) y dejar el favicon para otra tarea conservando `favicon.ico` (pregunta 3).
