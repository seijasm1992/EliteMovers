# Verification: Páginas "Licenses & Credentials" y "FAQ"

**Date**: 2026-11-07 | **Branch**: `009-company-info-pages`

Los builds de verificación se hicieron con `ENABLE_TURNSTILE=false`, antes y después del cambio, porque no hay `.env` local con `PUBLIC_TURNSTILE_SITE_KEY`. Esa variable solo afecta al formulario de cotización, no a las páginas de esta feature.

## T015. Tipos y build

- `npm run build`: sin errores. Genera `dist/client/licenses-and-credentials/index.html` y `dist/client/faq/index.html`.
- `npm run astro -- check`: 3 errores, todos previos a esta feature y en `astro.config.mjs` (`Cannot find name 'process'`, falta `@types/node`). 0 errores en archivos de esta feature.

## T016. El home no cambió

Comparé el HTML del home antes y después, sin contar los hashes de assets:

- Cambian solo los `href` de "Company" (`/#guarantee` → `/about-us/`), "Licenses & Credentials" (`/#guarantee` → `/licenses-and-credentials/`) y "FAQ" (`/#faq` → `/faq/`), en el navbar y en el footer.
- Otras diferencias: solo espacios en blanco, sin efecto visual (dentro de los `<h2>` que ahora usan etiqueta dinámica y entre bloques).
- Se mantienen 1 JSON-LD `FAQPage`, "The Elite Guarantee" y "Questions & Answers" en `<h2>`, y las 6 preguntas de Pricing & Billing en el HTML de la FAQ.

## T017. `<head>`, contenido y sitemap

| Revisión | `/licenses-and-credentials/` | `/faq/` |
|----------|------------------------------|---------|
| `<title>` | Licenses & Credentials \| ProElite Movers | Moving FAQ: Hourly Rates, Scheduling & More \| ProElite Movers |
| Título y descripción únicos en el sitio | ✅ | ✅ |
| Canónica | ✅ `https://proelitemovers.com/licenses-and-credentials/` | ✅ `https://proelitemovers.com/faq/` |
| H1 | 1, "The Elite Guarantee" | 1, "Questions & Answers" |
| JSON-LD | `MovingCompany` + `BreadcrumbList` | `MovingCompany` + `BreadcrumbList`, sin `FAQPage` |
| Sin `address`, `priceRange`, `aggregateRating`, ni marcadores TBD/Pending/License #/`{{` | ✅ (0 coincidencias) | ✅ (0 coincidencias) |
| Contenido | Antetítulo, H1, subtítulo, "Licensed and insured in Florida." y luego las 3 garantías, en ese orden | 20 de 20 preguntas en el HTML; 4 categorías inactivas con `hidden`; franja "Need help with your move?" con "Request a Quote" |

`dist/client/sitemap.xml` incluye las 2 rutas nuevas, y solo esas cambiaron frente al sitemap anterior.

## T018. Navegador

- ✅ Con `npm run preview`, las 2 páginas responden 200, y todos los enlaces internos (contenido, navbar y footer) responden 200.
- ✅ Captura a 1280 px de `/faq/`: navbar con "Call Now", H1, 5 filtros, Pricing & Billing con 2 preguntas abiertas y la franja de cotización. Captura de `/licenses-and-credentials/`: la mención de licencia va entre el subtítulo y las tarjetas.
- ✅ **Revisión manual confirmada por el dueño (2026-11-07)**:
  - Ancho de 360 px sin scroll horizontal. Chrome headless no baja de unos 500 px de ancho y recorta la captura; `/location/`, que ya existía, sale recortada igual, así que la captura no sirve como prueba.
  - Pulsar los 5 filtros y abrir y cerrar preguntas en `/faq/`.
  - Menú móvil.
  - Lighthouse móvil (LCP < 2.5 s, CLS < 0.1): no hay Lighthouse instalado en el proyecto.

## Pendientes del dueño

- Número de licencia o de registro de mudanzas en Florida (FR-006). No se muestra hasta que el dueño lo confirme.
