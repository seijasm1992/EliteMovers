# Feature Specification: Medición de visitas reales y contactos, filtrando bots

**Feature Branch**: `003-real-visits-contacts`

**Created**: 2026-11-05

**Status**: Draft

**Input**: Descripción del dueño: no sé cuántas personas reales visitan el sitio ni cuántas me contactan. Las estadísticas actuales de Cloudflare cuentan todas las peticiones, incluidos los bots, y no se registran llamadas, clics en WhatsApp ni formularios enviados. Visitas con Cloudflare Web Analytics; contactos (llamada, WhatsApp, formulario enviado) con Cloudflare Zaraz y Google Analytics 4; mantener Turnstile y añadir un campo trampa; documentar Bot Fight Mode; sin datos personales ni secretos en el repositorio.

## Clarifications

### Session 2026-11-05

- Q: Hoy no hay ningún enlace de WhatsApp en el sitio. ¿Qué número se usa y dónde aparece el enlace? → A: No se usa WhatsApp ni Messenger. En EE. UU. lo habitual es el mensaje de texto, que el sitio ya ofrece con un botón de SMS. Los contactos medidos son llamada, mensaje de texto y formulario enviado. (Primero se propuso Messenger y el dueño lo descartó en la misma sesión.)
- Q: ¿Se puede avisar por correo cuando alguien intenta llamar o enviar un mensaje de texto? → A: No se envía un correo por cada pulsación: no aportaría datos del cliente y los bots y toques por error llenarían la bandeja. Se añade el tipo de contacto "mensaje de texto" para el botón de SMS que ya existe, y la guía explica cómo activar alertas por correo en Google Analytics 4. El formulario sigue enviando su correo como hoy.
- Q: ¿Se añade una página de política de privacidad que explique el uso de Google Analytics, Cloudflare y Microsoft Clarity? → A: Sí. Una página sencilla `/privacy-policy` en inglés, enlazada desde el pie de página de todas las páginas, sin aviso de cookies.
- Q: ¿Las estadísticas de contactos deben mostrar de dónde vino la persona? → A: Sí. Cada contacto se puede ver según el origen de la visita (búsqueda orgánica, Google Business Profile/Maps, directo, redes sociales, otros sitios), y Google Business Profile se distingue de la búsqueda normal.
- Q: El ID público de Microsoft Clarity ya está en el repositorio. ¿Choca con la regla de no guardar identificadores? → A: No. La regla cubre claves, tokens e identificadores secretos, y ningún identificador de medición nuevo; el ID de Clarity se mantiene.
- Q: Si un envío llega con el campo trampa relleno, ¿qué ve quien lo envió? → A: El mismo mensaje de error genérico que en otros fallos ("We couldn't send your request. Please call or text us."). No se envía correo ni cuenta como contacto.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - El dueño ve visitas reales y contactos (Priority: P1)

Como dueño, quiero ver cuántas personas reales visitan el sitio y cuántas me contactan, para saber si el SEO está funcionando.

**Why this priority**: Hoy no hay forma de saber si el posicionamiento orgánico trae clientes. Sin separar personas de bots y sin contar contactos, cualquier decisión sobre contenido o SEO se toma a ciegas.

**Independent Test**: Visitar el sitio desde un navegador normal, pulsar un enlace de llamada, pulsar el botón de mensaje de texto y enviar un formulario de presupuesto válido; después comprobar en los paneles de estadísticas que aparecen la visita y los tres contactos, cada uno con la página donde ocurrió.

**Acceptance Scenarios**:

1. **Given** que una persona visita una página, **When** el dueño revisa las estadísticas de visitas, **Then** la visita aparece contada como visita de una persona, separada de las peticiones automáticas de bots.
2. **Given** que una persona pulsa un enlace o botón de llamada, **When** el dueño revisa las estadísticas de contactos, **Then** ve un contacto de tipo "llamada" con la página donde ocurrió.
3. **Given** que una persona pulsa un enlace o botón de mensaje de texto, **When** el dueño revisa las estadísticas de contactos, **Then** ve un contacto de tipo "mensaje de texto" con la página donde ocurrió.
4. **Given** que una persona envía el formulario de presupuesto y el servidor lo acepta, **When** el dueño revisa las estadísticas de contactos, **Then** ve un contacto de tipo "formulario enviado" con la página donde ocurrió.
5. **Given** que una persona envía el formulario y el servidor lo rechaza (datos inválidos, verificación fallida o error de envío), **When** el dueño revisa las estadísticas, **Then** no aparece ningún contacto de tipo "formulario enviado".
6. **Given** que cualquier contacto queda registrado, **When** el dueño revisa sus datos, **Then** no ve nombre, teléfono, correo ni dirección del cliente.

