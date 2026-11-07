# Feature Specification: Página de Miami del menú "Locations"

**Feature Branch**: `008-miami-location-page`

**Created**: 2026-11-07

**Status**: Draft

**Input**: Descripción del dueño: crear la página de Miami del menú "Locations", con su propia URL, para que el usuario vea la zona de servicio y Google la asocie a búsquedas en Miami. El enlace "Miami" del navbar y del footer lleva a esta página en vez de a `/#quote`. La URL sigue la misma estructura que las páginas de Moving. El contenido es el de la sección "Service Area" del home: texto, mapa y teléfono. Tiene su propio título y meta description. No se agrega contenido nuevo. Fuera de alcance: otras ciudades, cambios al home y los menús Services y Company.

## Clarifications

### Session 2026-11-07

- Q: ¿La URL es `/miami/`? → A (dueño, tras revisar la página): No, `/location/`. La etiqueta del menú sigue siendo "Miami" y el contenido no cambia.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante que quiere saber si atienden su zona (Priority: P1)

Como persona que planea una mudanza en Miami o el sur de Florida, quiero abrir la página de Miami y ver en qué zona trabaja la empresa, con un mapa y un teléfono para llamar si tengo dudas.

**Why this priority**: Es el objetivo de la feature: que el visitante confirme la zona de servicio y pueda contactar sin buscar más.

**Independent Test**: Abrir `/location/` en un teléfono y comprobar que muestra el texto, el mapa y el teléfono de la sección "Service Area" del home, y que el teléfono abre la llamada.

**Acceptance Scenarios**:

1. **Given** un visitante en `/location/`, **When** carga la página, **Then** ve el rótulo "Service Area", el título "Miami and South Florida", el párrafo sobre Miami-Dade, Broward y Florida, el punto "Crews based in Miami", el enlace "Questions? Call" con el teléfono del negocio y el mapa de Miami.
2. **Given** un visitante en `/location/`, **When** pulsa el enlace del teléfono, **Then** se abre la llamada al teléfono del negocio.
3. **Given** el texto de la sección "Service Area" del home, **When** se compara con el de `/location/`, **Then** es el mismo, sin frases añadidas ni quitadas.

---

### User Story 2 - Visitante que llega desde el menú (Priority: P1)

Como visitante, quiero que el enlace "Miami" del menú "Locations", en el navbar y en el footer, me lleve a la página de Miami y no a una sección del home.

**Why this priority**: Sin el cambio de enlace la página nueva no se encuentra desde el sitio.

**Independent Test**: Pulsar "Miami" en el navbar (escritorio y móvil) y en el footer y comprobar que abre `/location/`.

**Acceptance Scenarios**:

1. **Given** el navbar en cualquier página del sitio, **When** el visitante pulsa "Miami" en "Locations", **Then** llega a `/location/`.
2. **Given** el footer, **When** el visitante pulsa "Miami", **Then** llega a `/location/`.
3. **Given** los menús Moving, Services y Company, **When** se revisan, **Then** sus enlaces no cambiaron.

---

### User Story 3 - Búsqueda en Google de mudanzas en Miami (Priority: P2)

Como dueño, quiero que la página de Miami tenga su propio título, meta description y datos técnicos de SEO, para que Google la asocie a búsquedas de mudanzas en Miami.

**Why this priority**: Es el segundo objetivo de la feature, pero depende de que la página exista (US1).

**Independent Test**: Revisar el código de `/location/` y el sitemap: título y meta description únicos, un solo H1, canónica, entrada en el sitemap y schema MovingCompany coherente con lo visible.

**Acceptance Scenarios**:

1. **Given** la página `/location/`, **When** se compara su título y meta description con los del resto del sitio, **Then** no coinciden con ninguna otra página.
2. **Given** el sitemap, **When** se revisa, **Then** incluye `/location/`.

---

### Edge Cases

- **H1 de la página**: En el home, "Miami and South Florida" es un subtítulo dentro de la página. En `/location/` ese mismo texto pasa a ser el único H1, sin cambiar sus palabras.
- **Botón "Get a Quote"**: La sección del home no tiene botón de cotización, así que la página tampoco lo agrega dentro del contenido. El visitante puede pedir cotización desde el navbar, como en el resto del sitio, y llamar desde el enlace del teléfono (principio XI).
- **Mapa que no carga**: Si el mapa no se muestra (bloqueado o sin conexión), el texto y el teléfono siguen visibles y la página no queda vacía ni rota.
- **Contenido repetido con el home**: El home conserva su sección "Service Area" sin cambios, así que el mismo texto aparece en dos páginas. Se acepta porque el dueño pidió no agregar contenido nuevo (ver Assumptions).
- **Ancla antigua**: `/#quote` sigue funcionando porque el home no cambia; solo deja de usarse en el enlace "Miami".
- **Pantallas angostas**: A 360 px de ancho, el texto, el teléfono y el mapa se ven sin scroll horizontal.

