# Feature Specification: Páginas informativas para cada servicio del menú "Services"

**Feature Branch**: `010-service-info-pages`

**Created**: 2026-11-07

**Status**: Draft

**Input**: Descripción del dueño: crear una página informativa para cada servicio del menú "Services" (Packing Services, Installation, High-Value Items, Furniture Protection, Move Coordination) que explique brevemente cómo lo manejamos y genere confianza, sin ser una página de venta directa. Cada página tiene solo 3 secciones: encabezado sin botones, "Cómo lo hacemos" en 3 pasos y una línea de cierre con enlace a `/get-a-quote/`. El contenido sale solo de lo que ya dice el sitio. Los 5 enlaces del menú "Services" en navbar y footer llevan a su página y se elimina "Storage Solutions". URLs en la raíz. Fuera de alcance: precios, reseñas, preguntas frecuentes, "qué incluye", botones de Get a Quote o Call Now, cambios al home y a los demás menús.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitante que quiere saber cómo manejamos un servicio (Priority: P1)

Como persona que planea una mudanza en Miami y tiene una necesidad concreta (empacar, instalar, proteger muebles, mover artículos de valor o coordinar todo), quiero abrir la página de ese servicio y entender en menos de un minuto cómo lo maneja el equipo, para confiar en la empresa antes de pedir una cotización.

**Why this priority**: Es el valor principal de la feature: generar confianza explicando el trabajo real. Hoy los 5 enlaces llevan al mismo acordeón del home y no explican nada propio de cada servicio.

**Independent Test**: Abrir cualquiera de las 5 páginas en un teléfono y comprobar que tiene exactamente 3 secciones en orden (encabezado, "Cómo lo hacemos" con 3 pasos, línea de cierre), que no hay botones dentro de la página y que la línea de cierre lleva a `/get-a-quote/`.

**Acceptance Scenarios**:

1. **Given** un visitante en la página de Packing Services, **When** la carga, **Then** ve en el encabezado el nombre del servicio, 2 o 3 frases y una foto, sin ningún botón.
2. **Given** un visitante en cualquiera de las 5 páginas, **When** recorre la página, **Then** encuentra debajo del encabezado una sección "Cómo lo hacemos" con exactamente 3 pasos cortos y, al final, una sola línea de texto con enlace.
3. **Given** un visitante al final de la página de Installation, **When** pulsa el enlace de la línea de cierre (por ejemplo, "Add installation to your quote →"), **Then** llega a `/get-a-quote/`.
4. **Given** un visitante en cualquiera de las 5 páginas, **When** la recorre, **Then** no encuentra precios, montos, reseñas, preguntas frecuentes, listas de "qué incluye" ni botones de "Get a Quote" o "Call Now" dentro del contenido de la página.

---

### User Story 2 - Visitante que llega desde el menú "Services" (Priority: P1)

Como visitante, quiero que cada enlace del menú "Services", en el navbar y en el footer, me lleve a la página de ese servicio, y no ver enlaces a servicios que no tienen página.

**Why this priority**: Sin el cambio de enlaces las páginas no se encuentran. Además, "Storage Solutions" no tiene contenido en el sitio y debe salir del menú.

**Independent Test**: Pulsar los 5 enlaces del menú "Services" en el navbar (escritorio y móvil) y en el footer y comprobar que cada uno abre su página; comprobar que "Storage Solutions" ya no aparece en ninguno de los dos.

**Acceptance Scenarios**:

1. **Given** el navbar en cualquier página del sitio, **When** el visitante abre el menú "Services", **Then** ve exactamente 5 enlaces: Packing Services, Installation, High-Value Items, Furniture Protection y Move Coordination.
2. **Given** el navbar o el footer, **When** el visitante pulsa "Furniture Protection", **Then** llega a la página de Furniture Protection, no a `/#included`.
3. **Given** el navbar y el footer, **When** se revisan, **Then** "Storage Solutions" no aparece en ninguno.
4. **Given** los menús Moving, Locations y Company, **When** se revisan, **Then** sus enlaces no cambiaron.

