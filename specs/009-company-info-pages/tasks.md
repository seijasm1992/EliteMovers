---

description: "Lista de tareas: páginas Licenses & Credentials y FAQ del menú Company"
---

# Tasks: Páginas propias para "Licenses & Credentials" y "FAQ" del menú "Company"

**Input**: Design documents from `/specs/009-company-info-pages/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/routes.md](contracts/routes.md), [quickstart.md](quickstart.md)

**Tests**: La spec no pide pruebas automáticas y el proyecto no tiene scripts de pruebas. Cada historia se valida con los pasos de [quickstart.md](quickstart.md).

**Organization**: Tareas agrupadas por historia de usuario.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede hacer en paralelo (archivos distintos, sin dependencias pendientes).
- **[Story]**: Historia de la spec (US1 = FAQ, US2 = Licenses & Credentials, US3 = enlaces del menú "Company").

---

## Phase 1: Setup

**Purpose**: Confirmar la rama y guardar una referencia del home para comprobar después que no cambió.

- [X] T001 Confirmar que la rama activa es `009-company-info-pages` y que parte de `master` (`7cdac38`); si git sigue en `master`, crearla con `git checkout -b 009-company-info-pages`. Ejecutar `npm run build` y copiar `dist/client/index.html` y `dist/client/sitemap.xml` al scratchpad de la sesión como referencia "antes" (paso 0 de [quickstart.md](quickstart.md))

---

## Phase 2: Foundational

**Purpose**: Tipos, datos y la prop del encabezado compartido. Bloquea todas las historias.

- [X] T002 En `src/types/content.ts`: (a) añadir `licenseNote: string` a la interfaz `SiteConfig`, con un comentario breve que diga que es la mención de licencia y seguro que usan el footer y la página Licenses & Credentials; (b) al final, con el comentario `/* ── Company pages (spec 009) ── */`, añadir la interfaz `CompanyPage` con `label: string`, `href: string` y `meta: { title: string; description: string }`, y un comentario que diga que su contenido visible es una sección del home (ver [data-model.md](data-model.md))
- [X] T003 En `src/data/site.ts`, añadir `licenseNote: "Licensed and insured in Florida."` al objeto `site`. No agregar ningún campo para el número de licencia (FR-006) (depende de T002)
- [X] T004 Crear `src/data/companyPages.ts` que exporte `licensesPage: CompanyPage` y `faqPage: CompanyPage` (depende de T002):
  - `licensesPage`: `label` "Licenses & Credentials"; `href` "/licenses-and-credentials/"; `meta.title` = template literal "Licenses & Credentials | ${site.name}"; `meta.description` = template literal "Licensed and insured in Florida. An hourly rate confirmed before move day, furniture and property protection, and a background-checked crew from ${site.name}."
  - `faqPage`: `label` "FAQ"; `href` "/faq/"; `meta.title` = template literal "Moving FAQ: Hourly Rates, Scheduling & More | ${site.name}"; `meta.description` = template literal "Answers about hourly billing, deposits, scheduling, service areas, insurance, and getting ready for your move with ${site.name} in Miami."
  - Añadir un comentario breve: fuente única de la URL y los metadatos para página, menú y sitemap; el contenido visible es la sección del home, sin cambios. Textos según [research.md R8](research.md#r8-títulos-y-meta-descriptions)
- [X] T005 [P] En `src/components/ui/SectionHeader.astro`, añadir la prop `headingLevel?: "h1" | "h2"` con valor por defecto `"h2"` y renderizar el título con esa etiqueta (`const Heading = headingLevel;` y `<Heading class={...}>`), sin cambiar clases ni el resto del marcado

**Checkpoint**: `npm run astro -- check` sin errores. Todos los usos actuales de `SectionHeader` siguen renderizando `<h2>`.

---

## Phase 3: User Story 1 - Visitante que busca respuestas antes de contratar (Priority: P1) 🎯 MVP

**Goal**: `/faq/` muestra exactamente la sección FAQ del home, con "Questions & Answers" como único H1, las 20 respuestas en el HTML al cargar y sin schema FAQPage.

**Independent Test**: Pasos 3 a 5 de [quickstart.md](quickstart.md) aplicados a `/faq/`: 1 H1, 20 IDs `faq-trigger-` distintos, 0 `"FAQPage"`, franja "Need help with your move?" presente. En el navegador, los 5 filtros funcionan.

- [X] T006 [P] [US1] En `src/components/react/FAQSection.tsx`, añadir la prop opcional `renderAllCategories?: boolean` (por defecto `false`). Con `false`, el renderizado queda exactamente igual que hoy. Con `true`, en lugar de una sola cuadrícula de `visibleItems`, renderizar una cuadrícula por categoría (mismas clases, `aria-live` y marcado de cada `<article>`) con el atributo `hidden` en las categorías distintas de `activeCategory`, de modo que las 20 preguntas y respuestas estén en el HTML del servidor. Mantener los filtros, las 2 preguntas abiertas al inicio por categoría, `toggleItem` y la animación `faq-filter-enter`. No cambiar `MAX_VISIBLE_ITEMS` ([research.md R3](research.md#r3-las-20-respuestas-en-el-html-de-faq-al-cargar))
- [X] T007 [US1] En `src/components/sections/FAQSection.astro`, añadir `interface Props { headingLevel?: "h1" | "h2"; includeSchema?: boolean; renderAllCategories?: boolean }` con valores por defecto `"h2"`, `true` y `false`. Pasar `headingLevel` a `<SectionHeader>` y `renderAllCategories` a la isla `<FAQSection client:visible ...>`. Renderizar el `<script type="application/ld+json">` del FAQPage solo si `includeSchema` es `true`. No cambiar `id="faq"`, clases, textos ni la franja "Need help with your move?" con su botón "Request a Quote". `src/pages/index.astro` no se toca (depende de T005 y T006)
- [X] T008 [US1] Crear `src/pages/faq.astro` con `BaseLayout` (`title={faqPage.meta.title}`, `description={faqPage.meta.description}`), los scripts JSON-LD, `<Navbar />`, `<main id="main-content" class="bg-white pt-20">` con `<FAQSection headingLevel="h1" includeSchema={false} renderAllCategories />` y `<Footer />`. JSON-LD con el mismo patrón que `src/pages/location.astro` (`JSON.stringify(...).replace(/</g, "\\u003c")` e `is:inline set:html`): `MovingCompany` con `name`, `url`, `telephone`, `email` desde `site` y `areaServed` = Miami-Dade County, FL y Broward County, FL (sin `address`, `priceRange`, `aggregateRating`, `review` ni licencia), y `BreadcrumbList` Home (`/`) → `faqPage.label` (`faqPage.href`). Añadir un comentario que explique el `pt-20` (despeja el navbar fijo) (depende de T004 y T007)
- [X] T009 [US1] Añadir `faqPage.href` a `routes` en `src/pages/sitemap.xml.ts`, importándolo desde `../data/companyPages` (depende de T004)

**Checkpoint**: `/faq/` existe y cumple su prueba independiente. El home sigue igual (todavía no cambia ningún enlace).

---

## Phase 4: User Story 2 - Visitante que quiere saber si la empresa es confiable (Priority: P1)

**Goal**: `/licenses-and-credentials/` muestra exactamente "The Elite Guarantee", con ese título como único H1 y "Licensed and insured in Florida." entre el subtítulo y las 3 garantías, sin número de licencia.

**Independent Test**: Pasos 3 y 5 de [quickstart.md](quickstart.md) aplicados a `/licenses-and-credentials/`: 1 H1 "The Elite Guarantee", la mención antes de "Honest Hourly Rate", las 3 garantías y 0 coincidencias de `TBD`, `Pending`, `License #` o `{{`.

