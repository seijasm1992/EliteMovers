# Data Model: Páginas propias para cada servicio del menú "Moving"

*Revisado el 2026-11-07 tras la reducción a 2 secciones.*

Tipos en `src/types/content.ts`. Datos en `src/data/movingServicePages.ts`. No hay base de datos: todo es contenido estático tipado.

## MovingServicePage (`src/data/movingServicePages.ts`)

Arreglo ordenado de 6 entradas, en el mismo orden del menú: local, long distance, office, commercial, small, large.

| Campo | Tipo | Regla |
|-------|------|-------|
| `slug` | `MovingServiceSlug` (`"local-moving" \| "long-distance-moving" \| "office-moving" \| "commercial-moving" \| "small-moves" \| "large-moves"`) | Único. Coincide con el nombre del archivo en `src/pages/`. |
| `label` | `string` | Etiqueta del menú ("Local Moving", etc.). |
| `href` | `string` | `/${slug}/`, con barra final. |
| `meta.title` | `string` | Único en el sitio, ≤ 60 caracteres. |
| `meta.description` | `string` | Única, 140–160 caracteres, sin montos. |
| `hero.eyebrow` | `string` | Texto corto sobre el H1. |
| `hero.title` | `string` | Único H1 de la página; incluye el nombre del servicio. |
| `hero.description` | `string` | Párrafo propio de **2 a 3 frases** (FR-003). |
| `hero.image` | `{ src480, src720, src960, alt, width, height }` | Rutas de `public/images/services/`. `alt` no vacío y descriptivo. |
| `included.title` | `string` | Título de la sección "Qué incluye", propio del servicio. |
| `included.items` | `{ title, description }[]` | **De 3 a 5 puntos** propios del servicio (FR-003, FR-008). |

**Campos eliminados** en la revisión: `included.intro`, `process`, `pricingNote`, `faq` y `relatedIntro` ([research.md](research.md), R13).

**Validación** (en la revisión de [quickstart.md](quickstart.md)):
- Ningún campo contiene `$`, `USD`, `135`, `40/h`, `rating`, `stars`, `license`/`licensed` ni marcadores como `{{`, `TBD` o `pending`.
- `meta.title` y `meta.description` no se repiten entre páginas ni con las del resto del sitio.
- Ningún párrafo ni punto es igual al de otra página salvo por el nombre del servicio (SC-005).

## Entidades retiradas

`PricingFacts` (`src/data/pricing.ts`), `Credentials` y `Review` (`src/data/reviews.ts`) se eliminan junto con las secciones de precios, garantías y reseñas, que quedaron fuera de alcance. Los datos de tarifa que dio el dueño siguen en las aclaraciones de la [spec](spec.md#clarifications).

## Navegación (`src/data/navigation.ts`)

Sin cambios: los hijos de "Moving" son `movingServicePages.map(({ label, href }) => ({ label, href }))`.

## Registro de pendientes (FR-007)

Con el alcance reducido, ningún dato pendiente bloquea la publicación. Se mantienen registrados para cuando vuelvan las secciones que los usan.

| Dato | Dónde se usaría | Estado en la página publicada |
|------|-----------------|-------------------------------|
| Número de licencia o registro de mudanzas en Florida | Garantías (fuera de alcance) | No se menciona |
| Detalles del seguro más allá de "general liability" | Garantías (fuera de alcance) | No se menciona |
| Reseñas reales con autor y fuente | Reseñas (fuera de alcance) | No se menciona |
| Calificación y número de reseñas | Reseñas y schema | No se muestran ni van en el schema |
| Montos de la tarifa (USD 135/h y USD 40/h por mover extra) | Precios (fuera de alcance) | Confirmados, no se publican por decisión del dueño |
