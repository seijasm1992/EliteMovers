# Research: Página de Miami del menú "Locations"

Fecha: 2026-11-07. Base: código de `master` después del merge de la 007 (`297708b`).

## R1. URL de la página

- **Decision**: `/location/`, archivo `src/pages/location.astro` (pedido del dueño el 2026-11-07; la etiqueta del menú sigue siendo "Miami").
- **Rationale**: La spec pide la misma estructura que las páginas de Moving, que están en la raíz con barra final (`/local-moving/`). La aclaración de la 007 eligió la raíz frente a carpetas (`/moving/...`).
- **Alternatives considered**: `/miami/` (la primera versión; el dueño la cambió el 2026-11-07, ver Clarifications de la spec); `/locations/miami/` (agrupa ciudades futuras, pero rompe el patrón pedido).

## R2. Cómo mostrar el mismo contenido que el home

- **Decision**: Reutilizar el componente `src/components/sections/QuoteSection.astro` en la página nueva, con una prop opcional `headingLevel` (`"h1" | "h2"`, por defecto `"h2"`).
- **Rationale**: Un solo componente garantiza que el texto, el mapa y el teléfono sean idénticos en las dos páginas (FR-002, SC-002) y que un cambio futuro se aplique a ambas. El valor por defecto `"h2"` deja el HTML del home exactamente igual (SC-007).
- **Alternatives considered**: Copiar el marcado en un componente nuevo (duplica texto y se desincroniza); extraer el texto a `src/data/` (cambia más archivos del home sin necesidad, va contra el principio XII).

## R3. Único H1

- **Decision**: En `/location/` el título "Miami and South Florida" se muestra como `<h1>` mediante `headingLevel="h1"`, con las mismas clases visuales.
- **Rationale**: El principio VI exige exactamente un H1. El navbar y el footer no tienen H1 (el footer usa `h3`), así que este es el único.
- **Alternatives considered**: Un H1 oculto o un texto nuevo como H1 (contenido nuevo, prohibido por FR-005).

## R4. Datos de la página y fuente única de la URL

- **Decision**: Nuevo archivo `src/data/locationPages.ts` que exporta `miamiPage` (etiqueta, URL, título y meta description), con el tipo `LocationPage` en `src/types/content.ts`. Lo usan la página, `navigation.ts` y `sitemap.xml.ts`.
- **Rationale**: Sigue el patrón de `movingServicePages.ts`: el menú y el sitemap leen la URL del mismo lugar, así que no pueden desincronizarse (principio IV).
- **Alternatives considered**: Escribir `/location/` a mano en tres archivos (riesgo de rutas rotas); un arreglo de ciudades (otras ciudades están fuera de alcance, sería código no pedido).

## R5. Título y meta description

- **Decision**:
  - Título: `Miami & South Florida Service Area | ProElite Movers` (52 caracteres).
  - Meta description: `ProElite Movers handles moves in Miami-Dade, Broward, and throughout Florida, with crews based in Miami. Questions? Call +1 (786) 281-7825.` El teléfono se toma de `site.phone`.
- **Rationale**: Únicos en el sitio (el home usa `Miami Movers | ProElite Movers` y las páginas de Moving usan `<Servicio> in Miami`). Solo reformulan frases de la sección, sin datos nuevos (FR-008). Longitudes dentro de lo que Google muestra (≈60 y ≈160 caracteres).
- **Alternatives considered**: `Miami Movers | ...` (choca con el home); un título con barrios (dato nuevo).

## R6. Datos estructurados

- **Decision**: Dos bloques JSON-LD, como en las páginas de Moving: `MovingCompany` (nombre, URL, teléfono, correo y `areaServed` con Miami-Dade County, Broward County y el estado de Florida) y `BreadcrumbList` (Home → Miami). Se escriben en `location.astro`.
- **Rationale**: Principio VI. `areaServed` refleja la frase visible "Miami-Dade, Broward, and throughout Florida". El correo está visible en el footer. Sin dirección, precios, calificaciones ni reseñas.
- **Alternatives considered**: Extraer un generador de schema compartido con `ServicePageTemplate` (toca código de la 007, fuera de alcance); omitir `BreadcrumbList` (las otras páginas lo tienen).

## R7. Enlace "Locations" y menú móvil

- **Decision**: Solo cambia el `href` del hijo "Miami" en `navigation.ts`. El `href` del grupo "Locations" (`/#quote`) no cambia.
- **Rationale**: El navbar (escritorio y móvil, `NavMenu.tsx`) y el footer leen el mismo arreglo, así que un cambio cubre los 3 lugares (FR-006). El footer muestra los hijos, no el `href` del grupo. Supuesto de la spec.

## R8. Rendimiento

- **Decision**: Sin precarga de imagen. El mapa mantiene `loading="lazy"`.
- **Rationale**: La página no tiene foto; el LCP será el texto. El mapa en móvil queda debajo del texto y no bloquea la carga. Sin JavaScript nuevo (principio X).
