# Quickstart: comprobaciones de la entrega

Esta guía indica cómo demostrar cada criterio de éxito. Los resultados van en `verification.md` con el formato de [contracts/reports.md](contracts/reports.md).

## Requisitos previos

- Estar en la rama `001-replace-site-images`.
- Node.js 22.12 o superior, con las dependencias del proyecto instaladas.
- `PUBLIC_TURNSTILE_SITE_KEY` disponible en `.env`; sin ella, el build falla si Turnstile está activado.
- Scripts de comprobación en una carpeta temporal fuera del repositorio.

## Antes de la limpieza

| Paso | Comprobación | Resultado esperado | Criterio |
|------|--------------|--------------------|----------|
| 1 | Crear el manifiesto de huellas de todos los archivos de la carpeta de originales | Manifiesto guardado fuera del repositorio | SC-008 |
| 2 | Contar fotos por subcarpeta | Total de 73 archivos, salvo que la carpeta cambie; todas las subcarpetas cubiertas | SC-001 |
| 3 | Crear `inventory.md` | Cubre las 41 imágenes y los 3 videos, con sus usos y señalamientos | SC-004 |
| 4 | Guardar la huella de los datos de imagen de cada archivo publicado | Línea base para la comparación | SC-010 |

**Parada**: el dueño aprueba la selección y se crea `selection.md`.

| Paso | Comprobación | Resultado esperado | Criterio |
|------|--------------|--------------------|----------|
| 5 | Revisar `selection.md` frente a la aprobación del dueño, y buscar fotos nuevas en el proyecto | Todas las filas aprobadas; ninguna foto elegida en el proyecto todavía (la de compartir entra en la limpieza) | SC-002 |

## Después de la limpieza (local)

| Paso | Comprobación | Resultado esperado | Criterio |
|------|--------------|--------------------|----------|
| 6 | Auditar los metadatos de todas las imágenes de `public/` y buscar marcas de ubicación en los videos | 0 imágenes con metadatos; 0 videos con GPS | SC-003 |
| 7 | Comparar las huellas de los datos de imagen con las del paso 4, y las dimensiones | Coinciden en todos los archivos; los 2 perfiles de color quedan resueltos según [research.md](research.md), R2 | SC-010 |
| 8 | Buscar `Componente`, `Design System`, `1M.jpg`, `3M.jpg`, `4M.jpg` y los demás archivos retirados en el proyecto, fuera de `specs/` | 0 referencias | SC-005 |
| 9 | `npm run astro -- check` | Sin errores nuevos | SC-007 |
| 10 | `npm run build` | Termina sin errores | SC-007 |
| 11 | Comprobar que cada imagen referenciada, incluidas sus variantes de tamaño, exista en la versión generada | 0 faltantes | SC-007 |
| 12 | Comparar la carpeta de originales con el manifiesto del paso 1 | Misma cantidad de archivos y mismas huellas | SC-008 |
| 13 | El dueño abre todas las páginas con `npm run preview`, en móvil y escritorio | 0 imágenes rotas; 0 cambios visibles | SC-007, SC-010 |
| 14 | `git status` y `git log` | Sin commit nuevo hasta que el dueño dé el visto bueno (FR-025) | — |

## Después de que el dueño publique

| Paso | Comprobación | Resultado esperado | Criterio |
|------|--------------|--------------------|----------|
| 15 | Solicitar `/Componente.jpg`, `/ProEliteMovers%20%C2%B7%20Design%20System.pdf`, `/1M.jpg`, `/3M.jpg`, `/4M.jpg` y los demás archivos retirados en `proelitemovers.com` y `www.proelitemovers.com` | No entregan el archivo; un 404 es válido (FR-023) | SC-006 |
| 16 | Descargar las imágenes públicas de producción y repetir la auditoría del paso 6 | 0 con GPS | SC-006 |
| 17 | Si responde una copia antigua, repetir tras limpiar la caché o cuando caduque | Igual que en los pasos 15 y 16 | SC-006 |
| 18 | Completar `verification.md` | Los 10 criterios tienen resultado | SC-009 |

## Lo que estas comprobaciones no cubren

- El historial público de Git sigue conteniendo las versiones anteriores con GPS (riesgo registrado en [spec.md](spec.md)).
- Moving Shark y las demás imágenes problemáticas siguen visibles hasta el montaje posterior; SC-004 solo exige que queden señaladas.
