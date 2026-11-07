# Quickstart: validar las páginas "Licenses & Credentials" y "FAQ"

## Requisitos

- Node.js ≥ 22.12 y dependencias instaladas (`npm install`).
- `PUBLIC_TURNSTILE_SITE_KEY` en `.env`, necesaria para `astro build`.

## 0. Referencia del home antes del cambio

Antes de implementar, guarda el HTML del home. `$SCRATCH` es cualquier carpeta temporal fuera del repositorio.

```sh
npm run build
cp dist/client/index.html "$SCRATCH/index.before.html"
```

## 1. Tipos y build

```sh
npm run astro -- check
npm run build
```

Resultado esperado: 0 errores, y existen `dist/client/licenses-and-credentials/index.html` y `dist/client/faq/index.html`.

## 2. El home no cambió

```sh
diff "$SCRATCH/index.before.html" dist/client/index.html
```

Resultado esperado: solo cambian los `href` del navbar y del footer de "Company", "Licenses & Credentials" y "FAQ" (y los hashes de assets, si los hay). El JSON-LD `FAQPage` sigue en el home, el título de las dos secciones sigue en `<h2>` y la FAQ solo trae los ítems de Pricing & Billing.

## 3. `/licenses-and-credentials/` (FR-003 a FR-006)

En `dist/client/licenses-and-credentials/index.html`:

- 1 solo `<h1>`, con el texto "The Elite Guarantee".
- "Licensed and insured in Florida." aparece después del subtítulo y antes de "Honest Hourly Rate".
- Las 3 garantías con el mismo texto que `src/data/guarantee.ts`.
- 0 coincidencias de `TBD`, `Pending`, `License #` o `{{`.

## 4. `/faq/` (FR-007 a FR-009, FR-013)

En `dist/client/faq/index.html`:

- 1 solo `<h1>`, con el texto "Questions & Answers".
- Las 20 preguntas y las 20 respuestas de `src/data/faqContent.ts` están en el HTML. Cuenta las coincidencias de `faq-trigger-`: deben ser 20 IDs distintos.
- 0 coincidencias de `"FAQPage"`.
- La franja "Need help with your move?" y el enlace a `/get-a-quote/` están presentes.

## 5. `<head>` y SEO (FR-014 a FR-016)

En las dos páginas: `<title>` y meta description de [research.md R8](research.md#r8-títulos-y-meta-descriptions), canónica correcta, JSON-LD `MovingCompany` sin `address`, `priceRange`, `aggregateRating` ni `review`, y `BreadcrumbList` Home → página. Compara con el resto de las páginas en `dist/client/**/index.html` que ningún título ni descripción se repita.

## 6. Sitemap

`dist/client/sitemap.xml` contiene `/licenses-and-credentials/` y `/faq/`.

## 7. Navegación en el navegador (FR-018 a FR-020)

```sh
npm run preview
```

- Navbar de escritorio: "Company" lleva a `/about-us/`. En su menú, "Licenses & Credentials" y "FAQ" llevan a sus páginas y "About" sigue en `/about-us/`.
- Menú móvil (a 360 px): los mismos enlaces funcionan.
- Footer, columna "Company": mismos destinos.
- En `/faq/`: pulsa cada uno de los 5 filtros. Cada uno muestra sus preguntas, y abrir o cerrar una pregunta funciona.
- A 360 px, ninguna de las dos páginas tiene scroll horizontal y "Call Now" sigue visible en el navbar.

## 8. Enlaces rotos (FR-017)

Recorre los enlaces de las dos páginas (navbar, contenido y footer). Todos responden 200.

## 9. Rendimiento (SC-008)

Corre Lighthouse en modo móvil sobre `/licenses-and-credentials/` y `/faq/` en `npm run preview`. Resultado esperado: LCP < 2.5 s y CLS < 0.1. Si el LCP falla por la animación de entrada del H1, aplica la mitigación de [research.md R9](research.md#r9-schema-por-página-y-espacio-bajo-el-navbar).
