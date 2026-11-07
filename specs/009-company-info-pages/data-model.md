# Data Model: Páginas "Licenses & Credentials" y "FAQ"

## CompanyPage (nuevo, `src/types/content.ts`)

Una página del menú "Company" cuyo contenido visible es una sección del home.

| Campo | Tipo | Regla |
|-------|------|-------|
| `label` | `string` | Etiqueta del menú: `"Licenses & Credentials"` o `"FAQ"`. También es el nombre en `BreadcrumbList`. |
| `href` | `string` | Ruta en la raíz con barra final: `/licenses-and-credentials/` o `/faq/`. |
| `meta.title` | `string` | Único en el sitio (FR-014). |
| `meta.description` | `string` | Única en el sitio. Solo usa hechos ya publicados (FR-010). |

Instancias en `src/data/companyPages.ts`: `licensesPage` y `faqPage` (valores en [research.md](research.md#r8-títulos-y-meta-descriptions)).

## SiteConfig (editado)

| Campo nuevo | Tipo | Valor |
|-------------|------|-------|
| `licenseNote` | `string` | `"Licensed and insured in Florida."`. Lo leen el footer y `EliteGuarantee` cuando `showLicenseNote` es `true`. |

No hay campo para el número de licencia. Se agrega cuando el dueño lo confirme (FR-006).

## Contenido reutilizado (sin cambios)

- `GuaranteeContent` (`src/data/guarantee.ts`): antetítulo, título, subtítulo y 3 garantías.
- `FAQItem[]` (`src/data/faqContent.ts`): 20 preguntas en 5 categorías. El orden de las categorías sale del orden del arreglo.

## Props nuevas de componentes

Todas tienen un valor por defecto que reproduce el home tal como está.

| Componente | Prop | Tipo | Defecto | En la página nueva |
|------------|------|------|---------|--------------------|
| `SectionHeader.astro` | `headingLevel` | `"h1" \| "h2"` | `"h2"` | — (la pasan las secciones) |
| `EliteGuarantee.astro` | `headingLevel` | `"h1" \| "h2"` | `"h2"` | `"h1"` |
| `EliteGuarantee.astro` | `showLicenseNote` | `boolean` | `false` | `true` |
| `FAQSection.astro` | `headingLevel` | `"h1" \| "h2"` | `"h2"` | `"h1"` |
| `FAQSection.astro` | `includeSchema` | `boolean` | `true` | `false` |
| `FAQSection.tsx` | `renderAllCategories` | `boolean` | `false` | `true` |

## Navegación (editada, `src/data/navigation.ts`)

| Elemento | Antes | Después |
|----------|-------|---------|
| "Company" (enlace principal) | `/#guarantee` | `/about-us/` |
| "Licenses & Credentials" | `/#guarantee` | `licensesPage.href` |
| "FAQ" | `/#faq` | `faqPage.href` |
| "About" | `/about-us/` | Sin cambios |