---

### User Story 2 - Los bots no envían formularios ni inflan los contactos (Priority: P2)

Como dueño, quiero que los bots no puedan enviarme formularios ni contar como contactos, para que mi bandeja y mis números reflejen solo clientes reales.

**Why this priority**: Un contacto falso es tan dañino para la medición como un contacto perdido, y el correo basura cuesta tiempo. Depende de la historia 1 para que el efecto sea visible en las estadísticas.

**Independent Test**: Enviar el formulario con el campo trampa relleno y, por separado, sin una verificación válida; comprobar que no llega ningún correo y que no aparece ningún contacto de tipo "formulario enviado".

**Acceptance Scenarios**:

1. **Given** que un bot envía el formulario sin superar la verificación de seguridad, **When** el servidor lo procesa, **Then** no se envía el correo y no cuenta como contacto.
2. **Given** que un envío llega con el campo trampa relleno, **When** el servidor lo procesa, **Then** no se envía el correo y no cuenta como contacto.
3. **Given** que una persona real rellena el formulario normalmente, **When** lo envía, **Then** no ve el campo trampa, no tiene que hacer nada distinto a hoy y su solicitud se envía.

---

### User Story 3 - El dueño activa la protección contra bots sin romper el sitio (Priority: P3)

Como dueño, quiero instrucciones para activar la protección contra bots de Cloudflare sin bloquear el formulario ni a Google, para reducir el tráfico automático sin perder clientes ni posicionamiento.

**Why this priority**: Reduce el ruido y la carga, pero el sitio ya funciona sin ella; el riesgo de bloquear a Google o el formulario exige hacerlo con instrucciones claras.

**Independent Test**: Seguir la guía paso a paso, activar la protección y comprobar que el sitio carga, que el formulario se envía y que Google puede rastrear las páginas.

**Acceptance Scenarios**:

1. **Given** que el dueño sigue la guía, **When** activa la protección contra bots, **Then** el sitio sigue cargando para visitantes reales y el formulario se sigue enviando.
2. **Given** que la protección está activa, **When** el dueño comprueba en Google Search Console que Google puede acceder a una página, **Then** la prueba es correcta y no hay bloqueo.
3. **Given** que la protección rompe algo, **When** el dueño sigue la sección de vuelta atrás de la guía, **Then** puede desactivarla y el sitio vuelve a funcionar como antes.

---

### Edge Cases

- Una persona pulsa varias veces el mismo enlace de llamada o de mensaje de texto: cada pulsación cuenta como un contacto; el dueño interpreta los números como intenciones de contacto, no como llamadas completadas.
- Una persona pulsa el enlace de llamada en un ordenador sin teléfono: igualmente cuenta como intento de llamada.
- Un navegador con bloqueador de anuncios o rastreo impide el registro: la visita o el contacto puede no contarse; el sitio y el formulario deben seguir funcionando igual.
- El formulario recibe respuesta de aceptación pero la persona cierra la página enseguida: el contacto debe registrarse igualmente si el servidor lo aceptó.
- Un gestor de contraseñas o el autocompletado del navegador rellena el campo trampa: el campo debe estar fuera del alcance del autocompletado y de la navegación con teclado y lectores de pantalla para que no ocurra.
- El formulario se reintenta tras un error y luego se acepta: cuenta un único contacto, el del envío aceptado.
- Visitas del propio dueño o de pruebas: cuentan como visitas normales; filtrarlas no forma parte de esta especificación.
- La medición no está configurada en el panel (por ejemplo, en desarrollo local o antes de activarla): el sitio funciona igual y no muestra errores al visitante.

## Requirements *(mandatory)*

### Functional Requirements

**Visitas**

