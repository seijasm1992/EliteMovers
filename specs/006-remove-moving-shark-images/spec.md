# Feature Specification: Revisión de imágenes del sitio y reemplazo de las que tengan rastros de Moving Shark

**Feature Branch**: `006-remove-moving-shark-images`

**Created**: 2026-11-07

**Status**: Draft

**Input**: Descripción del dueño: revisar las imágenes del sitio y reemplazar las que tengan rastros de Moving Shark (logo, teléfono 407-984-9218 o logo añadido), las que parezcan generadas por IA y las que tengan datos GPS. El reemplazo sale de las fotos que ya existen en `public/images/`. Fuera de alcance: fotos nuevas, galería, rediseño, páginas nuevas y limpieza del historial de Git.

## Clarifications

### Session 2026-11-07

- Q: Si un video del sitio muestra Moving Shark u otro elemento que no cumple en alguna escena, ¿qué hacemos con él? → A: Nada relacionado con Moving Shark se queda. Se revisa cada video completo; si alguna escena no cumple, se retira el video y su lugar lo ocupa una imagen fija conforme de `public/images/`.
- Q: ¿Se revisan también los archivos de `public/` que ninguna página muestra, pero que son accesibles por URL? → A: Sí. Se revisan todos los archivos de imagen y video de `public/`; los que no se usan y no cumplen se eliminan tras la aprobación del dueño.
- Q: ¿Hay permiso para mostrar a empleados propios identificables? → A: Sí. Los empleados de ProElite Movers tienen permiso; solo no cumplen los clientes o terceros identificables.
- Q: Si no queda ninguna foto conforme sin repetir para una sección, ¿qué se hace? → A: Se permite repetir una foto conforme aunque ya se use en una sección cercana, y se indica en la tabla.
- Q: ¿Qué significa "las imágenes que usa el sitio"? → A: Las imágenes del sitio que tienen fotos o logos de Moving Shark. Esas imágenes se quitan de las páginas, se eliminan del proyecto y no pueden quedar en producción. Las que una página usaba se reemplazan por imágenes optimizadas para la web.
- Q: ¿Se admiten imágenes JPEG (u otros formatos) en producción cuando un componente o una plataforma las pide? → A: No. Toda imagen en producción y dentro del proyecto debe estar optimizada para la web en WebP o AVIF. Cualquier JPG, JPEG, PNG u otro formato se procesa de nuevo y se convierte a las variantes WebP o AVIF necesarias, y el original se elimina.
- Q: ¿Hay que volver a revisar las fotos de `public/images/library/`, que ya se aprobaron en la spec 001? → A: No. Las imágenes ya revisadas se omiten en la revisión visual y se consideran conformes; solo se convierten a WebP o AVIF (FR-014).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cliente que solo ve fotos reales de ProElite Movers (Priority: P1)

Como cliente, quiero ver solo fotos reales de ProElite Movers para confiar en el equipo que vendrá a mi casa.

**Why this priority**: Una marca de otra empresa, otro teléfono o una foto generada por IA rompen la confianza del cliente y contradicen los principios de imágenes reales (III) y NAP consistente (VII).

**Independent Test**: Se abre cada página del sitio en móvil y escritorio, se observa cada imagen visible y la imagen de vista previa al compartir, y se comprueba que ninguna incumple los criterios de FR-003.

**Acceptance Scenarios**:

1. **Given** veo cualquier imagen del sitio, **When** la observo, **Then** no aparece Moving Shark, otro teléfono distinto de +1 (786) 281-7825, un logo añadido ni una imagen generada por IA.
2. **Given** se reemplazó una imagen, **When** visito la página, **Then** la nueva imagen encaja con la sección y no hay imágenes rotas.
3. **Given** comparto un enlace del sitio, **When** aparece la vista previa, **Then** la imagen mostrada cumple los mismos criterios.

---

### User Story 2 - Dueño que aprueba la revisión antes de cualquier cambio (Priority: P1)

Como dueño, quiero ver la tabla de revisión de todas las imágenes antes de que se elimine o reemplace nada, para decidir con información completa.

**Why this priority**: Ninguna imagen se toca sin la aprobación del dueño. Sin la tabla no hay reemplazo.

**Independent Test**: Se entrega la tabla de revisión. Se comprueba que incluye cada archivo de imagen y video de `public/`, señala todos los que tienen fotos o logos de Moving Shark, y que el sitio y `public/` siguen sin cambios hasta la aprobación.

**Acceptance Scenarios**:

1. **Given** hay archivos de imagen y video en `public/`, **When** se revisan, **Then** el dueño recibe una tabla con cada archivo: si está en uso y dónde, qué muestra, si cumple o no y, si no cumple, el motivo y la acción propuesta (reemplazo o eliminación).
2. **Given** la tabla está entregada, **When** el dueño aún no la aprueba, **Then** ningún archivo se ha eliminado ni reemplazado.
3. **Given** el dueño rechaza un reemplazo propuesto, **When** se registra, **Then** se propone otra imagen que cumpla, o la más cercana disponible, y vuelve a revisión.

---

### User Story 3 - Visitante protegido por un sitio sin restos de la empresa anterior (Priority: P2)

