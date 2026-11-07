# Data Model: Revisión de imágenes y reemplazo

No hay base de datos. Las entidades son filas de la tabla de revisión ([contracts/review-table.md](contracts/review-table.md)) y rutas en `src/data/`.

## Archivo revisado

Un archivo de imagen o video de `public/`.

| Campo | Tipo | Regla |
|-------|------|-------|
| `id` | texto | Ruta relativa a `public/`, única |
| `kind` | `image` \| `video` | — |
| `group` | texto | Grupo de variantes de la misma foto (por ejemplo, `included/boxes-loading-ramp`). Las variantes `-480`, `-720`, `-960` y los respaldos `.jpg`/`.jpeg` se revisan como un grupo, con una sola decisión |
| `inUse` | sí \| no | Según [research.md](research.md), R1 |
| `usedIn` | lista de página + sección | Vacía si `inUse = no` |
| `referencedBy` | lista de rutas de `src/` | Incluye referencias en código que no se renderiza |
| `shows` | texto corto en inglés o español | Qué se ve, sin transcribir datos privados |
| `currentAlt` | texto | Vacío si es decorativa (`alt=""`) |
| `metadata` | `none` \| `exif` \| `xmp` \| `icc` \| `gps` | — |
| `format` | `webp` \| `avif` \| `jpeg` \| `png` \| `svg` \| `ico` \| `mp4` \| `webm` | Una imagen que no es `webp` ni `avif` debe convertirse o eliminarse (FR-014), salvo el favicon |
| `reviewedIn001` | sí \| no | Sí para las fotos de `library/` aprobadas en la spec 001: no se repite su revisión visual |

## Decisión de revisión

Una por grupo.

| Campo | Tipo | Regla |
|-------|------|-------|
| `status` | `cumple` \| `no cumple` \| `dudosa` | `dudosa` obliga a que decida el dueño |
| `reasons` | lista de motivos de FR-003 | Obligatoria si `status ≠ cumple` |
| `action` | `conservar` \| `reemplazar` \| `eliminar` \| `limpiar metadatos` \| `convertir a WebP` | `reemplazar` solo si `inUse = sí`; `eliminar` si `inUse = no` y `status = no cumple` (FR-008a), o si `format` no es WebP/AVIF y ya existen sus variantes WebP; `convertir a WebP` si cumple, `format` no es WebP/AVIF y hace falta conservarla (FR-014) |
| `replacement` | id de candidata | Obligatorio si `action = reemplazar` |
| `repeated` | sí \| no | Sí solo con la excepción de FR-006 |
| `ownerApproved` | sí \| no \| rechazado | Nada se cambia mientras sea `no` |

### Motivos (FR-003)

`moving-shark`, `otro-telefono`, `logo-añadido`, `apariencia-ia`, `matricula`, `numero-casa`, `cliente-identificable`, `gps`.

Los empleados de ProElite Movers identificables no son un motivo.

## Candidata de reemplazo

Una foto de `public/images/` que cumple FR-003.

| Campo | Tipo | Regla |
|-------|------|-------|
| `source` | ruta | Debe existir y tener `status = cumple` |
| `fitsSection` | lista de secciones | Según el contenido de la foto |
| `usedNearby` | lista de secciones | Para aplicar FR-006 |
| `newBase` | ruta base | Nombre descriptivo nuevo, por ejemplo `/images/included/padded-wrapped-furniture-truck` |
| `variants` | lista de archivos generados | Según la tabla de [research.md](research.md), R5 |
| `alt` | texto en inglés | Fiel a lo que muestra la foto recortada |

## Mención de texto

| Campo | Tipo | Regla |
|-------|------|-------|
| `location` | ruta + línea, o archivo + campo de metadatos | — |
| `match` | texto | `shark`, `407` o variante del teléfono |
| `refersToOldCompany` | sí \| no | Si es `no`, se explica (hash, medida, color) |
| `action` | `eliminar` \| `corregir` \| `ninguna` | `ninguna` solo si `refersToOldCompany = no` |

## Transiciones

```text
Archivo revisado:  pendiente → revisado (cumple | no cumple | dudosa)
dudosa            → cumple | no cumple          (decide el dueño)
no cumple + en uso    → reemplazo propuesto → aprobado → reemplazado → original sin referencias → eliminado
no cumple + sin uso   → aprobado → referencias muertas quitadas → eliminado
cumple + metadatos    → aprobado → metadatos quitados
cumple + no WebP/AVIF → aprobado → convertido a WebP (o eliminado si ya tiene variantes) → original eliminado
reemplazo rechazado   → nueva candidata propuesta → aprobado
```

Ningún archivo pasa de `revisado` a un estado con cambios sin `ownerApproved = sí`.