- **FR-001**: Las visitas de personas MUST medirse con Cloudflare Web Analytics, que las separa de las peticiones automáticas de bots.
- **FR-002**: La medición de visitas MUST cubrir todas las páginas publicadas.

**Contactos**

- **FR-003**: El sitio MUST registrar tres tipos de contacto: "llamada" (pulsar cualquier enlace o botón de llamada), "mensaje de texto" (pulsar cualquier enlace o botón de SMS, como el de la sección de contacto) y "formulario enviado".
- **FR-004**: Cada contacto MUST registrarse a través de Cloudflare Zaraz y llegar a Google Analytics 4 como evento con nombre propio por tipo.
- **FR-005**: Cada contacto MUST incluir la página donde ocurrió.
- **FR-005a**: El dueño MUST poder ver los contactos de cada tipo según el origen de la visita: búsqueda orgánica, Google Business Profile/Maps, directo, redes sociales y otros sitios. El origen se obtiene de la visita, nunca de datos del cliente.
- **FR-005b**: Las visitas que llegan desde el enlace al sitio web del perfil de Google Business Profile MUST distinguirse de la búsqueda orgánica normal. La guía del dueño MUST explicar cómo etiquetar ese enlace en el perfil para lograrlo.
- **FR-006**: El contacto "formulario enviado" MUST registrarse solo cuando el servidor confirma que aceptó la solicitud y envió el correo; nunca al pulsar el botón ni ante un rechazo o error.
- **FR-007**: El canal de mensajes es el mensaje de texto (SMS). Esta especificación MUST NOT añadir enlaces ni eventos de WhatsApp ni de Messenger.
- **FR-008**: Los enlaces y botones de llamada y de mensaje de texto existentes MUST seguir usando el mismo número y comportándose igual para el visitante.
- **FR-008a**: El sitio MUST NOT enviar un correo por cada pulsación de llamada o de mensaje de texto. El único correo por contacto sigue siendo el del formulario aceptado.
- **FR-008b**: La guía del dueño MUST explicar cómo crear alertas por correo en Google Analytics 4 sobre los contactos (por ejemplo, un aviso si un día no hay ningún contacto o hay más de lo normal), sin añadir código al sitio.

**Protección contra bots**

- **FR-009**: El formulario MUST mantener la verificación de seguridad actual (Turnstile); un envío que no la supera MUST NOT enviar correo ni contar como contacto.
- **FR-010**: El formulario MUST incluir un campo trampa invisible para las personas, que no se pueda alcanzar con el teclado, que los lectores de pantalla ignoren y que el navegador no autocomplete.
- **FR-011**: Si el campo trampa llega relleno, el servidor MUST NOT enviar el correo y la respuesta MUST NOT contar como contacto aceptado. Quien lo envió MUST ver el mismo mensaje de error genérico que en los demás fallos ("We couldn't send your request. Please call or text us."), sin indicar el motivo.
- **FR-012**: El repositorio MUST incluir una guía para el dueño que explique cómo activar Bot Fight Mode en el plan gratuito de Cloudflare, cómo comprobar después que el formulario sigue funcionando y que Google puede rastrear el sitio, y cómo desactivarlo si algo falla.

**Privacidad y secretos**

- **FR-013**: Ningún registro de visitas ni de contactos MUST incluir el nombre, teléfono, correo, dirección ni otros datos escritos por el cliente en el formulario.
- **FR-013a**: El sitio MUST tener una página de política de privacidad en `/privacy-policy`, en inglés y con el tono de la constitución. Debe explicar qué se mide (visitas y pulsaciones de contacto), con qué servicios (Cloudflare Web Analytics, Cloudflare Zaraz, Google Analytics 4 y Microsoft Clarity), que los datos escritos en el formulario solo se usan para responder la solicitud y no van a las estadísticas, y cómo contactar a la empresa con dudas usando los datos de la fuente única.
- **FR-013b**: El pie de página de todas las páginas MUST enlazar a la política de privacidad.
- **FR-013c**: La página de política de privacidad MUST cumplir el principio VI de la constitución: título y meta descripción únicos, un solo H1, URL canónica, entrada en el sitemap y schema MovingCompany coherente con lo visible si las demás páginas ya lo tienen.
- **FR-014**: El repositorio MUST NOT contener claves, tokens ni identificadores secretos, y esta especificación MUST NOT añadir ningún identificador de medición nuevo (por ejemplo, el ID de GA4 o el token de Web Analytics). La configuración nueva vive en los paneles de Cloudflare y Google o en variables del entorno de despliegue. El ID público de Microsoft Clarity que ya existe se mantiene.

