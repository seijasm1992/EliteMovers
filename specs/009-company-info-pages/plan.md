# Implementation Plan: Páginas propias para "Licenses & Credentials" y "FAQ" del menú "Company"

**Branch**: `009-company-info-pages` | **Date**: 2026-11-07 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-company-info-pages/spec.md`

## Summary

Crear dos páginas estáticas, `/licenses-and-credentials/` y `/faq/`, con el mismo contenido que las secciones "The Elite Guarantee" y FAQ del home. Cada una tiene título y meta description propios, canónica, entrada en el sitemap y JSON-LD `MovingCompany` y `BreadcrumbList`. Los enlaces "Licenses & Credentials" y "FAQ" del menú "Company" pasan a esas páginas, y el enlace principal "Company" pasa a `/about-us/`.

Enfoque: reutilizar `EliteGuarantee.astro` y `FAQSection.astro` en las páginas nuevas, con props opcionales cuyo valor por defecto deja el home igual ([research.md](research.md)):

- `headingLevel`: el título de la sección es el único H1.
- `showLicenseNote`: agrega "Licensed and insured in Florida." debajo del subtítulo. El texto pasa a `site.ts`, también para el footer.
- `includeSchema={false}`: el schema FAQPage queda solo en el home.
- `renderAllCategories`: la isla de la FAQ pone las 20 respuestas en el HTML y oculta las categorías inactivas.

## Technical Context

**Language/Version**: TypeScript, Astro 6 y React 19. Node.js ≥ 22.12.

**Primary Dependencies**: Stack del proyecto sin cambios (Astro 6, React 19, Tailwind 4, adaptador de Cloudflare). No se agregan dependencias.

**Storage**: `src/data/companyPages.ts` (nuevo), tipado con `CompanyPage` en `src/types/content.ts`. El contenido visible sigue en `guarantee.ts` y `faqContent.ts`, y `site.licenseNote` es nuevo.

**Testing**: El proyecto no tiene scripts de pruebas. Se valida con [quickstart.md](quickstart.md), `npm run astro -- check`, `npm run build` y revisión del HTML de `dist/client/`, incluida la comparación con el home anterior.

**Target Platform**: Sitio en Cloudflare (`proelitemovers.com`). Las páginas se prerenderizan como HTML estático.

**Project Type**: Sitio web existente. Dos páginas estáticas nuevas.

**Performance Goals**: Core Web Vitals en verde en móvil (principio IX): LCP < 2.5 s, INP < 200 ms, CLS < 0.1. Las páginas no tienen imágenes. `/faq/` hidrata la isla de la FAQ que ya existe.

**Constraints**:
- Sin contenido nuevo aparte del título, la meta description y la mención de licencia del footer (FR-010).
- El HTML del home solo cambia en los `href` del menú "Company".
- Moving, Locations, Services y "About" quedan igual.
- Sin número de licencia ni marcadores de pendiente visibles (FR-006).

**Scale/Scope**: 3 archivos nuevos (`src/pages/licenses-and-credentials.astro`, `src/pages/faq.astro`, `src/data/companyPages.ts`) y 9 editados (`SectionHeader.astro`, `EliteGuarantee.astro`, `FAQSection.astro`, `react/FAQSection.tsx`, `Footer.astro`, `site.ts`, `navigation.ts`, `sitemap.xml.ts`, `content.ts`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cómo se cumple | Estado |
|-----------|----------------|--------|
| I. Precios transparentes | No se muestran montos. El texto reutilizado describe el cobro solo por hora. | ✅ |
| II. Honestidad | "Licensed and insured in Florida" ya está publicado y el dueño pidió usarlo. El número de licencia no se inventa ni se muestra; queda pendiente. Sin reseñas ni cifras. | ✅ |
| III. Imágenes reales | Sin imágenes nuevas. | ✅ |
| IV. Cero rutas rotas | Las páginas existen antes de que el menú las enlace; las URLs salen de `companyPages.ts`. `/#guarantee` y `/#faq` siguen funcionando. | ✅ |
| V. SEO orgánico | El schema FAQPage se marca una sola vez (en el home). El contenido oculto en pestañas está en el HTML, sin texto escondido para engañar. **Riesgo**: las páginas repiten texto del home, así que Google puede darle más peso a una de las dos versiones. Es lo que pidió el dueño. | ⚠️ Riesgo aceptado |
| VI. SEO técnico por página | Título y descripción únicos, 1 H1, canónica, sitemap, `MovingCompany` coherente con lo visible. No hay imágenes que necesiten alt. | ✅ |
| VII. NAP consistente | Nombre, teléfono y correo desde `site.ts`; la mención de licencia también. | ✅ |
| VIII. Contenido local | El contenido existente trata de Miami y el sur de Florida. | ✅ |
| IX. Rendimiento | Páginas sin imágenes. Riesgo de LCP por la animación de entrada del H1; se mide en el paso 9 del quickstart, con mitigación definida (R9). | ✅ |
| X. JS mínimo | `/licenses-and-credentials/` no agrega JS. `/faq/` usa la isla que ya existe; es interacción real (filtros y acordeón). | ✅ |
| XI. Mobile first | "Call Now" del navbar en todas las páginas; la FAQ conserva su botón "Request a Quote". | ✅ |
| XII. Simplicidad | Se reutilizan las secciones con props opcionales; sin plantilla genérica ni generador de schema compartido. | ✅ |
| Idioma y tono | Contenido existente en inglés; títulos y descripciones nuevos en inglés. | ✅ |

