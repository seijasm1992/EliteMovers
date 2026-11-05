# Feature Specification: Datos de la empresa coherentes en todo el sitio

**Feature Branch**: `002-consistent-company-data`

**Created**: 2026-11-05

**Status**: Draft

**Input**: Descripción del dueño: el sitio muestra datos de la empresa distintos según la página (Miami y Miami Lakes como sede, "ProElite Movers" y "Pro Elite Movers", el teléfono antiguo 407-984-9218 y una dirección física, aunque no hay oficina abierta al público). Todos los datos deben coincidir con los datos correctos y salir de una sola fuente.

## Clarifications

### Session 2026-11-05

- Q: ¿La regla de "no escribir a mano" alcanza también a las menciones de "ProElite Movers" y "Miami" dentro de textos de marketing, o solo a los datos de identidad y contacto? → A: Solo a los datos de identidad y contacto (nombre como identidad de la empresa, teléfono, enlace de llamada, correo, ubicación y nombre legal). Los textos de marketing que nombran Miami como mercado pueden seguir escritos tal cual.
- Q: ¿Dónde debe mostrarse el correo info@proelitemovers.com, que hoy no aparece en ninguna página? → A: En el pie de página de todas las páginas y también en el bloque de contacto de la página de presupuesto, como enlace que abre el correo.
- Q: ¿La configuración que envía las solicitudes de presupuesto a info@proelitemovers.com también debe tomar el correo de la fuente única? → A: Sí. El valor por defecto en el código sale de la fuente única, y la configuración del despliegue puede seguir cambiando la bandeja que recibe las solicitudes.
- Q: ¿Dónde debe aparecer el nombre legal PROELITE MOVING LLC en el pie de página? → A: Se mantiene "© {año} ProElite Movers. All rights reserved." y se añade una línea aparte: "ProElite Movers is operated by PROELITE MOVING LLC."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cliente que quiere confiar en la empresa y contactarla (Priority: P1)

Como cliente, quiero ver el mismo nombre, teléfono, correo y ciudad en todas las páginas para confiar en la empresa y poder contactarla sin dudas.

**Why this priority**: Datos que cambian de una página a otra restan confianza y pueden mandar al cliente a un teléfono que ya no es de la empresa, con la pérdida directa de la llamada. También lo exige el principio VII de la constitución (NAP coherente).

**Independent Test**: Recorrer todas las páginas publicadas y comprobar que el nombre, el teléfono, el correo y la ciudad que se muestran coinciden con los datos correctos, y pulsar cada enlace de teléfono para ver el número que marca.

**Acceptance Scenarios**:

1. **Given** que visito cualquier página del sitio, **When** reviso los datos de contacto (cabecera, cuerpo y pie de página), **Then** el nombre es "ProElite Movers", el teléfono es +1 (786) 281-7825, el correo es info@proelitemovers.com y la ubicación es "Miami, FL".
2. **Given** que estoy en cualquier página, **When** pulso un enlace o botón de llamada, **Then** el dispositivo marca el +1 (786) 281-7825.
3. **Given** que estoy en el pie de página de cualquier página o en el bloque de contacto de la página de presupuesto, **When** pulso el correo de la empresa y se abre el programa de correo, **Then** el destinatario es info@proelitemovers.com.
4. **Given** que llego al pie de página, **When** lo leo, **Then** veo la línea "ProElite Movers is operated by PROELITE MOVING LLC.", y el nombre legal no aparece en ninguna otra parte del sitio.
5. **Given** que busco dónde está la empresa, **When** reviso cualquier página, **Then** no veo una dirección física ni un enlace a un mapa con dirección; solo "Miami, FL".
6. **Given** que leo la lista de zonas de servicio, **When** aparece Miami Lakes, **Then** se presenta solo como una zona donde se trabaja, nunca como sede u origen de la empresa.

### Edge Cases

