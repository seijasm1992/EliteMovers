# Verificación

Resultados del 2026-11-05. Las comprobaciones de producción quedan pendientes hasta que el dueño publique y avise (FR-027).

| Criterio | Dónde | Resultado | Evidencia |
|----------|-------|-----------|-----------|
| SC-001 | local | cumple | 73 fotos en 10 subcarpetas de la primera carpeta y 6 fotos en la segunda (`IMG`); todas se pudieron abrir |
| SC-002 | local | cumple | 18 fotos aprobadas por el dueño en `selection.md`; en el proyecto solo entraron esas copias y la imagen para compartir |
| SC-003 | local | cumple | Auditoría de `public/`: 0 de 53 imágenes con metadatos, 0 con GPS; 0 de 3 videos con GPS. Biblioteca: 0 de 18 con metadatos |
| SC-004 | local | cumple | `inventory.md` cubre todas las imágenes y los videos; señala Moving Shark en `service-long-distance` y en `crew-loading-wrapped-items` |
| SC-005 | local | cumple | 0 referencias a archivos retirados; 0 imágenes publicadas confirmadas como generadas por IA |
| SC-006 | producción | pendiente | Se comprueba después de que el dueño publique |
| SC-007 | local | parcial | Build correcto; 0 de 41 imágenes referenciadas faltan; las 3 páginas responden 200 en la vista previa. `astro check` da 3 errores que ya existían en `astro.config.mjs`. El dueño no hizo la revisión visual en móvil y escritorio (T031) |
| SC-008 | local | cumple | Originales intactos: mismas huellas en los 94 archivos de la primera carpeta y en los 6 de `IMG` |
| SC-009 | local | cumple | Este documento |
| SC-010 | local | cumple | 42 de 42 imágenes que siguen publicadas tienen los mismos datos de imagen y dimensiones; la imagen para compartir cambió, como se decidió (FR-032) |

**Build local**: se generó con `ENABLE_TURNSTILE=false` solo para comprobar las imágenes, porque `PUBLIC_TURNSTILE_SITE_KEY` no está en el proyecto. El build de producción la necesita en su entorno.
