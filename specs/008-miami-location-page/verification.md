# Verification: Página de Miami del menú "Locations"

Fecha: 2026-11-07. Rama `008-miami-location-page`. Build local con `ENABLE_TURNSTILE=false` (no hay `.env` en la máquina; igual que en la 007).

## 1. Tipos y build (T012)

| Paso | Resultado |
|------|-----------|
| `npm run astro -- check` | ⚠️ 3 errores, **todos previos** a la feature: `astro.config.mjs:16-18`, `Cannot find name 'process'` (faltan los tipos de Node). 0 errores en archivos nuevos o editados. |
| `npm run build` | ✅ Sin errores. Genera `dist/client/location/index.html`. |

## 2. Contenido (US1, T006)

| Comprobación | Resultado |
|--------------|-----------|
| Número de `<h1>` en `/location/` | ✅ 1: "Miami and South Florida" |
| Texto de la sección igual al del home (SC-002) | ✅ Idéntico: "Service Area Miami and South Florida We handle moves in Miami-Dade, Broward, and throughout Florida. Include both locations when you request your hourly rate estimate. Crews based in Miami Questions? Call +1 (786) 281-7825" |
| Enlaces `tel:` | ✅ 3, todos `tel:+17862817825` (sección, navbar y footer) |
| Mapa | ✅ Mismo `title` y `loading="lazy"`; carga en la emulación móvil de Lighthouse |

## 3. Menú (US2, T008)

| Comprobación | Resultado |
|--------------|-----------|
| Enlace "Miami" en navbar de escritorio y footer | ✅ `/location/` en todas las páginas generadas |
| Menú móvil | ✅ Los datos de la isla `NavMenu` incluyen `Miami` → `/location/` |
| Enlaces "Miami" a `/#quote` | ✅ 0 |
| `git diff src/data/navigation.ts` | ✅ Solo el import de `miamiPage` y el hijo "Miami" |

## 4. SEO (US3, T011)

| Comprobación | Resultado |
|--------------|-----------|
| `<title>` | ✅ `Miami & South Florida Service Area \| ProElite Movers` (52 caracteres), único en las 11 páginas |
| Meta description | ✅ 139 caracteres, única |
| Canónica | ✅ `https://proelitemovers.com/location/` |
| JSON-LD | ✅ `MovingCompany` (nombre, URL, teléfono, correo, `areaServed` Miami-Dade, Broward y Florida) y `BreadcrumbList` Home → Miami. 0 campos `address`, `priceRange`, `aggregateRating` o `review` |
| Sitemap | ✅ Única diferencia con la versión anterior: `+ https://proelitemovers.com/location/` |

## 5. El home no cambia (T013, SC-007)

Comparación de `dist/client/index.html` con la copia guardada en T001:

- ✅ La sección `id="quote"` es idéntica byte a byte y su título sigue siendo `<h2>`.
- Diferencias: solo los 2 enlaces "Miami" (`/#quote` → `/location/`) y los datos/uid de la isla del navbar que los contienen.

## 6. Navegador (T014)

| Comprobación | Resultado |
|--------------|-----------|
| Vista móvil (emulación de Lighthouse) | ✅ Sin scroll horizontal; texto, teléfono y mapa visibles |
| Separación con el navbar fijo | ⚠️→✅ **Corregido durante la implementación.** La sección del home solo tiene `py-20`; como primera sección quedaba tapada por el navbar fijo. Se añadió `bg-offwhite pt-20` al `<main>` de `location.astro` (el home no cambia) |
| Escritorio 1280 px | ✅ Texto a la izquierda, mapa a la derecha, igual que en el home |
| Mapa bloqueado | ✅ El texto y el teléfono no dependen del iframe (en la captura headless sin carga diferida el mapa queda vacío y el resto se ve igual) |
| Clic manual en "Miami" en navbar, menú móvil y footer | ⏳ Comprobado en el HTML y en los datos de la isla, no con clics a mano. Pendiente en la revisión del dueño |

## 7. Rendimiento (T015, SC-006)

Lighthouse 12.8.2 móvil sobre `npm run preview` (servidor local, sin compresión):

| Página | Performance | FCP | LCP | CLS | TBT | Accessibility | SEO |
|--------|-------------|-----|-----|-----|-----|---------------|-----|
| `/location/` (1.ª pasada) | 91 | 2.1 s | 3.2 s | 0 | 0 ms | 98 | 100 |
| `/location/` (tras el ajuste de espacio) | 85 | 3.0 s | 3.5 s | 0 | 0 ms | 98 | 100 |
| `/local-moving/` (referencia, misma sesión) | 90 | 2.1 s | 3.3 s | 0 | 0 ms | 100 | 100 |

- ⚠️ **LCP > 2.5 s en laboratorio local.** El elemento LCP es el párrafo de texto. Está en el mismo rango que las páginas de Moving (3.3–3.4 s en la 007), lo que apunta a la causa de todo el sitio ya registrada en la 007 (CSS y fuentes que bloquean el renderizado; el servidor local tampoco comprime: 212 KiB de ahorro estimado). No se cambió código fuera del alcance. Se confirma en producción.
- ✅ CLS 0 y TBT 0 ms.
- ⚠️ **Accesibilidad, `heading-order`.** Después del H1, el siguiente encabezado es el `h3` del footer ("Moving"), que se salta el nivel 2. En las demás páginas hay un `h2` intermedio. Corregirlo exige cambiar el footer (fuera de alcance) o agregar un encabezado nuevo (prohibido por FR-005). Queda como decisión del dueño.

## Pendiente

- T017: hecho. El dueño aprobó la página (con la URL cambiada a `/location/`) y pidió commit y publicación.