---

### User Story 3 - Visitante con artículos de alto valor (Priority: P2)

Como persona con muebles finos, obras de arte o equipos pesados, quiero saber qué cuidados concretos tiene el equipo con esos artículos, sin promesas de servicios que la empresa no ofrece.

**Why this priority**: Es la página con más riesgo de prometer de más (cajas a medida, seguro adicional). Un texto honesto genera más confianza y cumple el principio de honestidad.

**Independent Test**: Leer la página de High-Value Items y comprobar que cada cuidado mencionado aparece ya en el sitio, y que no menciona cajas a medida, embalaje especial, seguro adicional ni otros servicios que el sitio no ofrece.

**Acceptance Scenarios**:

1. **Given** la página de High-Value Items, **When** se lee, **Then** los cuidados descritos son solo los que ya aparecen en el sitio: envoltura de muebles, protección de pisos, puertas y esquinas, revisión del trabajo por el equipo antes de cargar, y equipo con verificación de antecedentes.
2. **Given** la página de High-Value Items, **When** se lee, **Then** no menciona cajas a medida, embalaje especial, seguro adicional, valoración de artículos ni mudanza de pianos.

---

### User Story 4 - Visitante que compara servicios (Priority: P3)

Como visitante que abre más de una página de servicio, quiero que cada una diga algo distinto y propio, para no sentir que leo el mismo texto con otro nombre.

**Why this priority**: Evita páginas repetidas que no aportan a las personas ni a la búsqueda orgánica.

**Independent Test**: Comparar las 5 páginas y comprobar que ningún par comparte frases del encabezado, pasos ni línea de cierre idénticos o que solo cambien el nombre del servicio.

**Acceptance Scenarios**:

1. **Given** las páginas de Furniture Protection y High-Value Items, que comparten medidas de protección, **When** se comparan, **Then** cada una tiene su propio enfoque: Furniture Protection trata la protección de muebles y de la casa en toda mudanza; High-Value Items trata cómo se aplican esas medidas a los artículos de valor.
2. **Given** las 5 páginas, **When** se comparan las líneas de cierre, **Then** cada una tiene su propio texto.

---

### Edge Cases

- **Datos que el sitio no tiene**: Si un servicio no tiene suficiente información en el sitio para 3 pasos, el paso se escribe solo con lo que el sitio ya dice; nunca se completa con datos inventados.
- **Seguimiento en vivo**: Si Move Coordination menciona el seguimiento del equipo y el camión, mantiene la condición que ya tiene el sitio: "cuando el servicio está disponible".
- **Mínimo de empaque**: Packing Services puede mencionar el mínimo de tres horas y el horario de uno a dos días antes, porque ya están publicados en el FAQ, pero no muestra montos en dólares.
- **Objetos que no se mudan**: High-Value Items no contradice el FAQ: no promete transportar objetos irreemplazables (el sitio recomienda que el cliente los lleve), materiales peligrosos ni pianos.
- **Seguro**: Ninguna página habla de seguro más allá de lo que ya dice el sitio. High-Value Items no lo menciona.
- **Foto repetida**: Cada página usa una foto distinta de las ya existentes en el proyecto.
- **Ancla del home**: `/#included` sigue funcionando porque el home no cambia; solo deja de usarse en los 5 enlaces del menú.
- **Navegación móvil**: Los enlaces nuevos funcionan igual en el menú móvil, sin cambiar su diseño.
- **Pantallas angostas**: A 360 px de ancho, las 3 secciones se leen sin scroll horizontal.

## Requirements *(mandatory)*

### Functional Requirements

**Páginas y estructura**

