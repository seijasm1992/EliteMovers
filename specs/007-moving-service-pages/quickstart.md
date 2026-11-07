# Quickstart: Validar las páginas de servicio del menú "Moving"

*Revisado el 2026-11-07: 2 secciones por página.*

## Requisitos

- Node.js ≥ 22.12 y dependencias instaladas (`npm install`).
- `PUBLIC_TURNSTILE_SITE_KEY` en `.env` para el build, o `ENABLE_TURNSTILE=false`.

## 1. Tipos y build

```bash
npm run astro -- check   # se aceptan solo los 3 errores previos de astro.config.mjs
npm run build
```

Resultado esperado: el build termina y existen los 6 `dist/client/<slug>/index.html`.

## 2. Código retirado

```bash
ls src/components/service-page/       # solo ServicePageTemplate, ServiceHero y ServiceIncluded
ls src/data/pricing.ts src/data/reviews.ts   # no existen
grep -rnE "pricingNote|relatedIntro|PricingFacts|Credentials|\bReview\b|\.faq\b|\.process\b" src/   # 0 coincidencias
```

## 3. Estructura (SC-002, SC-006)

Para cada página, en el HTML generado:

- Dentro de `<main>` hay exactamente 2 `<section>`, con `id` `top` e `included`, en ese orden ([contracts/page-sections.md](contracts/page-sections.md)).
- Hay exactamente un `<h1>`.
- El párrafo del encabezado tiene de 2 a 3 frases y la lista de `included` tiene de 3 a 5 puntos.
- Hay 2 bloques JSON-LD, `MovingCompany` y `BreadcrumbList`, sin `FAQPage`. `MovingCompany` no tiene `address`, `priceRange`, `aggregateRating` ni `review`.
- `<title>` y `<meta name="description">` son únicos frente a las 10 páginas del sitio; la canónica es `https://proelitemovers.com/<slug>/`.
- Todas las `<img>` tienen `alt` no vacío.

## 4. Datos prohibidos (SC-004)

En el texto visible de `<main>` y en el JSON-LD de las 6 páginas no aparecen `$` seguido de números, `USD`, `135`, `40/h`, `rating`, `star(s)`, `4.9`, `500+`, `{{`, `TBD`, `pending`, `license` ni `licensed`.

## 5. Menú, botones y enlaces (SC-001, SC-003, SC-007)

```bash
npm run preview
```

- En el navbar de escritorio, el menú móvil y el footer, los 6 enlaces de "Moving" abren su página. Ninguno lleva a `/#...`.
- En el encabezado de cada página, "Get a Quote" lleva a `/get-a-quote/` y "Call Now" abre `tel:` con el teléfono de `site.ts`.
- `/sitemap.xml` lista las 10 URLs.
- Ningún enlace, `src` ni `srcset` de las 6 páginas devuelve 404.

## 6. Contenido propio (SC-005)

Ningún par de páginas comparte un párrafo de encabezado ni un punto de "Qué incluye" igual o que solo cambie el nombre del servicio. Comparar sobre todo Office/Commercial y Small/Large.

## 7. Rendimiento y móvil (SC-003, SC-008)

- Lighthouse móvil sobre `npm run preview` para las 6 páginas: anotar LCP, CLS y TBT en `verification.md`. Meta: LCP < 2.5 s y CLS < 0.1. El LCP de laboratorio arrastra un retraso de renderizado de todo el sitio; confirmar en producción.
- A 360 px, el H1, el párrafo, "Get a Quote" y "Call Now" se ven sin desplazarse y sin scroll horizontal.
