# Quickstart: validar la página de Miami

## Requisitos

- Node ≥ 22.12 y dependencias instaladas (`npm install`).
- `PUBLIC_TURNSTILE_SITE_KEY` en `.env` para que `npm run build` funcione.

## Pasos

1. **Tipos**: `npm run astro -- check` → 0 errores.
2. **Build**: `npm run build` → termina sin errores y genera `dist/client/location/index.html`.
3. **Head** de `dist/client/location/index.html` (ver [contracts/routes.md](contracts/routes.md)):
   - `<title>` y meta description de [research.md](research.md), R5, y distintos a los de `index.html` y las páginas de Moving.
   - Canónica `https://proelitemovers.com/location/`.
   - JSON-LD `MovingCompany` y `BreadcrumbList`, sin `address`, `priceRange`, `aggregateRating` ni `review`.
4. **H1**: exactamente 1 `<h1>` en `location/index.html`, con el texto "Miami and South Florida". En `dist/client/index.html` ese título sigue siendo `<h2>`.
5. **Texto idéntico**: el texto visible de la sección en `location/index.html` coincide con el de la sección `id="quote"` de `index.html` (SC-002).
6. **Sitemap**: `dist/client/sitemap.xml` contiene `https://proelitemovers.com/location/`.
7. **Enlaces**: en el HTML de cualquier página, el enlace "Miami" apunta a `/location/` en navbar y footer, y ningún enlace "Miami" apunta a `/#quote`. Los enlaces de Moving, Services y Company no cambiaron (`git diff src/data/navigation.ts`).
8. **Navegador** (`npm run preview`):
   - Pulsar "Miami" en el navbar de escritorio, en el menú móvil y en el footer → abre `/location/`.
   - A 360 px de ancho: texto, teléfono y mapa sin scroll horizontal.
   - El enlace del teléfono abre `tel:+17862817825`.
   - El home se ve igual que antes.
9. **Rendimiento**: Lighthouse móvil sobre `/location/` → LCP < 2.5 s, CLS < 0.1 (INP se confirma en producción).
