# Data Model: Selección de imágenes reales y limpieza de metadatos

No hay base de datos ni tipos nuevos en el sitio. Estas entidades describen la información de los informes. Su formato está en [contracts/reports.md](contracts/reports.md).

## Foto original

| Campo | Descripción |
|-------|-------------|
| Ruta | Ruta completa dentro de la carpeta de originales |
| Subcarpeta | Para el conteo por subcarpeta (FR-002) |
| Formato | `jpeg`, `jpg` o `heic` |
| Estado de lectura | `legible`, `no compatible` o `no se pudo abrir` |
| Huella | Para comprobar que sigue intacta (SC-008); solo en el manifiesto local |

**Regla**: nunca se modifica, mueve, borra ni copia al repositorio (FR-008).

## Candidata

| Campo | Descripción |
|-------|-------------|
| Ruta original | Referencia a la foto original |
| Sección propuesta | Orientativa; el dueño decide el uso final más adelante (FR-004) |
| Nombre descriptivo | Minúsculas y guiones, único en la lista |
| Texto alternativo | En inglés; describe solo lo que se ve |
| Señalamientos | Cero o más |
| Observaciones | Por ejemplo, marcas de terceros visibles |
| Decisión | Ver estados |

**Reglas**:

- Hasta 15 candidatas, más alternativas si una sección las necesita (FR-003).
- De cada grupo de duplicados se propone solo la mejor versión (FR-006).
- Los textos no inventan ciudades, servicios, fechas ni datos de clientes (FR-013).

### Estados de una candidata

```text
propuesta ──> aprobada
propuesta ──> aprobada con recorte previsto
propuesta ──> rechazada
```

- **aprobada**: si tiene señalamientos, el dueño aprobó cada uno de forma explícita.
- **aprobada con recorte previsto**: el recorte se aprueba ahora y se aplica en el montaje posterior.
- **Moving Shark**: solo admite `aprobada con recorte previsto`, si el recorte quita la marca, o `rechazada` (FR-005).

## Señalamiento

| Campo | Descripción |
|-------|-------------|
| Tipo | `moving-shark`, `matrícula`, `dirección`, `persona identificable` o `datos de cliente` |
| Ubicación en la foto | Descripción general, por ejemplo "esquina inferior izquierda" |

**Regla**: registra el tipo, nunca el valor. No se copia la matrícula, la dirección ni el nombre (FR-029).

## Lista aprobada

Se guarda en `selection.md`, sin fotos (FR-030). Contiene solo las candidatas con estado `aprobada` o `aprobada con recorte previsto`.

## Recurso público

| Campo | Descripción |
|-------|-------------|
| Ruta | Dentro de `public/` |
| Tipo | `imagen`, `video` u `otro` |
| Dónde se usa | Archivo y línea, o `sin uso en las páginas` |
| Metadatos | Tipos encontrados, y si tiene GPS |
| Señalamientos | Mismo formato que en las candidatas |
| Acción ahora | `limpiar`, `retirar` o `ninguna` |
| Propuesta para el montaje | `conservar`, `sustituir` o `retirar` |

### Estados de un recurso público en este trabajo

```text
inventariado ──> sin cambios                  # no tiene metadatos
inventariado ──> limpio ──> comprobado        # se quitaron sus metadatos
inventariado ──> retirado ──> comprobado      # Componente.jpg, el PDF y las imágenes generadas por IA
```

**Regla**: ningún recurso cambia de estado antes de la aprobación del dueño (FR-007).