Como visitante, quiero que el texto, los metadatos y el código del sitio no mencionen Moving Shark ni el teléfono 407, para no recibir información confusa al buscar o compartir.

**Why this priority**: Las menciones fuera de las imágenes también confunden a buscadores y clientes, pero no son visibles para la mayoría de visitantes.

**Independent Test**: Se busca "Moving Shark", "Shark" y "407" en el contenido fuente y en las páginas generadas; no debe haber ninguna coincidencia que se refiera a la empresa anterior o a su teléfono.

**Acceptance Scenarios**:

1. **Given** el sitio está generado, **When** se buscan "Moving Shark", "Shark" o el 407 en el contenido, los metadatos y el código, **Then** no hay coincidencias.
2. **Given** se encuentra una mención, **When** se registra, **Then** aparece en la revisión con su ubicación y se elimina o corrige tras la aprobación del dueño.

---

### Edge Cases

- **Rastro parcial o pequeño de Moving Shark** (parte del logo en un camión, una camiseta, una caja o un reflejo): cuenta como Moving Shark y la imagen no cumple, por pequeño que sea.
- **Ninguna foto encaja perfectamente en una sección**: se usa la más cercana que cumpla los criterios; la sección nunca queda sin imagen.
- **La mejor candidata ya se usa en una sección cercana**: se elige otra para no repetir la misma foto en secciones contiguas de una misma página. Si no queda ninguna otra conforme, se repite y se indica en la tabla (FR-006).
- **Una imagen que cumple está en un formato no optimizado (JPG, JPEG, PNG u otro)**: se convierte a WebP o AVIF, sin metadatos y sin retocar su contenido, y el original se elimina (FR-014). Si ya existen sus variantes WebP, el original se elimina sin convertirlo.
- **Un componente pide una versión JPEG de respaldo**: el componente se ajusta para usar solo las variantes WebP o AVIF; no se conserva ningún JPEG para él.
- **Una imagen cumple visualmente pero tiene datos GPS u otros metadatos**: no cumple hasta que se publique una versión sin metadatos; si la foto es correcta, se conserva limpia en lugar de reemplazarla.
- **Video con una escena que no cumple**: aunque la portada cumpla, si cualquier escena del video muestra un elemento de FR-003, el video se retira y su lugar lo ocupa una imagen fija conforme (FR-012).
- **Duda sobre si una imagen está generada por IA o tiene un logo retocado**: se marca como "dudosa" con el motivo y decide el dueño; no se asume que cumple.
- **Una imagen retirada sigue en uso en alguna página**: no se elimina de `public/` hasta que ninguna página la pida.
- **Coincidencias de "407" que no son el teléfono** (por ejemplo, dentro de un identificador o medida): se registran y se revisan; solo se cambian si se refieren al teléfono de la empresa anterior o si son visibles y confunden.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La revisión MUST cubrir uno por uno todos los archivos de imagen y video de `public/`: los que el sitio usa en sus páginas (incluidas portadas de video, iconos con foto, el favicon y la imagen de vista previa al compartir, og:image) y también los que ninguna página usa pero son accesibles por URL. La tabla MUST indicar para cada archivo si está en uso o no. Las fotos de `public/images/library/` aprobadas en la spec 001 aparecen en la tabla como "Cumple (revisada en 001)" sin repetir su revisión visual.
- **FR-002**: Para cada archivo de imagen o video, la revisión MUST registrar en una tabla: archivo, páginas y sección donde se usa, qué muestra, si cumple o no, el motivo cuando no cumple, y el reemplazo propuesto.
- **FR-003**: Una imagen MUST considerarse no conforme si:
  - muestra Moving Shark;
  - muestra un teléfono distinto de +1 (786) 281-7825;
  - muestra un logo añadido o retocado;
  - tiene apariencia de imagen generada por IA;
  - muestra matrículas legibles, números de casa, o clientes o terceros identificables (los empleados de ProElite Movers tienen permiso);
  - contiene datos GPS.
- **FR-004**: La tabla MUST entregarse al dueño y ser aprobada antes de eliminar o reemplazar cualquier archivo de imagen o video.
- **FR-005**: Cada imagen no conforme que una página usa MUST quitarse de esa página y reemplazarse por la imagen más adecuada que ya exista en `public/images/` y que cumpla FR-003, de modo que:
  - encaje con el contenido de la sección;
  - se sirva optimizada solo en WebP o AVIF, sin respaldo en otro formato, con los mismos tamaños responsive que usa la sección;
  - no contenga metadatos;
  - tenga un texto alternativo en inglés fiel a lo que muestra.