**Re-check después de la fase 1**: Sin violaciones. Queda el aviso de contenido repetido (V), aceptado por el dueño en la spec. Se aclaró FR-012 en la spec: la franja "Request a Quote" de la FAQ es parte de la sección del home y se mantiene ([research.md R6](research.md#r6-botón-request-a-quote-dentro-de-la-sección-faq)).

## Project Structure

### Documentation (this feature)

```text
specs/009-company-info-pages/
├── plan.md              # Este archivo
├── research.md          # R1–R9
├── data-model.md        # CompanyPage, licenseNote y props nuevas
├── quickstart.md        # Validación
├── contracts/
│   └── routes.md        # Rutas, enlaces, estructura y <head>
├── checklists/
│   └── requirements.md
└── tasks.md             # Lo genera /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── pages/
│   ├── licenses-and-credentials.astro   # nuevo: BaseLayout + Navbar + EliteGuarantee(h1, licencia) + Footer + JSON-LD
│   ├── faq.astro                        # nuevo: BaseLayout + Navbar + FAQSection(h1, sin schema, todas las categorías) + Footer + JSON-LD
│   └── sitemap.xml.ts                   # editado: añade las 2 rutas
├── components/
│   ├── ui/SectionHeader.astro           # editado: prop headingLevel
│   ├── sections/EliteGuarantee.astro    # editado: props headingLevel y showLicenseNote
│   ├── sections/FAQSection.astro        # editado: props headingLevel e includeSchema
│   ├── react/FAQSection.tsx             # editado: prop renderAllCategories
│   └── layout/Footer.astro              # editado: lee site.licenseNote (mismo HTML)
├── data/
│   ├── companyPages.ts                  # nuevo: licensesPage y faqPage
│   ├── site.ts                          # editado: licenseNote
│   └── navigation.ts                    # editado: Company → /about-us/, hijos → companyPages
└── types/content.ts                     # editado: CompanyPage y SiteConfig.licenseNote
```

**Structure Decision**: Dos páginas explícitas en `src/pages/`, como `/location/` y las de Moving, que reutilizan las secciones del home. Un archivo de datos pequeño es la fuente única de las URLs y los metadatos.

## Complexity Tracking

Sin violaciones de la constitución que justificar.
