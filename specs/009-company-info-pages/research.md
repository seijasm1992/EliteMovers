# Research: Páginas "Licenses & Credentials" y "FAQ"

No quedaban marcadores NEEDS CLARIFICATION en el Technical Context. Estas decisiones resuelven cómo cumplir la spec con el código actual.

## R1. Reutilizar las secciones del home en vez de copiar su contenido

- **Decision**: `/licenses-and-credentials/` renderiza `EliteGuarantee.astro` y `/faq/` renderiza `FAQSection.astro`, las mismas secciones del home. Se les agregan props opcionales cuyo valor por defecto reproduce el home tal como está.
- **Rationale**: El contenido es idéntico por construcción (FR-004, FR-007, FR-010), y un cambio en `guarantee.ts` o `faqContent.ts` se ve en el home y en la página nueva. Es el mismo patrón que la spec 008 usó con `QuoteSection.astro`.
- **Alternatives considered**: Copiar el marcado a componentes nuevos (se desincroniza y duplica código). Una plantilla genérica de "página de empresa" (no hace falta para 2 páginas, principio XII).

## R2. H1 con el título actual de la sección

- **Decision**: `SectionHeader.astro` recibe una prop `headingLevel` (`"h1" | "h2"`, por defecto `"h2"`). `EliteGuarantee.astro` y `FAQSection.astro` la reciben y la pasan. En las páginas nuevas valen `"h1"`.
- **Rationale**: Cumple FR-003 (H1 = "The Elite Guarantee" y "Questions & Answers", sin encabezado propio). El home sigue con `h2`. La clase visual `type-section-title` no cambia, así que el título se ve igual.
- **Alternatives considered**: Un `<h1>` oculto con el nombre de la página. Rechazado porque es texto que no se ve y agrega contenido.

## R3. Las 20 respuestas en el HTML de `/faq/` al cargar

- **Hallazgo**: La isla React `FAQSection.tsx` solo renderiza los ítems de la categoría activa. En el HTML prerenderizado del home solo están las 6 preguntas de Pricing & Billing. Las otras 14 aparecen al pulsar un filtro.
- **Decision**: Agregar a `FAQSection.tsx` la prop `renderAllCategories` (por defecto `false`). Con `true`, renderiza una lista por categoría y oculta con el atributo `hidden` las de las categorías inactivas. Los filtros, las preguntas abiertas al inicio y la animación funcionan igual. `/faq/` la pasa en `true` y el home no la pasa.
- **Rationale**: Cumple FR-009 sin cambiar el home ni el aspecto de la sección. Google indexa el contenido oculto por diseño, como pestañas o acordeones, cuando está en el HTML. Las respuestas de las preguntas cerradas ya están en el DOM, colapsadas con CSS.
- **Alternatives considered**: (a) Cambiar el comportamiento para todos. Cambiaría el HTML del home, que está fuera de alcance. (b) Una lista estática en Astro sin filtros. Cambia el aspecto y la interacción respecto de la sección del home. (c) Solo el schema FAQPage con todas las respuestas. El dueño decidió que `/faq/` no lleva ese schema.
- **Nota**: `MAX_VISIBLE_ITEMS = 6` recorta cada categoría a 6 ítems. Hoy la más larga tiene 6, así que salen las 20. El quickstart lo verifica.

## R4. Schema FAQPage solo en el home

- **Decision**: `FAQSection.astro` recibe la prop `includeSchema` (por defecto `true`). `/faq/` la pasa en `false`.
- **Rationale**: Aclaración del dueño (FR-013): el schema queda marcado una sola vez y el home no cambia.

## R5. Mención "Licensed and insured in Florida"

- **Decision**: El texto pasa a `site.ts` como `licenseNote`, la fuente única de datos del negocio. El footer lo lee de ahí y produce el mismo HTML que hoy. `EliteGuarantee.astro` recibe la prop `showLicenseNote` (por defecto `false`). Con `true`, muestra `site.licenseNote` entre el `SectionHeader` (después del subtítulo) y la cuadrícula de garantías (FR-005, aclaración del dueño).
- **Rationale**: Un solo texto para el footer y la página. Si el dueño confirma el número de licencia, se agrega en un solo lugar (User Story 2, escenario 3).
- **Número de licencia**: No se crea ningún campo con valor de relleno. Queda en la lista de pendientes de la spec (FR-006).

## R6. Botón "Request a Quote" dentro de la sección FAQ

- **Hallazgo**: La sección FAQ del home termina con la franja "Need help with your move? Call our office or request your hourly rate estimate online." y un botón "Request a Quote" a `/get-a-quote/`.
- **Decision**: La franja se mantiene en `/faq/`, porque es parte del contenido de la sección y el dueño pidió "exactamente el mismo contenido, sin quitar nada". FR-012 prohíbe agregar botones propios, no los que ya trae la sección. Se ajusta el texto de FR-012 para dejarlo explícito.

## R7. Datos de las páginas, menú y sitemap

- **Decision**: Archivo nuevo `src/data/companyPages.ts` con `licensesPage` y `faqPage` (`label`, `href`, `meta`), tipados con la interfaz nueva `CompanyPage`. Lo leen las páginas, `navigation.ts` y `sitemap.xml.ts`. El enlace principal "Company" pasa a `/about-us/` (FR-019).
- **Rationale**: Una sola fuente para cada URL, como `locationPages.ts` (principio IV).

## R8. Títulos y meta descriptions

Solo usan hechos que ya están en el sitio (FR-010 y FR-014):

| Página | `<title>` | Meta description |
|--------|-----------|------------------|
| `/licenses-and-credentials/` | `Licenses & Credentials \| ProElite Movers` | `Licensed and insured in Florida. An hourly rate confirmed before move day, furniture and property protection, and a background-checked crew from ProElite Movers.` |
| `/faq/` | `Moving FAQ: Hourly Rates, Scheduling & More \| ProElite Movers` | `Answers about hourly billing, deposits, scheduling, service areas, insurance, and getting ready for your move with ProElite Movers in Miami.` |

Las dos son distintas de los títulos y descripciones de las demás páginas.

## R9. Schema por página y espacio bajo el navbar

- **Decision**: Cada página incluye JSON-LD `MovingCompany` (`name`, `url`, `telephone`, `email`, `areaServed` Miami-Dade y Broward, igual que las páginas de Moving) y `BreadcrumbList` (Home → página). No incluye licencia, `address`, `priceRange` ni reseñas (FR-016). `<main>` lleva `pt-20` para dejar espacio bajo el navbar fijo, como en `/location/`, y el mismo fondo que su sección (`bg-offwhite` y `bg-white`).
- **Riesgo de LCP**: El H1 está dentro de `data-scroll-reveal`, que empieza con opacidad 0 hasta que corre el script. Se mide con Lighthouse en el quickstart. Si el LCP pasa de 2.5 s, se agrega una prop para no animar el encabezado en estas páginas.
