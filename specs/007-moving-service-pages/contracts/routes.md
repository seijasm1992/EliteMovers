# Contract: Rutas, menú, sitemap y metadatos

## Rutas públicas

| Etiqueta del menú | URL | Archivo | Enlace anterior en el menú |
|-------------------|-----|---------|-----------------------------|
| Local Moving | `/local-moving/` | `src/pages/local-moving.astro` | `/#residential-moving` |
| Long Distance Moving | `/long-distance-moving/` | `src/pages/long-distance-moving.astro` | `/#long-distance-moving` |
| Office Moving | `/office-moving/` | `src/pages/office-moving.astro` | `/#business-moving` |
| Commercial Moving | `/commercial-moving/` | `src/pages/commercial-moving.astro` | `/#business-moving` |
| Small Moves | `/small-moves/` | `src/pages/small-moves.astro` | `/#residential-moving` |
| Large Moves | `/large-moves/` | `src/pages/large-moves.astro` | `/#residential-moving` |

- Cada URL responde 200 con HTML prerenderizado.
- Las anclas del home siguen existiendo; solo dejan de usarse en el menú "Moving".

## Menú

- Los 6 hijos de "Moving" en el navbar (escritorio y móvil) y en el footer apuntan a las URLs de arriba, en ese orden y con las mismas etiquetas.
- Los grupos Locations, Services y Company, y el `href` del grupo "Moving", no cambian.

## Sitemap

`/sitemap.xml` incluye las 6 URLs absolutas (`https://proelitemovers.com/<slug>/`) además de las 4 actuales, sin duplicados.

## Metadatos por página

| Elemento | Regla |
|----------|-------|
| `<title>` | Único en el sitio, ≤ 60 caracteres |
| `<meta name="description">` | Única, 140–160 caracteres, sin montos |
| `<link rel="canonical">` | `https://proelitemovers.com/<slug>/` (la pone `BaseLayout`) |
| `og:title`, `og:description`, `og:url` | Iguales a título, descripción y canónica |
| `<h1>` | Exactamente uno por página |