- El número antiguo escrito en cualquier formato (407-984-9218, (407) 984-9218, 407.984.9218, 4079849218, +14079849218) cuenta como aparición y debe desaparecer, también dentro de enlaces de llamada que no se ven en pantalla.
- La forma corta "ProElite" sin "Movers" (por ejemplo "Why ProElite" o "ProElite uniform") también es una variante y pasa a "ProElite Movers". La única excepción es el logo, que muestra "ProElite" y "Movers" juntos en dos estilos.
- La marca escrita como "Pro Elite Movers" (con espacio) en textos que no se ven en pantalla, como textos alternativos de imágenes o descripciones de página, también cuenta y debe corregirse.
- Frases que presentan a la empresa como "de Miami Lakes" o "con base en Miami Lakes" (por ejemplo en "Sobre nosotros", insignias o preguntas frecuentes) deben pasar a Miami, FL, aunque Miami Lakes siga en la lista de zonas de servicio.
- Si en el futuro cambia un dato (por ejemplo, el teléfono), basta con cambiarlo en la fuente única para que cambie en todo el sitio, incluidos los enlaces de llamada.
- El mapa de la zona de servicio a nivel de ciudad (Miami, FL, sin dirección) no es un mapa de la dirección física y puede quedarse.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sitio MUST mostrar la marca solo como "ProElite Movers", en todas las páginas y en todos los textos, visibles o no (títulos, textos alternativos, descripciones).
- **FR-002**: El sitio MUST mostrar el nombre legal "PROELITE MOVING LLC" únicamente en el pie de página, en una línea propia: "ProElite Movers is operated by PROELITE MOVING LLC." La línea de copyright se mantiene con la marca: "© {año} ProElite Movers. All rights reserved." Ambas líneas toman la marca y el nombre legal de la fuente única.
- **FR-003**: Todo teléfono mostrado MUST ser +1 (786) 281-7825, y todo enlace o botón de llamada MUST marcar ese número.
- **FR-004**: Todo correo de la empresa mostrado o enlazado MUST ser info@proelitemovers.com. El correo MUST mostrarse como enlace que abre el programa de correo en el pie de página de todas las páginas y en el bloque de contacto de la página de presupuesto.
- **FR-005**: La ubicación pública de la empresa MUST ser "Miami, FL", sin calle, número ni código postal.
- **FR-006**: El sitio MUST NOT mostrar la dirección física "1050 SW 70th Ave" ni ninguna otra, ni el enlace al mapa que apuntaba a ella.
- **FR-007**: Miami Lakes MAY aparecer solo como zona de servicio; MUST NOT aparecer como sede, base u origen de la empresa.
- **FR-008**: Los datos de la empresa (marca, nombre legal, teléfono y su enlace de llamada, correo y ubicación pública) MUST salir de una sola fuente: `src/data/site.ts`, por decisión del dueño.
- **FR-009**: Ningún otro archivo MUST repetir escritos a mano el teléfono, el enlace de llamada, el correo, el nombre de la empresa ni la ubicación pública cuando se usan como datos de identidad o contacto (pie de página, bloques de contacto, enlaces de llamada y de correo, insignias de ubicación, frases que dicen dónde está la empresa); deben tomarse de la fuente única. Los textos de marketing que nombran Miami como mercado (por ejemplo "Miami Movers Who Come Prepared" o "Miami and South Florida") pueden seguir escritos tal cual, siempre que la marca aparezca como "ProElite Movers".
- **FR-009a**: El destino por defecto de las solicitudes de presupuesto MUST ser el correo de la fuente única, sin escribirlo a mano en el código. La configuración del despliegue MAY indicar otra bandeja de destino y, si lo hace, tiene prioridad; esa configuración no cuenta como repetición a efectos de FR-009.
- **FR-010**: El sitio MUST NOT contener el teléfono antiguo 407-984-9218 en ninguna de sus variantes de formato.
- **FR-011**: El texto visible MUST seguir en inglés y con el tono de la constitución; este cambio no añade páginas, secciones ni funciones nuevas.

### Key Entities

- **Datos de la empresa**: marca (ProElite Movers), nombre legal (PROELITE MOVING LLC), teléfono para mostrar (+1 (786) 281-7825), destino de llamada (+17862817825), correo (info@proelitemovers.com) y ubicación pública (Miami, FL). Viven en un solo lugar y el resto del sitio los consulta.
- **Zona de servicio**: lugar donde la empresa trabaja (por ejemplo, Miami Lakes, Hialeah, Doral). No es la sede.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las páginas publicadas muestran la misma marca, teléfono, correo y ubicación, iguales a los datos correctos.
- **SC-002**: Una búsqueda en el código del sitio y en las páginas generadas devuelve 0 apariciones de 407-984-9218 (en cualquier formato), de "1050 SW 70th Ave" y de "Pro Elite Movers".
- **SC-003**: 0 frases presentan Miami Lakes como sede; Miami Lakes solo aparece en listas o frases de zonas de servicio.
- **SC-004**: El 100 % de los enlaces y botones de llamada marcan el +1 (786) 281-7825 al pulsarlos en un móvil.
- **SC-005**: El nombre legal aparece exactamente en un lugar por página: el pie de página.
- **SC-006**: Cambiar un dato de la empresa en la fuente única lo cambia en todas las páginas sin tocar ningún otro archivo.
- **SC-007**: El sitio se genera sin errores y ninguna página ni enlace queda roto tras quitar la dirección y su mapa.

## Assumptions

- Los datos correctos son los que dio el dueño en esta especificación; no hace falta confirmarlos de nuevo.
- La fuente única `src/data/site.ts` ya existe y se reutiliza; no se crean otras fuentes ni se añaden dependencias.
- El mapa embebido de la sección de presupuesto apunta a "Miami, FL" a nivel de ciudad, sin dirección, y se mantiene; lo que se retira es el enlace al mapa de la dirección física (pie de página y página de presupuesto).
- En el pie de página y en la página de presupuesto, donde estaba la dirección se muestra "Miami, FL" como texto, sin enlace.
- Miami Lakes se mantiene en la lista de zonas de servicio de "Sobre nosotros" y de las preguntas frecuentes.
- Alinear el perfil de Google Business Profile (empresa sin dirección pública, con zona de servicio) es tarea del dueño fuera del sitio.
- Fuera de alcance: imágenes, WhatsApp, licencias, seguros, reseñas, schema y SEO. El principio VI de la constitución pide schema MovingCompany en cada página; hoy no existe y queda para otra especificación. Las descripciones de página que mencionan Miami Lakes como sede sí se corrigen, porque es un dato de la empresa, no un cambio de SEO.
