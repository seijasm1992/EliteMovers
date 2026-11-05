# Feature Specification: Selección de imágenes reales y limpieza de metadatos de proelitemovers.com

**Feature Branch**: `001-replace-site-images`

**Created**: 2026-11-05

**Status**: Draft

**Input**: Descripción del dueño: selección de imágenes reales a partir de la carpeta de originales, con aprobación del dueño. Reducido en la clarificación: las fotos elegidas no se montan ahora, y el sitio solo recibe la limpieza que no cambia su aspecto.

## Clarifications

### Session 2026-11-05

- Q: Si una foto muestra Moving Shark y no se puede recortar, ¿puede publicarse de todos modos si el dueño la aprueba? → A: Nunca se publica: la foto se recorta para quitar la marca o se descarta, aunque sea buena.
- Q: ¿Quién publica el resultado en producción y cuándo se comprueban allí las URLs retiradas? → A: El dueño revisa y publica por su cuenta, avisa, y entonces se comprueba producción.
- Q: Si las fotos elegidas no se montan ahora, ¿qué se hace en el sitio durante este trabajo? → A: Revisar y elegir fotos, y hacer solo la limpieza que no cambia el aspecto: quitar metadatos de lo publicado y retirar `Componente.jpg` y el PDF.
- Q: ¿Qué se hace con las imágenes generadas por IA que siguen publicadas? → A: Se quitan todas.
- Q: ¿Qué imagen se usa al compartir mientras no se haga el montaje? → A: Una foto real que el dueño elija en la selección, procesada y sin metadatos.
- Q: ¿Dónde quedan las fotos aprobadas para usarlas en otra especificación? → A: Copias optimizadas y sin metadatos de las 13 aprobadas, en una carpeta propia dentro de `public/`. Los originales no se mueven.
- Q: ¿Se revisan más fotos? → A: Sí. Se aplica el mismo proceso a una segunda tanda, en `C:\Users\Seijas A\Downloads\IMG`, con las mismas reglas (FR-001 a FR-009): revisión, señalamientos, duplicados (también contra la primera tanda), aprobación del dueño y copia a `public/images/library/`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dueño que elige las fotos (Priority: P1)

Como dueño, quiero recibir una selección razonada de las fotos reales para tener una lista aprobada. Más adelante decidiré cuál sirve para cada ocasión.

**Why this priority**: Es la base del montaje posterior y el control que impide publicar información privada o marcas de la empresa anterior.

**Independent Test**: Se revisa la carpeta de originales y se entrega el informe de selección. El proyecto no recibe ninguna foto y los originales siguen intactos.

**Acceptance Scenarios**:

1. **Given** hay fotos en la carpeta de originales y sus subcarpetas, **When** se revisan, **Then** el dueño recibe el total de fotos, el total por subcarpeta y las candidatas con su ruta y la sección propuesta.
2. **Given** una foto muestra una matrícula, una dirección, una persona identificable o datos de un cliente, **When** se revisa, **Then** queda señalada con el motivo y no entra en la lista aprobada sin aprobación del dueño.
2a. **Given** una foto muestra Moving Shark, **When** se revisa, **Then** queda señalada y solo puede aprobarse si un recorte aprobado quitará la marca; si no, se descarta.
3. **Given** hay fotos duplicadas o casi iguales en distintas subcarpetas, **When** se revisan, **Then** solo se propone la mejor versión.
4. **Given** el dueño aprobó la selección, **When** se registra, **Then** queda una lista de fotos aprobadas, y solo esas fotos entran al proyecto, como copias optimizadas y sin metadatos (FR-009).
5. **Given** un archivo no se puede abrir o tiene un formato no compatible, **When** se revisa, **Then** aparece en el informe con su ruta y el problema.

---

### User Story 2 - Cliente y terceros protegidos (Priority: P1)

Como persona relacionada con una mudanza, quiero que las imágenes publicadas no revelen mi ubicación.

**Why this priority**: Hoy hay fotos públicas con metadatos GPS. Es un riesgo real para terceros y se puede corregir sin esperar al montaje.

