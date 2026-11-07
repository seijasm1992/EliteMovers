# Feature Specification: Páginas propias para "Licenses & Credentials" y "FAQ" del menú "Company"

**Feature Branch**: `009-company-info-pages`

**Created**: 2026-11-07

**Status**: Draft

**Input**: Descripción del dueño: crear páginas propias para "Licenses & Credentials" y "FAQ" del menú "Company", para que el visitante encuentre esa información directamente y Google pueda indexarla. Licenses & Credentials usa el contenido actual de la sección "The Elite Guarantee" del home y la mención "Licensed and insured in Florida" del footer; si falta el número de licencia o de registro, no se inventa y se marca como pendiente. FAQ usa todas las preguntas actuales de la sección FAQ del home, con sus mismas categorías. En ambas páginas, los enlaces del navbar y del footer llevan a su página en vez de a `/#guarantee` y `/#faq`; la URL sigue la misma estructura que las páginas de Moving; cada una tiene su propio título y meta description; no se agrega contenido nuevo. Fuera de alcance: la página About Us, cambios al home y los menús Services y Locations.

## Clarifications

### Session 2026-11-07

- Q: ¿Qué página lleva el schema FAQPage? → A: Se queda solo en el home. La página `/faq/` no lo lleva, y el home no cambia.
- Q: ¿A dónde lleva el enlace principal "Company" del navbar, que hoy apunta a `/#guarantee`? → A: A `/about-us/`.
- Q: ¿Qué contenido lleva cada página? → A (dueño): Exactamente el mismo contenido que su sección del home, sin agregar ni quitar nada. Licenses & Credentials suma además la mención "Licensed and insured in Florida" del footer, como pedía la descripción original. Los supuestos de la spec quedan confirmados.
- Q: ¿Qué texto es el H1 de cada página, y se agrega un encabezado propio con botones? → A: No hay encabezado nuevo. El H1 es el título actual de la sección ("The Elite Guarantee" y "Questions & Answers"). Para cotizar o llamar se usa el "Call Now" del navbar.
- Q: ¿Dónde aparece "Licensed and insured in Florida" en la página Licenses & Credentials? → A: Debajo del subtítulo de la sección, antes de las 3 garantías.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante que busca respuestas antes de contratar (Priority: P1)

Como persona que evalúa una mudanza en Miami, quiero abrir una página de preguntas frecuentes y leer todas las respuestas, agrupadas por tema, sin tener que buscarlas dentro del home.

**Why this priority**: Las preguntas frecuentes resuelven las dudas que frenan una cotización (cobro, depósito, horarios, seguro). Hoy solo existen como una sección del home, y solo la primera categoría está en la página al cargar, por lo que Google no ve el resto de las respuestas.

**Independent Test**: Abrir la página FAQ y comprobar que muestra las 20 preguntas actuales con sus respuestas, en las mismas 5 categorías del home, y que el texto de todas las respuestas está en la página al cargarla, sin depender de pulsar filtros.

**Acceptance Scenarios**:

1. **Given** un visitante en la página FAQ, **When** la carga, **Then** ve "Questions & Answers" como único H1 y las preguntas agrupadas en las categorías Pricing & Billing, Scheduling, Services & Coverage, Insurance & Damage y Preparing for Your Move, en ese orden.
2. **Given** la página FAQ, **When** se compara con la sección FAQ del home, **Then** contiene las mismas 20 preguntas con el mismo texto de pregunta y respuesta, cada una en su misma categoría.
3. **Given** la página FAQ cargada sin interacción, **When** se revisa su contenido (como lo haría un buscador), **Then** el texto de las 20 respuestas está presente.

---

### User Story 2 - Visitante que quiere saber si la empresa es confiable (Priority: P1)

Como visitante, quiero una página de "Licenses & Credentials" que reúna lo que la empresa garantiza y su situación de licencia y seguro, para decidir si confío en ella.

**Why this priority**: La confianza es decisiva al contratar una mudanza. Hoy el enlace lleva a una sección del home que no se puede compartir ni encontrar en Google como página propia.

**Independent Test**: Abrir la página y comprobar que muestra el contenido de "The Elite Guarantee" (subtítulo y las 3 garantías) y la mención "Licensed and insured in Florida", sin número de licencia inventado ni marcador de pendiente visible.

**Acceptance Scenarios**:

1. **Given** un visitante en la página Licenses & Credentials, **When** la carga, **Then** ve "The Elite Guarantee" como único H1, el subtítulo, la mención "Licensed and insured in Florida" debajo del subtítulo y, después, las 3 garantías actuales: Honest Hourly Rate, Furniture and Property Protection y Background-Checked Crew, con su mismo texto.
2. **Given** que el dueño no ha confirmado el número de licencia o registro, **When** el visitante recorre la página, **Then** no ve ningún número de licencia ni texto de relleno como "TBD" o "Pending".
3. **Given** que el dueño confirma más adelante el número, **When** se publique, **Then** se agrega a esta página sin cambiar su estructura.

