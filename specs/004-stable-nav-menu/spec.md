# Feature Specification: Menú de navegación estable y botón Call Now destacado

**Feature Branch**: `004-stable-nav-menu`

**Created**: 2026-11-06

**Status**: Draft

**Input**: Descripción del dueño: los menús desplegables del navbar (Moving, Locations, Services y Company) fallan al pasar el cursor. Se abren y se cierran solos, desaparecen o no dan tiempo para elegir una opción. Company es donde más ocurre. Además, el botón Call Now pierde visibilidad al hacer scroll. Corregir los cuatro menús de escritorio para cursor, toque y teclado, revisar que el menú móvil siga funcionando, y mostrar Call Now siempre en el amarillo de la marca. Fuera de alcance: cambiar los destinos de los enlaces, crear páginas nuevas y cambiar el teléfono.

## Clarifications

### Session 2026-11-06

- Q: ¿Qué debe hacer el botón principal de cada menú (Moving, Locations, Services, Company) al hacer clic o tocarlo? → A: Con ratón, el clic lleva al destino actual del botón. En táctil, el primer toque abre el menú y un segundo toque sobre el botón lleva a su destino; el menú se cierra tocando fuera o abriendo otro menú.
- Q: ¿Qué debe pasar al pulsar Enter o Espacio sobre el botón principal de un menú? → A: Con el menú cerrado, Enter o Espacio lo abre. Con el menú abierto, Enter lleva al destino del botón y Espacio lo cierra. Escape lo cierra y devuelve el foco al botón.
- Q: Cuando se abre un menú desplegable en escritorio, ¿el resto de la página debe oscurecerse? → A: Sí, se mantiene el oscurecimiento actual, pero rozarlo con el cursor no cierra el menú; se cierra con las reglas normales (margen de cierre al salir, clic o toque fuera).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Abrir un menú con el cursor y llegar a sus opciones (Priority: P1)

Como visitante en computadora, quiero abrir un menú y llegar a sus opciones sin que se cierre, para encontrar la página que busco.

**Why this priority**: Hoy los menús se cierran solos antes de que el visitante pueda elegir una opción, sobre todo Company. Es el fallo más visible y bloquea la navegación principal del sitio en escritorio.

**Independent Test**: En una computadora con ratón, pasar el cursor por cada uno de los cuatro menús, bajar hasta su última opción y hacer clic en ella; también salir del menú un instante y volver. Se prueba sin tocar el comportamiento táctil, de teclado ni el botón Call Now.

**Acceptance Scenarios**:

1. **Given** que paso el cursor sobre Company, **When** bajo hacia sus opciones, **Then** el menú sigue abierto hasta que hago clic en una opción o salgo de él.
2. **Given** que un menú está abierto, **When** el cursor cruza el espacio entre el botón del menú y su panel de opciones, **Then** el menú no se cierra.
3. **Given** que salgo del menú por accidente, **When** vuelvo enseguida (antes del margen de cierre), **Then** el menú sigue abierto y no ha parpadeado.
4. **Given** que salgo del menú y no vuelvo, **When** pasa el margen de cierre, **Then** el menú se cierra.
5. **Given** que Moving está abierto, **When** paso el cursor a Services, **Then** solo queda abierto Services, sin que ninguno de los dos parpadee ni se vean ambos a la vez.
6. **Given** que un menú está abierto, **When** hago clic en una de sus opciones, **Then** llego al destino de esa opción y el menú se cierra.

---

### User Story 2 - Abrir y cerrar menús con toque o teclado de forma predecible (Priority: P1)

Como visitante en tableta, móvil o con teclado, quiero abrir y cerrar los menús de forma predecible.

**Why this priority**: Los visitantes con pantalla táctil grande o que navegan con teclado no tienen cursor sobre el que basar la apertura. Si el menú solo responde al cursor, no pueden llegar a las opciones, y el sitio queda inaccesible para ellos.

**Independent Test**: En una tableta en horizontal (donde se ve el menú de escritorio), tocar cada menú para abrirlo y cerrarlo; en el menú móvil, abrir y cerrar cada sección; con solo el teclado, recorrer los cuatro menús, abrirlos, elegir una opción y cerrarlos con Escape.

**Acceptance Scenarios**:

