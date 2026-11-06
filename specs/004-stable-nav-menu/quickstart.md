# Quickstart: verificar el menú de navegación y Call Now

**Feature**: [spec.md](./spec.md) | **Contract**: [contracts/nav-menu-ui.md](./contracts/nav-menu-ui.md)

## Preparación

```powershell
npm install
npm run astro -- check   # sin errores de tipos
npm run build            # la build termina bien
npm run dev              # http://localhost:4321
```

Para probar en una tableta o un móvil real, arranca con `npm run dev -- --host` y abre la URL de red desde el dispositivo, en la misma red local.

Prueba en la página de inicio y en `/about-us/`. Los resultados esperados están en la sección 2 del [contrato](./contracts/nav-menu-ui.md).

## A. Ratón (Chrome, Safari y Firefox de escritorio, ventana ≥ 1024px)

1. Por cada menú (Moving, Locations, Services, Company): pasa el cursor, baja hasta la última opción y haz clic. → Llegas al destino; el menú no se cierra antes. Repite 10 veces con Company (SC-002).
2. Abre Company, sal del panel hacia la página y vuelve en menos de un tercio de segundo. → Sigue abierto, sin parpadeo.
3. Sal y no vuelvas. → Se cierra en unos 300 ms.
4. Pasa de Moving a Services y luego a Company despacio y deprisa. → Nunca hay dos paneles visibles (SC-003).
5. Con un menú abierto, mueve el cursor por la capa oscura y por las franjas laterales del navbar sin salir hacia la página. → No se cierra antes del margen; un clic en la capa lo cierra y no activa nada de debajo.
6. Haz clic en el principal "Moving". → Navega a `/#services`.
7. Safari: en el paso 1, verifica sobre todo que el clic en "About" abre `/about-us/` al primer intento (causa C1 de la [investigación](./research.md)).

## B. Táctil (tableta en horizontal ≥ 1024px, o DevTools con emulación táctil)

1. Toca Company. → Se abre y no navega.
2. Toca otra vez Company. → Navega a `/#guarantee`.
3. Abre Services y toca fuera. → Se cierra.
4. Abre Moving y toca Locations. → Solo queda Locations abierto.
5. Abre un menú y toca una opción. → Navega.

## C. Teclado

1. Recorre el navbar con Tab. → Ningún menú se abre solo y todos los elementos muestran un contorno visible (amarillo; blanco en Call Now).
2. En Moving pulsa Enter. → Se abre. Tab recorre sus opciones.
3. Shift+Tab hasta Moving y pulsa Enter. → Navega a `/#services`.
4. Abre con Espacio y pulsa Espacio otra vez. → Se cierra.
5. Abre Company, tabula hasta una opción y pulsa Escape. → Se cierra y el foco vuelve a "Company".
6. Abre Company y tabula más allá de su última opción. → Se cierra y el foco pasa a Call Now.

## D. Lector de pantalla (VoiceOver en Safari o NVDA en Firefox)

1. Llega a cada principal. → Anuncia "contraído" o "collapsed".
2. Ábrelo con Enter. → Anuncia "expandido" o "expanded". Al cerrarlo, vuelve a "contraído" (SC-006).

## E. Call Now

1. Arriba de la página: amarillo con texto oscuro.
2. Haz scroll hacia abajo y vuelve arriba. → Mismo amarillo y mismo texto en todo momento (SC-007).
3. Hover: amarillo más claro, texto legible.
4. Comprueba el contraste con DevTools (inspector de color) o con un comprobador WCAG: el texto ≥ 4.5:1.

## F. Móvil y cambio de tamaño

1. Ventana < 1024px o un móvil: abre la hamburguesa, despliega cada sección, toca una opción. → Navega y el cajón se cierra.
2. Escape y el botón de cerrar cierran el cajón; el foco vuelve a la hamburguesa. El botón "Call Now" del cajón funciona.
3. Con un menú de escritorio abierto, estrecha la ventana por debajo de 1024px. → No queda ningún panel ni capa visible.
4. Con el cajón abierto, ensancha la ventana por encima de 1024px. → El cajón se cierra y la página se puede desplazar.

## G. Movimiento reducido

Activa "Reducir movimiento" en el sistema operativo y abre un menú. → Aparece sin desplazamiento ni animación.
