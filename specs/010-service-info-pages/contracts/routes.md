# Contract: Rutas, menú y SEO

## Rutas nuevas

Todas responden 200, prerenderizadas, con barra final.

| Ruta | H1 (= etiqueta del menú) | `<title>` | Canónica |
|------|--------------------------|-----------|----------|
| `/packing-services/` | Packing Services | Packing Services in Miami \| ProElite Movers | `https://proelitemovers.com/packing-services/` |
| `/installation/` | Installation | Furniture Assembly and TV Mounting \| ProElite Movers | `https://proelitemovers.com/installation/` |
| `/high-value-items/` | High-Value Items | Moving High-Value Items in Miami \| ProElite Movers | `https://proelitemovers.com/high-value-items/` |
| `/furniture-protection/` | Furniture Protection | Furniture and Home Protection \| ProElite Movers | `https://proelitemovers.com/furniture-protection/` |
| `/move-coordination/` | Move Coordination | Move Coordination in Miami \| ProElite Movers | `https://proelitemovers.com/move-coordination/` |

Las meta descriptions están en [page-content.md](page-content.md).

## Estructura de cada página

Dentro de `<main>`, en este orden y nada más:

1. `<section>` encabezado: `<h1>`, `<p>` con 2 o 3 frases, `<img>` con `alt`, `width`, `height` y `srcset`. **Sin** `<a>` con estilo de botón ni `<button>`.
2. `<section>` pasos: eyebrow "How We Do It", `<h2>` propio, `<ol>` con exactamente 3 `<li>`, cada uno con `<h3>` y `<p>`.
3. `<section>` cierre: un `<p>` con un único `<a href="/get-a-quote/">`, estilo de enlace de texto.

Navbar y footer se mantienen como en el resto del sitio.

## Menú "Services" (navbar escritorio, navbar móvil y footer)

| Antes | Después |
|-------|---------|
| Packing Services → `/#included` | Packing Services → `/packing-services/` |
| Installation → `/#included` | Installation → `/installation/` |
| High-Value Items → `/#included` | High-Value Items → `/high-value-items/` |
| Furniture Protection → `/#included` | Furniture Protection → `/furniture-protection/` |
| Storage Solutions → `/#included` | *(eliminado)* |
| Move Coordination → `/#included` | Move Coordination → `/move-coordination/` |

El enlace padre "Services" sigue apuntando a `/#included`. Los menús Moving, Locations y Company no cambian.

## Head y datos estructurados

- `<title>` y `<meta name="description">` únicos.
- `<link rel="canonical">` (lo genera `BaseLayout`).
- `og:image` = foto de 960 px; `og:image:alt` = su alt.
- `<link rel="preload" as="image">` con el mismo `srcset` y `sizes` que el `<img>`.
- JSON-LD `MovingCompany`: `name`, `url`, `telephone`, `email` y `areaServed` (Miami-Dade County, FL; Broward County, FL). Sin `address`, `priceRange`, `aggregateRating`, `review` ni `hasOfferCatalog`.
- JSON-LD `BreadcrumbList`: Home → etiqueta de la página.

## Sitemap

`/sitemap.xml` incluye las 5 rutas nuevas, una vez cada una.
