# Data Model: Páginas informativas para cada servicio del menú "Services"

Contenido estático tipado en `src/types/content.ts` y guardado en `src/data/serviceInfoPages.ts`. No hay base de datos ni estado.

## ServiceInfoSlug

Unión de literales, en el orden del menú:

`"packing-services" | "installation" | "high-value-items" | "furniture-protection" | "move-coordination"`

## ServiceInfoPage

| Campo | Tipo | Reglas |
|-------|------|--------|
| `slug` | `ServiceInfoSlug` | Único. Coincide con el nombre del archivo en `src/pages/` y de las fotos. |
| `label` | `string` | Etiqueta del menú y texto del H1. |
| `href` | `string` | `/${slug}/`, en la raíz, con barra final. |
| `meta.title` | `string` | Único en el sitio. ≤ 60 caracteres aprox. |
| `meta.description` | `string` | Única en el sitio. 120–160 caracteres aprox. |
| `hero.description` | `string` | 2 o 3 frases propias. |
| `hero.image` | `{ src480, src720, src960, alt, width: 960, height: 720 }` | Mismo formato que `MovingServicePage.hero.image`. Rutas `/images/services/${slug}-{480,720,960}.webp`. `alt` no vacío. |
| `steps.title` | `string` | H2 propio de la página. |
| `steps.items` | `[Step, Step, Step]` | Exactamente 3 (tupla, para que el tipo lo exija). |
| `closing.text` | `string` | Una línea que termina en "→". El destino es siempre `/get-a-quote/`, así que no se guarda. |

**Step**: `{ title: string; description: string }`. Título corto; descripción de 1 o 2 frases.

## Reglas de validación (de la spec)

- Ningún texto contiene montos en dólares, calificaciones, estrellas, reseñas ni marcadores de pendiente (FR-007, FR-009).
- Ningún par de páginas comparte `hero.description`, un `Step` o `closing.text` idénticos o que solo cambien el nombre (FR-008).
- Cada `hero.image` es distinta y no repite las fotos de Moving (FR-011).
- Cada afirmación tiene una fuente listada en [contracts/page-content.md](contracts/page-content.md) (FR-005 a FR-007).

## Relaciones

- `navigation.ts` → el grupo "Services" toma `label` y `href` de cada `ServiceInfoPage` (5 enlaces).
- `Footer.astro` → recorre `navigation`, sin cambios propios.
- `sitemap.xml.ts` → incluye cada `href`.
- `getServiceInfoPage(slug)` → devuelve la página o lanza un error en el build si el slug no existe.