---

### User Story 3 - Visitante que llega desde el menú "Company" (Priority: P1)

Como visitante, quiero que los enlaces "Licenses & Credentials" y "FAQ" del menú "Company", en el navbar y en el footer, me lleven a su página y no a una sección del home.

**Why this priority**: Sin el cambio de enlaces las páginas nuevas no se encuentran.

**Independent Test**: Pulsar "Licenses & Credentials" y "FAQ" en el navbar (escritorio y móvil) y en el footer, desde el home y desde otra página, y comprobar que cada uno abre su página.

**Acceptance Scenarios**:

1. **Given** el navbar en cualquier página, **When** el visitante pulsa "FAQ", **Then** llega a la página FAQ.
2. **Given** el footer, **When** el visitante pulsa "Licenses & Credentials", **Then** llega a la misma página que el enlace equivalente del navbar.
3. **Given** el enlace "About" y los menús Moving, Locations y Services, **When** se revisan, **Then** no cambiaron.

---

### Edge Cases

- **Número de licencia faltante**: Ni el número de licencia ni el de registro aparecen en la página mientras el dueño no los confirme. Quedan en la lista de pendientes de la feature y ningún marcador es visible para el visitante.
- **Contenido nuevo**: Ninguna de las dos páginas agrega afirmaciones, cifras, preguntas, encabezados ni botones que no estén hoy en el sitio. Solo se agregan el título y la meta description de cada página.
- **Datos que cambian en el home**: Si una pregunta frecuente o una garantía se edita, el home y la página nueva muestran el mismo texto, sin copias que se desincronicen.
- **Anclas del home**: `/#guarantee` y `/#faq` siguen funcionando porque el home no cambia; solo dejan de usarse en los enlaces "Licenses & Credentials" y "FAQ".
- **Contenido duplicado**: Las respuestas aparecen en el home y en la página FAQ. El schema FAQPage queda solo en el home, para no marcar dos veces el mismo contenido (FR-013).
- **Navegación móvil**: Los enlaces nuevos funcionan igual en el menú móvil, sin cambiar su diseño.
- **Pantallas angostas**: A 360 px de ancho, ambas páginas se leen sin scroll horizontal y el "Call Now" del navbar sigue visible (principio XI).

## Requirements *(mandatory)*

### Functional Requirements

**Páginas y URLs**

- **FR-001**: El sitio MUST tener 2 páginas nuevas: Licenses & Credentials y FAQ.
- **FR-002**: Las URLs MUST estar en la raíz del sitio, con barra final, como las páginas de Moving: `/licenses-and-credentials/` y `/faq/`.
- **FR-003**: Cada página MUST tener un único H1, que es el título actual de su sección del home: "The Elite Guarantee" en Licenses & Credentials y "Questions & Answers" en FAQ. Las páginas MUST NOT tener un encabezado propio aparte de la sección. El nombre "Licenses & Credentials" o "FAQ" va en el título y la meta description de cada página (FR-014).

**Licenses & Credentials**

- **FR-004**: La página MUST mostrar exactamente el contenido actual de la sección "The Elite Guarantee" del home, sin agregar ni quitar nada: el antetítulo "Why ProElite Movers", el título "The Elite Guarantee", el subtítulo y las 3 garantías (Honest Hourly Rate, Furniture and Property Protection, Background-Checked Crew) con su título y su descripción.
- **FR-005**: La página MUST mostrar la mención "Licensed and insured in Florida", con el mismo texto que usa hoy el footer, debajo del subtítulo de la sección y antes de las 3 garantías.
- **FR-006**: El número de licencia o de registro de mudanzas en Florida MUST NOT inventarse. Mientras falte, MUST quedar en la lista de pendientes de la feature y MUST NOT mostrarse al visitante, ni como dato ni como marcador.

**FAQ**

- **FR-007**: La página MUST mostrar exactamente el contenido actual de la sección FAQ del home, sin agregar ni quitar nada: el antetítulo "FAQs", el título "Questions & Answers" y las 20 preguntas con el mismo texto de pregunta y respuesta.
- **FR-008**: Las preguntas MUST agruparse en las mismas 5 categorías del home y en el mismo orden: Pricing & Billing, Scheduling, Services & Coverage, Insurance & Damage y Preparing for Your Move.
- **FR-009**: El texto de todas las preguntas y respuestas MUST estar en el contenido de la página al cargarla, sin depender de que el visitante pulse un filtro o abra una pregunta.

**Contenido de ambas páginas**