- **FR-001**: El sitio MUST tener 5 páginas nuevas, una por servicio: Packing Services, Installation, High-Value Items, Furniture Protection y Move Coordination.
- **FR-002**: Las URLs MUST estar en la raíz del sitio, con barra final, igual que las páginas de Moving: `/packing-services/`, `/installation/`, `/high-value-items/`, `/furniture-protection/` y `/move-coordination/`.
- **FR-003**: Cada página MUST mostrar solo estas 3 secciones, en este orden:
  1. **Encabezado**: el nombre del servicio como único H1, 2 o 3 frases propias y una foto. Sin botones.
  2. **Cómo lo hacemos**: exactamente 3 pasos cortos que explican cómo lo maneja el equipo.
  3. **Cierre**: una sola línea de texto con un enlace a `/get-a-quote/`, con texto propio del servicio (por ejemplo, "Add packing to your quote →"). Se ve como un enlace de texto, no como un botón.
- **FR-004**: El contenido de las páginas MUST NOT incluir botones, secciones de precios, reseñas, preguntas frecuentes, listas de "qué incluye" ni botones de "Get a Quote" o "Call Now". El navbar y el footer del sitio se mantienen como están.

**Contenido**

- **FR-005**: El contenido de Packing Services, Installation, Furniture Protection y Move Coordination MUST salir solo de lo que ya dice el sitio, en las secciones "What's Included" y FAQ del home.
- **FR-006**: High-Value Items MUST describir solo cuidados que ya aparecen en el sitio: envoltura de muebles; protección de pisos, puertas y esquinas; revisión del trabajo por el equipo antes de cargar; y equipo con verificación de antecedentes. MUST NOT agregar servicios que el sitio no ofrece, como cajas a medida o seguro adicional.
- **FR-007**: Ninguna página MUST inventar datos: cifras, plazos, credenciales, materiales o servicios que no aparezcan ya en el sitio.
- **FR-008**: Las frases del encabezado, los 3 pasos y la línea de cierre MUST ser propios de cada página. No se acepta el mismo texto cambiando solo el nombre del servicio.
- **FR-009**: Ninguna página MUST mostrar montos en dólares, calificaciones, estrellas ni número de reseñas.
- **FR-010**: Todo el contenido visible MUST estar en inglés, con tono natural, informativo y no de venta, escrito para personas de Miami y el sur de Florida.
- **FR-011**: La foto de cada página MUST ser una foto real que ya existe en el proyecto, distinta en cada página, con texto alternativo, y MUST NOT ser generada.

**Navegación**

- **FR-012**: Los 5 enlaces del menú "Services" MUST llevar a su página correspondiente, en el navbar (escritorio y móvil) y en el footer.
- **FR-013**: El enlace "Storage Solutions" MUST eliminarse del menú "Services", en el navbar y en el footer.
- **FR-014**: Los enlaces de los menús Moving, Locations y Company, el home y el diseño del navbar MUST NOT cambiar.

**SEO por página (principio VI)**

- **FR-015**: Cada página MUST tener un título y una meta description propios y únicos en todo el sitio.
- **FR-016**: Cada página MUST tener una URL canónica y una entrada en el sitemap.
- **FR-017**: Cada página MUST tener el schema de MovingCompany con datos que coincidan con lo visible, sin dirección, precios, calificaciones ni reseñas, igual que las páginas de Moving.
- **FR-018**: Ningún enlace o imagen de las 5 páginas ni de los menús modificados MUST llevar a un 404 (principio IV).

### Key Entities