- **FR-006**: La misma foto MUST NOT repetirse en secciones cercanas de una misma página. Si ninguna encaja perfectamente, se usa la más cercana que cumpla los criterios. Única excepción: si no queda ninguna foto conforme sin repetir, se repite una conforme y la tabla lo indica.
- **FR-007**: Ninguna sección que hoy muestra una imagen MUST quedar sin imagen.
- **FR-008**: Los archivos retirados MUST eliminarse de `public/`, y solo cuando ninguna página los use.
- **FR-008a**: Los archivos de `public/` que no están en uso y no cumplen FR-003 MUST eliminarse tras la aprobación del dueño; no necesitan reemplazo. Los que no están en uso y cumplen se conservan.
- **FR-009**: Las fotos MUST NOT retocarse para tapar marcas, y MUST NOT generarse imágenes con IA. Recortar o redimensionar para la optimización está permitido solo si no se usa para ocultar una marca.
- **FR-010**: La revisión MUST buscar en el texto, el código y los metadatos del sitio cualquier mención de "Moving Shark", "Shark" o del teléfono 407-984-9218, registrarla y eliminarla o corregirla tras la aprobación del dueño.
- **FR-011**: Tras los reemplazos, ninguna página MUST mostrar una imagen rota ni pedir una imagen que no existe.
- **FR-012**: Cada video que usa el sitio MUST revisarse completo, escena por escena, con los criterios de FR-003, y registrarse en la tabla. Si alguna escena no cumple, el video MUST retirarse y su lugar MUST ocuparlo una imagen fija conforme de `public/images/`. No se graban ni editan videos.
- **FR-013**: Ningún archivo eliminado MUST seguir accesible en producción. Después de que el dueño publique, cada URL eliminada se solicita en `proelitemovers.com` y `www.proelitemovers.com`, y no debe devolver el archivo.
- **FR-014**: Ninguna imagen en producción ni dentro del proyecto MUST estar en un formato distinto de WebP o AVIF. Cada JPG, JPEG, PNG u otro formato de imagen MUST procesarse de nuevo y convertirse a las variantes WebP o AVIF que necesite (o eliminarse si no se usa y ya tiene esas variantes, o si no cumple FR-003), y el original MUST eliminarse. Esto incluye la imagen para compartir (og:image) y las fotos de `public/images/library/`. Única excepción: el favicon (ver Assumptions).

### Key Entities

- **Archivo revisado**: archivo de imagen o video de `public/`. Atributos: archivo, en uso o no, páginas y sección donde se usa (si aplica), qué muestra, texto alternativo actual, estado de metadatos. Un archivo en uso es el que alguna página muestra o declara (incluida la vista previa al compartir y el favicon).
- **Decisión de revisión**: resultado por imagen: cumple, no cumple o dudosa; motivo; reemplazo propuesto; aprobación del dueño.
- **Candidata de reemplazo**: foto existente en `public/images/` que cumple FR-003, con la sección a la que encaja y si ya se usa cerca.
- **Mención de texto**: aparición de "Moving Shark", "Shark" o el 407 en texto, código o metadatos, con su ubicación y la acción decidida.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La tabla de revisión incluye el 100 % de los archivos de imagen y video de `public/`, en uso o no, cada uno con su decisión.
- **SC-001a**: Después del cambio, ningún archivo de `public/`, esté en uso o no, incumple los criterios de FR-003.
- **SC-002**: El 100 % de los lugares donde había una imagen retirada muestran un reemplazo de `public/images/` que cumple los criterios.
- **SC-003**: Al cargar cualquier página del sitio hay cero imágenes rotas y cero solicitudes de imágenes inexistentes.
- **SC-004**: Ninguna imagen visible en el sitio ni la imagen de vista previa al compartir incumple los criterios de FR-003.
- **SC-005**: El contenido fuente y las páginas generadas contienen cero coincidencias de "Moving Shark", "Shark" o el 407 referidas a la empresa anterior.
- **SC-006**: El sitio se genera sin errores después de los cambios.
- **SC-007**: Ninguna sección que mostraba una imagen antes del cambio queda sin imagen después.
- **SC-008**: En producción, el 100 % de las URLs de archivos eliminados ya no devuelven el archivo.
- **SC-009**: El proyecto y el sitio generado contienen cero imágenes en formatos distintos de WebP o AVIF (salvo el favicon), y ninguna página pide una.

## Assumptions

- La biblioteca de reemplazo es lo que ya existe en `public/images/` (incluida `public/images/library/`, aprobada en la especificación 001). No se añaden fotos nuevas.
- Convertir una foto existente a WebP o AVIF, o generar sus tamaños responsive, no se considera una foto nueva ni un retoque.
- Favicon: `favicon.svg` es un gráfico vectorial (formato web) y `favicon.ico` es el formato que los navegadores piden por defecto para el icono de la pestaña. No son fotos y quedan fuera de FR-014. Si el dueño quiere quitar también `favicon.ico`, se elimina y queda solo `favicon.svg`.
- "Secciones cercanas" significa secciones de la misma página que se ven una después de otra, o que comparten pantalla en escritorio.
- Una persona es identificable cuando su cara se reconoce con claridad. Las personas de espaldas, lejanas o desenfocadas no cuentan, salvo que el dueño diga otra cosa.
- Los empleados de ProElite Movers identificables cumplen. Si no está claro si una persona identificable es empleado o cliente, la foto se marca como "dudosa" y el dueño lo indica en la tabla.
- El logotipo propio de ProElite Movers, usado como logo de la marca y no añadido sobre una foto, no se considera un "logo añadido".
- El dueño publica en producción por su cuenta, como en especificaciones anteriores.