**Independent Test**: Se comprueban los metadatos de todos los archivos publicados, y se solicitan en producción las URLs de los archivos retirados.

**Acceptance Scenarios**:

1. **Given** una imagen está en `public/`, **When** se revisan sus metadatos, **Then** no contiene metadatos, incluido el GPS.
2. **Given** un video sigue publicado, **When** se revisan sus metadatos, **Then** no contiene GPS.
3. **Given** el dueño publicó y avisó, **When** alguien abre en producción la URL de un archivo retirado, **Then** ya no puede acceder al archivo.

---

### User Story 3 - Visitante que usa el sitio (Priority: P2)

Como visitante, quiero que el sitio se siga viendo igual después de la limpieza.

**Why this priority**: La limpieza es invisible por diseño, y una imagen rotada o rota sería una regresión.

**Independent Test**: Se comparan las imágenes antes y después, y se abren todas las páginas existentes en móvil y escritorio.

**Acceptance Scenarios**:

1. **Given** se quitaron los metadatos de una imagen, **When** se compara con la anterior, **Then** se ve igual, con las mismas dimensiones y orientación.
2. **Given** abro una página en móvil o escritorio, **When** cargan las imágenes, **Then** no hay imágenes rotas.

---

### Edge Cases

- **Originales en formato HEIC**: si no se pueden revisar, se informan como no compatibles y no se descartan en silencio.
- **Original y copia convertida**: una foto `original` y su versión convertida cuentan como duplicado, y solo se propone la mejor.
- **Foto aprobada con un elemento señalado**: el dueño aprueba ese elemento de forma explícita; una aprobación general de la selección no lo cubre. Moving Shark no admite esta aprobación (FR-005).
- **Sin candidata para una sección**: el informe lo indica, sin forzar una foto. Puede ocurrir con Long Distance, porque ninguna subcarpeta de originales lleva ese nombre.
- **Orientación guardada en metadatos**: al quitarlos, la imagen debe seguir viéndose con la misma orientación.
- **Perfil de color**: también es un metadato. Si quitarlo cambia los colores de forma visible, se informa al dueño antes de publicar esa imagen.
- **Archivo publicado sin uso en las páginas**: sigue siendo accesible por URL, así que entra en el inventario y también se limpia.
- **Copias en caché**: un archivo retirado o una versión anterior con GPS puede seguir respondiendo un tiempo por la caché. La comprobación se repite después de limpiarla o de que caduque.

## Requirements *(mandatory)*

### Functional Requirements

**Revisión y selección**

- **FR-001**: La revisión MUST cubrir la carpeta `C:\Users\Seijas A\Downloads\ProverImages` y todas sus subcarpetas, sin procesar sus videos.
- **FR-002**: El informe MUST indicar el total de fotos, el total por subcarpeta y los archivos que no se pudieron abrir o tienen un formato no compatible.
- **FR-003**: La selección inicial MUST tener hasta 15 candidatas, más alternativas si alguna sección las necesita.
- **FR-004**: Cada candidata MUST incluir su ruta original, su sección propuesta (orientativa, porque el dueño decidirá el uso final más adelante), un nombre descriptivo en minúsculas y con guiones, y un texto alternativo en inglés que describa solo lo que se ve.
- **FR-005**: La revisión MUST señalar toda foto que muestre Moving Shark, una matrícula, una dirección, una persona identificable o datos de un cliente. Una foto señalada MUST NOT aprobarse sin aprobación explícita del dueño. Una foto con Moving Shark MUST NOT publicarse ni siquiera con aprobación, salvo que un recorte aprobado quite la marca; si no se puede, se descarta.
- **FR-006**: Ante duplicados o fotos casi iguales, solo MUST proponerse la mejor versión.
- **FR-007**: El trabajo MUST detenerse tras la selección y esperar la aprobación del dueño antes de cambiar el sitio.

**Originales y fotos elegidas**

