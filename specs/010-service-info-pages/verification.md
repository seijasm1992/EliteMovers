# Verification: Páginas informativas para cada servicio del menú "Services"

**Fecha**: 2026-11-07 | **Rama**: `010-service-info-pages`

Build local con `ENABLE_TURNSTILE=false npm run build` (no hay `.env` local). HTML revisado en `dist/client/`, servido con un servidor estático local.

## Tipos y build (quickstart §1)

| Comprobación | Resultado |
|--------------|-----------|
| `npm run astro -- check` | 3 errores, todos previos y en `astro.config.mjs` (`process` sin tipos de Node). 0 errores en archivos de esta feature. |
| `npm run build` | Completo. Solo avisos de secretos locales faltantes (`RESEND_API_KEY`, etc.), previos. Las 5 rutas se prerenderizan. |

## Rutas y estructura (§2), 5 de 5 páginas

| Comprobación | Resultado |
|--------------|-----------|
| Un solo `<h1>` = etiqueta del menú | ✅ |
| 3 `<section>` en `<main>` | ✅ |
| Exactamente 3 pasos (`<li>`) | ✅ |
| 1 enlace a `/get-a-quote/` en `<main>`, como texto | ✅ |
| 0 `<button>` y 0 `tel:` en `<main>` | ✅ |

## Menú (§3)

| Comprobación | Resultado |
|--------------|-----------|
| Navbar: 5 hijos de "Services" con su ruta | ✅ |
| Footer: 5 enlaces de "Services" con su ruta, 0 `/#included` | ✅ |
| "Storage Solutions" en `dist/client/` | 0 resultados ✅ |
| Moving, Locations y Company sin cambios | ✅ |

## SEO (§4)

| Comprobación | Resultado |
|--------------|-----------|
| `<title>` y meta description únicos en las 18 páginas del sitio | ✅ (0 repetidos) |
| Meta descriptions | 139–155 caracteres |
| Canónica, `preload` de la foto, JSON-LD `MovingCompany` + `BreadcrumbList` | ✅ 5/5 |
| Sitemap con las 5 rutas | ✅ |

## Contenido (§5)

- Texto igual a [contracts/page-content.md](contracts/page-content.md), con fuente para cada afirmación. Durante T020 se cambiaron el título de pasos y la línea de cierre de Installation (solo cambiaban el nombre respecto de otras páginas) y se acortaron 2 meta descriptions; el contrato se actualizó.
- High-Value Items: 0 coincidencias de `crate`, `custom`, `insurance`, `insured`, `full value`, `apprais`, `piano` y `white glove`.
- Move Coordination dice "when the service is available".
- 0 frases, pasos o líneas de cierre repetidos entre páginas, incluso reemplazando el nombre del servicio.
- 5 fotos distintas entre sí y de las de Moving, con alt ([research.md](research.md), "Imágenes elegidas").

## Móvil y rendimiento (§6)

| Comprobación | Resultado |
|--------------|-----------|
| 360 px (emulación de Chrome por DevTools): `scrollWidth` = 360 en las 5 páginas | ✅ sin scroll horizontal |
| Revisión visual a 360 px y 1366 px | ✅. Se corrigió la línea de cierre de Installation: al ocupar 2 líneas, la flecha quedaba separada del texto. |
| 40 enlaces e imágenes internos de las 5 páginas | 40 responden 200 ✅ |
| Lighthouse móvil (LCP, CLS) | **Pendiente**: Lighthouse no está instalado en el proyecto. Las fotos tienen `width`/`height` y `aspect-ratio` fijos (riesgo de CLS bajo) y la de 720 px pesa ≤ 59 KB, pero el LCP se mide después del despliegue. Aplica la salvedad de la spec 007 sobre el retraso de renderizado compartido. |

## Observación fuera de alcance

El pie de todas las páginas muestra `site.licenseNote` ("Licensed and insured in Florida."). Es texto previo a esta feature. Conviene confirmar con el dueño que la licencia está confirmada (principio II).
