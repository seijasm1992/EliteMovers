# Contract: Secciones de cada página y JSON-LD

*Revisado el 2026-11-07: 2 secciones por página.*

Las 6 páginas pintan, dentro de `<main id="main-content">`, **solo** estas 2 secciones, en este orden:

| # | `id` | Componente | Contenido |
|---|------|------------|-----------|
| 1 | `top` | `ServiceHero` | Eyebrow, **único `<h1>`** con el nombre del servicio, un párrafo de **2 a 3 frases**, la foto con `alt`, `width`/`height` y `srcset` 480/720/960, un botón "Get a Quote" → `/get-a-quote/` y un botón "Call Now" → `site.phoneHref` |
| 2 | `included` | `ServiceIncluded` | `<h2>` con `included.title` y una lista de **3 a 5 puntos** (título y descripción) |

Después de `</main>` viene el footer del sitio, sin cambios.

## Reglas

- No hay otras secciones en `<main>`. En particular, no aparecen `how-it-works`, `pricing`, `guarantees`, `reviews`, `faq` ni `more-services` (FR-005).
- Ningún texto visible ni el JSON-LD muestran montos, calificaciones, estrellas, cantidades de reseñas, licencia ni marcadores de pendiente.
- Jerarquía: 1 `<h1>` en la sección 1 y 1 `<h2>` en la sección 2.
- Sin JavaScript en el cliente aparte de la isla del navbar.
- La foto del encabezado se precarga con el mismo `srcset` y `sizes` que el `<img>`.
- A 360 px de ancho, el H1, el párrafo y los dos botones se ven sin desplazarse y sin scroll horizontal.

## JSON-LD por página

Dos bloques `<script type="application/ld+json">`, con `<` escapado:

1. **MovingCompany**: `name`, `url` (`https://proelitemovers.com/`), `telephone` y `email` desde `site.ts`; `areaServed` con Miami-Dade County y Broward County. **Prohibido**: `address`, `priceRange`, `aggregateRating`, `review`.
2. **BreadcrumbList**: Home (`/`) → servicio (`/<slug>/`).

No se emite `FAQPage` ([research.md](../research.md), R14).