- **FR-008**: Los originales MUST NOT modificarse, moverse, borrarse ni copiarse al repositorio.
- **FR-009**: Las fotos aprobadas MUST copiarse a `public/images/library/` como copias optimizadas: sin metadatos, sin retoques, con su orientación aplicada, con el lado largo de 2048 px como máximo y con su nombre descriptivo. Ninguna página las usa todavía, y cualquiera puede abrirlas por URL una vez publicadas. La foto para compartir de FR-032 va aparte.
- **FR-013**: Los textos del informe MUST NOT inventar ciudades, servicios, fechas ni datos de clientes.
- **FR-029**: Todo informe o lista guardado en el repositorio MUST NOT transcribir matrículas, direcciones, nombres ni datos de clientes, porque el repositorio es público. Solo indica el tipo de elemento señalado.
- **FR-030**: La selección aprobada MUST quedar registrada como una lista, sin fotos, para usarla en el montaje posterior.

**Inventario y revisión del sitio (sin cambios visibles)**

- **FR-014**: Antes de cambiar nada, MUST hacerse un inventario de todas las imágenes y videos públicos y de dónde se usa cada uno.
- **FR-016**: MUST revisarse `movers-loading`, `service-long-distance`, `1M.jpg`, `2M.jpg`, `3M.jpg`, `4M.jpg` y las demás imágenes de servicios e incluidos, y el informe MUST proponer para cada una conservarla, sustituirla o retirarla en el montaje posterior.
- **FR-017**: El informe MUST señalar las matrículas visibles, incluidas las de `boxes-loading-ramp.jpeg` y `storage-unit-loaded.jpeg`.
- **FR-018**: MUST revisarse los videos ya publicados, y el informe MUST señalar los que muestren Moving Shark, información privada o imágenes de la lista de retirada. No se retiran ahora ni se añaden videos nuevos.

**Limpieza del sitio**

- **FR-011**: Todas las imágenes publicadas MUST quedar sin metadatos, incluido el GPS y en todas sus versiones de tamaño. Los videos que siguen publicados MUST quedar sin GPS.
- **FR-012**: Cada sección MUST conservar los tamaños responsivos y las versiones de respaldo que ya tiene.
- **FR-019**: `Componente.jpg` y el PDF del Design System MUST retirarse de `public/`.
- **FR-031**: MUST retirarse de `public/` todas las imágenes generadas por IA, y sus referencias en el código: `3M.jpg`, `4M.jpg` y las que la revisión identifique y el dueño confirme. Lo mismo aplica a un video que las contenga. Si una de ellas se muestra en una página, MUST NOT retirarse hasta que el dueño decida cómo reemplazarla, porque retirarla cambiaría el aspecto del sitio.
- **FR-032**: `1M.jpg` MUST retirarse, porque parece generada por IA, y es la imagen por defecto para compartir en redes. Se reemplaza por una foto real que el dueño elija en la selección, sin Moving Shark ni logos añadidos, procesada sin metadatos y guardada en `public/images/social/`. Su texto descriptivo MUST coincidir con lo que muestra. La foto no se retoca ni se recorta, salvo un recorte aprobado para dejar fuera un elemento señalado.
- **FR-022**: MUST NOT quedar referencias a los archivos retirados. Todo enlace e imagen publicados en las páginas MUST llevar a un destino real.
- **FR-023**: Las URLs de los archivos retirados MUST dejar de entregarlos en producción y MAY responder 404. **Justificación frente al principio IV de la constitución**: según el dueño, el principio significa que ningún enlace publicado en las páginas puede llevar a un 404; si un enlace no lleva a ningún lugar, se crea la página. Los archivos retirados no tienen enlaces publicados (FR-022), así que no lo contradicen.
- **FR-028**: La limpieza MUST NOT cambiar el aspecto del sitio: mismo contenido, dimensiones y orientación en cada imagen y video que sigue publicado.

**Control de entrega**

- **FR-025**: La implementación MUST NOT confirmarse con un commit hasta que el dueño revise el resultado.
- **FR-026**: La entrega MUST mostrar el resultado de cada comprobación de Success Criteria.
- **FR-027**: La publicación en producción MUST hacerla el dueño. Las comprobaciones de producción MUST hacerse después de que el dueño avise que publicó.

### Key Entities *(include if feature involves data)*