**Restricciones del proyecto**

- **FR-015**: La medición MUST NOT empeorar la velocidad del sitio por debajo de los límites de la constitución (LCP < 2.5 s, INP < 200 ms, CLS < 0.1 en móvil).
- **FR-016**: Si el cambio añade algún texto visible (por ejemplo, un mensaje de error del formulario), MUST estar en inglés y con el tono de la constitución.

### Key Entities

- **Visita**: carga de una página por una persona. Atributos: página, fecha. Sin datos personales.
- **Contacto**: intención de contacto de una persona. Atributos: tipo (llamada, mensaje de texto, formulario enviado), página donde ocurrió, origen de la visita (búsqueda orgánica, Google Business Profile/Maps, directo, redes sociales, otros sitios), fecha. Sin datos personales.
- **Envío rechazado**: envío del formulario que no supera la verificación o tiene el campo trampa relleno. No genera correo ni contacto.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una visita de prueba desde un navegador normal aparece en las estadísticas de visitas en menos de 24 horas.
- **SC-002**: Una pulsación de llamada, una de mensaje de texto y un formulario de prueba aceptado aparecen como tres eventos distintos en Google Analytics 4, cada uno con su página, en la vista en tiempo real.
- **SC-003**: El 100 % de los envíos de prueba con el campo trampa relleno o sin verificación válida no generan correo ni evento de formulario enviado.
- **SC-004**: El 100 % de los envíos de prueba rechazados por el servidor no generan evento de formulario enviado.
- **SC-005**: Ningún evento registrado contiene nombre, teléfono, correo ni dirección del cliente al revisarlo en Google Analytics 4.
- **SC-006**: Una búsqueda en el repositorio devuelve 0 claves, tokens o identificadores secretos, y 0 identificadores de medición nuevos; el único identificador de medición presente es el ID público de Clarity que ya existía.
- **SC-007**: Tras activar Bot Fight Mode siguiendo la guía, el sitio carga, un formulario de prueba se envía y la inspección de URL de Google Search Console muestra la página accesible.
- **SC-008**: Las métricas de velocidad en móvil siguen dentro de los límites de la constitución después del cambio.
- **SC-009**: Siguiendo la guía, el dueño crea al menos una alerta de Google Analytics 4 sobre los contactos y la recibe en su correo.
- **SC-010**: El 100 % de las páginas enlazan desde el pie de página a `/privacy-policy`, que carga sin errores y aparece en el sitemap.
- **SC-011**: Un contacto de prueba hecho tras llegar desde una búsqueda en Google aparece como orgánico, y otro hecho tras entrar por el enlace de Google Business Profile aparece como Google Business Profile, en los informes de Google Analytics 4.

## Assumptions

- El dominio ya está en Cloudflare con el proxy activado, lo que permite activar Web Analytics, Zaraz y Bot Fight Mode desde el panel en el plan gratuito.
- El dueño crea la propiedad de Google Analytics 4 y conecta su identificador en Zaraz desde el panel; ese identificador no se guarda en el repositorio.
- Microsoft Clarity, añadido en la especificación anterior, se mantiene sin cambios.
- Los visitantes son de Estados Unidos (Miami / South Florida) y no se añade un aviso de cookies; si el dueño lo necesita, será otra especificación.
- "La página donde ocurrió" es la ruta de la página (por ejemplo, `/get-a-quote`), sin parámetros que puedan contener datos personales.
- Los contactos cuentan intenciones (pulsaciones), no llamadas ni conversaciones completadas.
- El mensaje de texto es el canal de mensajes principal porque funciona en cualquier móvil sin cuenta ni app. WhatsApp podría tener sentido más adelante por la clientela hispana de Miami; si el dueño lo quiere, irá en otra especificación y se comparará con estas estadísticas.
- Fuera de alcance: WhatsApp, Messenger, bloquear países, planes de pago de Cloudflare, paneles propios, filtrar el tráfico del dueño y medir conversiones fuera del sitio (llamadas recibidas, ventas).