## Requirements *(mandatory)*

### Functional Requirements

**Página**

- **FR-001**: El sitio MUST tener una página nueva de Miami en `/location/`, en la raíz y con barra final, igual que las páginas de Moving (`/local-moving/`, etc.).
- **FR-002**: La página MUST mostrar el mismo contenido que la sección "Service Area" del home, sin añadir ni quitar texto: el rótulo "Service Area", el título "Miami and South Florida", el párrafo, el punto "Crews based in Miami", el enlace "Questions? Call" con el teléfono y el mapa de Miami con su texto alternativo.
- **FR-003**: El título "Miami and South Florida" MUST ser el único H1 de la página.
- **FR-004**: El teléfono MUST salir de la fuente única de datos del negocio, para mantener el NAP consistente (principio VII).
- **FR-005**: La página MUST NOT agregar contenido nuevo: ni secciones, ni textos, ni imágenes, ni botones que no estén en la sección "Service Area" del home.

**Navegación**

- **FR-006**: El enlace "Miami" del menú "Locations" MUST llevar a `/location/` en el navbar (escritorio y móvil) y en el footer.
- **FR-007**: Los enlaces de los menús Moving, Services y Company, el home y el diseño del navbar MUST NOT cambiar.

**SEO de la página (principio VI)**

- **FR-008**: La página MUST tener un título y una meta description propios, únicos en todo el sitio, escritos a partir de lo que dice la sección (Miami, Miami-Dade, Broward y Florida) y sin datos nuevos.
- **FR-009**: La página MUST tener una URL canónica y una entrada en el sitemap.
- **FR-010**: La página MUST tener el schema de MovingCompany con datos que coincidan con lo visible en ella (nombre, teléfono y zona de servicio), sin dirección, precios, calificaciones ni reseñas.
- **FR-011**: Ningún enlace de la página ni del menú modificado MUST llevar a un 404 (principio IV).
- **FR-012**: Todo el contenido visible, el título y la meta description MUST estar en inglés.

### Key Entities

- **Página de ubicación**: Una ciudad de servicio con su nombre, URL, título, meta description y el contenido de la zona de servicio (texto, mapa y teléfono).
- **Enlace del menú "Locations"**: Etiqueta y destino, compartidos por navbar y footer.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los 2 enlaces "Miami" (navbar y footer) llevan a `/location/`, y 0 llevan a `/#quote`.
- **SC-002**: El texto visible de `/location/` coincide palabra por palabra con el de la sección "Service Area" del home: 0 frases añadidas y 0 quitadas.
- **SC-003**: Desde `/location/`, un visitante en un teléfono puede iniciar una llamada con 1 toque.
- **SC-004**: La página tiene título y meta description únicos, un solo H1, canónica, entrada en el sitemap y schema coherente con lo visible (5 de 5).
- **SC-005**: 0 enlaces rotos en `/location/` y en los menús.
- **SC-006**: La página cumple Core Web Vitals en verde en móvil: LCP < 2.5 s, INP < 200 ms y CLS < 0.1.
- **SC-007**: El home se ve y funciona igual que antes de la feature.

## Fuera de alcance

- Páginas de otras ciudades.
- Cambios al home, incluida su sección "Service Area".
- Menús Services y Company, y los enlaces del menú Moving.
- Contenido nuevo en la página de Miami: barrios, preguntas frecuentes, reseñas, precios o botones extra.
- Rediseño del navbar o del footer.

## Assumptions

- **URL**: `/location/`, en la raíz como las páginas de Moving (decisión del dueño, ver Clarifications).
- **Enlace principal "Locations"**: Solo cambia el enlace "Miami". El enlace del propio título "Locations" (hoy `/#quote`), si se usa como enlace, queda igual porque el pedido nombra solo "Miami".
- **Título y meta description**: Son el único texto nuevo permitido, porque el dueño lo pidió expresamente. Solo reformulan lo que ya dice la sección.
- **Contenido duplicado**: Repetir la sección del home en `/location/` no va contra las reglas de Google. Es poco texto y la página tiene su propia canónica (principio V).
- **Contenido estático**: La página no necesita interacción en el cliente (principio X).
