# Verification: Páginas propias para cada servicio del menú "Moving"

**Fecha**: 2026-11-07 | **Rama**: `007-moving-service-pages` | **Versión**: 2 secciones (spec revisada) | **Guía**: [quickstart.md](quickstart.md)

## Respaldo de la versión de 8 secciones (T001)

No hubo aprobación para el commit, así que se usó la alternativa de la tarea: copia en la carpeta de respaldo del scratchpad de la sesión (`backup-007-v8/`), con `src/components/service-page/` (9 componentes), `src/data/movingServicePages.ts`, `src/data/pricing.ts`, `src/data/reviews.ts` y `src/types/content.ts`. El scratchpad es temporal: para conservar la versión de forma permanente, hay que guardarla en git.

## 1. Tipos y build (T011)

| Comprobación | Resultado |
|--------------|-----------|
| `npm run astro -- check` | ✅ 0 errores nuevos. Solo los 3 previos de `astro.config.mjs` (`process`). |
| `npm run build` (`ENABLE_TURNSTILE=false`) | ✅ Sin errores. Genera los 6 `dist/client/<slug>/index.html`. |

## 2. Código retirado (T012)

| Comprobación | Resultado |
|--------------|-----------|
| `src/components/service-page/` | ✅ Solo `ServicePageTemplate.astro`, `ServiceHero.astro` y `ServiceIncluded.astro` |
| `src/data/pricing.ts`, `src/data/reviews.ts` | ✅ Borrados, sin imports restantes |
| `pricingNote`, `relatedIntro`, `PricingFacts`, `Review`, `.faq`, `.process` en `src/` | ✅ 0. Las únicas coincidencias de "Credentials" y "faq" son ajenas: la etiqueta "Licenses & Credentials" del menú Company y la clase `.faq-filter-enter` del FAQ del home. |

## 3. Estructura, SEO y datos (T013)

| Página | Secciones en `<main>` | Frases del párrafo | Puntos | JSON-LD |
|--------|-----------------------|--------------------|--------|---------|
| `/local-moving/` | `top`, `included` | 2 | 5 | MovingCompany, BreadcrumbList |
| `/long-distance-moving/` | `top`, `included` | 2 | 5 | ✅ |
| `/office-moving/` | `top`, `included` | 2 | 5 | ✅ |
| `/commercial-moving/` | `top`, `included` | 2 | 5 | ✅ |
| `/small-moves/` | `top`, `included` | 2 | 4 | ✅ |
| `/large-moves/` | `top`, `included` | 2 | 5 | ✅ |

- ✅ 1 `<h1>` por página; títulos (38–49 car.) y descripciones (149–154 car.) únicos frente a las 10 páginas; canónica y `og:url` correctas; todas las `<img>` con `alt`.
- ✅ Sin `FAQPage`; `MovingCompany` sin `address`, `priceRange`, `aggregateRating` ni `review`.
- ✅ 0 datos prohibidos (montos, `USD`, calificaciones, estrellas, `4.9`, `500+`, licencia, marcadores de pendiente) en el texto visible y en el JSON-LD.
- ✅ "Get a Quote" → `/get-a-quote/` y "Call Now" → `tel:+17862817825` en el encabezado de las 6 páginas.
- ✅ 0 enlaces, `src` o `srcset` rotos.

## 4. Menú y sitemap (T009)

- ✅ El home enlaza las 6 páginas desde el navbar y el footer.
- ✅ El footer ya no tiene `/#residential-moving`, `/#long-distance-moving` ni `/#business-moving`, y conserva los enlaces de Locations, Services y Company (`/#quote`, `/#included`, `/about-us/`, `/#guarantee`, `/#faq`).
- ✅ `/sitemap.xml`: 10 URLs sin duplicados.

## 5. Contenido propio (T008, T010)

- ✅ Los 6 párrafos del encabezado tienen 2 frases (límite: 2 a 3) y las listas tienen 4 o 5 puntos (límite: 3 a 5).
- ✅ 0 frases repetidas entre páginas en el párrafo y los puntos (comparación de frases de 5 o más palabras, sin el nombre del servicio).

## 6. Rendimiento y móvil (T014)

Lighthouse 12.6.1, modo móvil (412 px, Slow 4G simulado), sobre `npm run preview` en local:

| Página | Performance | FCP | LCP | CLS | TBT | Accessibility | SEO |
|--------|-------------|-----|-----|-----|-----|---------------|-----|
| `/local-moving/` | 90 | 2.1 s | 3.4 s | 0 | 20 ms | 100 | 100 |
| `/long-distance-moving/` | 90 | 2.1 s | 3.4 s | 0 | 20 ms | 100 | 100 |
| `/office-moving/` | 90 | 2.1 s | 3.4 s | 0 | 20 ms | 100 | 100 |
| `/commercial-moving/` | 90 | 2.2 s | 3.4 s | 0 | 20 ms | 100 | 100 |
| `/small-moves/` | 90 | 2.1 s | 3.4 s | 0 | 20 ms | 100 | 100 |
| `/large-moves/` | 90 | 2.1 s | 3.4 s | 0 | 20 ms | 100 | 100 |

Referencia sin cambios: `/` 77 (LCP 4.9 s) y `/about-us/` 84 (LCP 4.0 s).

- ✅ CLS = 0 y TBT ≤ 20 ms.
- ✅ A 360 px (emulación móvil), el H1, el párrafo, "Get a Quote" y "Call Now" se ven sin desplazarse y sin scroll horizontal.
- ❌ **LCP de laboratorio 3.4 s, sobre la meta de 2.5 s.** Mejoró 0.1–0.3 s frente a la versión de 8 secciones (3.5–3.7 s). El diagnóstico no cambia: la foto del encabezado pesa 43–53 KB, está precargada y no tiene retraso de carga. El tiempo se va en el retraso de renderizado (FCP ≈ 2.1 s) y en el TTFB del servidor local (≈ 460 ms). Incrustar el CSS no ayudó (probado y revertido en la primera versión). Es un problema de todo el sitio. **Pendiente**: medir en producción y, si sigue en rojo, abrir una feature de rendimiento para todo el sitio.

## Pendiente

- LCP en móvil (ver arriba).
- Guardar la versión de 8 secciones en git si se quiere conservar (ver Respaldo).
- Datos del dueño para cuando vuelvan las secciones retiradas: licencia o registro en Florida, detalles del seguro y reseñas reales ([data-model.md](data-model.md)).