- **Página de servicio informativa**: Un servicio con su nombre, URL, título, meta description, 2 o 3 frases del encabezado, foto con texto alternativo, 3 pasos de "Cómo lo hacemos" y una línea de cierre con su texto de enlace.
- **Enlace del menú "Services"**: Etiqueta y destino, compartidos por navbar y footer. Quedan 5.
- **Fuente del contenido**: El texto ya publicado en el sitio ("What's Included", FAQ, garantías y proceso del home) del que sale cada afirmación de las páginas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los 5 enlaces del menú "Services" en navbar y footer (10 enlaces en total) llevan a 5 páginas distintas, y 0 llevan a `/#included`.
- **SC-002**: "Storage Solutions" aparece 0 veces en el navbar y en el footer.
- **SC-003**: Las 5 páginas tienen exactamente 3 secciones en orden (encabezado, "Cómo lo hacemos" con 3 pasos, línea de cierre) y 0 botones dentro del contenido (5 de 5).
- **SC-004**: Cada afirmación de las 5 páginas se puede señalar en un texto ya publicado en el sitio; 0 afirmaciones sin fuente.
- **SC-005**: Ningún par de páginas comparte una frase, un paso o una línea de cierre idénticos o que solo cambien el nombre del servicio.
- **SC-006**: Un visitante puede leer una página completa en menos de 1 minuto y llegar al formulario de cotización con 1 toque desde la línea de cierre.
- **SC-007**: Las 5 páginas tienen título y meta description únicos, un solo H1, canónica, entrada en el sitemap y schema coherente con lo visible (5 de 5).
- **SC-008**: 0 enlaces rotos en las 5 páginas y en los menús modificados.
- **SC-009**: Las 5 páginas cumplen Core Web Vitals en verde en móvil: LCP < 2.5 s, INP < 200 ms y CLS < 0.1.

## Fuera de alcance

- Secciones de precios, reseñas, preguntas frecuentes o "qué incluye" en las páginas de servicio.
- Botones de "Get a Quote" o "Call Now" dentro de las páginas.
- Una página para Storage Solutions.
- Cambios al home, incluida la sección "What's Included" y su ancla `/#included`.
- Cambios a los menús Moving, Locations y Company y rediseño del navbar.

## Assumptions

- **Fuentes por página** (todas ya publicadas en el sitio):
  - **Packing Services**: empaque cobrado por hora con mínimo de tres horas, normalmente uno o dos días antes de la mudanza; cajas y materiales disponibles con el servicio de empaque; mantas de mudanza y envoltura industrial incluidas en todos los trabajos; se puede sumar a la misma reserva.
  - **Installation**: desarmado y armado de muebles estándar (camas, mesas, escritorios, estantes, sofás); desmontaje de TV cuando se muda; montaje en pared como servicio de instalación adicional; armado de muebles y montaje de TV se pueden sumar a la misma reserva.
  - **Furniture Protection**: envoltura de muebles; protección de pisos, marcos de puertas y esquinas; protección de ascensores y pasillos cuando hace falta; protección colocada antes de empezar a cargar.
  - **Move Coordination**: confirmación de la reserva, recordatorios, avisos el día de la mudanza y aviso al terminar; seguimiento del equipo y el camión cuando el servicio está disponible; el equipo llega de 10 a 15 minutos antes, revisa los accesos y planea el orden de carga; varios servicios en una sola reserva.
  - **High-Value Items**: las medidas listadas en FR-006. También puede usar la recomendación del FAQ de avisar al pedir la cotización si hay cajas fuertes, obras de arte o equipos de gimnasio, para asignar el equipo adecuado, porque ya está publicada en el sitio.
- **Alcance de "lo que ya dice el sitio"**: Además de "What's Included" y el FAQ, se pueden usar las secciones de garantías y de proceso del home, porque de ahí salen la verificación de antecedentes y la revisión antes de cargar que el dueño pidió para High-Value Items.
- **Enlace padre "Services"**: La etiqueta "Services" del menú mantiene su destino actual; solo cambian los 5 enlaces hijos.
- **Cotizar o llamar (principio XI)**: El navbar ya ofrece el teléfono y el footer los datos de contacto en todas las páginas, y la línea de cierre lleva a la cotización, así que no hacen falta botones dentro de la página.
- **Formulario de cotización**: `/get-a-quote/` no cambia.
- **Contenido estático**: Las páginas no necesitan interacción en el cliente (principio X).
- **Rama**: No hay hook de creación de rama configurado; la rama `010-service-info-pages` se crea a mano si se quiere seguir el patrón de las features anteriores.