1. **Given** que estoy en una pantalla táctil con el menú de escritorio visible, **When** toco un menú, **Then** se abre sin llevarme a otra página.
2. **Given** que un menú está abierto en una pantalla táctil, **When** toco fuera de él, **Then** se cierra.
3. **Given** que un menú está abierto en una pantalla táctil, **When** toco de nuevo su botón principal, **Then** llego al destino actual de ese botón.
4. **Given** que un menú está abierto en una pantalla táctil, **When** toco otro menú, **Then** se cierra el primero y se abre el segundo.
5. **Given** que el foco de teclado está en el botón de un menú cerrado, **When** pulso Enter o Espacio, **Then** el menú se abre y puedo avanzar por sus opciones con Tab.
6. **Given** que el menú está abierto y el foco está en su botón, **When** pulso Enter, **Then** llego al destino actual del botón; **When** pulso Espacio, **Then** el menú se cierra.
7. **Given** que un menú está abierto con el teclado, **When** pulso Escape, **Then** el menú se cierra y el foco vuelve al botón de ese menú.
8. **Given** que el foco está en la última opción de un menú, **When** pulso Tab, **Then** el menú se cierra y el foco pasa al siguiente elemento del navbar.
9. **Given** que uso un lector de pantalla, **When** llego al botón de un menú o lo abro o cierro, **Then** el lector anuncia que tiene un submenú y si está abierto o cerrado.
10. **Given** que estoy en un móvil, **When** abro el menú móvil y toco una sección, **Then** sus opciones se despliegan, puedo tocar cualquiera de ellas, y el menú móvil se cierra como hoy.

---

### User Story 3 - Ver Call Now siempre destacado (Priority: P2)

Como visitante, quiero ver el botón Call Now siempre destacado para llamar fácilmente.

**Why this priority**: La llamada es una de las formas principales de contacto, pero el fallo no impide llamar: el botón sigue ahí, solo pierde contraste al hacer scroll. Por eso va después de los menús.

**Independent Test**: En escritorio, mirar el botón Call Now arriba de la página, hacer scroll hacia abajo y volver arriba; comprobar que el color no cambia y que el texto se lee bien. Llegar al botón con Tab y comprobar que el foco se ve.

**Acceptance Scenarios**:

1. **Given** que estoy arriba de la página, **When** miro el navbar, **Then** Call Now se ve con el amarillo de la marca.
2. **Given** que hago scroll hacia abajo o hacia arriba, **When** miro el navbar, **Then** Call Now mantiene el mismo amarillo y el mismo color de texto que arriba de la página.
3. **Given** que llego a Call Now con el teclado, **When** tiene el foco, **Then** se ve un indicador de foco claramente distinguible sobre el fondo del navbar.
4. **Given** que paso el cursor sobre Call Now, **When** cambia su estado, **Then** sigue siendo amarillo y su texto sigue siendo legible.

---

### Edge Cases