- **FR-010**: Ninguna de las dos páginas MUST agregar contenido nuevo. El contenido sale de una sola fuente compartida con el home, de modo que un cambio en el home se refleje en la página nueva.
- **FR-011**: Todo el contenido visible MUST estar en inglés (principio de idioma de la constitución).
- **FR-012**: La forma de llamar en cada página MUST ser el botón "Call Now" del navbar, que ya aparece en todas las páginas, también en móvil (principio XI). Las páginas MUST NOT agregar botones propios de cotizar o llamar. Los que ya trae la sección del home se mantienen; por ejemplo, la franja "Need help with your move?" con el botón "Request a Quote" al final de la FAQ.

**SEO por página (principios V y VI)**

- **FR-013**: La página `/faq/` MUST NOT incluir el schema FAQPage. El schema se queda solo en el home, sin cambios, para que el contenido repetido quede marcado una sola vez, como piden las guías de Google.
- **FR-014**: Cada página MUST tener un título y una meta description únicos en todo el sitio.
- **FR-015**: Cada página MUST tener una URL canónica y una entrada en el sitemap.
- **FR-016**: Cada página MUST tener el schema de MovingCompany con datos que coincidan con lo visible en esa página, sin número de licencia, precios, calificaciones ni reseñas.
- **FR-017**: Ningún enlace, botón o imagen de las 2 páginas MUST llevar a un 404 (principio IV).

**Navegación**

- **FR-018**: Los enlaces "Licenses & Credentials" y "FAQ" del menú "Company" MUST llevar a su página en el navbar (escritorio y móvil) y en el footer.
- **FR-019**: El enlace principal "Company" del navbar, que hoy lleva a `/#guarantee`, MUST llevar a `/about-us/`.
- **FR-020**: El enlace "About", los menús Moving, Locations y Services, el home y el diseño del navbar MUST NOT cambiar.

### Key Entities

- **Página de la empresa**: Nombre, URL, título, meta description, H1 y el contenido que muestra (garantías y mención de licencia, o preguntas frecuentes).
- **Garantía**: Título y descripción, compartidos por el home y la página Licenses & Credentials.
- **Pregunta frecuente**: Categoría, pregunta y respuesta, compartidas por el home y la página FAQ.
- **Dato del negocio**: Valor factual (por ejemplo, el número de licencia) con su estado: confirmado, con su fuente, o pendiente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los enlaces "Licenses & Credentials" y "FAQ" en navbar y footer (4 enlaces en total, más el menú móvil) llevan a sus 2 páginas, y 0 de ellos llevan a un ancla del home.
- **SC-002**: La página FAQ contiene 20 de 20 preguntas del home, en 5 de 5 categorías, y el texto de las 20 respuestas está presente al cargar la página sin interacción.
- **SC-003**: La página Licenses & Credentials muestra 3 de 3 garantías y la mención "Licensed and insured in Florida", con 0 números de licencia inventados y 0 marcadores de pendiente visibles.
- **SC-004**: 0 frases nuevas y 0 frases omitidas respecto de las secciones del home, fuera del título, la meta description y la mención del footer en Licenses & Credentials. 0 encabezados o botones propios de la página.
- **SC-009**: El schema FAQPage aparece en 1 sola página del sitio (el home), y el enlace principal "Company" lleva a `/about-us/`.
- **SC-005**: Las 2 páginas tienen título y meta description únicos, un solo H1, canónica, entrada en el sitemap y schema coherente con lo visible (2 de 2).
- **SC-006**: Desde cualquiera de las 2 páginas, un visitante en un teléfono inicia una llamada con 1 toque en el "Call Now" del navbar.
- **SC-007**: 0 enlaces rotos en las 2 páginas y en los menús modificados.
- **SC-008**: Las 2 páginas cumplen Core Web Vitals en verde en móvil: LCP < 2.5 s, INP < 200 ms y CLS < 0.1.

## Fuera de alcance

- La página About Us y su enlace.
- Cambios al home, incluidas sus secciones "The Elite Guarantee" y FAQ.
- Menús Moving, Services y Locations.
- Rediseño del navbar o del footer.
- Preguntas, garantías o credenciales nuevas.

## Assumptions

- **URLs**: `/licenses-and-credentials/` y `/faq/`, en la raíz como `/local-moving/` (decisión de la spec 007). Se escribe "and" en lugar de "&" para que la URL sea legible.
- **Fuente de la mención de licencia**: "Licensed and insured in Florida" ya se publica en el footer de todas las páginas, por lo que se considera contenido existente. Los detalles del seguro y el número de licencia siguen pendientes, como en la spec 007.
- **Datos pendientes** (a confirmar por el dueño): número de licencia o de registro de mudanzas en Florida.
- **Comportamiento de la FAQ**: La página puede mantener los filtros por categoría del home siempre que el texto de todas las respuestas esté en la página al cargarla (FR-009).
- **Contenido estático**: Las páginas no necesitan interacción en el cliente salvo, si se mantienen, los filtros de la FAQ (principio X).
