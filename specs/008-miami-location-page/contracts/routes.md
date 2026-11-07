# Contract: Ruta y contenido de `/location/`

## Ruta

| Ruta | Respuesta | En sitemap | Canónica |
|------|-----------|------------|----------|
| `/location/` | 200, HTML prerenderizado | Sí | `https://proelitemovers.com/location/` |
| `/#quote` | Sin cambios (sigue en el home) | — | — |

## Enlaces que apuntan a la ruta

| Lugar | Etiqueta | Antes | Después |
|-------|----------|-------|---------|
| Navbar escritorio, "Locations" | Miami | `/#quote` | `/location/` |
| Navbar móvil, "Locations" | Miami | `/#quote` | `/location/` |
| Footer, columna "Locations" | Miami | `/#quote` | `/location/` |

## Estructura de la página

1. Navbar (sin cambios).
2. `<main id="main-content">` con una sola sección, idéntica a la "Service Area" del home salvo el nivel del título:
   - Rótulo "Service Area".
   - `<h1>` "Miami and South Florida" (único H1).
   - Párrafo: "We handle moves in Miami-Dade, Broward, and throughout Florida. Include both locations when you request your hourly rate estimate."
   - "Crews based in Miami".
   - Enlace `tel:` "Questions? Call +1 (786) 281-7825" (desde `site.ts`).
   - Mapa de Google de Miami con su `title`, cargado en diferido.
3. Footer (sin cambios).

## `<head>`

- `<title>` y `<meta name="description">` de `miamiPage.meta`.
- `<link rel="canonical">` y Open Graph con la imagen social por defecto (de `BaseLayout`).
- JSON-LD `MovingCompany`: `name`, `url`, `telephone`, `email`, `areaServed` = Miami-Dade County, FL; Broward County, FL; Florida. Sin `address`, `priceRange`, `aggregateRating` ni `review`.
- JSON-LD `BreadcrumbList`: Home (`/`) → Miami (`/location/`).
