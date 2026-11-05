# Research: Selección de imágenes reales y limpieza de metadatos

Las mediciones son del 2026-11-05 y se hicieron en solo lectura. Están resumidas en [plan.md](plan.md).

## R1. Cómo quitar metadatos sin cambiar la imagen

- **Decision**: Quitar los segmentos de metadatos del archivo JPEG sin recomprimirlo. Se eliminan APP1 (EXIF, XMP), APP2 (perfil de color), APP13 (IPTC) y los comentarios. Se conservan APP0 y APP14, porque son estructurales y APP14 puede afectar a cómo se decodifican los colores. Esto se hace con un script de Node sin dependencias.
- **Rationale**: Los datos de la imagen quedan idénticos byte a byte, y eso se puede demostrar (SC-010). Ninguna imagen tiene orientación distinta de la normal, así que quitarla no puede rotar nada.
- **Alternatives considered**: Recodificar con `sharp` cambia píxeles y acumula pérdida. `exiftool` no está instalado y no hace falta para este caso.

## R2. Perfil de color

- **Decision**: Antes de quitar el perfil de `boxes-loading-ramp.jpeg` y `storage-unit-loaded.jpeg`, leer su descripción. Si es sRGB, se quita. Si es otro, se compara el resultado y, si el cambio se nota, se informa al dueño antes de publicar esa imagen.
- **Rationale**: El navegador trata una imagen sin perfil como sRGB, así que quitar un perfil sRGB no cambia nada. Quitar otro perfil podría cambiar los colores, y FR-028 lo prohíbe.
- **Alternatives considered**: Conservar siempre el perfil contradice "quitar todos los metadatos", y quitarlo a ciegas arriesga SC-010.

## R3. Originales HEIC

- **Decision**: Decodificar los 28 HEIC con `heic-convert`, instalado con `--ignore-scripts` en una carpeta temporal propia, fuera del proyecto. Si falla, esos archivos se informan como no compatibles con su ruta (FR-002), y la revisión sigue con los 45 JPEG.
- **Rationale**: `sharp` lee sus metadatos, pero no puede decodificar ninguno. Las pautas del proyecto piden no añadir dependencias sin consultar, y aquí `package.json` no cambia.
- **Alternatives considered**: Instalar ImageMagick o `libheif` en el sistema es más invasivo. Ignorar los HEIC podría perder las mejores versiones, porque son los archivos originales.

## R4. Duplicados

- **Decision**: Comparar por parecido visual con una huella reducida calculada con `sharp`, y confirmar a ojo los grupos resultantes. La fecha de captura en los metadatos se usa como apoyo.
- **Rationale**: Los 73 archivos son distintos byte a byte y los nombres no coinciden entre `original/` y las copias convertidas (0 coincidencias), así que ni el contenido exacto ni el nombre detectan duplicados. El conteo por subcarpeta sugiere que muchos JPEG son conversiones de los HEIC.
- **Alternatives considered**: Comparar solo por nombre o por huella exacta no encontraría ningún duplicado.

## R5. Revisión visual y vistas previas

- **Decision**: Generar vistas previas reducidas y sin metadatos en una carpeta temporal fuera del repositorio, y armar con ellas una hoja de contacto en HTML que el dueño abre en su computadora. La hoja no se publica como página en línea.
- **Rationale**: Las fotos pueden mostrar personas, matrículas y direcciones. Las vistas previas sin metadatos también evitan exponer los GPS (50 de 73 originales lo tienen).
- **Consideración de privacidad**: para la revisión, el asistente ve las vistas previas, y eso implica enviarlas al servicio del modelo. Solo se envían vistas previas reducidas y sin metadatos.
- **Alternatives considered**: Una página publicada, aunque privada, sube las fotos a un servicio externo y no hace falta. Un PDF no aporta nada frente al HTML.

## R6. Videos publicados

- **Decision**: No modificarlos. La búsqueda de marcas de ubicación (`©xyz`, `location`, `ISO6709`, `com.apple.quicktime`) no encontró ninguna en los 3 videos. Se repite la búsqueda en la implementación; si aparece alguna, se detiene el trabajo y se informa al dueño.
- **Rationale**: FR-011 solo exige que no tengan GPS, y modificar archivos sin necesidad va contra el principio XII. Los campos `udta`, `meta` y `Lavf` que sí aparecen suelen ser del programa de codificación y no indican ubicación.
- **Revisión visual (añadido al generar las tareas)**: FR-018 exige ver el contenido de los videos, y no hay `ffmpeg` en el sistema. Se usa `@ffmpeg-installer/ffmpeg` en una carpeta temporal fuera del proyecto para extraer fotogramas y leer los metadatos del contenedor. Si no funciona, el dueño ve los videos y el informe lo indica.
- **Límite**: sin esa herramienta, la comprobación queda en una búsqueda de marcas conocidas, no en un análisis completo del formato.
- **Alternatives considered**: Instalar `ffmpeg` y reescribir los videos no aporta nada si no hay GPS.

## R7. Comprobación de que el sitio sigue igual

- **Decision**: Comparar la huella de los datos de imagen antes y después; deben coincidir. Comprobar que cada imagen referenciada exista en la versión generada, incluidas las variantes `-480`, `-720` y `-960` que los componentes construyen por código. El dueño hace la revisión visual en móvil y escritorio.
- **Rationale**: Las rutas no cambian y los datos de imagen son idénticos, así que el riesgo es bajo. El proyecto no tiene pruebas automáticas ni Playwright instalado.
- **Alternatives considered**: Añadir Playwright al proyecto es una dependencia nueva para un solo uso.

## R8. URLs retiradas en producción

- **Decision**: Después de que el dueño publique, solicitar las 2 URLs en `proelitemovers.com` y `www.proelitemovers.com`, y descargar las imágenes publicadas para repetir la auditoría de GPS. Si aún responde una copia en caché, se repite después de limpiarla o de que caduque.
- **Rationale**: El comportamiento real depende de Cloudflare y solo se confirma en producción. El nombre del PDF lleva espacios y un `·`, así que la URL se prueba codificada.
- **Alternatives considered**: Comprobar solo en local no cumple SC-006.

## R9. Dónde viven los scripts

- **Decision**: Fuera del repositorio, en una carpeta temporal, y sin commit.
- **Rationale**: Son de un solo uso, y el principio XII pide no añadir código no solicitado. El montaje posterior podrá reescribirlos si los necesita.
- **Alternatives considered**: Una carpeta `scripts/` deja en el repositorio código que el sitio no usa.

## R10. Marcas de terceros

- **Decision**: Anotar como observación las marcas de otras empresas visibles en una foto, sin bloquearla. Al menos un nombre de archivo menciona `uhaul`.
- **Rationale**: La especificación no las incluye entre los señalamientos, pero al dueño le sirve saberlo al elegir. Es una observación añadida en este plan, no una regla del dueño.
- **Alternatives considered**: Tratarlas como Moving Shark sería inventar una regla, e ignorarlas ocultaría algo útil.
