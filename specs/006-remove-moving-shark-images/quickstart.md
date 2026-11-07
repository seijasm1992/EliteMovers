# Quickstart: Comprobaciones de la entrega

Guía para comprobar que la feature cumple la spec. Los resultados se anotan en `verification.md`.

## Requisitos previos

- Node.js ≥ 22.12 y dependencias instaladas (`npm install`).
- `PUBLIC_TURNSTILE_SITE_KEY` en `.env`, o `ENABLE_TURNSTILE=false` para el build local (ver `CLAUDE.md`).
- `review.md` aprobado por el dueño ([contracts/review-table.md](contracts/review-table.md)).

## 1. La tabla está completa (SC-001)

- Contar los archivos de imagen y video de `public/` antes del cambio (58 imágenes y 3 videos, [research.md](research.md), R1).
- **Esperado**: cada uno aparece en una fila de `review.md`, con estado y acción. Ninguna fila tiene "Aprobado" vacío.

## 2. Nada se cambió antes de la aprobación (FR-004)

- Comparar la fecha de aprobación de `review.md` con el primer commit o cambio que toca `public/` o `src/data/`.
- **Esperado**: ningún cambio en `public/` ni en `src/` anterior a la aprobación.

## 3. Build y tipos (SC-006)

```bash
npm run astro -- check
npm run build
```

- **Esperado**: ambos terminan sin errores.

## 4. Cero imágenes rotas (FR-011, SC-003)

- Ejecutar el script de comprobación de rutas sobre `dist/` ([research.md](research.md), R7).
- **Esperado**: 0 rutas de imagen o video sin archivo.
- `npm run preview`, abrir `/`, `/about-us/`, `/get-a-quote/` y `/privacy-policy/` en móvil (390 px) y escritorio (1440 px). Abrir cada acordeón de Incluidos y cada modal de servicio.
- **Esperado**: 0 peticiones de imagen o video fallidas en la pestaña de red y ninguna imagen rota a la vista.

## 5. Ninguna sección sin imagen (FR-007, SC-007)

- Comparar las secciones con imagen antes y después (hero de la home, hero de About, Story de About, 3 servicios, 5 incluidos, logo, og:image).
- **Esperado**: todas siguen mostrando una imagen. Si se retiró el video del hero, se ve la imagen fija.

## 6. Reemplazos conformes (FR-005, SC-002)

Para cada fila de la sección "Reemplazos" de `review.md`:

- **Esperado**:
  - el archivo sale de una foto de `public/images/`;
  - existen todas las variantes que pide el componente, solo en WebP o AVIF;
  - no tienen metadatos (lectura con `sharp`: sin `exif`, `xmp`, `icc` ni `iptc`);
  - el texto alternativo describe lo que se ve en la foto recortada;
  - no se repite en secciones cercanas, salvo que la tabla diga "Repetida".

## 7. Ningún archivo de `public/` incumple (SC-001a, SC-004)

- Repetir la revisión visual sobre los archivos que quedan en `public/` y sobre la og:image.
- **Esperado**: todos tienen estado "Cumple". Ningún archivo marcado para eliminar sigue en `public/`.

## 8. Sin menciones de la empresa anterior (FR-010, SC-005)

```bash
grep -rniE "shark|984[- ]?9218" src public dist astro.config.mjs wrangler.jsonc package.json
grep -rnE "\b407\b" src public dist
```

- **Esperado**: ninguna coincidencia de `shark` ni del teléfono. Las coincidencias de `407` que queden están anotadas en `review.md` como ajenas a la empresa anterior (hash, medida, color).

## 9. Archivos eliminados sin referencias (FR-008, FR-008a)

- Para cada archivo eliminado, buscar su nombre en `src/` y `dist/`.
- **Esperado**: 0 coincidencias.

## 9a. Solo WebP o AVIF (FR-014, SC-009)

```bash
git ls-files | grep -iE '\.(jpe?g|png|gif|bmp|tiff?|heic)$'
find dist -type f | grep -iE '\.(jpe?g|png|gif|bmp|tiff?|heic)$'
grep -rnoiE '[^"'"'"' ]+\.(jpe?g|png)\b' src dist --include=*.html --include=*.js --include=*.astro --include=*.ts --include=*.tsx
```

- **Esperado**: las tres búsquedas sin resultados. Solo quedan `favicon.svg` y `favicon.ico` como imágenes que no son WebP o AVIF.

## 10. Nada eliminado sigue en producción (FR-013, SC-008)

- Después de que el dueño publique, solicitar cada URL eliminada en `https://proelitemovers.com` y `https://www.proelitemovers.com`.
- **Esperado**: ninguna devuelve el archivo. Si responde una copia en caché, se purga la caché de Cloudflare y se repite.
