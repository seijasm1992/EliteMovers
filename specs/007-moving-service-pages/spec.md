# Feature Specification: Páginas propias para cada servicio del menú "Moving"

**Feature Branch**: `007-moving-service-pages`

**Created**: 2026-11-07

**Status**: Draft (alcance reducido el 2026-11-07)

**Input**: Descripción del dueño: crear una página para cada enlace del menú "Moving" (Local Moving, Long Distance Moving, Office Moving, Commercial Moving, Small Moves, Large Moves), que presente el servicio y lleve al visitante a pedir una cotización. Los datos del negocio salen solo del sitio actual o del dueño; si falta un dato, se marca como pendiente. Cada página tiene contenido propio. Los enlaces del menú "Moving" en navbar y footer llevan a su página. Fuera de alcance: menús Services, Locations y Company, cambios al home y rediseño del navbar.

**Cambio de alcance (2026-11-07)**: La primera versión pedía 8 secciones por página. El dueño la redujo a 2: encabezado y "Qué incluye". Las otras 6 secciones pasan a [Fuera de alcance](#fuera-de-alcance).

## Clarifications

### Session 2026-11-07

- Q: ¿Formato de URL, `/moving/local-moving/` o `/local-moving/`? → A: `/local-moving/`, en la raíz, igual que `/about-us/` y `/get-a-quote/`.
- Q: ¿Qué ve el visitante en la sección de reseñas mientras no haya reseñas reales? → A: La sección se oculta hasta que el dueño proporcione reseñas reales. *(Ya no aplica: la sección de reseñas quedó fuera de alcance.)*
- Q: ¿Cuáles son la tarifa y los mínimos? → A (dueño): USD 135 por hora, mínimo de 4 horas. Incluye camión, 2 ayudantes, moving pads sobre los muebles durante la mudanza, plastic wrap y las herramientas necesarias. Cada ayudante adicional cuesta USD 40. Es el precio base para Miami-Dade y Broward hasta Pompano Beach; más lejos se cotiza por mensaje o llamada.
- Q: ¿La calificación "4.9 / Based on 500+ reviews" y las reseñas son reales? → A (dueño): No las tenemos. Se quitan del sitio hasta tenerlas. El dato guardado en el contenido del home (no se mostraba en ninguna página) se eliminó el 2026-11-07.
- Q: ¿Se publica la tarifa de USD 135 por hora? → A (dueño): No, solo se da al cotizar.
- Q: ¿Los USD 40 del ayudante adicional son por hora o un cargo fijo? → A (dueño): Por hora. Tampoco se publica.
- Q: ¿Qué secciones lleva cada página? → A (dueño): Solo 2. (1) Encabezado: nombre del servicio, un párrafo propio de 2 a 3 frases, foto, botón "Get a Quote" a `/get-a-quote/` y botón "Call Now". (2) Qué incluye: de 3 a 5 puntos. Proceso, precios, garantías, reseñas, preguntas frecuentes, enlaces a otros servicios y llamado final quedan fuera de alcance.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante que conoce un servicio y pide cotización (Priority: P1)

Como persona que planea una mudanza en Miami, quiero abrir la página del tipo de mudanza que necesito, entender en pocas líneas de qué se trata y qué incluye, y pedir una cotización o llamar sin buscar más.

**Why this priority**: Es el objetivo del negocio: convertir visitas en cotizaciones. Hoy los enlaces solo llevan a una sección general del home.

**Independent Test**: Abrir cualquiera de las 6 páginas en un teléfono y comprobar que tiene exactamente 2 secciones (encabezado y "Qué incluye"), que "Get a Quote" lleva a `/get-a-quote/` y que "Call Now" abre la llamada al teléfono del negocio.

**Acceptance Scenarios**:

1. **Given** un visitante en la página de Local Moving, **When** la carga, **Then** ve en el encabezado, sin desplazarse, el nombre del servicio, un párrafo de 2 a 3 frases y los botones "Get a Quote" y "Call Now". La foto del servicio está en el mismo encabezado.
2. **Given** un visitante en cualquiera de las 6 páginas, **When** recorre la página, **Then** encuentra solo el encabezado y, debajo, la sección "Qué incluye" con 3 a 5 puntos.
3. **Given** un visitante en el encabezado, **When** pulsa "Get a Quote", **Then** llega a `/get-a-quote/`; **When** pulsa "Call Now", **Then** se abre la llamada al teléfono del negocio.

---

### User Story 2 - Visitante que llega desde el menú (Priority: P1)

Como visitante, quiero que cada enlace del menú "Moving", en el navbar y en el footer, me lleve a la página de ese servicio y no a una sección del home.

**Why this priority**: Sin el cambio de enlaces las páginas nuevas no se encuentran, y hoy cuatro enlaces distintos llevan al mismo lugar.

**Independent Test**: Pulsar los 6 enlaces del menú "Moving" en el navbar (escritorio y móvil) y en el footer y comprobar que cada uno abre su página.

**Acceptance Scenarios**:

1. **Given** el navbar en cualquier página del sitio, **When** el visitante pulsa "Office Moving", **Then** llega a la página de Office Moving.
2. **Given** el footer, **When** el visitante pulsa cualquiera de los 6 enlaces de "Moving", **Then** llega a la misma página que el enlace equivalente del navbar.
3. **Given** los menús Services, Locations y Company, **When** se revisan, **Then** sus enlaces no cambiaron.

---

### User Story 3 - Visitante que compara tipos de mudanza (Priority: P2)

Como visitante que no sabe qué tipo de mudanza le corresponde (por ejemplo, Small Moves o Local Moving), quiero leer en cada página un texto distinto que me ayude a reconocer si ese servicio es para mí.

**Why this priority**: Ayuda a elegir el servicio correcto y evita páginas repetidas que no aportan nada ni a las personas ni a la búsqueda orgánica.

**Independent Test**: Leer las 6 páginas y comprobar que el párrafo del encabezado y los puntos de "Qué incluye" tratan las particularidades de cada servicio.

**Acceptance Scenarios**:

1. **Given** las páginas de Office Moving y Commercial Moving, **When** se comparan, **Then** cada una trata situaciones distintas (por ejemplo, estaciones de trabajo y equipos de oficina frente a locales comerciales, almacenes y mercancía).
2. **Given** las páginas de Small Moves y Large Moves, **When** se comparan, **Then** el párrafo y los puntos describen tamaños de mudanza distintos, no el mismo texto con otro nombre.

---

### Edge Cases

- **Dato pendiente**: Ningún marcador de "pendiente" ni texto de relleno (por ejemplo, `{{RATE}}` o "TBD") se muestra al visitante. Una frase que depende de un dato pendiente se omite hasta que el dueño lo confirme, y queda registrada en la lista de pendientes.
- **Montos y calificaciones**: Ninguna página muestra montos en dólares, estrellas, promedios ni cantidades de reseñas, y el schema tampoco los incluye. Los montos se dan solo al cotizar (aclaración del dueño) y todavía no hay reseñas ni calificaciones reales.
- **Licencia en Florida**: Ninguna página afirma que la empresa tenga licencia mientras el dueño no confirme el número.
- **Mudanzas fuera de Florida**: Si el texto de Long Distance Moving menciona el alcance, dice que el equipo propio hace mudanzas dentro de Florida y que las mudanzas entre estados se coordinan con un socio de la red de referidos, como ya dice el sitio.
- **Office y Commercial comparten tarjeta en el home**: Ambos enlaces llevan hoy al mismo ancla. Cada uno pasa a tener su página propia con contenido distinto.
- **URL antigua o ancla del home**: Las anclas del home (`/#residential-moving`, `/#long-distance-moving`, `/#business-moving`) siguen funcionando porque el home no cambia; solo dejan de usarse en el menú "Moving".
- **Navegación móvil**: Los enlaces nuevos funcionan igual en el menú móvil sin cambiar su diseño.
- **Pantallas angostas**: A 360 px de ancho, el nombre, el párrafo y los dos botones se ven sin desplazarse y sin scroll horizontal.

## Requirements *(mandatory)*

### Functional Requirements

**Páginas y estructura**

- **FR-001**: El sitio MUST tener 6 páginas nuevas, una por servicio: Local Moving, Long Distance Moving, Office Moving, Commercial Moving, Small Moves y Large Moves.
- **FR-002**: Las URLs de las páginas MUST estar en la raíz del sitio, con barra final: `/local-moving/`, `/long-distance-moving/`, `/office-moving/`, `/commercial-moving/`, `/small-moves/` y `/large-moves/`.
- **FR-003**: Cada página MUST mostrar solo estas 2 secciones, en este orden:
  1. **Encabezado**: el nombre del servicio como único H1, un párrafo propio de 2 a 3 frases, una foto del servicio, un botón "Get a Quote" que lleva a `/get-a-quote/` y un botón "Call Now" que llama al teléfono del negocio.
  2. **Qué incluye**: de 3 a 5 puntos sobre lo que incluye ese tipo de mudanza.
- **FR-004**: El botón "Call Now" MUST usar el teléfono de la fuente única de datos del negocio, para mantener el NAP consistente (principio VII).
- **FR-005**: Las páginas MUST NOT incluir ninguna de las secciones listadas en [Fuera de alcance](#fuera-de-alcance).

**Contenido**

- **FR-006**: Todo dato del negocio que aparezca en el párrafo o en "Qué incluye" (credenciales, cifras, condiciones de servicio) MUST salir solo del sitio actual o de lo que proporcione el dueño. Nunca se inventa.
- **FR-007**: Cada dato del negocio que falte MUST quedar marcado como pendiente en una lista de pendientes de la feature, y MUST NOT mostrarse al visitante como marcador o texto de relleno.
- **FR-008**: El párrafo del encabezado y los puntos de "Qué incluye" MUST ser propios de cada servicio. No se acepta el mismo texto cambiando solo el nombre del servicio.
- **FR-009**: Las páginas MUST NOT mostrar montos en dólares, calificaciones, estrellas ni número de reseñas.
- **FR-010**: Los datos ya publicados en el sitio que se pueden reutilizar en el párrafo o en "Qué incluye" incluyen: cobro solo por hora; camión, 2 ayudantes, moving pads, plastic wrap y herramientas incluidos; se pueden sumar ayudantes; desarmado y armado de muebles estándar; protección de pisos, paredes y puertas; equipo con verificación de antecedentes y uniforme; mudanzas largas dentro de Florida con equipo propio y entre estados con un socio de referidos; horarios fuera de oficina y fines de semana para mudanzas de negocios; mudanza por fases para negocios.
- **FR-011**: Todo el contenido visible MUST estar en inglés, con un tono natural y escrito para personas de Miami y el sur de Florida.
- **FR-012**: La foto de cada página MUST ser una foto real ya existente en el sitio, con texto alternativo, y MUST NOT ser generada.

**Navegación**

- **FR-013**: Los 6 enlaces del menú "Moving" MUST llevar a su página correspondiente, tanto en el navbar (escritorio y móvil) como en el footer.
- **FR-014**: Los enlaces de los menús Services, Locations y Company, el home y el diseño del navbar MUST NOT cambiar.

**SEO por página (principio VI)**

- **FR-015**: Cada página MUST tener un título y una meta description únicos en todo el sitio.
- **FR-016**: Cada página MUST tener una URL canónica y una entrada en el sitemap.
- **FR-017**: Cada página MUST tener el schema de MovingCompany con datos que coincidan con lo visible en esa página, sin dirección, precios, calificaciones ni reseñas.
- **FR-018**: Ningún enlace, botón o imagen de las 6 páginas MUST llevar a un 404 (principio IV).

### Key Entities

- **Página de servicio**: Un tipo de mudanza con su nombre, URL, título, meta description, párrafo del encabezado, foto con texto alternativo y lista de 3 a 5 puntos de lo que incluye.
- **Dato del negocio**: Un valor factual (credencial, cifra, condición de servicio) con su estado: confirmado (con su fuente: sitio actual o dueño) o pendiente.
- **Enlace del menú "Moving"**: Etiqueta y destino, compartidos por navbar y footer.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los 6 enlaces del menú "Moving" en navbar y footer (12 enlaces en total) llevan a 6 páginas distintas, y 0 de ellos llevan a un ancla del home.
- **SC-002**: Las 6 páginas tienen exactamente 2 secciones, encabezado y "Qué incluye", en ese orden (6 de 6). El párrafo tiene de 2 a 3 frases y "Qué incluye" tiene de 3 a 5 puntos.
- **SC-003**: Desde cualquier página, un visitante en un teléfono puede llegar al formulario de cotización o iniciar una llamada con 1 toque desde el encabezado, sin desplazarse.
- **SC-004**: 0 datos del negocio sin fuente en las 6 páginas; cada dato faltante aparece en la lista de pendientes, y 0 marcadores de pendiente son visibles para el visitante.
- **SC-005**: Ningún par de páginas comparte un párrafo o un punto de "Qué incluye" idéntico o que solo cambie el nombre del servicio.
- **SC-006**: Las 6 páginas tienen título y meta description únicos, un solo H1, canónica, entrada en el sitemap y schema coherente con lo visible (6 de 6).
- **SC-007**: 0 enlaces rotos en las 6 páginas y en los menús modificados.
- **SC-008**: Las 6 páginas cumplen Core Web Vitals en verde en móvil: LCP < 2.5 s, INP < 200 ms y CLS < 0.1.

## Fuera de alcance

**Secciones de las páginas de servicio** (retiradas el 2026-11-07; pueden volver en una feature futura):

- Cómo funciona el proceso, de la cotización al día de la mudanza.
- Cómo se cobra: tarifa por hora, mínimo de 4 horas, qué incluye la tarifa, área del precio base y confirmación por escrito. Los datos de tarifa que dio el dueño quedan registrados en [Clarifications](#clarifications) para usarlos si la sección vuelve.
- Garantías: protección de muebles y propiedad, equipo con verificación de antecedentes, y licencia y seguro en Florida.
- Reseñas de clientes.
- Preguntas frecuentes propias de cada servicio, y su schema FAQPage.
- Enlaces a los otros tipos de mudanza.
- Llamado final a cotizar al pie de la página.

**Otras partes del sitio**:

- Menús Services, Locations y Company.
- Cambios al home.
- Rediseño del navbar.

## Assumptions

- **Diferencia entre Small Moves y Large Moves**: Small Moves cubre estudios, apartamentos de 1 habitación y traslados de pocos muebles; Large Moves cubre casas y apartamentos de 3 o más habitaciones. El dueño puede ajustar estos límites.
- **Diferencia entre Local Moving y Small/Large Moves**: Local Moving se define por la distancia (dentro de Miami-Dade y Broward, el área base del sitio); Small y Large Moves se definen por el tamaño, sin importar si son locales.
- **Diferencia entre Office Moving y Commercial Moving**: Office Moving trata oficinas, estaciones de trabajo, archivos y equipos de TI; Commercial Moving trata locales comerciales, tiendas, almacenes y otros espacios comerciales.
- **Datos pendientes** (a confirmar por el dueño): número de licencia o registro de mudanzas en Florida; detalles del seguro más allá de "general liability"; textos de reseñas reales con su fuente. Con el alcance reducido ninguno hace falta para publicar, pero se mantienen registrados.
- **Botón "Get a Quote"**: Lleva a la página de cotización existente, `/get-a-quote/`, sin cambiarla.
- **Contenido estático**: Las páginas no necesitan interacción en el cliente (principio X).