- [X] T010 [P] [US2] En `src/components/layout/Footer.astro`, reemplazar el texto fijo "Licensed and insured in Florida." por `{site.licenseNote}`, sin cambiar el `<p>` ni sus clases. El HTML generado queda igual (depende de T003)
- [X] T011 [P] [US2] En `src/components/sections/EliteGuarantee.astro`, añadir `interface Props { headingLevel?: "h1" | "h2"; showLicenseNote?: boolean }` con valores por defecto `"h2"` y `false`. Pasar `headingLevel` a `<SectionHeader>`. Si `showLicenseNote` es `true`, mostrar `site.licenseNote` en un `<p>` centrado justo después del bloque del `SectionHeader` y antes de la cuadrícula de tarjetas, con estilos existentes del sitio (por ejemplo `mt-6 text-center font-accent text-sm font-semibold text-text-strong`). No cambiar `id="guarantee"`, clases, textos ni tarjetas. `src/pages/index.astro` no se toca (depende de T003 y T005)
- [X] T012 [US2] Crear `src/pages/licenses-and-credentials.astro` con la misma estructura que `src/pages/faq.astro`: `BaseLayout` con `licensesPage.meta`, JSON-LD `MovingCompany` (mismos campos y exclusiones que T008) y `BreadcrumbList` Home → `licensesPage.label` (`licensesPage.href`), `<Navbar />`, `<main id="main-content" class="bg-offwhite pt-20">` con `<EliteGuarantee headingLevel="h1" showLicenseNote />` y `<Footer />` (depende de T004 y T011)
- [X] T013 [US2] Añadir `licensesPage.href` a `routes` en `src/pages/sitemap.xml.ts`, junto a `faqPage.href` (depende de T004; mismo archivo que T009, hacerlas en orden)

**Checkpoint**: Las 2 páginas existen y cumplen su prueba independiente.

---

## Phase 5: User Story 3 - Visitante que llega desde el menú "Company" (Priority: P1)

