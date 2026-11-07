# Contract: Tabla de revisión (`review.md`)

Documento que el dueño aprueba antes de cualquier cambio (FR-004). Vive en `specs/006-remove-moving-shark-images/review.md`.

## Reglas generales

- Una fila por grupo de variantes (ver [data-model.md](../data-model.md)). La columna "Archivos" lista todas las variantes del grupo.
- Están todos los archivos de imagen y video de `public/`, en uso o no (SC-001).
- Nunca se transcribe el valor de un dato privado. Se escribe el tipo: "matrícula legible", no la matrícula.
- Las fotos se identifican por su ruta. El dueño las ve en la hoja de contacto local, no en el repositorio.

## Sección 1: Resumen

```markdown
| Total grupos | En uso | Sin uso | Cumplen | No cumplen | Dudosas | Videos revisados |
|--------------|--------|---------|---------|------------|---------|------------------|
```

## Sección 2: Archivos

```markdown
| # | Archivos | Formato | En uso | Dónde se usa | Qué muestra | Metadatos | Estado | Motivos | Acción | Reemplazo propuesto | Aprobado |
|---|----------|---------|--------|--------------|-------------|-----------|--------|---------|--------|---------------------|----------|
```

- **Formato**: extensión real de cada archivo del grupo. Cualquier formato distinto de WebP o AVIF lleva acción `Convertir a WebP` o `Eliminar` (FR-014), salvo el favicon.
- **Estado** de las fotos de `library/` aprobadas en la spec 001: `Cumple (revisada en 001)`.

- **Dónde se usa**: `página › sección`, por ejemplo `/ › Hero`, `/about-us/ › Story`, `todas › og:image`.
- **Estado**: `Cumple`, `No cumple` o `Dudosa`.
- **Motivos**: códigos de [data-model.md](../data-model.md), separados por comas.
- **Acción**: `Conservar`, `Reemplazar`, `Eliminar`, `Limpiar metadatos` o `Convertir a WebP`.
- **Aprobado**: vacío hasta que el dueño responda. Después, `Sí`, `No` o `Rechazado: <motivo>`.

## Sección 3: Videos

```markdown
| Video | En uso | Duración | Fotogramas revisados | Escenas que no cumplen (segundo y motivo) | Estado | Acción | Aprobado |
|-------|--------|----------|----------------------|-------------------------------------------|--------|--------|----------|
```

## Sección 4: Reemplazos

```markdown
| Sección | Imagen actual | Foto de reemplazo | Recorte | Variantes generadas | Texto alternativo nuevo | Repetida |
|---------|---------------|-------------------|---------|---------------------|-------------------------|----------|
```

- **Foto de reemplazo**: ruta de `public/images/` de donde sale.
- **Repetida**: `No`, o `Sí: también en <sección>` (excepción de FR-006).

## Sección 5: Menciones de texto

```markdown
| Ubicación | Coincidencia | ¿Empresa anterior? | Acción |
|-----------|--------------|--------------------|--------|
```

Si no hay coincidencias, la sección dice "Sin coincidencias" y lista dónde se buscó.

## Sección 6: Código afectado

Lista de archivos de `src/` que cambian (rutas en `src/data/`, referencias muertas y, si se aprueba, el componente `HeroSlider.tsx` o el `<video>` del hero), con una línea por archivo explicando el cambio.

## Aprobación

Al final, una línea: `Aprobado por el dueño el AAAA-MM-DD`, o la lista de filas rechazadas.