- El cursor pasa en diagonal desde el botón de un menú hacia una opción lejana y roza brevemente el botón de un menú vecino: el menú que se está usando no debe cerrarse por un roce de menos del margen de cierre.
- La ventana es estrecha y el panel de opciones quedaría cortado en el borde de la pantalla: todas las opciones deben seguir visibles y alcanzables.
- La página tiene scroll cuando se abre un menú, o el visitante hace scroll con el menú abierto: el menú no debe quedarse flotando separado de su botón.
- Un dispositivo admite tanto ratón como toque (por ejemplo, un portátil con pantalla táctil): el visitante puede usar cualquiera de los dos y el menú se comporta como se espera para cada uno.
- El visitante cambia el tamaño de la ventana entre la vista de escritorio y la móvil con un menú abierto: no deben quedar menús abiertos ni capas oscurecidas sin cerrar.
- El visitante abre un menú con el teclado y luego mueve el cursor: no deben quedar dos menús abiertos a la vez.
- El visitante tiene activada la preferencia de reducir movimiento: los menús se abren y cierran sin animaciones de desplazamiento.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Los cuatro menús desplegables de escritorio (Moving, Locations, Services y Company) MUST comportarse igual entre sí.
- **FR-002**: Un menú MUST permanecer abierto mientras el cursor esté sobre su botón, sobre su panel de opciones o sobre el espacio entre ambos.
- **FR-003**: Cuando el cursor sale del menú, este MUST cerrarse solo después de un margen corto (alrededor de 300 ms); si el cursor vuelve dentro de ese margen, el menú MUST seguir abierto sin parpadear.
- **FR-004**: Solo MUST haber un menú desplegable abierto a la vez; al abrir otro, el anterior MUST cerrarse de inmediato, sin margen y sin que se vean ambos superpuestos.
- **FR-004a**: Mientras un menú de escritorio está abierto, el resto de la página MUST verse ligeramente oscurecido, como hoy; ese oscurecimiento MUST NOT cerrar el menú solo porque el cursor pase por encima, pero un clic o toque sobre él MUST cerrarlo, y MUST desaparecer en cuanto se cierra el menú.
- **FR-005**: En pantallas táctiles con el menú de escritorio visible, el primer toque sobre el botón de un menú cerrado MUST abrirlo sin navegar; un segundo toque sobre el botón con el menú abierto MUST llevar a su destino actual; tocar fuera o abrir otro menú MUST cerrarlo.
- **FR-005a**: Con ratón, hacer clic en el botón principal de un menú MUST llevar a su destino actual.
- **FR-006**: Con el teclado, Enter o Espacio sobre el botón de un menú cerrado MUST abrirlo; con el menú abierto, Enter MUST llevar al destino actual del botón y Espacio MUST cerrarlo; Escape MUST cerrarlo y devolver el foco a su botón; salir del menú con Tab MUST cerrarlo.
- **FR-007**: Recibir el foco por sí solo MUST NOT abrir un menú, para que quien navega con Tab pueda pasar de largo sin abrir cada uno.
- **FR-008**: Cada botón de menú MUST anunciar a los lectores de pantalla que controla un submenú y si este está abierto o cerrado, y el estado anunciado MUST coincidir siempre con lo que se ve.
- **FR-009**: Hacer clic en una opción de un menú MUST llevar a su destino actual y cerrar el menú.
- **FR-010**: Los destinos que hoy tiene el botón principal de cada menú MUST seguir siendo alcanzables con ratón, toque y teclado, sin cambiar a dónde llevan.
- **FR-011**: El menú móvil MUST seguir funcionando como hoy: se abre y se cierra, sus secciones se despliegan al tocarlas, todas sus opciones se pueden tocar, se cierra con Escape y con el botón de cerrar, y conserva el botón para llamar.
- **FR-012**: El botón Call Now del navbar MUST usar siempre el amarillo de la marca, tanto arriba de la página como después de hacer scroll y al pasar el cursor.
- **FR-013**: El texto de Call Now (la etiqueta y el teléfono) MUST tener un contraste mínimo de 4.5:1 con su fondo amarillo (WCAG 2.1 AA).
- **FR-014**: Call Now MUST mostrar un indicador de foco visible con teclado, con un contraste mínimo de 3:1 frente a los colores que lo rodean.
- **FR-015**: Los destinos de los enlaces, el número de teléfono y el conjunto de páginas MUST quedar sin cambios.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En las versiones actuales de Chrome, Safari y Firefox de escritorio, cada uno de los cuatro menús se abre con el cursor y se puede hacer clic en el 100 % de sus opciones sin que el menú se cierre solo.
- **SC-002**: En pruebas manuales repetidas (al menos 10 veces por menú), un menú no se cierra nunca mientras el cursor va de su botón a cualquiera de sus opciones.
- **SC-003**: Al pasar el cursor de un menú a otro, en ningún momento se ven dos menús abiertos a la vez.
- **SC-004**: En una tableta y en un móvil, cada menú se abre y se cierra al tocar en el 100 % de los intentos, y se puede llegar a todas sus opciones.
- **SC-005**: Solo con el teclado, un visitante puede abrir los cuatro menús, llegar a todas sus opciones y cerrarlos con Escape, sin quedar atrapado en ningún punto.
- **SC-006**: Con un lector de pantalla, el estado abierto o cerrado anunciado coincide con lo visible en el 100 % de los casos probados.
- **SC-007**: Call Now tiene el mismo color de fondo y de texto arriba de la página y después de hacer scroll, y su texto alcanza un contraste de al menos 4.5:1.

## Assumptions

- "Escritorio" es el ancho en el que hoy se muestran los cuatro menús en el navbar; por debajo de ese ancho se usa el menú móvil y el comportamiento que ya tiene se mantiene.
- El margen de cierre es de unos 300 ms: suficiente para perdonar una salida accidental y lo bastante corto para que el menú no parezca atascado.
- Un dispositivo con ratón y pantalla táctil a la vez aplica la regla del tipo de entrada usado en cada momento: clic con ratón navega; toque con el dedo abre primero.
- El amarillo de la marca es el color amarillo ya definido en el sitio para Call Now arriba de la página; el texto oscuro de la marca que hoy usa sobre ese amarillo se mantiene si cumple el contraste.
- El cambio afecta solo al navbar compartido por todas las páginas; no cambia el contenido de las páginas ni otros botones de llamada fuera del navbar.
- No se añaden dependencias nuevas; el navbar ya es una parte interactiva del sitio y se corrige donde está.
