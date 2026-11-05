# Contrato: informes de la entrega

Este trabajo no expone interfaces nuevas en el sitio. Lo que el dueño recibe y usa son estos informes. Todo lo que se guarda en el repositorio cumple FR-029: el repositorio es público, así que indica el tipo de dato sensible y nunca su valor.

## `inventory.md`

**Cuándo**: antes de cambiar nada (FR-014).

Una fila por cada recurso de `public/`:

| Columna | Contenido |
|---------|-----------|
| Archivo | Ruta dentro de `public/`; las versiones de tamaño se agrupan con su imagen base |
| Dónde se usa | Archivo y línea, o `sin uso en las páginas` |
| Metadatos | Tipos encontrados y si tiene GPS |
| Señalamientos | Tipos encontrados |
| Acción ahora | `limpiar`, `retirar` o `ninguna` |
| Propuesta para el montaje | `conservar`, `sustituir` o `retirar` |

## Informe de selección

**Cuándo**: al terminar la revisión, y antes de cualquier cambio en el sitio (FR-007). Se entrega en el mensaje al dueño, con una hoja de contacto local fuera del repositorio.

**Contiene**:

1. Total de fotos y total por subcarpeta (FR-002).
2. Archivos que no se pudieron abrir o con formato no compatible, con su ruta.
3. Candidatas, cada una con los campos de [data-model.md](../data-model.md).
4. Fotos señaladas que no se proponen, con el motivo.
5. Secciones sin candidata adecuada.
6. Decisiones que el dueño debe tomar, incluidas cada aprobación explícita de un señalamiento y la foto para compartir en redes (FR-032).

## `selection.md`

**Cuándo**: después de que el dueño apruebe (FR-030).

Una fila por foto aprobada:

| Columna | Contenido |
|---------|-----------|
| Nombre descriptivo | Minúsculas y guiones |
| Ruta original | Relativa a la carpeta de originales |
| Sección propuesta | Orientativa |
| Texto alternativo | En inglés |
| Señalamientos aprobados | Tipos |
| Recorte previsto | Qué debe quedar fuera, o `ninguno` |

Si un nombre de archivo original contiene datos privados, esa ruta no se guarda en el repositorio y se indica aparte al dueño.

## `verification.md`

**Cuándo**: se actualiza en la comprobación local y en la de producción (FR-026).

Una fila por criterio, de SC-001 a SC-010:

| Columna | Contenido |
|---------|-----------|
| Criterio | SC-00X |
| Dónde | `local` o `producción` |
| Resultado | `cumple`, `no cumple` o `pendiente` |
| Evidencia | Salida resumida de la comprobación |
