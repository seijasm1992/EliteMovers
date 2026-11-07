# Data Model: Página de Miami

## LocationPage (nuevo, `src/types/content.ts`)

| Campo | Tipo | Regla |
|-------|------|-------|
| `label` | `string` | Etiqueta del menú: `"Miami"`. |
| `href` | `string` | Ruta en la raíz con barra final: `"/location/"`. Única fuente de la URL para página, menú y sitemap. |
| `meta.title` | `string` | Único en el sitio; ≤ 60 caracteres. |
| `meta.description` | `string` | Única en el sitio; ≤ 160 caracteres. Solo reformula la sección "Service Area"; el teléfono viene de `site.phone`. |

Instancia: `miamiPage` en `src/data/locationPages.ts` (valores en [research.md](research.md), R5).

No lleva contenido visible: el texto, el mapa y el teléfono viven en `QuoteSection.astro`, compartido con el home (R2).

## NavLink (existente, sin cambios de tipo)

El hijo `{ label: "Miami", href: "/#quote" }` del grupo "Locations" pasa a `{ label: miamiPage.label, href: miamiPage.href }`.

## Props de QuoteSection (cambio)

| Prop | Tipo | Por defecto | Uso |
|------|------|-------------|-----|
| `headingLevel` | `"h1" \| "h2"` | `"h2"` | El home no la pasa (sigue en `h2`); `/location/` pasa `"h1"`. |