**Goal**: "Licenses & Credentials" y "FAQ" llevan a sus páginas en navbar (escritorio y móvil) y footer, y el enlace principal "Company" lleva a `/about-us/`.

**Independent Test**: Paso 7 de [quickstart.md](quickstart.md): pulsar los enlaces en el navbar de escritorio, el menú móvil y el footer, desde el home y desde otra página.

- [X] T014 [US3] En `src/data/navigation.ts`, importar `licensesPage` y `faqPage` desde `./companyPages`. En el grupo "Company": cambiar `href` de `"/#guarantee"` a `"/about-us/"`, y los hijos "Licenses & Credentials" y "FAQ" a `{ label: licensesPage.label, href: licensesPage.href }` y `{ label: faqPage.label, href: faqPage.href }`. Añadir un comentario breve con la referencia a la spec 009. Dejar "About" y los grupos Moving, Locations y Services sin cambios. Hacerlo después de que las 2 páginas existan (principio IV) (depende de T008 y T012)

**Checkpoint**: Las 3 historias funcionan. Ningún enlace del menú "Company" lleva a un ancla del home.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validación completa según [quickstart.md](quickstart.md) y registro de pendientes.

- [X] T015 Ejecutar `npm run astro -- check` y `npm run build`, ambos sin errores (paso 1 de quickstart)
- [X] T016 Comparar `dist/client/index.html` con la referencia de T001: solo cambian los `href` de "Company", "Licenses & Credentials" y "FAQ" (y los hashes de assets, si los hay). Confirmar que el home sigue con el JSON-LD `FAQPage`, títulos en `<h2>` y solo las preguntas de Pricing & Billing en el HTML de la FAQ (paso 2 de quickstart, SC-009)
- [X] T017 Revisar el `<head>` de las 2 páginas y el sitemap: título y descripción únicos frente a las demás páginas de `dist/client/**/index.html`, canónica correcta, JSON-LD según [contracts/routes.md](contracts/routes.md), y `/licenses-and-credentials/` y `/faq/` en `dist/client/sitemap.xml` (pasos 5 y 6 de quickstart)
- [X] T018 Con `npm run preview`, recorrer los enlaces de las 2 páginas (todos responden 200), probar a 360 px que no hay scroll horizontal y que "Call Now" sigue visible, y correr Lighthouse móvil en las 2 páginas (LCP < 2.5 s, CLS < 0.1). Si el LCP falla por la animación del H1, aplicar la mitigación de [research.md R9](research.md#r9-schema-por-página-y-espacio-bajo-el-navbar) (pasos 7 a 9 de quickstart) — Enlaces y capturas verificados por Claude; 360 px, filtros, menú móvil y Lighthouse confirmados por el dueño el 2026-11-07 (ver verification.md)
- [X] T019 Crear `specs/009-company-info-pages/verification.md` con el resultado de T015 a T018 y la lista de pendientes del dueño: número de licencia o de registro de mudanzas en Florida (FR-006)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias.
- **Foundational (Phase 2)**: Depende de Setup. Bloquea todas las historias.
- **US1 (Phase 3)** y **US2 (Phase 4)**: Dependen de Foundational. Son independientes entre sí, salvo `sitemap.xml.ts` (T009 y T013 tocan el mismo archivo).
- **US3 (Phase 5)**: Depende de US1 y US2, porque los enlaces solo cambian cuando las páginas existen (principio IV, sin 404).
- **Polish (Phase 6)**: Depende de todas las historias.

### Within Each User Story

- US1: T006 → T007 → T008. T009 puede ir en cualquier momento después de T004.
- US2: T010 y T011 en paralelo → T012. T013 después de T009.

### Parallel Opportunities

- T005 en paralelo con T003 y T004 (después de T002).
- T006 (US1) en paralelo con T010 y T011 (US2).
- US1 y US2 completas en paralelo, coordinando `sitemap.xml.ts`.

---

## Parallel Example: User Story 1 y 2

```text
# Después de la fase 2:
Task: "T006 [US1] Prop renderAllCategories en src/components/react/FAQSection.tsx"
Task: "T010 [US2] Footer lee site.licenseNote en src/components/layout/Footer.astro"
Task: "T011 [US2] Props headingLevel y showLicenseNote en src/components/sections/EliteGuarantee.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Fases 1 y 2.
2. Fase 3: `/faq/` existe y se valida por URL directa. Todavía no está enlazada.
3. **Parar y validar**: quickstart pasos 3 a 5 para `/faq/`.

### Incremental Delivery

1. US1 → `/faq/` validada.
2. US2 → `/licenses-and-credentials/` validada.
3. US3 → cambio de enlaces y validación de navegación.
4. Polish → validación completa y `verification.md`.

Las 3 historias son P1. Se publican juntas, porque una página sin enlace del menú no cumple el objetivo del dueño.
