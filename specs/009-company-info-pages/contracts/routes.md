# Contract: Rutas y contenido de `/licenses-and-credentials/` y `/faq/`

## Rutas

| Ruta | Respuesta | En sitemap | Canónica |
|------|-----------|------------|----------|
| `/licenses-and-credentials/` | 200, HTML prerenderizado | Sí | `https://proelitemovers.com/licenses-and-credentials/` |
| `/faq/` | 200, HTML prerenderizado | Sí | `https://proelitemovers.com/faq/` |
| `/#guarantee`, `/#faq` | Sin cambios (siguen en el home) | — | — |

## Enlaces

| Lugar | Etiqueta | Antes | Después |
|-------|----------|-------|---------|
| Navbar escritorio | Company (principal) | `/#guarantee` | `/about-us/` |
| Navbar escritorio y móvil, footer | Licenses & Credentials | `/#guarantee` | `/licenses-and-credentials/` |
| Navbar escritorio y móvil, footer | FAQ | `/#faq` | `/faq/` |
| Navbar y footer | About | `/about-us/` | Sin cambios |

El footer muestra los hijos del grupo, no el enlace principal, así que "Company" no cambia ahí.

## Estructura de `/licenses-and-credentials/`

1. Navbar (sin cambios; "Call Now" visible).
2. `<main id="main-content">` con una sola sección, igual a "The Elite Guarantee" del home salvo dos diferencias:
   - Antetítulo "Why ProElite Movers".
   - `<h1>` "The Elite Guarantee" (único H1; en el home es `<h2>`).
   - Subtítulo del home.
   - **Diferencia**: "Licensed and insured in Florida." (desde `site.licenseNote`).
   - 3 tarjetas: Honest Hourly Rate, Furniture and Property Protection y Background-Checked Crew, con su texto.
3. Footer (sin cambios).

No muestra número de licencia ni ningún texto de pendiente.

## Estructura de `/faq/`

1. Navbar (sin cambios).
2. `<main id="main-content">` con una sola sección, igual a la FAQ del home salvo:
   - Antetítulo "FAQs".
   - `<h1>` "Questions & Answers" (único H1).
   - Filtros de las 5 categorías, en el orden del home.
   - **Diferencia**: el HTML contiene las 20 preguntas y respuestas. Las de las categorías inactivas van ocultas con `hidden` hasta que se pulse su filtro.
   - Franja "Need help with your move?" con el botón "Request a Quote" a `/get-a-quote/`, igual que en el home.
3. Footer (sin cambios).

## `<head>` de ambas páginas

- `<title>` y `<meta name="description">` de `companyPages.ts` (ver [research.md R8](../research.md#r8-títulos-y-meta-descriptions)).
- `<link rel="canonical">` y Open Graph con la imagen social por defecto (de `BaseLayout`).
- JSON-LD `MovingCompany`: `name`, `url`, `telephone`, `email` y `areaServed` (Miami-Dade County, FL; Broward County, FL). Sin `address`, `priceRange`, `aggregateRating`, `review` ni número de licencia.
- JSON-LD `BreadcrumbList`: Home (`/`) → la página.
- `/faq/` **no** incluye JSON-LD `FAQPage`.

## Home

El HTML de `/` no cambia, salvo lo que cambie el navbar compartido: los `href` de "Company", "Licenses & Credentials" y "FAQ".