- **Foto original**: archivo fuera del proyecto, con ruta, subcarpeta y estado de lectura. Nunca se altera.
- **Candidata**: foto propuesta, con ruta original, sección propuesta, nombre descriptivo, texto alternativo, señalamientos y decisión del dueño.
- **Señalamiento**: tipo de elemento sensible encontrado en una foto (Moving Shark, matrícula, dirección, persona identificable o datos de un cliente).
- **Lista aprobada**: registro de las candidatas aprobadas, sin fotos, para el montaje posterior.
- **Recurso público**: imagen o video accesible en el sitio, con sus versiones, los lugares donde se usa, su estado de metadatos y la decisión propuesta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Se revisó el 100 % de las subcarpetas y se informa el total de fotos encontradas.
- **SC-002**: El 100 % de las fotos de la lista aprobada tiene la aprobación del dueño, y solo esas fotos y la foto para compartir entraron al proyecto.
- **SC-003**: 0 imágenes públicas contienen metadatos y 0 videos públicos contienen GPS.
- **SC-004**: El informe cubre el 100 % de las imágenes y videos públicos, y señala todos los que muestran Moving Shark.
- **SC-005**: 0 referencias a archivos retirados en el sitio, y 0 imágenes publicadas confirmadas como generadas por IA, salvo las que estén esperando la decisión del dueño (FR-031).
- **SC-006**: Después de que el dueño publique, las URLs retiradas dejan de entregar los archivos en producción y las imágenes públicas en producción no contienen GPS.
- **SC-007**: La versión de producción se genera sin errores y hay 0 imágenes rotas en las páginas existentes, en móvil y en escritorio.
- **SC-008**: Los originales siguen intactos: misma cantidad de archivos y mismo contenido antes y después.
- **SC-009**: Cada criterio de esta lista tiene su resultado visible en la entrega.
- **SC-010**: 0 diferencias visibles en las páginas, y en las imágenes y videos que siguen publicados, antes y después de la limpieza. La vista previa al compartir queda fuera de este criterio (FR-032).

## Assumptions

- Mostrarle al dueño vistas previas de las candidatas no cuenta como procesar ni copiar fotos al proyecto, siempre que queden fuera del repositorio y en su computadora.
- El logo de la marca en la navegación y los favicons se incluyen en el inventario. No se consideran un "logo añadido" a una foto.
- La revisión de GPS se extiende a los videos que siguen publicados, porque el objetivo es no exponer ubicaciones (decisión de redacción, no pedida de forma literal).
- Nombre de marca visible: ProElite Movers. Moving Shark es la empresa anterior de los mismos dueños y el sitio no debe mostrarla.
- El alcance excluye galería nueva, páginas nuevas, teléfono, dirección, textos legales, schema, perfil de Google, redes sociales, Cloudinary, limpieza del historial de Git, y procesar o publicar los videos de la carpeta de originales.
- **Riesgo aceptado hasta el montaje posterior**: Moving Shark y el logo añadido siguen visibles en el sitio.
- **Riesgo aceptado por estar fuera de alcance**: el repositorio de GitHub es público y este trabajo no limpia su historial. Las versiones anteriores de las fotos, incluidas las que tienen GPS, pueden seguir accesibles en los commits anteriores.
- **Trabajo posterior, no incluido aquí**, con estas decisiones ya tomadas por el dueño:
  - Las fotos elegidas se procesan y entran a `public/images/` solo al montarlas, cuando el dueño decida cuál sirve para cada ocasión.
  - El contenido de las fotos no se retoca ni lleva logos añadidos; solo se permite recortar para dejar fuera una matrícula, una dirección o una marca, con aprobación foto por foto (FR-010).
  - Se sustituyen o retiran `movers-loading` y `service-long-distance`, en todas sus versiones (FR-015).
  - Se retiran los videos que muestren Moving Shark o información privada, o que contengan imágenes de esa lista, y se usa una imagen aprobada en su lugar.
  - Una sección sin foto adecuada usa un diseño sin foto y no deja espacios vacíos (FR-021).
  - Todas las imágenes tienen texto alternativo fiel en inglés (FR-024).
  - Ninguna imagen o video público muestra Moving Shark, y las URLs de lo retirado dejan de entregar los archivos en producción.
